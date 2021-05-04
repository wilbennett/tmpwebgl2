namespace Wil.Webgl.Data

open Fable.Core
open Fable.Core.JsInterop
open Wil.Core.Utils
open Wil.Js.Debug
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.DataTypes

module GlDebug =
  let objFullName (data: GlObjData) =
    $"{data.Scene.Canvas.Name}.{data.Scene.Name}.{data.Name}"

  let private getUniformInfoTreeDesc (info: GlUniformInfo) =
    let offsetEnd =
      $" .. {info.Offset + info.ByteSize - 1}"

    info.Name
      + $" - {enumName GlTypeT info.Type}" + if info.IsArray then $"[{info.Length}]" else ""
      + $" [{info.StartIndex} .. {info.StartIndex + info.ElementCount * info.Length - 1}]"
      + if info.BlockIndex >= 0 then $" ({info.Offset}{offsetEnd})({info.Length})" else ""

  let private getUniformTreeDesc (data: GlUniformData) =
    let offsetEnd =
      if data.Data.length > 0
      then $" .. {data.Info.Offset + data.Data.byteLength - 1}"
      else ""

    data.Name
      + $" - {enumName GlTypeT data.Info.Type}" + if data.Info.IsArray then $"[{data.Info.Length}]" else ""
      + (data.RootUniform |> Option.executeDefault "" (fun u -> $" Root: {u.Name}"))
      + (data.RootUniform |> Option.executeDefault $" ({(data.Value :?> float[]).Length})" (fun u -> $""))
      + $" [{data.Info.StartIndex} .. {data.Info.StartIndex + data.Info.ElementCount * data.Info.Length - 1}]"
      + if data.Info.BlockIndex >= 0 then $" ({data.Info.Offset}{offsetEnd})({data.Data.length})" else ""

  let rec logUniformData (data: GlUniformData) =
    log $"{data.Name}"
    pushIndent()

    loga [
      $"IsActive = {data.Info.Index >= 0}"
      // $"IsDirty = {data.IsDirty}"
      // $"IsShared = {data.IsShared}"
      $"IsUbo = {data.ParentUbo.IsSome}"
      $"Location = {data.Info.Location}"
      $"Type = {enumName GlTypeT data.Info.Type}"
      $"ByteSize = {data.Info.ByteSize}"
      $"Offset = {data.Info.Offset}"
      $"Value = {data.Value}"
    ]
    pushIndent()
    data.ChildUniforms |> Array.iter logUniformData
    popIndent()
    popIndent()

  let rec private getUniformDataEntries (data: GlUniformData) =
    let hasParentUbo = data.ParentUbo.IsSome
    let hasRootUniform = data.RootUniform.IsSome
    let isChild = hasRootUniform
    seq {
      yield [
        "Ubo", (if hasParentUbo then data.ParentUbo.Value.Name else null) :> obj
        "Name", (if isChild then null else data.Name) :> obj
        "ChildName", (if isChild then data.Name else null) :> obj
        "Location", data.Info.Location :> obj
        "ByteSize", data.Info.ByteSize :> obj
        "Offset", data.Info.Offset :> obj
        "Index", data.Info.Index :> obj
        "Type", enumName GlTypeT data.Info.Type :> obj
        "IsArray", data.Info.IsArray :> obj
        "Length", data.Info.Length :> obj
        "Data", data.Data :> obj
        "Value", data.Value
        // "IsActive", data.Info.Index >= 0 :> obj
        // "IsShared", data.IsShared :> obj
        // "IsUbo", data.IsUbo :> obj
      ]

      if data.ChildUniforms.Length > 0 then
        yield! data.ChildUniforms |> Array.map getUniformDataEntries |> Seq.concat
    }

  let private getUboInfoTreeDesc (info: GlUboInfo) =
    $"UBO {info.Name} ({info.BlockIndex}) {info.ByteSize} bytes"

  let private getUboTreeDesc (data: GlUboData) =
    $"UBO {data.Name} ({data.Info.BlockIndex}) {data.Info.ByteSize} bytes"

  let logUboData (data: GlUboData) =
    log $"{data.Name}"
    pushIndent()

    loga [
      // $"IsDirty = {data.IsDirty}"
      // $"IsShared = {data.IsShared}"
      $"Location = {data.Location}"
      $"ByteSize = {data.Info.ByteSize}"
      $"Data ({data.Buffer.Data.byteLength}) = {clipObj 20 data.Buffer.Data}"
    ]
    data.Uniforms |> List.iter logUniformData
    popIndent()

  let private getUboDataEntry (data: GlUboData) =
    seq {
      yield [
      "Ubo", data.Name :> obj
      "Name", null :> obj
      "ChildName", null :> obj
      "Location", data.Location :> obj
      "ByteSize", data.Info.ByteSize :> obj
      "Data", data.Data :> obj
      "Value", null :> obj
      // "IsDirty", data.IsDirty :> obj
      // "IsShared", data.IsShared :> obj
      ]

      yield! data.Uniforms |> List.map getUniformDataEntries |> Seq.concat
    }

  let logSingleAttributeData (data: GlAttributeData) =
    log $"Single {data.Name}"
    pushIndent()

    loga [
      // $"IsDirty = {data.IsDirty}"
      $"Location = {data.Info.Location}"
      $"AttrType = {enumName GlTypeT data.Info.Type}"
      $"BaseType = {enumName GlTypeT data.BaseType}"
      $"ElementCount = {data.Info.TypeInfo.ElementCount}"
      $"RecordSize = {data.RecordSize}"
      $"DataCount = {data.DataCount}"
      $"Stride = {data.Stride}"
      $"Offset = {data.Offset}"
      $"StartIndex = {data.StartIndex}"
      $"Values ({data.Values.Length}) = {clipArray 20 data.Values}"
      $"Data ({data.Buffer.Data.byteLength}) = {clipObj 20 data.Buffer.Data}"
      $"DeterminesVertexCount = {data.DeterminesVertexCount}"
      $"DeterminesInstanceCount = {data.DeterminesInstanceCount}"
      $"Divisor = {data.Divisor}"
      $"Normalize = {data.Normalize}"
      $"BufferUsage = {enumName GlBufferUsageT data.BufferUsage}"
      $"CalcDataCount = {data.CalcDataCount}"
    ]
    popIndent()

  let private getSingleAttributeDataEntry (data: GlAttributeData) =
    [
      "Name", data.Name :> obj
      "ChildName", null :> obj
      "Location", data.Info.Location :> obj
      "DataCount", data.DataCount :> obj
      "Stride", data.Stride :> obj
      "Offset", data.Offset :> obj
      "StartIndex", data.StartIndex :> obj
      "Divisor", data.Divisor :> obj
      "Type", enumName GlTypeT data.Info.Type :> obj
      "RecordSize", data.RecordSize :> obj
      "ByteSize", data.ByteSize :> obj
      "DeterminesInstanceCount", data.DeterminesInstanceCount :> obj
      // "IsActive", data.IsActive :> obj
      // "IsShared", data.IsShared :> obj
      // "BaseType", enumName GlTypeT data.BaseType :> obj
      // "ElementCount", data.ElementCount :> obj
      // $"Values ({data.Values.Length})", clipArray 20 data.Values :> obj
      // $"Data ({data.Buffer.Data.byteLength})", clipObj 20 data.Buffer.Data :> obj
      // "DeterminesVertexCount", data.DeterminesVertexCount :> obj
      // "Normalize", data.Normalize :> obj
      // "BufferUsage", enumName GlBufferUsageT data.BufferUsage :> obj
      // "CalcDataCount", data.CalcDataCount :> obj
    ]

  let logIndexAttributeData (data: GlIndicesData) =
    log $"{data.Name}"
    pushIndent()

    loga [
      // $"IsDirty = {data.IsDirty}"
      $"Type = {enumName GlIndicesTypeT data.IndicesType}"
      $"Offset = {data.Offset}"
      $"Values ({data.Values.Length}) = {clipArray 20 data.Values}"
      $"Data ({data.Buffer.Data.byteLength}) = {clipObj 20 data.Buffer.Data}"
      $"DataCount = {data.DataCount}"
      $"BufferUsage = {enumName GlBufferUsageT data.BufferUsage}"
    ]
    popIndent()

  let private getIndexAttributeDataEntry (data: GlIndicesData) =
    [
      "Name", data.Name :> obj
      "DataCount", data.DataCount :> obj
      "Type", enumName GlIndicesTypeT data.IndicesType :> obj
      "Offset", data.Offset :> obj
      // $"Values ({data.Values.Length})", clipArray 20 data.Values :> obj
      // $"Data ({data.Buffer.Data.byteLength})", clipObj 20 data.Buffer.Data :> obj
      // "BufferUsage", enumName GlBufferUsageT data.BufferUsage :> obj
    ]

  let logInterleaveAttributeData (data: GlAttributeData) =
    log $"Interleave {data.Name}"
    pushIndent()

    loga [
      // $"IsDirty = {data.IsDirty}"
      $"Location = {data.Info.Location}"
      $"AttrType = {enumName GlTypeT data.Info.Type}"
      $"BaseType = {enumName GlTypeT data.BaseType}"
      $"ElementCount = {data.Info.TypeInfo.ElementCount}"
      $"RecordSize = {data.RecordSize}"
      $"ByteSize = {data.ByteSize}"
      $"DataCount = {data.DataCount}"
      $"DataLength = {data.DataLength}"
      $"IndexStride = {data.IndexStride}"
      $"Stride = {data.Stride}"
      $"Offset = {data.Offset}"
      $"StartIndex = {data.StartIndex}"
      $"Values ({data.Values.Length}) = {clipArray 20 data.Values}"
      $"Data ({data.Buffer.Data.byteLength}) = {clipObj 20 data.Buffer.Data}"
      $"DeterminesVertexCount = {data.DeterminesVertexCount}"
      $"DeterminesInstanceCount = {data.DeterminesInstanceCount}"
      $"Divisor = {data.Divisor}"
      $"Normalize = {data.Normalize}"
      $"BufferUsage = {enumName GlBufferUsageT data.BufferUsage}"
      $"CanSingleCopy = {data.CanSingleCopy}"
      $"CalcStride = {data.CalcStride}"
      $"CalcDataCount = {data.CalcDataCount}"
    ]
    popIndent()

  let private getInterleaveAttributeDataEntry (data: GlAttributeData) =
    [
      "Name", data.Name :> obj
      "ChildName", null :> obj
      "Kind", data.Kind.ToString() :> obj
      "Location", data.Info.Location :> obj
      "DataCount", data.DataCount :> obj
      "Stride", data.Stride :> obj
      "Offset", data.Offset :> obj
      "StartIndex", data.StartIndex :> obj
      "Divisor", data.Divisor :> obj
      "SingleCopy", data.CanSingleCopy :> obj
      "Type", enumName GlTypeT data.Info.Type :> obj
      "RecordSize", data.RecordSize :> obj
      "ByteSize", data.ByteSize :> obj
      "DeterminesInstanceCount", data.DeterminesInstanceCount :> obj
      // "DeterminesVertexCount", data.DeterminesVertexCount :> obj
      // "IsActive", data.IsActive :> obj
      // "IsShared", data.IsShared :> obj
      // "BaseType", enumName GlTypeT data.BaseType :> obj
      // "ElementCount", data.ElementCount :> obj
      // "DataLength", data.DataLength :> obj
      // "IndexStride", data.IndexStride :> obj
      // $"Values ({data.Values.Length})", clipArray 20 data.Values :> obj
      // $"Data ({data.Buffer.Data.byteLength})", clipObj 20 data.Buffer.Data :> obj
      // "Normalize", data.Normalize :> obj
      // "BufferUsage", enumName GlBufferUsageT data.BufferUsage :> obj
      // "CalcStride", data.CalcStride :> obj
      // "CalcDataCount", data.CalcDataCount :> obj
    ]

  let logInterleaveChilAttributeData (data: GlAttributeData) =
    log $"Interleave child {data.Name}"
    pushIndent()

    loga [
      // $"IsDirty = {data.IsDirty}"
      $"Location = {data.Info.Location}"
      $"AttrType = {enumName GlTypeT data.Info.Type}"
      $"BaseType = {enumName GlTypeT data.BaseType}"
      $"ElementCount = {data.Info.TypeInfo.ElementCount}"
      $"RecordSize = {data.RecordSize}"
      $"DataCount = {data.DataCount}"
      $"Stride = {data.Stride}"
      $"Offset = {data.Offset}"
      $"StartIndex = {data.StartIndex}"
      $"DeterminesVertexCount = {data.DeterminesVertexCount}"
      $"DeterminesInstanceCount = {data.DeterminesInstanceCount}"
      $"Divisor = {data.Divisor}"
      $"Normalize = {data.Normalize}"
      $"BufferUsage = {enumName GlBufferUsageT data.BufferUsage}"
      $"CalcStride = {data.CalcStride}"
      $"CalcOffset = {data.CalcOffset}"
      $"CalcDataCount = {data.CalcDataCount}"
    ]
    popIndent()

  let private getInterleaveChilAttributeDataEntry (data: GlAttributeData) =
    [
      "Name", "" :> obj
      "Kind", data.Kind.ToString() :> obj
      "ChildName", data.Name :> obj
      "Location", data.Info.Location :> obj
      "DataCount", data.DataCount :> obj
      "Stride", data.Stride :> obj
      "Offset", data.Offset :> obj
      "StartIndex", data.StartIndex :> obj
      "Divisor", data.Divisor :> obj
      "Type", enumName GlTypeT data.Info.Type :> obj
      "RecordSize", data.RecordSize :> obj
      // "IsActive", data.IsActive :> obj
      // "IsShared", data.IsShared :> obj
      // "BaseType", enumName GlTypeT data.BaseType :> obj
      // "ElementCount", data.ElementCount :> obj
      // "DeterminesVertexCount", data.DeterminesVertexCount :> obj
      // "DeterminesInstanceCount", data.DeterminesInstanceCount :> obj
      // "Normalize", data.Normalize :> obj
      // "BufferUsage", enumName GlBufferUsageT data.BufferUsage :> obj
      // "CalcStride", data.CalcStride :> obj
      // "CalcOffset", data.CalcOffset :> obj
      // "CalcDataCount", data.CalcDataCount :> obj
    ]

  let logRootAttribute (attrib: GlRootAttribute) =
    match attrib with
    | SingleAttribute data ->
        logSingleAttributeData data
    | InterleaveAttribute data ->
        logInterleaveAttributeData data
        pushIndent()
        data.ChildAttributes |> List.iter logInterleaveChilAttributeData
        popIndent()

  let private getRootAttributeEntries (attrib: GlRootAttribute) =
    seq {
      match attrib with
      | SingleAttribute data ->
          yield getSingleAttributeDataEntry data
      | InterleaveAttribute data ->
          yield getInterleaveAttributeDataEntry data
          let childEntries =
            data.ChildAttributes
            |> List.map getInterleaveChilAttributeDataEntry
          yield! childEntries
    }
    |> List.ofSeq

  let private getTexturePixels (data: GlTextureData) =
    match data.Pixels with
    | PixelData x -> x :> obj
    | PixelImageData x -> x :> obj
    | PixelHtmlImage x -> x :> obj
    | PixelCanvas x -> x :> obj
    | PixelVideo x -> x :> obj
    | PixelBitmap x -> x :> obj

  let logTextureData (data: GlTextureData) =
    logIndent $"{data.Name}"

    loga [
      $"Name = {data.Name}"
      // $"IsDirty = {data.IsDirty}"
      // $"IsShared = {data.IsShared}"
      $"Location = {data.Index}"
      $"Level = {data.Level}"
      $"InternalFormat = {enumName GlColorFormatT data.InternalFormat}"
      $"Format = {enumName GlColorFormatT data.Format}"
      $"Width = {data.Width}"
      $"Height = {data.Height}"
      $"DataType = {enumName GlTextureTypeT data.DataType}"
      $"Pixels = {getTexturePixels data}"
      $"Offset = {data.Offset}"
    ]
    popIndent()

  let private getTextureDataEntries (data: GlTextureData) =
    seq {
      yield [
        "Name", data.Name :> obj
        "Location", data.Index :> obj
        "Level", data.Level :> obj
        "Internal", enumName GlColorFormatT data.InternalFormat :> obj
        "Format", enumName GlColorFormatT data.Format :> obj
        "Width", data.Width :> obj
        "Height", data.Height :> obj
        "Type", enumName GlTextureTypeT data.DataType :> obj
        "Pixels", getTexturePixels data
        "Offset", data.Offset :> obj
      ]
    }

  let private toJsObjPair (key, value) = (key, box value)

  let private entryToJsObject entry =
    entry
    |> Seq.map toJsObjPair
    |> createObj

  let private entriesToJsObjects entries =
    entries
    |> Seq.map entryToJsObject
    |> Array.ofSeq

  let private consoleTable o = JS.console.table(o)

  let logUniforms uniforms = uniforms |> List.iter logUniformData
  let logUbos ubos = ubos |> List.iter logUboData
  let logAttributes attributes = attributes |> List.iter logRootAttribute
  let logIndices indices = indices |> logIndexAttributeData
  let logTextures textures = textures |> List.iter logTextureData

  let tableUniforms uniforms =
    uniforms
    |> Seq.collect getUniformDataEntries
    |> entriesToJsObjects
    |> consoleTable

  let tableUbos ubos =
    ubos
    |> Seq.collect getUboDataEntry
    |> entriesToJsObjects
    |> consoleTable

  let tableUbosAndUniforms ubos uniforms =
    seq {
      yield! ubos |> List.map getUboDataEntry |> Seq.concat
      yield! uniforms |> List.map getUniformDataEntries |> Seq.concat
    }
    |> entriesToJsObjects
    |> consoleTable

  let tableAttributes attributes =
    attributes
    |> List.collect getRootAttributeEntries
    |> entriesToJsObjects
    |> consoleTable

  let tableIndices indices =
    indices
    |> Seq.collect (getIndexAttributeDataEntry >> Seq.of1)
    |> entriesToJsObjects
    |> consoleTable

  let tableAttributesAndIndices attributes indices =
    seq {
      yield! attributes |> List.map getRootAttributeEntries |> Seq.concat
      yield! indices |> Seq.collect (getIndexAttributeDataEntry >> Seq.of1)
    }
    |> entriesToJsObjects
    |> consoleTable

  let tableTextures textures =
    textures
    |> Seq.collect getTextureDataEntries
    |> entriesToJsObjects
    |> consoleTable

  let logUniformInfoTree (info: GlUniformInfo) =
    let rec loop (info: GlUniformInfo) =
      logIndent <| getUniformInfoTreeDesc info
      match info.Children with
      | [||] -> ()
      | children -> children |> Array.iter loop
      popIndent()
    loop info

  let logUboInfoTree (info: GlUboInfo) =
    logIndent <| getUboInfoTreeDesc info
    info.Uniforms |> List.iter logUniformInfoTree
    popIndent()

  let logUniformTree (data: GlUniformData) =
    let rec loop (data: GlUniformData) =
      logIndent <| getUniformTreeDesc data
      match data.ChildUniforms with
      | [||] -> ()
      | children -> children |> Array.iter loop
      popIndent()
    loop data

  let logUboTree (data: GlUboData) =
    logIndent <| getUboTreeDesc data
    data.Uniforms |> List.iter logUniformTree
    popIndent()

  let logUniformInfosTree uniforms = uniforms |> Seq.iter logUniformInfoTree
  let logUboInfosTree ubos = ubos |> Seq.iter logUboInfoTree
  let logUniformsTree uniforms = uniforms |> Seq.iter logUniformTree
  let logUbosTree ubos = ubos |> Seq.iter logUboTree

  let logObjDef (data: GlObjData) =
    logIndent $"{data.Name} Info"
    loga [
      $"DrawMethod = {data.DrawMethod}"
      $"DrawPrimitive = {enumName GlDrawPrimitiveT data.DrawPrimitive}"
      $"VertexCount = {data.VertexCount}"
      $"VertexOffset = {data.VertexOffset}"
      $"VertexCountOffset = {data.VertexCountOffset}"
      $"InstanceCount = {data.InstanceCount}"
      $"InstanceOffset = {data.InstanceOffset}"
      $"InstanceCountOffset = {data.InstanceCountOffset}"
      $"IndicesOffset = {data.IndicesOffset}"
    ]

    data.Uniforms |> logUniforms
    data.Ubos |> logUbos
    data.Attributes |> logAttributes
    data.Indices |> Option.call logIndices
    data.Textures |> logTextures
    popIndent()

  let tableObjDef (data: GlObjData) =
    jsGroup $"{objFullName data} Info"
    [[
      "Method", data.DrawMethod.ToString() :> obj
      "Primitive", enumName GlDrawPrimitiveT data.DrawPrimitive :> obj
      "Verticies", data.VertexCount :> obj
      "VertexStart", data.VertexOffset :> obj
      "VerticiesOffset", data.VertexCountOffset :> obj
      "Instances", data.InstanceCount :> obj
      "InstanceStart", data.InstanceOffset :> obj
      "InstancesOffset", data.InstanceCountOffset :> obj
      "IndicesOffset", data.IndicesOffset :> obj
    ]]
    |> entriesToJsObjects
    |> consoleTable

    jsGroupEnd()

  let tableObjDefAndContents (data: GlObjData) =
    tableObjDef data
    jsGroup $"{objFullName data} Info"

    let indices = data.Indices |> Option.executeDefault Seq.empty<_> Seq.of1
    tableUbosAndUniforms data.Ubos data.Uniforms
    tableAttributesAndIndices data.Attributes indices
    tableTextures data.Textures
    jsGroupEnd()
