import { union_type, record_type, class_type, bool_type, enum_type, int32_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { toString, Union, Record } from "../.fable/fable-library.3.0.0/Types.js";
import { comparePrimitives, createAtom } from "../.fable/fable-library.3.0.0/Util.js";
import { tryFind, FSharpMap__Add, ofSeq } from "../.fable/fable-library.3.0.0/Map.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { enumName } from "../core/utils.js";
import { writeFloat32View, writeInt32View, writeUint16View, writeInt16View, writeUint8View, writeInt8View, uint32ArrayFactory, float32ArrayFactory, int32ArrayFactory, uint16ArrayFactory, int16ArrayFactory, uint8ArrayFactory, int8ArrayFactory } from "../js/typedarray_utils.js";

export const GlTypeT = enum_type("Wil.Webgl.Types.WebglTypes.GlType", int32_type, [["Unknown", 0], ["BYTE", 5120], ["SHORT", 5122], ["BOOL", 35670], ["BOOL_VEC2", 35671], ["BOOL_VEC3", 35672], ["BOOL_VEC4", 35673], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["FLOAT_MAT2x3", 35685], ["FLOAT_MAT2", 35674], ["FLOAT_MAT2x4", 35686], ["FLOAT_MAT3", 35675], ["FLOAT_MAT3x2", 35687], ["FLOAT_MAT3x4", 35688], ["FLOAT_MAT4", 35676], ["FLOAT_MAT4x2", 35689], ["FLOAT_MAT4x3", 35690], ["FLOAT_VEC2", 35664], ["FLOAT_VEC3", 35665], ["FLOAT_VEC4", 35666], ["INT", 5124], ["INT_VEC2", 35667], ["INT_VEC3", 35668], ["INT_VEC4", 35669], ["INT_SAMPLER_2D", 36298], ["INT_SAMPLER_2D_ARRAY", 36303], ["INT_SAMPLER_3D", 36299], ["INT_SAMPLER_CUBE", 36300], ["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["UNSIGNED_INT_SAMPLER_2D", 36306], ["UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311], ["UNSIGNED_INT_SAMPLER_3D", 36307], ["UNSIGNED_INT_SAMPLER_CUBE", 36308], ["UNSIGNED_INT_VEC2", 36294], ["UNSIGNED_INT_VEC3", 36295], ["UNSIGNED_INT_VEC4", 36296], ["SAMPLER_2D", 35678], ["SAMPLER_2D_ARRAY", 36289], ["SAMPLER_2D_ARRAY_SHADOW", 36292], ["SAMPLER_2D_SHADOW", 35682], ["SAMPLER_3D", 35679], ["SAMPLER_CUBE", 35680], ["SAMPLER_CUBE_SHADOW", 36293]]);

export const GlIndicesTypeT = enum_type("Wil.Webgl.Types.WebglTypes.GlIndicesType", int32_type, [["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125]]);

export class GlTypeInfo extends Record {
    constructor(Type, BaseType, ElementCount, ByteSize, BaseAlign, IsMatrix, MatrixColCount, MatrixRowCount, TypeArrayCreator) {
        super();
        this.Type = (Type | 0);
        this.BaseType = (BaseType | 0);
        this.ElementCount = (ElementCount | 0);
        this.ByteSize = (ByteSize | 0);
        this.BaseAlign = (BaseAlign | 0);
        this.IsMatrix = IsMatrix;
        this.MatrixColCount = (MatrixColCount | 0);
        this.MatrixRowCount = (MatrixRowCount | 0);
        this.TypeArrayCreator = TypeArrayCreator;
    }
}

export function GlTypeInfo$reflection() {
    return record_type("Wil.Webgl.Types.WebglTypes.GlTypeInfo", [], GlTypeInfo, () => [["Type", enum_type("Wil.Webgl.Types.WebglTypes.GlType", int32_type, [["Unknown", 0], ["BYTE", 5120], ["SHORT", 5122], ["BOOL", 35670], ["BOOL_VEC2", 35671], ["BOOL_VEC3", 35672], ["BOOL_VEC4", 35673], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["FLOAT_MAT2x3", 35685], ["FLOAT_MAT2", 35674], ["FLOAT_MAT2x4", 35686], ["FLOAT_MAT3", 35675], ["FLOAT_MAT3x2", 35687], ["FLOAT_MAT3x4", 35688], ["FLOAT_MAT4", 35676], ["FLOAT_MAT4x2", 35689], ["FLOAT_MAT4x3", 35690], ["FLOAT_VEC2", 35664], ["FLOAT_VEC3", 35665], ["FLOAT_VEC4", 35666], ["INT", 5124], ["INT_VEC2", 35667], ["INT_VEC3", 35668], ["INT_VEC4", 35669], ["INT_SAMPLER_2D", 36298], ["INT_SAMPLER_2D_ARRAY", 36303], ["INT_SAMPLER_3D", 36299], ["INT_SAMPLER_CUBE", 36300], ["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["UNSIGNED_INT_SAMPLER_2D", 36306], ["UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311], ["UNSIGNED_INT_SAMPLER_3D", 36307], ["UNSIGNED_INT_SAMPLER_CUBE", 36308], ["UNSIGNED_INT_VEC2", 36294], ["UNSIGNED_INT_VEC3", 36295], ["UNSIGNED_INT_VEC4", 36296], ["SAMPLER_2D", 35678], ["SAMPLER_2D_ARRAY", 36289], ["SAMPLER_2D_ARRAY_SHADOW", 36292], ["SAMPLER_2D_SHADOW", 35682], ["SAMPLER_3D", 35679], ["SAMPLER_CUBE", 35680], ["SAMPLER_CUBE_SHADOW", 36293]])], ["BaseType", enum_type("Wil.Webgl.Types.WebglTypes.GlType", int32_type, [["Unknown", 0], ["BYTE", 5120], ["SHORT", 5122], ["BOOL", 35670], ["BOOL_VEC2", 35671], ["BOOL_VEC3", 35672], ["BOOL_VEC4", 35673], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["FLOAT_MAT2x3", 35685], ["FLOAT_MAT2", 35674], ["FLOAT_MAT2x4", 35686], ["FLOAT_MAT3", 35675], ["FLOAT_MAT3x2", 35687], ["FLOAT_MAT3x4", 35688], ["FLOAT_MAT4", 35676], ["FLOAT_MAT4x2", 35689], ["FLOAT_MAT4x3", 35690], ["FLOAT_VEC2", 35664], ["FLOAT_VEC3", 35665], ["FLOAT_VEC4", 35666], ["INT", 5124], ["INT_VEC2", 35667], ["INT_VEC3", 35668], ["INT_VEC4", 35669], ["INT_SAMPLER_2D", 36298], ["INT_SAMPLER_2D_ARRAY", 36303], ["INT_SAMPLER_3D", 36299], ["INT_SAMPLER_CUBE", 36300], ["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["UNSIGNED_INT_SAMPLER_2D", 36306], ["UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311], ["UNSIGNED_INT_SAMPLER_3D", 36307], ["UNSIGNED_INT_SAMPLER_CUBE", 36308], ["UNSIGNED_INT_VEC2", 36294], ["UNSIGNED_INT_VEC3", 36295], ["UNSIGNED_INT_VEC4", 36296], ["SAMPLER_2D", 35678], ["SAMPLER_2D_ARRAY", 36289], ["SAMPLER_2D_ARRAY_SHADOW", 36292], ["SAMPLER_2D_SHADOW", 35682], ["SAMPLER_3D", 35679], ["SAMPLER_CUBE", 35680], ["SAMPLER_CUBE_SHADOW", 36293]])], ["ElementCount", int32_type], ["ByteSize", int32_type], ["BaseAlign", int32_type], ["IsMatrix", bool_type], ["MatrixColCount", int32_type], ["MatrixRowCount", int32_type], ["TypeArrayCreator", class_type("Wil.Js.TypedArrayUtils.ITypedArrayFactory")]]);
}

export function glTypeInfo(t, bt, ec, bs, ba, im, mcc, mrc, tac) {
    return new GlTypeInfo(t, bt, ec, bs, ba, im, mcc, mrc, tac);
}

export const BaseUnit = 4;

export const FloatByteSize = 4;

export const Vec4BaseAlign = 4 * BaseUnit;

export const glTypeInfos = createAtom(ofSeq([], {
    Compare: comparePrimitives,
}));

export function addGlTypeInfo(ti) {
    glTypeInfos(FSharpMap__Add(glTypeInfos(), ti.Type, ti), true);
}

export function getGlTypeInfo(t) {
    const matchValue = tryFind(t, glTypeInfos());
    if (matchValue == null) {
        throw (new Error(toText(interpolate("Could not get type info for %P()", [enumName(GlTypeT, t)]))));
    }
    else {
        const info = matchValue;
        return info;
    }
}

addGlTypeInfo(glTypeInfo(5120, 5120, 1, 1, 1 * BaseUnit, false, 0, 0, int8ArrayFactory));

addGlTypeInfo(glTypeInfo(5121, 5121, 1, 1, 1 * BaseUnit, false, 0, 0, uint8ArrayFactory));

addGlTypeInfo(glTypeInfo(5122, 5122, 1, 2, 1 * BaseUnit, false, 0, 0, int16ArrayFactory));

addGlTypeInfo(glTypeInfo(5123, 5123, 1, 2, 1 * BaseUnit, false, 0, 0, uint16ArrayFactory));

addGlTypeInfo(glTypeInfo(5124, 5124, 1, FloatByteSize, 1 * BaseUnit, false, 0, 0, int32ArrayFactory));

addGlTypeInfo(glTypeInfo(5126, 5126, 1, FloatByteSize, 1 * BaseUnit, false, 0, 0, float32ArrayFactory));

addGlTypeInfo(glTypeInfo(35674, 5126, 2 * 2, (2 * 2) * FloatByteSize, Vec4BaseAlign, true, 2, 2, float32ArrayFactory));

addGlTypeInfo(glTypeInfo(35685, 5126, 2 * 3, (2 * 3) * FloatByteSize, Vec4BaseAlign, true, 2, 3, float32ArrayFactory));

addGlTypeInfo(glTypeInfo(35675, 5126, 3 * 3, (3 * 3) * FloatByteSize, Vec4BaseAlign, true, 3, 3, float32ArrayFactory));

addGlTypeInfo(glTypeInfo(35676, 5126, 4 * 4, (4 * 4) * FloatByteSize, Vec4BaseAlign, true, 4, 4, float32ArrayFactory));

addGlTypeInfo(glTypeInfo(35664, 5126, 2, 2 * FloatByteSize, 2 * BaseUnit, false, 0, 0, float32ArrayFactory));

addGlTypeInfo(glTypeInfo(35665, 5126, 3, 3 * FloatByteSize, Vec4BaseAlign, false, 0, 0, float32ArrayFactory));

addGlTypeInfo(glTypeInfo(35666, 5126, 4, 4 * FloatByteSize, Vec4BaseAlign, false, 0, 0, float32ArrayFactory));

addGlTypeInfo(glTypeInfo(35667, 5124, 2, 2 * FloatByteSize, 2 * BaseUnit, false, 0, 0, int32ArrayFactory));

addGlTypeInfo(glTypeInfo(35668, 5124, 3, 3 * FloatByteSize, Vec4BaseAlign, false, 0, 0, int32ArrayFactory));

addGlTypeInfo(glTypeInfo(35669, 5124, 4, 4 * FloatByteSize, Vec4BaseAlign, false, 0, 0, int32ArrayFactory));

addGlTypeInfo(glTypeInfo(35670, 5125, 1, FloatByteSize, 1 * BaseUnit, false, 0, 0, uint32ArrayFactory));

addGlTypeInfo(glTypeInfo(5125, 5125, 1, FloatByteSize, 1 * BaseUnit, false, 0, 0, uint32ArrayFactory));

addGlTypeInfo(glTypeInfo(35678, 5124, 1, FloatByteSize, 1 * BaseUnit, false, 0, 0, int32ArrayFactory));

addGlTypeInfo(glTypeInfo(35679, 5124, 1, FloatByteSize, 1 * BaseUnit, false, 0, 0, int32ArrayFactory));

export const GlUniformParamT = enum_type("Wil.Webgl.Types.WebglTypes.GlUniformParam", int32_type, [["UNIFORM_TYPE", 35383], ["UNIFORM_SIZE", 35384], ["UNIFORM_BLOCK_INDEX", 35386], ["UNIFORM_OFFSET", 35387], ["UNIFORM_ARRAY_STRIDE", 35388], ["UNIFORM_MATRIX_STRIDE", 35389], ["UNIFORM_IS_ROW_MAJOR", 35390]]);

export const GlBlockParamT = enum_type("Wil.Webgl.Types.WebglTypes.GlBlockParam", int32_type, [["UNIFORM_BLOCK_BINDING", 35391], ["UNIFORM_BLOCK_DATA_SIZE", 35392], ["UNIFORM_BLOCK_ACTIVE_UNIFORMS", 35394], ["UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES", 35395], ["UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER", 35396], ["UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER", 35398]]);

export const GlIndexedParamT = enum_type("Wil.Webgl.Types.WebglTypes.GlIndexedParam", int32_type, [["TRANSFORM_FEEDBACK_BUFFER_BINDING", 35983], ["TRANSFORM_FEEDBACK_BUFFER_SIZE", 35973], ["TRANSFORM_FEEDBACK_BUFFER_START", 35972], ["UNIFORM_BUFFER_BINDING", 35368], ["UNIFORM_BUFFER_SIZE", 35370], ["UNIFORM_BUFFER_START", 35369]]);

export const GlProgParamNameT = enum_type("Wil.Webgl.Types.WebglTypes.GlProgParamName", int32_type, [["DELETE_STATUS", 35712], ["LINK_STATUS", 35714], ["VALIDATE_STATUS", 35715], ["ATTACHED_SHADERS", 35717], ["ACTIVE_ATTRIBUTES", 35721], ["ACTIVE_UNIFORMS", 35718], ["TRANSFORM_FEEDBACK_BUFFER_MODE", 35967], ["TRANSFORM_FEEDBACK_VARYINGS", 35971], ["ACTIVE_UNIFORM_BLOCKS", 35382]]);

export const GlBufferTargetT = enum_type("Wil.Webgl.Types.WebglTypes.GlBufferTarget", int32_type, [["ARRAY_BUFFER", 34962], ["ELEMENT_ARRAY_BUFFER", 34963], ["UNIFORM_BUFFER", 35345], ["TRANSFORM_FEEDBACK_BUFFER", 35982]]);

export const GlTextureTargetT = enum_type("Wil.Webgl.Types.WebglTypes.GlTextureTarget", int32_type, [["TEXTURE_2D", 3553], ["TEXTURE_CUBE_MAP_POSITIVE_X", 34069], ["TEXTURE_CUBE_MAP_NEGATIVE_X", 34070], ["TEXTURE_CUBE_MAP_POSITIVE_Y", 34071], ["TEXTURE_CUBE_MAP_NEGATIVE_Y", 34072], ["TEXTURE_CUBE_MAP_POSITIVE_Z", 34073], ["TEXTURE_CUBE_MAP_NEGATIVE_Z", 34074]]);

export const GlBufferUsageT = enum_type("Wil.Webgl.Types.WebglTypes.GlBufferUsage", int32_type, [["STREAM_DRAW", 35040], ["STATIC_DRAW", 35044], ["DYNAMIC_DRAW", 35048]]);

export const GlDrawPrimitiveT = enum_type("Wil.Webgl.Types.WebglTypes.GlDrawPrimitive", int32_type, [["POINTS", 0], ["LINES", 1], ["LINE_LOOP", 2], ["LINE_STRIP", 3], ["TRIANGLES", 4], ["TRIANGLE_STRIP", 5], ["TRIANGLE_FAN", 6]]);

export const GlClearBitT = enum_type("Wil.Webgl.Types.WebglTypes.GlClearBit", int32_type, [["COLOR_BUFFER_BIT", 16384], ["DEPTH_BUFFER_BIT", 256], ["STENCIL_BUFFER_BIT", 1024]]);

export class GlDrawMethod extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["DRAW_ARRAYS", "DRAW_ELEMENTS", "DRAW_ARRAYS_INSTANCED", "DRAW_ELEMENTS_INSTANCED", "Unknown"];
    }
}

export function GlDrawMethod$reflection() {
    return union_type("Wil.Webgl.Types.WebglTypes.GlDrawMethod", [], GlDrawMethod, () => [[], [], [], [], []]);
}

export const GlCullModeT = enum_type("Wil.Webgl.Types.WebglTypes.GlCullMode", int32_type, [["FRONT", 1028], ["BACK", 1029], ["FRONT_AND_BACK", 1032]]);

export const GlCapabilityT = enum_type("Wil.Webgl.Types.WebglTypes.GlCapability", int32_type, [["BLEND", 3042], ["CULL_FACE", 2884], ["DEPTH_TEST", 2929], ["DITHER", 3024], ["POLYGON_OFFSET_FILL", 32823], ["SAMPLE_ALPHA_TO_COVERAGE", 32926], ["SAMPLE_COVERAGE", 32928], ["SCISSOR_TEST", 3089], ["STENCIL_TEST", 2960], ["RASTERIZER_DISCARD", 35977]]);

export const GlBlendFactorT = enum_type("Wil.Webgl.Types.WebglTypes.GlBlendFactor", int32_type, [["ZERO", 0], ["ONE", 1], ["SRC_COLOR", 768], ["ONE_MINUS_SRC_COLOR", 769], ["SRC_ALPHA", 770], ["ONE_MINUS_SRC_ALPHA", 771], ["DST_ALPHA", 772], ["ONE_MINUS_DST_ALPHA", 773], ["DST_COLOR", 774], ["ONE_MINUS_DST_COLOR", 775], ["SRC_ALPHA_SATURATE", 776], ["CONSTANT_COLOR", 32769], ["ONE_MINUS_CONSTANT_COLOR", 32770], ["CONSTANT_ALPHA", 32771], ["ONE_MINUS_CONSTANT_ALPHA", 32772]]);

export const GlBlendModeT = enum_type("Wil.Webgl.Types.WebglTypes.GlBlendMode", int32_type, [["FUNC_ADD", 32774], ["FUNC_SUBTRACT", 32778], ["FUNC_REVERSE_SUBTRACT", 32779], ["MIN", 32775], ["MAX", 32776]]);

export const GlTextureUnitT = enum_type("Wil.Webgl.Types.WebglTypes.GlTextureUnit", int32_type, [["TEXTURE0", 33984], ["TEXTURE1", 33985], ["TEXTURE2", 33986], ["TEXTURE3", 33987], ["TEXTURE4", 33988], ["TEXTURE5", 33989], ["TEXTURE6", 33990], ["TEXTURE7", 33991], ["TEXTURE8", 33992], ["TEXTURE9", 33993], ["TEXTURE10", 33994], ["TEXTURE11", 33995], ["TEXTURE12", 33996], ["TEXTURE13", 33997], ["TEXTURE14", 33998], ["TEXTURE15", 33999], ["TEXTURE16", 34000], ["TEXTURE17", 34001], ["TEXTURE18", 34002], ["TEXTURE19", 34003], ["TEXTURE20", 34004], ["TEXTURE21", 34005], ["TEXTURE22", 34006], ["TEXTURE23", 34007], ["TEXTURE24", 34008], ["TEXTURE25", 34009], ["TEXTURE26", 34010], ["TEXTURE27", 34011], ["TEXTURE28", 34012], ["TEXTURE29", 34013], ["TEXTURE30", 34014], ["TEXTURE31", 34015]]);

export const GlInternalColorFormatT = enum_type("Wil.Webgl.Types.WebglTypes.GlInternalColorFormat", int32_type, [["RGB", 6407], ["RGBA", 6408], ["LUMINANCE", 6409], ["LUMINANCE_ALPHA", 6410], ["ALPHA", 6406], ["R8", 33321], ["R16F", 33325], ["R32F", 33326], ["R8UI", 33330], ["RG8", 33323], ["RG16F", 33327], ["RG32F", 33328], ["RG8UI", 33336], ["RGB8", 32849], ["SRGB8", 35905], ["RGB565", 36194], ["R11F_G11F_B10F", 35898], ["RGB9_E5", 35901], ["RGB16F", 34843], ["RGB32F", 34837], ["RGB8UI", 36221], ["RGBA8", 32856], ["SRGB8_ALPHA8", 35907], ["RGB5_A1", 32855], ["RGB10_A2", 32857], ["RGBA4", 32854], ["RGBA16F", 34842], ["RGBA32F", 34836], ["RGBA8UI", 36220], ["R8_SNORM", 36756], ["RG8_SNORM", 36757], ["RGB8_SNORM", 36758], ["RGBA8_SNORM", 36759], ["RGB10_A2UI", 36975], ["R8I", 33329], ["R16I", 33331], ["R16UI", 33332], ["R32I", 33333], ["R32UI", 33334], ["RG8I", 33335], ["RG16I", 33337], ["RG16UI", 33338], ["RG32I", 33339], ["RG32UI", 33340], ["RGB16I", 36233], ["RGB16UI", 36215], ["RGB32I", 36227], ["RGB32UI", 36209], ["RGBA8I", 36238], ["RGBA16I", 36232], ["RGBA16UI", 36214], ["RGBA32I", 36226], ["RGBA32UI", 36208], ["DEPTH_COMPONENT16", 33189], ["DEPTH_COMPONENT24", 33190], ["DEPTH_COMPONENT32F", 36012], ["DEPTH24_STENCIL8", 35056], ["DEPTH32F_STENCIL8", 36013]]);

export const GlColorFormatT = enum_type("Wil.Webgl.Types.WebglTypes.GlColorFormat", int32_type, [["RGB", 6407], ["RGBA", 6408], ["LUMINANCE_ALPHA", 6410], ["LUMINANCE", 6409], ["ALPHA", 6406], ["RED", 6403], ["RED_INTEGER", 36244], ["RG", 33319], ["RG_INTEGER", 33320], ["RGB_INTEGER", 36248], ["RGBA_INTEGER", 36249], ["DEPTH_COMPONENT", 6402], ["DEPTH_STENCIL", 34041]]);

export const GlTextureTypeT = enum_type("Wil.Webgl.Types.WebglTypes.GlTextureType", int32_type, [["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT_4_4_4_4", 32819], ["UNSIGNED_SHORT_5_5_5_1", 32820], ["UNSIGNED_SHORT_5_6_5", 33635], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["BYTE", 5120], ["SHORT", 5122], ["INT", 5124], ["UNSIGNED_INT_2_10_10_10_REV", 33640], ["UNSIGNED_INT_10F_11F_11F_REV", 35899], ["UNSIGNED_INT_5_9_9_9_REV", 35902], ["FLOAT_32_UNSIGNED_INT_24_8_REV", 36269]]);

export const GlTextureParamT = enum_type("Wil.Webgl.Types.WebglTypes.GlTextureParam", int32_type, [["TEXTURE_MAG_FILTER", 10240], ["TEXTURE_MIN_FILTER", 10241], ["TEXTURE_WRAP_S", 10242], ["TEXTURE_WRAP_T", 10243], ["TEXTURE_WRAP_R", 32882], ["TEXTURE_MIN_LOD", 33082], ["TEXTURE_MAX_LOD", 33083], ["TEXTURE_BASE_LEVEL", 33084], ["TEXTURE_MAX_LEVEL", 33085], ["TEXTURE_COMPARE_MODE", 34892], ["TEXTURE_COMPARE_FUNC", 34893]]);

export const GlMagFilterT = enum_type("Wil.Webgl.Types.WebglTypes.GlMagFilter", int32_type, [["NEAREST", 9728], ["LINEAR", 9729]]);

export const GlMinFilterT = enum_type("Wil.Webgl.Types.WebglTypes.GlMinFilter", int32_type, [["NEAREST", 9728], ["LINEAR", 9729], ["NEAREST_MIPMAP_NEAREST", 9984], ["LINEAR_MIPMAP_NEAREST", 9985], ["NEAREST_MIPMAP_LINEAR", 9986], ["LINEAR_MIPMAP_LINEAR", 9987]]);

export const GlWrapModeT = enum_type("Wil.Webgl.Types.WebglTypes.GlWrapMode", int32_type, [["REPEAT", 10497], ["CLAMP_TO_EDGE", 33071], ["MIRRORED_REPEAT", 33648]]);

export const GlCompareFuncT = enum_type("Wil.Webgl.Types.WebglTypes.GlCompareFunc", int32_type, [["NEVER", 512], ["LESS", 513], ["EQUAL", 514], ["LEQUAL", 515], ["GREATER", 516], ["NOTEQUAL", 517], ["GEQUAL", 518], ["ALWAYS", 519]]);

export const GlCompareModeT = enum_type("Wil.Webgl.Types.WebglTypes.GlCompareMode", int32_type, [["NONE", 0], ["COMPARE_REF_TO_TEXTURE", 34894]]);

export const GlPixelStoreParamT = enum_type("Wil.Webgl.Types.WebglTypes.GlPixelStoreParam", int32_type, [["PACK_ALIGNMENT", 3333], ["UNPACK_ALIGNMENT", 3317], ["UNPACK_FLIP_Y_WEBGL", 37440], ["UNPACK_PREMULTIPLY_ALPHA_WEBGL", 37441], ["UNPACK_COLORSPACE_CONVERSION_WEBGL", 37443], ["PACK_ROW_LENGTH", 3330], ["PACK_SKIP_PIXELS", 3332], ["PACK_SKIP_ROWS", 3331], ["UNPACK_ROW_LENGTH", 3314], ["UNPACK_IMAGE_HEIGHT", 32878], ["UNPACK_SKIP_PIXELS", 3316], ["UNPACK_SKIP_ROWS", 3315], ["UNPACK_SKIP_IMAGES", 32877]]);

export const GlPixelAlignT = enum_type("Wil.Webgl.Types.WebglTypes.GlPixelAlign", int32_type, [["ONE", 1], ["TWO", 2], ["FOUR", 4], ["EIGHT", 8]]);

export const GlPixelConversionT = enum_type("Wil.Webgl.Types.WebglTypes.GlPixelConversion", int32_type, [["NONE", 0], ["BROWSER_DEFAULT_WEBGL", 37444]]);

export function getViewWriter(dataType) {
    switch (dataType) {
        case 5120: {
            return (view_1) => ((ofs_1) => ((value_1) => writeInt8View(view_1, ofs_1, value_1)));
        }
        case 5121: {
            return (view_2) => ((ofs_2) => ((value_2) => writeUint8View(view_2, ofs_2, value_2)));
        }
        case 5122: {
            return (view_3) => ((ofs_3) => ((value_3) => writeInt16View(view_3, ofs_3, value_3)));
        }
        case 5123: {
            return (view_4) => ((ofs_4) => ((value_4) => writeUint16View(view_4, ofs_4, value_4)));
        }
        case 5124: {
            return (view_6) => ((ofs_6) => ((value_6) => writeInt32View(view_6, ofs_6, value_6)));
        }
        case 5126: {
            return (view) => ((ofs) => ((value) => writeFloat32View(view, ofs, value)));
        }
        case 5131: {
            return (view_5) => ((ofs_5) => ((value_5) => writeInt16View(view_5, ofs_5, value_5)));
        }
        case 35664: {
            return (view_11) => ((ofs_11) => ((value_11) => writeFloat32View(view_11, ofs_11, value_11)));
        }
        case 35665: {
            return (view_12) => ((ofs_12) => ((value_12) => writeFloat32View(view_12, ofs_12, value_12)));
        }
        case 35666: {
            return (view_13) => ((ofs_13) => ((value_13) => writeFloat32View(view_13, ofs_13, value_13)));
        }
        case 35670: {
            return (view_7) => ((ofs_7) => ((value_7) => writeInt32View(view_7, ofs_7, value_7)));
        }
        case 35674: {
            return (view_8) => ((ofs_8) => ((value_8) => writeFloat32View(view_8, ofs_8, value_8)));
        }
        case 35675: {
            return (view_9) => ((ofs_9) => ((value_9) => writeFloat32View(view_9, ofs_9, value_9)));
        }
        case 35676: {
            return (view_10) => ((ofs_10) => ((value_10) => writeFloat32View(view_10, ofs_10, value_10)));
        }
        default: {
            throw (new Error("No view writer for type: " + toString(dataType)));
        }
    }
}

