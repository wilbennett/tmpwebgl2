module GlScene

open Wil.Core
open Wil.Core.Utils
open Wil.Twod.Bounds
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data

type private Builder = {
  mutable CameraCreators: GlCameraFactory list
  mutable ObjectCreators: GlObjectFactory list
  mutable SharedCreator: GlObjectFactory
  mutable Data: GlSceneData
}

let getCamera = GlCommon.getCamera
let tryGetCamera = GlCommon.tryGetCamera
let getObject = GlCommon.getObject
let tryGetObject = GlCommon.tryGetObject

let addCamera = GlCommon.addCamera
let removeCamera = GlCommon.removeCamera
let addObject = GlCommon.addObject
let removeObject = GlCommon.removeObject

let clean (data: GlSceneData) =
  data.IsDirty <- false

let private applyCreators (builder: Builder) =
  let data = builder.Data
  let createCamera (creator: GlCameraFactory) = creator [] data
  let createCameras (creators: GlCameraFactory list) = creators |> List.map createCamera
  let createObject (creator: GlObjectFactory) = creator [] data
  let createObjects (creators: GlObjectFactory list) = creators |> List.map createObject

  let createShared (creator: GlObjectFactory) =
    creator [ObjectName "shared"] data

  let addObjects (data: GlSceneData) =
    // Must create one at a time since objects can link to prior objects.
    builder.ObjectCreators
    |> List.rev
    |> List.iter (fun c -> GlCommon.addObject c data |> ignore)
    data

  match builder.CameraCreators with
  | [] -> builder.CameraCreators <- [(fun p d -> GlOrtho2D.create ([CameraName "defaultCamera"] @ p) d)]
  | _ -> ()

  data.Shared <- createShared builder.SharedCreator |> Some
  data.Cameras <- createCameras (List.rev builder.CameraCreators)
  data |> addObjects

let private build (builder: Builder) =
  applyCreators builder

let private createLayer index = { Index = index; Objects = [] }

let private apply props (builder: Builder) =
  let rec loop props (b: Builder) =
    let updateData data = b.Data <- data; b
    let addShared creator = b.SharedCreator <- creator; b
    let addCamera creator = b.CameraCreators <- creator :: b.CameraCreators; b
    let addObject creator = b.ObjectCreators <- creator :: b.ObjectCreators; b

    let createLayers count = [| 0 .. count - 1 |] |> Array.map createLayer

    match props with
    | [] -> b
    | h::t ->
        match h with
        | SceneName x -> loop t (updateData { b.Data with Name = x })
        | SceneBackground x -> loop t (updateData { b.Data with SceneBackground = x })
        | SceneClearColorBuffer -> loop t (updateData { b.Data with ClearMask = b.Data.ClearMask ||| GlClearBit.COLOR_BUFFER_BIT })
        | SceneClearDepthBuffer -> loop t (updateData { b.Data with ClearMask = b.Data.ClearMask ||| GlClearBit.DEPTH_BUFFER_BIT })
        | SceneClearStencilBuffer -> loop t (updateData { b.Data with ClearMask = b.Data.ClearMask ||| GlClearBit.STENCIL_BUFFER_BIT })
        | SceneClearMask x -> loop t (updateData { b.Data with ClearMask = x })
        | SceneWorldBounds x -> loop t (updateData { b.Data with WorldBounds = x })
        | SceneBounds x -> loop t (updateData { b.Data with SceneBounds = x })
        | WorldScale x -> loop t (updateData { b.Data with WorldScale = x; LineWidthScale = 1.0 / x })
        | DontClearSceneBackground -> loop t (updateData { b.Data with ClearSceneBackground = false })
        | Layers x -> loop t (updateData { b.Data with Layers = createLayers x })
        | DefaultLayer x -> loop t (updateData { b.Data with DefaultLayer = x })
        | Shared x -> loop t (addShared x)
        | Camera x -> loop t (addCamera x)
        | SceneObject x -> loop t (addObject x)
  loop props builder

let create (canvas: GlCanvasData) props =
  let gl = canvas.Context
  let worldBounds = canvas.WorldBounds.Clone()

  let sharedCreator props scene =
    GlObj.create "emptyVertex" "emptyFragment" canvas.Global scene props

  {
    CameraCreators = []
    ObjectCreators = []
    SharedCreator = sharedCreator
    Data = {
      Id = 0
      Name = ""
      IsDirty = true
      Canvas = canvas
      SceneBackground = Vec4.Create()
      ClearMask = GlClearBit.COLOR_BUFFER_BIT
      WorldBounds = worldBounds
      SceneBounds = boundsSizeV canvas.Size
      WorldScale = 1.0
      LineWidthScale = 1.0
      ClearSceneBackground = false
      Layers = [| createLayer 0 |]
      DefaultLayer = 0
      Shared = None
      Cameras = []
    }
  }
  |> apply props
  |> build

let clearSceneBackground (data: GlSceneData) =
  let gl = data.Canvas.Context
  let vp = data.SceneBounds.Values
  let cc = data.SceneBackground.Values

  gl.scissor(vp.[0], vp.[1], vp.[2], vp.[3])
  gl.clearColor(cc.[0], cc.[1], cc.[2], cc.[3])

  gl.enable(gl.SCISSOR_TEST)
  gl.clear(float data.ClearMask)
  gl.disable(gl.SCISSOR_TEST)

let render (data: GlSceneData) =
  let updateCameraViewport (camera: GlCameraData) viewport =
    let vp = GlCamera.getGlViewportValues camera
    GlUniform.setValue vp viewport

  let updateCameraZoom (camera: GlCameraData) zoom =
    let z = GlCamera.getZoom camera
    GlUniform.setValue z zoom

  let renderCamera (camera: GlCameraData) =
    Debug.logIndent $"scene.renderCamera {camera.Name}"
    GlObj.update camera data.Shared.Value
    GlCamera.render camera
    Debug.popIndent()

  let renderCameraMat projMat viewMat (camera: GlCameraData) =
    Debug.logIndent $"scene.renderCameraMat {camera.Name}"
    GlCamera.update camera
    GlUniform.setValue camera.ProjectionMatrix.Values projMat
    GlUniform.setValue camera.ViewMatrix.Values viewMat
    GlObj.update camera data.Shared.Value
    GlCamera.render camera
    Debug.popIndent()

  if data.IsDirty then
    Debug.logIndent $"scene.{data.Name}.render"
    // update data
    if data.ClearSceneBackground then clearSceneBackground data
    let glob = data.Canvas.Global.Value
    let viewport = GlObj.tryGetUniform "viewport" data.Shared.Value
    let projMat = GlObj.tryGetUniform "projMat" data.Shared.Value
    let viewMat = GlObj.tryGetUniform "viewMat" data.Shared.Value
    let zoom = GlObj.tryGetUniform "zoom" data.Shared.Value

    match GlObj.tryGetUniform "worldScale" glob with
    | None -> ()
    | Some uWorldScale ->
        uWorldScale |> GlUniform.setValue data.WorldScale
        glob |> GlObj.update data.Cameras.Head

    let renderCam (camera: GlCameraData) =
      viewport |> Option.call (updateCameraViewport camera)
      zoom |> Option.call (updateCameraZoom camera)

      match projMat, viewMat with
      | Some proj, Some view -> renderCameraMat proj view camera
      | _ -> renderCamera camera

    data.Cameras |> List.iter renderCam

    data.Shared.Value |> GlObj._cleanLinkedBuffers
    data |> GlCommon.objects |> Seq.iter GlObj._cleanLinkedBuffers
    Debug.popIndent()

let pixelsToWorld (pixels: float<px>) (data: GlSceneData) =
  pixels * data.LineWidthScale |> float

let worldToPixels value (data: GlSceneData) =
  value * data.WorldScale |> pixels
