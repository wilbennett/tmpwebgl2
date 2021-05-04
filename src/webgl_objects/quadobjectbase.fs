namespace Wil.Webgl

open Wil.Core
open Wil.Core.Utils
open Wil.Webgl
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data
open Wil.Webgl.Props
open WebglObject

type QuadObjectBase(config: GlCanvasParams, scene: GlSceneData, vertex, fragment, props: GlObjProp list, ?layer, ?name, ?linkTo, ?parallaxCam: string, ?parallaxDistance) as o =
  inherit WebglObject(scene,
    globject vertex fragment ([
      ObjectName (defaultArg name "")
      ObjectLink (defaultArg linkTo "")
      ParallaxCamera (defaultArg parallaxCam "")
      ParallaxDistance (defaultArg parallaxDistance 1.0)
      Layer (defaultArg layer scene.DefaultLayer)
      VertexCount 4
      DrawPrimitive GlDrawPrimitive.TRIANGLE_STRIP
      ubo "quadParams" [
        u "size" [ vec2Value 0.0 0.0 ]
        u "strokeColor" [ vec4ValueV config.StrokeColor ]
        u "fillColor" [ vec4ValueV config.FillColor ]
        u "fillType" [ Value (config.FillType) ]
        u "lineWidth" [ Value (GlScene.pixelsToWorld config.LineWidth scene) ]
        u "aliasWidth" [ Value 2.0 ]
        u "angle" [ Value 0.0 ]
        u "instanceCount" [ Value 1 ]
      ]
    ] @ props)
  )

  let uniforms = Map(o.ObjectDef |> GlCommon.allUniforms |> Seq.map (fun u -> (u.Name, u)))
  let getFloat = getFloat uniforms
  let setFloat = setFloat uniforms
  let getInt = getInt uniforms
  let setInt = setInt uniforms
  let getVec2 = getVec2 uniforms
  let setVec2 = setVec2 uniforms
  let getVec4 = getVec4 uniforms
  let setVec4 = setVec4 uniforms

  member _.Size
    with get() = getVec2 "size"
    and set(value) = setVec2 "size" value

  member _.StrokeColor
    with get() = getVec4 "strokeColor"
    and set(value) = setVec4 "strokeColor" value

  member _.FillColor
    with get() = getVec4 "fillColor"
    and set(value) = setVec4 "fillColor" value

  member _.FillType
    with get() = getInt "fillType" |> enum<FillType>
    and set(value: FillType) = setInt "fillType" (int value)

  abstract member LineWidth: float with get, set
  default _.LineWidth
    with get() = (getFloat "lineWidth")
    and set(value) = setFloat "lineWidth" (value)

  member _.AliasWidth
    with get() = scene |> GlScene.worldToPixels (getFloat "aliasWidth")
    and set(value: float<px>) = setFloat "aliasWidth" (GlScene.pixelsToWorld value scene)
