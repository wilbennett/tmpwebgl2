namespace Wil.Webgl

open Wil.Core
open WebglObject
open Wil.Webgl
open Wil.Webgl.Core
open Wil.Webgl.Types
open Wil.Webgl.Data
open Wil.Webgl.Props
open GlCapability

module private Shaders =
  """
uniform line2dParams {
  vec2 p1;
  vec2 p2;
  vec4 strokeColor;
  float lineWidth;
  int lineCap;
};"""
  |> addShaderInclude "line2d-params"

  let line2dVertex = """#version 300 es
// LineObjects2D
#include precision
#include line2d-params
#include path-outvars
#include circle-outvars
// #include lines2d-vertex
// #include lines2d2-vertex
#include lines2d3-vertex
#line 28

void main() {
  vec2 position = line2d(p1, p2, lineWidth, lineCap, gl_VertexID, v_isSemicircle, v_circleCenter, v_radiusDirection);

  gl_Position = modelToClip(position);
  v_fillColor = strokeColor;

  // if (gl_VertexID % 6 >= 3) v_fillColor = 1.0 - v_fillColor;
  // if (gl_VertexID % 4 == 0) v_fillColor = vec4(vec3(1.0 - v_fillColor.rgb), v_fillColor.a);
}"""

  let line2dVertexKey = "line2dVertex"
  addVertexShaderSource line2dVertexKey line2dVertex

type LineObjects2D(config: GlCanvasParams, scene: GlSceneData, p1: Vec2, p2: Vec2, ?layer, ?name, ?linkTo, ?parallaxCam: string, ?parallaxDistance) as o =
  inherit WebglObject(scene,
    globject Shaders.line2dVertexKey "semicircleFragment2d" [
    // globject Shaders.line2dVertexKey "semicircleDiscardFragment2d" [
      ObjectName (defaultArg name "")
      ObjectLink (defaultArg linkTo "")
      ParallaxCamera (defaultArg parallaxCam "")
      ParallaxDistance (defaultArg parallaxDistance 1.0)
      Layer (defaultArg layer scene.DefaultLayer)
      // VertexCount 18
      // VertexCount 10
      VertexCount 8
      DrawPrimitive GlDrawPrimitive.TRIANGLE_STRIP
      blendFunc GlBlendFactor.ONE GlBlendFactor.ONE_MINUS_SRC_ALPHA
      ubo "line2dParams" [
        u "p1" [ Value p1.Values ]
        u "p2" [ Value p2.Values ]
        u "strokeColor" [ Value (config.StrokeColor).Values ]
        u "lineWidth" [ Value (GlScene.pixelsToWorld config.LineWidth scene) ]
        u "lineCap" [ Value (config.LineCap) ]
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

  member _.P1
    with get() = getVec2 "p1"
    and set(value) = setVec2 "p1" value

  member _.P2
    with get() = getVec2 "p2"
    and set(value) = setVec2 "p2" value

  member _.StrokeColor
    with get() = getVec4 "strokeColor"
    and set(value) = setVec4 "strokeColor" value

  member _.LineWidth
    with get() = getFloat "lineWidth"
    and set(value) = setFloat "lineWidth" value

  member _.LineCap
    with get() = getInt "lineCap" |> enum<LineCap>
    and set(value: LineCap) = setInt "lineCap" (int value)
