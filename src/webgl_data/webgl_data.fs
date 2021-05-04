namespace Wil.Webgl.Data

open Browser.Types
open Fable.Core
open Wil.Core
open Wil.Core.Utils
open Wil.Twod
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.DataTypes
open Wil.Webgl

[<AutoOpen>]
module Data =
  // type ICapability =
  //   abstract Process: GL -> unit

  type ICapability = GL -> unit

  type GlUniformKind =
  | Single
  | Array
  | ArrayChild

  type GlAttributeKind =
  | Single
  | Interleave
  | InterleaveChild

  type GlCameraKind =
  | Ortho2D
  | Perspective

  type GlTextureKind =
  | DataTexture
  | ImageTexture

  type GlUniformData = {
    mutable Id: int
    Info: GlUniformInfo
    mutable IsDirty: bool
    Data: JS.TypedArray
    mutable Value: obj
    ParentObject: GlObjData
    ParentUbo: GlUboData option
    RootUniform: GlUniformData option
    mutable ChildUniforms: GlUniformData[]
    Link: GlUniformData option
    mutable LinkedChildren: GlUniformData list
  }
    with member this.Name = this.Info.Name

  and GlUboData = {
    mutable Id: int
    Info: GlUboInfo
    mutable IsDirty: bool
    Location: int
    mutable Uniforms: GlUniformData list
    Buffer: GlBuffer
    Data: JS.TypedArray<uint8>
    ParentObject: GlObjData
    Link: GlUboData option
    mutable LinkedChildren: GlUboData list
  }
    with member this.Name = this.Info.Name

  and GlIndicesData = {
    Name: string
    mutable IsDirty: bool
    IndicesType: GlIndicesType
    ArrayCreator: ITypedArrayFactory
    Offset: int
    Values: int []
    mutable DataCount: int
    BufferUsage: GlBufferUsage
    Buffer: GlBuffer
    ParentObject: GlObjData
    Link: GlIndicesData option
    mutable LinkedChildren: GlIndicesData list
    mutable RecalcNeeded: bool
    CalcDataCount: bool
  }

  and GlAttributeData = {
    mutable Id: int
    Kind: GlAttributeKind
    Info: GlAttributeInfo
    mutable IsDirty: bool
    BaseType: GlType
    ArrayCreator: ITypedArrayFactory
    RecordSize: int
    mutable ByteSize: int
    mutable DataLength: int
    BaseTypeInfo: GlTypeInfo
    Normalize: bool
    StartIndex: int
    IndexStride: int
    mutable Stride: int
    mutable Offset: int
    mutable Values: float []
    mutable DataCount: int
    BufferUsage: GlBufferUsage
    DeterminesVertexCount: bool
    DeterminesInstanceCount: bool
    Divisor: int
    Buffer: GlBuffer
    ChildAttributes: GlAttributeData list
    ParentObject: GlObjData
    mutable ParentAttribute: GlAttributeData option
    Link: GlAttributeData option
    mutable LinkedChildren: GlAttributeData list
    CanSingleCopy: bool
    AdjustsStride: bool
    mutable EnableNeeded: bool
    mutable RecalcNeeded: bool
    CalcDataCount: bool
    CalcStride: bool
    CalcOffset: bool
  }
    with member this.Name = this.Info.Name

  and GlRootAttribute =
    | SingleAttribute of GlAttributeData
    | InterleaveAttribute of GlAttributeData

  and GlTextureData = {
    mutable Id: int
    // Kind: GlTextureKind
    Name: string
    mutable IsDirty: bool
    Target: GlTextureTarget
    TextureId: WebGLTexture
    Index: int
    Level: int
    mutable Width: float
    mutable Height: float
    InternalFormat: GlInternalColorFormat
    Format: GlColorFormat
    DataType: GlTextureType
    mutable Pixels: GlTexturePixels
    Offset: int
    GenerateMipMap: bool
    MagFilter: GlMagFilter option
    MinFilter: GlMinFilter option
    WrapS: GlWrapMode option
    WrapT: GlWrapMode option
    WrapR: GlWrapMode option
    BaseLevel: int option
    CompareFunc: GlCompareFunc option
    CompareMode: GlCompareMode option
    MaxLevel: int option
    MaxLod: float option
    MinLod: float option
    ParentObject: GlObjData
    Link: GlTextureData option
    mutable LinkedChildren: GlTextureData list
  }

  and GlObjData = {
    mutable Id: int
    Name: string
    ProgramInfo: GlProgramInfo
    mutable IsDirty: bool
    Scene: GlSceneData
    mutable DrawMethod: GlDrawMethod
    DrawPrimitive: GlDrawPrimitive
    mutable VertexCount: int
    VertexOffset: int
    VertexCountOffset: int
    mutable InstanceCount: int
    InstanceOffset: int
    InstanceCountOffset: int
    IndicesOffset: int
    Capabilities: ICapability list
    mutable Uniforms: GlUniformData list
    mutable Ubos: GlUboData list
    mutable Attributes: GlRootAttribute list
    mutable Indices: GlIndicesData option
    mutable Textures: GlTextureData list
    mutable VertexCountAttributes: GlAttributeData list
    mutable InstanceCountAttributes: GlAttributeData list
    Vao: WebGLVAO
    ProcessLinked: bool
    Layer: int
    ParallaxCamera: GlCameraData option
    ParallaxDistance: float
    ParallaxOffset: Vec3
    ParallaxLastPosition: Vec3
    Angle: Vec3
    Position: Vec3
    mutable Scale: float
    ModelMatrix: Mat4
    ParallaxMatrix: Mat4 option
    Parent: GlObjData option
    Link: GlObjData option
    mutable LinkedChildren: GlObjData list
    mutable IsModelDirty: bool
    mutable IsParallaxDirty: bool
    mutable RecalcNeeded: bool
    CalcDrawMethod: bool
    CalcVertexCount: bool
    CalcInstanceCount: bool
  }

  and GlCameraData = {
    mutable Id: int
    Kind: GlCameraKind
    Name: string
    mutable IsDirty: bool
    mutable Scene: GlSceneData
    ClearViewport: bool
    CameraBackground: Vec4
    ClearMask: GlClearBit
    BorderWidth: float
    AutoSizeViewport: bool
    UseViewSizeAspect: bool
    AutoPosition: bool
    Position: Vec3
    LookAt: Vec3
    ViewSize: Vec2
    ViewportBounds: Bounds
    ScissorBounds: Bounds
    Up: Vec3
    Near: float
    Far: float
    Aspect: float
    Fov: float
    ProjectionMatrix: Mat4
    ViewMatrix: Mat4
  }

  and GlLayerData = {
    Index: int
    mutable Objects: GlObjData list
  }

  and GlSceneData = {
    mutable Id: int
    Name: string
    mutable IsDirty: bool
    Canvas: GlCanvasData
    SceneBackground: Vec4
    ClearMask: GlClearBit
    WorldBounds: Bounds
    SceneBounds: Bounds
    WorldScale: float
    LineWidthScale: float
    ClearSceneBackground: bool
    Layers: GlLayerData []
    DefaultLayer: int
    mutable Shared: GlObjData option
    mutable Cameras: GlCameraData list
  }

  and GlCanvasData = {
    Name: string
    mutable IsDirty: bool
    Context: GL
    Params: GlCanvasParams
    CanvasBackground: Vec4
    ClearMask: GlClearBit
    ClearCanvas: bool
    Size: Vec2
    WorldBounds: Bounds
    Mouse: GlMouse
    mutable Global: GlObjData option
    mutable Scenes: GlSceneData[]
  }

[<AutoOpen>]
module BuilderTypes =
  type GlUniformFactory = GlUniformProp list -> GlObjData -> GlUniformData
  and GlUboUniformFactory = GlUniformProp list -> GlUboData -> GlObjData -> GlUniformData
  and GlRootAttributeFactory = GlAttrProp list -> GlObjData -> GlRootAttribute
  and GlChildAttributeFactory = GlAttrProp list -> GlAttributeData -> GlObjData -> GlAttributeData
  and GlIndicesFactory = GlIndicesProp list -> GlObjData -> GlIndicesData
  and GlUboFactory = GlUboProp list -> GlObjData -> GlUboData
  and GlTextureFactory = GlTextureProp list -> GlObjData -> GlTextureData
  and GlObjectFactory = GlObjProp list -> GlSceneData -> GlObjData
  and GlCameraFactory = GlCamProp list -> GlSceneData -> GlCameraData
  and GlSceneFactory = GlSceneProp list -> GlCanvasData -> GlSceneData

  and GlUniformProp =
  | Value of obj
  | UniformLink of string

  and GlUboProp =
  | BufferIndex of int
  | UboUniform of GlUboUniformFactory
  | UboLink of string

  and GlAttrProp =
  | BaseType of GlType
  | Normalize
  | DontAdjustStride
  | Stride of int
  | Offset of int                // Byte offset in the buffer where this attribute starts.
  | Values of float []
  | DataCount of int             // Number of data elements.  e.g. vertices for a vertex buffer.
  | BufferUsage of GlBufferUsage
  | DeterminesVertexCount        // Calculate vertexCount based on this dataCount.
  | DeterminesInstanceCount      // Calculate instanceCount based on this dataCount.
  | Divisor of int               // Divisor used for instanced drawing.
  | ChildAttribute of GlChildAttributeFactory
  | AttributeLink of string

  and GlIndicesProp =
  | IndexType of GlIndicesType
  | IndexOffset of int
  | IndexValues of int[]
  | IndexBufferUsage of GlBufferUsage
  | IndicesLink of string

  and GlObjProp =
  | ObjectName of string
  | DrawMethod of GlDrawMethod
  | DrawPrimitive of GlDrawPrimitive
  | VertexCount of int
  | VertexOffset of int
  | VertexCountOffset of int    // Offset vertexCount by this much.
  | InstanceCount of int        // Passed to drawArraysInstanced.
  | InstanceOffset of int
  | InstanceCountOffset of int  // Offset instanceCount by this much.
  | IndicesOffset of int       // Offset into the Indices array.
  | Uniform of GlUniformFactory
  | Ubo of GlUboFactory
  | Attribute of GlRootAttributeFactory
  | Indices of GlIndicesFactory
  | Texture of GlTextureFactory
  | Capability of ICapability
  | ProcessLinked of bool
  | ParallaxCamera of string
  | ParallaxDistance of float
  | Layer of int
  | Angle of Vec3
  | AngleDegrees of Vec3
  | AngleZ of float<rad>
  | AngleDegreesZ of float<deg>
  | Position of Vec3
  | Scale of float
  | ObjectLink of string

  and GlTextureProp =
  | TextureName of string
  | TextureTarget of GlTextureTarget
  | TextureIndex of int
  | Level of int
  | TextureWidth of float
  | TextureHeight of float
  | InternalFormat of GlInternalColorFormat
  | Format of GlColorFormat
  | TextureDataType of GlTextureType
  | NoMipMap
  | Pixels of GlTexturePixels
  | ByteOffset of int
  | MagFilter of GlMagFilter
  | MinFilter of GlMinFilter
  | WrapS of GlWrapMode
  | WrapT of GlWrapMode
  | WrapR of GlWrapMode
  | BaseLevel of int
  | CompareFunc of GlCompareFunc
  | CompareMode of GlCompareMode
  | MaxLevel of int
  | MaxLod of float
  | MinLod of float
  | TextureLink of string

  and GlCamProp =
  | CameraName of string
  | DontClearViewport
  | CameraBackground of Vec4
  | CameraClearColorBuffer
  | CameraClearDepthBuffer
  | CameraClearStencilBuffer
  | CameraClearMask of GlClearBit
  | BorderWidth of float
  | DontAutoSizeViewport
  | DontUseViewSizeAspect
  | DontAutoPosition
  | CameraPosition of Vec3
  | LookAt of Vec3
  | ViewSize of Vec2
  | ViewportBounds of Bounds
  | Up of Vec3
  | Near of float
  | Far of float
  | Aspect of float
  | Fov of float

  and GlSceneProp =
  | SceneName of string
  | Layers of int
  | DefaultLayer of int
  | SceneBackground of Vec4
  | SceneClearColorBuffer
  | SceneClearDepthBuffer
  | SceneClearStencilBuffer
  | SceneClearMask of GlClearBit
  | SceneWorldBounds of Bounds
  | SceneBounds of Bounds
  | WorldScale of float
  | DontClearSceneBackground
  | Camera of GlCameraFactory
  | Shared of GlObjectFactory
  | SceneObject of GlObjectFactory

  and GlCanvasProp =
  | CanvasName of string
  | CanvasSize of Vec2
  | CanvasWidth of float
  | CanvasHeight of float
  | WorldBounds of Bounds
  | ContextAttribute of GlContextAttribute
  | PixelStorageParams of GlPixelStorage list
  | PixelStorage of GlPixelStorage
  | CanvasBackground of Vec4
  | ClearColorBuffer
  | ClearDepthBuffer
  | ClearStencilBuffer
  | ClearMask of GlClearBit
  | DontClearCanvas
  | Global of GlObjectFactory
  | Scene of GlSceneFactory
  | Attributes of GlContextAttribute list
  | NoAlpha
  | Desynchronized
  | NoAntialias
  | NoDepth
  | FailIfMajorPerformanceCaveat
  | NoPremultipliedAlpha
  | PreserveDrawingBuffer
  | Stencil
  | PowerPreferenceDefault
  | PowerPreferenceHighPerformance
  | PowerPreferenceLowPower
