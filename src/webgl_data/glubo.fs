module GlUbo

open Fable.Core
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open GlProgram

type private Builder = {
  mutable LinkTo: string option
  mutable UniformCreators: GlUboUniformFactory list
  mutable Data: GlUboData
}

let private addMissingUniforms (data: GlUboData) =
  let isMissingUniform (info: GlUniformInfo) =
    data.Uniforms |> List.tryFind (fun u -> u.Name = info.Name) |> Option.isNone

  let addMissingUniform (data: GlUboData) (info: GlUniformInfo) =
    GlCommon.addUboUniform (fun p d -> GlUboUniform.createFrom info p d) data |> ignore

  data.Info.Uniforms
  |> List.where isMissingUniform
  |> List.iter (addMissingUniform data)

  data.Uniforms <- data.Uniforms |> List.sortBy (fun u -> u.Info.Index)
  data

let private applyCreators (builder: Builder) =
  let data = builder.Data
  let createUniform (creator: GlUboUniformFactory) = creator [] data data.ParentObject
    
  data.Uniforms <- builder.UniformCreators |> List.map createUniform
  data

let private addLinkedChild (parent: GlUboData) (data: GlUboData) =
  parent.LinkedChildren <- data :: parent.LinkedChildren
  data

let linkTo (parent: GlUboData) (data: GlUboData) =
  {
    data with
      Link = Some parent
      Uniforms = []
  }
  |> addLinkedChild parent

let private processLink (builder: Builder) =
  match builder.LinkTo with
  | None -> builder
  | Some name ->
      let data = builder.Data
      let (objectName, uboName) = GlCommon.splitName name
      let globj = data.ParentObject.Scene |> GlCommon.getObject objectName
      let ubo = globj |> GlCommon.getUbo uboName
      builder.Data <- linkTo ubo data
      builder

let private build (builder: Builder) =
  let sortChildren (data: GlUboData) =
    data.Uniforms <- data.Uniforms |> List.sortBy (fun u -> u.Info.Index)
    data

  builder
  |> processLink
  |> applyCreators
  |> addMissingUniforms
  |> sortChildren

let private bindToProgram (data: GlUboData) =
  let gl = data.ParentObject.Scene.Canvas.Context
  let program = data.ParentObject.ProgramInfo.Program
  uniformBlockBinding gl program data.Info.BlockIndex data.Location
  data

let private apply props (builder: Builder) =
  let rec loop props (b: Builder) =
    let updateData data = b.Data <- data; b
    let addLink s = b.LinkTo <- Some s; b
    let addUniform creator = b.UniformCreators <- creator :: b.UniformCreators; b

    match props with
    | [] -> b
    | h::t ->
      match h with
      | BufferIndex x -> loop t (updateData { b.Data with Location = x })
      | UboUniform x -> loop t (addUniform x)
      | UboLink x -> loop t (addLink x)

  loop props builder
  
let createFrom (info: GlUboInfo) props (parentObject: GlObjData) =
  let bindBufferBase (data: GlUboData) =
    data.Buffer.BindBase(data.Location)
    data

  let initBuffer (builder: Builder) =
    if builder.Data.Link.IsNone then
      let data = builder.Data
      let buffer = data.Buffer
      buffer.Init(GlBufferTarget.UNIFORM_BUFFER, GlBufferUsage.DYNAMIC_DRAW, uint8ArrayFactory)
      buffer.SetLength(info.ByteSize)
      builder.Data <- { data with Data = buffer.Data :?> JS.TypedArray<uint8> }
    builder

  {
    LinkTo = None
    UniformCreators = []
    Data = {
      Id = 0
      IsDirty = true
      Info = info
      Location = GlCommon.nextUboBufferIndex parentObject
      Uniforms = []
      Buffer = GlBuffer(parentObject.Scene.Canvas.Context)
      Data = emptyUint8Array
      ParentObject = parentObject
      Link = None
      LinkedChildren = []
    }
  }
  |> apply props
  |> initBuffer
  |> build
  // |> bindBufferBase
  |> bindToProgram

let createEmpty name (parentObject: GlObjData) =
  {
    Id = 0
    IsDirty = false
    Info = GlProgram.emptyUboInfo name
    Location = -1
    Uniforms = []
    Buffer = GlBuffer(parentObject.Scene.Canvas.Context)
    Data = uint8Array 0
    ParentObject = parentObject
    Link = None
    LinkedChildren = []
  }

let create name props (parentObject: GlObjData) =
  match GlProgram.getUbo name parentObject.ProgramInfo with
  | Some info -> createFrom info props parentObject
  | None -> createEmpty name parentObject

let createLinked (data: GlUboData) (parentObject: GlObjData) =
  {
    data with
      // Location needs to be in the parent object's program.
      Info = GlProgram.getUboOrDefault data.Name parentObject.ProgramInfo
      Location = GlCommon.nextUboBufferIndex parentObject
      Uniforms = []
      Data = uint8Array 0
      ParentObject = parentObject
      Link = Some data
      LinkedChildren = []
  }
  |> addLinkedChild data
  |> bindToProgram

let delete (data: GlUboData) =
  data.Buffer.Delete()

let clean (data: GlUboData) =
  data.IsDirty <- false

let update (data: GlUboData) =
  if data.Info.BlockIndex >= 0 then
    if data.IsDirty then
      clean data
      match data.Link with
      | Some _ -> ()
      | None ->
          Debug.logIndent $"UBO {data.ParentObject.Name}.{data.Info.Name}.update"
          data.Buffer.Bind()
          data.Buffer.Update()
          Debug.popIndent()

    if data.LinkedChildren.Length = 0 then
      data.Buffer.BindBase(data.Location)
