namespace Wil.Twod

open Wil.Core
open Wil.Core.Vec2

type Bounds(center, halfSize) as b =
  static member Create(x, y, w, h) = Bounds(vec2 x y, vec2 (w * 0.5) (h * 0.5))
  member _.Center with get() = center.Clone()
  member _.HalfSize with get() = halfSize.Clone()

  member _.Values with get() =
    let m: Vec2 = b.Min
    [| m.X; m.Y; b.HalfSize.X * 2.0; b.HalfSize.Y * 2.0 |]

  member _.RectValues with get() =
    let mn: Vec2 = b.Min
    let mx: Vec2 = b.Max
    [| mn.X; mn.Y; mx.X; mx.Y |]

  member _.Size = b.HalfSize.Scale(2.0)
  member _.Min = b.Center.Sub(b.HalfSize)
  member _.Max = b.Center.Add(b.HalfSize)
  member _.Left = b.Center.X - b.HalfSize.X
  member _.Right = b.Center.X + b.HalfSize.X

  member _.Anchor = b.Min
  member _.X = b.Min.X
  member _.Y = b.Min.Y
  member _.Width = b.HalfSize.X * 2.0
  member _.Height = b.HalfSize.Y * 2.0
  member _.W = b.HalfSize.X * 2.0
  member _.H = b.HalfSize.Y * 2.0
  member _.CenterX = b.Center.X
  member _.CenterY = b.Center.Y

  member _.MaxRight = b.Center + b.HalfSize
  member _.MaxCenter = vec2 b.Center.X (b.Center.Y + b.HalfSize.Y)
  member _.MaxLeft = vec2 (b.Center.X - b.HalfSize.X) (b.Center.Y + b.HalfSize.Y)
  member _.LeftCenter = vec2 (b.Center.X - b.HalfSize.X) b.Center.Y
  member _.MinLeft = b.Center - b.HalfSize
  member _.MinCenter = vec2 b.Center.X (b.Center.Y - b.HalfSize.Y)
  member _.MinRight = vec2 (b.Center.X + b.HalfSize.X) (b.Center.Y - b.HalfSize.Y)
  member _.RightCenter = vec2 (b.Center.X + b.HalfSize.X) b.Center.Y

  member _.Quadrant1 =
    let quarterSize = b.HalfSize * 0.5
    Bounds(b.Center + quarterSize, quarterSize)

  member _.Quadrant2 =
    let quarterSize = b.HalfSize * 0.5
    Bounds(b.Center + (vec2 -quarterSize.X quarterSize.Y), quarterSize)

  member _.Quadrant3 =
    let quarterSize = b.HalfSize * 0.5
    Bounds(b.Center - quarterSize, quarterSize)

  member _.Quadrant4 =
    let quarterSize = b.HalfSize * 0.5
    Bounds(b.Center + (vec2 quarterSize.X -quarterSize.Y), quarterSize)

  member _.Clone() = Bounds(b.Center.Clone(), b.HalfSize.Clone())

  member _.WithCenter(value) = Bounds(value, b.HalfSize.Clone())
  member _.WithCenterM(value) = b.Center.WithXYM(value)

  member _.WithAnchor(value: Vec2) = Bounds(value.Add(b.HalfSize), b.HalfSize.Clone())
  member _.WithAnchor(x, y) = b.WithAnchor(vec2 x y)
  member _.WithAnchorM(value: Vec2) = b.Center.CopyFrom(value.Add(b.HalfSize))
  member _.WithAnchorM(x, y) = b.WithAnchor(vec2 x y) |> ignore

  member _.WithWidth(w) = Bounds(b.Center.Clone(), vec2 w b.Height)
  member _.WithWidthM(w) = b.HalfSize.WithXM(w * 0.5)
  member _.WithHeight(h) = Bounds(b.Center.Clone(), vec2 b.Width h)
  member _.WithHeightM(h) = b.HalfSize.WithYM(h * 0.5)

  member _.WithSize(value: Vec2) = Bounds(b.Center.Clone(), value.Scale(0.5))
  member _.WithSize(x, y) = Bounds(b.Center.Clone(), vec2 (x * 0.5) (y * 0.5))
  member _.WithSize(s) = let hs = s * 0.5 in Bounds(b.Center.Clone(), vec2 hs hs)
  member _.WithSizeM(value: Vec2) = value.Scale(0.5, b.HalfSize) |> ignore
  member _.WithSizeM(x, y) = b.HalfSize.WithXY(x * 0.5, y * 0.5) |> ignore
  member _.WithSizeM(s) = let hs = s * 0.5 in b.HalfSize.WithXY(hs, hs) |> ignore

  member _.WithHalfSize(value: Vec2) = Bounds(b.Center.Clone(), value)
  member _.WithHalfSize(x, y) = b.WithHalfSize(vec2 x y)
  member _.WithHalfSize(s) = b.WithHalfSize(vec2 s s)
  member _.WithHalfSizeM(value: Vec2) = b.HalfSize.CopyFrom(value)
  member _.WithHalfSizeM(x, y) = b.HalfSize.WithXY(x, y) |> ignore
  member _.WithHalfSizeM(s) = b.HalfSize.WithXY(s, s) |> ignore

  member _.Inflate(value: Vec2) = Bounds(b.Center.Clone(), b.HalfSize.Add(value))
  member _.Inflate(x, y) = b.Inflate(vec2 x y)
  member _.Inflate(s) = b.Inflate(vec2 s s)
  member _.InflateM(value: Vec2) = let hs = b.HalfSize in hs.WithXY(hs.X + value.X, hs.Y + value.Y) |> ignore
  member _.InflateM(x, y) = let hs = b.HalfSize in hs.WithXY(hs.X + x, hs.Y + y) |> ignore
  member _.InflateM(s) = let hs = b.HalfSize in hs.WithXY(hs.X + s, hs.Y + s) |> ignore

  member _.InflatePct(value: Vec2) = Bounds(b.Center.Clone(), b.HalfSize.Mult(value))
  member _.InflatePct(x, y) = b.InflatePct(vec2 x y)
  member _.InflatePct(p) = b.InflatePct(vec2 p p)
  member _.InflatePctM(value: Vec2) = let hs = b.HalfSize in hs.WithXY(hs.X * value.X, hs.Y * value.Y) |> ignore
  member _.InflatePctM(x, y) = let hs = b.HalfSize in hs.WithXY(hs.X * x, hs.Y * y) |> ignore
  member _.InflatePctM(p) = let hs = b.HalfSize in hs.WithXY(hs.X * p, hs.Y * p) |> ignore

  member inline _.OptionalBounds(value) = value |> Option.calcDef (fun () -> Bounds.Create(0.0, 0.0, 0.0, 0.0))

  member _.MaxWith(other: Bounds, ?result: Bounds) =
    let result = b.OptionalBounds result
    result.HalfSize.X <- max b.HalfSize.X other.HalfSize.X
    result.HalfSize.Y <- max b.HalfSize.Y other.HalfSize.Y
    result

  member _.MaxWithM(other: Bounds) = b.MaxWith(other, b) |> ignore

  member _.MinWith(other: Bounds, ?result: Bounds) =
    let result = b.OptionalBounds result
    result.HalfSize.X <- min b.HalfSize.X other.HalfSize.X
    result.HalfSize.Y <- min b.HalfSize.Y other.HalfSize.Y
    result

  member _.MinWithM(other: Bounds) = b.MinWith(other, b) |> ignore

  member _.Clamp(other: Bounds, ?result: Bounds) =
    let result = b.OptionalBounds result
    b.MinWith(other, result) |> ignore

    let bmin = result.Min
    let omin = other.Min

    if bmin.X < omin.X then result.Center.X <- omin.X + result.HalfSize.X
    if bmin.Y < omin.Y then result.Center.Y <- omin.Y + result.HalfSize.Y

    let bmax = result.Max
    let omax = other.Max

    if bmax.X > omax.X then result.Center.X <- omax.X - result.HalfSize.X
    if bmax.Y > omax.Y then result.Center.Y <- omax.Y - result.HalfSize.Y

    result

  member _.ClampM(other: Bounds) = b.Clamp(other, b) |> ignore

  member _.ClampVec(v: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    let mn = b.Min
    let mx = b.Max
    result.X <- min (max v.X mn.X) mx.X
    result.Y <- min (max v.Y mn.Y) mx.Y
    result

  member _.Contains(point: Vec2) =
    let min = b.Min
    let max = b.Max

    (point.X >= min.X)
    && (point.X <= max.X)
    && (point.Y >= min.Y)
    && (point.Y <= max.Y)

  member _.IntersectsWith(other: Bounds) =
    let min = b.Min
    let max = b.Max
    let otherMin = other.Min
    let otherMax = other.Max

    (min.X <= otherMax.X)
    && (max.X >= otherMin.X)
    && (min.Y <= otherMax.Y)
    && (max.Y >= otherMin.Y)

  override b.ToString() = sprintf "%A -> %A" b.Min b.Max

  static member Zero = Bounds(vec2 0.0 0.0, vec2 0.0 0.0)

[<AutoOpen>]
module BoundsPatterns =
  let (|BoundsRect|) (b: Bounds) =
    let anchor = b.Anchor
    let size = b.Size
    (anchor.X, anchor.Y, size.X, size.Y)

  let (|OptBoundsRect|) (b: Bounds option) =
    match b with
    | Some b ->
      let anchor = b.Anchor
      let size = b.Size
      (Some anchor.X, Some anchor.Y, Some size.X, Some size.Y)
    | None -> (None, None, None, None)

  let (|BoundsRange|) (b: Bounds) =
    let min = b.Min
    let max = b.Max
    (min.X, min.Y, max.X, max.Y)

  let (|OptBoundsRange|) (b: Bounds option) =
    match b with
    | Some b ->
      let min = b.Min
      let max = b.Max
      (Some min.X, Some min.Y, Some max.X, Some max.Y)
    | None -> (None, None, None, None)

  let (|BoundsDim|) (b: Bounds) = (b.Anchor, b.Size)

module Bounds =
  let inline calcCenter x y w h = vec2 (x + w * 0.5) (y + h * 0.5)

  let inline calcCenterV (anchor: Vec2) (size: Vec2) =
    vec2 (anchor.X + size.X * 0.5) (anchor.Y + size.Y * 0.5)

  let bounds x y w h =
    Bounds(calcCenter x y w h, vec2 (w * 0.5) (h * 0.5))

  let boundsV anchor size =
    Bounds(calcCenterV anchor size, size.Scale(0.5))

  let boundsSize w h = bounds 0.0 0.0 w h
  let boundsSizeV size = boundsV (vec2 0.0 0.0) size

  let boundsCenter cx cy w h =
    Bounds(vec2 cx cy, vec2 (w * 0.5) (h * 0.5))

  let boundsCenterV center (size: Vec2) = Bounds(center, size.Scale(0.5))
  let boundsCenterHalf cx cy hw hh = Bounds(vec2 cx cy, vec2 hw hh)
  let boundsCenterHalfV center halfSize = Bounds(center, halfSize)
