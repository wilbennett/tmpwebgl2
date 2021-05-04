module GlSingleAttribute

open Wil.Core.Utils
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data

let rec private updateCalculated (data: GlAttributeData) =
  if data.RecalcNeeded then
    data.RecalcNeeded <- false
    let vdata = Option.defaultValue data data.Link
    
    if data.CalcDataCount then
      let ti = data.Info.TypeInfo
      let totValuesByteSize = vdata.Values.Length / ti.ElementCount * ti.ByteSize
      let valuesByteSize = totValuesByteSize - data.Offset
      data.DataCount <- ceil(float valuesByteSize / float data.Stride) |> int

    data.ByteSize <- data.DataCount * data.Stride

let createFrom info props parentObject =
  let data =
    {
      GlAttribCommon.defaultData info Single parentObject with
        Offset = 0
        CalcOffset = false
    }
    |> GlAttribCommon.updateCommonData props

  let ti = data.Info.TypeInfo
  let stride = if data.Stride <= 0 then ti.ByteSize else data.Stride
  
  if data.Link.IsNone then
    let buffer = data.Buffer
    buffer.Init(GlBufferTarget.ARRAY_BUFFER, data.BufferUsage, data.ArrayCreator)
    buffer.SetValues(data.Values)

  {
    data with
      Stride = stride
      CalcDataCount = data.DataCount < 0
  }
  |> SingleAttribute

let createEmpty name parentObject =
  let info = GlProgram.emptyAttributeInfo name
  SingleAttribute <| GlAttribCommon.defaultData info Single parentObject

let create name props (parentObject: GlObjData) =
  match GlProgram.getAttribute name parentObject.ProgramInfo with
  | Some info -> createFrom info props parentObject
  | None -> createEmpty name parentObject

let private enable (data: GlAttributeData) =
  if data.EnableNeeded then
    data.EnableNeeded <- false

    if data.ParentObject.ProcessLinked || data.LinkedChildren.Length = 0 then
      let gl = data.ParentObject.Scene.Canvas.Context
      let location = float data.Info.Location

      if location >= 0.0 then
        enableVertexAttribArray gl location
        vertexAttribPointer gl location data.Info.TypeInfo.ElementCount data.BaseType data.Normalize data.Stride data.Offset
        if data.Divisor >= 0 then vertexAttribDivisor gl location data.Divisor

let update (data: GlAttributeData) =
  let vdata = Option.defaultValue data data.Link
  let hasLinked = data.LinkedChildren.Length > 0
  let isActive = data.Info.Location >= 0

  if isActive && data.IsDirty then
    Debug.logIndent $"{data.ParentObject.Name}.{data.Name}.update"
    updateCalculated data

    if data.ParentObject.ProcessLinked || not hasLinked then
      vdata.Buffer.Bind()
      vdata.Buffer.Update()
      enable data

    GlAttribCommon.clean data
    Debug.popIndent()

let _setValues (values: obj) (data: GlAttributeData) =
  let values =
    match values with
    | :? System.Array -> values
    | _ -> [| unbox values |] :> obj
    |> asArray<float>

  data.Values <- values
  data.Buffer.SetValues(values)
  GlAttribCommon.recalcNeeded data
  GlAttribCommon.linkedChildrenRecalcNeeded data

let _setValue index (value: obj) (data: GlAttributeData) =
  let value =
    match value with
    | :? System.Array -> value
    | _ -> [| unbox value |] :> obj
    |> asArray<float>

  let count = data.Info.TypeInfo.ElementCount
  let startIndex = count * index
  // System.Array.ConstrainedCopy(value, 0, data.Values, startIndex, count)
  let dataValues = data.Values

  for i in [0 .. count - 1] do
    dataValues.[startIndex + i] <- value.[i]

  data.Buffer.SetValuesOffset(value, startIndex)
  GlAttribCommon.dirty data
  GlAttribCommon.dirtyLinkedChildren data
