namespace Wil.Webgl.Core

[<AutoOpen>]
module WebglExtensions =
  open Browser.Types
  open Fable.Core
  open Wil.Core.Utils
  open Wil.Js
  open Wil.Browser.Types
  open Wil.Webgl.Types

  type [<AllowNullLiteral>] WebGLVAO =
      inherit WebGLObject

  type WebGLRenderingContext with
      [<Emit("$0.bufferData($1...)")>]
      member __.bufferData2(target: float, data: U2<JS.ArrayBufferView, JS.ArrayBuffer>, usage: float): unit = jsNative
      [<Emit("$0.bindBufferBase($1...)")>]
      member __.bindBufferBase(target: float, location: float, buffer: WebGLBuffer): unit = jsNative
      [<Emit("$0.bufferSubData($1...)")>]
      member __.bufferSubData(target: float, dstByteOffset: float, srcData: JS.ArrayBufferView, srcOffset: float, length: float): unit = jsNative
      [<Emit("$0.vertexAttribDivisor($1...)")>]
      member __.vertexAttribDivisor(location: float, divisor: float): unit = jsNative
      [<Emit("$0.drawArraysInstanced($1...)")>]
      member __.drawArraysInstanced(mode: float, first: float, count: float, instanceCount: float): unit = jsNative
      [<Emit("$0.createVertexArray()")>]
      member __.createVertexArray(): WebGLVAO = jsNative
      [<Emit("$0.deleteVertexArray($1)")>]
      member __.deleteVertexArray(vao: WebGLVAO): unit = jsNative
      [<Emit("$0.bindVertexArray($1)")>]
      member __.bindVertexArray(vao: WebGLVAO): unit = jsNative
      [<Emit("$0.getUniformBlockIndex($1...)")>]
      member __.getUniformBlockIndex(program: WebGLProgram, blockName: string): float = jsNative
      [<Emit("$0.uniformBlockBinding($1...)")>]
      member __.uniformBlockBinding(program: WebGLProgram, blockIndex: float, bufferIndex: float): unit = jsNative
      [<Emit("$0.getActiveUniforms($1...)")>]
      member __.getActiveUniforms(program: WebGLProgram, uniformIndices: int[], pname: GlUniformParam): int[] = jsNative
      [<Emit("$0.getActiveUniformBlockParameter($1...)")>]
      member __.getActiveUniformBlockParameter(program: WebGLProgram, blockIndex: float, pname: GlBlockParam): obj = jsNative
      [<Emit("$0.getActiveUniformBlockName($1...)")>]
      member __.getActiveUniformBlockName(program: WebGLProgram, blockIndex: float): obj = jsNative
      [<Emit("$0.getIndexedParameter($1...)")>]
      member __.getIndexedParameter(target: float, index: float): obj = jsNative
      [<Emit("$0.uniform1ui($1...)")>]
      member __.uniform1ui(location: WebGLUniformLocation, value: float): unit = jsNative
      [<Emit("$0.uniform2ui($1...)")>]
      member __.uniform2ui(location: WebGLUniformLocation, x: float, y: float): unit = jsNative
      [<Emit("$0.uniform3ui($1...)")>]
      member __.uniform3ui(location: WebGLUniformLocation, x: float, y: float, z: float): unit = jsNative
      [<Emit("$0.uniform4ui($1...)")>]
      member __.uniform4ui(location: WebGLUniformLocation, x: float, y: float, z: float, w: float): unit = jsNative
      [<Emit("$0.uniform1uiv($1...)")>]
      member __.uniform1uiv(location: WebGLUniformLocation, values: JS.Uint32Array): unit = jsNative
      [<Emit("$0.uniform2uiv($1...)")>]
      member __.uniform2uiv(location: WebGLUniformLocation, values: JS.Uint32Array): unit = jsNative
      [<Emit("$0.uniform3uiv($1...)")>]
      member __.uniform3uiv(location: WebGLUniformLocation, values: JS.Uint32Array): unit = jsNative
      [<Emit("$0.uniform4uiv($1...)")>]
      member __.uniform4uv(location: WebGLUniformLocation, values: JS.Uint32Array): unit = jsNative
      [<Emit("$0.uniformMatrix2x3fv($1...)")>]
      member __.uniformMatrix2x3fv(location: WebGLUniformLocation, transpose: bool, values: JS.Float32Array): unit = jsNative
      [<Emit("$0.uniformMatrix2x4fv($1...)")>]
      member __.uniformMatrix2x4fv(location: WebGLUniformLocation, transpose: bool, values: JS.Float32Array): unit = jsNative
      [<Emit("$0.uniformMatrix3x2fv($1...)")>]
      member __.uniformMatrix3x2fv(location: WebGLUniformLocation, transpose: bool, values: JS.Float32Array): unit = jsNative
      [<Emit("$0.uniformMatrix3x4fv($1...)")>]
      member __.uniformMatrix3x4fv(location: WebGLUniformLocation, transpose: bool, values: JS.Float32Array): unit = jsNative
      [<Emit("$0.uniformMatrix4x2fv($1...)")>]
      member __.uniformMatrix4x2fv(location: WebGLUniformLocation, transpose: bool, values: JS.Float32Array): unit = jsNative
      [<Emit("$0.uniformMatrix4x3fv($1...)")>]
      member __.uniformMatrix4x3fv(location: WebGLUniformLocation, transpose: bool, values: JS.Float32Array): unit = jsNative

      // WebGL1:
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, width: float, height: float, border: float, format: GlColorFormat, dataType: GlTextureType, ?pixels: JS.ArrayBufferView): unit = jsNative
      // [<Emit("$0.texImage2D($1...)")>]
      // member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, format: GlColorFormat, dataType: GlTextureType, ?pixels: ImageData): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, format: GlColorFormat, dataType: GlTextureType, ?pixels: HTMLImageElement): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, format: GlColorFormat, dataType: GlTextureType, ?pixels: HTMLCanvasElement): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, format: GlColorFormat, dataType: GlTextureType, ?pixels: HTMLVideoElement): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, format: GlColorFormat, dataType: GlTextureType, ?pixels: ImageBitmap): unit = jsNative

      // WebGL2:
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, width: float, height: float, border: float, format: GlColorFormat, dataType: GlTextureType, offset: float): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, width: float, height: float, border: float, format: GlColorFormat, dataType: GlTextureType, source: HTMLCanvasElement): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, width: float, height: float, border: float, format: GlColorFormat, dataType: GlTextureType, source: HTMLImageElement): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, width: float, height: float, border: float, format: GlColorFormat, dataType: GlTextureType, source: HTMLVideoElement): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, width: float, height: float, border: float, format: GlColorFormat, dataType: GlTextureType, source: ImageBitmap): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, width: float, height: float, border: float, format: GlColorFormat, dataType: GlTextureType, source: ImageData): unit = jsNative
      [<Emit("$0.texImage2D($1...)")>]
      member _.texImage2D(target: GlTextureTarget, level: float, internalformat: GlInternalColorFormat, width: float, height: float, border: float, format: GlColorFormat, dataType: GlTextureType, srcData: JS.ArrayBufferView, srcOffset: float): unit = jsNative

  [<AutoOpen>]
  module GlCommon =
    let mutable private emptyWebGLBuffer : WebGLBuffer =  null

    let getEmptyBuffer (gl: GL) =
      if isNull emptyWebGLBuffer then emptyWebGLBuffer <- gl.createBuffer()
      emptyWebGLBuffer

    let useProgram (gl: GL) program =
      Debug.log $"useProgram({program})"
      gl.useProgram(program)

    let getUniformBlockIndex (gl: GL) program blockName =
      gl.getUniformBlockIndex(program, blockName) |> int

    let uniformBlockBinding (gl: GL) program blockIndex bufferIndex =
      Debug.log $"uniformBlockBinding({program}, {blockIndex}, {bufferIndex})"
      gl.uniformBlockBinding(program, float blockIndex, float bufferIndex)

    let bindVertexArray (gl: GL) vao =
      Debug.log $"bindVertexArray({vao})"
      gl.bindVertexArray(vao)

    let bindBuffer (gl: GL) (target: GlBufferTarget) buffer =
      Debug.log $"bindBuffer({enumName GlBufferTargetT target}, {buffer})"
      gl.bindBuffer(float target, buffer)

    let bindBufferBase (gl: GL) (target: GlBufferTarget) location buffer =
      Debug.log $"bindBufferBase({enumName GlBufferTargetT target}, {location}, {buffer})"
      gl.bindBufferBase(float target, float location, buffer)

    let bufferData (gl: GL) (target: GlBufferTarget) data (usage: GlBufferUsage) =
      Debug.log $"bufferData({enumName GlBufferTargetT target}, [{clipObj 10 data}], {enumName GlBufferUsageT usage})"
      gl.bufferData(float target, bufferView3 data, float usage)

    let bufferSubData (gl: GL) (target: GlBufferTarget) dstByteOffset srcData srcOffset length =
      Debug.log $"bufferSubData({enumName GlBufferTargetT target}, {dstByteOffset}, [{clipObj 10 srcData}], {srcOffset}, {length})"
      gl.bufferSubData(float target, float dstByteOffset, bufferView srcData, float srcOffset, float length)

    let enableVertexAttribArray (gl: GL) location =
      Debug.log $"enableVertexAttribArray({location})"
      gl.enableVertexAttribArray(location)

    let vertexAttribPointer (gl: GL) location size (atype: GlType) normalize stride offset =
      Debug.log $"vertexAttribPointer({location}, {size}, {enumName GlTypeT atype}, {normalize}, {stride}, {offset})"
      gl.vertexAttribPointer(location, float size, float atype, normalize, float stride, float offset)

    let vertexAttribDivisor (gl: GL) location divisor =
      Debug.log $"vertexAttribDivisor({location}, {divisor})"
      gl.vertexAttribDivisor(location, float divisor)

    let drawArrays (gl: GL) (mode: GlDrawPrimitive) first count =
      Debug.log $"drawArrays({enumName GlDrawPrimitiveT mode}, {first}, {count})"
      gl.drawArrays(float mode, float first, float count)

    let drawElements (gl: GL) (mode: GlDrawPrimitive) count (indexType: GlIndicesType) offset =
      Debug.log $"drawElements({enumName GlDrawPrimitiveT mode}, {count}, {enumName GlIndicesTypeT indexType}, {offset})"
      gl.drawElements(float mode, float count, float indexType, float offset)

    let drawArraysInstanced (gl: GL) (mode: GlDrawPrimitive) first count instanceCount =
      gl.drawArraysInstanced(float mode, float first, float count, float instanceCount)
      Debug.log $"drawArraysInstanced({enumName GlDrawPrimitiveT mode}, {first}, {count}, {instanceCount})"

    // let private loc location = if isNull location then "NULL" else "location"
    let private loc location = location

    let uniform1i (gl: GL) location x =
      Debug.log $"uniform1i({loc location}, {x})"
      gl.uniform1i(location, float x)

    let uniform2i (gl: GL) location x y =
      Debug.log $"uniform2i({loc location}, {x}, {y})"
      gl.uniform2i(location, float x, float y)

    let uniform3i (gl: GL) location x y z =
      Debug.log $"uniform3i({loc location}, {x}, {y}, {z})"
      gl.uniform3i(location, float x, float y, float z)

    let uniform4i (gl: GL) location x y z w =
      Debug.log $"uniform4i({loc location}, {x}, {y}, {z}, {w})"
      gl.uniform4i(location, float x, float y, float z, float w)

    let uniform1ui (gl: GL) location x =
      Debug.log $"uniform1ui({loc location}, {x})"
      gl.uniform1ui(location, float x)

    let uniform2ui (gl: GL) location x y =
      Debug.log $"uniform2ui({loc location}, {x}, {y})"
      gl.uniform2ui(location, float x, float y)

    let uniform3ui (gl: GL) location x y z =
      Debug.log $"uniform3ui({loc location}, {x}, {y}, {z})"
      gl.uniform3ui(location, float x, float y, float z)

    let uniform4ui (gl: GL) location x y z w =
      Debug.log $"uniform4ui({loc location}, {x}, {y}, {z}, {w})"
      gl.uniform4ui(location, float x, float y, float z, float w)

    let uniform1f (gl: GL) location x =
      Debug.log $"uniform1f({loc location}, {x})"
      gl.uniform1f(location, x)

    let uniform2f (gl: GL) location x y =
      Debug.log $"uniform2f({loc location}, {x}, {y})"
      gl.uniform2f(location, x, y)

    let uniform3f (gl: GL) location x y z =
      Debug.log $"uniform3f({loc location}, {x}, {y}, {z})"
      gl.uniform3f(location, x, y, z)

    let uniform4f (gl: GL) location x y z w =
      Debug.log $"uniform4f({loc location}, {x}, {y}, {z}, {w})"
      gl.uniform4f(location, x, y, z, w)

    let uniform1iv (gl: GL) location arr =
      Debug.log $"uniform1iv({loc location}, [{clipArray 10 arr}])"
      gl.uniform1iv(location, int32Array arr)

    let uniform2iv (gl: GL) location arr =
      Debug.log $"uniform2iv({loc location}, [{clipArray 10 arr}])"
      gl.uniform2iv(location, int32Array arr)

    let uniform3iv (gl: GL) location arr =
      Debug.log $"uniform3iv({loc location}, [{clipArray 10 arr}])"
      gl.uniform3iv(location, int32Array arr)

    let uniform4iv (gl: GL) location arr =
      Debug.log $"uniform4iv({loc location}, [{clipArray 10 arr}])"
      gl.uniform4iv(location, int32Array arr)

    let uniform1uiv (gl: GL) location arr =
      Debug.log $"uniform1uiv({loc location}, [{clipArray 10 arr}])"
      gl.uniform1uiv(location, uint32Array arr)

    let uniform2uiv (gl: GL) location arr =
      Debug.log $"uniform2uiv({loc location}, [{clipArray 10 arr}])"
      gl.uniform2uiv(location, uint32Array arr)

    let uniform3uiv (gl: GL) location arr =
      Debug.log $"uniform3uiv({loc location}, [{clipArray 10 arr}])"
      gl.uniform3uiv(location, uint32Array arr)

    let uniform4uiv (gl: GL) location arr =
      Debug.log $"uniform4uv({loc location}, [{clipArray 10 arr}])"
      gl.uniform4uv(location, uint32Array arr)

    let uniform1fv (gl: GL) location arr =
      Debug.log $"uniform1fv({loc location}, [{clipArray 10 arr}])"
      gl.uniform1fv(location, float32Array arr)

    let uniform2fv (gl: GL) location arr =
      Debug.log $"uniform2fv({loc location}, [{clipArray 10 arr}])"
      gl.uniform2fv(location, float32Array arr)

    let uniform3fv (gl: GL) location arr =
      Debug.log $"uniform3fv({loc location}, [{clipArray 10 arr}])"
      gl.uniform3fv(location, float32Array arr)

    let uniform4fv (gl: GL) location arr =
      Debug.log $"uniform4fv({loc location}, [{clipArray 10 arr}])"
      gl.uniform4fv(location, float32Array arr)

    let uniformMatrix2fv (gl: GL) location arr =
      Debug.log $"uniformMatrix2fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix2fv(location, false, float32Array arr)

    let uniformMatrix3fv (gl: GL) location arr =
      Debug.log $"uniformMatrix3fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix3fv(location, false, float32Array arr)

    let uniformMatrix4fv (gl: GL) location arr =
      Debug.log $"uniformMatrix4fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix4fv(location, false, float32Array arr)

    let uniformMatrix2x3fv (gl: GL) location arr =
      Debug.log $"uniformMatrix2x3fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix2x3fv(location, false, float32Array arr)

    let uniformMatrix2x4fv (gl: GL) location arr =
      Debug.log $"uniformMatrix2x4fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix2x4fv(location, false, float32Array arr)

    let uniformMatrix3x2fv (gl: GL) location arr =
      Debug.log $"uniformMatrix3x2fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix3x2fv(location, false, float32Array arr)

    let uniformMatrix3x4fv (gl: GL) location arr =
      Debug.log $"uniformMatrix3x4fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix3x4fv(location, false, float32Array arr)

    let uniformMatrix4x2fv (gl: GL) location arr =
      Debug.log $"uniformMatrix4x2fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix4x2fv(location, false, float32Array arr)

    let uniformMatrix4x3fv (gl: GL) location arr =
      Debug.log $"uniformMatrix4x3fv({loc location}, false, [{clipArray 10 arr}])"
      gl.uniformMatrix4x3fv(location, false, float32Array arr)

    let enable (capability: GlCapability)  (gl: GL)=
      Debug.log $"enable({enumName GlCapabilityT capability})"
      gl.enable(float capability)

    let disable (capability: GlCapability)  (gl: GL)=
      Debug.log $"disable({enumName GlCapabilityT capability})"
      gl.disable(float capability)

    let cullFace (mode: GlCullMode) (gl: GL) =
      Debug.log $"cullFace({enumName GlCullModeT mode})"
      gl.cullFace(float mode)

    let blendColor r g b a (gl: GL) =
      Debug.log $"blendColor({r}, {g}, {b}, {a})"
      gl.blendColor(r, g, b, a)

    let blendFunc (sfactor: GlBlendFactor) (dfactor: GlBlendFactor) (gl: GL) =
      Debug.log $"blendFunc({enumName GlBlendFactorT sfactor}, {enumName GlBlendFactorT dfactor})"
      gl.blendFunc(float sfactor, float dfactor)

    let blendFuncSeparate (srcRGB: GlBlendFactor) (dstRGB: GlBlendFactor) (srcAlpha: GlBlendFactor) (dstAlpha: GlBlendFactor) (gl: GL) =
      Debug.log $"blendFuncSeparate({enumName GlBlendFactorT srcRGB}, {enumName GlBlendFactorT dstRGB}, {enumName GlBlendFactorT srcAlpha}, {enumName GlBlendFactorT dstAlpha})"
      gl.blendFuncSeparate(float srcRGB, float dstRGB, float srcAlpha, float dstAlpha)

    let blendEquation (mode: GlBlendMode) (gl: GL) =
      Debug.log $"blendEquation({enumName GlBlendModeT mode})"
      gl.blendEquation(float mode)

    let blendEquationSeparate (modeRGB: GlBlendMode) (modeAlpha: GlBlendMode) (gl: GL) =
      Debug.log $"blendEquationSeparate({enumName GlBlendModeT modeRGB}, {enumName GlBlendModeT modeAlpha})"
      gl.blendEquationSeparate(float modeRGB, float modeAlpha)

    let texImage2DData target level internalformat width height format dataType (pixels: JS.ArrayBufferView) (gl: GL) =
      Debug.log $"texImage2D.({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {width}, {height}, 0, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, [{pixels}])"
      gl.texImage2D(target, float level, internalformat, width, height, 0.0, format, dataType, pixels)

    let texImage2DImage target level internalformat format dataType (pixels: HTMLImageElement) (gl: GL) =
      Debug.log $"texImage2D.({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {pixels})"
      gl.texImage2D(target, float level, internalformat, format, dataType, pixels)

    let texImage2DCanvas target level internalformat format dataType (pixels: HTMLCanvasElement) (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {pixels})"
      gl.texImage2D(target, float level, internalformat, format, dataType, pixels)

    let texImage2DVideo target level internalformat format dataType (pixels: HTMLVideoElement) (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {pixels})"
      gl.texImage2D(target, float level, internalformat, format, dataType, pixels)

    let texImage2DBitmap target level internalformat format dataType (pixels: ImageBitmap) (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {pixels})"
      gl.texImage2D(target, float level, internalformat, format, dataType, pixels)

    let texImage2D target level internalformat width height format dataType offset (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {width}, {height}, 0, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {offset})"
      gl.texImage2D(target, float level, internalformat, width, height, 0.0, format, dataType, float offset)

    let texImage2DCanvas2 target level internalformat width height format dataType (source: HTMLCanvasElement) (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {width}, {height}, 0, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {source})"
      gl.texImage2D(target, float level, internalformat, width, height, 0.0, format, dataType, source)

    let texImage2DImage2 target level internalformat width height format dataType (source: HTMLImageElement) (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {width}, {height}, 0, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {source})"
      gl.texImage2D(target, float level, internalformat, width, height, 0.0, format, dataType, source)

    let texImage2DVideo2 target level internalformat width height format dataType (source: HTMLVideoElement) (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {width}, {height}, 0, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {source})"
      gl.texImage2D(target, float level, internalformat, width, height, 0.0, format, dataType, source)

    let texImage2DBitmap2 target level internalformat width height format dataType (source: ImageBitmap) (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {width}, {height}, 0, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {source})"
      gl.texImage2D(target, float level, internalformat, width, height, 0.0, format, dataType, source)

    let texImage2DImageData2 target level internalformat width height format dataType (source: ImageData) (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {width}, {height}, 0, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, {source})"
      gl.texImage2D(target, float level, internalformat, width, height, 0.0, format, dataType, source)

    let texImage2DData2 target level internalformat width height format dataType (srcData: JS.ArrayBufferView) srcOffset (gl: GL) =
      Debug.log $"texImage2D({enumName GlTextureTargetT target}, {level}, {enumName GlInternalColorFormatT internalformat}, {width}, {height}, 0, {enumName GlColorFormatT format}, {enumName GlTextureTypeT dataType}, [{clipObj 10 srcData}], {srcOffset})"
      gl.texImage2D(target, float level, internalformat, width, height, 0.0, format, dataType, srcData, float srcOffset)

    let inline texParameteri (target: GlTextureTarget) (param: GlTextureParam) value (gl: GL) =
      Debug.log $"gl.texParameteri({enumName GlTextureTargetT target}, {enumName GlTextureParamT param}, {value})"
      gl.texParameteri(float target, float param, float value)

    let inline texParameterf (target: GlTextureTarget) (param: GlTextureParam) value (gl: GL) =
      Debug.log $"gl.texParameterf({enumName GlTextureTargetT target}, {enumName GlTextureParamT param}, {value})"
      gl.texParameterf(float target, float param, float value)

    let inline pixelStorei (param: GlPixelStoreParam) value (gl: GL) =
      Debug.log $"gl.pixelStorei({enumName GlPixelStoreParamT param}, {value})"
      gl.pixelStorei(float param, float value)
