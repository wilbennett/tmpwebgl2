import { Record, Union } from "../.fable/fable-library.3.0.0/Types.js";
import { lambda_type, unit_type, float64_type, enum_type, string_type, uint8_type, record_type, list_type, array_type, option_type, obj_type, class_type, bool_type, int32_type, union_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { GlProgramInfo$reflection, GlAttributeInfo$reflection, GlUboInfo$reflection, GlUniformInfo$reflection } from "../webgl_core/program_utils.js";
import { GlBuffer$reflection } from "./glbuffer.js";
import { GlDrawMethod$reflection, GlTypeInfo$reflection } from "../webgl_core/webgl_types.js";
import { GlPixelStorage$reflection, GlContextAttribute$reflection, GlTexturePixels$reflection } from "./webgl_data_types.js";
import { Vec2$reflection, Vec4$reflection, Vec3$reflection } from "../core/vectors.js";
import { Mat4$reflection } from "../core/matricies.js";
import { Bounds$reflection } from "../twod/bounds.js";
import { GlCanvasParams$reflection } from "./glcanvasparams.js";
import { GlMouse$reflection } from "./glmouse.js";

export class Data_GlUniformKind extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Single", "Array", "ArrayChild"];
    }
}

export function Data_GlUniformKind$reflection() {
    return union_type("Wil.Webgl.Data.Data.GlUniformKind", [], Data_GlUniformKind, () => [[], [], []]);
}

export class Data_GlAttributeKind extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Single", "Interleave", "InterleaveChild"];
    }
}

export function Data_GlAttributeKind$reflection() {
    return union_type("Wil.Webgl.Data.Data.GlAttributeKind", [], Data_GlAttributeKind, () => [[], [], []]);
}

export class Data_GlCameraKind extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Ortho2D", "Perspective"];
    }
}

export function Data_GlCameraKind$reflection() {
    return union_type("Wil.Webgl.Data.Data.GlCameraKind", [], Data_GlCameraKind, () => [[], []]);
}

export class Data_GlTextureKind extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["DataTexture", "ImageTexture"];
    }
}

export function Data_GlTextureKind$reflection() {
    return union_type("Wil.Webgl.Data.Data.GlTextureKind", [], Data_GlTextureKind, () => [[], []]);
}

export class Data_GlUniformData extends Record {
    constructor(Id, Info, IsDirty, Data, Value, ParentObject, ParentUbo, RootUniform, ChildUniforms, Link, LinkedChildren) {
        super();
        this.Id = (Id | 0);
        this.Info = Info;
        this.IsDirty = IsDirty;
        this.Data = Data;
        this.Value = Value;
        this.ParentObject = ParentObject;
        this.ParentUbo = ParentUbo;
        this.RootUniform = RootUniform;
        this.ChildUniforms = ChildUniforms;
        this.Link = Link;
        this.LinkedChildren = LinkedChildren;
    }
}

export function Data_GlUniformData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlUniformData", [], Data_GlUniformData, () => [["Id", int32_type], ["Info", GlUniformInfo$reflection()], ["IsDirty", bool_type], ["Data", class_type("Fable.Core.JS.TypedArray")], ["Value", obj_type], ["ParentObject", Data_GlObjData$reflection()], ["ParentUbo", option_type(Data_GlUboData$reflection())], ["RootUniform", option_type(Data_GlUniformData$reflection())], ["ChildUniforms", array_type(Data_GlUniformData$reflection())], ["Link", option_type(Data_GlUniformData$reflection())], ["LinkedChildren", list_type(Data_GlUniformData$reflection())]]);
}

export class Data_GlUboData extends Record {
    constructor(Id, Info, IsDirty, Location, Uniforms, Buffer, Data, ParentObject, Link, LinkedChildren) {
        super();
        this.Id = (Id | 0);
        this.Info = Info;
        this.IsDirty = IsDirty;
        this.Location = (Location | 0);
        this.Uniforms = Uniforms;
        this.Buffer = Buffer;
        this.Data = Data;
        this.ParentObject = ParentObject;
        this.Link = Link;
        this.LinkedChildren = LinkedChildren;
    }
}

export function Data_GlUboData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlUboData", [], Data_GlUboData, () => [["Id", int32_type], ["Info", GlUboInfo$reflection()], ["IsDirty", bool_type], ["Location", int32_type], ["Uniforms", list_type(Data_GlUniformData$reflection())], ["Buffer", GlBuffer$reflection()], ["Data", class_type("Fable.Core.JS.TypedArray`1", [uint8_type])], ["ParentObject", Data_GlObjData$reflection()], ["Link", option_type(Data_GlUboData$reflection())], ["LinkedChildren", list_type(Data_GlUboData$reflection())]]);
}

export class Data_GlIndicesData extends Record {
    constructor(Name, IsDirty, IndicesType, ArrayCreator, Offset, Values, DataCount, BufferUsage, Buffer, ParentObject, Link, LinkedChildren, RecalcNeeded, CalcDataCount) {
        super();
        this.Name = Name;
        this.IsDirty = IsDirty;
        this.IndicesType = (IndicesType | 0);
        this.ArrayCreator = ArrayCreator;
        this.Offset = (Offset | 0);
        this.Values = Values;
        this.DataCount = (DataCount | 0);
        this.BufferUsage = (BufferUsage | 0);
        this.Buffer = Buffer;
        this.ParentObject = ParentObject;
        this.Link = Link;
        this.LinkedChildren = LinkedChildren;
        this.RecalcNeeded = RecalcNeeded;
        this.CalcDataCount = CalcDataCount;
    }
}

export function Data_GlIndicesData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlIndicesData", [], Data_GlIndicesData, () => [["Name", string_type], ["IsDirty", bool_type], ["IndicesType", enum_type("Wil.Webgl.Types.WebglTypes.GlIndicesType", int32_type, [["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125]])], ["ArrayCreator", class_type("Wil.Js.TypedArrayUtils.ITypedArrayFactory")], ["Offset", int32_type], ["Values", array_type(int32_type)], ["DataCount", int32_type], ["BufferUsage", enum_type("Wil.Webgl.Types.WebglTypes.GlBufferUsage", int32_type, [["STREAM_DRAW", 35040], ["STATIC_DRAW", 35044], ["DYNAMIC_DRAW", 35048]])], ["Buffer", GlBuffer$reflection()], ["ParentObject", Data_GlObjData$reflection()], ["Link", option_type(Data_GlIndicesData$reflection())], ["LinkedChildren", list_type(Data_GlIndicesData$reflection())], ["RecalcNeeded", bool_type], ["CalcDataCount", bool_type]]);
}

export class Data_GlAttributeData extends Record {
    constructor(Id, Kind, Info, IsDirty, BaseType, ArrayCreator, RecordSize, ByteSize, DataLength, BaseTypeInfo, Normalize, StartIndex, IndexStride, Stride, Offset, Values, DataCount, BufferUsage, DeterminesVertexCount, DeterminesInstanceCount, Divisor, Buffer, ChildAttributes, ParentObject, ParentAttribute, Link, LinkedChildren, CanSingleCopy, AdjustsStride, EnableNeeded, RecalcNeeded, CalcDataCount, CalcStride, CalcOffset) {
        super();
        this.Id = (Id | 0);
        this.Kind = Kind;
        this.Info = Info;
        this.IsDirty = IsDirty;
        this.BaseType = (BaseType | 0);
        this.ArrayCreator = ArrayCreator;
        this.RecordSize = (RecordSize | 0);
        this.ByteSize = (ByteSize | 0);
        this.DataLength = (DataLength | 0);
        this.BaseTypeInfo = BaseTypeInfo;
        this.Normalize = Normalize;
        this.StartIndex = (StartIndex | 0);
        this.IndexStride = (IndexStride | 0);
        this.Stride = (Stride | 0);
        this.Offset = (Offset | 0);
        this.Values = Values;
        this.DataCount = (DataCount | 0);
        this.BufferUsage = (BufferUsage | 0);
        this.DeterminesVertexCount = DeterminesVertexCount;
        this.DeterminesInstanceCount = DeterminesInstanceCount;
        this.Divisor = (Divisor | 0);
        this.Buffer = Buffer;
        this.ChildAttributes = ChildAttributes;
        this.ParentObject = ParentObject;
        this.ParentAttribute = ParentAttribute;
        this.Link = Link;
        this.LinkedChildren = LinkedChildren;
        this.CanSingleCopy = CanSingleCopy;
        this.AdjustsStride = AdjustsStride;
        this.EnableNeeded = EnableNeeded;
        this.RecalcNeeded = RecalcNeeded;
        this.CalcDataCount = CalcDataCount;
        this.CalcStride = CalcStride;
        this.CalcOffset = CalcOffset;
    }
}

export function Data_GlAttributeData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlAttributeData", [], Data_GlAttributeData, () => [["Id", int32_type], ["Kind", Data_GlAttributeKind$reflection()], ["Info", GlAttributeInfo$reflection()], ["IsDirty", bool_type], ["BaseType", enum_type("Wil.Webgl.Types.WebglTypes.GlType", int32_type, [["Unknown", 0], ["BYTE", 5120], ["SHORT", 5122], ["BOOL", 35670], ["BOOL_VEC2", 35671], ["BOOL_VEC3", 35672], ["BOOL_VEC4", 35673], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["FLOAT_MAT2x3", 35685], ["FLOAT_MAT2", 35674], ["FLOAT_MAT2x4", 35686], ["FLOAT_MAT3", 35675], ["FLOAT_MAT3x2", 35687], ["FLOAT_MAT3x4", 35688], ["FLOAT_MAT4", 35676], ["FLOAT_MAT4x2", 35689], ["FLOAT_MAT4x3", 35690], ["FLOAT_VEC2", 35664], ["FLOAT_VEC3", 35665], ["FLOAT_VEC4", 35666], ["INT", 5124], ["INT_VEC2", 35667], ["INT_VEC3", 35668], ["INT_VEC4", 35669], ["INT_SAMPLER_2D", 36298], ["INT_SAMPLER_2D_ARRAY", 36303], ["INT_SAMPLER_3D", 36299], ["INT_SAMPLER_CUBE", 36300], ["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["UNSIGNED_INT_SAMPLER_2D", 36306], ["UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311], ["UNSIGNED_INT_SAMPLER_3D", 36307], ["UNSIGNED_INT_SAMPLER_CUBE", 36308], ["UNSIGNED_INT_VEC2", 36294], ["UNSIGNED_INT_VEC3", 36295], ["UNSIGNED_INT_VEC4", 36296], ["SAMPLER_2D", 35678], ["SAMPLER_2D_ARRAY", 36289], ["SAMPLER_2D_ARRAY_SHADOW", 36292], ["SAMPLER_2D_SHADOW", 35682], ["SAMPLER_3D", 35679], ["SAMPLER_CUBE", 35680], ["SAMPLER_CUBE_SHADOW", 36293]])], ["ArrayCreator", class_type("Wil.Js.TypedArrayUtils.ITypedArrayFactory")], ["RecordSize", int32_type], ["ByteSize", int32_type], ["DataLength", int32_type], ["BaseTypeInfo", GlTypeInfo$reflection()], ["Normalize", bool_type], ["StartIndex", int32_type], ["IndexStride", int32_type], ["Stride", int32_type], ["Offset", int32_type], ["Values", array_type(float64_type)], ["DataCount", int32_type], ["BufferUsage", enum_type("Wil.Webgl.Types.WebglTypes.GlBufferUsage", int32_type, [["STREAM_DRAW", 35040], ["STATIC_DRAW", 35044], ["DYNAMIC_DRAW", 35048]])], ["DeterminesVertexCount", bool_type], ["DeterminesInstanceCount", bool_type], ["Divisor", int32_type], ["Buffer", GlBuffer$reflection()], ["ChildAttributes", list_type(Data_GlAttributeData$reflection())], ["ParentObject", Data_GlObjData$reflection()], ["ParentAttribute", option_type(Data_GlAttributeData$reflection())], ["Link", option_type(Data_GlAttributeData$reflection())], ["LinkedChildren", list_type(Data_GlAttributeData$reflection())], ["CanSingleCopy", bool_type], ["AdjustsStride", bool_type], ["EnableNeeded", bool_type], ["RecalcNeeded", bool_type], ["CalcDataCount", bool_type], ["CalcStride", bool_type], ["CalcOffset", bool_type]]);
}

export class Data_GlRootAttribute extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["SingleAttribute", "InterleaveAttribute"];
    }
}

export function Data_GlRootAttribute$reflection() {
    return union_type("Wil.Webgl.Data.Data.GlRootAttribute", [], Data_GlRootAttribute, () => [[["Item", Data_GlAttributeData$reflection()]], [["Item", Data_GlAttributeData$reflection()]]]);
}

export class Data_GlTextureData extends Record {
    constructor(Id, Name, IsDirty, Target, TextureId, Index, Level, Width, Height, InternalFormat, Format, DataType, Pixels, Offset, GenerateMipMap, MagFilter, MinFilter, WrapS, WrapT, WrapR, BaseLevel, CompareFunc, CompareMode, MaxLevel, MaxLod, MinLod, ParentObject, Link, LinkedChildren) {
        super();
        this.Id = (Id | 0);
        this.Name = Name;
        this.IsDirty = IsDirty;
        this.Target = (Target | 0);
        this.TextureId = TextureId;
        this.Index = (Index | 0);
        this.Level = (Level | 0);
        this.Width = Width;
        this.Height = Height;
        this.InternalFormat = (InternalFormat | 0);
        this.Format = (Format | 0);
        this.DataType = (DataType | 0);
        this.Pixels = Pixels;
        this.Offset = (Offset | 0);
        this.GenerateMipMap = GenerateMipMap;
        this.MagFilter = MagFilter;
        this.MinFilter = MinFilter;
        this.WrapS = WrapS;
        this.WrapT = WrapT;
        this.WrapR = WrapR;
        this.BaseLevel = BaseLevel;
        this.CompareFunc = CompareFunc;
        this.CompareMode = CompareMode;
        this.MaxLevel = MaxLevel;
        this.MaxLod = MaxLod;
        this.MinLod = MinLod;
        this.ParentObject = ParentObject;
        this.Link = Link;
        this.LinkedChildren = LinkedChildren;
    }
}

export function Data_GlTextureData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlTextureData", [], Data_GlTextureData, () => [["Id", int32_type], ["Name", string_type], ["IsDirty", bool_type], ["Target", enum_type("Wil.Webgl.Types.WebglTypes.GlTextureTarget", int32_type, [["TEXTURE_2D", 3553], ["TEXTURE_CUBE_MAP_POSITIVE_X", 34069], ["TEXTURE_CUBE_MAP_NEGATIVE_X", 34070], ["TEXTURE_CUBE_MAP_POSITIVE_Y", 34071], ["TEXTURE_CUBE_MAP_NEGATIVE_Y", 34072], ["TEXTURE_CUBE_MAP_POSITIVE_Z", 34073], ["TEXTURE_CUBE_MAP_NEGATIVE_Z", 34074]])], ["TextureId", class_type("Browser.Types.WebGLTexture")], ["Index", int32_type], ["Level", int32_type], ["Width", float64_type], ["Height", float64_type], ["InternalFormat", enum_type("Wil.Webgl.Types.WebglTypes.GlInternalColorFormat", int32_type, [["RGB", 6407], ["RGBA", 6408], ["LUMINANCE", 6409], ["LUMINANCE_ALPHA", 6410], ["ALPHA", 6406], ["R8", 33321], ["R16F", 33325], ["R32F", 33326], ["R8UI", 33330], ["RG8", 33323], ["RG16F", 33327], ["RG32F", 33328], ["RG8UI", 33336], ["RGB8", 32849], ["SRGB8", 35905], ["RGB565", 36194], ["R11F_G11F_B10F", 35898], ["RGB9_E5", 35901], ["RGB16F", 34843], ["RGB32F", 34837], ["RGB8UI", 36221], ["RGBA8", 32856], ["SRGB8_ALPHA8", 35907], ["RGB5_A1", 32855], ["RGB10_A2", 32857], ["RGBA4", 32854], ["RGBA16F", 34842], ["RGBA32F", 34836], ["RGBA8UI", 36220], ["R8_SNORM", 36756], ["RG8_SNORM", 36757], ["RGB8_SNORM", 36758], ["RGBA8_SNORM", 36759], ["RGB10_A2UI", 36975], ["R8I", 33329], ["R16I", 33331], ["R16UI", 33332], ["R32I", 33333], ["R32UI", 33334], ["RG8I", 33335], ["RG16I", 33337], ["RG16UI", 33338], ["RG32I", 33339], ["RG32UI", 33340], ["RGB16I", 36233], ["RGB16UI", 36215], ["RGB32I", 36227], ["RGB32UI", 36209], ["RGBA8I", 36238], ["RGBA16I", 36232], ["RGBA16UI", 36214], ["RGBA32I", 36226], ["RGBA32UI", 36208], ["DEPTH_COMPONENT16", 33189], ["DEPTH_COMPONENT24", 33190], ["DEPTH_COMPONENT32F", 36012], ["DEPTH24_STENCIL8", 35056], ["DEPTH32F_STENCIL8", 36013]])], ["Format", enum_type("Wil.Webgl.Types.WebglTypes.GlColorFormat", int32_type, [["RGB", 6407], ["RGBA", 6408], ["LUMINANCE_ALPHA", 6410], ["LUMINANCE", 6409], ["ALPHA", 6406], ["RED", 6403], ["RED_INTEGER", 36244], ["RG", 33319], ["RG_INTEGER", 33320], ["RGB_INTEGER", 36248], ["RGBA_INTEGER", 36249], ["DEPTH_COMPONENT", 6402], ["DEPTH_STENCIL", 34041]])], ["DataType", enum_type("Wil.Webgl.Types.WebglTypes.GlTextureType", int32_type, [["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT_4_4_4_4", 32819], ["UNSIGNED_SHORT_5_5_5_1", 32820], ["UNSIGNED_SHORT_5_6_5", 33635], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["BYTE", 5120], ["SHORT", 5122], ["INT", 5124], ["UNSIGNED_INT_2_10_10_10_REV", 33640], ["UNSIGNED_INT_10F_11F_11F_REV", 35899], ["UNSIGNED_INT_5_9_9_9_REV", 35902], ["FLOAT_32_UNSIGNED_INT_24_8_REV", 36269]])], ["Pixels", GlTexturePixels$reflection()], ["Offset", int32_type], ["GenerateMipMap", bool_type], ["MagFilter", option_type(enum_type("Wil.Webgl.Types.WebglTypes.GlMagFilter", int32_type, [["NEAREST", 9728], ["LINEAR", 9729]]))], ["MinFilter", option_type(enum_type("Wil.Webgl.Types.WebglTypes.GlMinFilter", int32_type, [["NEAREST", 9728], ["LINEAR", 9729], ["NEAREST_MIPMAP_NEAREST", 9984], ["LINEAR_MIPMAP_NEAREST", 9985], ["NEAREST_MIPMAP_LINEAR", 9986], ["LINEAR_MIPMAP_LINEAR", 9987]]))], ["WrapS", option_type(enum_type("Wil.Webgl.Types.WebglTypes.GlWrapMode", int32_type, [["REPEAT", 10497], ["CLAMP_TO_EDGE", 33071], ["MIRRORED_REPEAT", 33648]]))], ["WrapT", option_type(enum_type("Wil.Webgl.Types.WebglTypes.GlWrapMode", int32_type, [["REPEAT", 10497], ["CLAMP_TO_EDGE", 33071], ["MIRRORED_REPEAT", 33648]]))], ["WrapR", option_type(enum_type("Wil.Webgl.Types.WebglTypes.GlWrapMode", int32_type, [["REPEAT", 10497], ["CLAMP_TO_EDGE", 33071], ["MIRRORED_REPEAT", 33648]]))], ["BaseLevel", option_type(int32_type)], ["CompareFunc", option_type(enum_type("Wil.Webgl.Types.WebglTypes.GlCompareFunc", int32_type, [["NEVER", 512], ["LESS", 513], ["EQUAL", 514], ["LEQUAL", 515], ["GREATER", 516], ["NOTEQUAL", 517], ["GEQUAL", 518], ["ALWAYS", 519]]))], ["CompareMode", option_type(enum_type("Wil.Webgl.Types.WebglTypes.GlCompareMode", int32_type, [["NONE", 0], ["COMPARE_REF_TO_TEXTURE", 34894]]))], ["MaxLevel", option_type(int32_type)], ["MaxLod", option_type(float64_type)], ["MinLod", option_type(float64_type)], ["ParentObject", Data_GlObjData$reflection()], ["Link", option_type(Data_GlTextureData$reflection())], ["LinkedChildren", list_type(Data_GlTextureData$reflection())]]);
}

export class Data_GlObjData extends Record {
    constructor(Id, Name, ProgramInfo, IsDirty, Scene, DrawMethod, DrawPrimitive, VertexCount, VertexOffset, VertexCountOffset, InstanceCount, InstanceOffset, InstanceCountOffset, IndicesOffset, Capabilities, Uniforms, Ubos, Attributes, Indices, Textures, VertexCountAttributes, InstanceCountAttributes, Vao, ProcessLinked, Layer, ParallaxCamera, ParallaxDistance, ParallaxOffset, ParallaxLastPosition, Angle, Position, Scale, ModelMatrix, ParallaxMatrix, Parent, Link, LinkedChildren, IsModelDirty, IsParallaxDirty, RecalcNeeded, CalcDrawMethod, CalcVertexCount, CalcInstanceCount) {
        super();
        this.Id = (Id | 0);
        this.Name = Name;
        this.ProgramInfo = ProgramInfo;
        this.IsDirty = IsDirty;
        this.Scene = Scene;
        this.DrawMethod = DrawMethod;
        this.DrawPrimitive = (DrawPrimitive | 0);
        this.VertexCount = (VertexCount | 0);
        this.VertexOffset = (VertexOffset | 0);
        this.VertexCountOffset = (VertexCountOffset | 0);
        this.InstanceCount = (InstanceCount | 0);
        this.InstanceOffset = (InstanceOffset | 0);
        this.InstanceCountOffset = (InstanceCountOffset | 0);
        this.IndicesOffset = (IndicesOffset | 0);
        this.Capabilities = Capabilities;
        this.Uniforms = Uniforms;
        this.Ubos = Ubos;
        this.Attributes = Attributes;
        this.Indices = Indices;
        this.Textures = Textures;
        this.VertexCountAttributes = VertexCountAttributes;
        this.InstanceCountAttributes = InstanceCountAttributes;
        this.Vao = Vao;
        this.ProcessLinked = ProcessLinked;
        this.Layer = (Layer | 0);
        this.ParallaxCamera = ParallaxCamera;
        this.ParallaxDistance = ParallaxDistance;
        this.ParallaxOffset = ParallaxOffset;
        this.ParallaxLastPosition = ParallaxLastPosition;
        this.Angle = Angle;
        this.Position = Position;
        this.Scale = Scale;
        this.ModelMatrix = ModelMatrix;
        this.ParallaxMatrix = ParallaxMatrix;
        this.Parent = Parent;
        this.Link = Link;
        this.LinkedChildren = LinkedChildren;
        this.IsModelDirty = IsModelDirty;
        this.IsParallaxDirty = IsParallaxDirty;
        this.RecalcNeeded = RecalcNeeded;
        this.CalcDrawMethod = CalcDrawMethod;
        this.CalcVertexCount = CalcVertexCount;
        this.CalcInstanceCount = CalcInstanceCount;
    }
}

export function Data_GlObjData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlObjData", [], Data_GlObjData, () => [["Id", int32_type], ["Name", string_type], ["ProgramInfo", GlProgramInfo$reflection()], ["IsDirty", bool_type], ["Scene", Data_GlSceneData$reflection()], ["DrawMethod", GlDrawMethod$reflection()], ["DrawPrimitive", enum_type("Wil.Webgl.Types.WebglTypes.GlDrawPrimitive", int32_type, [["POINTS", 0], ["LINES", 1], ["LINE_LOOP", 2], ["LINE_STRIP", 3], ["TRIANGLES", 4], ["TRIANGLE_STRIP", 5], ["TRIANGLE_FAN", 6]])], ["VertexCount", int32_type], ["VertexOffset", int32_type], ["VertexCountOffset", int32_type], ["InstanceCount", int32_type], ["InstanceOffset", int32_type], ["InstanceCountOffset", int32_type], ["IndicesOffset", int32_type], ["Capabilities", list_type(lambda_type(class_type("Browser.Types.WebGLRenderingContext"), unit_type))], ["Uniforms", list_type(Data_GlUniformData$reflection())], ["Ubos", list_type(Data_GlUboData$reflection())], ["Attributes", list_type(Data_GlRootAttribute$reflection())], ["Indices", option_type(Data_GlIndicesData$reflection())], ["Textures", list_type(Data_GlTextureData$reflection())], ["VertexCountAttributes", list_type(Data_GlAttributeData$reflection())], ["InstanceCountAttributes", list_type(Data_GlAttributeData$reflection())], ["Vao", class_type("Wil.Webgl.Core.WebglExtensions.WebGLVAO")], ["ProcessLinked", bool_type], ["Layer", int32_type], ["ParallaxCamera", option_type(Data_GlCameraData$reflection())], ["ParallaxDistance", float64_type], ["ParallaxOffset", Vec3$reflection()], ["ParallaxLastPosition", Vec3$reflection()], ["Angle", Vec3$reflection()], ["Position", Vec3$reflection()], ["Scale", float64_type], ["ModelMatrix", Mat4$reflection()], ["ParallaxMatrix", option_type(Mat4$reflection())], ["Parent", option_type(Data_GlObjData$reflection())], ["Link", option_type(Data_GlObjData$reflection())], ["LinkedChildren", list_type(Data_GlObjData$reflection())], ["IsModelDirty", bool_type], ["IsParallaxDirty", bool_type], ["RecalcNeeded", bool_type], ["CalcDrawMethod", bool_type], ["CalcVertexCount", bool_type], ["CalcInstanceCount", bool_type]]);
}

export class Data_GlCameraData extends Record {
    constructor(Id, Kind, Name, IsDirty, Scene, ClearViewport, CameraBackground, ClearMask, BorderWidth, AutoSizeViewport, UseViewSizeAspect, AutoPosition, Position, LookAt, ViewSize, ViewportBounds, ScissorBounds, Up, Near, Far, Aspect, Fov, ProjectionMatrix, ViewMatrix) {
        super();
        this.Id = (Id | 0);
        this.Kind = Kind;
        this.Name = Name;
        this.IsDirty = IsDirty;
        this.Scene = Scene;
        this.ClearViewport = ClearViewport;
        this.CameraBackground = CameraBackground;
        this.ClearMask = (ClearMask | 0);
        this.BorderWidth = BorderWidth;
        this.AutoSizeViewport = AutoSizeViewport;
        this.UseViewSizeAspect = UseViewSizeAspect;
        this.AutoPosition = AutoPosition;
        this.Position = Position;
        this.LookAt = LookAt;
        this.ViewSize = ViewSize;
        this.ViewportBounds = ViewportBounds;
        this.ScissorBounds = ScissorBounds;
        this.Up = Up;
        this.Near = Near;
        this.Far = Far;
        this.Aspect = Aspect;
        this.Fov = Fov;
        this.ProjectionMatrix = ProjectionMatrix;
        this.ViewMatrix = ViewMatrix;
    }
}

export function Data_GlCameraData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlCameraData", [], Data_GlCameraData, () => [["Id", int32_type], ["Kind", Data_GlCameraKind$reflection()], ["Name", string_type], ["IsDirty", bool_type], ["Scene", Data_GlSceneData$reflection()], ["ClearViewport", bool_type], ["CameraBackground", Vec4$reflection()], ["ClearMask", enum_type("Wil.Webgl.Types.WebglTypes.GlClearBit", int32_type, [["COLOR_BUFFER_BIT", 16384], ["DEPTH_BUFFER_BIT", 256], ["STENCIL_BUFFER_BIT", 1024]])], ["BorderWidth", float64_type], ["AutoSizeViewport", bool_type], ["UseViewSizeAspect", bool_type], ["AutoPosition", bool_type], ["Position", Vec3$reflection()], ["LookAt", Vec3$reflection()], ["ViewSize", Vec2$reflection()], ["ViewportBounds", Bounds$reflection()], ["ScissorBounds", Bounds$reflection()], ["Up", Vec3$reflection()], ["Near", float64_type], ["Far", float64_type], ["Aspect", float64_type], ["Fov", float64_type], ["ProjectionMatrix", Mat4$reflection()], ["ViewMatrix", Mat4$reflection()]]);
}

export class Data_GlLayerData extends Record {
    constructor(Index, Objects) {
        super();
        this.Index = (Index | 0);
        this.Objects = Objects;
    }
}

export function Data_GlLayerData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlLayerData", [], Data_GlLayerData, () => [["Index", int32_type], ["Objects", list_type(Data_GlObjData$reflection())]]);
}

export class Data_GlSceneData extends Record {
    constructor(Id, Name, IsDirty, Canvas, SceneBackground, ClearMask, WorldBounds, SceneBounds, WorldScale, LineWidthScale, ClearSceneBackground, Layers, DefaultLayer, Shared, Cameras) {
        super();
        this.Id = (Id | 0);
        this.Name = Name;
        this.IsDirty = IsDirty;
        this.Canvas = Canvas;
        this.SceneBackground = SceneBackground;
        this.ClearMask = (ClearMask | 0);
        this.WorldBounds = WorldBounds;
        this.SceneBounds = SceneBounds;
        this.WorldScale = WorldScale;
        this.LineWidthScale = LineWidthScale;
        this.ClearSceneBackground = ClearSceneBackground;
        this.Layers = Layers;
        this.DefaultLayer = (DefaultLayer | 0);
        this.Shared = Shared;
        this.Cameras = Cameras;
    }
}

export function Data_GlSceneData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlSceneData", [], Data_GlSceneData, () => [["Id", int32_type], ["Name", string_type], ["IsDirty", bool_type], ["Canvas", Data_GlCanvasData$reflection()], ["SceneBackground", Vec4$reflection()], ["ClearMask", enum_type("Wil.Webgl.Types.WebglTypes.GlClearBit", int32_type, [["COLOR_BUFFER_BIT", 16384], ["DEPTH_BUFFER_BIT", 256], ["STENCIL_BUFFER_BIT", 1024]])], ["WorldBounds", Bounds$reflection()], ["SceneBounds", Bounds$reflection()], ["WorldScale", float64_type], ["LineWidthScale", float64_type], ["ClearSceneBackground", bool_type], ["Layers", array_type(Data_GlLayerData$reflection())], ["DefaultLayer", int32_type], ["Shared", option_type(Data_GlObjData$reflection())], ["Cameras", list_type(Data_GlCameraData$reflection())]]);
}

export class Data_GlCanvasData extends Record {
    constructor(Name, IsDirty, Context, Params, CanvasBackground, ClearMask, ClearCanvas, Size, WorldBounds, Mouse, Global, Scenes) {
        super();
        this.Name = Name;
        this.IsDirty = IsDirty;
        this.Context = Context;
        this.Params = Params;
        this.CanvasBackground = CanvasBackground;
        this.ClearMask = (ClearMask | 0);
        this.ClearCanvas = ClearCanvas;
        this.Size = Size;
        this.WorldBounds = WorldBounds;
        this.Mouse = Mouse;
        this.Global = Global;
        this.Scenes = Scenes;
    }
}

export function Data_GlCanvasData$reflection() {
    return record_type("Wil.Webgl.Data.Data.GlCanvasData", [], Data_GlCanvasData, () => [["Name", string_type], ["IsDirty", bool_type], ["Context", class_type("Browser.Types.WebGLRenderingContext")], ["Params", GlCanvasParams$reflection()], ["CanvasBackground", Vec4$reflection()], ["ClearMask", enum_type("Wil.Webgl.Types.WebglTypes.GlClearBit", int32_type, [["COLOR_BUFFER_BIT", 16384], ["DEPTH_BUFFER_BIT", 256], ["STENCIL_BUFFER_BIT", 1024]])], ["ClearCanvas", bool_type], ["Size", Vec2$reflection()], ["WorldBounds", Bounds$reflection()], ["Mouse", GlMouse$reflection()], ["Global", option_type(Data_GlObjData$reflection())], ["Scenes", array_type(Data_GlSceneData$reflection())]]);
}

export function Data_GlUniformData__get_Name(this$) {
    return this$.Info.Name;
}

export function Data_GlUboData__get_Name(this$) {
    return this$.Info.Name;
}

export function Data_GlAttributeData__get_Name(this$) {
    return this$.Info.Name;
}

export class BuilderTypes_GlUniformProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Value", "UniformLink"];
    }
}

export function BuilderTypes_GlUniformProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlUniformProp", [], BuilderTypes_GlUniformProp, () => [[["Item", obj_type]], [["Item", string_type]]]);
}

export class BuilderTypes_GlUboProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["BufferIndex", "UboUniform", "UboLink"];
    }
}

export function BuilderTypes_GlUboProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlUboProp", [], BuilderTypes_GlUboProp, () => [[["Item", int32_type]], [["Item", lambda_type(list_type(BuilderTypes_GlUniformProp$reflection()), lambda_type(Data_GlUboData$reflection(), lambda_type(Data_GlObjData$reflection(), Data_GlUniformData$reflection())))]], [["Item", string_type]]]);
}

export class BuilderTypes_GlAttrProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["BaseType", "Normalize", "DontAdjustStride", "Stride", "Offset", "Values", "DataCount", "BufferUsage", "DeterminesVertexCount", "DeterminesInstanceCount", "Divisor", "ChildAttribute", "AttributeLink"];
    }
}

export function BuilderTypes_GlAttrProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlAttrProp", [], BuilderTypes_GlAttrProp, () => [[["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlType", int32_type, [["Unknown", 0], ["BYTE", 5120], ["SHORT", 5122], ["BOOL", 35670], ["BOOL_VEC2", 35671], ["BOOL_VEC3", 35672], ["BOOL_VEC4", 35673], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["FLOAT_MAT2x3", 35685], ["FLOAT_MAT2", 35674], ["FLOAT_MAT2x4", 35686], ["FLOAT_MAT3", 35675], ["FLOAT_MAT3x2", 35687], ["FLOAT_MAT3x4", 35688], ["FLOAT_MAT4", 35676], ["FLOAT_MAT4x2", 35689], ["FLOAT_MAT4x3", 35690], ["FLOAT_VEC2", 35664], ["FLOAT_VEC3", 35665], ["FLOAT_VEC4", 35666], ["INT", 5124], ["INT_VEC2", 35667], ["INT_VEC3", 35668], ["INT_VEC4", 35669], ["INT_SAMPLER_2D", 36298], ["INT_SAMPLER_2D_ARRAY", 36303], ["INT_SAMPLER_3D", 36299], ["INT_SAMPLER_CUBE", 36300], ["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["UNSIGNED_INT_SAMPLER_2D", 36306], ["UNSIGNED_INT_SAMPLER_2D_ARRAY", 36311], ["UNSIGNED_INT_SAMPLER_3D", 36307], ["UNSIGNED_INT_SAMPLER_CUBE", 36308], ["UNSIGNED_INT_VEC2", 36294], ["UNSIGNED_INT_VEC3", 36295], ["UNSIGNED_INT_VEC4", 36296], ["SAMPLER_2D", 35678], ["SAMPLER_2D_ARRAY", 36289], ["SAMPLER_2D_ARRAY_SHADOW", 36292], ["SAMPLER_2D_SHADOW", 35682], ["SAMPLER_3D", 35679], ["SAMPLER_CUBE", 35680], ["SAMPLER_CUBE_SHADOW", 36293]])]], [], [], [["Item", int32_type]], [["Item", int32_type]], [["Item", array_type(float64_type)]], [["Item", int32_type]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlBufferUsage", int32_type, [["STREAM_DRAW", 35040], ["STATIC_DRAW", 35044], ["DYNAMIC_DRAW", 35048]])]], [], [], [["Item", int32_type]], [["Item", lambda_type(list_type(BuilderTypes_GlAttrProp$reflection()), lambda_type(Data_GlAttributeData$reflection(), lambda_type(Data_GlObjData$reflection(), Data_GlAttributeData$reflection())))]], [["Item", string_type]]]);
}

export class BuilderTypes_GlIndicesProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["IndexType", "IndexOffset", "IndexValues", "IndexBufferUsage", "IndicesLink"];
    }
}

export function BuilderTypes_GlIndicesProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlIndicesProp", [], BuilderTypes_GlIndicesProp, () => [[["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlIndicesType", int32_type, [["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125]])]], [["Item", int32_type]], [["Item", array_type(int32_type)]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlBufferUsage", int32_type, [["STREAM_DRAW", 35040], ["STATIC_DRAW", 35044], ["DYNAMIC_DRAW", 35048]])]], [["Item", string_type]]]);
}

export class BuilderTypes_GlObjProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["ObjectName", "DrawMethod", "DrawPrimitive", "VertexCount", "VertexOffset", "VertexCountOffset", "InstanceCount", "InstanceOffset", "InstanceCountOffset", "IndicesOffset", "Uniform", "Ubo", "Attribute", "Indices", "Texture", "Capability", "ProcessLinked", "ParallaxCamera", "ParallaxDistance", "Layer", "Angle", "AngleDegrees", "AngleZ", "AngleDegreesZ", "Position", "Scale", "ObjectLink"];
    }
}

export function BuilderTypes_GlObjProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlObjProp", [], BuilderTypes_GlObjProp, () => [[["Item", string_type]], [["Item", GlDrawMethod$reflection()]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlDrawPrimitive", int32_type, [["POINTS", 0], ["LINES", 1], ["LINE_LOOP", 2], ["LINE_STRIP", 3], ["TRIANGLES", 4], ["TRIANGLE_STRIP", 5], ["TRIANGLE_FAN", 6]])]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", lambda_type(list_type(BuilderTypes_GlUniformProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlUniformData$reflection()))]], [["Item", lambda_type(list_type(BuilderTypes_GlUboProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlUboData$reflection()))]], [["Item", lambda_type(list_type(BuilderTypes_GlAttrProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlRootAttribute$reflection()))]], [["Item", lambda_type(list_type(BuilderTypes_GlIndicesProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlIndicesData$reflection()))]], [["Item", lambda_type(list_type(BuilderTypes_GlTextureProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlTextureData$reflection()))]], [["Item", lambda_type(class_type("Browser.Types.WebGLRenderingContext"), unit_type)]], [["Item", bool_type]], [["Item", string_type]], [["Item", float64_type]], [["Item", int32_type]], [["Item", Vec3$reflection()]], [["Item", Vec3$reflection()]], [["Item", float64_type]], [["Item", float64_type]], [["Item", Vec3$reflection()]], [["Item", float64_type]], [["Item", string_type]]]);
}

export class BuilderTypes_GlTextureProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["TextureName", "TextureTarget", "TextureIndex", "Level", "TextureWidth", "TextureHeight", "InternalFormat", "Format", "TextureDataType", "NoMipMap", "Pixels", "ByteOffset", "MagFilter", "MinFilter", "WrapS", "WrapT", "WrapR", "BaseLevel", "CompareFunc", "CompareMode", "MaxLevel", "MaxLod", "MinLod", "TextureLink"];
    }
}

export function BuilderTypes_GlTextureProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlTextureProp", [], BuilderTypes_GlTextureProp, () => [[["Item", string_type]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlTextureTarget", int32_type, [["TEXTURE_2D", 3553], ["TEXTURE_CUBE_MAP_POSITIVE_X", 34069], ["TEXTURE_CUBE_MAP_NEGATIVE_X", 34070], ["TEXTURE_CUBE_MAP_POSITIVE_Y", 34071], ["TEXTURE_CUBE_MAP_NEGATIVE_Y", 34072], ["TEXTURE_CUBE_MAP_POSITIVE_Z", 34073], ["TEXTURE_CUBE_MAP_NEGATIVE_Z", 34074]])]], [["Item", int32_type]], [["Item", int32_type]], [["Item", float64_type]], [["Item", float64_type]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlInternalColorFormat", int32_type, [["RGB", 6407], ["RGBA", 6408], ["LUMINANCE", 6409], ["LUMINANCE_ALPHA", 6410], ["ALPHA", 6406], ["R8", 33321], ["R16F", 33325], ["R32F", 33326], ["R8UI", 33330], ["RG8", 33323], ["RG16F", 33327], ["RG32F", 33328], ["RG8UI", 33336], ["RGB8", 32849], ["SRGB8", 35905], ["RGB565", 36194], ["R11F_G11F_B10F", 35898], ["RGB9_E5", 35901], ["RGB16F", 34843], ["RGB32F", 34837], ["RGB8UI", 36221], ["RGBA8", 32856], ["SRGB8_ALPHA8", 35907], ["RGB5_A1", 32855], ["RGB10_A2", 32857], ["RGBA4", 32854], ["RGBA16F", 34842], ["RGBA32F", 34836], ["RGBA8UI", 36220], ["R8_SNORM", 36756], ["RG8_SNORM", 36757], ["RGB8_SNORM", 36758], ["RGBA8_SNORM", 36759], ["RGB10_A2UI", 36975], ["R8I", 33329], ["R16I", 33331], ["R16UI", 33332], ["R32I", 33333], ["R32UI", 33334], ["RG8I", 33335], ["RG16I", 33337], ["RG16UI", 33338], ["RG32I", 33339], ["RG32UI", 33340], ["RGB16I", 36233], ["RGB16UI", 36215], ["RGB32I", 36227], ["RGB32UI", 36209], ["RGBA8I", 36238], ["RGBA16I", 36232], ["RGBA16UI", 36214], ["RGBA32I", 36226], ["RGBA32UI", 36208], ["DEPTH_COMPONENT16", 33189], ["DEPTH_COMPONENT24", 33190], ["DEPTH_COMPONENT32F", 36012], ["DEPTH24_STENCIL8", 35056], ["DEPTH32F_STENCIL8", 36013]])]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlColorFormat", int32_type, [["RGB", 6407], ["RGBA", 6408], ["LUMINANCE_ALPHA", 6410], ["LUMINANCE", 6409], ["ALPHA", 6406], ["RED", 6403], ["RED_INTEGER", 36244], ["RG", 33319], ["RG_INTEGER", 33320], ["RGB_INTEGER", 36248], ["RGBA_INTEGER", 36249], ["DEPTH_COMPONENT", 6402], ["DEPTH_STENCIL", 34041]])]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlTextureType", int32_type, [["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT_4_4_4_4", 32819], ["UNSIGNED_SHORT_5_5_5_1", 32820], ["UNSIGNED_SHORT_5_6_5", 33635], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["BYTE", 5120], ["SHORT", 5122], ["INT", 5124], ["UNSIGNED_INT_2_10_10_10_REV", 33640], ["UNSIGNED_INT_10F_11F_11F_REV", 35899], ["UNSIGNED_INT_5_9_9_9_REV", 35902], ["FLOAT_32_UNSIGNED_INT_24_8_REV", 36269]])]], [], [["Item", GlTexturePixels$reflection()]], [["Item", int32_type]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlMagFilter", int32_type, [["NEAREST", 9728], ["LINEAR", 9729]])]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlMinFilter", int32_type, [["NEAREST", 9728], ["LINEAR", 9729], ["NEAREST_MIPMAP_NEAREST", 9984], ["LINEAR_MIPMAP_NEAREST", 9985], ["NEAREST_MIPMAP_LINEAR", 9986], ["LINEAR_MIPMAP_LINEAR", 9987]])]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlWrapMode", int32_type, [["REPEAT", 10497], ["CLAMP_TO_EDGE", 33071], ["MIRRORED_REPEAT", 33648]])]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlWrapMode", int32_type, [["REPEAT", 10497], ["CLAMP_TO_EDGE", 33071], ["MIRRORED_REPEAT", 33648]])]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlWrapMode", int32_type, [["REPEAT", 10497], ["CLAMP_TO_EDGE", 33071], ["MIRRORED_REPEAT", 33648]])]], [["Item", int32_type]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlCompareFunc", int32_type, [["NEVER", 512], ["LESS", 513], ["EQUAL", 514], ["LEQUAL", 515], ["GREATER", 516], ["NOTEQUAL", 517], ["GEQUAL", 518], ["ALWAYS", 519]])]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlCompareMode", int32_type, [["NONE", 0], ["COMPARE_REF_TO_TEXTURE", 34894]])]], [["Item", int32_type]], [["Item", float64_type]], [["Item", float64_type]], [["Item", string_type]]]);
}

export class BuilderTypes_GlCamProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["CameraName", "DontClearViewport", "CameraBackground", "CameraClearColorBuffer", "CameraClearDepthBuffer", "CameraClearStencilBuffer", "CameraClearMask", "BorderWidth", "DontAutoSizeViewport", "DontUseViewSizeAspect", "DontAutoPosition", "CameraPosition", "LookAt", "ViewSize", "ViewportBounds", "Up", "Near", "Far", "Aspect", "Fov"];
    }
}

export function BuilderTypes_GlCamProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlCamProp", [], BuilderTypes_GlCamProp, () => [[["Item", string_type]], [], [["Item", Vec4$reflection()]], [], [], [], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlClearBit", int32_type, [["COLOR_BUFFER_BIT", 16384], ["DEPTH_BUFFER_BIT", 256], ["STENCIL_BUFFER_BIT", 1024]])]], [["Item", float64_type]], [], [], [], [["Item", Vec3$reflection()]], [["Item", Vec3$reflection()]], [["Item", Vec2$reflection()]], [["Item", Bounds$reflection()]], [["Item", Vec3$reflection()]], [["Item", float64_type]], [["Item", float64_type]], [["Item", float64_type]], [["Item", float64_type]]]);
}

export class BuilderTypes_GlSceneProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["SceneName", "Layers", "DefaultLayer", "SceneBackground", "SceneClearColorBuffer", "SceneClearDepthBuffer", "SceneClearStencilBuffer", "SceneClearMask", "SceneWorldBounds", "SceneBounds", "WorldScale", "DontClearSceneBackground", "Camera", "Shared", "SceneObject"];
    }
}

export function BuilderTypes_GlSceneProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlSceneProp", [], BuilderTypes_GlSceneProp, () => [[["Item", string_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", Vec4$reflection()]], [], [], [], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlClearBit", int32_type, [["COLOR_BUFFER_BIT", 16384], ["DEPTH_BUFFER_BIT", 256], ["STENCIL_BUFFER_BIT", 1024]])]], [["Item", Bounds$reflection()]], [["Item", Bounds$reflection()]], [["Item", float64_type]], [], [["Item", lambda_type(list_type(BuilderTypes_GlCamProp$reflection()), lambda_type(Data_GlSceneData$reflection(), Data_GlCameraData$reflection()))]], [["Item", lambda_type(list_type(BuilderTypes_GlObjProp$reflection()), lambda_type(Data_GlSceneData$reflection(), Data_GlObjData$reflection()))]], [["Item", lambda_type(list_type(BuilderTypes_GlObjProp$reflection()), lambda_type(Data_GlSceneData$reflection(), Data_GlObjData$reflection()))]]]);
}

export class BuilderTypes_GlCanvasProp extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["CanvasName", "CanvasSize", "CanvasWidth", "CanvasHeight", "WorldBounds", "ContextAttribute", "PixelStorageParams", "PixelStorage", "CanvasBackground", "ClearColorBuffer", "ClearDepthBuffer", "ClearStencilBuffer", "ClearMask", "DontClearCanvas", "Global", "Scene", "Attributes", "NoAlpha", "Desynchronized", "NoAntialias", "NoDepth", "FailIfMajorPerformanceCaveat", "NoPremultipliedAlpha", "PreserveDrawingBuffer", "Stencil", "PowerPreferenceDefault", "PowerPreferenceHighPerformance", "PowerPreferenceLowPower"];
    }
}

export function BuilderTypes_GlCanvasProp$reflection() {
    return union_type("Wil.Webgl.Data.BuilderTypes.GlCanvasProp", [], BuilderTypes_GlCanvasProp, () => [[["Item", string_type]], [["Item", Vec2$reflection()]], [["Item", float64_type]], [["Item", float64_type]], [["Item", Bounds$reflection()]], [["Item", GlContextAttribute$reflection()]], [["Item", list_type(GlPixelStorage$reflection())]], [["Item", GlPixelStorage$reflection()]], [["Item", Vec4$reflection()]], [], [], [], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlClearBit", int32_type, [["COLOR_BUFFER_BIT", 16384], ["DEPTH_BUFFER_BIT", 256], ["STENCIL_BUFFER_BIT", 1024]])]], [], [["Item", lambda_type(list_type(BuilderTypes_GlObjProp$reflection()), lambda_type(Data_GlSceneData$reflection(), Data_GlObjData$reflection()))]], [["Item", lambda_type(list_type(BuilderTypes_GlSceneProp$reflection()), lambda_type(Data_GlCanvasData$reflection(), Data_GlSceneData$reflection()))]], [["Item", list_type(GlContextAttribute$reflection())]], [], [], [], [], [], [], [], [], [], [], []]);
}

