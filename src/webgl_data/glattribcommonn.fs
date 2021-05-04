namespace Wil.Webgl.Data

open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core

module GlAttribCommon =
  let defaultData info kind (parentObject: GlObjData) =
    {
      Id = 0
      Kind = kind
      Info = info
      IsDirty = true
      BaseType = GlType.Unknown
      ArrayCreator = float32ArrayFactory
      RecordSize = -1
      ByteSize = -1
      DataLength = -1
      BaseTypeInfo = getGlTypeInfo GlType.FLOAT
      Normalize = false
      StartIndex = 0
      IndexStride = -1
      Stride = -1
      Offset = -1
      Values = [||]
      DataCount = -1
      BufferUsage = GlBufferUsage.STATIC_DRAW
      DeterminesVertexCount = false
      DeterminesInstanceCount = false
      Divisor = -1
      Buffer = GlBuffer(parentObject.Scene.Canvas.Context)
      ChildAttributes = []
      ParentObject = parentObject
      ParentAttribute = None
      Link = None
      LinkedChildren = []
      AdjustsStride = true
      CanSingleCopy = false
      EnableNeeded = true
      RecalcNeeded = true
      CalcStride = true
      CalcOffset = true
      CalcDataCount = true
    }

  let private addLinkedChild (parent: GlAttributeData) (data: GlAttributeData) =
    parent.LinkedChildren <- data :: parent.LinkedChildren
    data

  let private linkTo (parent: GlAttributeData) (data: GlAttributeData) =
    parent.Buffer.AutoClean <- false
    
    {
      data with
        Values = [||]
        Link = Some parent
    }
    |> addLinkedChild parent

  let private processLink name (data: GlAttributeData) =
    let (objectName, attributeName) = GlCommon.splitName name
    let globj = data.ParentObject.Scene |> GlCommon.getObject objectName
    let attribute = globj |> GlCommon.getAttribute attributeName
    linkTo attribute data

  let rec updateCommonData props (data: GlAttributeData) =
    let updateCommon (data: GlAttributeData) =
      let baseType = if data.BaseType = GlType.Unknown then data.Info.TypeInfo.BaseType else data.BaseType
      let baseTypeInfo = getGlTypeInfo baseType

      let res = {
        data with
          BaseType = baseType
          BaseTypeInfo = baseTypeInfo
          ArrayCreator = data.Info.TypeInfo.TypeArrayCreator
          RecordSize = data.Info.TypeInfo.ElementCount * baseTypeInfo.ByteSize
      }
      res

    let rec createChildren (childCreators: GlChildAttributeFactory list) (parent: GlAttributeData) parentObject =
      childCreators |> List.map (fun creator -> creator [] parent parentObject)

    let apply props data =
      let rec loop props children data =
        match props with
        | [] ->
            let childAttributes = createChildren (children |> List.rev) data data.ParentObject
            { data with ChildAttributes = childAttributes }
        | h::t ->
          match h with
          | BaseType x -> loop t children { data with BaseType = x }
          | Normalize -> loop t children { data with Normalize = true }
          | Stride x -> loop t children { data with Stride = x }
          | DontAdjustStride -> loop t children { data with AdjustsStride = false }
          | Offset x -> loop t children { data with Offset = x }
          | Values x -> loop t children { data with Values = x }
          | DataCount x -> loop t children { data with DataCount = x }
          | BufferUsage x -> loop t children { data with BufferUsage = x }
          | DeterminesVertexCount -> loop t children { data with DeterminesVertexCount = true }
          | DeterminesInstanceCount -> loop t children { data with DeterminesInstanceCount = true }
          | Divisor x -> loop t children { data with Divisor = x }
          | ChildAttribute x -> loop t (x :: children) data
          | AttributeLink x -> loop t children (processLink x data)
      loop props [] data

    data
    |> apply props
    |> updateCommon

  let clean (data: GlAttributeData) =
    data.IsDirty <- false
    data.RecalcNeeded <- false
    data.EnableNeeded <- false

  let dirty (data: GlAttributeData) =
    data.IsDirty <- true
    let attribute = data.ParentAttribute |> Option.defaultValue data
    attribute.IsDirty <- true
    GlCommon.dirtyObject attribute.ParentObject

  let dirtyLinkedChildren (data: GlAttributeData) =
    data.LinkedChildren |> List.iter dirty

  let enableNeeded (data: GlAttributeData) =
    data.EnableNeeded <- true
    dirty data

  let linkedChildrenEnableNeeded (data: GlAttributeData) =
    data.LinkedChildren |> List.iter enableNeeded

  let recalcNeeded (data: GlAttributeData) =
    data.RecalcNeeded <- true
    let attribute = data.ParentAttribute |> Option.defaultValue data
    attribute.RecalcNeeded <- true
    data.ParentObject.RecalcNeeded <- true
    dirty data

  let linkedChildrenRecalcNeeded (data: GlAttributeData) =
    data.LinkedChildren |> List.iter recalcNeeded

  let childrenDirty data = data.ChildAttributes |> List.iter dirty
  let childrenEnableNeeded data = data.ChildAttributes |> List.iter enableNeeded
  let childrenRecalcNeeded data = data.ChildAttributes |> List.iter recalcNeeded

  let rec createLinked (data: GlAttributeData) (parentObject: GlObjData) =
    let linkChildren (data: GlAttributeData) =
      let children = data.ChildAttributes |> List.map (fun d -> createLinked d parentObject)
      { data with ChildAttributes = children }
    
    let updateChildrenParentAttribute (data: GlAttributeData) =
      let parent = Some data
      data.ChildAttributes |> List.iter (fun c -> c.ParentAttribute <- parent)
      data

    data.Buffer.AutoClean <- false

    {
      data with
        Info = GlProgram.getAttributeOrDefault data.Name parentObject.ProgramInfo
        ParentObject = parentObject
        Link = Some data
        LinkedChildren = []
        Values = [||]
    }
    |> linkChildren
    |> updateChildrenParentAttribute
    |> addLinkedChild data
