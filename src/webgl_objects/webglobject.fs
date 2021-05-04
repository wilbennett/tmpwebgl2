namespace Wil.Webgl

open Wil.Core
open Wil.Core.Utils
open Wil.Webgl.Data

module WebglObject =
  let inline get (name: string) uniforms =
    match uniforms |> Map.tryFind name with
    | Some uniform -> uniform
    | None -> throw $"Uniform '{name}' not found."

  let inline getInt uniforms name = ((get name uniforms).Value |> asArray<int>).[0]
  let inline setInt uniforms name (value: int) = get name uniforms |> GlUniform.setValue value
  let inline getFloat uniforms name = ((get name uniforms).Value |> asArray<float>).[0]
  let inline setFloat uniforms name (value: float) = get name uniforms |> GlUniform.setValue value
  let inline getVec2 uniforms name = Vec2((get name uniforms).Value |> asArray<float>)
  let inline setVec2 uniforms name (value: Vec2) = get name uniforms |> GlUniform.setValue value.Values
  let inline getVec3 uniforms name = Vec3((get name uniforms).Value |> asArray<float>)
  let inline setVec3 uniforms name (value: Vec3) = get name uniforms |> GlUniform.setValue value.Values
  let inline getVec4 uniforms name = Vec4((get name uniforms).Value |> asArray<float>)
  let inline setVec4 uniforms name (value: Vec4) = get name uniforms |> GlUniform.setValue value.Values
  let inline getIntVec2 uniforms name = let value = (get name uniforms).Value |> asArray<int> in Vec2.Create(float value.[0], float value.[1])
  let inline setIntVec2 uniforms name (value: Vec2) = get name uniforms |> GlUniform.setValue value.IntValues
  let inline getIntVec3 uniforms name = Vec3((get name uniforms).Value |> asArray<float>)
  let inline setIntVec3 uniforms name (value: Vec3) = get name uniforms |> GlUniform.setValue value.IntValues
  let inline getIntVec4 uniforms name = Vec4((get name uniforms).Value |> asArray<float>)
  let inline setIntVec4 uniforms name (value: Vec4) = get name uniforms |> GlUniform.setValue value.IntValues

  let inline pixelsToWorld (pixels: float<px>) scene =
    scene |> GlScene.pixelsToWorld pixels |> box

  let inline worldToPixels value scene =
    scene |> GlScene.worldToPixels value |> box

type WebglObject(scene: GlSceneData, objectCreator: GlObjectFactory) =
  let objectDef = GlScene.addObject objectCreator scene

  member _.ObjectDef with get() = objectDef
  member _.Scene with get() = objectDef.Scene

  member _.Position
    with get() = objectDef.Position
    and set(value) = objectDef |> GlObj.setPosition value

  member _.Position2
    with get() = objectDef.Position.XY
    and set(value: Vec2) = objectDef |> GlObj.setPositionXY value.X value.Y

  member _.Angle
    with get() = objectDef.Angle
    and set(value) = objectDef |> GlObj.setAngle value

  member _.AngleZ
    with get() = objectDef.Angle.Z |> radians
    and set(value) = objectDef |> GlObj.setAngleZ value

  member _.AngleDegrees
    with get() = GlObj.degreesToRadians objectDef.Angle
    and set(value) = objectDef |> GlObj.setAngleDegrees value

  member _.AngleDegreesZ
    with get() = objectDef.Angle.Z |> radians |> toDegrees
    and set(value) = objectDef |> GlObj.setAngleDegreesZ value

  member _.Scale
    with get() = objectDef.Scale
    and set(value) = objectDef |> GlObj.setScale value

  abstract member Delete: unit -> unit
  default _.Delete() =
    scene |> GlScene.removeObject objectDef |> ignore
    GlObj.delete objectDef
