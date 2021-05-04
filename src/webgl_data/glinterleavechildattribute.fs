module GlInterleaveChildAttribute

open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open GlProgram

let rec private updateCalculated (data: GlAttributeData) =
  if data.RecalcNeeded then
    data.RecalcNeeded <- false

    match data.ParentAttribute with
    | None -> ()
    | Some pdata ->
        if data.CalcDataCount then
          let vdata = Option.defaultValue pdata pdata.Link
          let parentSize = vdata.ByteSize

          let newDataCount =
            ceil(float (parentSize - data.Offset) / float data.Stride) |> int

          if newDataCount <> data.DataCount then
            data.DataCount <- newDataCount
            GlCommon.objectRecalcNeeded data.ParentObject
            GlAttribCommon.linkedChildrenRecalcNeeded data

let createFrom (info: GlAttributeInfo) props (parentAttribute: GlAttributeData) parentObject =
  let data =
    {
      GlAttribCommon.defaultData info InterleaveChild parentObject with
        ParentAttribute = Some parentAttribute
    }
    |> GlAttribCommon.updateCommonData props

  let ti = data.Info.TypeInfo
  let calcStride = data.Stride <= 0 
  let stride = if calcStride then ti.ByteSize else data.Stride

  {
    data with
      Stride = stride
      CalcDataCount = data.DataCount < 0
      CalcStride = calcStride
      CalcOffset = data.Offset < 0
      AdjustsStride = data.AdjustsStride && data.Offset < 0
  }

let createEmpty name (parentAttribute: GlAttributeData) parentObject =
  let info = GlProgram.emptyAttributeInfo name

  {
    GlAttribCommon.defaultData info InterleaveChild parentObject with
      ParentAttribute = Some parentAttribute
  }

let create name props parentAttribute (parentObject: GlObjData) =
  match GlProgram.getAttribute name parentObject.ProgramInfo with
  | Some info -> createFrom info props parentAttribute parentObject
  | None -> createEmpty name parentAttribute parentObject

let update (data: GlAttributeData) =
  let isActive = data.Info.Location >= 0

  if isActive && data.IsDirty then
    Debug.logIndent $"{data.ParentObject.Name}.{data.Name}.Update"
    updateCalculated data

    if data.EnableNeeded then
      data.EnableNeeded <- false

      if data.ParentObject.ProcessLinked || data.LinkedChildren.Length = 0 then
        let gl = data.ParentObject.Scene.Canvas.Context
        let location = float data.Info.Location

        if location >= 0.0 then
          enableVertexAttribArray gl location
          vertexAttribPointer gl location data.Info.TypeInfo.ElementCount data.BaseType data.Normalize data.Stride data.Offset
          if data.Divisor >= 0 then vertexAttribDivisor gl location data.Divisor

    GlAttribCommon.clean data
    Debug.popIndent()
