namespace Wil.Webgl

open Wil.Core
open Wil.Webgl.Types
open Wil.Webgl.Data
open Wil.Webgl.Props

type ColorStop = float * Vec4

type ColorStopData = {
  StartPct: float
  EndPct: float
  StartColor: Vec4
  EndColor: Vec4
  StartIndex: int
  EndIndex: int
}

module GlPalette =
  let normalizeStops (stops: ColorStop list) =
    let (firstPct, firstColor) = List.head stops
    let (lastPct, lastColor) = List.last stops

    let res =
      if firstPct = 0.0 then
        stops
      else
        let h = (0.0, firstColor)
        h :: stops

    if lastPct = 1.0 then
      res
    else
      let t = (1.0, lastColor)
      res @ [ t ]

  let calcStopData count (s1: ColorStop, s2: ColorStop) =
    let countMinus1 = float count - 1.0

    { StartPct = fst s1
      EndPct = fst s2
      StartColor = snd s1
      EndColor = snd s2
      StartIndex = countMinus1 * (fst s1) |> round |> int
      EndIndex = countMinus1 * (fst s2) |> round |> int }

  let createPaletteData count stops =
    let rec loop startColor endColor count index remain (acc: byte []) =
      if remain < 0 then
        acc
      else
        let t = float remain / float count
        let color = Vec.lerp4 startColor endColor t
        acc.[index - 0] <- byte(color.W)
        acc.[index - 1] <- byte(color.Z)
        acc.[index - 2] <- byte(color.Y)
        acc.[index - 3] <- byte(color.X)
        loop startColor endColor count (index - 4) (remain - 1) acc

    let processData d a =
      let count = d.EndIndex - d.StartIndex
      let startIndex = (d.EndIndex + 1) * 4 - 1
      loop d.StartColor d.EndColor count startIndex count a

    let stopData =
      stops
      |> normalizeStops
      |> List.pairwise
      |> List.map (calcStopData count)

    let acc = Array.zeroCreate<byte> (count * 4)
    List.foldBack processData stopData acc

  let create name index count stops =
    Texture <| gltexture [
      TextureName name
      TextureIndex index
      TextureWidth (count |> float)
      TextureHeight 1.0
      pixelDataUint8 (createPaletteData count stops)
      NoMipMap
      InternalFormat GlInternalColorFormat.RGBA
      Format GlColorFormat.RGBA
      WrapS GlWrapMode.CLAMP_TO_EDGE
      WrapT GlWrapMode.CLAMP_TO_EDGE
      MagFilter GlMagFilter.NEAREST
      MinFilter GlMinFilter.NEAREST
    ]
