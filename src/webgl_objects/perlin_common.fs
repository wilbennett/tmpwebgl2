namespace Wil.Webgl

open System
open Wil.Core
open Wil.Webgl.Types
open Wil.Webgl.Data
open Wil.Webgl.Props

module PerlinCommon =
  let noiseFractalParams =
    Ubo <| glubo "noiseFractalParams" [
      u "octaves" [ Value 1 ]
      u "frequency" [ Value (Vec4.Create(1.0).Values) ]
      u "amplitude" [ Value 2.0 ]
      u "lacunarity" [ Value 1.0 ]
      u "gain" [ Value 0.5 ]
      u "noiseTime" [ Value 0.0 ]
    ]

  let permTexture seed =
    Texture <| gltexture [
      TextureWidth 256.0
      TextureHeight 1.0
      pixelDataUint8 (PerlinShared.createPerm seed)
      NoMipMap
      InternalFormat GlInternalColorFormat.R8
      Format GlColorFormat.RED
      WrapS GlWrapMode.REPEAT
      WrapT GlWrapMode.REPEAT
      MagFilter GlMagFilter.NEAREST
      MinFilter GlMinFilter.NEAREST
    ]

  let defaultColorMap index =
    let stops: ColorStop list = [
      (0.0, vec4 0.0 0.0 0.0 255.0)
      (1.0, vec4 255.0 255.0 255.0 255.0)
      // (0.0, vec4 255.0 0.0 0.0 255.0)
      // (1.0, vec4 55.0 0.0 55.0 255.0)
    ]
    GlPalette.create "colorMap" index 30 stops
