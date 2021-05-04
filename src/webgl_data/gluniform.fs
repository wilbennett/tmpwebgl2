module GlUniform

open System
open Fable.Core
open Wil.Core.Utils
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open GlProgram

type ChildCreator = GlUniformData option -> GlUniformData

type UniformBuilder = {
  mutable LinkTo: string option
  mutable ChildCreators: ChildCreator list
  mutable Data: GlUniformData
}

let private applyCreators (builder: UniformBuilder) =
  let data = builder.Data
  let parent = Some data
  let createUniform (creator: ChildCreator) = creator parent
  let createUniforms (creators: ChildCreator list) = creators |> List.map createUniform

  data.ChildUniforms <- builder.ChildCreators |> List.map createUniform |> Array.ofList
  data

let private addLinkedChild (parent: GlUniformData) (data: GlUniformData) =
  parent.LinkedChildren <- data :: parent.LinkedChildren
  data

let private linkTo (parent: GlUniformData) (data: GlUniformData) =
  { data with Link = Some parent }
  |> addLinkedChild parent

let private processLink (builder: UniformBuilder) =
  match builder.LinkTo with
  | None -> builder
  | Some name ->
      let data = builder.Data
      let (objectName, uniformName) = GlCommon.splitName name
      let globj = data.ParentObject.Scene |> GlCommon.getObject objectName
      let uniform = globj |> GlCommon.getUniform uniformName
      builder.Data <- linkTo uniform data
      builder

let _build (builder: UniformBuilder) =
  builder
  |> processLink
  |> applyCreators

let rec _apply props (b: UniformBuilder) =
  let updateData data = b.Data <- data; b
  let addLink s = b.LinkTo <- Some s; b

  match props with
  | [] -> b
  | h::t ->
    match h with
    | UniformLink x -> _apply t (addLink x)
    | Value x ->
        let value =
          match x with
          | :? Array -> x
          | _ -> [| unbox x |] :> obj

        _apply t (updateData { b.Data with Value = value })

let createFrom (info: GlUniformInfo) props parentObject =
  let rec doCreate props (info: GlUniformInfo) rootUniform =
    let createChild info = doCreate [] info

    {
      LinkTo = None
      ChildCreators = info.Children |> List.ofArray |> List.map createChild
      Data = {
        Id = 0
        Info = info
        IsDirty = true
        Data = emptyFloat32Array :> JS.TypedArray
        Value = 0.0
        ParentObject = parentObject
        ParentUbo = None
        RootUniform = rootUniform
        ChildUniforms = [||]
        Link = None
        LinkedChildren = []
      }
    }
    |> _apply props
    |> _build

  doCreate props info None
  
let private createEmpty name rootUniform parentObject =
  {
    Id = 0
    Info = GlProgram.emptyUniformInfo name
    IsDirty = false
    Data = emptyFloat32Array
    Value = 0.0
    ParentObject = parentObject
    ParentUbo = None
    RootUniform = rootUniform
    ChildUniforms = [||]
    Link = None
    LinkedChildren = []
  }

let create name props (parentObject: GlObjData) =
  match GlProgram.getUniform name parentObject.ProgramInfo with
  | Some info -> createFrom info props parentObject
  | None -> createEmpty name None parentObject

let createLinked (data: GlUniformData) (parentObject: GlObjData) =
  {
    data with
      // Location needs to be in the parent object's program.
      Info = GlProgram.getUniformOrDefault data.Name parentObject.ProgramInfo
      Value = 0.0
      ParentObject = parentObject
      ParentUbo = None
      RootUniform = None
      ChildUniforms = [||]
      Link = Some data
      LinkedChildren = []
  }
  |> addLinkedChild data

let rec private dirty (data: GlUniformData) =
  let rec dirtyUbo (data: GlUboData) =
    data.IsDirty <- true
    GlCommon.dirtyObject data.ParentObject
    data.LinkedChildren |> List.iter dirtyUbo

  match data.ParentUbo with
  | Some ubo -> dirtyUbo ubo
  | None ->
      GlCommon.dirtyObject data.ParentObject
      let uniform = data.RootUniform |> Option.defaultValue data
      uniform.IsDirty <- true
      uniform.LinkedChildren |> List.iter dirty

let clean (data: GlUniformData) =
  data.IsDirty <- false

let private writeArray<'a> (typedArr: JS.TypedArray<'a>) startIndex count (value: 'a[]) =
  if value.Length = typedArr.length then
    typedArr.set(value) |> ignore
  else
    for i in [0 .. count - 1] do
      typedArr.[i] <- value.[startIndex + i]

let rec updateUbo value (ubo: GlUboData) (data: GlUniformData) =
  Debug.logIndent $"{GlCommon.objectDebugName data.ParentObject}.{data.Name}.updateUbo"
  match data.ChildUniforms with
  | [||] ->
      let info = data.Info
      let offset = info.Offset
      let floatArr = data.Data :?> JS.TypedArray<float>
      ubo.Buffer.DirtyRange(offset, offset + info.ByteSize - 1)
      Debug.log $"{value}"

      value
      |> asArray<float>
      |> writeArray floatArr info.StartIndex info.ElementCount
      Debug.log $"{floatArr}"
  | _ ->
      data.ChildUniforms |> Array.iter (updateUbo value ubo)
  Debug.popIndent()

let private updateSingle value (vdata: GlUniformData) (data: GlUniformData) =
  Debug.logIndent $"{GlCommon.objectDebugName data.ParentObject}.{data.Name}.updateSingle"
  let info = data.Info
  let location = info.Location
  let gl = data.ParentObject.Scene.Canvas.Context
  let value = value |> asArray<float>

  match vdata.Info.Type with
  | GlType.BOOL
  | GlType.BYTE
  | GlType.UNSIGNED_BYTE
  | GlType.UNSIGNED_SHORT
  | GlType.UNSIGNED_INT -> uniform1uiv gl location value

  | GlType.SAMPLER_2D
  | GlType.SAMPLER_2D_ARRAY
  | GlType.SAMPLER_2D_ARRAY_SHADOW
  | GlType.SAMPLER_2D_SHADOW
  | GlType.SAMPLER_CUBE
  | GlType.SAMPLER_CUBE_SHADOW
  | GlType.SAMPLER_3D
  | GlType.INT_SAMPLER_2D
  | GlType.INT_SAMPLER_2D_ARRAY
  | GlType.INT_SAMPLER_3D
  | GlType.INT_SAMPLER_CUBE
  | GlType.UNSIGNED_INT_SAMPLER_2D
  | GlType.UNSIGNED_INT_SAMPLER_2D_ARRAY
  | GlType.UNSIGNED_INT_SAMPLER_3D
  | GlType.UNSIGNED_INT_SAMPLER_CUBE
  | GlType.INT -> uniform1iv gl location value

  | GlType.SHORT
  | GlType.HALF_FLOAT
  | GlType.FLOAT -> uniform1fv gl location value

  | GlType.BOOL_VEC2
  | GlType.UNSIGNED_INT_VEC2 -> uniform2uiv gl location value
  | GlType.INT_VEC2 -> uniform2iv gl location value
  | GlType.FLOAT_VEC2 -> uniform2fv gl location value

  | GlType.BOOL_VEC3
  | GlType.UNSIGNED_INT_VEC3 -> uniform3uiv gl location value
  | GlType.INT_VEC3 -> uniform3iv gl location value
  | GlType.FLOAT_VEC3 -> uniform3fv gl location value

  | GlType.BOOL_VEC4
  | GlType.UNSIGNED_INT_VEC4 -> uniform4uiv gl location value
  | GlType.INT_VEC4 -> uniform4iv gl location value
  | GlType.FLOAT_VEC4 -> uniform4fv gl location value

  | GlType.FLOAT_MAT2 -> uniformMatrix2fv gl location value
  | GlType.FLOAT_MAT3 -> uniformMatrix3fv gl location value
  | GlType.FLOAT_MAT4 -> uniformMatrix4fv gl location value

  | GlType.FLOAT_MAT2x3 -> uniformMatrix2x3fv gl location value
  | GlType.FLOAT_MAT2x4 -> uniformMatrix2x4fv gl location value
  | GlType.FLOAT_MAT3x2 -> uniformMatrix3x2fv gl location value
  | GlType.FLOAT_MAT3x4 -> uniformMatrix3x4fv gl location value
  | GlType.FLOAT_MAT4x2 -> uniformMatrix4x2fv gl location value
  | GlType.FLOAT_MAT4x3 -> uniformMatrix4x3fv gl location value

  | GlType.Unknown -> raise (exn "Uniform type not initialized")
  | _ -> ()
  Debug.popIndent();

let rec update (data: GlUniformData) =
  let isActive = data.Info.Index >= 0

  if isActive && data.IsDirty then
    let d = Option.defaultValue data data.Link
    match d.ParentUbo with
    | Some _ -> ()
    | None -> updateSingle d.Value d data
  clean data

let setValue (value: obj) (data: GlUniformData) =
  match data.Link with
  | Some _ -> ()
  | None ->
      let value =
        match value with
        | :? Array -> value
        | _ -> [| unbox value |] :> obj
        |> asArray<float>

      let isRoot = data.RootUniform.IsNone
      let uniform = data.RootUniform |> Option.defaultValue data

      if isRoot then
        uniform.Value <- value
      else
        let info = data.Info
        let count = info.ElementCount * info.Length
        let uniformValue = uniform.Value |> asArray<float>
        // Getting fable compilation error using ConstrainedCopy.
        // Array.ConstrainedCopy(value, 0, uniformValue, info.StartIndex, count)
        let startIndex = info.StartIndex

        for i in [0 .. count - 1] do
          uniformValue.[startIndex + i] <- value.[i]
        ()

      match data.ParentUbo with
      | None -> ()
      | Some ubo -> updateUbo value ubo uniform

      dirty uniform
