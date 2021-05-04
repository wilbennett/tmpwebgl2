namespace Wil.Core

open System
open Wil.Core.Utils

type Vec2(values: float[]) as v =
  // new() = Vec2([| 0.0; 0.0 |])
  // new(x: float) = Vec2([| x; x |])
  // new(x, y) = Vec2([| x; y |])

  static member Create() = Vec2([| 0.0; 0.0 |])
  static member Create(x) = Vec2([| x; x |])
  static member Create(x, y) = Vec2([| x; y |])

  member val Values = values with get
  member _.IntValues with get() = [| int values.[0]; int values.[1] |]

  member inline _.X
    with get() = values.[0]
    and set(value) = values.[0] <- value

  member inline _.Y
    with get() = values.[1]
    and set(value) = values.[1] <- value

  member inline _.MagSqr with get() = v.X * v.X + v.Y * v.Y
  member inline _.Mag with get() = sqrt(v.X * v.X + v.Y * v.Y)

  member _.Angle
    with get() =
      let res = atan2 v.Y v.X
      radians <| if res >= 0.0 then res else res + 2.0 * Math.PI

  member _.AngleDegrees with get() = v.Angle |> toDegrees

  static member inline OptionalVec vec = Option.calcDef Vec2.Create vec

  member inline private _.Set(x, y) =
    v.X <- x
    v.Y <- y
    v

  member inline _.CopyFrom(other: Vec2) = v.Set(other.X, other.Y) |> ignore
  member inline _.CopyTo(other: Vec2) = other.Set(v.X, v.Y) |> ignore
  member _.Clone() = Vec2([| v.X; v.Y |])
  member inline _.Dot(other: Vec2) = v.X * other.X + v.Y * other.Y
  member inline _.Cross(other: Vec2) = v.X * other.Y - v.Y * other.X

  member _.Add(other: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(v.X + other.X, v.Y + other.Y)
 
  member _.AddM(other: Vec2) = v.Add(other, v) |> ignore

  member _.Sub(other: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(v.X - other.X, v.Y - other.Y)
 
  member inline _.SubM(other: Vec2) = v.Sub(other, v) |> ignore

  member _.Scale(s, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(v.X * s, v.Y * s)
 
  member inline _.ScaleM(s) = v.Scale(s, v) |> ignore

  member _.Mult(other: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(v.X * other.X, v.Y * other.Y)
 
  member inline _.MultM(other) = v.Mult(other, v) |> ignore

  member _.Div(other: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(v.X / other.X, v.Y / other.Y)
 
  member inline _.DivM(other) = v.Div(other, v) |> ignore

  member _.Negate(?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(-v.X, -v.Y)
 
  member inline _.NegateM() = v.Negate(v) |> ignore

  member _.Normalize(?result: Vec2) =
    let result = Vec2.OptionalVec result
    let mag = v.Mag

    if mag < 0.000000001 then
      result.Set(0.0, 0.0)
    else
      let magInv = 1.0 / mag
      result.Set(v.X * magInv, v.Y * magInv)
 
  member inline _.NormalizeM() = v.Normalize(v) |> ignore

  member _.Rotate(angle: float<rad>, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    let angle = float angle
    let sin = sin angle
    let cos = cos angle
    result.Set(v.X * cos - v.Y * sin, v.X * sin + v.Y * cos)

  member inline _.RotateM(angle) = v.Rotate(angle, v) |> ignore

  member _.SetAngle(angle: float<rad>, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    let mag = v.Mag
    let angle = float angle
    let sin = sin angle
    let cos = cos angle
    result.Set(cos * mag, sin * mag)

  member inline _.SetAngleM(angle) = v.SetAngle(angle, v) |> ignore

  member _.Perp(?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(-v.Y, v.X)
 
  member inline _.PerpM() = v.Perp(v) |> ignore

  member _.PerpLeft(?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(-v.Y, v.X)
 
  member inline _.PerpLeftM() = v.PerpLeft(v) |> ignore

  member _.PerpRight(?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(v.Y, -v.X)
 
  member inline _.PerpRightM() = v.PerpRight(v) |> ignore

  member _.PerpToward(toward: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    let sgn = toward.Cross(v) |> sign |> float
    result.Set(v.Y * sgn, v.X * sgn)

  member inline _.PerpTowardM(toward: Vec2) = v.PerpToward(toward, v) |> ignore

  member _.Min(other: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(min v.X other.X, min v.Y other.Y)

  member inline _.MinM(other: Vec2) = v.Min(other, v) |> ignore

  member _.Max(other: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(max v.X other.X, max v.Y other.Y)

  member inline _.MaxM(other: Vec2) = v.Max(other, v) |> ignore

  member _.Ceil(?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(ceil v.X, ceil v.Y)

  member inline _.CeilM() = v.Ceil(v) |> ignore

  member _.Floor(?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(floor v.X, floor v.Y)

  member inline _.FloorM() = v.Floor(v) |> ignore

  member _.Fract(?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(v.X - floor v.X, v.Y - floor v.Y)

  member inline _.FractM() = v.Fract(v) |> ignore

  member _.WithXY(x, y, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(x, y)

  member inline _.WithXYM(x, y) = v.WithXY(x, y, v) |> ignore

  member _.WithX(x, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(x, v.Y)

  member inline _.WithXM(x) = v.WithX(x, v) |> ignore

  member _.WithY(y, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.Set(v.X, y)

  member inline _.WithYM(y) = v.WithY(y, v) |> ignore

  override _.GetHashCode() = v.Values.GetHashCode()

  override _.Equals(other) =
    match other with
    | :? Vec2 as o -> v.Values = o.Values
    | _ -> false

  override _.ToString() = sprintf "[%.2f, %.2f]" v.X v.Y

  /// <summary>Negate</summary>
  static member (~-)(v1: Vec2) = v1.Negate()
  /// <summary>Negate with mutation</summary>
  static member (~-.)(v1: Vec2) = v1.NegateM()

  /// <summary>Normalize</summary>
  static member (!!)(v1: Vec2) = v1.Normalize()
  /// <summary>Normalize with mutation</summary>
  static member (!!=)(v1: Vec2) = v1.NormalizeM()

  /// <summary>Add</summary>
  static member (+)(v1: Vec2, value) = Vec2.Create(v1.X + value, v1.Y + value)
  /// <summary>Add</summary>
  static member (+)(value, v1: Vec2) = Vec2.Create(v1.X + value, v1.Y + value)
  /// <summary>Add</summary>
  static member (+)(v1: Vec2, v2: Vec2) = v1.Add(v2)
  /// <summary>Add with mutation</summary>
  static member (+=)(v1: Vec2, value) = v1.WithXYM(v1.X + value, v1.Y + value)
  /// <summary>Add with mutation</summary>
  static member (+=)(value, v1: Vec2) = v1.WithXYM(v1.X + value, v1.Y + value)
  /// <summary>Add with mutation</summary>
  static member (+=)(v1: Vec2, v2: Vec2) = v1.AddM(v2)

  /// <summary>Subtract</summary>
  static member (-)(v1: Vec2, value) = Vec2.Create(v1.X - value, v1.Y - value)
  /// <summary>Subtract</summary>
  static member (-)(value, v1: Vec2) = Vec2.Create(value - v1.X, value - v1.Y)
  /// <summary>Subtract</summary>
  static member (-)(v1: Vec2, v2: Vec2) = v1.Sub(v2)
  /// <summary>Subtract with mutation</summary>
  static member (-=)(v1: Vec2, value) = v1.WithXYM(v1.X - value, v1.Y - value)
  /// <summary>Subtract with mutation</summary>
  static member (-=)(value, v1: Vec2) = v1.WithXYM(value - v1.X, value - v1.Y)
  /// <summary>Subtract with mutation</summary>
  static member (-=)(v1: Vec2, v2: Vec2) = v1.SubM(v2)

  /// <summary>Scale</summary>
  static member (*)(v1: Vec2, scale) = v1.Scale(scale)
  /// <summary>Scale</summary>
  static member (*)(scale, v1: Vec2) = v1.Scale(scale)
  /// <summary>Scale with mutation</summary>
  static member ( *= )(v1: Vec2, scale) = v1.ScaleM(scale)
  /// <summary>Scale with mutation</summary>
  static member ( *= )(scale, v1: Vec2) = v1.ScaleM(scale)

  /// <summary>Scale</summary>
  static member (*)(v1: Vec2, v2: Vec2) = v1.Mult(v2)
  /// <summary>Scale with mutation</summary>
  static member ( *= )(v1: Vec2, v2: Vec2) = v1.MultM(v2)

  /// <summary>Division</summary>
  static member (/)(v1: Vec2, divisor: float) = v1.Scale(1.0 / divisor)
  /// <summary>Division</summary>
  static member (/)(value: float, v1: Vec2) = Vec2.Create(value / v1.X, value / v1.Y)
  /// <summary>Division</summary>
  static member (/)(v1: Vec2, v2: Vec2) = v1.Div(v2)
  /// <summary>Division with mutation</summary>
  static member ( /= )(v1: Vec2, divisor: float) = v1.ScaleM(1.0 / divisor)
  /// <summary>Division with mutation</summary>
  static member ( /= )(v1: Vec2, v2: Vec2) = v1.DivM(v2)

  /// <summary>Modulus</summary>
  static member (%)(v1: Vec2, value: float) = Vec2.Create(v1.X % value, v1.Y % value)
  /// <summary>Modulus</summary>
  static member (%)(value: float, v1: Vec2) = Vec2.Create(value % v1.X, value % v1.Y)
  /// <summary>Modulus</summary>
  static member (%)(v1: Vec2, v2: Vec2) = Vec2.Create(v1.X % v2.X, v1.Y % v2.Y)
  /// <summary>Modulus with mutation</summary>
  static member ( %= )(v1: Vec2, v2: Vec2) = v1.WithXYM(v1.X % v2.X, v1.Y % v2.Y)

  /// <summary>Dot</summary>
  static member (.*)(v1: Vec2, v2: Vec2) = v1.Dot(v2)
  /// <summary>Cross2D</summary>
  static member (+*)(v1: Vec2, v2: Vec2) = v1.Cross(v2)

type Vec3 (values) as v =
  // new() = Vec3([| 0.0; 0.0; 0.0 |])
  // new(x: float) = Vec3([| x; x; x |])
  // new(x, y, z) = Vec3([| x; y; z |])
  // new(v2: Vec2, z) = Vec3([| v2.X; v2.Y; z |])

  static member Create() = Vec3([| 0.0; 0.0; 0.0 |])
  static member Create(x: float) = Vec3([| x; x; x |])
  static member Create(x, y, z) = Vec3([| x; y; z |])
  static member Create(v2: Vec2, z) = Vec3([| v2.X; v2.Y; z |])

  member val Values = values with get
  member _.IntValues with get() = [| int values.[0]; int values.[1]; int values.[2] |]

  member inline _.X
    with get() = values.[0]
    and set(value) = values.[0] <- value

  member inline _.Y
    with get() = values.[1]
    and set(value) = values.[1] <- value

  member inline _.Z
    with get() = values.[2]
    and set(value) = values.[2] <- value

  member inline _.MagSqr with get() = v.X * v.X + v.Y * v.Y + v.Z * v.Z
  member inline _.Mag with get() = sqrt(v.X * v.X + v.Y * v.Y + v.Z * v.Z)

  static member inline OptionalVec vec = Option.calcDef Vec3.Create vec

  member inline private _.Set(x, y, z) =
    v.X <- x
    v.Y <- y
    v.Z <- z
    v

  member inline _.CopyFrom(other: Vec3) = v.Set(other.X, other.Y, other.Z) |> ignore
  member inline _.CopyTo(other: Vec3) = other.Set(v.X, v.Y, v.Z) |> ignore
  member _.Clone() = Vec3([| v.X; v.Y; v.Z |])
  member inline _.Dot(other: Vec3) = v.X * other.X + v.Y * other.Y + v.Z * other.Z

  member inline _.Cross(other: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(
      v.Y * other.Z - v.Z * other.Y,
      v.Z * other.X - v.X * other.Z,
      v.X * other.Y - v.Y * other.X
      )

  member _.CrossM(other: Vec3) = v.Cross(other, v) |> ignore

  member _.Add(other: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X + other.X, v.Y + other.Y, v.Z + other.Z)
 
  member _.AddM(other: Vec3) = v.Add(other, v) |> ignore

  member _.Sub(other: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X - other.X, v.Y - other.Y, v.Z - other.Z)
 
  member inline _.SubM(other: Vec3) = v.Sub(other, v) |> ignore

  member _.Scale(s, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X * s, v.Y * s, v.Z * s)
 
  member inline _.ScaleM(s) = v.Scale(s, v) |> ignore

  member _.Mult(other: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X * other.X, v.Y * other.Y, v.Z * other.Z)
 
  member inline _.MultM(other) = v.Mult(other, v) |> ignore

  member _.Div(other: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X / other.X, v.Y / other.Y, v.Z / other.Z)
 
  member inline _.DivM(other) = v.Div(other, v) |> ignore

  member _.Negate(?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(-v.X, -v.Y, -v.Z)
 
  member inline _.NegateM() = v.Negate(v) |> ignore

  member _.Normalize(?result: Vec3) =
    let result = Vec3.OptionalVec result
    let mag = v.Mag

    if mag < 0.000000001 then
      result.Set(0.0, 0.0, 0.0)
    else
      let magInv = 1.0 / mag
      result.Set(v.X * magInv, v.Y * magInv, v.Z * magInv)
 
  member inline _.NormalizeM() = v.Normalize(v) |> ignore

  member _.Ceil(?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(ceil v.X, ceil v.Y, ceil v.Z)

  member inline _.CeilM() = v.Ceil(v) |> ignore

  member _.Floor(?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(floor v.X, floor v.Y, floor v.Z)

  member inline _.FloorM() = v.Floor(v) |> ignore

  member _.Fract(?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X - floor v.X, v.Y - floor v.Y, v.Z - floor v.Z)

  member inline _.FractM() = v.Fract(v) |> ignore

  member _.WithXYZ(x, y, z, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(x, y, z)

  member inline _.WithXYZM(x, y, z) = v.WithXYZ(x, y, z, v) |> ignore

  member _.WithXY(x, y, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(x, y, v.Z)

  member inline _.WithXYM(x, y) = v.WithXY(x, y, v) |> ignore

  member _.WithXY(other: Vec2, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(other.X, other.Y, v.Z)

  member inline _.WithXYM(other: Vec2) = v.WithXY(other, v) |> ignore

  member _.WithXY(other: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(other.X, other.Y, v.Z)

  member inline _.WithXYM(other: Vec3) = v.WithXY(other, v) |> ignore

  member _.WithXZ(x, z, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(x, v.Y, z)

  member inline _.WithXZM(x, z) = v.WithXZ(x, z, v) |> ignore

  member _.WithXZ(other: Vec2, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(other.X, v.Y, other.Y)

  member inline _.WithXZM(other: Vec2) = v.WithXZ(other, v) |> ignore

  member _.WithXZ(other: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(other.X, v.Y, other.Y)

  member inline _.WithXZM(other: Vec3) = v.WithXZ(other, v) |> ignore

  member _.WithYZ(y, z, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X, y, z)

  member inline _.WithYZM(y, z) = v.WithYZ(y, z, v) |> ignore

  member _.WithYZ(other: Vec2, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X, other.X, other.Y)

  member inline _.WithYZM(other: Vec2) = v.WithYZ(other, v) |> ignore

  member _.WithYZ(other: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    result.Set(v.X, other.X, other.Y)

  member inline _.WithYZM(other: Vec3) = v.WithYZ(other, v) |> ignore

  override _.GetHashCode() = v.Values.GetHashCode()

  override _.Equals(other) =
    match other with
    | :? Vec3 as o -> v.Values = o.Values
    | _ -> false

  override _.ToString() = sprintf "[%.2f, %.2f, %.2f]" v.X v.Y v.Z

  /// <summary>Negate</summary>
  static member (~-)(v1: Vec3) = v1.Negate()
  /// <summary>Negate with mutation</summary>
  static member (~-.)(v1: Vec3) = v1.NegateM()

  /// <summary>Normalize</summary>
  static member (!!)(v1: Vec3) = v1.Normalize()
  /// <summary>Normalize with mutation</summary>
  static member (!!=)(v1: Vec3) = v1.NormalizeM()

  /// <summary>Add</summary>
  static member (+)(v1: Vec3, v2: Vec3) = v1.Add(v2)
  /// <summary>Add with mutation</summary>
  static member (+=)(v1: Vec3, v2: Vec3) = v1.AddM(v2)

  /// <summary>Subtract</summary>
  static member (-)(value, v1: Vec3) = Vec3.Create(value - v1.X, value - v1.Y, value - v1.Z)
  /// <summary>Subtract</summary>
  static member (-)(v1: Vec3, v2: Vec3) = v1.Sub(v2)
  /// <summary>Subtract with mutation</summary>
  static member (-=)(v1: Vec3, v2: Vec3) = v1.SubM(v2)

  /// <summary>Scale</summary>
  static member (*)(v1: Vec3, scale) = v1.Scale(scale)
  /// <summary>Scale</summary>
  static member (*)(scale, v1: Vec3) = v1.Scale(scale)
  /// <summary>Scale with mutation</summary>
  static member ( *= )(v1: Vec3, scale) = v1.ScaleM(scale)
  /// <summary>Scale with mutation</summary>
  static member ( *= )(scale, v1: Vec3) = v1.ScaleM(scale)

  /// <summary>Scale</summary>
  static member (*)(v1: Vec3, v2: Vec3) = v1.Mult(v2)
  /// <summary>Scale with mutation</summary>
  static member ( *= )(v1: Vec3, v2: Vec3) = v1.MultM(v2)

  /// <summary>Division</summary>
  static member (/)(v1: Vec3, divisor: float) = v1.Scale(1.0 / divisor)
  /// <summary>Division</summary>
  static member (/)(value: float, v1: Vec3) = Vec3.Create(value / v1.X, value / v1.Z, value / v1.Z)
  /// <summary>Division</summary>
  static member (/)(v1: Vec3, v2: Vec3) = v1.Div(v2)
  static member ( /= )(v1: Vec3, divisor: float) = v1.ScaleM(1.0 / divisor)
  /// <summary>Division with mutation</summary>
  static member ( /= )(v1: Vec3, v2: Vec3) = v1.DivM(v2)

  /// <summary>Dot</summary>
  static member (.*)(v1: Vec3, v2: Vec3) = v1.Dot(v2)
  /// <summary>Cross2D</summary>
  static member (+*)(v1: Vec3, v2: Vec3) = v1.Cross(v2)

  member inline _.XY with get() = Vec2.Create(v.X, v.Y)

type Vec4 (values) as v =
  // static let newVec = fun () -> Vec4()

  // new() = Vec4([| 0.0; 0.0; 0.0; 1.0 |])
  // new(x: float) = Vec4([| x; x; x; x |])
  // new(x, y, z, w) = Vec4([| x; y; z; w |])
  // new(v1: Vec3, w) = Vec4([| v1.X; v1.Y; v1.Z; w |])
  // new(v1: Vec2, z, w) = Vec4([| v1.X; v1.Y; z; w |])
  // new(v1: Vec2, v2: Vec2) = Vec4([| v1.X; v1.Y; v2.X; v2.Y |])
  // new(x, y, v1: Vec2) = Vec4([| x; y; v1.X; v1.Y |])

  static member Create(x, y, z, w) = Vec4([| x; y; z; w |])
  static member Create(x) = Vec4([| x; x; x; x |])
  static member Create() = Vec4([| 0.0; 0.0; 0.0; 1.0 |])
  static member Create(v2: Vec2, z, w) = Vec4([| v2.X; v2.Y; z; w |])
  static member Create(v3: Vec3, w) = Vec4([| v3.X; v3.Y; v3.Z; w |])

  member val Values = values with get
  member _.IntValues with get() = [| int values.[0]; int values.[1]; int values.[2]; int values.[3] |]

  member inline _.X
    with get() = values.[0]
    and set(value) = values.[0] <- value

  member inline _.Y
    with get() = values.[1]
    and set(value) = values.[1] <- value

  member inline _.Z
    with get() = values.[2]
    and set(value) = values.[2] <- value

  member inline _.W
    with get() = values.[3]
    and set(value) = values.[3] <- value

  member inline _.MagSqr with get() = v.X * v.X + v.Y * v.Y + v.Z * v.Z
  member inline _.Mag with get() = sqrt(v.X * v.X + v.Y * v.Y + v.Z * v.Z)

  static member inline private OptionalVec vec = Option.calcDef Vec4.Create vec

  member inline private _.Set(x, y, z, w) =
    v.X <- x
    v.Y <- y
    v.Z <- z
    v.W <- w
    v

  member inline _.CopyFrom(other: Vec4) = v.Set(other.X, other.Y, other.Z, other.W) |> ignore
  member inline _.CopyTo(other: Vec4) = other.Set(v.X, v.Y, v.Z, v.W) |> ignore
  member _.Clone() = Vec4([| v.X; v.Y; v.Z; v.W |])
  member inline _.Dot(other: Vec4) = v.X * other.X + v.Y * other.Y + v.Z * other.Z

  member _.Add(other: Vec4, ?result: Vec4) =
    let result = Vec4.OptionalVec result
    result.Set(v.X + other.X, v.Y + other.Y, v.Z + other.Z, v.W + other.W)
 
  member _.AddM(other: Vec4) = v.Add(other, v) |> ignore

  member _.Sub(other: Vec4, ?result: Vec4) =
    let result = Vec4.OptionalVec result
    result.Set(v.X - other.X, v.Y - other.Y, v.Z - other.Z, v.W - other.W)
 
  member inline _.SubM(other: Vec4) = v.Sub(other, v) |> ignore

  member _.Scale(s, ?result: Vec4) =
    let result = Vec4.OptionalVec result
    result.Set(v.X * s, v.Y * s, v.Z * s, v.W)
 
  member inline _.ScaleM(s) = v.Scale(s, v) |> ignore

  member _.Negate(?result: Vec4) =
    let result = Vec4.OptionalVec result
    result.Set(-v.X, -v.Y, -v.Z, v.W)
 
  member inline _.NegateM() = v.Negate(v) |> ignore

  member _.Normalize(?result: Vec4) =
    let result = Vec4.OptionalVec result
    let mag = v.Mag

    if mag < 0.000000001 then
      result.Set(0.0, 0.0, 0.0, 0.0)
    else
      let magInv = 1.0 / mag

      if v.W <> 0.0 && v.W <> 1.0 then
        let mult = 1.0 / v.W * magInv
        result.Set(v.X * mult, v.Y * mult, v.Z * mult, 1.0)
      else
        result.Set(v.X * magInv, v.Y * magInv, v.Z * magInv, v.W)
 
  member inline _.NormalizeM() = v.Normalize(v) |> ignore

  override _.GetHashCode() = v.Values.GetHashCode()

  override _.Equals(other) =
    match other with
    | :? Vec4 as o -> v.Values = o.Values
    | _ -> false

  /// <summary>Subtract</summary>
  static member (-)(value, v1: Vec4) = Vec4.Create(value - v1.X, value - v1.Y, value - v1.Z, value - v1.W)

  member inline _.XY with get() = Vec2.Create(v.X, v.Y)
  member inline _.XYZ with get() = Vec3.Create(v.X, v.Y, v.Z)

[<AutoOpen>]
module Vec2 =
  let inline vec2 x y = Vec2.Create(x, y)

[<AutoOpen>]
module Vec3 =
  let inline vec3 x y z = Vec3.Create(x, y, z)

[<AutoOpen>]
module Vec4 =
  let inline vec4 x y z w = Vec4.Create(x, y, z, w)

module Vec =
  let inline add2 (v: Vec2) x y = vec2 (v.X + x) (v.Y + y)
  let inline add3 (v: Vec3) x y z = vec3 (v.X + x) (v.Y + y) (v.Z + z)
  let inline add4 (v: Vec4) x y z w = vec4 (v.X + x) (v.Y + y) (v.Z + z) (v.W + w)

  let lerp2 (v1: Vec2) (v2: Vec2) t =
    vec2 (v1.X + (v2.X - v1.X) * t) (v1.Y + (v2.Y - v1.Y) * t)

  let lerp2v (v1: Vec2) (v2: Vec2) (t: Vec2) =
    let u = 1.0 - t
    vec2 (v1.X + (v2.X - v1.X) * t.X) (v1.Y + (v2.Y - v1.Y) * t.Y)

  let lerp3 (v1: Vec3) (v2: Vec3) t =
    vec3 (v1.X + (v2.X - v1.X) * t) (v1.Y + (v2.Y - v1.Y) * t) (v1.Z + (v2.Z - v1.Z) * t)

  let lerp3v (v1: Vec3) (v2: Vec3) (t: Vec3) =
    vec3 (v1.X + (v2.X - v1.X) * t.X) (v1.Y + (v2.Y - v1.Y) * t.Y) (v1.Z + (v2.Z - v1.Z) * t.Z)

  let lerp4 (v1: Vec4) (v2: Vec4) t =
    vec4 (v1.X + (v2.X - v1.X) * t) (v1.Y + (v2.Y - v1.Y) * t) (v1.Z + (v2.Z - v1.Z) * t) (v1.W + (v2.W - v1.W) * t)

  let lerp4v (v1: Vec4) (v2: Vec4) (t: Vec4) =
    vec4 (v1.X + (v2.X - v1.X) * t.X) (v1.Y + (v2.Y - v1.Y) * t.Y) (v1.Z + (v2.Z - v1.Z) * t.Z) (v1.W + (v2.W - v1.W) * t.W)

  let vec2Values (lst: Vec2[]) = lst |> Array.collect (fun x -> x.Values)
  let vec2ValuesL (lst: Vec2 list) = lst |> Array.ofList |> vec2Values
