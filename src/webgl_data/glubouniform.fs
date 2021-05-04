module GlUboUniform

open Fable.Core
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open GlProgram
open GlUniform

let private isActiveUbo (ubo: GlUboData) = ubo.Info.BlockIndex >= 0

let rec private init (data: GlUniformData) =
  match data.Link with
  | Some _ -> ()
  | None ->
      match data.ParentUbo with
      | Some ubo ->
          GlUniform.clean data

          if data.ChildUniforms.Length > 0 then
            data.ChildUniforms |> Array.iter (init >> ignore)
          else
            if isActiveUbo ubo then
              let value =
                match data.RootUniform with
                | Some root -> root.Value
                | None -> data.Value

              GlUniform.updateUbo value ubo data
      | None -> ()
  data

let createFrom (info: GlUniformInfo) props (parentUbo: GlUboData) parentObject =
  let rec doCreate props (info: GlUniformInfo) rootUniform =
    let createChild info = doCreate [] info

    let dataArray =
      match info.Children with
      | [||] -> 
          let arrayBuffer = parentUbo.Data.buffer
          let length = info.ElementCount * info.Length
          // The following gets the full buffer length.
          //let bti = getGlTypeInfo info.TypeInfo.BaseType
          //let length = info.ByteSize / bti.ByteSize
          info.TypeInfo.TypeArrayCreator.Create(arrayBuffer, info.Offset, length)
      | _ -> emptyFloat32Array :> JS.TypedArray

    {
      LinkTo = None
      ChildCreators = info.Children |> List.ofArray |> List.map createChild
      Data = {
        Id = 0
        Info = info
        IsDirty = true
        Data = dataArray
        Value = 0.0
        ParentObject = parentObject
        ParentUbo = Some parentUbo
        RootUniform = rootUniform
        ChildUniforms = [||]
        Link = None
        LinkedChildren = []
      }
    }
    |> _apply props
    |> _build

  doCreate props info None
  |> init
  
let private createEmpty name parentUbo rootUniform parentObject =
  {
    Id = 0
    Info = GlProgram.emptyUniformInfo name
    IsDirty = false
    Data = emptyFloat32Array
    Value = 0.0
    ParentObject = parentObject
    ParentUbo = Some parentUbo
    RootUniform = rootUniform
    ChildUniforms = [||]
    Link = None
    LinkedChildren = []
  }

let create name props parentUbo (parentObject: GlObjData) =
  match GlProgram.getUniform name parentObject.ProgramInfo with
  | Some info -> createFrom info props parentUbo parentObject
  | None -> createEmpty name parentUbo None parentObject
