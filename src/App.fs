module App

open Wil.Webgl.Core

open System
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Browser.Types
open Browser.Dom
open Wil.Core
open Wil.Core.Utils
open Wil.Twod
open Wil.Twod.Bounds
open Wil.Js
open Wil.Js.Debug
open Wil.Webgl.Types
open Wil.Webgl
open Wil.Webgl.Props

open Wil.Webgl.Data

Debug.enable()

// Debug.setLogCollapsed false

// the unbox keyword allows to make an unsafe cast. Here we assume that getElementById will return an HTMLCanvasElement 
let star = document.getElementById "star" |> unbox<HTMLImageElement>
let myCanvas = document.getElementById "myCanvas" |> unbox<HTMLCanvasElement>
myCanvas.width <- 400.0
myCanvas.height <- 400.0

let elFps = document.getElementById "fps" :?> HTMLSpanElement
let elMouse = document.getElementById "mouse" :?> HTMLSpanElement
// let mouse = GlMouse(myCanvas)

let showMousePos (pos: Vec2) = elMouse.textContent <- $"{pos}"

module Helpers =
  open Wil.Webgl.Core

  let rec getUniforms (info: GlUniformInfo) =
    seq {
      yield info
      if info.Children.Length > 0 then
        yield! (info.Children |> Array.map getUniforms |> Seq.concat)
    }

  let showUniforms (data: GlObjData) =
    let pinfo = data.ProgramInfo
    jsLog $"{data.Name}"
    JS.console.table(pinfo.Uniforms |> Seq.collect getUniforms |> Array.ofSeq)

  let showUbos (data: GlObjData) =
    let pinfo = data.ProgramInfo
    jsLog $"{data.Name}"
    JS.console.table(pinfo.Ubos |> Seq.collect (fun u -> u.Uniforms) |> Array.ofSeq)

  let showAttributes (data: GlObjData) =
    let pinfo = data.ProgramInfo
    jsLog $"{data.Name}"
    JS.console.table(pinfo.Attributes |> Array.ofList)

let run f =
  let (desc, canvas, update, animating, frames) = f()
  jsLog $"Test {desc}"
  let mouse = canvas.Mouse
  GlCanvas.render 0.0 canvas
  // canvas.Global |> Option.call GlDebug.tableObjDefAndContents
  // scene.Shared |> Option.call GlDebug.tableObjDefAndContents
  // canvas |> GlCommon.allObjects |> Seq.iter GlDebug.tableObjDefAndContents
  // canvas |> GlCommon.allObjects |> Seq.iter GlDebug.tableObjDef
  // scene.Shared |> Option.call showUniforms
  // canvas |> GlCommon.allObjects |> Seq.iter Helpers.showUniforms
  // canvas |> GlCommon.allObjects |> Seq.iter Helpers.showUbos

  let mutable active = false
  let mutable fps = 0.0
  let mutable frame = 1
  let mutable lastFpsTime = 0.0
  let mutable framesLastSecond = 0
  let dragButton = Mouse.leftButton
  // dragButton = Mouse.middleButton
  let mutable dragging = false
  let mutable dragOffset = Vec3.Create()

  let getMouseCamera (p: Vec2) =
    let getCamera p scene =
      scene.Cameras |> List.tryFind (fun c -> c |> GlCamera.containsPoint p)
    canvas.Scenes |> Array.tryPick (getCamera p)

  let processMouse () =
    if mouse.IsDragStartEvent(dragButton) then
      match getMouseCamera mouse.Position with
      | None -> ()
      | Some cam ->
          dragging <- true
          let scene = cam.Scene
          let origin = cam |> GlCamera.toWorld (mouse.DragOrigin(dragButton))
          let obj1 = scene |> GlCommon.objects |> Seq.tryHead
          obj1 |> Option.call (fun o -> dragOffset <- o.Position - origin)

    if mouse.IsDragEvent(dragButton) && dragging then
      match getMouseCamera mouse.Position with
      | None -> ()
      | Some cam ->
          let scene = cam.Scene
          let worldPos = cam |> GlCamera.toWorld mouse.Position
          // cam |> GlCamera.panTo (Vec3.Create(worldPos, 0.0))
          let obj1 = scene |> GlCommon.objects |> Seq.tryHead
          obj1 |> Option.call (fun o -> o |> GlObj.setPosition (worldPos + dragOffset))

    if mouse.IsDragEndEvent(dragButton) then dragging <- true

    if mouse.IsWheelEvent then
      match getMouseCamera mouse.Position with
      | None -> ()
      | Some cam ->
        if mouse.WheelDelta.Y <> 0.0 then
          let zoom = if mouse.WheelDelta.Y > 0.0 then 1.03 else 0.97
          // cam |> GlCamera.zoomBy zoom
          let worldPos = cam |> GlCamera.toWorld mouse.Position
          cam |> GlCamera.zoomToward worldPos zoom
        if mouse.WheelDelta.X <> 0.0 then
          let amount = if mouse.WheelDelta.X > 0.0 then 10.0 else -10.0
          cam |> GlCamera.panByXY amount 0.0
    ()

  let rec render time =
    let seconds = time / 1000.0
    frame <- frame + 1

    if animating && frame < frames then
      window.requestAnimationFrame render |> ignore
    else
      active <- false

    mouse.Update()
    showMousePos mouse.Position
    processMouse()
    if animating then update seconds
    GlCanvas.render seconds canvas

    if seconds - lastFpsTime >= 1.0 then
      fps <- lerp fps (float framesLastSecond) 0.75
      lastFpsTime <- seconds
      framesLastSecond <- 0
      elFps.textContent <- $"%3.1f{fps}"

    framesLastSecond <- framesLastSecond + 1

  let scheduleRender () =
    if not active then
      window.requestAnimationFrame render |> ignore

  mouse.Changed.Add scheduleRender

  if animating && frame < frames then
    scheduleRender()
    active <- true
  ()

let testGridObject () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let dim = 34.0
  let worldBounds = boundsCenterHalf 0.0 0.0 dim dim
  let worldScale = viewport.HalfSize.X / dim

  let canvas =
    glcanvas "myCanvas" [
      WorldBounds worldBounds
      NoAlpha

      scene [
        WorldScale worldScale
        Layers 3
        DefaultLayer 1

        orthoCam2d [
          CameraName "cam"
          CameraBackground <| vec4 0.0 0.4 0.4 0.1
          BorderWidth 10.0
        ]

        sharedObjectWithCamera2d
      ]
    ]

  let renderer = GlRenderer()
  let scene = canvas.Scenes.[0]
  // let grid = Grid2D(scene, worldBounds.Size * 0.8, 2)
  let grid = renderer.Grid2D(scene, worldBounds.Size - 4.0, 2)
  // grid.MinorLineWidth <- 1.0
  // grid.MinorLineColor <- vec4 0.0 0.0 1.0 1.0
  // let v = VectorObject2D(scene, vec2 1.0 1.0)
  // v.Position2 <- vec2 0.1 0.0

  let update (time: float) =
    // let fracTime = Math.Ceiling(time) - time
    // let angle = Math.Sin(time * 3.0 / 2.0) * Math.PI
    // grid.AngleZ <- abs angle |> radians
    // grid.LineWidth <- time % 10.0 + 1.0
    // v.LineWidth <- grid.LineWidth
    grid.MinorTick <- time % 5.0 + 1.0
    // grid.MinorTick <- 3 - grid.MinorTick
    ()

  ("grid", canvas, update, false, 60 * 2)

let testParallax () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let halfDim = 34.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenterHalf 0.0 0.0 dim dim
  let worldScale = viewport.HalfSize.X / halfDim

  let canvas =
    glcanvas "myCanvas" [
      WorldBounds worldBounds
      NoAlpha

      scene [
        WorldScale worldScale
        Layers 3
        DefaultLayer 1

        orthoCam2d [
          CameraName "cam"
          CameraBackground <| vec4 0.0 0.4 0.4 0.1
          BorderWidth 10.0
        ]

        orthoCam2d [
          CameraName "cam2"
          ViewportBounds viewport.Quadrant1
          CameraBackground <| vec4 0.4 0.4 0.0 0.1
          BorderWidth 10.0
        ]

        sharedObjectWithCamera2d
      ]
    ]

  let renderer = GlRenderer()
  let scene = canvas.Scenes.[0]
  let cam = scene.Cameras.Head
  let cam2 = scene |> GlScene.getCamera "cam2"
  let grid = renderer.Grid2D(scene, worldBounds.Size - 2.0, 2, "", "", "cam", 4.5)
  let v1 = renderer.Vector2D(scene, vec2 5.0 -10.0, -1, "v1", "", "cam", 2.1)
  let v2 = renderer.Vector2D(scene, vec2 10.0 10.0, -1, "v2", "", "cam", 1.0)
  v1.Position <- Vec3.Create(v2.Vector, 0.0) // vec3 5.0 12.0 0.0
  v1.LineWidth <- 8.0
  v2.LineWidth <- 10.0
  v2.StrokeColor <- vec4 0.3 0.0 0.5 1.0
  let mutable angle = 0.0

  let update (time: float) =
    let maxView = (worldBounds.Size - cam.ViewSize) * 0.5
    angle <- angle + 3.0
    if angle > 360.0 then angle <- angle - 360.0
    let sin = Math.Sin(angle * (Math.PI / 180.0))
    let x = sin * maxView.X
    cam |> GlCamera.panToXY x 0.0
    ()

  ("Parallax", canvas, update, true, 60 * 10)

let testLink () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let halfDim = 16.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenter 0.0 0.0 dim dim

  let canvas =
    glcanvas "myCanvas" [
      WorldBounds worldBounds
      NoAlpha

      scene [
        WorldScale 5.0
        Layers 3
        DefaultLayer 1

        orthoCam2d [
          CameraName "cam"
          CameraBackground <| vec4 0.0 0.4 0.4 0.1
          BorderWidth 10.0
        ]

        sharedObjectWithCamera2d
      ]
    ]

  let renderer = GlRenderer()
  let scene = canvas.Scenes.[0]
  let cam = scene.Cameras.Head
  let v1 = renderer.Vector2D(scene, vec2 5.0 5.0, -1, "v1", "")
  let v2 = renderer.Vector2D(scene, vec2 5.0 -5.0, -1, "v2", "v1")
  let v3 = renderer.Vector2D(scene, vec2 5.0 5.0, -1, "v3", "v2")
  // v1.ObjectDef.LinkedChildren |> List.iter (fun c -> jsLog $"{c.Name}")
  v1.LineWidth <- 3.0
  v1.StrokeColor <- vec4 0.3 0.0 0.5 1.0
  v2.Position <- Vec3.Create(v1.Vector, 0.0)
  v2.LineWidth <- 3.0
  v3.Position <- Vec3.Create(v2.Vector, 0.0)
  v3.LineWidth <- 3.0
  let mutable angle = 0.0

  let update (time: float) =
    let maxView = (worldBounds.Size - cam.ViewSize) * 0.5
    angle <- angle + 3.0
    if angle > 360.0 then angle <- angle - 360.0
    let sin = Math.Sin(angle * (Math.PI / 180.0))
    v1.Scale <- sin |> abs |> (+) 0.3
    v1.AngleDegreesZ <- angle |> degrees
    v2.AngleDegreesZ <- sin * 360.0 |> degrees
    v3.Scale <- 1.6 - sin |> abs |> (+) 0.3
    ()

  ("Link", canvas, update, false, 60 * 10)

let testLine () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let ofs = 0.0
  let ofs2 = ofs * 2.0
  let viewport = bounds ofs ofs (myCanvas.width - ofs2) (myCanvas.height - ofs2)
  let halfDim = 3.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenter 0.0 0.0 dim dim
  let worldScale = viewport.HalfSize.X / halfDim

  let canvas =
    glcanvas "myCanvas" [
      WorldBounds worldBounds
      NoAlpha

      scene [
        WorldScale worldScale
        Layers 3
        DefaultLayer 1

        orthoCam2d [
          CameraName "cam"
          ViewportBounds viewport
          CameraBackground <| vec4 0.0 0.4 0.4 0.1
          BorderWidth 10.0
        ]

        sharedObjectWithCamera2d
      ]
    ]

  let renderer = GlRenderer()
  let scene = canvas.Scenes.[0]
  let cam = scene.Cameras.Head
  let grid = renderer.Grid2D(scene, worldBounds.Size - 0.0, 2)
  let line1 = renderer.Line2D(scene, vec2 0.0 0.5, vec2 2.0 1.5)
  // let line1 = renderer.Line2D(scene, vec2 2.0 1.5, vec2 0.0 0.5)
  let line2 = renderer.Line2D(scene, vec2 2.0 -2.0, vec2 1.0 -1.0)
  let line3 = renderer.Line2D(scene, vec2 -1.5 -2.0, vec2 -0.5 -1.0)
  line1.LineWidth <- worldScale
  line1.StrokeColor <- vec4 0.0 0.0 1.0 1.0
  line1.LineCap <- LineCap.Round
  line2.LineWidth <- worldScale * 0.5
  line2.LineCap <- LineCap.Square
  line3.LineWidth <- worldScale * 0.25
  line3.LineCap <- LineCap.Butt
  let mutable angle = 0.0

  let update (time: float) =
    angle <- angle + 3.0
    if angle > 360.0 then angle <- angle - 360.0
    let sin = Math.Sin(angle * (Math.PI / 180.0))
    ()

  ("Line", canvas, update, false, 60 * 10)

let testLinePath () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let ofs = 0.0
  let ofs2 = ofs * 2.0
  let viewport = bounds ofs ofs (myCanvas.width - ofs2) (myCanvas.height - ofs2)
  let halfDim = 3.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenter 0.0 0.0 dim dim
  let calcScale (bounds: Bounds) = bounds.HalfSize.X / halfDim

  let canvas =
    glcanvas "myCanvas" [
      WorldBounds worldBounds
      NoAlpha
    ]

  let renderer = GlRenderer()

  let addScene (idx: int) bounds join cap =
    let scene =
      glscene [
        SceneBounds bounds
        WorldScale (calcScale bounds)
        Layers 3
        DefaultLayer 1

        orthoCam2d [
          CameraName $"cam{idx}"
          CameraBackground <| vec4 0.0 0.4 0.4 0.1
          cameraClearDepthBuffer
          // BorderWidth 10.0
        ]

        sharedObjectWithCamera2d
      ]
      |> (fun s -> GlCanvas.addScene s canvas)

    scene.Cameras.Head |> ignore
    renderer.Grid2D(scene, worldBounds.Size, 2, "grid") |> ignore
    let path1 = renderer.LinePath2D(scene, [|
      vec2 -2.0 0.5
      vec2 -0.5 1.8
      vec2 0.5 0.5
      vec2 2.3 1.8
    |], -1, "path1")
    let path2 = renderer.LinePath2D(scene, [|
      // vec2 2.3 -2.5
      vec2 2.5 0.0
      vec2 0.5 -0.5
      vec2 -0.5 -2.0
      vec2 -2.0 -0.5
    |], -1, "path2")
    path1.Add(vec2 2.5 0.0)
    path1.LineWidth <- scene.WorldScale * 0.8
    path1.StrokeColor <- vec4 0.0 0.0 1.0 0.4
    path1.LineCap <- cap
    path1.LineJoin <- join
    path1.MiterLimit <- 100.0 + 0.5 * path1.LineWidth
    path2.Add([| vec2 -1.5 -2.0; vec2 -2.8 -1.0 |])
    // path2.Set(0, vec2 2.8 -2.5)
    path2.LineWidth <- scene.WorldScale * 0.6
    path2.StrokeColor <- vec4 1.0 0.0 0.0 0.1
    path2.LineCap <- cap
    path2.LineJoin <- join
    path2.MiterLimit <- 100.0 + 0.5 * path2.LineWidth
    (path1, path2)

  let s = [
    // addScene viewport LineJoin.Round LineCap.Butt
    addScene 1 viewport.Quadrant1 LineJoin.Bevel LineCap.Butt
    addScene 2 viewport.Quadrant2 LineJoin.Round LineCap.Round
    addScene 3 viewport.Quadrant3 LineJoin.Miter LineCap.Square
    addScene 4 viewport.Quadrant4 LineJoin.Round LineCap.Round
  ]
  let mutable angle = 0.0

  let update (time: float) =
    let updatePaths sin =
      let y = sin * 2.5
      let v1 = vec2 2.5 y
      let v2 = vec2 2.5 (0.0 - y)
      s |> List.iter (fun (p1, p2) ->
        p1.Set(4, v1)
        p2.Set(0, v2)
        )
      ()

    angle <- angle + 0.4
    if angle > 360.0 then angle <- angle - 360.0
    let sin = Math.Sin(angle * (Math.PI / 180.0))
    updatePaths sin
    ()

  ("Linepath", canvas, update, false, 60 * 120)

let testLinePathAligned () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let ofs = 0.0
  let ofs2 = ofs * 2.0
  let viewport = bounds ofs ofs (myCanvas.width - ofs2) (myCanvas.height - ofs2)
  let halfDim = 3.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenter 0.0 0.0 dim dim
  let calcScale (bounds: Bounds) = bounds.HalfSize.X / halfDim

  let canvas =
    glcanvas "myCanvas" [
      WorldBounds worldBounds
      NoAlpha
    ]

  let renderer = GlRenderer()

  let addScene bounds join cap =
    let scene =
      glscene [
        SceneBounds bounds
        WorldScale (calcScale bounds)
        Layers 3
        DefaultLayer 1

        orthoCam2d [
          CameraName "cam"
          CameraBackground <| vec4 0.0 0.4 0.4 0.1
          cameraClearDepthBuffer
          BorderWidth 10.0
        ]

        sharedObjectWithCamera2d
      ]
      |> (fun s -> GlCanvas.addScene s canvas)

    scene.Cameras.Head |> ignore
    renderer.Grid2D(scene, worldBounds.Size, 2, "grid") |> ignore

    let addPath name color points =
      let path = renderer.LinePath2D(scene, points, -1, name)
      path.LineWidth <- scene.WorldScale * 0.8
      path.StrokeColor <- color
      path.LineCap <- cap
      path.LineJoin <- join
      path

    let color1 = vec4 0.0 0.0 1.0 0.4
    let color2 = vec4 1.0 0.2 0.5 0.1
    let color3 = vec4 0.2 0.5 1.0 0.4
    addPath "path1" color1 [| vec2 -2.0  2.3; vec2  0.5  2.3; vec2  2.0  2.3 |] |> ignore
    addPath "path2" color1 [| vec2  2.0 -2.3; vec2  0.5 -2.3; vec2 -2.0 -2.3 |] |> ignore
    addPath "path3" color2 [| vec2 -2.0  2.0; vec2 -2.0  0.0; vec2 -2.0 -2.0 |] |> ignore
    addPath "path4" color2 [| vec2  2.0 -2.0; vec2  2.0  0.0; vec2  2.0  2.0 |] |> ignore
    addPath "path5" color3 [| vec2 -1.0 -1.0; vec2  0.0  0.0; vec2  1.0  1.0 |] |> ignore

  addScene viewport.Quadrant1 LineJoin.Bevel LineCap.Butt
  addScene viewport.Quadrant2 LineJoin.Round LineCap.Round
  addScene viewport.Quadrant3 LineJoin.Miter LineCap.Square
  addScene viewport.Quadrant4 LineJoin.Round LineCap.Round

  ("Linepath Aligned", canvas, ignore, false, 0)

let testNoise () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let worldBounds = boundsCenterV (vec2 0.0 0.0) viewport.Size
  let halfDim = 2.0
  let dim = halfDim * 2.0
  let gridWorld = boundsCenter 0.0 0.0 dim dim
  let calcScale (bounds: Bounds) = bounds.HalfSize.X / halfDim

  let canvas =
    glcanvas "myCanvas" [
      // CanvasSize <| vec2 150.0 150.0
      WorldBounds worldBounds
      NoAlpha
      globalWithResolutionTime2d

      // scene [ SceneName "scene1"; SceneBounds viewport; sharedObjectWithCamera2d ]
      // scene [ SceneName "scene1"; SceneBounds viewport.Quadrant1; sharedObjectWithCamera2d ]
      // scene [ SceneName "scene2"; SceneBounds viewport.Quadrant2; sharedObjectWithCamera2d ]
      // scene [ SceneName "scene3"; SceneBounds viewport.Quadrant3; sharedObjectWithCamera2d ]
      scene [
        SceneName "scene4"
        SceneWorldBounds gridWorld
        // WorldScale (calcScale viewport.Quadrant4)
        // SceneBounds viewport.Quadrant4
        WorldScale (calcScale viewport)
        SceneBounds viewport
        Layers 2
        DefaultLayer 0
        sharedObjectWithCamera2d
        orthoCam2d [
          CameraName $"gridCam"
          CameraBackground <| vec4 0.0 0.4 0.4 0.1
          cameraClearDepthBuffer
        ]
      ]
    ]

  // let scene1 = canvas |> GlCanvas.getScene "scene1"
  // let scene2 = canvas |> GlCanvas.getScene "scene2"
  // let scene3 = canvas |> GlCanvas.getScene "scene3"
  let scene4 = canvas |> GlCanvas.getScene "scene4"
  let renderer = GlRenderer()
  let vec = renderer.Vector2D(scene4, vec2 1.0 0.0);
  // vec.LineWidth <- 2.0 * scene4.WorldScale
  vec.AngleDegreesZ <- 0.0<deg>
  vec.LineWidth <- scene4 |> GlScene.pixelsToWorld 10.0<px>
  vec.StrokeColor <- vec4 0.0 0.0 1.0 1.4
  // vec.FillColor <- vec4 0.0 0.0 1.0 1.4
  vec.FillColor <- vec4 0.0 0.7 0.0 0.1
  // vec.FillType <- FillType.Border
  vec.Position2 <- vec2 -0.0 0.5
  vec.AliasWidth <- 2.0<px>
  // vec.AngleDegreesZ <- 30.0<deg>
  let noiseSize = worldBounds.Quadrant1.InflatePct(0.9).Size
  // let n = renderer.PerlinNoise1DObject2D(scene1, noiseSize, 0, -1, "perlinNoise1D")
  // n.Octaves <- 1
  // n.Frequency <- vec2 0.035 0.035
  // n.Amplitude <- 2.0
  // n.Lacunarity <- 2.1
  // n.Range <- 5.0
  // n.StrokeColor <- vec4 1.0 0.0 0.0 1.0
  // n.FillColor <- vec4 0.2 0.2 0.2 1.0
  // n.LineWidth <- 2.0
  // n.AngleDegreesZ <- 0.0<deg>
  // n.Scale <- 1.0

  // // let n2 = renderer.PerlinNoise2DObject2D(scene1, noiseSize, Random().Next(), -1, "perlinNoise2D")
  // let n2 = renderer.PerlinNoise2DObject2D(scene2, noiseSize, 0, -1, "perlinNoise2D")
  // n2.Start <- vec2 0.12 0.013
  // n2.Octaves <- 2
  // n2.Frequency <- vec3 0.040 0.034 0.0010
  // n2.Frequency <- vec3 0.040 0.034 0.040
  // n2.Frequency <- Vec3.Create(0.05)
  // n2.Amplitude <- 1.0
  // n2.Lacunarity <- 5.0
  // n2.Time <- 0.0;
  // n2.StrokeColor <- vec4 1.0 0.0 0.0 1.0
  // n2.FillColor <- vec4 0.2 0.2 0.2 1.0
  // n2.LineWidth <- 2.0

  // let colorMap =
  //   let stops: ColorStop list = [
  //     (0.0, vec4 200.0 128.0 0.0 255.0)
  //     (0.25, vec4 0.0 0.0 0.0 0.0)
  //     (0.3, vec4 255.0 0.0 0.0 255.0)
  //     (0.5, vec4 0.0 0.0 0.0 0.0)
  //     (1.0, vec4 0.0 0.0 0.0 255.0)
  //   ]
  //   GlPalette.createPaletteData 30 stops

  // n2.ColorMap <- colorMap

  // let lines =
  //   let count = 50
  //   let sceneWidth = scene3.Cameras.Head.ViewSize.X
  //   let halfSceneWidth = sceneWidth * 0.5
  //   let width = sceneWidth / float count

  //   [|
  //     for i in [0 .. count - 1] do
  //       let x = -halfSceneWidth + float i * width
  //       let line = renderer.Line2D(scene3, vec2 0.0 0.0, vec2 width 0.0)
  //       line.Position2 <- vec2 x 0.0
  //       line.LineWidth <- 3.0
  //       line.StrokeColor <- vec4 1.0 0.0 0.0 1.0
  //       // line.StrokeColor <- vec4 (float((i + 1) % 4) / 3.0)(float((i + 1) % 5) / 4.0) (float((i + 1) % 6) / 5.0) 1.0
  //       yield line
  //   |]

  // let linesStart = vec2 0.0 0.0
  // let mutable linesTime = 0.0
  // let linesFreq = Vec2.Create(min (float lines.Length * 0.001) 0.02)
  // let linesAmp = 20.0

  let grid = renderer.Grid2D(scene4, gridWorld.Size, 1, "grid")

  let mutable incF = 0.001
  let mutable incS = 0.01
  let mutable oct = 1.0
  let mutable incO = 1.0 / (60.0 * 0.1)
  let mutable noiseTime = 0.0
  let mutable timeO = 1.0 / (60.0 * 0.03)
  let mutable frame = 0

  let update time =
    GlCanvas.dirty canvas
    // let updateLinePositions index (line: LineObjects2D) =
    //   linesStart.WithYM(linesTime)
    //   let y = noise2 (linesStart + (float <| index + 1) * linesFreq) * linesAmp
    //   line.Position2 <- line.Position2.WithY(y)

    // let updateLineAngles (line: LineObjects2D, nextLine: LineObjects2D) =
    //   let lineStart = line.Position2
    //   let nextStart = nextLine.Position2
    //   let ab = nextStart - lineStart
    //   line.Angle <- Vec3.Create(float ab.Angle)

    // let updateLines () = 
    //   lines |> Array.iteri updateLinePositions
    //   lines |> Array.pairwise |> Array.iter updateLineAngles
    //   // lines.[lines.Length - 1].Angle <- lines.[lines.Length - 2].Angle
    //   linesTime <- linesTime + 0.025
    //   // linesStart += 0.015

    // vec.AngleZ <- sin(fract(time * 3.123 * 0.1)) * (Math.PI * 2.0) |> radians
    // vec.Vector <- vec.Vector.Rotate(1.0<deg> |> toRadians);
    // updateLines ()
    frame <- frame + 1
    // if frame % 10 = 0 then
    noiseTime <- noiseTime + timeO
    // n.Time <- noiseTime
    // n2.Time <- n2.Time + 0.2
    // oct <- oct + incO
    // if oct < 2.0 || oct > 16.0 then incO <- -incO
    // n.Octaves <- int(oct)
    // // n.Scale <- n.Scale + incS
    // // if n.Scale < 0.3 || n.Scale > 1.5 then incS <- -incS
    // n.Start <- n.Start + 0.7
    // n2.Start <- n2.Start + vec2 0.2 0.1
    // n.Frequency <- n.Frequency + incF
    // if n.Frequency < 0.01 || n.Frequency > 0.05 then incF <- -incF

    // n2.Start <- n2.Start + vec2 0.7 0.2
    ()

  ("Noise", canvas, update, true, 60 * 120)

let testVector () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let worldBounds = boundsCenterV (vec2 0.0 0.0) viewport.Size
  let halfDim = 2.0
  let dim = halfDim * 2.0
  let gridWorld = boundsCenter 0.0 0.0 dim dim
  let calcScale (bounds: Bounds) = bounds.HalfSize.X / halfDim

  let canvas =
    glcanvas "myCanvas" [
      WorldBounds worldBounds
      NoAlpha
      globalWithResolutionTime2d

      scene [
        SceneName "scene4"
        SceneWorldBounds gridWorld
        // WorldScale (calcScale viewport.Quadrant4)
        // SceneBounds viewport.Quadrant4
        WorldScale (calcScale viewport)
        SceneBounds viewport
        Layers 2
        DefaultLayer 0
        sharedObjectWithCamera2d
        orthoCam2d [
          CameraName $"gridCam"
          CameraBackground <| vec4 0.0 0.4 0.4 0.1
          cameraClearDepthBuffer
        ]
      ]
    ]

  let scene4 = canvas |> GlCanvas.getScene "scene4"
  let renderer = GlRenderer()
  let vec = renderer.Vector2D(scene4, vec2 1.0 0.0);
  vec.AngleDegreesZ <- 0.0<deg>
  vec.LineWidth <- scene4 |> GlScene.pixelsToWorld 10.0<px>
  vec.StrokeColor <- vec4 0.0 0.0 1.0 1.4
  vec.FillColor <- vec4 0.0 0.7 0.0 0.1
  vec.Position2 <- vec2 -0.0 0.5
  vec.AliasWidth <- 2.0<px>

  let grid = renderer.Grid2D(scene4, gridWorld.Size, 1, "grid")

  let mutable frame = 0

  let update time =
    GlCanvas.dirty canvas
    // vec.AngleZ <- sin(fract(time * 3.123 * 0.1)) * (Math.PI * 2.0) |> radians
    vec.Vector <- vec.Vector.Rotate(1.0<deg> |> toRadians);
    frame <- frame + 1
    // if frame % 10 = 0 then
    ()

  ("Vector", canvas, update, true, 60 * 120)

let runTests() =
  // run testGridObject
  // run testParallax
  // run testLink
  // run testLine
  // run testLinePath
  // run testLinePathAligned
  // run testNoise
  run testVector

if star.complete then
  runTests()
else
  star.onload <- fun _ -> runTests()
