module GlCamera

open Wil.Core.Utils
open Wil.Core
open Wil.Js
open Wil.Webgl.Data

let dirty (data: GlCameraData) =
  data.IsDirty <- true
  GlCommon.dirtyScene data.Scene

let getGlViewportValues (data: GlCameraData) =
  let gl = data.Scene.Canvas.Context
  let vp = data.ViewportBounds.Values
  let vpy = gl.canvas.height - vp.[1] - vp.[3]
  vp.[1] <- vpy
  vp

let private resetViewport (data: GlCameraData) =
  let gl = data.Scene.Canvas.Context
  let vp = getGlViewportValues data
  gl.viewport(vp.[0], vp.[1], vp.[2], vp.[3])

let private clearViewport (data: GlCameraData) =
  let gl = data.Scene.Canvas.Context
  let sb = data.ScissorBounds.Values
  let cc = data.CameraBackground.Values
  let sby = gl.canvas.height - sb.[1] - sb.[3]

  gl.scissor(sb.[0], sby, sb.[2], sb.[3])
  gl.clearColor(cc.[0], cc.[1], cc.[2], cc.[3])

  gl.enable(gl.SCISSOR_TEST)
  gl.clear(float data.ClearMask)
  gl.disable(gl.SCISSOR_TEST)

let update (data: GlCameraData) =
  if data.IsDirty then
    Debug.logIndent $"Camera {data.Name}.update"
    match data.Kind with
    | Ortho2D -> GlOrtho2D.update data
    | Perspective -> throw $"Perspective camera update not implemented"
    Debug.popIndent()

let render (data: GlCameraData) =
  Debug.logIndent $"Camera {data.Name}.render"
  update data
  if data.ClearViewport then clearViewport data
  resetViewport data

  match data.Kind with
  | Ortho2D -> GlOrtho2D.render data
  | Perspective -> throw $"Perspective camera rendering not implemented"
  Debug.popIndent()

let toWorldO (point: Vec2) (result: Vec3) (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.toWorldO point result data
  | Perspective -> throw $"Perspective camera conversions not implemented"

let inline toWorld (point: Vec2) (data: GlCameraData) =
  toWorldO point (Vec3.Create()) data

let containsPoint (point: Vec2) (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.containsPoint point data
  | Perspective -> throw $"Perspective camera containsPoint not implemented"

let getZoom (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.getZoom data
  | Perspective -> throw $"Perspective camera zooming not implemented"

let panByXY x y (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.panByXY x y data
  | Perspective -> throw $"Perspective camera panning not implemented"

let inline panBy (offset: Vec2) (data: GlCameraData) =
  panByXY offset.X offset.Y data

let panToXYZ x y z (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.panToXYZ x y z data
  | Perspective -> throw $"Perspective camera panning not implemented"

let inline panToXY x y (data: GlCameraData) =
  panToXYZ x y data.LookAt.Z data

let inline panTo (center: Vec3) (data: GlCameraData) =
  panToXYZ center.X center.Y center.Z data

let inline panTo2 (center: Vec2) (data: GlCameraData) =
  panToXY center.X center.Y data

let zoom amount (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.zoom amount data
  | Perspective -> throw $"Perspective camera zooming not implemented"

let zoomBy amount (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.zoomBy amount data
  | Perspective -> throw $"Perspective camera zooming not implemented"

let zoomToward (center: Vec3) amount (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.zoomToward center amount data
  | Perspective -> throw $"Perspective camera zooming not implemented"

let rotateTo (angle: float<rad>) (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.rotateTo angle data
  | Perspective -> throw $"Perspective camera rotating not implemented"

let rotateBy (angle: float<rad>) (data: GlCameraData) =
  match data.Kind with
  | Ortho2D -> GlOrtho2D.rotateBy angle data
  | Perspective -> throw $"Perspective camera rotating not implemented"

let inline rotateDegreesTo (angle: float<deg>) (data: GlCameraData) =
  rotateTo (angle |> toRadians) data

let inline rotateDegreesBy (angle: float<deg>) (data: GlCameraData) =
  rotateBy (angle |> toRadians) data
