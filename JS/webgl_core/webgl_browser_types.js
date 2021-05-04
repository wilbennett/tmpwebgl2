import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { clipArray, clipObj, enumName } from "../core/utils.js";
import { GlTextureTypeT, GlColorFormatT, GlInternalColorFormatT, GlTextureTargetT, GlBlendModeT, GlBlendFactorT, GlCullModeT, GlCapabilityT, GlIndicesTypeT, GlDrawPrimitiveT, GlTypeT, GlBufferUsageT, GlBufferTargetT } from "./webgl_types.js";
import { float32Array, uint32Array, int32Array, bufferView, bufferView3 } from "../js/typedarray_utils.js";

let GlCommon_emptyWebGLBuffer = null;

export function GlCommon_getEmptyBuffer(gl) {
    if (GlCommon_emptyWebGLBuffer == null) {
        GlCommon_emptyWebGLBuffer = gl.createBuffer();
    }
    return GlCommon_emptyWebGLBuffer;
}

export function GlCommon_useProgram(gl, program) {
    gl.useProgram(program);
}

export function GlCommon_getUniformBlockIndex(gl, program, blockName) {
    return ~(~(gl.getUniformBlockIndex(program, blockName)));
}

export function GlCommon_uniformBlockBinding(gl, program, blockIndex, bufferIndex) {
    gl.uniformBlockBinding(program, blockIndex, bufferIndex);
}

export function GlCommon_bindVertexArray(gl, vao) {
    gl.bindVertexArray(vao);
}

export function GlCommon_bindBuffer(gl, target, buffer) {
    gl.bindBuffer(target, buffer);
}

export function GlCommon_bindBufferBase(gl, target, location, buffer) {
    gl.bindBufferBase(target, location, buffer);
}

export function GlCommon_bufferData(gl, target, data, usage) {
    gl.bufferData(target, bufferView3(data), usage);
}

export function GlCommon_bufferSubData(gl, target, dstByteOffset, srcData, srcOffset, length) {
    gl.bufferSubData(target, dstByteOffset, bufferView(srcData), srcOffset, length);
}

export function GlCommon_enableVertexAttribArray(gl, location) {
    gl.enableVertexAttribArray(location);
}

export function GlCommon_vertexAttribPointer(gl, location, size, atype, normalize, stride, offset) {
    gl.vertexAttribPointer(location, size, atype, normalize, stride, offset);
}

export function GlCommon_vertexAttribDivisor(gl, location, divisor) {
    gl.vertexAttribDivisor(location, divisor);
}

export function GlCommon_drawArrays(gl, mode, first, count) {
    gl.drawArrays(mode, first, count);
}

export function GlCommon_drawElements(gl, mode, count, indexType, offset) {
    gl.drawElements(mode, count, indexType, offset);
}

export function GlCommon_drawArraysInstanced(gl, mode, first, count, instanceCount) {
    gl.drawArraysInstanced(mode, first, count, instanceCount);
}

function GlCommon_loc(location) {
    return location;
}

export function GlCommon_uniform1i(gl, location, x) {
    gl.uniform1i(location, x);
}

export function GlCommon_uniform2i(gl, location, x, y) {
    gl.uniform2i(location, x, y);
}

export function GlCommon_uniform3i(gl, location, x, y, z) {
    gl.uniform3i(location, x, y, z);
}

export function GlCommon_uniform4i(gl, location, x, y, z, w) {
    gl.uniform4i(location, x, y, z, w);
}

export function GlCommon_uniform1ui(gl, location, x) {
    gl.uniform1ui(location, x);
}

export function GlCommon_uniform2ui(gl, location, x, y) {
    gl.uniform2ui(location, x, y);
}

export function GlCommon_uniform3ui(gl, location, x, y, z) {
    gl.uniform3ui(location, x, y, z);
}

export function GlCommon_uniform4ui(gl, location, x, y, z, w) {
    gl.uniform4ui(location, x, y, z, w);
}

export function GlCommon_uniform1f(gl, location, x) {
    gl.uniform1f(location, x);
}

export function GlCommon_uniform2f(gl, location, x, y) {
    gl.uniform2f(location, x, y);
}

export function GlCommon_uniform3f(gl, location, x, y, z) {
    gl.uniform3f(location, x, y, z);
}

export function GlCommon_uniform4f(gl, location, x, y, z, w) {
    gl.uniform4f(location, x, y, z, w);
}

export function GlCommon_uniform1iv(gl, location, arr) {
    gl.uniform1iv(location, int32Array(arr));
}

export function GlCommon_uniform2iv(gl, location, arr) {
    gl.uniform2iv(location, int32Array(arr));
}

export function GlCommon_uniform3iv(gl, location, arr) {
    gl.uniform3iv(location, int32Array(arr));
}

export function GlCommon_uniform4iv(gl, location, arr) {
    gl.uniform4iv(location, int32Array(arr));
}

export function GlCommon_uniform1uiv(gl, location, arr) {
    gl.uniform1uiv(location, uint32Array(arr));
}

export function GlCommon_uniform2uiv(gl, location, arr) {
    gl.uniform2uiv(location, uint32Array(arr));
}

export function GlCommon_uniform3uiv(gl, location, arr) {
    gl.uniform3uiv(location, uint32Array(arr));
}

export function GlCommon_uniform4uiv(gl, location, arr) {
    gl.uniform4uiv(location, uint32Array(arr));
}

export function GlCommon_uniform1fv(gl, location, arr) {
    gl.uniform1fv(location, float32Array(arr));
}

export function GlCommon_uniform2fv(gl, location, arr) {
    gl.uniform2fv(location, float32Array(arr));
}

export function GlCommon_uniform3fv(gl, location, arr) {
    gl.uniform3fv(location, float32Array(arr));
}

export function GlCommon_uniform4fv(gl, location, arr) {
    gl.uniform4fv(location, float32Array(arr));
}

export function GlCommon_uniformMatrix2fv(gl, location, arr) {
    gl.uniformMatrix2fv(location, false, float32Array(arr));
}

export function GlCommon_uniformMatrix3fv(gl, location, arr) {
    gl.uniformMatrix3fv(location, false, float32Array(arr));
}

export function GlCommon_uniformMatrix4fv(gl, location, arr) {
    gl.uniformMatrix4fv(location, false, float32Array(arr));
}

export function GlCommon_uniformMatrix2x3fv(gl, location, arr) {
    gl.uniformMatrix2x3fv(location, false, float32Array(arr));
}

export function GlCommon_uniformMatrix2x4fv(gl, location, arr) {
    gl.uniformMatrix2x4fv(location, false, float32Array(arr));
}

export function GlCommon_uniformMatrix3x2fv(gl, location, arr) {
    gl.uniformMatrix3x2fv(location, false, float32Array(arr));
}

export function GlCommon_uniformMatrix3x4fv(gl, location, arr) {
    gl.uniformMatrix3x4fv(location, false, float32Array(arr));
}

export function GlCommon_uniformMatrix4x2fv(gl, location, arr) {
    gl.uniformMatrix4x2fv(location, false, float32Array(arr));
}

export function GlCommon_uniformMatrix4x3fv(gl, location, arr) {
    gl.uniformMatrix4x3fv(location, false, float32Array(arr));
}

export function GlCommon_enable(capability, gl) {
    gl.enable(capability);
}

export function GlCommon_disable(capability, gl) {
    gl.disable(capability);
}

export function GlCommon_cullFace(mode, gl) {
    gl.cullFace(mode);
}

export function GlCommon_blendColor(r, g, b, a, gl) {
    gl.blendColor(r, g, b, a);
}

export function GlCommon_blendFunc(sfactor, dfactor, gl) {
    gl.blendFunc(sfactor, dfactor);
}

export function GlCommon_blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha, gl) {
    gl.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
}

export function GlCommon_blendEquation(mode, gl) {
    gl.blendEquation(mode);
}

export function GlCommon_blendEquationSeparate(modeRGB, modeAlpha, gl) {
    gl.blendEquationSeparate(modeRGB, modeAlpha);
}

export function GlCommon_texImage2DData(target, level, internalformat, width, height, format, dataType, pixels, gl) {
    gl.texImage2D(target, level, internalformat, width, height, 0, format, dataType, pixels);
}

export function GlCommon_texImage2DImage(target, level, internalformat, format, dataType, pixels, gl) {
    gl.texImage2D(target, level, internalformat, format, dataType, pixels);
}

export function GlCommon_texImage2DCanvas(target, level, internalformat, format, dataType, pixels, gl) {
    gl.texImage2D(target, level, internalformat, format, dataType, pixels);
}

export function GlCommon_texImage2DVideo(target, level, internalformat, format, dataType, pixels, gl) {
    gl.texImage2D(target, level, internalformat, format, dataType, pixels);
}

export function GlCommon_texImage2DBitmap(target, level, internalformat, format, dataType, pixels, gl) {
    gl.texImage2D(target, level, internalformat, format, dataType, pixels);
}

export function GlCommon_texImage2D(target, level, internalformat, width, height, format, dataType, offset, gl) {
    gl.texImage2D(target, level, internalformat, width, height, 0, format, dataType, offset);
}

export function GlCommon_texImage2DCanvas2(target, level, internalformat, width, height, format, dataType, source, gl) {
    gl.texImage2D(target, level, internalformat, width, height, 0, format, dataType, source);
}

export function GlCommon_texImage2DImage2(target, level, internalformat, width, height, format, dataType, source, gl) {
    gl.texImage2D(target, level, internalformat, width, height, 0, format, dataType, source);
}

export function GlCommon_texImage2DVideo2(target, level, internalformat, width, height, format, dataType, source, gl) {
    gl.texImage2D(target, level, internalformat, width, height, 0, format, dataType, source);
}

export function GlCommon_texImage2DBitmap2(target, level, internalformat, width, height, format, dataType, source, gl) {
    gl.texImage2D(target, level, internalformat, width, height, 0, format, dataType, source);
}

export function GlCommon_texImage2DImageData2(target, level, internalformat, width, height, format, dataType, source, gl) {
    gl.texImage2D(target, level, internalformat, width, height, 0, format, dataType, source);
}

export function GlCommon_texImage2DData2(target, level, internalformat, width, height, format, dataType, srcData, srcOffset, gl) {
    gl.texImage2D(target, level, internalformat, width, height, 0, format, dataType, srcData, srcOffset);
}

