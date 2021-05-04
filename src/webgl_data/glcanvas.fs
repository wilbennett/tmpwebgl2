module GlCanvas

open Browser.Types
open Browser.Dom
open Fable.Core
open Fable.Core.JsInterop
open Wil.Core
open Wil.Core.Utils
open Wil.Twod.Bounds
open Wil.Js
open Wil.Webgl
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.DataTypes
open Wil.Webgl.Data

type private Builder = {
  Canvas: HTMLCanvasElement
  mutable Attributes: GlContextAttribute list
  mutable PixelStorageParams: GlPixelStorage list
  mutable GlobalCreator: GlObjectFactory
  mutable SceneCreators: GlSceneFactory list
  mutable Data: GlCanvasData
}

let addScene = GlCommon.addScene
let removeScene = GlCommon.removeScene
let getScene = GlCommon.getScene
let getSceneCount (data: GlCanvasData) = data.Scenes.Length
let getSceneByIndex index (data: GlCanvasData) = data.Scenes.[index]

let dirty (data: GlCanvasData) =
  data.IsDirty <- true

let clean (data: GlCanvasData) =
  data.IsDirty <- false

let private applyPixelStorageParams (gl: GL) (builder: Builder) =
  let rec loop storageParams =
    match storageParams with
    | [] -> ()
    | param::remaining ->
        match param with
        | PACK_ALIGNMENT x -> pixelStorei GlPixelStoreParam.PACK_ALIGNMENT x gl
        | UNPACK_ALIGNMENT x -> pixelStorei GlPixelStoreParam.UNPACK_ALIGNMENT x gl
        | UNPACK_FLIP_Y_WEBGL -> pixelStorei GlPixelStoreParam.UNPACK_FLIP_Y_WEBGL 1 gl
        | UNPACK_PREMULTIPLY_ALPHA_WEBGL -> pixelStorei GlPixelStoreParam.UNPACK_PREMULTIPLY_ALPHA_WEBGL 1 gl
        | UNPACK_COLORSPACE_CONVERSION_WEBGL x -> pixelStorei GlPixelStoreParam.UNPACK_COLORSPACE_CONVERSION_WEBGL x gl
        | PACK_ROW_LENGTH x -> pixelStorei GlPixelStoreParam.PACK_ROW_LENGTH x gl
        | PACK_SKIP_PIXELS x -> pixelStorei GlPixelStoreParam.PACK_SKIP_PIXELS x gl
        | PACK_SKIP_ROWS x -> pixelStorei GlPixelStoreParam.PACK_SKIP_ROWS x gl
        | UNPACK_ROW_LENGTH x -> pixelStorei GlPixelStoreParam.UNPACK_ROW_LENGTH x gl
        | UNPACK_IMAGE_HEIGHT x -> pixelStorei GlPixelStoreParam.UNPACK_IMAGE_HEIGHT x gl
        | UNPACK_SKIP_PIXELS x -> pixelStorei GlPixelStoreParam.UNPACK_SKIP_PIXELS x gl
        | UNPACK_SKIP_ROWS x -> pixelStorei GlPixelStoreParam.UNPACK_SKIP_ROWS x gl
        | UNPACK_SKIP_IMAGES x -> pixelStorei GlPixelStoreParam.UNPACK_SKIP_IMAGES x gl
        loop remaining

  loop builder.PixelStorageParams

let inline private createAttributes x =
  keyValueList CaseRules.LowerFirst x

let private updateContext (builder: Builder) =
  let canvas = builder.Canvas
  let data = builder.Data
  canvas.width <- data.Size.X
  canvas.height <- data.Size.Y
  let att = createAttributes builder.Attributes
  let gl = canvas.getContext("webgl2", att) |> unbox<WebGLRenderingContext>
  applyPixelStorageParams gl builder
  builder.Data <- { builder.Data with Context = gl }
  builder

let private applyCreators (builder: Builder) =
  let data = builder.Data
  let createScene (creator: GlSceneFactory) = creator [] data
  let createScenes (creators: GlSceneFactory list) = creators |> List.map createScene

  let createGlobal (creator: GlObjectFactory) =
    let scene = GlScene.create data [ SceneName "globalScene" ]
    creator [ObjectName "global"] scene

  data.Global <- createGlobal builder.GlobalCreator |> Some
  data.Scenes <- builder.SceneCreators |> List.rev |> createScenes |> Array.ofList
  data

let private build (builder: Builder) =
  builder
  |> updateContext
  |> applyCreators

let private apply props (builder: Builder) =
  let rec loop props (b: Builder) =
    let updateData data = b.Data <- data; b
    let addGlobal creator = b.GlobalCreator <- creator; b
    let addScene creator = b.SceneCreators <- creator :: b.SceneCreators; b
    let addAttribute x = b.Attributes <- x :: b.Attributes; b
    let addPixelStorage x = b.PixelStorageParams <- x :: b.PixelStorageParams; b

    match props with
    | [] -> b
    | h::t ->
        match h with
        | CanvasName x -> loop t (updateData { b.Data with Name = x })
        | ContextAttribute x -> loop t (addAttribute x)
        | PixelStorageParams x -> loop t (b.PixelStorageParams <- x; b)
        | PixelStorage x -> loop t (addPixelStorage x)
        | CanvasBackground x -> loop t (updateData { b.Data with CanvasBackground = x })
        | ClearColorBuffer -> loop t (updateData { b.Data with ClearMask = b.Data.ClearMask ||| GlClearBit.COLOR_BUFFER_BIT })
        | ClearDepthBuffer -> loop t (updateData { b.Data with ClearMask = b.Data.ClearMask ||| GlClearBit.DEPTH_BUFFER_BIT })
        | ClearStencilBuffer -> loop t (updateData { b.Data with ClearMask = b.Data.ClearMask ||| GlClearBit.STENCIL_BUFFER_BIT })
        | ClearMask x -> loop t (updateData { b.Data with ClearMask = x })
        | DontClearCanvas -> loop t (updateData { b.Data with ClearCanvas = false })
        | WorldBounds x -> loop t (updateData { b.Data with WorldBounds = x })
        | CanvasSize x -> loop t (updateData { b.Data with Size = x })
        | CanvasWidth x -> loop t (updateData { b.Data with Size = (b.Data.Size.WithXM(x); b.Data.Size) })
        | CanvasHeight x -> loop t (updateData { b.Data with Size = (b.Data.Size.WithYM(x); b.Data.Size) })
        | Global x -> loop t (addGlobal x)
        | Scene x -> loop t (addScene x)
        | Attributes x -> loop t (b.Attributes <- x; b)
        | NoAlpha -> loop t (addAttribute (Alpha false))
        | Desynchronized -> loop t (addAttribute (GlContextAttribute.Desynchronized true))
        | NoAntialias -> loop t (addAttribute (Antialias false))
        | NoDepth -> loop t (addAttribute (Depth false))
        | FailIfMajorPerformanceCaveat -> loop t (addAttribute (GlContextAttribute.FailIfMajorPerformanceCaveat true))
        | NoPremultipliedAlpha -> loop t (addAttribute (PremultipliedAlpha false))
        | PreserveDrawingBuffer -> loop t (addAttribute (GlContextAttribute.PreserveDrawingBuffer true))
        | Stencil -> loop t (addAttribute (GlContextAttribute.Stencil true))
        | PowerPreferenceDefault -> loop t (addAttribute (PowerPreference Default))
        | PowerPreferenceHighPerformance -> loop t (addAttribute (PowerPreference HighPerformance))
        | PowerPreferenceLowPower -> loop t (addAttribute (PowerPreference LowPower))
  loop props builder

let create canvasId props =
  let canvas =
    match document.getElementById canvasId with
    | null -> throw $"Could not find canvas with ID '{canvasId}'."
    | element ->
        if element.nodeName.ToLower() = "canvas" then
          !!element
        else
          let c: HTMLCanvasElement = !!document.createElement("canvas")
          element.appendChild(c) |> ignore
          c

  let canvasSize = vec2 canvas.width canvas.height

  let globalCreator props scene =
    GlObj.create "globalVertex2d" "emptyFragment" None scene props

  {
    Canvas = canvas
    Attributes = []
    PixelStorageParams = []
    GlobalCreator = globalCreator
    SceneCreators = []
    Data = {
      Name = canvasId
      Context = null
      IsDirty = true
      Params = GlCanvasParams()
      CanvasBackground = Vec4.Create()
      ClearMask = GlClearBit.COLOR_BUFFER_BIT
      ClearCanvas = false
      WorldBounds = boundsSizeV canvasSize
      Size = canvasSize
      Mouse = GlMouse(canvas)
      Global = None
      Scenes = [||]
    }
  }
  |> apply props
  |> build

let private clearCanvas (data: GlCanvasData) =
  let gl = data.Context
  let cc = data.CanvasBackground.Values
  gl.clearColor(cc.[0], cc.[1], cc.[2], cc.[3])
  gl.clear(float data.ClearMask)

let private updateGlobal time (data: GlCanvasData) =
  let glob = data.Global.Value
  let uResolution = GlObj.tryGetUniform "resolution" glob
  let uMouse = GlObj.tryGetUniform "mouse" glob
  let uTime = GlObj.tryGetUniform "time" glob

  match uResolution with
  | None -> ()
  | Some bounds ->
      let values = bounds.Value |> asArray<float>
      let bvalues = data.Size.Values
      if values <> bvalues then GlUniform.setValue bvalues bounds

  uMouse |> Option.call (GlUniform.setValue data.Mouse.Position.Values)
  uTime |> Option.call (GlUniform.setValue time)

  let cam = glob.Scene.Cameras.Head
  GlObj.update cam glob

let render time (data: GlCanvasData) =
  if data.IsDirty then
    Debug.logIndent $"webgl.{data.Name}.render"
    if data.ClearCanvas then clearCanvas data
    updateGlobal time data
   
    data.Scenes |> Array.iter GlScene.render
    Debug.popIndent()
  clean data
