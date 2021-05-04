namespace Wil.Webgl

open Wil.Core
open Wil.Core.Utils
open Wil.Webgl
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open Wil.Webgl.Props
open WebglObject

module private Shaders =
  // printfn $"""{getVertexShaderSource "quadStripRightVertex2d" |> addLineNumbers}"""
  // printfn $"""{getVertexShaderSource "quadSdfStripRightVertex2d" |> addLineNumbers}"""
  // printfn $"""{getFragmentShaderSource "vectorFragment2d" |> addLineNumbers}"""
  ()

type VectorObject2D(config: GlCanvasParams, scene: GlSceneData, vector: Vec2, ?layer, ?name, ?linkTo, ?parallaxCam: string, ?parallaxDistance) as o =
  inherit QuadObjectBase(config, scene, "quadStripRightVertex2d", "vectorFragment2d", [
      blendFunc GlBlendFactor.ONE GlBlendFactor.ONE_MINUS_SRC_ALPHA
    ],
    ?layer = layer,
    ?name = name,
    ?linkTo = linkTo,
    ?parallaxCam = parallaxCam,
    ?parallaxDistance = parallaxDistance)

  let uniforms = Map(o.ObjectDef |> GlCommon.allUniforms |> Seq.map (fun u -> (u.Name, u)))
  let getFloat = getFloat uniforms
  let setFloat = setFloat uniforms

  let mutable vec = vector
  let uSize = o.ObjectDef |> GlObj.getUniform "size"
  let uAngle = o.ObjectDef |> GlObj.getUniform "angle"

  // let calcSize() = (vec2 vec.Mag ((getFloat "lineWidth") * 2.0)).Values
  let calcSize() = (vec2 vec.Mag vec.Mag).Values
  let updateSize() = uSize |> GlUniform.setValue (calcSize())
  let updateAngle() = uAngle |> GlUniform.setValue vec.Angle

  do
    updateSize()
    updateAngle()

  member _.Vector
    with get() = vec
    and set(value: Vec2) =
      vec.CopyFrom(value)
      updateSize()
      updateAngle()

  override _.LineWidth
    with get() = (getFloat "lineWidth")
    and set(value) =
      setFloat "lineWidth" (value)
      updateSize()
