import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { list_type, record_type, array_type, bool_type, enum_type, class_type, string_type, int32_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { getGlTypeInfo, GlTypeInfo$reflection } from "./webgl_types.js";
import { FSharpMap__Remove, FSharpMap__Add, tryFind, empty as empty_1 } from "../.fable/fable-library.3.0.0/Map.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { WebglShaderUtils_getFragmentShaderSource, WebglShaderUtils_getVertexShaderSource, WebglShaderUtils_createShader } from "./shader_utils.js";
import { tryFind as tryFind_1, collect, append, delay, rangeNumber } from "../.fable/fable-library.3.0.0/Seq.js";
import { map } from "../.fable/fable-library.3.0.0/Array.js";
import { equalsSafe, partialApply } from "../.fable/fable-library.3.0.0/Util.js";
import { executeDefault } from "../core/optionex.js";
import { tryFind as tryFind_2, filter, ofSeq, map as map_1, where, empty as empty_2, cons, ofArray } from "../.fable/fable-library.3.0.0/List.js";

export class GlUniformInfo extends Record {
    constructor(Index, Name, RootName, Location, Type, TypeInfo, ElementCount, ByteSize, Length, ArrayIndex, StartIndex, IsArray, BlockIndex, Offset, ArrayStride, MatrixStride, IsRowMajor, Children) {
        super();
        this.Index = (Index | 0);
        this.Name = Name;
        this.RootName = RootName;
        this.Location = Location;
        this.Type = (Type | 0);
        this.TypeInfo = TypeInfo;
        this.ElementCount = (ElementCount | 0);
        this.ByteSize = (ByteSize | 0);
        this.Length = (Length | 0);
        this.ArrayIndex = (ArrayIndex | 0);
        this.StartIndex = (StartIndex | 0);
        this.IsArray = IsArray;
        this.BlockIndex = (BlockIndex | 0);
        this.Offset = (Offset | 0);
        this.ArrayStride = (ArrayStride | 0);
        this.MatrixStride = (MatrixStride | 0);
        this.IsRowMajor = IsRowMajor;
        this.Children = Children;
    }
}

export function GlUniformInfo$reflection() {
    return record_type("Wil.Webgl.Core.GlUniformInfo", [], GlUniformInfo, () => [["Index", int32_type], ["Name", string_type], ["RootName", string_type], ["Location", class_type("Browser.Types.WebGLUniformLocation")], ["Type", enum_type("Wil.Webgl.Types.WebglTypes.GlType", int32_type, [["Unknown", 0], ["BYTE", 5120], ["SHORT", 5122], ["BOOL", 35670], ["BOOL_VEC2", 35671], ["BOOL_VEC3", 35672], ["BOOL_VEC4", 35673], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["FLOAT_MAT2x3", 35685], ["FLOAT_MAT2", 35674], ["FLOAT_MAT2x4", 35686], ["FLOAT_MAT3", 35675], ["FLOAT_MAT3x2", 35687], ["FLOAT_MAT3x4", 35688], ["FLOAT_MAT4", 35676], ["FLOAT_MAT4x2", 35689], ["FLOAT_MAT4x3", 35690], ["FLOAT_VEC2", 35664], ["FLOAT_VEC3", 35665], ["FLOAT_VEC4", 35666], ["INT", 5124], ["INT_VEC2", 35667], ["INT_VEC3", 35668], ["INT_VEC4", 35669], ["INT_SAMPLER_2D", 36298], ["INT_SAMPLER_2D_ARRAY", 36303], ["INT_SAMPLER_3D", 36299], ["INT_SAMPLER_CUBE", 36300], ["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["UNSIGNED_INT_SAMPLER_2D", 36306], ["UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311], ["UNSIGNED_INT_SAMPLER_3D", 36307], ["UNSIGNED_INT_SAMPLER_CUBE", 36308], ["UNSIGNED_INT_VEC2", 36294], ["UNSIGNED_INT_VEC3", 36295], ["UNSIGNED_INT_VEC4", 36296], ["SAMPLER_2D", 35678], ["SAMPLER_2D_ARRAY", 36289], ["SAMPLER_2D_ARRAY_SHADOW", 36292], ["SAMPLER_2D_SHADOW", 35682], ["SAMPLER_3D", 35679], ["SAMPLER_CUBE", 35680], ["SAMPLER_CUBE_SHADOW", 36293]])], ["TypeInfo", GlTypeInfo$reflection()], ["ElementCount", int32_type], ["ByteSize", int32_type], ["Length", int32_type], ["ArrayIndex", int32_type], ["StartIndex", int32_type], ["IsArray", bool_type], ["BlockIndex", int32_type], ["Offset", int32_type], ["ArrayStride", int32_type], ["MatrixStride", int32_type], ["IsRowMajor", bool_type], ["Children", array_type(GlUniformInfo$reflection())]]);
}

export class GlUboInfo extends Record {
    constructor(Name, BlockIndex, ByteSize, InVertexShader, InFragmentShader, Uniforms) {
        super();
        this.Name = Name;
        this.BlockIndex = (BlockIndex | 0);
        this.ByteSize = (ByteSize | 0);
        this.InVertexShader = InVertexShader;
        this.InFragmentShader = InFragmentShader;
        this.Uniforms = Uniforms;
    }
}

export function GlUboInfo$reflection() {
    return record_type("Wil.Webgl.Core.GlUboInfo", [], GlUboInfo, () => [["Name", string_type], ["BlockIndex", int32_type], ["ByteSize", int32_type], ["InVertexShader", bool_type], ["InFragmentShader", bool_type], ["Uniforms", list_type(GlUniformInfo$reflection())]]);
}

export class GlAttributeInfo extends Record {
    constructor(Index, Name, Location, Type, TypeInfo) {
        super();
        this.Index = (Index | 0);
        this.Name = Name;
        this.Location = (Location | 0);
        this.Type = (Type | 0);
        this.TypeInfo = TypeInfo;
    }
}

export function GlAttributeInfo$reflection() {
    return record_type("Wil.Webgl.Core.GlAttributeInfo", [], GlAttributeInfo, () => [["Index", int32_type], ["Name", string_type], ["Location", int32_type], ["Type", enum_type("Wil.Webgl.Types.WebglTypes.GlType", int32_type, [["Unknown", 0], ["BYTE", 5120], ["SHORT", 5122], ["BOOL", 35670], ["BOOL_VEC2", 35671], ["BOOL_VEC3", 35672], ["BOOL_VEC4", 35673], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["FLOAT_MAT2x3", 35685], ["FLOAT_MAT2", 35674], ["FLOAT_MAT2x4", 35686], ["FLOAT_MAT3", 35675], ["FLOAT_MAT3x2", 35687], ["FLOAT_MAT3x4", 35688], ["FLOAT_MAT4", 35676], ["FLOAT_MAT4x2", 35689], ["FLOAT_MAT4x3", 35690], ["FLOAT_VEC2", 35664], ["FLOAT_VEC3", 35665], ["FLOAT_VEC4", 35666], ["INT", 5124], ["INT_VEC2", 35667], ["INT_VEC3", 35668], ["INT_VEC4", 35669], ["INT_SAMPLER_2D", 36298], ["INT_SAMPLER_2D_ARRAY", 36303], ["INT_SAMPLER_3D", 36299], ["INT_SAMPLER_CUBE", 36300], ["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["UNSIGNED_INT_SAMPLER_2D", 36306], ["UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311], ["UNSIGNED_INT_SAMPLER_3D", 36307], ["UNSIGNED_INT_SAMPLER_CUBE", 36308], ["UNSIGNED_INT_VEC2", 36294], ["UNSIGNED_INT_VEC3", 36295], ["UNSIGNED_INT_VEC4", 36296], ["SAMPLER_2D", 35678], ["SAMPLER_2D_ARRAY", 36289], ["SAMPLER_2D_ARRAY_SHADOW", 36292], ["SAMPLER_2D_SHADOW", 35682], ["SAMPLER_3D", 35679], ["SAMPLER_CUBE", 35680], ["SAMPLER_CUBE_SHADOW", 36293]])], ["TypeInfo", GlTypeInfo$reflection()]]);
}

export class GlShader extends Record {
    constructor(ShaderId, Shader, ReferenceCount) {
        super();
        this.ShaderId = ShaderId;
        this.Shader = Shader;
        this.ReferenceCount = (ReferenceCount | 0);
    }
}

export function GlShader$reflection() {
    return record_type("Wil.Webgl.Core.GlShader", [], GlShader, () => [["ShaderId", string_type], ["Shader", class_type("Browser.Types.WebGLShader")], ["ReferenceCount", int32_type]]);
}

export class GlShaderSet extends Record {
    constructor(VertexShaderId, FragmentShaderId, VertexShader, FragmentShader, Uniforms, Ubos, Attributes, ReferenceCount) {
        super();
        this.VertexShaderId = VertexShaderId;
        this.FragmentShaderId = FragmentShaderId;
        this.VertexShader = VertexShader;
        this.FragmentShader = FragmentShader;
        this.Uniforms = Uniforms;
        this.Ubos = Ubos;
        this.Attributes = Attributes;
        this.ReferenceCount = (ReferenceCount | 0);
    }
}

export function GlShaderSet$reflection() {
    return record_type("Wil.Webgl.Core.GlShaderSet", [], GlShaderSet, () => [["VertexShaderId", string_type], ["FragmentShaderId", string_type], ["VertexShader", GlShader$reflection()], ["FragmentShader", GlShader$reflection()], ["Uniforms", list_type(GlUniformInfo$reflection())], ["Ubos", list_type(GlUboInfo$reflection())], ["Attributes", list_type(GlAttributeInfo$reflection())], ["ReferenceCount", int32_type]]);
}

export class GlProgramInfo extends Record {
    constructor(Gl, Program, ShaderSet, Uniforms, Ubos, Attributes) {
        super();
        this.Gl = Gl;
        this.Program = Program;
        this.ShaderSet = ShaderSet;
        this.Uniforms = Uniforms;
        this.Ubos = Ubos;
        this.Attributes = Attributes;
    }
}

export function GlProgramInfo$reflection() {
    return record_type("Wil.Webgl.Core.GlProgramInfo", [], GlProgramInfo, () => [["Gl", class_type("Browser.Types.WebGLRenderingContext")], ["Program", class_type("Browser.Types.WebGLProgram")], ["ShaderSet", GlShaderSet$reflection()], ["Uniforms", list_type(GlUniformInfo$reflection())], ["Ubos", list_type(GlUboInfo$reflection())], ["Attributes", list_type(GlAttributeInfo$reflection())]]);
}

let GlProgram__emptyProgramInfo = void 0;

let GlProgram_vertexShaders = empty_1();

let GlProgram_fragmentShaders = empty_1();

let GlProgram_shaderSets = empty_1();

export function GlProgram_getRootName(name) {
    const matchValue = name.indexOf("[") | 0;
    if (matchValue === -1) {
        return name;
    }
    else {
        const index = matchValue | 0;
        return name.slice(0, (index - 1) + 1);
    }
}

function GlProgram_Utils_createShaderSetKey(vertexId, fragmentId) {
    return toText(interpolate("%P()_%P()", [vertexId, fragmentId]));
}

export function GlProgram_Utils_createProgramFromShaders(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    else {
        const msg = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        const exn = new Error(msg);
        throw exn;
    }
}

export function GlProgram_Utils_createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = WebglShaderUtils_createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = WebglShaderUtils_createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    return GlProgram_Utils_createProgramFromShaders(gl, vertexShader, fragmentShader);
}

function GlProgram_Utils_createUniformInfos(gl, program) {
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    const Indices = Int32Array.from(rangeNumber(0, 1, count - 1));
    const getValues = (pname) => (gl.getActiveUniforms(program, Indices, pname));
    const blockIndices = getValues(35386);
    const offsets = getValues(35387);
    const arrayStrides = getValues(35388);
    const matrixStrides = getValues(35389);
    const rowMajors = getValues(35390);
    const createInfo = (index) => {
        let unitVar;
        const uniform = gl.getActiveUniform(program, index);
        const uniformType = (~(~uniform.type)) | 0;
        const ti = getGlTypeInfo(uniformType);
        const isArray = uniform.size > 1;
        const blockIndex = blockIndices[index] | 0;
        const arrayStride = arrayStrides[index] | 0;
        const matrixStride = matrixStrides[index] | 0;
        const length = (~(~uniform.size)) | 0;
        const byteSize = ((blockIndex < 0) ? (ti.ByteSize * length) : (isArray ? (arrayStride * length) : (ti.IsMatrix ? (ti.MatrixColCount * matrixStride) : ti.ByteSize))) | 0;
        return new GlUniformInfo(index, uniform.name, GlProgram_getRootName(uniform.name), gl.getUniformLocation(program, uniform.name), uniformType, ti, ti.ElementCount, byteSize, length, -1, -1, isArray, blockIndex, offsets[index], arrayStride, matrixStride, (unitVar = rowMajors[index], false), []);
    };
    const createMatrixColumn = (info, index_1) => {
        let matchValue, offset;
        const name = toText(interpolate("%P()Col%P()", [info.RootName, index_1]));
        const ti_1 = info.TypeInfo;
        const bti = getGlTypeInfo(info.TypeInfo.BaseType);
        return new GlUniformInfo(info.Index, name, info.RootName, gl.getUniformLocation(program, name), ti_1.BaseType, bti, ti_1.MatrixRowCount, bti.ByteSize * ti_1.MatrixRowCount, 1, index_1, index_1 * ti_1.MatrixRowCount, false, info.BlockIndex, (matchValue = (info.Offset | 0), (matchValue === -1) ? info.Offset : (offset = (matchValue | 0), offset + (info.MatrixStride * index_1))), info.ArrayStride, info.MatrixStride, info.IsRowMajor, info.Children);
    };
    const createMatrixColumns = (info_1) => {
        const array = Int32Array.from(rangeNumber(0, 1, info_1.TypeInfo.MatrixColCount - 1));
        return map(partialApply(1, createMatrixColumn, [info_1]), array);
    };
    const addMatrixChildren = (info_2) => {
        if (info_2.TypeInfo.IsMatrix) {
            return new GlUniformInfo(info_2.Index, info_2.Name, info_2.RootName, info_2.Location, info_2.Type, info_2.TypeInfo, info_2.ElementCount, info_2.ByteSize, info_2.Length, info_2.ArrayIndex, info_2.StartIndex, info_2.IsArray, info_2.BlockIndex, info_2.Offset, info_2.ArrayStride, info_2.MatrixStride, info_2.IsRowMajor, createMatrixColumns(info_2));
        }
        else {
            return info_2;
        }
    };
    const createArrayElement = (info_3, index_2) => {
        let matchValue_1, offset_1;
        const name_1 = toText(interpolate("%P()[%P()]", [info_3.RootName, index_2]));
        const ti_2 = info_3.TypeInfo;
        const bti_1 = getGlTypeInfo(info_3.TypeInfo.BaseType);
        return new GlUniformInfo(info_3.Index, name_1, info_3.RootName, gl.getUniformLocation(program, name_1), ti_2.BaseType, bti_1, info_3.ElementCount, info_3.TypeInfo.ByteSize, 1, index_2, index_2 * info_3.ElementCount, false, info_3.BlockIndex, (matchValue_1 = (info_3.Offset | 0), (matchValue_1 === -1) ? info_3.Offset : (offset_1 = (matchValue_1 | 0), offset_1 + (info_3.ArrayStride * index_2))), info_3.ArrayStride, info_3.MatrixStride, info_3.IsRowMajor, info_3.Children);
    };
    const adjustStartIndices = (info_4) => {
        const loop = (parent, info_5) => {
            const parentStartIndex = executeDefault(0, (p) => p.StartIndex, parent) | 0;
            const info_6 = new GlUniformInfo(info_5.Index, info_5.Name, info_5.RootName, info_5.Location, info_5.Type, info_5.TypeInfo, info_5.ElementCount, info_5.ByteSize, info_5.Length, info_5.ArrayIndex, (info_5.ArrayIndex * info_5.ElementCount) + parentStartIndex, info_5.IsArray, info_5.BlockIndex, info_5.Offset, info_5.ArrayStride, info_5.MatrixStride, info_5.IsRowMajor, info_5.Children);
            if (info_6.Children.length > 0) {
                const parent_1 = info_6;
                return new GlUniformInfo(info_6.Index, info_6.Name, info_6.RootName, info_6.Location, info_6.Type, info_6.TypeInfo, info_6.ElementCount, info_6.ByteSize, info_6.Length, info_6.ArrayIndex, info_6.StartIndex, info_6.IsArray, info_6.BlockIndex, info_6.Offset, info_6.ArrayStride, info_6.MatrixStride, info_6.IsRowMajor, map(partialApply(1, loop, [parent_1]), info_6.Children));
            }
            else {
                return info_6;
            }
        };
        return loop(void 0, info_4);
    };
    const adjustOffsets = (info_7) => {
        const adjustChild = (root, indexer, info_8) => (new GlUniformInfo(info_8.Index, info_8.Name, info_8.RootName, info_8.Location, info_8.Type, info_8.TypeInfo, info_8.ElementCount, info_8.ByteSize, info_8.Length, info_8.ArrayIndex, info_8.StartIndex, info_8.IsArray, info_8.BlockIndex, (info_8.Offset - root.Offset) + indexer.Offset, info_8.ArrayStride, info_8.MatrixStride, info_8.IsRowMajor, map(partialApply(1, adjustChild, [root, indexer]), info_8.Children)));
        const adjustIndexer = (root_1, indexer_1) => (new GlUniformInfo(indexer_1.Index, indexer_1.Name, indexer_1.RootName, indexer_1.Location, indexer_1.Type, indexer_1.TypeInfo, indexer_1.ElementCount, indexer_1.ByteSize, indexer_1.Length, indexer_1.ArrayIndex, indexer_1.StartIndex, indexer_1.IsArray, indexer_1.BlockIndex, indexer_1.Offset, indexer_1.ArrayStride, indexer_1.MatrixStride, indexer_1.IsRowMajor, map(partialApply(1, adjustChild, [root_1, indexer_1]), indexer_1.Children)));
        return new GlUniformInfo(info_7.Index, info_7.Name, info_7.RootName, info_7.Location, info_7.Type, info_7.TypeInfo, info_7.ElementCount, info_7.ByteSize, info_7.Length, info_7.ArrayIndex, info_7.StartIndex, info_7.IsArray, info_7.BlockIndex, info_7.Offset, info_7.ArrayStride, info_7.MatrixStride, info_7.IsRowMajor, map(partialApply(1, adjustIndexer, [info_7]), info_7.Children));
    };
    const createArrayElements = (info_9) => {
        const array_5 = Int32Array.from(rangeNumber(0, 1, info_9.Length - 1));
        return map(partialApply(1, createArrayElement, [info_9]), array_5);
    };
    const addArrayChildren = (info_10) => {
        const info_11 = new GlUniformInfo(info_10.Index, info_10.Name, info_10.RootName, info_10.Location, info_10.Type, info_10.TypeInfo, info_10.ElementCount, info_10.ByteSize, info_10.Length, 0, 0, info_10.IsArray, info_10.BlockIndex, info_10.Offset, info_10.ArrayStride, info_10.MatrixStride, info_10.IsRowMajor, info_10.Children);
        if (info_11.IsArray) {
            return adjustOffsets(adjustStartIndices(new GlUniformInfo(info_11.Index, info_11.Name, info_11.RootName, info_11.Location, info_11.Type, info_11.TypeInfo, info_11.ElementCount, info_11.ByteSize, info_11.Length, info_11.ArrayIndex, info_11.StartIndex, info_11.IsArray, info_11.BlockIndex, info_11.Offset, info_11.ArrayStride, info_11.MatrixStride, info_11.IsRowMajor, createArrayElements(info_11))));
        }
        else {
            return info_11;
        }
    };
    return map((arg_1) => addArrayChildren(addMatrixChildren(createInfo(arg_1))), Indices);
}

function GlProgram_Utils_getUboInfos(gl, program, uniforms) {
    const createInfo = (i) => {
        const getParam = (pname) => (gl.getActiveUniformBlockParameter(program, i, pname));
        return new GlUboInfo(gl.getActiveUniformBlockName(program, i), i, getParam(35392), getParam(35396), getParam(35398), ofArray(uniforms.filter((x) => (x.BlockIndex === i))));
    };
    const loop = (ubos_mut, i_1_mut) => {
        loop:
        while (true) {
            const ubos = ubos_mut, i_1 = i_1_mut;
            if (i_1 === 0) {
                return ubos;
            }
            else {
                const i_2 = i_1 | 0;
                ubos_mut = cons(createInfo(i_2 - 1), ubos);
                i_1_mut = (i_2 - 1);
                continue loop;
            }
            break;
        }
    };
    const count = gl.getProgramParameter(program, 35382);
    return loop(empty_2(), count);
}

function GlProgram_Utils_getAttributeInfos(gl, program) {
    const createInfo = (i) => {
        const attrib = gl.getActiveAttrib(program, i);
        const attributeType = (~(~attrib.type)) | 0;
        return new GlAttributeInfo(~(~i), attrib.name, ~(~gl.getAttribLocation(program, attrib.name)), attributeType, getGlTypeInfo(attributeType));
    };
    const count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    return where((info) => (!(info.Name.indexOf("gl_") === 0)), map_1(createInfo, ofSeq(rangeNumber(0, 1, count - 1))));
}

export function GlProgram_Utils_getVertexShader(gl, shaderId) {
    const matchValue = tryFind(shaderId, GlProgram_vertexShaders);
    if (matchValue == null) {
        const source = WebglShaderUtils_getVertexShaderSource(shaderId);
        const shader_1 = new GlShader(shaderId, WebglShaderUtils_createShader(gl, gl.VERTEX_SHADER, source), 0);
        GlProgram_vertexShaders = FSharpMap__Add(GlProgram_vertexShaders, shaderId, shader_1);
        return shader_1;
    }
    else {
        const shader = matchValue;
        return shader;
    }
}

export function GlProgram_Utils_getFragmentShader(gl, shaderId) {
    const matchValue = tryFind(shaderId, GlProgram_fragmentShaders);
    if (matchValue == null) {
        const source = WebglShaderUtils_getFragmentShaderSource(shaderId);
        const shader_1 = new GlShader(shaderId, WebglShaderUtils_createShader(gl, gl.FRAGMENT_SHADER, source), 0);
        GlProgram_fragmentShaders = FSharpMap__Add(GlProgram_fragmentShaders, shaderId, shader_1);
        return shader_1;
    }
    else {
        const shader = matchValue;
        return shader;
    }
}

export function GlProgram_Utils_deleteVertexShader(gl, shader) {
    shader.ReferenceCount = (shader.ReferenceCount - 1);
    if (shader.ReferenceCount <= 0) {
        GlProgram_vertexShaders = FSharpMap__Remove(GlProgram_vertexShaders, shader.ShaderId);
        gl.deleteShader(shader.Shader);
    }
}

export function GlProgram_Utils_deleteFragmentShader(gl, shader) {
    shader.ReferenceCount = (shader.ReferenceCount - 1);
    if (shader.ReferenceCount <= 0) {
        GlProgram_fragmentShaders = FSharpMap__Remove(GlProgram_fragmentShaders, shader.ShaderId);
        gl.deleteShader(shader.Shader);
    }
}

export function GlProgram_Utils_getShaderSet(gl, vertexId, fragmentId) {
    const key = GlProgram_Utils_createShaderSetKey(vertexId, fragmentId);
    const matchValue = tryFind(key, GlProgram_shaderSets);
    if (matchValue == null) {
        const vertex = GlProgram_Utils_getVertexShader(gl, vertexId);
        const fragment = GlProgram_Utils_getFragmentShader(gl, fragmentId);
        const program = GlProgram_Utils_createProgramFromShaders(gl, vertex.Shader, fragment.Shader);
        const uniforms = GlProgram_Utils_createUniformInfos(gl, program);
        const shaderSet_1 = new GlShaderSet(vertexId, fragmentId, vertex, fragment, ofArray(uniforms), GlProgram_Utils_getUboInfos(gl, program, uniforms), GlProgram_Utils_getAttributeInfos(gl, program), 1);
        gl.deleteProgram(program);
        GlProgram_shaderSets = FSharpMap__Add(GlProgram_shaderSets, key, shaderSet_1);
        return shaderSet_1;
    }
    else {
        const shaderSet = matchValue;
        shaderSet.ReferenceCount = (shaderSet.ReferenceCount + 1);
        return shaderSet;
    }
}

export function GlProgram_Utils_deleteShaderSet(gl, shaderSet) {
    shaderSet.ReferenceCount = (shaderSet.ReferenceCount - 1);
    if (shaderSet.ReferenceCount <= 0) {
        GlProgram_Utils_deleteVertexShader(gl, shaderSet.VertexShader);
        GlProgram_Utils_deleteFragmentShader(gl, shaderSet.FragmentShader);
        const key = GlProgram_Utils_createShaderSetKey(shaderSet.VertexShaderId, shaderSet.FragmentShaderId);
        GlProgram_shaderSets = FSharpMap__Remove(GlProgram_shaderSets, key);
    }
}

export function GlProgram_createProgramInfo(gl, vertexId, fragmentId) {
    const updateUniformLocation = (program, uniform) => (new GlUniformInfo(uniform.Index, uniform.Name, uniform.RootName, gl.getUniformLocation(program, uniform.Name), uniform.Type, uniform.TypeInfo, uniform.ElementCount, uniform.ByteSize, uniform.Length, uniform.ArrayIndex, uniform.StartIndex, uniform.IsArray, uniform.BlockIndex, uniform.Offset, uniform.ArrayStride, uniform.MatrixStride, uniform.IsRowMajor, map(partialApply(1, updateUniformLocation, [program]), uniform.Children)));
    const updateUboUniform = (uniforms, ubo) => (new GlUboInfo(ubo.Name, ubo.BlockIndex, ubo.ByteSize, ubo.InVertexShader, ubo.InFragmentShader, filter((x) => (x.BlockIndex === ubo.BlockIndex), uniforms)));
    const updateAttributeLocation = (program_1, attribute) => (new GlAttributeInfo(attribute.Index, attribute.Name, ~(~gl.getAttribLocation(program_1, attribute.Name)), attribute.Type, attribute.TypeInfo));
    const vertexSource = WebglShaderUtils_getVertexShaderSource(vertexId);
    const fragmentSource = WebglShaderUtils_getFragmentShaderSource(fragmentId);
    const program_2 = GlProgram_Utils_createProgram(gl, vertexSource, fragmentSource);
    const shaderSet = GlProgram_Utils_getShaderSet(gl, vertexId, fragmentId);
    shaderSet.VertexShader.ReferenceCount = (shaderSet.VertexShader.ReferenceCount + 1);
    shaderSet.FragmentShader.ReferenceCount = (shaderSet.FragmentShader.ReferenceCount + 1);
    const uniforms_1 = map_1(partialApply(1, updateUniformLocation, [program_2]), shaderSet.Uniforms);
    return new GlProgramInfo(gl, program_2, shaderSet, filter((u) => (u.BlockIndex < 0), uniforms_1), map_1(partialApply(1, updateUboUniform, [uniforms_1]), shaderSet.Ubos), map_1(partialApply(1, updateAttributeLocation, [program_2]), shaderSet.Attributes));
}

export function GlProgram_deleteProgramInfo(info) {
    let isEmpty;
    if (GlProgram__emptyProgramInfo != null) {
        const empty = GlProgram__emptyProgramInfo;
        isEmpty = equalsSafe(info, empty);
    }
    else {
        isEmpty = false;
    }
    if (!isEmpty) {
        GlProgram_Utils_deleteShaderSet(info.Gl, info.ShaderSet);
        info.Gl.deleteProgram(info.Program);
    }
}

function GlProgram_initEmptyProgramInfo(gl) {
    const programInfo = GlProgram_createProgramInfo(gl, "emptyVertex", "emptyFragment");
    GlProgram__emptyProgramInfo = programInfo;
    return programInfo;
}

export function GlProgram_emptyProgramInfo(gl) {
    if (GlProgram__emptyProgramInfo == null) {
        return GlProgram_initEmptyProgramInfo(gl);
    }
    else {
        const programInfo = GlProgram__emptyProgramInfo;
        return programInfo;
    }
}

export function GlProgram_emptyUniformInfo(name) {
    return new GlUniformInfo(-1, name, GlProgram_getRootName(name), null, 0, getGlTypeInfo(5126), -1, -1, -1, -1, -1, false, -1, -1, -1, -1, false, []);
}

export function GlProgram_emptyUboInfo(name) {
    return new GlUboInfo(name, -1, -1, false, false, empty_2());
}

export function GlProgram_emptyAttributeInfo(name) {
    return new GlAttributeInfo(-1, name, -1, 0, getGlTypeInfo(5126));
}

function GlProgram_allUniforms(info) {
    return delay(() => append(info.Uniforms, delay(() => collect((ubo) => ubo.Uniforms, info.Ubos))));
}

export function GlProgram_getUniform(name, info) {
    return tryFind_1((i) => (i.Name === name), GlProgram_allUniforms(info));
}

export function GlProgram_getUbo(name, info) {
    return tryFind_2((i) => (i.Name === name), info.Ubos);
}

export function GlProgram_getAttribute(name, info) {
    return tryFind_2((i) => (i.Name === name), info.Attributes);
}

export function GlProgram_getUniformOrDefault(name, info) {
    const matchValue = GlProgram_getUniform(name, info);
    if (matchValue == null) {
        return GlProgram_emptyUniformInfo(name);
    }
    else {
        const result = matchValue;
        return result;
    }
}

export function GlProgram_getUboOrDefault(name, info) {
    const matchValue = GlProgram_getUbo(name, info);
    if (matchValue == null) {
        return GlProgram_emptyUboInfo(name);
    }
    else {
        const result = matchValue;
        return result;
    }
}

export function GlProgram_getAttributeOrDefault(name, info) {
    const matchValue = GlProgram_getAttribute(name, info);
    if (matchValue == null) {
        return GlProgram_emptyAttributeInfo(name);
    }
    else {
        const result = matchValue;
        return result;
    }
}

