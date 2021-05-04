module GlObj

open System
open Wil.Core.Utils
open Wil.Core
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open GlProgram

type private Builder = {
  mutable Name: string
  mutable ParallaxCamera: string Option
  mutable LinkTo: string option
  mutable UboCreators: GlUboFactory list
  mutable UniformCreators: GlUniformFactory list
  mutable AttributeCreators: GlRootAttributeFactory list
  mutable IndicesCreator: GlIndicesFactory option
  mutable TextureCreators: GlTextureFactory list
  mutable Data: GlObjData
}

let dirty = GlCommon.dirtyObject
let dirtyModel = GlCommon.dirtyModel
let dirtyParallax = GlCommon.dirtyParallax

let degreesToRadians (angle: Vec3) =
  vec3
    (angle.X |> degrees |> toRadians |> float)
    (angle.Y |> degrees |> toRadians |> float)
    (angle.Z |> degrees |> toRadians |> float)

let emptyObject scene =
  {
    Id = 0
    Name = ""
    ProgramInfo = GlProgram.emptyProgramInfo scene.Canvas.Context
    IsDirty = true
    Scene = scene
    DrawMethod = Unknown
    DrawPrimitive = GlDrawPrimitive.TRIANGLES
    VertexCount = -1
    VertexOffset = 0
    VertexCountOffset = 0
    InstanceCount = 0
    InstanceOffset = 0
    InstanceCountOffset = 0
    IndicesOffset = 0
    Capabilities = []
    Uniforms = []
    Ubos = []
    Attributes = []
    Indices = None
    Textures = []
    VertexCountAttributes = []
    InstanceCountAttributes = []
    ProcessLinked = false
    Vao = null
    Layer = -1
    ParallaxCamera = None
    ParallaxDistance = 1.0
    ParallaxOffset = Vec3.Create()
    ParallaxLastPosition = Vec3.Create()
    Angle = Vec3.Create()
    Position = Vec3.Create()
    Scale = 1.0
    ModelMatrix = Mat4.Create()
    ParallaxMatrix = None
    Parent = None
    Link = None
    LinkedChildren = []
    IsModelDirty = true
    IsParallaxDirty = true
    RecalcNeeded = true
    CalcDrawMethod = true
    CalcVertexCount = true
    CalcInstanceCount = true
  }

let getUbo = GlCommon.getUbo
let tryGetUbo = GlCommon.tryGetUbo
let getUniform = GlCommon.getUniform
let tryGetUniform = GlCommon.tryGetUniform
let getAttribute = GlCommon.getAttribute
let tryGetAttribute = GlCommon.tryGetAttribute
let getTexture = GlCommon.getTexture
let tryGetTexture = GlCommon.tryGetTexture

let addUbo = GlCommon.addUbo
let addUniform = GlCommon.addUniform
let addAttribute = GlCommon.addAttribute
let addTexture = GlCommon.addTexture

let rec private tryGetParentUbo name (data: GlObjData) =
  match data.Parent |> Option.executeDefault None (tryGetUbo name) with
  | Some result -> Some result
  | None -> data.Parent |> Option.executeDefault None (tryGetParentUbo name)

let rec private tryGetParentUniform name (data: GlObjData) =
  match data.Parent |> Option.executeDefault None (tryGetUniform name) with
  | Some result -> Some result
  | None -> data.Parent |> Option.executeDefault None (tryGetParentUniform name)

let rec private getParentAttribute name (data: GlObjData) =
  match data.Parent |> Option.executeDefault None (tryGetAttribute name) with
  | Some result -> Some result
  | None -> data.Parent |> Option.executeDefault None (getParentAttribute name)

let _cleanLinkedBuffers (data: GlObjData) =
  data
  |> GlCommon.allAttributes
  |> Seq.where (fun a -> a.LinkedChildren.Length > 0)
  |> Seq.iter (fun a -> a.Buffer.Clean(true))

  match data.Indices with
  | Some a -> if a.LinkedChildren.Length > 0 then a.Buffer.Clean(true)
  | None -> ()

let private addLinkedUbos (data: GlObjData) =
  let addLinkedUbo (data: GlObjData) (parent: GlUboData) =
    Debug.log $"Link UBO {data.Name}.{parent.Name} to {GlCommon.objectDebugName parent.ParentObject}"
    data.Ubos <- GlUbo.createLinked parent data :: data.Ubos

  // Add one at a time because we need to calculate binding index.
  data.ProgramInfo.Ubos
  |> Seq.where (fun info -> tryGetUbo info.Name data |> Option.isNone)
  |> Seq.choose (fun info -> tryGetParentUbo info.Name data)
  |> Seq.iter (addLinkedUbo data)
  data

let private addLinkedUniforms (data: GlObjData) =
  let createLinkedUniform (data: GlObjData) (parent: GlUniformData) =
    Debug.log $"Link uniform {parent.Name} to {GlCommon.objectDebugName parent.ParentObject}"
    GlUniform.createLinked parent data

  let assignUniforms (uniforms: GlUniformData list) =
    data.Uniforms <- uniforms
    data

  data.ProgramInfo.Uniforms
  |> Seq.where (fun info -> tryGetUniform info.Name data |> Option.isNone)
  |> Seq.choose (fun info -> tryGetParentUniform info.Name data)
  |> Seq.map (createLinkedUniform data)
  |> Seq.append data.Uniforms
  |> List.ofSeq
  |> assignUniforms

let private addLinkedAttributes (data: GlObjData) =
  let createLinkedAttribute (data: GlObjData) (parent: GlAttributeData) =
    Debug.log $"Link attribute {parent.Name} to {GlCommon.objectDebugName parent.ParentObject}"
    match parent.Kind with
    | Single -> GlAttribCommon.createLinked parent data |> SingleAttribute
    | _ -> GlAttribCommon.createLinked parent data |> InterleaveAttribute

  let assignAttributes (attributes: GlRootAttribute list) =
    data.Attributes <- attributes
    data

  data.ProgramInfo.Attributes
  |> Seq.where (fun info -> tryGetAttribute info.Name data |> Option.isNone)
  |> Seq.choose (fun info -> getParentAttribute info.Name data)
  |> Seq.map (createLinkedAttribute data)
  |> Seq.append data.Attributes
  |> List.ofSeq
  |> assignAttributes

let private addLinkedObjects (data: GlObjData) =
  match data.Parent with
  | None -> data
  | Some _ ->
      data
      |> addLinkedUbos
      |> addLinkedUniforms
      |> addLinkedAttributes

let private addDynamicUbos (data: GlObjData) =
  let addDynamicUbo (data: GlObjData) (info: GlUboInfo) =
    Debug.log $"Create dynamic UBO {info.Name} for {data.Name}"
    data.Ubos <- GlUbo.createFrom info [] data :: data.Ubos

  // Add one at a time because we need to calculate binding index.
  data.ProgramInfo.Ubos
  |> Seq.where (fun info -> tryGetUbo info.Name data |> Option.isNone)
  |> Seq.iter (addDynamicUbo data)
  data

let private getDefaultValue (info: GlUniformInfo) =
  let count = info.ElementCount * info.Length;

  match info.Type with
  | GlType.BOOL_VEC2
  | GlType.BOOL_VEC3
  | GlType.BOOL_VEC4
  | GlType.BOOL -> Array.zeroCreate<bool> count :> obj
  | GlType.INT
  | GlType.INT_VEC2
  | GlType.INT_VEC3
  | GlType.INT_VEC4
  | GlType.SAMPLER_2D
  | GlType.SAMPLER_3D
  | GlType.SAMPLER_2D_ARRAY
  | GlType.SAMPLER_2D_ARRAY_SHADOW
  | GlType.SAMPLER_2D_SHADOW
  | GlType.SAMPLER_CUBE
  | GlType.SAMPLER_CUBE_SHADOW
  | GlType.INT_SAMPLER_2D
  | GlType.INT_SAMPLER_2D_ARRAY
  | GlType.INT_SAMPLER_3D
  | GlType.INT_SAMPLER_CUBE
  | GlType.UNSIGNED_INT_SAMPLER_2D
  | GlType.UNSIGNED_INT_SAMPLER_2D_ARRAY
  | GlType.UNSIGNED_INT_SAMPLER_3D
  | GlType.UNSIGNED_INT_SAMPLER_CUBE -> Array.zeroCreate<int> count :> obj
  | GlType.BYTE
  | GlType.SHORT
  | GlType.UNSIGNED_BYTE
  | GlType.UNSIGNED_SHORT
  | GlType.UNSIGNED_INT_VEC2
  | GlType.UNSIGNED_INT_VEC3
  | GlType.UNSIGNED_INT_VEC4
  | GlType.UNSIGNED_INT -> Array.zeroCreate<uint> count :> obj
  | GlType.FLOAT
  | GlType.HALF_FLOAT
  | GlType.FLOAT_VEC2
  | GlType.FLOAT_VEC3
  | GlType.FLOAT_VEC4
  | GlType.FLOAT_MAT2
  | GlType.FLOAT_MAT3
  | GlType.FLOAT_MAT4
  | GlType.FLOAT_MAT2x3
  | GlType.FLOAT_MAT2x4
  | GlType.FLOAT_MAT3x2
  | GlType.FLOAT_MAT3x4
  | GlType.FLOAT_MAT4x2
  | GlType.FLOAT_MAT4x3 -> Array.zeroCreate<float> count :> obj
  | GlType.Unknown -> raise (exn "Uniform type not initialized")
  | _ -> raise (exn "Uniform type not initialized")

let private addDynamicUniforms (data: GlObjData) =
  let createDynamicUniform (data: GlObjData) (info: GlUniformInfo) =
    GlUniform.createFrom info [ Value (getDefaultValue info) ] data

  let assignUniforms (uniforms: GlUniformData list) =
    data.Uniforms <- uniforms
    data

  data.ProgramInfo.Uniforms
  |> Seq.where (fun info -> tryGetUniform info.Name data |> Option.isNone)
  |> Seq.map (createDynamicUniform data)
  |> Seq.append data.Uniforms
  |> List.ofSeq
  |> assignUniforms

let private addDynamicAttributes (data: GlObjData) =
  let createDynamicAttribute (data: GlObjData) (info: GlAttributeInfo) =
    Debug.log $"Adding dynamic attribute {info.Name} to {GlCommon.objectDebugName data}"
    GlSingleAttribute.createFrom info [] data

  let assignAttributes (attributes: GlRootAttribute list) =
    data.Attributes <- attributes
    data

  data.ProgramInfo.Attributes
  |> Seq.where (fun info -> tryGetAttribute info.Name data |> Option.isNone)
  |> Seq.map (createDynamicAttribute data)
  |> Seq.append data.Attributes
  |> List.ofSeq
  |> assignAttributes

let private addDynamicObjects (data: GlObjData) =
  data
  |> addDynamicUbos
  |> addDynamicUniforms
  |> addDynamicAttributes

let private calcVertexCountAttributes (data: GlObjData) =
  let result =
    data
    |> GlCommon.allAttributes
    |> Seq.filter (fun a -> a.DeterminesVertexCount)
    |> List.ofSeq

  match result with
  | [] ->
      match data.Attributes with
      | [] -> []
      | first::_ ->
          let a = GlCommon.getAttributeData first
          // a.DeterminesVertexCount <- true
          [a]
  | a -> a

let private calcInstanceCountAttributes (data: GlObjData) =
  data
  |> GlCommon.allAttributes
  |> Seq.filter (fun a -> a.DeterminesInstanceCount)
  |> List.ofSeq

let private linkTo (parent: GlObjData) (data: GlObjData) =
  let data = { data with Link = Some parent }
  parent.LinkedChildren <- data :: parent.LinkedChildren
  data

let private processLink (builder: Builder) =
  match builder.LinkTo with
  | None -> builder
  | Some objectName ->
      if not <| String.IsNullOrWhiteSpace(objectName) then
        let data = builder.Data
        let globj = data.Scene |> GlCommon.getObject objectName
        builder.Data <- linkTo globj data
      builder

let private applyCreators (builder: Builder) =
  let data = builder.Data
  let createUniform (creator: GlUniformFactory) = creator [] data
  let createAttribute (creator: GlRootAttributeFactory) = creator [] data
  let createIndices (creator: GlIndicesFactory) = creator [] data
  let createTexture (creator: GlTextureFactory) = creator [] data

  let addUbo c = GlCommon.addUbo c data |> ignore
  // Must create one at a time since we need proper binding Indices.
  builder.UboCreators |> List.iter addUbo

  data.Uniforms <- builder.UniformCreators |> List.map createUniform
  data.Attributes <- builder.AttributeCreators |> List.map createAttribute
  builder.IndicesCreator |> Option.call (fun c -> data.Indices <- createIndices c |> Some)
  data.Textures <- builder.TextureCreators |> List.rev |> List.map createTexture
  data.VertexCountAttributes <- calcVertexCountAttributes data
  data.InstanceCountAttributes <- calcInstanceCountAttributes data
  data

let private build (builder: Builder) =
  let sortChildren (data: GlObjData) =
    let getAttribIndex att =
      match att with
      | SingleAttribute a
      | InterleaveAttribute a -> a.Info.Index

    data.Uniforms <- data.Uniforms |> List.sortBy (fun u -> u.Info.Index)
    data.Ubos <- data.Ubos |> List.sortBy (fun u -> u.Info.BlockIndex)
    data.Attributes <- data.Attributes |> List.sortBy getAttribIndex
    data.Id <- 5
    data

  let applyCalculations builder =
    let data = builder.Data

    let parallaxCamera =
      match builder.ParallaxCamera with
      | None -> None
      | Some name when System.String.IsNullOrWhiteSpace(name) -> None
      | Some name -> data.Scene |> GlCommon.getCamera name |> Some

    let parallaxPosition =
      match parallaxCamera with
      | None -> data.ParallaxLastPosition
      | Some cam -> cam.Position.Clone()

    let parallaxMatrix = Option.execute (fun _ -> Mat4.Create()) parallaxCamera

    let layer =
      if data.Layer >= 0 && data.Layer < data.Scene.Layers.Length
      then data.Layer
      else data.Scene.DefaultLayer

    builder.Data <- {
      data with
        Name = builder.Name
        Capabilities = GlCapability.defaultCapabilities @ data.Capabilities
        ParallaxCamera = parallaxCamera
        ParallaxLastPosition = parallaxPosition
        ParallaxMatrix = parallaxMatrix
        Layer = layer
        CalcDrawMethod = builder.Data.DrawMethod = Unknown
        CalcVertexCount = builder.Data.VertexCount < 0
        CalcInstanceCount = builder.Data.InstanceCount <= 0
    }
    builder

  builder
  |> applyCalculations
  |> processLink
  |> applyCreators
  |> addLinkedObjects
  |> addDynamicObjects
  |> sortChildren

let private apply props (builder: Builder) =
  let rec loop props (b: Builder) =
    let updateName name =
      if b.Name <> "global" then b.Name <- name
      b

    let updateData data = b.Data <- data; b
    let addParallaxCam c = b.ParallaxCamera <- Some c; b
    let addLink s = b.LinkTo <- Some s; b
    let addUniform creator = b.UniformCreators <- creator :: b.UniformCreators; b
    let addUbo creator = b.UboCreators <- creator :: b.UboCreators; b
    let addAttribute creator = b.AttributeCreators <- creator :: b.AttributeCreators; b
    let addIndices creator = b.IndicesCreator <- Some creator; b
    let addTexture creator = b.TextureCreators <- creator :: b.TextureCreators; b

    match props with
    | [] -> b
    | h::t ->
      match h with
      | ObjectName x -> loop t (updateName x)
      | DrawMethod x -> loop t (updateData { b.Data with DrawMethod = x })
      | DrawPrimitive x -> loop t (updateData { b.Data with DrawPrimitive = x })
      | VertexCount x -> loop t (updateData { b.Data with VertexCount = x })
      | VertexOffset x -> loop t (updateData { b.Data with VertexOffset = x })
      | VertexCountOffset x -> loop t (updateData { b.Data with VertexCountOffset = x })
      | InstanceCount x -> loop t (updateData { b.Data with InstanceCount = x })
      | InstanceOffset x -> loop t (updateData { b.Data with InstanceOffset = x })
      | InstanceCountOffset x -> loop t (updateData { b.Data with InstanceCountOffset = x })
      | IndicesOffset x -> loop t (updateData { b.Data with IndicesOffset = x })
      | Uniform x -> loop t (addUniform x)
      | Ubo x -> loop t (addUbo x)
      | Attribute x -> loop t (addAttribute x)
      | Indices x -> loop t (addIndices x)
      | Texture x -> loop t (addTexture x)
      | Capability x -> loop t (updateData { b.Data with Capabilities = x :: b.Data.Capabilities })
      | ProcessLinked x -> loop t (updateData { b.Data with ProcessLinked = x })
      | ParallaxCamera x -> loop t (addParallaxCam x)
      | ParallaxDistance x -> loop t (updateData { b.Data with ParallaxDistance = x })
      | Layer x -> loop t (updateData { b.Data with Layer = x })
      | Angle x -> loop t (updateData { b.Data with Angle = x })
      | AngleDegrees x -> loop t (updateData { b.Data with Angle = degreesToRadians x })
      | AngleZ x -> loop t (updateData { b.Data with Angle = (b.Data.Angle.Z <- float x; b.Data.Angle) })
      | AngleDegreesZ x -> loop t (updateData { b.Data with Angle = (b.Data.Angle.Z <- x |> toRadians |> float; b.Data.Angle) })
      | Position x -> loop t (updateData { b.Data with Position = x })
      | Scale x -> loop t (updateData { b.Data with Scale = x })
      | ObjectLink x -> loop t (addLink x)
  loop props builder

let create vertex fragment parent scene props =
  let gl = scene.Canvas.Context
  let programInfo = createProgramInfo gl vertex fragment
  let vao = gl.createVertexArray()
  // bindVertexArray gl vao

  {
    Name = ""
    ParallaxCamera = None
    LinkTo = None
    UboCreators = []
    UniformCreators = []
    AttributeCreators = []
    IndicesCreator = None
    TextureCreators = []
    Data = {
      emptyObject scene with
        ProgramInfo = programInfo
        Parent = parent
        Vao = vao
        ProcessLinked = true
    }
  }
  |> apply props
  |> build

let delete (data: GlObjData) =
  let deleteAttribute (attribute: GlRootAttribute) =
    match attribute with
    | SingleAttribute a -> GlAttrib.delete a
    | InterleaveAttribute a -> GlAttrib.delete a

  let gl = data.Scene.Canvas.Context
  deleteProgramInfo data.ProgramInfo
  gl.deleteVertexArray(data.Vao)
  data.Ubos |> List.iter GlUbo.delete
  data.Attributes |> List.iter deleteAttribute
  data.Indices |> Option.call GlIndices.delete

let private updateCalculated (data: GlObjData) =
  let sumDataCount (attribs: GlAttributeData list) = attribs |> List.sumBy (fun a -> a.DataCount)

  if data.RecalcNeeded then
    data.RecalcNeeded <- false

    if data.CalcVertexCount then
      data.VertexCount <- sumDataCount data.VertexCountAttributes

    if data.CalcInstanceCount then
      data.InstanceCount <- sumDataCount data.InstanceCountAttributes

    if data.CalcDrawMethod then
      let hasIndices = data.Indices.IsSome

      let hasDivisor =
        data.InstanceCount > 0 ||
        data |> GlCommon.allAttributes |> Seq.exists (fun a -> a.Divisor >= 0)

      match data.CalcDrawMethod with
      | false -> ()
      | true ->
          data.DrawMethod <-
            match hasIndices, hasDivisor with
            | (false, false) -> DRAW_ARRAYS
            | (true, false) -> DRAW_ELEMENTS
            | (false, true) -> DRAW_ARRAYS_INSTANCED
            | (true, true) -> DRAW_ELEMENTS_INSTANCED

let private clean (data: GlObjData) =
  data.IsDirty <- false
  data.IsModelDirty <- false

let private calcModelMatrix (data: GlObjData) =
  if data.IsModelDirty then
    Debug.logIndent $"{data.Name}.calcModelMatrix"
    let mat = data.ModelMatrix
    let ws = data.Scene.WorldScale

    let scale =
      match data.Scale with
      | 1.0 -> ws
      | _ -> data.Scale + if ws <> 1.0 then ws else 0.0

    match data.Link with
    | None -> mat.SetToIdentity()
    | Some link ->
        mat.Set(link.ModelMatrix.Values)
        if ws <> 1.0 then
          let invScale = 1.0 / ws
          mat.ScaleM(invScale, invScale, invScale)

    mat.TranslateM(data.Position.X * ws, data.Position.Y * ws, data.Position.Z * ws)
    mat.RotateZM(data.Angle.Z * 1.0<rad>)
    mat.ScaleM(scale, scale, scale)

    data.IsModelDirty <- false
    data.IsParallaxDirty <- true
    data.LinkedChildren |> List.iter dirtyModel
    Debug.popIndent()

let private calcParallaxMatrix (data: GlObjData) =
  if data.IsParallaxDirty then
    data.IsParallaxDirty <- false
    match data.ParallaxMatrix with
    | None -> ()
    | Some mat ->
        Debug.logIndent $"{data.Name}.calcParallaxMatrix"
        let ws = data.Scene.WorldScale
        let scale = data.Scale + if ws <> 1.0 then ws else 0.0
        let position = data.Position + data.ParallaxOffset
        mat.SetToIdentity()
        mat.TranslateM(position.X * ws, position.Y * ws, position.Z * ws)
        mat.RotateZM(data.Angle.Z * 1.0<rad>)
        mat.ScaleM(scale, scale, scale)
        Debug.popIndent()

let private isParallaxCamera (camera: GlCameraData) (data: GlObjData) =
  Object.ReferenceEquals(camera, data.ParallaxCamera)

let private updateModelMatrix (camera: GlCameraData) (data: GlObjData) =
  match tryGetUniform "modelMat" data with
  | None -> ()
  | Some modelMat ->
      calcModelMatrix data
      calcParallaxMatrix data
      
      let mat =
        match (isParallaxCamera camera data, data.ParallaxMatrix) with
        | (true, Some mat) -> mat
        | _ -> data.ModelMatrix

      GlUniform.setValue mat.Values modelMat

let private updateParallax (camera: GlCameraData) (data: GlObjData) =
  match data.ParallaxCamera with
  | None -> ()
  | Some cam ->
      let isParallaxCam = isParallaxCamera camera data

      if isParallaxCam && data.ParallaxLastPosition <> cam.LookAt then
        let delta = data.ParallaxLastPosition - cam.LookAt
        let frac = 1.0 - (1.0 / data.ParallaxDistance)
        data.ParallaxOffset += (-delta * frac)
        data.ParallaxLastPosition.CopyFrom(cam.LookAt)
        data.IsParallaxDirty <- true

let private updateAttribute attr =
  match attr with
  | SingleAttribute a -> GlSingleAttribute.update a
  | InterleaveAttribute a -> GlInterleaveAttribute.update a

let update (camera: GlCameraData) (data: GlObjData) =
  Debug.logIndent $"{data.Name}.update"
  let gl = data.Scene.Canvas.Context
  useProgram gl data.ProgramInfo.Program
  bindVertexArray gl data.Vao

  if data.IsDirty then
    updateParallax camera data
    updateModelMatrix camera data // Allow matrix to be standalone or UBO.

  data.Ubos |> List.iter GlUbo.update

  if data.IsDirty then
    data.Uniforms |> List.iter GlUniform.update
    data.Attributes |> List.iter updateAttribute
    data.Indices |> Option.call GlIndices.update
    data.Textures |> List.iter GlTexture.update
    updateCalculated data
    clean data
  Debug.popIndent()

let render (camera: GlCameraData) (data: GlObjData) =
  Debug.logIndent $"{data.Name}.render"
  let gl = data.Scene.Canvas.Context
  update camera data
  // data.Capabilities |> List.iter (fun capability -> capability.Process(gl))
  data.Capabilities |> List.iter (fun capability -> capability gl)

  let uResolution = tryGetUniform "resolution" data
  match uResolution with
  | None -> ()
  | Some bounds ->
      let values = bounds.Value |> asArray<float>
      Debug.jsLog $"got resolution: {values}"

  match data.DrawMethod with
  | DRAW_ARRAYS | Unknown ->
      let vertexCount = data.VertexCount + data.VertexCountOffset
      drawArrays gl data.DrawPrimitive data.VertexOffset vertexCount
  | DRAW_ELEMENTS ->
      let index = data.Indices.Value
      drawElements gl data.DrawPrimitive index.DataCount index.IndicesType index.Offset
  | DRAW_ARRAYS_INSTANCED ->
      let vertexCount = data.VertexCount + data.VertexCountOffset
      let instanceCount = data.InstanceCount + data.InstanceCountOffset
      drawArraysInstanced gl data.DrawPrimitive data.InstanceOffset vertexCount instanceCount
  | DRAW_ELEMENTS_INSTANCED -> ()
  Debug.popIndent()

let setInstanceCount value (data: GlObjData) =
  data.InstanceCount <- value
  GlCommon.objectRecalcNeeded data

let setAngle (angle: Vec3) (data: GlObjData) =
  angle.CopyTo(data.Angle) |> ignore
  dirtyModel data

let setAngleZ (angle: float<rad>) (data: GlObjData) =
  data.Angle.Z <- float angle
  dirtyModel data

let setAngleDegrees (angle: Vec3) (data: GlObjData) =
  data.Angle.WithXYZM(
    angle.X |> degrees |> toRadians |> float,
    angle.Y |> degrees |> toRadians |> float,
    angle.Z |> degrees |> toRadians |> float)
  dirtyModel data

let setAngleDegreesZ (angle: float<deg>) (data: GlObjData) =
  data.Angle.Z <- angle |> toRadians |> float
  dirtyModel data

let setPositionXYZ x y z (data: GlObjData) =
  data.Position.WithXYZM(x, y, z)
  dirtyModel data

let setPositionXY x y (data: GlObjData) =
  setPositionXYZ x y 0.0 data

let setPosition (position: Vec3) (data: GlObjData) =
  setPositionXYZ position.X position.Y position.Z data

let setScale s (data: GlObjData) =
  data.Scale <- s
  dirtyModel data
