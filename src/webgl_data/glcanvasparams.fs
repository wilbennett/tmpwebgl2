namespace Wil.Webgl

open Wil.Core
open Wil.Core.Utils

type LineCap =
| Butt = 0
| Round = 1
| Square = 2

type LineJoin =
| Round = 3
| Bevel = 4
| Miter = 5

type FillType =
| Stroke = 1
| Fill = 2
| Border = 3

type CanvasConfig = {
  LineWidth: float<px>
  MiterLimit: float<px>
  LineCap: LineCap
  LineJoin: LineJoin
  MiterFallback: LineJoin
  StrokeColor: Vec4
  FillColor: Vec4
  FillType: FillType
}

type GlCanvasParams() =
  let mutable config = {
    LineWidth = 1.0<px>
    MiterLimit = 10.0<px>
    LineCap = LineCap.Butt
    LineJoin = LineJoin.Bevel
    MiterFallback = LineJoin.Bevel
    StrokeColor = vec4 0.0 0.0 0.0 1.0
    FillColor = vec4 0.0 0.0 0.0 1.0
    FillType = FillType.Fill
  }

  member _.LineWidth
    with get() = config.LineWidth
    and set(value) = config <- { config with LineWidth = value }

  member _.MiterLimit
    with get() = config.MiterLimit
    and set(value: float<px>) = config <- { config with MiterLimit = value }

  member _.LineCap
    with get() = config.LineCap
    and set(value) = config <- { config with LineCap = value }

  member _.LineJoin
    with get() = config.LineJoin
    and set(value) = config <- { config with LineJoin = value }

  member _.MiterFallback
    with get() = config.MiterFallback
    and set(value) = config <- { config with MiterFallback = value }

  member _.StrokeColor
    with get() = config.StrokeColor.Clone()
    and set(value: Vec4) = config <- { config with StrokeColor = value.Clone() }

  member _.FillColor
    with get() = config.FillColor
    and set(value: Vec4) = config <- { config with FillColor = value.Clone() }

  member _.FillType
    with get() = config.FillType
    and set(value) = config <- { config with FillType = value }
