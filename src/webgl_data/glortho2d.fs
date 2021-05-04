module GlOrtho2D

open System
open Wil.Core.Utils
open Wil.Core
open Wil.Twod.Bounds
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data

let private positionZ = 10.0

let private dirty (data: GlCameraData) =
  data.IsDirty <- true
  GlCommon.dirtyScene data.Scene

let clean (data: GlCameraData) =
  data.IsDirty <- false

let private updatePosition (data: GlCameraData) =
  let lookAt = data.LookAt
  data.Position.WithXYZM(lookAt.X, lookAt.Y, positionZ)

let private clampViewToWorld (data: GlCameraData) =
  let viewCenter = data.LookAt.XY
  let viewBounds = boundsCenterV viewCenter data.ViewSize
  viewBounds.ClampM(data.Scene.WorldBounds)
  data.LookAt.WithXYM(viewBounds.Center)
  updatePosition data

let private clampViewToViewport (data: GlCameraData) =
  let scaledViewportSize = data.ViewportBounds.Size / data.Scene.WorldScale
  data.ViewSize.MinM(scaledViewportSize)
  let viewCenter = data.LookAt.XY
  let viewBounds = boundsCenterV viewCenter data.ViewSize
  data.LookAt.WithXYM(viewBounds.Center)

let private clampView (data: GlCameraData) =
  clampViewToViewport data
  clampViewToWorld data

let private clampViewportToScene (data: GlCameraData) =
  data.ViewportBounds.ClampM(data.Scene.SceneBounds)

let setLookAtXYZ x y z (data: GlCameraData) =
  data.LookAt.WithXYZM(x, y, z)
  clampView data
  dirty data

let inline setLookAtXY x y (data: GlCameraData) =
  setLookAtXYZ x y data.LookAt.Z data

let inline setLookAt (center: Vec3) (data: GlCameraData) =
  setLookAtXYZ center.X center.Y center.Z data

let setViewSize (size: Vec2) (data: GlCameraData) =
  size.Min(data.Scene.WorldBounds.Size, data.ViewSize) |> ignore

  if data.UseViewSizeAspect then
    let viewps = data.ViewportBounds.Size
    data.ViewSize.WithYM(data.ViewSize.X * viewps.Y / viewps.X)

  clampView data
  dirty data

let private apply props (data: GlCameraData) =
  let rec loop props (data: GlCameraData) =
    match props with
    | [] -> data
    | h::t ->
        match h with
        | CameraName x -> loop t { data with Name = x }
        | DontClearViewport -> loop t { data with ClearViewport = false }
        | CameraBackground x -> loop t { data with CameraBackground = x }
        | CameraClearColorBuffer -> loop t { data with ClearMask = data.ClearMask ||| GlClearBit.COLOR_BUFFER_BIT }
        | CameraClearDepthBuffer -> loop t { data with ClearMask = data.ClearMask ||| GlClearBit.DEPTH_BUFFER_BIT }
        | CameraClearStencilBuffer -> loop t { data with ClearMask = data.ClearMask ||| GlClearBit.STENCIL_BUFFER_BIT }
        | CameraClearMask x -> loop t { data with ClearMask = x }
        | BorderWidth x -> loop t { data with BorderWidth = x }
        | DontAutoSizeViewport -> loop t { data with AutoSizeViewport = false }
        | DontUseViewSizeAspect -> loop t { data with UseViewSizeAspect = false }
        | DontAutoPosition -> loop t { data with AutoPosition = false }
        | CameraPosition _ -> loop t data
        | LookAt x -> loop t { data with LookAt = x }
        | ViewSize x -> loop t { data with ViewSize = x }
        | ViewportBounds x -> loop t { data with ViewportBounds = x }
        | Up x -> loop t { data with Up = x }
        | Near x -> loop t { data with Near = x }
        | Far x -> loop t { data with Far = x }
        | Aspect x -> loop t { data with Aspect = x }
        | Fov x -> loop t { data with Fov = x }
  loop props data

let create props (scene: GlSceneData) =
  let worldBounds = scene.WorldBounds
  let viewport = scene.SceneBounds.Clone()
  let scaledViewportSize = viewport.Size / scene.WorldScale

  let updateScissorBounds (data: GlCameraData) =
    {
      data with
        ScissorBounds = data.ViewportBounds
        ViewportBounds = data.ViewportBounds.Inflate(-data.BorderWidth)
    }

  let adjustParams (data: GlCameraData) =
    clampViewportToScene data
    setViewSize data.ViewSize data
    setLookAt data.LookAt data
    data

  {
    Id = 0
    Kind = Ortho2D
    Name = ""
    IsDirty = true
    Scene = scene
    ClearViewport = true
    CameraBackground = vec4 0.0 0.0 0.0 1.0
    ClearMask = GlClearBit.COLOR_BUFFER_BIT
    BorderWidth = 0.0
    AutoSizeViewport = true
    UseViewSizeAspect = true
    AutoPosition = true
    Position = Vec3.Create(worldBounds.Center, positionZ)
    LookAt = Vec3.Create(worldBounds.Center, 0.0)
    ViewSize = worldBounds.Size.Min(scaledViewportSize)
    ViewportBounds = viewport
    ScissorBounds = viewport
    Up = vec3 0.0 1.0 0.0
    Near = 0.0
    Far = 1000.0
    Aspect = 0.0
    Fov = Math.PI
    ProjectionMatrix = Mat4.Create()
    ViewMatrix = Mat4.Create()
  }
  |> apply props
  |> updateScissorBounds
  |> adjustParams

let update (data: GlCameraData) =
  if data.IsDirty then
    Debug.logIndent $"Ortho2D {data.Name}.update"
    clean data
    let cam = data
    let ws = cam.Scene.WorldScale
    let halfSize = cam.ViewSize * ws * 0.5
    let hw = halfSize.X
    let hh = halfSize.Y
    let position = cam.Position * ws
    let lookAt = cam.LookAt * ws
    cam.ViewMatrix.LookAtM(position, lookAt, cam.Up)
    cam.ProjectionMatrix.OrthoM(-hw, hw, -hh, hh, cam.Near, cam.Far)
    Debug.popIndent()

let render (data: GlCameraData) =
  update data
  data.Scene |> GlCommon.objects |> Seq.iter (GlObj.render data)

let toWorldO (point: Vec2) (result: Vec3) (data: GlCameraData) =
  let gl = data.Scene.Canvas.Context
  let vb = data.ViewportBounds
  let minViewport = vb.Min
  minViewport.WithYM(gl.canvas.height - minViewport.Y - vb.Height)
  let minWorld = (data.LookAt.XY - data.ViewSize * 0.5)
  let pos = minWorld + point.Sub(minViewport) * (data.ViewSize / vb.Size)
  result.WithXYZM(pos.X, pos.Y, 0.0)
  result

let containsPoint (point: Vec2) (data: GlCameraData) =
  let worldPoint = toWorldO point (Vec3.Create()) data
  let viewBounds = boundsCenterV data.LookAt.XY data.ViewSize
  viewBounds.Contains(worldPoint.XY)

let inline panByXY x y (data: GlCameraData) =
  let lookAt = data.LookAt
  setLookAtXY (lookAt.X + x) (lookAt.Y + y) data

let inline panToXYZ x y z (data: GlCameraData) =
  setLookAtXYZ x y z data

let inline panTo2 (center: Vec2) (data: GlCameraData) =
  setLookAtXY center.X center.Y data

let getZoom (data: GlCameraData) =
  data.Scene.WorldBounds.Size.X / data.ViewSize.X

let zoom amount (data: GlCameraData) =
  if amount > 0.0 then
    setViewSize (data.Scene.WorldBounds.Size.Scale(amount)) data

let zoomBy amount (data: GlCameraData) =
  if amount > 0.0 then
    data.ViewSize.ScaleM(amount)
    setViewSize data.ViewSize data

let zoomToward (center: Vec3) amount (data: GlCameraData) =
  let delta = center - data.LookAt
  delta.ScaleM(amount - 1.0)
  zoomBy amount data
  setLookAt (data.LookAt - delta) data

let rotateTo (angle: float<rad>) (data: GlCameraData) =
  let up = data.Up.XY
  up.SetAngleM(angle)
  data.Up.WithXYM(up)
  dirty data

let rotateBy (angle: float<rad>) (data: GlCameraData) =
  let up = data.Up.XY
  up.RotateM(angle)
  data.Up.WithXYM(up)
  dirty data
