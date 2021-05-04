namespace Wil.Webgl

open Wil.Core
open Wil.Webgl
open Wil.Webgl.Core
open Wil.Webgl.Data
open Wil.Webgl.Props
open WebglObject

module private Shaders =
  let gridUbo = """
uniform grid {
  vec4 minorLineColor;
  vec4 majorLineColor;
  vec4 axisLineColor;
  float minorLineWidth;
  float majorLineWidth;
  float axisLineWidth;
  vec2 size;
  vec2 minorTick;
  ivec2 majorTick;
};
"""

  let grid2dVertex = """#version 300 es
// Grid2D
#include precision
#include grid-ubo
#include path-outvars
#include lines2d-vertex
#line 30
// x, y: point a.  z, w: point b.
const vec4 edgeTemplate[] = vec4[2](
  vec4(0.0, -0.5, 0.0, 0.5), // Vertical
  vec4(-0.5, 0.0, 0.5, 0.0)  // Horizontal
);

const vec2 offsetTemplate[] = vec2[2](
  vec2(1.0, 0.0), // Vertical
  vec2(0.0, 1.0)  // Horizontal
);

float priorEvenFloat(float f) {
  int x = int(floor(f));
  return mix(float(x), float(x) - 1.0, float(x % 2));
}

vec2 priorEven(vec2 v) { return vec2(priorEvenFloat(v.x), priorEvenFloat(v.y)); }

float fmod(float a, float b) {
  float res = abs(a / b);
  return ceil(res) - res;
}

void main() {
  vec2 majorValue = minorTick * vec2(majorTick);
  vec2 esize = priorEven(size);
  ivec2 halfTicks = ivec2(esize * 0.5 / minorTick);
  ivec2 minorTickCount = halfTicks * 2 + 1;
  int instanceCount = minorTickCount.x + minorTickCount.y;
  ivec2 majorOffset = majorTick - (halfTicks % majorTick);
  vec2 start = -vec2(halfTicks) * minorTick;
  int edgeID = int(step(float(minorTickCount.x), float(gl_InstanceID)));
  vec4 edge = edgeTemplate[edgeID];
  vec2 ofs = offsetTemplate[edgeID];

  vec2 a = edge.xy * size;
  vec2 b = edge.zw * size;

  int vertexID = gl_VertexID % 6;
  ivec2 colRow = ivec2(gl_InstanceID % minorTickCount.x);
  colRow.y = gl_InstanceID - minorTickCount.x;
  vec2 center = start + vec2(colRow) * vec2(minorTick);
  center *= ofs;

  ivec2 isMajorv = (colRow + majorOffset) % majorTick;
  isMajorv = ivec2(vec2(float(isMajorv.x == 0), float(isMajorv.y == 0)));
  float isMajor = float(isMajorv.x) * ofs.x + float(isMajorv.y) * ofs.y;
  vec2 isAxisv = vec2(float(colRow.x == halfTicks.x), float(colRow.y == halfTicks.y));
  float isAxis = isAxisv.x * ofs.x + isAxisv.y * ofs.y;

  float width = mix(minorLineWidth, majorLineWidth, isMajor);
  width = mix(width, axisLineWidth, isAxis);
  vec4 color = mix(minorLineColor, majorLineColor, isMajor);
  color = mix(color, axisLineColor, isAxis);

  vec2 direction = b - a;
  vec2 leftNormal = normalize(perp(direction));
  vec2 vertex = line2d(a, direction, leftNormal, width, vertexID);
  vertex += center;
  vec4 position = vec4(vertex, 0.0, 1.0);

  position = projMat * viewMat * modelMat * position;

  gl_Position = position;
  v_fillColor = color;
}"""

  let grid2dVertexKey = "grid2dVertex"
  addShaderInclude "grid-ubo" gridUbo
  addVertexShaderSource grid2dVertexKey grid2dVertex

module private VecUtils =
  let priorEven (v: Vec2) =
    let priorEvenFloat value =
      let x = floor value |> int
      if x % 2 = 0 then float x else float x - 1.0

    v.WithXYM(priorEvenFloat v.X, priorEvenFloat v.Y)
    v

type Grid2D(config: GlCanvasParams, scene: GlSceneData, size: Vec2, ?layer, ?name, ?linkTo, ?parallaxCam: string, ?parallaxDistance) as o =
  inherit WebglObject(scene,
    globject Shaders.grid2dVertexKey "simpleFragment2d" [
      ObjectName (defaultArg name "")
      ObjectLink (defaultArg linkTo "")
      ParallaxCamera (defaultArg parallaxCam "")
      ParallaxDistance (defaultArg parallaxDistance 1.0)
      Layer (defaultArg layer scene.DefaultLayer)
      VertexCount 6
      InstanceCount 1
      ubo "grid" [
        u "minorLineColor" [ Value config.StrokeColor.Values ]
        u "majorLineColor" [ Value config.StrokeColor.Values ]
        u "axisLineColor" [ Value config.StrokeColor.Values ]
        u "minorLineWidth" [ Value (pixelsToWorld (config.LineWidth * 0.8) scene) ]
        u "majorLineWidth" [ Value (pixelsToWorld (config.LineWidth * 1.5) scene) ]
        u "axisLineWidth" [ Value (pixelsToWorld (config.LineWidth * 3.0) scene) ]
        u "size" [ Value (size.Clone().Values) ]
        u "minorTick" [ Value [| 1.0; 1.0 |] ]
        u "majorTick" [ Value [| 10; 10 |] ]
      ]
    ]
  )

  let uniforms = Map(o.ObjectDef |> GlCommon.allUniforms |> Seq.map (fun u -> (u.Name, u)))

  let calcInstanceCount () =
    let size = VecUtils.priorEven (getVec2 uniforms "size")
    let minorTicks = getVec2 uniforms "minorTick"
    let minorTickCount = size * 0.5 / minorTicks * 2.0 + 1.0
    minorTickCount.X + minorTickCount.Y |> int

  let updateInstanceCount () = o.ObjectDef |> GlObj.setInstanceCount (calcInstanceCount())

  do updateInstanceCount()

  member _.MinorLineColor
    with get() = getVec4 uniforms "minorLineColor"
    and set(value) = setVec4 uniforms "minorLineColor" value

  member _.MajorLineColor
    with get() = getVec4 uniforms "majorLineColor"
    and set(value) = setVec4 uniforms "majorLineColor" value

  member _.AxisLineColor
    with get() = getVec4 uniforms "axisLineColor"
    and set(value) = setVec4 uniforms "axisLineColor" value

  member _.MinorLineWidth
    with get() = getFloat uniforms "minorLineWidth"
    and set(value) = setFloat uniforms "minorLineWidth" value

  member _.MajorLineWidth
    with get() = getFloat uniforms "majorLineWidth"
    and set(value) = setFloat uniforms "majorLineWidth" value

  member _.AxisLineWidth
    with get() = getFloat uniforms "axisLineWidth"
    and set(value) = setFloat uniforms "axisLineWidth" value

  member _.Size
    with get() = getVec2 uniforms "size"
    and set(value) =
      setVec2 uniforms "size" value
      updateInstanceCount()

  member _.MinorTick
    with get() = (getVec2 uniforms "minorTick").X
    and set(value: float) =
      setVec2 uniforms "minorTick" (Vec2.Create(float value))
      updateInstanceCount()

  member _.MajorTick
    with get() = (getVec2 uniforms "majorTick").X |> int
    and set(value: int) = setVec2 uniforms "majorTick" (Vec2.Create(float value))
