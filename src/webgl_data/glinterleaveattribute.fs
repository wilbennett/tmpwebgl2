module GlInterleaveAttribute

open Fable.Core
open Wil.Core.Utils
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open GlProgram

let rec private updateCalculated (data: GlAttributeData) =
  if data.RecalcNeeded then
    let vdata = Option.defaultValue data data.Link

    if data.CalcDataCount then
      let newDataCount = vdata.Values.Length / data.IndexStride

      if newDataCount <> data.DataCount then
        data.DataCount <- newDataCount
        GlAttribCommon.childrenRecalcNeeded data
        GlAttribCommon.linkedChildrenRecalcNeeded data

    let newByteSize = data.DataCount * data.Stride

    if newByteSize <> data.ByteSize then
      data.ByteSize <- newByteSize
      GlAttribCommon.childrenRecalcNeeded data
      GlAttribCommon.linkedChildrenRecalcNeeded data
    
    data.DataLength <- if data.CanSingleCopy then vdata.Values.Length else data.ByteSize
  data.RecalcNeeded <- false

let rec private getStride currStride children =
  match children with
  | [] -> currStride
  | c::remaining ->
      let childSize = if c.AdjustsStride then c.RecordSize else 0
      getStride (currStride + childSize) remaining

let rec private updateChildrenOffset currOffset (children: GlAttributeData list) =
  match children with
  | [] -> ()
  | child::remainingChildren ->
      child.Offset <- currOffset
      let nextOffset = child.Offset + child.RecordSize
      updateChildrenOffset nextOffset remainingChildren

let private updateChildrenStartIndex (data: GlAttributeData) =
  let rec loop existing currIndex children =
    match existing with
    | [] -> children
    | child::remaining ->
        if child.CalcOffset then
          let newChildren = { child with GlAttributeData.StartIndex = currIndex } :: children
          let nextIndex = currIndex + child.Info.TypeInfo.ElementCount
          loop remaining nextIndex newChildren
        else
          loop remaining currIndex (child :: children)

  let currIndex = data.Info.TypeInfo.ElementCount
  { data with ChildAttributes = loop data.ChildAttributes currIndex [] }

let private updateChildrenParentAttribute (data: GlAttributeData) =
  data.ChildAttributes |> List.iter (fun c -> c.ParentAttribute <- Some data)
  data

let createFrom (info: GlAttributeInfo) props (parentObject: GlObjData) =
  let data =
    {
      GlAttribCommon.defaultData info Interleave parentObject with
        Offset = 0
    }
    |> GlAttribCommon.updateCommonData props

  let siblings = data.ChildAttributes |> List.where (fun c -> c.CalcOffset)
  let strideSiblings = siblings |> List.where (fun c -> c.AdjustsStride)
  let strideSiblingSum projection = strideSiblings |> List.sumBy projection

  let calcStride = data.Stride <= 0
  let recordSize = data.RecordSize
  let stride = if calcStride then getStride recordSize strideSiblings else data.Stride

  updateChildrenOffset (data.Offset + data.RecordSize) siblings

  let ti = data.Info.TypeInfo
  let indexStride = ti.ElementCount + (strideSiblingSum (fun c -> c.Info.TypeInfo.ElementCount))
  let canSingleCopy = siblings |> List.forall (fun c -> c.BaseType = data.BaseType)

  if data.Link.IsNone then
    data.Buffer.Init(GlBufferTarget.ARRAY_BUFFER, data.BufferUsage, data.ArrayCreator)
    if canSingleCopy then data.Buffer.SetValues(data.Values)

  for child in data.ChildAttributes do
    let isDerived = not child.CalcOffset

    if child.CalcStride then
      child.Stride <- if isDerived then child.Info.TypeInfo.ByteSize else stride

  {
    data with
      ArrayCreator = if canSingleCopy then data.ArrayCreator else int8ArrayFactory
      IndexStride = indexStride
      Stride = stride
      CanSingleCopy = canSingleCopy
      CalcDataCount = data.DataCount < 0
      CalcStride = calcStride
      CalcOffset = data.Offset < 0
  }
  |> updateChildrenStartIndex
  |> updateChildrenParentAttribute
  |> InterleaveAttribute

let createEmpty name parentObject =
  let info = GlProgram.emptyAttributeInfo name
  InterleaveAttribute <| GlAttribCommon.defaultData info Interleave parentObject

let create name props (parentObject: GlObjData) =
  match GlProgram.getAttribute name parentObject.ProgramInfo with
  | Some info -> createFrom info props parentObject
  | None -> createEmpty name parentObject

let private copyData (data: GlAttributeData) =
  if data.Link.IsNone then
    let buffer = data.Buffer
    let values = data.Values
    let indexStride = data.IndexStride

    buffer.SetLength(data.DataLength)
    let view = JS.Constructors.DataView.Create(buffer.Data.buffer)

    let writeData dataType offset stride dataCount byteSize startIndex elementCount =
      let writer = getViewWriter dataType

      let rec loop index ofs i =
        match i with
        | 0 -> ()
        | _ ->
          for s in [0 .. elementCount - 1] do
            writer view (ofs + s * byteSize) values.[index + s] |> ignore
          loop (index + indexStride) (ofs + stride) (i - 1)
      loop startIndex offset dataCount
   
    let rec writeChildData startIndex (children: GlAttributeData list) =
      match children with
      | [] -> ()
      | c :: remainingChildren ->
          if c.CalcOffset then
            let baseByteSize = c.BaseTypeInfo.ByteSize
            writeData c.BaseType c.Offset c.Stride c.DataCount baseByteSize startIndex c.Info.TypeInfo.ElementCount
            writeChildData (startIndex + c.Info.TypeInfo.ElementCount) remainingChildren
          else
            writeChildData startIndex remainingChildren

    writeData data.BaseType data.Offset data.Stride data.DataCount data.BaseTypeInfo.ByteSize 0 data.Info.TypeInfo.ElementCount
    writeChildData data.Info.TypeInfo.ElementCount data.ChildAttributes
    buffer.DirtyRange(0, data.DataLength - 1)

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
  let shouldUpdate = data.ParentObject.ProcessLinked || data.LinkedChildren.Length > 0
  
  if data.IsDirty then
    Debug.logIndent $"{data.ParentObject.Name}.{data.Name}.update"
    if shouldUpdate then vdata.Buffer.Bind()
    let isActive = data.Info.Location >= 0

    if isActive then
      updateCalculated data
      enable data

    data.ChildAttributes |> List.iter GlInterleaveChildAttribute.update

    if shouldUpdate then
      if not data.CanSingleCopy then copyData data
      vdata.Buffer.Update()

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
  GlAttribCommon.childrenRecalcNeeded data

let _setValue index (value: obj) (data: GlAttributeData) =
  let value =
    match value with
    | :? System.Array -> value
    | _ -> [| unbox value |] :> obj
    |> asArray<float>

  let attribute = data.ParentAttribute |> Option.defaultValue data
  let startIndex = data.StartIndex + data.IndexStride * index
  let count = data.Info.TypeInfo.ElementCount
  // System.Array.ConstrainedCopy(value, 0, attribute.Values, startIndex, count)
  let dataValues = data.Values

  for i in [0 .. count - 1] do
    dataValues.[startIndex + i] <- value.[i]

  attribute.Buffer.SetValuesOffset(value, startIndex)
  GlAttribCommon.dirty attribute
