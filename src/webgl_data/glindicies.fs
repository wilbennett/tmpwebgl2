module GlIndices

open Wil.Core.Utils
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Data
open Wil.Webgl.Types
open Wil.Webgl.Data

let private clean (data: GlIndicesData) =
  data.IsDirty <- false

let private dirty (data: GlIndicesData) =
  data.IsDirty <- true
  GlCommon.dirtyObject data.ParentObject

let private dirtyLinkedChildren (data: GlIndicesData) =
  data.LinkedChildren |> List.iter dirty

let private recalcNeeded (data: GlIndicesData) =
  data.RecalcNeeded <- true
  data.IsDirty <- true
  GlCommon.objectRecalcNeeded data.ParentObject

let private linkedChildrenRecalcNeeded (data: GlIndicesData) =
  data.LinkedChildren |> List.iter recalcNeeded

let private updateArrayCreator data =
  let arrayCreator =
    match data.IndicesType with
    | GlIndicesType.UNSIGNED_BYTE -> uint8ArrayFactory
    | GlIndicesType.UNSIGNED_SHORT -> uint16ArrayFactory
    | _ -> uint16ArrayFactory
  { data with ArrayCreator = arrayCreator }

let private initBuffer (data: GlIndicesData) =
  if data.Link.IsNone then
    data.Buffer.Init(GlBufferTarget.ELEMENT_ARRAY_BUFFER, data.BufferUsage, data.ArrayCreator)
    data.Buffer.SetValues(data.Values)
  data

let private updateCalcFlags (data: GlIndicesData) =
  {
    data with
      CalcDataCount = data.DataCount < 0
  }

let private linkTo (parent: GlIndicesData) (data: GlIndicesData) =
  parent.Buffer.AutoClean <- false
  let data = { data with Link = Some parent }
  parent.LinkedChildren <- data :: parent.LinkedChildren
  data

let private processLink objectName (data: GlIndicesData) =
  let globj = data.ParentObject.Scene |> GlCommon.getObject objectName
  match globj.Indices with
  | Some indices -> linkTo indices data
  | None -> throw $"Cannot link to undefined Indices of {globj.Name}."

let private apply props (data: GlIndicesData) =
  let rec loop props data =
    match props with
    | [] -> data
    | h::t ->
      match h with
      | IndexType x -> loop t { data with IndicesType = x }
      | IndexOffset x -> loop t { data with Offset = x }
      | IndexValues x -> loop t { data with Values = x }
      | IndexBufferUsage x -> loop t { data with BufferUsage = x }
      | IndicesLink x -> loop t (processLink x data)
  
  loop props data
  |> updateArrayCreator
  |> updateCalcFlags
  |> initBuffer

let private updateCalculated (data: GlIndicesData) =
  if data.RecalcNeeded then
    data.RecalcNeeded <- false

    if data.CalcDataCount then
      let newDataCount = data.Values.Length - data.Offset

      if newDataCount <> data.DataCount then
        data.DataCount <- data.Values.Length - data.Offset
        GlCommon.objectRecalcNeeded data.ParentObject
        linkedChildrenRecalcNeeded data

let create props (parentObject: GlObjData) =
  {
    Name = "Indices"
    IsDirty = true
    IndicesType = GlIndicesType.UNSIGNED_BYTE
    ArrayCreator = uint8ArrayFactory
    Offset = 0
    Values = [||]
    DataCount = -1
    BufferUsage = GlBufferUsage.STATIC_DRAW
    Buffer = GlBuffer(parentObject.Scene.Canvas.Context)
    ParentObject = parentObject
    Link = None
    LinkedChildren = []
    RecalcNeeded = true
    CalcDataCount = true
  }
  |> apply props

let delete (data: GlIndicesData) =
  data.Buffer.Delete()

let update (data: GlIndicesData) =
  if data.IsDirty then
    Debug.logIndent $"{data.ParentObject.Name}.{data.Name}.update"
    updateCalculated data
    clean data
    data.Buffer.Bind()
    data.Buffer.Update()
    Debug.popIndent()
