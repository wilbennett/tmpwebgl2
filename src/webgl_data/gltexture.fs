module GlTexture

open Browser.Types
open Fable.Core
open Wil.Core.Utils
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.DataTypes
open Wil.Webgl.Data

type TextureDataInfo = {
  Width: float
  Height: float
  InternalFormat: GlInternalColorFormat
  Format: GlColorFormat
  DataType: GlTextureType
  Data: JS.TypedArray
}

// let emptyTextureData = {
//     Width = 1.0
//     Height = 1.0
//     Format = GlColorFormat.RGBA
//     DataType = GlTextureType.UNSIGNED_BYTE
//     Data = uint8Array [| 255; 0; 0; 255 |]
//   }
let emptyTextureData = {
    Width = 2.0
    Height = 2.0
    InternalFormat = GlInternalColorFormat.RGBA
    Format = GlColorFormat.RGBA
    DataType = GlTextureType.UNSIGNED_BYTE
    Data = uint8Array [|
      255;   0;   0; 255;     0; 255;   0; 255;
        0;   0; 255; 255;   255; 255;   0; 255;
    |]
  }

let emptyTexture (parent: GlObjData) =
  let gl = parent.Scene.Canvas.Context
  let empty = emptyTextureData

  {
    Id = 0
    Name = ""
    IsDirty = true
    Target = GlTextureTarget.TEXTURE_2D
    TextureId = gl.createTexture()
    Index = -1
    Level = 0
    InternalFormat = empty.InternalFormat
    Width = empty.Width
    Height = empty.Height
    Format = empty.Format
    DataType = empty.DataType
    Pixels = PixelData empty.Data
    Offset = 0
    GenerateMipMap = true
    MagFilter = Some GlMagFilter.NEAREST
    MinFilter = Some GlMinFilter.NEAREST
    WrapS = None //GlWrapMode.REPEAT
    WrapT = None //GlWrapMode.REPEAT
    WrapR = None //GlWrapMode.REPEAT
    BaseLevel = None
    CompareFunc = None //GlCompareFunc.LEQUAL
    CompareMode = None //GlCompareMode.NONE
    MaxLevel = None
    MaxLod = None
    MinLod = None
    ParentObject = parent
    Link = None
    LinkedChildren = []
  }

let private addLinkedChild (parent: GlTextureData) (data: GlTextureData) =
  parent.LinkedChildren <- data :: parent.LinkedChildren
  data

let private linkTo (parent: GlTextureData) (data: GlTextureData) =
  {
    data with
      Link = Some parent
      Pixels = PixelData emptyTextureData.Data
  }
  |> addLinkedChild parent

let private processLink name (data: GlTextureData) =
  let (objectName, textureName) = GlCommon.splitName name
  let globj = data.ParentObject.Scene |> GlCommon.getObject objectName
  let texture = globj |> GlCommon.getTexture textureName
  linkTo texture data

let apply props (data: GlTextureData) =
  let rec loop props (data: GlTextureData) =
    match props with
    | [] -> data
    | h::t ->
        match h with
        | TextureName x -> loop t { data with Name = x }
        | TextureTarget x -> loop t { data with Target = x }
        | TextureIndex x -> loop t { data with Index = x }
        | Level x -> loop t { data with Level = x }
        | InternalFormat x -> loop t { data with InternalFormat = x }
        | TextureWidth x -> loop t { data with Width = x }
        | TextureHeight x -> loop t { data with Height = x }
        | Format x -> loop t { data with Format = x }
        | TextureDataType x -> loop t { data with DataType = x }
        | Pixels x -> loop t { data with Pixels = x }
        | ByteOffset x -> loop t { data with Offset = x }
        | NoMipMap -> loop t { data with GenerateMipMap = false }
        | MagFilter x -> loop t { data with MagFilter = Some x }
        | MinFilter x -> loop t { data with MinFilter = Some x }
        | WrapS x -> loop t { data with WrapS = Some x }
        | WrapT x -> loop t { data with WrapT = Some x }
        | WrapR x -> loop t { data with WrapR = Some x }
        | BaseLevel x -> loop t { data with BaseLevel = Some x }
        | CompareFunc x -> loop t { data with CompareFunc = Some x }
        | CompareMode x -> loop t { data with CompareMode = Some x }
        | MaxLevel x -> loop t { data with MaxLevel = Some x }
        | MaxLod x -> loop t { data with MaxLod = Some x }
        | MinLod x -> loop t { data with MinLod = Some x }
        | TextureLink x -> loop t (processLink x data)
  loop props data

let create props parentObject =
  {
    emptyTexture parentObject with
      Index = GlCommon.nextTextureIndex parentObject
  }
  |> apply props

let delete (data: GlTextureData) =
  let gl = data.ParentObject.Scene.Canvas.Context
  gl.deleteTexture data.TextureId

let clean (data: GlTextureData) =
  data.IsDirty <- false

let dirty (data: GlTextureData) =
  data.IsDirty <- true
  GlCommon.dirtyObject data.ParentObject

let dirtyLinkedChildren (data: GlTextureData) =
  data.LinkedChildren |> List.iter dirty

let private activateTexture (vdata: GlTextureData) (data: GlTextureData) =
  let gl = data.ParentObject.Scene.Canvas.Context

  let inline setParameteri param value =
    match value with
    | Some value -> texParameteri vdata.Target param (float value) gl
    | None -> ()

  let inline setParameterf param value =
    match value with
    | Some value -> texParameterf vdata.Target param (float value) gl
    | None -> ()

  setParameteri GlTextureParam.TEXTURE_MIN_FILTER data.MinFilter
  setParameteri GlTextureParam.TEXTURE_MAG_FILTER data.MagFilter
  setParameteri GlTextureParam.TEXTURE_WRAP_S data.WrapS
  setParameteri GlTextureParam.TEXTURE_WRAP_T data.WrapT
  setParameteri GlTextureParam.TEXTURE_WRAP_R data.WrapR
  setParameteri GlTextureParam.TEXTURE_BASE_LEVEL data.BaseLevel
  setParameteri GlTextureParam.TEXTURE_COMPARE_FUNC data.CompareFunc
  setParameteri GlTextureParam.TEXTURE_COMPARE_MODE data.CompareMode
  setParameteri GlTextureParam.TEXTURE_MAX_LEVEL data.MaxLevel
  setParameterf GlTextureParam.TEXTURE_MAX_LOD data.MaxLod
  setParameterf GlTextureParam.TEXTURE_MIN_LOD data.MinLod

let private updateDataTexture pixels (vdata: GlTextureData) (data: GlTextureData) =
  texImage2DData2
    vdata.Target
    vdata.Level
    vdata.InternalFormat
    vdata.Width
    vdata.Height
    vdata.Format
    vdata.DataType
    (bufferView pixels)
    vdata.Offset
    data.ParentObject.Scene.Canvas.Context

  if data.GenerateMipMap then
    data.ParentObject.Scene.Canvas.Context.generateMipmap(float vdata.Target)

  clean data

let private updateImageTexture (pixels: HTMLImageElement) (vdata: GlTextureData) (data: GlTextureData) =
  let isLoaded = pixels.complete && pixels.naturalWidth <> 0.0

  if isLoaded then
    vdata.Width <- pixels.naturalWidth
    vdata.Height <- pixels.naturalHeight

    texImage2DImage2
      vdata.Target
      vdata.Level
      vdata.InternalFormat
      vdata.Width
      vdata.Height
      vdata.Format
      vdata.DataType
      pixels
      data.ParentObject.Scene.Canvas.Context

    if data.GenerateMipMap then
      data.ParentObject.Scene.Canvas.Context.generateMipmap(float vdata.Target)
  
    clean data
  else
    let empty = emptyTextureData

    texImage2DData2
      vdata.Target
      vdata.Level
      empty.InternalFormat
      empty.Width
      empty.Height
      empty.Format
      empty.DataType
      (bufferView empty.Data)
      vdata.Offset
      data.ParentObject.Scene.Canvas.Context

let update (data: GlTextureData) =
  Debug.logIndent $"Texture {data.ParentObject.Name}.{data.Name}.update"
  let gl = data.ParentObject.Scene.Canvas.Context
  let vdata = Option.defaultValue data data.Link

  gl.activeTexture(gl.TEXTURE0 + float data.Index)
  gl.bindTexture(float data.Target, data.TextureId)

  if data.IsDirty then
    match vdata.Pixels with
    | PixelData pixels -> updateDataTexture pixels vdata data
    | PixelImageData _ -> throw "PixelImageData not implemented"
    | PixelHtmlImage pixels -> updateImageTexture pixels vdata data
    | PixelCanvas _ -> throw "PixelCanvas not implemented"
    | PixelVideo _ -> throw "PixelVideo not implemented"
    | PixelBitmap _ -> throw "PixelBitmap not implemented"

    activateTexture vdata data

  // activateTexture vdata data
  Debug.popIndent()

let setPixelData height (pixels: byte[]) (data: GlTextureData) =
  data.Pixels <- PixelData (uint8Array pixels)
  data.Width <- pixels.Length / height / 4 |> float
  data.Height <- height |> float
  dirty data