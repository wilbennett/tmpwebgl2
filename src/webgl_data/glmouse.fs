namespace Wil.Webgl.Data

open Browser.Types
open Browser.Dom
open Wil.Core
open Wil.Browser.Types

type GlMouse(canvas: HTMLCanvasElement) as m =
  let leftButton = 0
  let rightButton = 2

  let buttonPressed = [| false; false; false |]
  let buttonDownEvent = [| false; false; false |]
  let buttonUpEvent = [| false; false; false |]
  let buttonLast = [| false; false; false |]

  let mutable wheelEvent = false
  let mutable wheelEventLast = false
  let mutable wheelDelta = Vec2.Create()

  let position = Vec2.Create()
  let lastPosition = Vec2.Create()
  let positionDelta = Vec2.Create()
  let mutable moveEvent = false

  let dragOrigin = [| Vec2.Create(); Vec2.Create(); Vec2.Create() |]
  let dragOriginDelta = [| Vec2.Create(); Vec2.Create(); Vec2.Create() |]
  let mutable dragPending = [| false; false; false |]
  let mutable dragging = [| false; false; false |]
  let mutable dragStartEvent = [| false; false; false |]
  let mutable dragEvent = [| false; false; false |]
  let mutable dragEndEvent = [| false; false; false |]

  let changes = Event<_>()

  let handleContextMenu (event: Event) =
    event.preventDefault()
    false

  let handleMouseMove (event: Event) =
    let event = event :?> MouseEvent
    let rect = getClientRect canvas
    let mx = (event.clientX - rect.x) * (canvas.width / rect.width) |> round
    let my = (event.clientY - rect.y) * (canvas.height / rect.height) |> round

    if mx >= 0.0 && mx < rect.width && my >= 0.0 && my < rect.height then
      position.WithXYM(mx, canvas.height - 1.0 - my)
      changes.Trigger()
      true
    else
      false

  let handleMouseDown (event: Event) =
    if handleMouseMove event then
      let event = event :?> MouseEvent
      buttonPressed.[int event.button] <- true
      if int event.button = rightButton then event.preventDefault()
      changes.Trigger()

  let handleMouseUp (event: Event) =
    handleMouseMove event |> ignore
    let event = event :?> MouseEvent
    buttonPressed.[int event.button] <- false
    if int event.button = rightButton then event.preventDefault()
    changes.Trigger()

  let handleMouseWheel (event: Event) =
    if handleMouseMove event then
      let event = event :?> WheelEvent
      wheelEvent <- true
      wheelDelta.WithXYM(event.deltaX, event.deltaY)
      event.preventDefault()
      changes.Trigger()

  do
    window.addEventListener("contextmenu", handleContextMenu >> ignore)
    window.addEventListener("mousemove", handleMouseMove >> ignore)
    window.addEventListener("mousedown", handleMouseDown >> ignore)
    window.addEventListener("mouseup", handleMouseUp >> ignore)
    let opts = { capture = None; once = None; passive = Some false }
    window.addEventListener("wheel", handleMouseWheel >> ignore, opts)

  member val DragTolerance = 5.0 with get, set
  member val Changed = changes.Publish

  member _.Position with get() = position.Clone()
  member _.LastPosition with get() = lastPosition.Clone()
  member _.PositionDelta with get() = positionDelta.Clone()
  member _.WheelDelta with get() = wheelDelta.Clone()

  member _.IsButtonPressed(button) = buttonPressed.[button]
  member _.IsButtonDownEvent(button) = buttonDownEvent.[button]
  member _.IsButtonUpEvent(button) = buttonUpEvent.[button]

  member _.DragOrigin(button) = dragOrigin.[button].Clone()
  member _.DragOriginDelta(button) = dragOriginDelta.[button].Clone()
  
  member _.IsWheelEvent with get() = wheelEvent
  member _.IsMoveEvent with get() = moveEvent
  member _.IsDragStartEvent(button) = dragStartEvent.[button]
  member _.IsDragEvent(button) = dragEvent.[button]
  member _.IsDragEndEvent(button) = dragEndEvent.[button]

  member _.Update() =
    moveEvent <- position.Values <> lastPosition.Values
    positionDelta.CopyFrom(position - lastPosition)
    lastPosition.CopyFrom(position)

    wheelEvent <- wheelEvent && not wheelEventLast
    wheelEventLast <- wheelEvent

    for button in [leftButton .. rightButton] do
      buttonDownEvent.[button] <- not buttonLast.[button] && buttonPressed.[button]
      buttonUpEvent.[button] <- buttonLast.[button] && not buttonPressed.[button]
      buttonLast.[button] <- buttonPressed.[button]

      dragEvent.[button] <- false
      dragStartEvent.[button] <- false
      dragEndEvent.[button] <- false

      if buttonUpEvent.[button] then
        dragEndEvent.[button] <- dragging.[button]
        dragPending.[button] <- false
        dragging.[button] <- false
  
      if buttonDownEvent.[button] then
        dragOrigin.[button].CopyFrom(position)
        dragPending.[button] <- true
        dragging.[button] <- false
  
      if buttonPressed.[button] && moveEvent then
        dragOriginDelta.[button].CopyFrom(position - dragOrigin.[button])

        if dragPending.[button] then
          if dragOriginDelta.[button].Mag > m.DragTolerance then
            dragPending.[button] <- false
            dragging.[button] <- true
            dragStartEvent.[button] <- true
            dragEvent.[button] <- true
        elif dragging.[button] then
          dragEvent.[button] <- true

module Mouse =
  let leftButton = 0
  let middleButton = 1
  let rightButton = 2
