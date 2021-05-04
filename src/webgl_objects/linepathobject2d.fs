namespace Wil.Webgl

open Wil.Core
open Wil.Core.Utils
open Wil.Js
open WebglObject
open Wil.Webgl
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open Wil.Webgl.Props
open GlCapability

module private Shaders =
  """
uniform linepathParams {
  vec4 strokeColor;
  float lineWidth;
  int lineCap;
  int lineJoin;
  float miterLimit;
  int miterFallback;
  int instanceCount;
};"""
  |> addShaderInclude "linepath-params"

  let linePath2dVertex = """#version 300 es
// LinePathObject2D
#include precision
#include linepath-params
#include path-outvars
#include circle-outvars
// #include lines2d-vertex
// #include lines2d2-vertex
// #include lines2d3-vertex
#include sdf-consts
#include sdf-line-outvars
#include lines2d4-vertex
#line 40

in vec2 priorA;
in vec2 a;
in vec2 b;
in vec2 c;

void main() {
  // vec3 position = linepath2d(a, b, c, lineWidth, lineCap, lineJoin, miterLimit, miterFallback, gl_InstanceID, instanceCount, gl_VertexID, v_isCircle, v_circleCenter, v_radiusDirection);
  vec2 position = linepath2d(priorA, a, b, c, lineWidth, lineCap, lineJoin, miterLimit, miterFallback, gl_InstanceID, instanceCount, gl_VertexID, 2.0, worldScale, v_sdfLineParams, v_sdfPriorLineParams, v_sdfNextLineParams);

  gl_Position = modelToClip(position);
  v_fillColor = strokeColor;
  v_strokeColor = strokeColor;

  // if (gl_VertexID > 1) v_strokeColor = vec4(vec3(1.0 - v_strokeColor.rgb), v_strokeColor.a);
  // if (gl_VertexID % 3 == 0) v_fillColor = vec4(vec3(1.0 - v_fillColor.rgb), v_fillColor.a);
  // if (gl_VertexID > 5) v_fillColor = vec4(0.0, 0.0, 0.0, 1.0);
  // if (gl_VertexID / 6 == 2 && gl_InstanceID != instanceCount - 1) {
  //   if (gl_VertexID % 6 < 3)
  //     v_fillColor = vec4(vec3(0.0), 1.0);
  //   else
  //     v_fillColor = vec4(0.0, 1.0, 0.0, 1.0);
  // }
  // if (gl_VertexID / 6 != 2) gl_Position = vec4(0.0);
}"""

  let linePath2dVertexKey = "linePath2dVertex"
  addVertexShaderSource linePath2dVertexKey linePath2dVertex
  // printfn $"""{getVertexShaderSource linePath2dVertexKey |> addLineNumbers}"""
  // printfn $"""{getFragmentShaderSource "linepath2d-fragment" |> addLineNumbers}"""

type LinePathObject2D(config: GlCanvasParams, scene: GlSceneData, points: Vec2[], ?layer, ?name, ?linkTo, ?parallaxCam: string, ?parallaxDistance) as o =
  inherit WebglObject(scene,
    // globject Shaders.linePath2dVertexKey "circleDiscardFragment2d" [
    // globject Shaders.linePath2dVertexKey "circleFragment2d" [
    globject Shaders.linePath2dVertexKey "linepath2d-fragment" [
      ObjectName (defaultArg name "")
      ObjectLink (defaultArg linkTo "")
      ParallaxCamera (defaultArg parallaxCam "")
      ParallaxDistance (defaultArg parallaxDistance 1.0)
      Layer (defaultArg layer scene.DefaultLayer)
      // VertexCount 18
      // VertexCount 11
      // VertexCount 10
      VertexCount 4
      DrawPrimitive GlDrawPrimitive.TRIANGLE_STRIP
      // InstanceCountOffset -1
      InstanceCountOffset -2
      // cullBack
      // enableDepthTesting
      blendFunc GlBlendFactor.ONE GlBlendFactor.ONE_MINUS_SRC_ALPHA

      interleave "priorA" [
        DeterminesInstanceCount
        Divisor 1
        // Values (points |> Array.collect (fun p -> p.Values))
        Values (points |> Array.append [| Vec2.Create() |] |> Vec.vec2Values)
        child "a" [ Divisor 1; DontAdjustStride ]
        child "b" [ Divisor 1; DontAdjustStride ]
        child "c" [ Divisor 1; DontAdjustStride ]
      ]

      ubo "linepathParams" [
        u "strokeColor" [ Value (config.StrokeColor).Values ]
        u "lineWidth" [ Value (pixelsToWorld config.LineWidth scene) ]
        u "lineCap" [ Value (config.LineCap) ]
        u "lineJoin" [ Value (config.LineJoin) ]
        u "miterLimit" [ Value (pixelsToWorld config.MiterLimit scene) ]
        u "miterFallback" [ Value (config.MiterFallback) ]
        u "instanceCount" [ Value 2 ]
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

  // let a = GlObj.getAttribute "a" o.ObjectDef
  let a = GlObj.getAttribute "priorA" o.ObjectDef

  let getValues () =
    let v = a.Values |> asArray<float>
    if v.Length = 0 then
      Vec.vec2Values (Array.of1 <| Vec2.Create())
    else
      v

  let calcInstanceCount() =
    let aValues = a.Values |> asArray<float>
    // aValues.Length / 2 - 1
    aValues.Length / 2 - 2

  let updateInstanceCount() = setInt "instanceCount" (calcInstanceCount())

  do updateInstanceCount()

  member _.StrokeColor
    with get() = getVec4 "strokeColor"
    and set(value) = setVec4 "strokeColor" value

  // member _.LineWidth
  //   with get() = getFloat "lineWidth"
  //   and set(value) = setFloat "lineWidth" value
  member _.LineWidth
    with get() = scene |> GlScene.pixelsToWorld (getFloat "lineWidth" |> Utils.pixels)
    and set(value) = setFloat "lineWidth" (scene |> GlScene.worldToPixels value |> float)

  member _.LineCap
    with get() = getInt "lineCap" |> enum<LineCap>
    and set(value: LineCap) = setInt "lineCap" (int value)

  member _.LineJoin
    with get() = getInt "lineJoin" |> enum<LineJoin>
    and set(value: LineJoin) = setInt "lineJoin" (int value)

  member _.MiterFallback
    with get() = getInt "miterFallback" |> enum<LineJoin>
    and set(value: LineJoin) = setInt "miterFallback" (int value)

  // TODO: Adjust miter limit properly.  Probably need to use screen coordinates.
  member _.MiterLimit
    with get() = (getFloat "miterLimit")
    and set(value) = setFloat "miterLimit" value

  member _.Add(point: Vec2) =
    let aValues = getValues()
    GlAttrib.setValues (Array.append aValues point.Values) a
    updateInstanceCount()

  member _.Add(points: Vec2[]) =
    let aValues = getValues()
    GlAttrib.setValues (Array.append aValues (Vec.vec2Values points)) a
    updateInstanceCount()

  member _.Set(index, point: Vec2) =
    GlAttrib.setValue (index + 1) (point.Values) a
