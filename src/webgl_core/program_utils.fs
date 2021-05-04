namespace Wil.Webgl.Core

open Browser.Types
open Wil.Webgl.Types

type GlUniformInfo = {
  Index: int
  Name: string
  RootName: string
  Location: WebGLUniformLocation
  Type: GlType
  TypeInfo: GlTypeInfo
  ElementCount: int
  ByteSize: int
  Length: int
  ArrayIndex: int
  StartIndex: int
  IsArray: bool
  BlockIndex: int
  Offset: int
  ArrayStride: int
  MatrixStride: int
  IsRowMajor: bool
  Children: GlUniformInfo[]
}

type GlUboInfo = {
  Name: string
  BlockIndex: int
  ByteSize: int
  InVertexShader: bool
  InFragmentShader: bool
  Uniforms: GlUniformInfo list
}

type GlAttributeInfo = {
  Index: int
  Name: string
  Location: int
  Type: GlType
  TypeInfo: GlTypeInfo
}

type GlShader = {
  ShaderId: string
  Shader: WebGLShader
  mutable ReferenceCount: int
}

type GlShaderSet = {
  VertexShaderId: string
  FragmentShaderId: string
  VertexShader: GlShader
  FragmentShader: GlShader
  Uniforms: GlUniformInfo list
  Ubos: GlUboInfo list
  Attributes: GlAttributeInfo list
  mutable ReferenceCount: int
}

type GlProgramInfo = {
  Gl: GL
  Program: WebGLProgram
  ShaderSet: GlShaderSet
  Uniforms: GlUniformInfo list
  Ubos: GlUboInfo list
  Attributes: GlAttributeInfo list
}

module GlProgram =
  let mutable private _emptyProgramInfo = None

  let mutable private vertexShaders = Map.empty
  let mutable private fragmentShaders = Map.empty
  let mutable private shaderSets = Map.empty

  let getRootName (name: string) =
    match name.IndexOf("[") with
    | -1 -> name
    | index -> name.[0 .. index - 1]

  module Utils =
    let private createShaderSetKey vertexId fragmentId = $"{vertexId}_{fragmentId}"

    let createProgramFromShaders (gl: GL) vertexShader fragmentShader =
      let program = gl.createProgram()
      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)
      let success = gl.getProgramParameter(program, gl.LINK_STATUS) :?> bool

      if success then
        program
      else
        let msg = gl.getProgramInfoLog(program)
        gl.deleteProgram(program)
        raise <| exn msg

    let createProgram (gl: GL) vertexSource fragmentSource =
      let vertexShader = createShader gl gl.VERTEX_SHADER vertexSource
      let fragmentShader = createShader gl gl.FRAGMENT_SHADER fragmentSource
      createProgramFromShaders gl vertexShader fragmentShader

    let private createUniformInfos (gl: GL) program =
      let count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) :?> int
      let Indices = [| 0 .. count - 1 |]
      let getValues pname = gl.getActiveUniforms(program, Indices, pname)
      let blockIndices = getValues GlUniformParam.UNIFORM_BLOCK_INDEX
      let offsets = getValues GlUniformParam.UNIFORM_OFFSET
      let arrayStrides = getValues GlUniformParam.UNIFORM_ARRAY_STRIDE
      let matrixStrides = getValues GlUniformParam.UNIFORM_MATRIX_STRIDE
      let rowMajors = getValues GlUniformParam.UNIFORM_IS_ROW_MAJOR

      let createInfo index =
        let uniform = gl.getActiveUniform(program, float index)
        let uniformType = uniform.``type`` |> int |> enum<GlType>
        let ti = getGlTypeInfo uniformType
        let isArray = uniform.size > 1.0
        let blockIndex = blockIndices.[index] |> unbox |> int
        let arrayStride = arrayStrides.[index] |> unbox |> int
        let matrixStride = matrixStrides.[index] |> unbox |> int
        let length = int uniform.size

        let byteSize =
          if blockIndex < 0 then
            ti.ByteSize * length
          else
            if isArray then arrayStride * length
            elif ti.IsMatrix then ti.MatrixColCount * matrixStride
            else ti.ByteSize

        {
          Name = uniform.name
          RootName = getRootName uniform.name
          Index = index
          Location = gl.getUniformLocation(program, uniform.name)
          Type = uniformType
          TypeInfo = ti
          ElementCount = ti.ElementCount
          ByteSize = byteSize
          Length = length
          ArrayIndex = -1
          StartIndex = -1
          IsArray = isArray
          BlockIndex = blockIndex
          Offset = offsets.[index] |> unbox |> int
          ArrayStride = arrayStride
          MatrixStride = matrixStride
          IsRowMajor = rowMajors.[index] |> unbox |> bool
          Children = [||]
        }

      let createMatrixColumn (info: GlUniformInfo) index =
        let name = $"{info.RootName}Col{index}"
        let ti = info.TypeInfo
        let bti = getGlTypeInfo info.TypeInfo.BaseType

        {
          info with
            Name = name
            Location = gl.getUniformLocation(program, name)
            Type = ti.BaseType
            TypeInfo = bti
            ArrayIndex = index
            StartIndex = index * ti.MatrixRowCount
            ElementCount = ti.MatrixRowCount
            IsArray = false
            Length = 1
            ByteSize = bti.ByteSize * ti.MatrixRowCount
            Offset = //info.Offset + info.MatrixStride * index
              match info.Offset with
              | -1 -> info.Offset
              | offset -> offset + info.MatrixStride * index
        }

      let createMatrixColumns (info: GlUniformInfo) =
        [| 0 .. info.TypeInfo.MatrixColCount - 1 |]
        |> Array.map (createMatrixColumn info)

      let addMatrixChildren (info: GlUniformInfo) =
        if info.TypeInfo.IsMatrix
        then { info with Children = createMatrixColumns info }
        else info

      let createArrayElement (info: GlUniformInfo) index =
        let name = $"{info.RootName}[{index}]"
        let ti = info.TypeInfo
        let bti = getGlTypeInfo info.TypeInfo.BaseType

        {
          info with
            Name = name
            Location = gl.getUniformLocation(program, name)
            Type = ti.BaseType
            TypeInfo = bti
            ArrayIndex = index
            StartIndex = index * info.ElementCount
            IsArray = false
            Length = 1
            ByteSize = info.TypeInfo.ByteSize
            Offset =
              match info.Offset with
              | -1 -> info.Offset
              | offset -> offset + info.ArrayStride * index
        }

      let adjustStartIndices (info: GlUniformInfo) =
        let rec loop (parent: GlUniformInfo option) (info: GlUniformInfo) =
          let parentStartIndex = parent |> Option.executeDefault 0 (fun p -> p.StartIndex)
          let info = { info with StartIndex = info.ArrayIndex * info.ElementCount + parentStartIndex}

          if info.Children.Length > 0 then
            let parent = Some info
            { info with Children = info.Children |> Array.map (loop parent)}
          else
            info
        loop None info

      let adjustOffsets (info: GlUniformInfo) =
        let rec adjustChild (root: GlUniformInfo) (indexer: GlUniformInfo) (info: GlUniformInfo) =
          {
            info with
              Offset = info.Offset - root.Offset + indexer.Offset
              Children = info.Children |> Array.map (adjustChild root indexer)
          }
        
        let adjustIndexer (root: GlUniformInfo) (indexer: GlUniformInfo) =
          {
            indexer with
              Children = indexer.Children |> Array.map (adjustChild root indexer)
          }
        
        {
          info with
            Children = info.Children |> Array.map (adjustIndexer info)
        }

      let createArrayElements info =
        [| 0 .. info.Length - 1 |]
        |> Array.map (createArrayElement info)

      let addArrayChildren info =
        let info = { info with ArrayIndex = 0; StartIndex = 0 }

        if info.IsArray then
          {
            info with
              Children = createArrayElements info
          }
          |> adjustStartIndices
          |> adjustOffsets
        else
          info

      Indices
      |> Array.map (createInfo >> addMatrixChildren >> addArrayChildren)

    let private getUboInfos (gl: GL) program (uniforms: GlUniformInfo[]) =
      let createInfo i =
        let getParam pname = gl.getActiveUniformBlockParameter(program, float i, pname)
        {
          Name = gl.getActiveUniformBlockName(program, float i) :?> string
          BlockIndex = i
          ByteSize = getParam(GlBlockParam.UNIFORM_BLOCK_DATA_SIZE) :?> int
          InVertexShader = getParam(GlBlockParam.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER) :?> bool
          InFragmentShader = getParam(GlBlockParam.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER) :?> bool
          Uniforms = uniforms |> Array.filter (fun x -> x.BlockIndex = i) |> List.ofArray
        }

      let rec loop ubos i =
        match i with
        | 0 -> ubos
        | i -> loop (createInfo (i - 1) :: ubos) (i - 1)
      
      let count = gl.getProgramParameter(program, float GlProgParamName.ACTIVE_UNIFORM_BLOCKS) :?> int
      loop [] count

    let private getAttributeInfos (gl: GL) program =
      let createInfo i =
        let attrib = gl.getActiveAttrib(program, i)
        let attributeType = attrib.``type`` |> int |> enum<GlType>

        {
          Index = int i
          Name = attrib.name
          Location = gl.getAttribLocation(program, attrib.name) |> int
          Type = attributeType
          TypeInfo = getGlTypeInfo attributeType
        }

      let count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) :?> float

      [ 0.0 .. count - 1.0 ]
      |> List.map createInfo
      |> List.where (fun info -> not <| info.Name.StartsWith("gl_"))

    let getVertexShader (gl: GL) shaderId =
      match vertexShaders |> Map.tryFind shaderId with
      | Some shader -> shader
      | None ->
          let source = getVertexShaderSource shaderId

          let shader =
            {
              ShaderId = shaderId
              Shader = createShader gl gl.VERTEX_SHADER source
              ReferenceCount = 0
            }

          vertexShaders <- vertexShaders.Add(shaderId, shader)
          shader

    let getFragmentShader (gl: GL) shaderId =
      match fragmentShaders |> Map.tryFind shaderId with
      | Some shader -> shader
      | None ->
          let source = getFragmentShaderSource shaderId

          let shader =
            {
              ShaderId = shaderId
              Shader = createShader gl gl.FRAGMENT_SHADER source
              ReferenceCount = 0
            }

          fragmentShaders <- fragmentShaders.Add(shaderId, shader)
          shader

    let deleteVertexShader (gl: GL) (shader: GlShader) =
      shader.ReferenceCount <- shader.ReferenceCount - 1
      if shader.ReferenceCount <= 0 then
        vertexShaders <- vertexShaders.Remove shader.ShaderId
        gl.deleteShader shader.Shader

    let deleteFragmentShader (gl: GL) (shader: GlShader) =
      shader.ReferenceCount <- shader.ReferenceCount - 1
      if shader.ReferenceCount <= 0 then
        fragmentShaders <- fragmentShaders.Remove shader.ShaderId
        gl.deleteShader shader.Shader

    let getShaderSet (gl: GL) vertexId fragmentId =
      let key = createShaderSetKey vertexId fragmentId
      match shaderSets |> Map.tryFind key with
      | Some shaderSet ->
          shaderSet.ReferenceCount <- shaderSet.ReferenceCount + 1
          shaderSet
      | None ->
          let vertex = getVertexShader gl vertexId
          let fragment = getFragmentShader gl fragmentId
          let program = createProgramFromShaders gl vertex.Shader fragment.Shader
          let uniforms = createUniformInfos gl program

          let shaderSet =
            {
              VertexShaderId = vertexId
              FragmentShaderId = fragmentId
              VertexShader = vertex
              FragmentShader = fragment
              Uniforms = uniforms |> List.ofArray
              Ubos = getUboInfos gl program uniforms
              Attributes = getAttributeInfos gl program
              ReferenceCount = 1
            }

          gl.deleteProgram(program)
          shaderSets <- shaderSets.Add(key, shaderSet)
          shaderSet

    let deleteShaderSet (gl: GL) (shaderSet: GlShaderSet) =
      shaderSet.ReferenceCount <- shaderSet.ReferenceCount - 1

      if shaderSet.ReferenceCount <= 0 then
        deleteVertexShader gl shaderSet.VertexShader
        deleteFragmentShader gl shaderSet.FragmentShader
        let key = createShaderSetKey shaderSet.VertexShaderId shaderSet.FragmentShaderId
        shaderSets <- shaderSets.Remove key

  let createProgramInfo (gl: GL) vertexId fragmentId =
    let rec updateUniformLocation program (uniform: GlUniformInfo) =
      {
        uniform with
          Location = gl.getUniformLocation(program, uniform.Name)
          Children = uniform.Children |> Array.map (updateUniformLocation program)
      }

    let rec updateUboUniform (uniforms: GlUniformInfo list) (ubo: GlUboInfo) =
      { ubo with Uniforms = uniforms |> List.filter (fun x -> x.BlockIndex = ubo.BlockIndex) }

    let rec updateAttributeLocation program (attribute: GlAttributeInfo) =
      { attribute with Location = gl.getAttribLocation(program, attribute.Name) |> int }

    let vertexSource = getVertexShaderSource vertexId
    let fragmentSource = getFragmentShaderSource fragmentId
    let program = Utils.createProgram gl vertexSource fragmentSource
    let shaderSet = Utils.getShaderSet gl vertexId fragmentId
    shaderSet.VertexShader.ReferenceCount <- shaderSet.VertexShader.ReferenceCount + 1
    shaderSet.FragmentShader.ReferenceCount <- shaderSet.FragmentShader.ReferenceCount + 1
    let uniforms = shaderSet.Uniforms |> List.map (updateUniformLocation program)
    
    {
      Gl = gl
      Program = program
      ShaderSet = shaderSet
      Uniforms = uniforms |> List.filter (fun u -> u.BlockIndex < 0)
      Ubos = shaderSet.Ubos |> List.map (updateUboUniform uniforms)
      Attributes = shaderSet.Attributes |> List.map (updateAttributeLocation program)
    }

  let deleteProgramInfo (info: GlProgramInfo) =
    let isEmpty =
      match _emptyProgramInfo with
      | None -> false
      | Some empty -> info = empty

    if not isEmpty then
      Utils.deleteShaderSet info.Gl info.ShaderSet
      info.Gl.deleteProgram info.Program

  let private initEmptyProgramInfo (gl: GL) =
    let programInfo = createProgramInfo gl "emptyVertex" "emptyFragment"
    _emptyProgramInfo <- Some programInfo
    programInfo

  let emptyProgramInfo (gl: GL) =
    match _emptyProgramInfo with
    | Some programInfo -> programInfo
    | None -> initEmptyProgramInfo gl

  let emptyUniformInfo name =
    {
      Name = name
      RootName = getRootName name
      Index = -1
      Location = null
      Type = GlType.Unknown
      TypeInfo = getGlTypeInfo GlType.FLOAT
      ElementCount = -1
      ByteSize = -1
      Length = -1
      ArrayIndex = -1
      StartIndex = -1
      IsArray = false
      BlockIndex = -1
      Offset = -1
      ArrayStride = -1
      MatrixStride = -1
      IsRowMajor = false
      Children = [||]
    }

  let emptyUboInfo name =
    {
      Name = name
      BlockIndex = -1
      ByteSize = -1
      InVertexShader = false
      InFragmentShader = false
      Uniforms = []
    }

  let emptyAttributeInfo name =
    {
      Index = -1
      Name = name
      Location = -1
      Type = GlType.Unknown
      TypeInfo = getGlTypeInfo GlType.FLOAT
    }

  let private allUniforms (info: GlProgramInfo) =
    seq {
      yield! info.Uniforms
      yield! info.Ubos |> Seq.collect (fun ubo -> ubo.Uniforms)
    }

  let getUniform name info =
    info |> allUniforms |> Seq.tryFind (fun i -> i.Name = name)

  let getUbo name info =
    info.Ubos |> List.tryFind (fun i -> i.Name = name)

  let getAttribute name info =
    info.Attributes |> List.tryFind (fun i -> i.Name = name)

  let getUniformOrDefault name info =
    match getUniform name info with
    | Some result -> result
    | None -> emptyUniformInfo name

  let getUboOrDefault name info =
    match getUbo name info with
    | Some result -> result
    | None -> emptyUboInfo name

  let getAttributeOrDefault name info =
    match getAttribute name info with
    | Some result -> result
    | None -> emptyAttributeInfo name
