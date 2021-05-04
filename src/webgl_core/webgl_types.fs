namespace Wil.Webgl.Types

[<AutoOpen>]
module WebglTypes =
  open Browser.Types
  open Wil.Core.Utils
  open Wil.Js

  type GL = WebGLRenderingContext

  type GlType =
  | Unknown = 0
  | BYTE = 5120
  | SHORT = 5122
  | BOOL = 35670
  | BOOL_VEC2 = 35671
  | BOOL_VEC3 = 35672
  | BOOL_VEC4 = 35673
  | FLOAT = 5126
  | HALF_FLOAT = 5131
  | FLOAT_MAT2x3 = 35685
  | FLOAT_MAT2 = 35674
  | FLOAT_MAT2x4 = 35686
  | FLOAT_MAT3 = 35675
  | FLOAT_MAT3x2 = 35687
  | FLOAT_MAT3x4 = 35688
  | FLOAT_MAT4 = 35676
  | FLOAT_MAT4x2 = 35689
  | FLOAT_MAT4x3 = 35690
  | FLOAT_VEC2 = 35664
  | FLOAT_VEC3 = 35665
  | FLOAT_VEC4 = 35666
  | INT = 5124
  | INT_VEC2 = 35667
  | INT_VEC3 = 35668
  | INT_VEC4 = 35669
  | INT_SAMPLER_2D = 36298
  | INT_SAMPLER_2D_ARRAY = 36303
  | INT_SAMPLER_3D = 36299
  | INT_SAMPLER_CUBE = 36300
  | UNSIGNED_BYTE = 5121
  | UNSIGNED_SHORT = 5123
  | UNSIGNED_INT = 5125
  | UNSIGNED_INT_24_8 = 34042
  | UNSIGNED_INT_SAMPLER_2D = 36306
  | UNSIGNED_INT_SAMPLER_2D_ARRAY = 36311
  | UNSIGNED_INT_SAMPLER_3D = 36307
  | UNSIGNED_INT_SAMPLER_CUBE = 36308
  | UNSIGNED_INT_VEC2 = 36294
  | UNSIGNED_INT_VEC3 = 36295
  | UNSIGNED_INT_VEC4 = 36296
  | SAMPLER_2D = 35678
  | SAMPLER_2D_ARRAY = 36289
  | SAMPLER_2D_ARRAY_SHADOW = 36292
  | SAMPLER_2D_SHADOW = 35682
  | SAMPLER_3D = 35679
  | SAMPLER_CUBE = 35680
  | SAMPLER_CUBE_SHADOW = 36293

  let GlTypeT = typeof<GlType>

  type GlIndicesType =
  | UNSIGNED_BYTE = 5121
  | UNSIGNED_SHORT = 5123
  | UNSIGNED_INT = 5125

  let GlIndicesTypeT = typeof<GlIndicesType>

  type GlTypeInfo = {
    Type: GlType
    BaseType: GlType
    ElementCount: int
    ByteSize: int
    BaseAlign: int
    IsMatrix: bool
    MatrixColCount: int
    MatrixRowCount: int
    TypeArrayCreator: ITypedArrayFactory
  }

  let glTypeInfo t bt ec bs ba im mcc mrc tac =
    {
      Type = t
      BaseType = bt
      ElementCount = ec
      ByteSize = bs
      BaseAlign = ba
      IsMatrix = im
      MatrixColCount = mcc
      MatrixRowCount = mrc
      TypeArrayCreator = tac
    }
    
  let BaseUnit = 4
  let FloatByteSize = 4
  let Vec4BaseAlign = 4 * BaseUnit

  let mutable glTypeInfos = Map<_, _>([])

  let addGlTypeInfo (ti: GlTypeInfo) = glTypeInfos <- glTypeInfos.Add(ti.Type, ti)
  let getGlTypeInfo t =
    match Map.tryFind t glTypeInfos with
    | Some info -> info
    | None -> raise (exn $"Could not get type info for {enumName GlTypeT t}")

  addGlTypeInfo <| glTypeInfo GlType.BYTE GlType.BYTE 1 1 (1 * BaseUnit) false 0 0 int8ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.UNSIGNED_BYTE GlType.UNSIGNED_BYTE 1 1 (1 * BaseUnit) false 0 0 uint8ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.SHORT GlType.SHORT 1 2 ((1 * BaseUnit)) false 0 0 int16ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.UNSIGNED_SHORT GlType.UNSIGNED_SHORT 1 2 (1 * BaseUnit) false 0 0 uint16ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.INT GlType.INT 1 FloatByteSize (1 * BaseUnit) false 0 0 int32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.FLOAT GlType.FLOAT 1 FloatByteSize (1 * BaseUnit) false 0 0 float32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.FLOAT_MAT2 GlType.FLOAT (2 * 2) (2 * 2 * FloatByteSize) Vec4BaseAlign true 2 2 float32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.FLOAT_MAT2x3 GlType.FLOAT (2 * 3) (2 * 3 * FloatByteSize) Vec4BaseAlign true 2 3 float32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.FLOAT_MAT3 GlType.FLOAT (3 * 3) (3 * 3 * FloatByteSize) Vec4BaseAlign true 3 3 float32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.FLOAT_MAT4 GlType.FLOAT (4 * 4) (4 * 4 * FloatByteSize) Vec4BaseAlign true 4 4 float32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.FLOAT_VEC2 GlType.FLOAT 2 (2 * FloatByteSize) (2 * BaseUnit) false 0 0 float32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.FLOAT_VEC3 GlType.FLOAT 3 (3 * FloatByteSize) Vec4BaseAlign false 0 0 float32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.FLOAT_VEC4 GlType.FLOAT 4 (4 * FloatByteSize) Vec4BaseAlign false 0 0 float32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.INT_VEC2 GlType.INT 2 (2 * FloatByteSize) (2 * BaseUnit) false 0 0 int32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.INT_VEC3 GlType.INT 3 (3 * FloatByteSize) Vec4BaseAlign false 0 0 int32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.INT_VEC4 GlType.INT 4 (4 * FloatByteSize) Vec4BaseAlign false 0 0 int32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.BOOL GlType.UNSIGNED_INT 1 FloatByteSize (1 * BaseUnit) false 0 0 uint32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.UNSIGNED_INT GlType.UNSIGNED_INT 1 FloatByteSize (1 * BaseUnit) false 0 0 uint32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.SAMPLER_2D GlType.INT 1 FloatByteSize (1 * BaseUnit) false 0 0 int32ArrayFactory
  addGlTypeInfo <| glTypeInfo GlType.SAMPLER_3D GlType.INT 1 FloatByteSize (1 * BaseUnit) false 0 0 int32ArrayFactory
  // addGlTypeInfo <| glTypeInfo GlType.HALFFLOAT GlType.FLOAT 1 2 (1 * baseUnit) false 0 0 float32ArrayFactory); // TODO: Incorrect baseType and typed array.

  type GlUniformParam =
  | UNIFORM_TYPE = 35383
  | UNIFORM_SIZE = 35384
  | UNIFORM_BLOCK_INDEX = 35386
  | UNIFORM_OFFSET = 35387
  | UNIFORM_ARRAY_STRIDE = 35388
  | UNIFORM_MATRIX_STRIDE = 35389
  | UNIFORM_IS_ROW_MAJOR = 35390

  let GlUniformParamT = typeof<GlUniformParam>

  type GlBlockParam =
  | UNIFORM_BLOCK_BINDING = 35391
  | UNIFORM_BLOCK_DATA_SIZE = 35392
  | UNIFORM_BLOCK_ACTIVE_UNIFORMS = 35394
  | UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 35395
  | UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 35396
  | UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 35398

  let GlBlockParamT = typeof<GlBlockParam>

  type GlIndexedParam =
  | TRANSFORM_FEEDBACK_BUFFER_BINDING = 35983
  | TRANSFORM_FEEDBACK_BUFFER_SIZE = 35973
  | TRANSFORM_FEEDBACK_BUFFER_START = 35972
  | UNIFORM_BUFFER_BINDING = 35368
  | UNIFORM_BUFFER_SIZE = 35370
  | UNIFORM_BUFFER_START = 35369

  let GlIndexedParamT = typeof<GlIndexedParam>

  type GlProgParamName =
  | DELETE_STATUS = 35712
  | LINK_STATUS = 35714
  | VALIDATE_STATUS = 35715
  | ATTACHED_SHADERS = 35717
  | ACTIVE_ATTRIBUTES = 35721
  | ACTIVE_UNIFORMS = 35718
  | TRANSFORM_FEEDBACK_BUFFER_MODE = 35967
  | TRANSFORM_FEEDBACK_VARYINGS = 35971
  | ACTIVE_UNIFORM_BLOCKS = 35382

  let GlProgParamNameT = typeof<GlProgParamName>

  type GlBufferTarget =
  | ARRAY_BUFFER = 34962
  | ELEMENT_ARRAY_BUFFER = 34963
  | UNIFORM_BUFFER = 35345
  | TRANSFORM_FEEDBACK_BUFFER = 35982

  let GlBufferTargetT = typeof<GlBufferTarget>

  type GlTextureTarget =
  | TEXTURE_2D = 3553
  | TEXTURE_CUBE_MAP_POSITIVE_X = 34069
  | TEXTURE_CUBE_MAP_NEGATIVE_X = 34070
  | TEXTURE_CUBE_MAP_POSITIVE_Y = 34071
  | TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072
  | TEXTURE_CUBE_MAP_POSITIVE_Z = 34073
  | TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074

  let GlTextureTargetT = typeof<GlTextureTarget>

  type GlBufferUsage =
  | STREAM_DRAW = 35040
  | STATIC_DRAW = 35044
  | DYNAMIC_DRAW = 35048

  let GlBufferUsageT = typeof<GlBufferUsage>

  type GlDrawPrimitive =
  | POINTS = 0
  | LINES = 1
  | LINE_LOOP = 2
  | LINE_STRIP = 3
  | TRIANGLES = 4
  | TRIANGLE_STRIP = 5
  | TRIANGLE_FAN = 6

  let GlDrawPrimitiveT = typeof<GlDrawPrimitive>

  type GlClearBit =
  | COLOR_BUFFER_BIT = 16384
  | DEPTH_BUFFER_BIT = 256
  | STENCIL_BUFFER_BIT = 1024

  let GlClearBitT = typeof<GlClearBit>

  type GlDrawMethod =
  | DRAW_ARRAYS
  | DRAW_ELEMENTS
  | DRAW_ARRAYS_INSTANCED
  | DRAW_ELEMENTS_INSTANCED
  | Unknown

  type GlCullMode =
  | FRONT = 1028
  | BACK = 1029
  | FRONT_AND_BACK = 1032

  let GlCullModeT = typeof<GlCullMode>

  type GlCapability =
  | BLEND = 3042
  | CULL_FACE = 2884
  | DEPTH_TEST = 2929
  | DITHER = 3024
  | POLYGON_OFFSET_FILL = 32823
  | SAMPLE_ALPHA_TO_COVERAGE = 32926
  | SAMPLE_COVERAGE = 32928
  | SCISSOR_TEST = 3089
  | STENCIL_TEST = 2960
  | RASTERIZER_DISCARD = 35977

  let GlCapabilityT = typeof<GlCapability>

  type GlBlendFactor =
  | ZERO = 0
  | ONE = 1
  | SRC_COLOR = 768
  | ONE_MINUS_SRC_COLOR = 769
  | SRC_ALPHA = 770
  | ONE_MINUS_SRC_ALPHA = 771
  | DST_ALPHA = 772
  | ONE_MINUS_DST_ALPHA = 773
  | DST_COLOR = 774
  | ONE_MINUS_DST_COLOR = 775
  | SRC_ALPHA_SATURATE = 776
  | CONSTANT_COLOR = 32769
  | ONE_MINUS_CONSTANT_COLOR = 32770
  | CONSTANT_ALPHA = 32771
  | ONE_MINUS_CONSTANT_ALPHA = 32772

  let GlBlendFactorT = typeof<GlBlendFactor>

  type GlBlendMode =
  | FUNC_ADD = 32774
  | FUNC_SUBTRACT = 32778
  | FUNC_REVERSE_SUBTRACT = 32779
  | MIN = 32775
  | MAX = 32776

  let GlBlendModeT = typeof<GlBlendMode>

  type GlTextureUnit =
  | TEXTURE0 = 33984
  | TEXTURE1 = 33985
  | TEXTURE2 = 33986
  | TEXTURE3 = 33987
  | TEXTURE4 = 33988
  | TEXTURE5 = 33989
  | TEXTURE6 = 33990
  | TEXTURE7 = 33991
  | TEXTURE8 = 33992
  | TEXTURE9 = 33993
  | TEXTURE10 = 33994
  | TEXTURE11 = 33995
  | TEXTURE12 = 33996
  | TEXTURE13 = 33997
  | TEXTURE14 = 33998
  | TEXTURE15 = 33999
  | TEXTURE16 = 34000
  | TEXTURE17 = 34001
  | TEXTURE18 = 34002
  | TEXTURE19 = 34003
  | TEXTURE20 = 34004
  | TEXTURE21 = 34005
  | TEXTURE22 = 34006
  | TEXTURE23 = 34007
  | TEXTURE24 = 34008
  | TEXTURE25 = 34009
  | TEXTURE26 = 34010
  | TEXTURE27 = 34011
  | TEXTURE28 = 34012
  | TEXTURE29 = 34013
  | TEXTURE30 = 34014
  | TEXTURE31 = 34015

  let GlTextureUnitT = typeof<GlTextureUnit>

  type GlInternalColorFormat =
  // Khronos WebGL2 spec page: https://www.khronos.org/registry/webgl/specs/latest/2.0/
  | RGB = 6407
  | RGBA = 6408
  | LUMINANCE = 6409
  | LUMINANCE_ALPHA = 6410
  | ALPHA = 6406
  | R8 = 33321
  | R16F = 33325
  | R32F = 33326
  | R8UI = 33330
  | RG8 = 33323
  | RG16F = 33327
  | RG32F = 33328
  | RG8UI = 33336
  | RGB8 = 32849
  | SRGB8 = 35905
  | RGB565 = 36194
  | R11F_G11F_B10F = 35898
  | RGB9_E5 = 35901
  | RGB16F = 34843
  | RGB32F = 34837
  | RGB8UI = 36221
  | RGBA8 = 32856
  | SRGB8_ALPHA8 = 35907
  | RGB5_A1 = 32855
  | RGB10_A2 = 32857
  | RGBA4 = 32854
  | RGBA16F = 34842
  | RGBA32F = 34836
  | RGBA8UI = 36220

   // MDN texImage2D page: https://developer.mozilla.org/en-us/docs/Web/API/WebGLRenderingContext/texImage2D
  | R8_SNORM = 36756
  | RG8_SNORM = 36757
  | RGB8_SNORM = 36758
  | RGBA8_SNORM = 36759
  | RGB10_A2UI = 36975
  | R8I = 33329
  | R16I = 33331
  | R16UI = 33332
  | R32I = 33333
  | R32UI = 33334
  | RG8I = 33335
  | RG16I = 33337
  | RG16UI = 33338
  | RG32I = 33339
  | RG32UI = 33340
  | RGB16I = 36233
  | RGB16UI = 36215
  | RGB32I = 36227
  | RGB32UI = 36209
  | RGBA8I = 36238
  | RGBA16I = 36232
  | RGBA16UI = 36214
  | RGBA32I = 36226
  | RGBA32UI = 36208

  // Webgl2Fundamentals Data Textures page: https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
  | DEPTH_COMPONENT16 = 33189
  | DEPTH_COMPONENT24 = 33190
  | DEPTH_COMPONENT32F = 36012
  | DEPTH24_STENCIL8 = 35056
  | DEPTH32F_STENCIL8 = 36013

  let GlInternalColorFormatT = typeof<GlInternalColorFormat>

  type GlColorFormat =
  | RGB = 6407
  | RGBA = 6408
  | LUMINANCE_ALPHA = 6410
  | LUMINANCE = 6409
  | ALPHA = 6406
  | RED = 6403
  | RED_INTEGER = 36244
  | RG = 33319
  | RG_INTEGER = 33320
  | RGB_INTEGER = 36248
  | RGBA_INTEGER = 36249

  // WEBGL_depth_texture extension
  | DEPTH_COMPONENT = 6402
  | DEPTH_STENCIL = 34041

  // | R8 = 33321
  // | R8_SNORM = 36756
  // | RG8 = 33323
  // | RG8_SNORM = 36757
  // | RGB8 = 32849
  // | RGB8_SNORM = 36758
  // | RGB565 = 36194
  // | RGBA4 = 32854
  // | RGB5_A1 = 32855
  // | RGBA8 = 32856
  // | RGBA8_SNORM = 36759
  // | RGB10_A2 = 32857
  // | RGB10_A2UI = 36975
  // | SRGB8 = 35905
  // | SRGB8_ALPHA8 = 35907
  // | R16F = 33325
  // | RG16F = 33327
  // | RGB16F = 34843
  // | RGBA16F = 34842
  // | R32F = 33326
  // | RG32F = 33328
  // | RGB32F = 34837
  // | RGBA32F = 34836
  // | R11F_G11F_B10F = 35898
  // | RGB9_E5 = 35901
  // | R8I = 33329
  // | R8UI = 33330
  // | R16I = 33331
  // | R16UI = 33332
  // | R32I = 33333
  // | R32UI = 33334
  // | RG8I = 33335
  // | RG8UI = 33336
  // | RG16I = 33337
  // | RG16UI = 33338
  // | RG32I = 33339
  // | RG32UI = 33340
  // | RGB8UI = 36221
  // | RGB16I = 36233
  // | RGB16UI = 36215
  // | RGB32I = 36227
  // | RGB32UI = 36209
  // | RGBA8I = 36238
  // | RGBA8UI = 36220
  // | RGBA16I = 36232
  // | RGBA16UI = 36214
  // | RGBA32I = 36226
  // | RGBA32UI = 36208

  let GlColorFormatT = typeof<GlColorFormat>

  type GlTextureType =
  | UNSIGNED_BYTE = 5121
  | UNSIGNED_SHORT_4_4_4_4 = 32819
  | UNSIGNED_SHORT_5_5_5_1 = 32820
  | UNSIGNED_SHORT_5_6_5 = 33635
  | UNSIGNED_SHORT = 5123
  | UNSIGNED_INT = 5125
  | UNSIGNED_INT_24_8 = 34042
  | FLOAT = 5126
  | HALF_FLOAT = 5131
  | BYTE = 5120
  | SHORT = 5122
  | INT = 5124
  | UNSIGNED_INT_2_10_10_10_REV = 33640
  | UNSIGNED_INT_10F_11F_11F_REV = 35899
  | UNSIGNED_INT_5_9_9_9_REV = 35902
  | FLOAT_32_UNSIGNED_INT_24_8_REV = 36269

  let GlTextureTypeT = typeof<GlTextureType>

  type GlTextureParam =
  | TEXTURE_MAG_FILTER = 10240
  | TEXTURE_MIN_FILTER = 10241
  | TEXTURE_WRAP_S = 10242
  | TEXTURE_WRAP_T = 10243
  | TEXTURE_WRAP_R = 32882
  | TEXTURE_MIN_LOD = 33082
  | TEXTURE_MAX_LOD = 33083
  | TEXTURE_BASE_LEVEL = 33084
  | TEXTURE_MAX_LEVEL = 33085
  | TEXTURE_COMPARE_MODE = 34892
  | TEXTURE_COMPARE_FUNC = 34893

  let GlTextureParamT = typeof<GlTextureParam>

  type GlMagFilter =
  | NEAREST = 9728
  | LINEAR = 9729

  let GlMagFilterT = typeof<GlMagFilter>

  type GlMinFilter =
  | NEAREST = 9728
  | LINEAR = 9729
  | NEAREST_MIPMAP_NEAREST = 9984
  | LINEAR_MIPMAP_NEAREST = 9985
  | NEAREST_MIPMAP_LINEAR = 9986
  | LINEAR_MIPMAP_LINEAR = 9987

  let GlMinFilterT = typeof<GlMinFilter>

  type GlWrapMode =
  | REPEAT = 10497
  | CLAMP_TO_EDGE = 33071
  | MIRRORED_REPEAT = 33648

  let GlWrapModeT = typeof<GlWrapMode>

  type GlCompareFunc =
  | NEVER = 512
  | LESS = 513
  | EQUAL = 514
  | LEQUAL = 515
  | GREATER = 516
  | NOTEQUAL = 517
  | GEQUAL = 518
  | ALWAYS = 519

  let GlCompareFuncT = typeof<GlCompareFunc>

  type GlCompareMode =
  | NONE = 0
  | COMPARE_REF_TO_TEXTURE = 34894

  let GlCompareModeT = typeof<GlCompareMode>

  type GlPixelStoreParam =
  | PACK_ALIGNMENT = 3333
  | UNPACK_ALIGNMENT = 3317
  | UNPACK_FLIP_Y_WEBGL = 37440
  | UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441
  | UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443
  | PACK_ROW_LENGTH = 3330
  | PACK_SKIP_PIXELS = 3332
  | PACK_SKIP_ROWS = 3331
  | UNPACK_ROW_LENGTH = 3314
  | UNPACK_IMAGE_HEIGHT = 32878
  | UNPACK_SKIP_PIXELS = 3316
  | UNPACK_SKIP_ROWS = 3315
  | UNPACK_SKIP_IMAGES = 32877

  let GlPixelStoreParamT = typeof<GlPixelStoreParam>

  type GlPixelAlign =
  | ONE = 1
  | TWO = 2
  | FOUR = 4
  | EIGHT = 8

  let GlPixelAlignT = typeof<GlPixelAlign>

  type GlPixelConversion =
  | NONE = 0
  | BROWSER_DEFAULT_WEBGL = 37444

  let GlPixelConversionT = typeof<GlPixelConversion>

  let getViewWriter<'a> dataType =
    match dataType with
    | GlType.FLOAT -> writeFloat32View
    | GlType.BYTE -> writeInt8View
    | GlType.UNSIGNED_BYTE -> writeUint8View
    | GlType.SHORT -> writeInt16View
    | GlType.UNSIGNED_SHORT -> writeUint16View
    | GlType.HALF_FLOAT -> writeInt16View
    | GlType.INT -> writeInt32View
    | GlType.BOOL -> writeInt32View
    | GlType.FLOAT_MAT2 -> writeFloat32View
    | GlType.FLOAT_MAT3 -> writeFloat32View
    | GlType.FLOAT_MAT4 -> writeFloat32View
    | GlType.FLOAT_VEC2 -> writeFloat32View
    | GlType.FLOAT_VEC3 -> writeFloat32View
    | GlType.FLOAT_VEC4 -> writeFloat32View
    | _ -> raise (System.Exception("No view writer for type: " + dataType.ToString()))

