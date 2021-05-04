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
open Wil.Webgl.DataTypes
open Wil.Webgl.Props
open GlCapability
open System

module private Shaders =
  """
uniform noise2dParams {
  vec2 size;
  vec2 start;
};"""
  |> addShaderInclude "noise2d-params"

  let private perlinNoise2d2dVertex = """#version 300 es
// PerlinNoise1dObject2D
#include precision
#include noise2d-params
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
  vec2 centerTop = vec2(0.0, 0.5) * size;
  vec2 centerTopS = modelToScreen(centerTop);
  vec2 centerBottom = vec2(0.0, -0.5) * size;
  vec2 centerBottomS = modelToScreen(centerBottom);

  gl_Position = modelToClip(position);
  v_noiseStart = vec4(start, 0.0, 0.0);
  v_noiseDim = vec3(size, 0.0);
  v_noiseCenterLeft = centerLeftS;
  v_noiseCenterRight = centerRightS;
  v_noiseCenterTop = centerTopS;
  v_noiseCenterBottom = centerBottomS;
  v_fillColor = fillColor;
  v_strokeColor = strokeColor;
  v_strokeWidth = lineWidth;
}"""

  let private perlinNoise2d2dFragment = """#version 300 es
// PerlinNoise1dObject2D
#include precision
#include noise-fractal-params
#include noise-invars
#include path-invars
#include out-color-fragment
#include math-consts
#include conditionals
#include vec2
#include line-utils
#include perlin-noise
#line 73

uniform sampler2D colorMap;

vec3 marble(vec2 pos, vec3 col) {
  vec3 rgb = vec3(0.0);
  // float x = sin((pos.z + 3.0 * turbulence(pos, 0.0125)) * PI);
  float x = sin((pos.x + 3.0 * turbulence(pos * frequency.xy, 0.0125)) * PI);
  // x = sqrt(x + 1.0) * 0.7071;
  // rgb.g = 0.3 + 8.0 * x;
  // x = sqrt(x);
  // rgb.r = 0.3 + 0.6 * x;
  // rgb.b = 0.6 + 0.4 * x;
  rgb.g = col.g + 8.0 * x;
  x = sqrt(x);
  rgb.r = col.r + 0.6 * x;
  rgb.b = col.b + 0.4 * x;
  return rgb;
}

float marble(vec2 pos, float period, vec3 frequency, float pixelSize, float time) {
  float x = sin((pos.x + period * turbulence(vec3(pos, time) * frequency, pixelSize)) * PI);
  return x;
}

// https://lodev.org/cgtutor/randomnoise.html
float marble(vec2 pos, vec2 period, float twistStrength, float initialTurbulence, vec3 frequency, vec2 size, float time) {
  vec2 p = pos * period / size;
  float n = p.x + p.y + twistStrength * turbulence(vec3(pos, time) * frequency, size.x * 0.00001 * initialTurbulence);
  return abs(sin(n * PI));
}

float wood(vec2 pos, float rings, float twistStrength, float initialTurbulence, vec3 frequency, vec2 size, float time) {
  vec2 p = (pos - size * 0.5) / size;
  float n = sqrt(dot(p, p)) + twistStrength * turbulence(vec3(pos, time) * frequency, size.x * 0.00001 * initialTurbulence);
  return abs(sin(2.0 * rings * n * PI));
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 a = v_noiseCenterLeft;
  vec2 b = v_noiseCenterRight;
  vec2 c = v_noiseCenterBottom;
  vec2 d = v_noiseCenterTop;
  vec2 ab = b - a;
  vec2 cd = d - c;
  vec2 r = normalize(ab);
  vec2 up = perp(r);
  vec2 ap = p - a;
  float yDist = distToLine(p, up, a);
  vec2 noiseScale = vec2(v_noiseDim.x / length(ab), v_noiseDim.y / length(cd));
  float pixelSize = v_noiseDim.x * 0.00001;

  // vec2 coord = v_noiseStart.xy + vec2(dot(ap, r), dot(ap, up)) * noiseScale;
  // float n = (noise(coord) + 1.0) * 0.5;

  vec2 xy = v_noiseStart.xy + vec2(dot(ap, r), dot(ap, up)) * noiseScale;
  vec3 coord = vec3(xy, noiseTime);

  float n = (noise(coord) + 1.0) * 0.5; // [0.0, 1.0]
  vec2 cc = vec2(n, 0.0);
  vec4 color = texture(colorMap, cc);

  // float n = (_noise(coord * frequency.xyz) * amplitude + 1.0) * 0.5; // [0.0, 1.0]
  // vec2 cc = vec2(n, 0.0);
  // vec4 color = texture(colorMap, cc);

  // float n = turbulence(coord * frequency.xyz, pixelSize);
  // vec2 cc = vec2(n, 0.0);
  // vec4 color = texture(colorMap, cc);

  // float n = (noise(coord) + 1.0) * 0.5; // [0.0, 1.0]
  // vec4 color = vec4(vec3(n), 1.0);

  // float n = (noise(coord) + 1.0) * 0.5; // [0.0, 1.0]
  // vec4 color = mix(vec4(1.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 1.0, 1.0), n);

  // float n = (_noise(coord * frequency.xyz) + 1.0) * 0.5; // [0.0, 1.0]
  // n *= 3.0;
  // n = n - floor(n);
  // vec2 cc = vec2(n, 0.0);
  // vec4 color = texture(colorMap, cc);

  // vec3 rgb = marble(xy, vec3(0.5, 0.5, 0.5));
  // vec4 color = vec4(rgb, 1.0);

  // float t = marble(xy * frequency.xy, 8.0, frequency.xyz, pixelSize, noiseTime);
  // t = (t + 1.0) * 0.5;
  // vec2 cc = vec2(t, 0.0);
  // vec4 color = texture(colorMap, cc);

  // vec2 m = sin(xy + turbulence(xy * frequency.xy, pixelSize) * xy.x);
  // float t = m.x + m.y;
  // vec4 color = vec4(vec3(t), 1.0);

  // float t = marble(xy * frequency.xy, vec2(0.0, 1.0), 5.0, 16.0, frequency.xy, v_noiseDim.xy, noiseTime) * amplitude;
  // float t = marble(xy, vec2(5.0, 10.0), 1.2, 8.0, frequency.xyz, v_noiseDim.xy, noiseTime) * amplitude;
  // t = (t + 1.0) * 0.5;
  // vec4 color = vec4(vec3(t), 1.0);

  // float t = (sin((_noise(xy * frequency.xy) * 70.0) * 2.0 * PI / 15.0) + 1.0) / 2.0 * amplitude;
  // t = (t + 1.0) * 0.5;
  // vec4 color = vec4(vec3(t), 1.0);

  // float t = wood(xy, 8.0, 0.07, 16.0, frequency.xyz, v_noiseDim.xy, noiseTime) * amplitude;
  // t = (t + 1.0) * 0.5;
  // vec4 color = vec4(vec3(t), 1.0);
  // color = vec4(vec3(0.6 * t, 0.45 * t, 0.27), 1.0);

  // t = noise(xy);
  // t = (t + 1.0) * 0.5;
  // vec4 color = vec4(vec3(t), 1.0);

  // float t = turbulence1(xy * frequency.xy, pixelSize, v_noiseDim.x) * amplitude;
  // vec4 color = vec4(vec3(t), 1.0);

  // float t = turbulence(xy * frequency.xy, 0.0125) * amplitude;
  // float t = turbulence(coord * frequency.xyz, pixelSize) * amplitude;
  // vec4 color = vec4(vec3(t), 1.0);

  if (abs(cross(ap, up)) <= 1.0) color = vec4(0.0, 0.0, 1.0, 1.0);

	glFragColor = color;
}"""

  let perlinNoise2d2dVertexKey = "perlinNoise2d2dVertex"
  let perlinNoise2d2dFragmentKey = "perlinNoise2d2dFragment"
  addVertexShaderSource perlinNoise2d2dVertexKey perlinNoise2d2dVertex
  addFragmentShaderSource perlinNoise2d2dFragmentKey perlinNoise2d2dFragment
  // printfn $"{getFragmentShaderSource perlinNoise2d2dFragmentKey}"

type PerlinNoise2DObject2D(config: GlCanvasParams, scene: GlSceneData, size: Vec2, ?seed, ?layer, ?name, ?linkTo, ?parallaxCam: string, ?parallaxDistance) as o =
  inherit WebglObject(scene,
    globject Shaders.perlinNoise2d2dVertexKey Shaders.perlinNoise2d2dFragmentKey [
    // globject "fullSizeVertex2d" Shaders.perlinNoise2d2dFragmentKey [
      ObjectName (defaultArg name "")
      ObjectLink (defaultArg linkTo "")
      ParallaxCamera (defaultArg parallaxCam "")
      ParallaxDistance (defaultArg parallaxDistance 1.0)
      Layer (defaultArg layer scene.DefaultLayer)
      VertexCount 4
      DrawPrimitive GlDrawPrimitive.TRIANGLE_STRIP

      PerlinCommon.permTexture <| defaultArg seed 0
      PerlinCommon.defaultColorMap 1
      PerlinCommon.noiseFractalParams
      pathParams config scene

      uniform "permTexture" [ Value 0 ]
      uniform "colorMap" [ Value 1 ]

      ubo "noise2dParams" [
        u "size" [ Value size.Values ]
        u "start" [ Value (vec2 0.0 0.0).Values ]
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
    with get() = (getVec4 "frequency").XYZ
    and set(value) = setVec4 "frequency" (Vec4.Create(value, 0.0))

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

  member _.Start
    with get() = getVec2 "start"
    and set(value) = setVec2 "start" value

  member _.StrokeColor
    with get() = getVec4 "strokeColor"
    and set(value) = setVec4 "strokeColor" value

  member _.FillColor
    with get() = getVec4 "fillColor"
    and set(value) = setVec4 "fillColor" value

  member _.LineWidth
    with get() = (getFloat "lineWidth") / scene.LineWidthScale
    and set(value) = setFloat "lineWidth" (value * scene.LineWidthScale)

  member _.ColorMap
    with get() =
      let uColorMap = o.ObjectDef |> GlObj.getTexture "colorMap"
      let arr =
        match uColorMap.Pixels with
        | PixelData a -> a
        | _ -> throw "Unexpected colorMap pixels type!"
      (box arr) :?> byte[]
    and set(value) =
      let uColorMap = o.ObjectDef |> GlObj.getTexture "colorMap"
      uColorMap |> GlTexture.setPixelData 1 value
