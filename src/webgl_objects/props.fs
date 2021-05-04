namespace Wil.Webgl.Props

open Browser.Types
open Browser.Dom
open Wil.Core
open Wil.Twod
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.DataTypes
open Wil.Webgl.Data
open Wil.Webgl

[<AutoOpen>]
module Props =
  let inline logCreation name f =
    Debug.logIndent $"Create {name}"
    let res = f()
    Debug.popIndent()
    res

  let glcanvas canvasId props =
    logCreation "glcanvas" <| fun () -> GlCanvas.create canvasId props

  let glscene props =
    fun overrides (canvas: GlCanvasData) ->
      logCreation "scene" <| fun () -> GlScene.create canvas (props @ overrides)

  let globject vertex fragment props =
    fun overrides (scene: GlSceneData) ->
      logCreation "object" <| fun () -> GlObj.create vertex fragment scene.Shared scene (props @ overrides)

  let glubo name props =
    fun overrides parentObject ->
      logCreation $"UBO {name}" <| fun () -> GlUbo.create name (props @ overrides) parentObject

  let gltexture props =
    fun overrides parentObject ->
      logCreation $"texture" <| fun () -> GlTexture.create (props @ overrides) parentObject

[<AutoOpen>]
module CanvasProps =
  let canvasglobal vertex fragment props =
    let result overrides (scene: GlSceneData) =
      logCreation "global"
      <| fun () -> GlObj.create vertex fragment None scene (ProcessLinked false :: (props @ overrides))
    Global result

  let scene props =
    Scene <| glscene props

  let globalWithResolutionTime2d = canvasglobal "globalVertex2d" "emptyFragment" [ ]

  let canvasName name = CanvasName name
  let canvasSize x = CanvasSize x
  let canvasWidth x = CanvasWidth x
  let canvasHeight x = CanvasHeight x
  let worldBounds x = WorldBounds x
  let pixelStorageParams x = PixelStorageParams x
  let pixelStorage x = PixelStorage x
  let canvasBackground x = CanvasBackground x
  let clearColorBuffer = ClearColorBuffer
  let clearDepthBuffer = ClearDepthBuffer
  let clearStencilBuffer = ClearStencilBuffer
  let clearMask x = ClearMask x
  let dontClearCanvas = DontClearCanvas
  let attributes x = Attributes x
  let noAlpha = NoAlpha
  let desynchronized = Desynchronized
  let noAntialias = NoAntialias
  let noDepth = NoDepth
  let failIfMajorPerformanceCaveat = FailIfMajorPerformanceCaveat
  let noPremultipliedAlpha = NoPremultipliedAlpha
  let preserveDrawingBuffer = PreserveDrawingBuffer
  let stencil = Stencil
  let powerPreferenceDefault = PowerPreferenceDefault
  let powerPreferenceHighPerformance = PowerPreferenceHighPerformance
  let powerPreferenceLowPower = PowerPreferenceLowPower

[<AutoOpen>]
module AttributesProps =
  let alpha x = Alpha x
  let desynchronized x = GlContextAttribute.Desynchronized x
  let antialias x = Antialias x
  let depth x = Depth x
  let failIfMajorPerformanceCaveat x = GlContextAttribute.FailIfMajorPerformanceCaveat x
  let powerPreference x = PowerPreference x
  let premultipliedAlpha x = PremultipliedAlpha x
  let preserveDrawingBuffer x = GlContextAttribute.PreserveDrawingBuffer x
  let stencil x = GlContextAttribute.Stencil x

[<AutoOpen>]
module PixelStorageParamsProps =
  let pack_alignment x = PACK_ALIGNMENT x
  let unpack_alignment x = UNPACK_ALIGNMENT x
  let unpack_flip_y_webgl = UNPACK_FLIP_Y_WEBGL
  let unpack_premultiply_alpha_webgl = UNPACK_PREMULTIPLY_ALPHA_WEBGL
  let unpack_colorspace_conversion_webgl x = UNPACK_COLORSPACE_CONVERSION_WEBGL x
  let pack_row_length x = PACK_ROW_LENGTH x
  let pack_skip_pixels x = PACK_SKIP_PIXELS x
  let pack_skip_rows x = PACK_SKIP_ROWS x
  let unpack_row_length x = UNPACK_ROW_LENGTH x
  let unpack_image_height x = UNPACK_IMAGE_HEIGHT x
  let unpack_skip_pixels x = UNPACK_SKIP_PIXELS x
  let unpack_skip_rows x = UNPACK_SKIP_ROWS x
  let unpack_skip_images x = UNPACK_SKIP_IMAGES x

[<AutoOpen>]
module SceneProps =
  let orthoCam2d props =
    let result overrides (scene: GlSceneData) =
      logCreation "orthoCam2d" <| fun () -> GlOrtho2D.create (props @ overrides) scene
    Camera result

  let shared vertex fragment props =
    let result overrides (scene: GlSceneData) =
      let parent = scene.Canvas.Global
      logCreation "shared"
      <| fun () -> GlObj.create vertex fragment parent scene (ProcessLinked false :: (props @ overrides))
    Shared result

  let sharedObjectWithCamera2d = shared "sharedCameraVertex2d" "emptyFragment" [ ]

  let object vertex fragment props =
    SceneObject <| globject vertex fragment props

  let sceneName x = SceneName x
  let layers x = Layers x
  let defaultLayer x = DefaultLayer x
  let sceneBackground x = SceneBackground x
  let sceneClearColorBuffer = SceneClearColorBuffer
  let sceneClearDepthBuffer = SceneClearDepthBuffer
  let sceneClearStencilBuffer = SceneClearStencilBuffer
  let sceneClearMask x = SceneClearMask x
  let sceneWorldBounds x = SceneWorldBounds x
  let sceneBounds x = SceneBounds x
  let worldScale x = WorldScale x
  let dontClearSceneBackground = DontClearSceneBackground
  let camera x = Camera x
  let sceneObject x = SceneObject x

[<AutoOpen>]
module CameraProps =
  let cameraName x = CameraName x
  let dontClearViewport = DontClearViewport
  let cameraBackground x = CameraBackground x
  let cameraClearColorBuffer = CameraClearColorBuffer
  let cameraClearDepthBuffer = CameraClearDepthBuffer
  let cameraClearStencilBuffer = CameraClearStencilBuffer
  let cameraClearMask x = CameraClearMask x
  let borderWidth x = BorderWidth x
  let dontAutoSizeViewport = DontAutoSizeViewport
  let dontUseViewSizeAspect = DontUseViewSizeAspect
  let dontAutoPosition = DontAutoPosition
  let cameraPosition x = CameraPosition x
  let lookAt x = LookAt x
  let viewSize x = ViewSize x
  let viewportBounds x = ViewportBounds x
  let up x = Up x
  let near x = Near x
  let far x = Far x
  let aspect x = Aspect x
  let fov x = Fov x

[<AutoOpen>]
module UniformProps =
  let value x = Value x
  let uniformLink x = UniformLink x

  let vec2Value x y = Value [| x; y |]
  let vec2ValueV (v: Vec2) = v.Values |> box |> Value
  
  let vec4Value x y z w = Value [| x; y; z; w |]
  let vec4ValueV (v: Vec4) = v.Values |> box |> Value

[<AutoOpen>]
module UboProps =
  let u name props =
    let result overrides parentUbo parentObject =
      logCreation $"ubo uniform {name}" <| fun () -> GlUboUniform.create name (props @ overrides) parentUbo parentObject
    UboUniform result

  let bufferIndex x = BufferIndex x
  let uboUniform x = UboUniform x
  let uboLink x = UboLink x

[<AutoOpen>]
module AttributeProps =
  let baseType x = BaseType x
  let normalize = Normalize
  let stride x = Stride x
  let offset x = Offset x
  let values x = Values x
  let dataCount x = DataCount x
  let bufferUsage x = BufferUsage x
  let determinesVertexCount = DeterminesVertexCount
  let determinesInstanceCount = DeterminesInstanceCount
  let divisor x = Divisor x
  let childAttribute x = ChildAttribute x
  let attributeLink x = AttributeLink x

  let vec2Values (arr: Vec2[]) = arr |> Vec.vec2Values |> Values
  let vec2ValuesL (arr: Vec2 list) = arr |> Array.ofList |> vec2Values

[<AutoOpen>]
module IndicesProps =
  let IndexType x = IndexType x
  let IndexOffset x = IndexOffset x
  let IndexValues x = IndexValues x
  let IndexBufferUsage x = IndexBufferUsage x
  let IndicesLink x = IndicesLink x

[<AutoOpen>]
module TextureProps =
  let textureName x = TextureName x
  let textureTarget x = TextureTarget x
  let textureIndex x = TextureIndex x
  let level x = Level x
  let internalFormat x = InternalFormat x
  let textureWidth x = TextureWidth x
  let textureHeight x = TextureHeight x
  let format x = Format x
  let textureDataType x = TextureDataType x
  let pixels x = Pixels x
  let byteOffset x = ByteOffset x
  let noMipMap = NoMipMap
  let magFilter x = MagFilter x
  let minFilter x = MinFilter x
  let wrapS x = WrapS x
  let wrapT x = WrapT x
  let wrapR x = WrapR x
  let baseLevel x = BaseLevel x
  let compareFunc x = CompareFunc x
  let compareMode x = CompareMode x
  let maxLevel x = MaxLevel x
  let maxLod x = MaxLod x
  let minLod x = MinLod x
  let textureLink x = TextureLink x

[<AutoOpen>]
module InterleaveProps =
  let child name (props: GlAttrProp list) =
    let result overrides parentAttribute parentObject =
      logCreation $"child {name}" <| fun () -> GlInterleaveChildAttribute.create name (props @ overrides) parentAttribute parentObject
    ChildAttribute result

[<AutoOpen>]
module ObjectProps =
  let uniform name props =
    let result overrides parentObject =
      logCreation $"uniform {name}" <| fun () -> GlUniform.create name (props @ overrides) parentObject
    Uniform result

  let ubo name props =
    Ubo <| glubo name props

  let attribute name props =
    let result overrides parentObject =
      logCreation $"attribute {name}" <| fun () -> GlSingleAttribute.create name (props @ overrides) parentObject
    Attribute result

  let interleave name props =
    let result overrides parentObject =
      logCreation $"attribute {name}" <| fun () -> GlInterleaveAttribute.create name (props @ overrides) parentObject
    Attribute result

  let Indices props =
    let result overrides parentObject =
      logCreation "Indices" <| fun () -> GlIndices.create (props @ overrides) parentObject
    Indices result

  let texture props =
    Texture <| gltexture props

  let position2d x y = Position <| vec3 x y 0.0
  let position2dv p = Position <| Vec3.Create(p, 0.0)

  let pixelDataUint8 values = Pixels <| PixelData (uint8Array values)

  let pixelImageId id =
    let img = document.getElementById(id) |> unbox<HTMLImageElement>
    Pixels <| PixelHtmlImage img

  let objectName x = ObjectName x
  let drawMethod x = DrawMethod x
  let drawPrimitive x = DrawPrimitive x
  let vertexCount x = VertexCount x
  let vertexOffset x = VertexOffset x
  let vertexCountOffset x = VertexCountOffset x
  let instanceCount x = InstanceCount x
  let instanceOffset x = InstanceOffset x
  let instanceCountOffset x = InstanceCountOffset x
  let IndicesOffset x = IndicesOffset x
  let capability x = Capability x
  let processLinked x = ProcessLinked x
  let parallaxCamera x = ParallaxCamera x
  let parallaxDistance x = ParallaxDistance x
  let layer x = Layer x
  let angle x = Angle x
  let angleDegrees x = AngleDegrees x
  let angleZ x = AngleZ x
  let angleDegreesZ x = AngleDegreesZ x
  let position x = Position x
  let scale x = Scale x
  let objectLink x = ObjectLink x

  let pathParams (config: GlCanvasParams) scene =
    Ubo <| glubo "pathParams" [
      u "strokeColor" [ Value (config.StrokeColor).Values ]
      u "fillColor" [ Value (config.FillColor).Values ]
      u "lineWidth" [ Value (GlScene.pixelsToWorld config.LineWidth scene) ]
    ]

  // ====================================================== //
  // Depth testing
  // ====================================================== //
  let enableDepthTesting = GlCapability.enableDepthTesting
  let disableDepthTesting = GlCapability.disableDepthTesting
  // ====================================================== //
  // Culling
  // ====================================================== //
  let cullFront = GlCapability.cullFront
  let cullBack = GlCapability.cullBack
  let cullFrontAndBack = GlCapability.cullFrontAndBack
  let cullFace = GlCapability.cullFace
  let enableCulling = GlCapability.enableCulling
  let disableCulling = GlCapability.disableCulling
  // ====================================================== //
  // Blending
  // ====================================================== //
  let blendColor = GlCapability.blendColor
  let blendColorV = GlCapability.blendColorV
  let blendFunc = GlCapability.blendFunc
  let blendFuncSeparate = GlCapability.blendFuncSeparate
  let blendEquation = GlCapability.blendEquation
  let blendEquationSeparate = GlCapability.blendEquationSeparate
  let enableBlending = GlCapability.enableBlending
  let disableBlending = GlCapability.disableBlending
  // ====================================================== //
  // General Capabilities
  // ====================================================== //
  let enable = GlCapability.enable
  let disable = GlCapability.disable
