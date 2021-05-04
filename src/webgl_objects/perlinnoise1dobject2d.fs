namespace Wil.Webgl

open Wil.Core
open Wil.Core.Utils
open Wil.Js
open Wil.Twod
open WebglObject
open Wil.Webgl
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open Wil.Webgl.Props
open GlCapability
open System

module private Shaders =
  """
uniform noise1dParams {
  vec2 size;
  float start;
  float noiseRange;
};"""
  |> addShaderInclude "noise1d-params"

  let private perlinNoise1d2dVertex = """#version 300 es
// PerlinNoise1dObject2D
#include precision
#include noise1d-params
#include path-params
#include noise-outvars
#include path-outvars
#include coordinate-conversion-vertex
#include quad-points-strip
#line 34

void main() {
  int vertexID = gl_VertexID % 4;
  vec2 position = quadPointsStrip[vertexID] * size;

  vec2 centerLeft = vec2(-0.5, 0.0) * size;
  vec2 centerLeftS = modelToScreen(centerLeft);
  vec2 centerRight = vec2(0.5, 0.0) * size;
  vec2 centerRightS = modelToScreen(centerRight);

  gl_Position = modelToClip(position);
  v_noiseStart = vec4(start);
  v_noiseRange = noiseRange;
  v_noiseDim = vec3(size, 0.0);
  v_noiseCenterLeft = centerLeftS;
  v_noiseCenterRight = centerRightS;
  v_fillColor = fillColor;
  v_strokeColor = strokeColor;
  v_strokeWidth = lineWidth;
}"""

  let private perlinNoise1d2dFragment = """#version 300 es
// PerlinNoise1dObject2D
#include precision
#include noise-fractal-params
#include noise-invars
#include path-invars
#include out-color-fragment
#include conditionals
#include vec2
#include line-utils
#include perlin-noise
#line 66

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 a = v_noiseCenterLeft;
  vec2 b = v_noiseCenterRight;
  vec2 ab = b - a;
  vec2 r = normalize(ab);
  vec2 up = perp(r);
  vec2 ap = p - a;
  float noiseScale = v_noiseDim.x / length(ab);
  // float x = v_noiseStart.x + dot(ap, r) * noiseScale;
  // float n = noise(x) * v_noiseRange;
  vec2 coord = vec2(v_noiseStart.x + dot(ap, r) * noiseScale, noiseTime);
  float n = noise(coord) * v_noiseRange;
  float yDist = distToLine(p, up, a);
  vec4 color = abs(n - yDist) <= v_strokeWidth ? v_strokeColor : v_fillColor;

  if (abs(cross(ap, up)) <= 1.0) color = vec4(0.0, 0.0, 1.0, 1.0);

	glFragColor = color;
}"""

  let perlinNoise1d2dVertexKey = "perlinNoise1d2dVertex"
  let perlinNoise1d2dFragmentKey = "perlinNoise1d2dFragment"
  addVertexShaderSource perlinNoise1d2dVertexKey perlinNoise1d2dVertex
  addFragmentShaderSource perlinNoise1d2dFragmentKey perlinNoise1d2dFragment
  // printfn $"{getFragmentShaderSource perlinNoise1d2dFragmentKey}"

type PerlinNoise1DObject2D(config: GlCanvasParams, scene: GlSceneData, size: Vec2, ?seed, ?layer, ?name, ?linkTo, ?parallaxCam: string, ?parallaxDistance) as o =
  inherit WebglObject(scene,
    globject Shaders.perlinNoise1d2dVertexKey Shaders.perlinNoise1d2dFragmentKey [
    // globject "fullSizeVertex2d" Shaders.perlinNoise1d2dFragmentKey [
      ObjectName (defaultArg name "")
      ObjectLink (defaultArg linkTo "")
      ParallaxCamera (defaultArg parallaxCam "")
      ParallaxDistance (defaultArg parallaxDistance 1.0)
      Layer (defaultArg layer scene.DefaultLayer)
      VertexCount 4
      DrawPrimitive GlDrawPrimitive.TRIANGLE_STRIP

      PerlinCommon.permTexture <| defaultArg seed 0
      PerlinCommon.noiseFractalParams
      pathParams config scene

      ubo "noise1dParams" [
        u "size" [ Value size.Values ]
        u "start" [ Value 0.0 ]
        u "noiseRange" [ Value 10.0 ]
      ]
    ]
  )

  let uniforms = Map(o.ObjectDef |> GlCommon.allUniforms |> Seq.map (fun u -> (u.Name, u)))
  let getInt = getInt uniforms
  let setInt = setInt uniforms
  let getFloat = getFloat uniforms
  let setFloat = setFloat uniforms
  let getVec2 = getVec2 uniforms
  let setVec2 = setVec2 uniforms
  let getVec4 = getVec4 uniforms
  let setVec4 = setVec4 uniforms

  member _.Octaves
    with get() = getInt "octaves"
    and set(value) = setInt "octaves" value

  member _.Frequency
    with get() = (getVec4 "frequency").XY
    and set(value) = setVec4 "frequency" (Vec4.Create(value, 0.0, 0.0))

  member _.Amplitude
    with get() = getFloat "amplitude"
    and set(value) = setFloat "amplitude" value

  member _.Lacunarity
    with get() = getFloat "lacunarity"
    and set(value) = setFloat "lacunarity" value

  member _.Gain
    with get() = getFloat "gain"
    and set(value) = setFloat "gain" value

  member _.Time
    with get() = getFloat "noiseTime"
    and set(value) = setFloat "noiseTime" value

  member _.Range
    with get() = getFloat "noiseRange"
    and set(value) = setFloat "noiseRange" value

  member _.Start
    with get() = getFloat "start"
    and set(value) = setFloat "start" value

  member _.StrokeColor
    with get() = getVec4 "strokeColor"
    and set(value) = setVec4 "strokeColor" value

  member _.FillColor
    with get() = getVec4 "fillColor"
    and set(value) = setVec4 "fillColor" value

  member _.LineWidth
    with get() = (getFloat "lineWidth") / scene.LineWidthScale
    and set(value) = setFloat "lineWidth" (value * scene.LineWidthScale)
