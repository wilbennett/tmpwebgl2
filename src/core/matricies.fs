namespace Wil.Core

open System
open Wil.Core.Utils

type Mat2(values) as m =
  let optionalMat mat = Option.defaultValue m mat

  static member Identity with get() = [|
    1.0; 0.0
    0.0; 1.0
    |]

  static member Create() = Mat2(Mat2.Identity)

  member val Values = values with get

  member _.SetToIdentity() =
    values.[0] <- 1.0
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 1.0

  member _.Set(newValues: float[]) =
    values.[0] <- newValues.[0]
    values.[1] <- newValues.[1]
    values.[2] <- newValues.[2]
    values.[3] <- newValues.[3]
    m

  member _.RotationTrig(cos, sin, ?result: Mat2) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- cos
    values.[1] <- -sin
    values.[2] <- sin
    values.[3] <- cos
    result

  member _.Rotation(angle: float<rad>, ?result: Mat2) =
    let ang = float angle in m.RotationTrig(cos ang, sin ang, ?result = result)

  member _.RotationTrigReverse(cos, sin, ?result: Mat2) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- cos
    values.[1] <- sin
    values.[2] <- -sin
    values.[3] <- cos
    result

  member _.RotationReverse(angle: float<rad>, ?result: Mat2) =
    let ang = float angle in m.RotationTrigReverse(cos ang, sin ang, ?result = result)

  member _.Transpose(?result: Mat2) =
    let result = optionalMat result
    let values = result.Values
    let v1 = values.[1]
    let v2 = values.[2]
    values.[0] <- values.[0]
    values.[1] <- v2
    values.[2] <- v1
    values.[3] <- values.[3]
    result

  member _.TransposeM() =
    m.Transpose(m) |> ignore

  member _.Mult(other: Mat2, ?result: Mat2) =
    let result = optionalMat result
    let values = result.Values
    let ovalues = other.Values
    let v00 = values.[0]
    let v01 = values.[1]
    let v10 = values.[2]
    let v11 = values.[3]
    let o00 = ovalues.[0]
    let o01 = ovalues.[1]
    let o10 = ovalues.[2]
    let o11 = ovalues.[3]
    values.[0] <- v00 * o00 + v01 * o10
    values.[1] <- v00 * o01 + v01 * o11
    values.[2] <- v10 * o00 + v11 * o10
    values.[3] <- v10 * o01 + v11 * o11
    result

  member _.MultM(other: Mat2) =
    m.Mult(other, m) |> ignore

  member _.Transform(v: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.X <- values.[0] * v.X + values.[1] * v.Y
    result.Y <- values.[2] * v.X + values.[3] * v.Y
    result

  member _.TransformInverse(v: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.X <- values.[0] * v.X + values.[2] * v.Y
    result.Y <- values.[1] * v.X + values.[3] * v.Y
    result

  override _.ToString() =
    let v = values
    sprintf "%10.2f %10.2f\n" (v.[0]) (v.[1]) +
    sprintf "%10.2f %10.2f"   (v.[2]) (v.[3])

type Mat2D(values) as m =
  let optionalMat mat = Option.defaultValue m mat

  static member Identity with get() = [|
    1.0; 0.0
    0.0; 1.0
    0.0; 0.0
    |]

  static member Create() = Mat2D(Mat2D.Identity)

  member val Values = values with get

  member _.SetToIdentity() =
    values.[0] <- 1.0
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 1.0
    values.[4] <- 0.0
    values.[5] <- 0.0

  member _.Set(newValues: float[]) =
    values.[0] <- newValues.[0]
    values.[1] <- newValues.[1]
    values.[2] <- newValues.[2]
    values.[3] <- newValues.[3]
    values.[4] <- newValues.[4]
    values.[5] <- newValues.[5]
    m

  member _.Translation(x, y, ?result: Mat2D) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- 1.0
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 1.0
    values.[4] <- x
    values.[5] <- y
    result

  member _.RotationTrig(cos, sin, ?result: Mat2D) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- cos
    values.[1] <- -sin
    values.[2] <- sin
    values.[3] <- cos
    values.[4] <- 0.0
    values.[5] <- 0.0
    result

  member _.Rotation(angle: float<rad>, ?result: Mat2D) =
    let ang = float angle in m.RotationTrig(cos ang, sin ang, ?result = result)

  member _.RotationTrigReverse(cos, sin, ?result: Mat2D) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- cos
    values.[1] <- sin
    values.[2] <- -sin
    values.[3] <- cos
    values.[4] <- 0.0
    values.[5] <- 0.0
    result

  member _.RotationReverse(angle: float<rad>, ?result: Mat2D) =
    let ang = float angle in m.RotationTrigReverse(cos ang, sin ang, ?result = result)

  member _.Mult(other: Mat2D, ?result: Mat2D) =
    let result = optionalMat result
    let values = result.Values
    let ovalues = other.Values
    let v0 = values.[0]
    let v1 = values.[1]
    let v2 = values.[2]
    let v3 = values.[3]
    let v4 = values.[4]
    let v5 = values.[5]
    let o0 = ovalues.[0]
    let o1 = ovalues.[1]
    let o2 = ovalues.[2]
    let o3 = ovalues.[3]
    values.[0] <- v0 * o0 + v1 * o2
    values.[1] <- v0 * o1 + v1 * o3
    values.[2] <- v2 * o0 + v3 * o2
    values.[3] <- v2 * o1 + v3 * o3
    values.[4] <- v4 * o0 + v5 * o2 + v4
    values.[5] <- v4 * o1 + v5 * o3 + v5
    result

  member _.MultM(other: Mat2D) =
    m.Mult(other, m) |> ignore

  member _.Translate(x, y, ?result: Mat2D) =
    let temp = Mat2D.Create()
    m.Mult(m.Translation(x, y, temp), ?result = result)

  member _.TranslateM(x, y) =
    m.Translate(x, y, m) |> ignore

  member _.RotateTrig(cos, sin, ?result: Mat2D) =
    let temp = Mat2D.Create()
    m.Mult(m.RotationTrig(cos, sin, temp), ?result = result)

  member _.RotateTrigM(cos, sin) =
    m.RotateTrig(cos, sin, m) |> ignore

  member _.Rotate(angle: float<rad>, ?result: Mat2D) =
    let ang = float angle in m.RotateTrig(cos ang, sin ang, ?result = result)

  member _.RotateM(angle: float<rad>) =
    m.Rotate(angle, m) |> ignore

  member _.RotateTrigReverse(cos, sin, ?result: Mat2D) =
    let temp = Mat2D.Create()
    m.Mult(m.RotationTrigReverse(cos, sin, temp), ?result = result)

  member _.RotateTrigReverseM(cos, sin) =
    m.RotateTrigReverse(cos, sin, m) |> ignore

  member _.RotateReverse(angle: float<rad>, ?result: Mat2D) =
    let ang = float angle in m.RotateTrigReverse(cos ang, sin ang, ?result = result)

  member _.RotateReverseM(angle: float<rad>) =
    m.RotateReverse(angle, m) |> ignore

  member _.Transform(v: Vec2, ?result: Vec2) =
    let result = Vec2.OptionalVec result
    result.X <- values.[0] * v.X + values.[1] * v.Y + values.[4]
    result.Y <- values.[2] * v.X + values.[3] * v.Y + values.[5]
    result

  override _.ToString() =
    let v = values
    sprintf "%10.2f %10.2f\n" (v.[0]) (v.[1]) +
    sprintf "%10.2f %10.2f\n" (v.[2]) (v.[3]) +
    sprintf "%10.2f %10.2f"   (v.[4]) (v.[4])

type Mat3(values) as m =
  let optionalMat mat = Option.defaultValue m mat

  static member Identity with get() = [|
    1.0; 0.0; 0.0
    0.0; 1.0; 0.0
    0.0; 0.0; 1.0
    |]

  static member Create() = Mat3(Mat3.Identity)

  member val Values = values with get

  member _.SetToIdentity() =
    values.[0] <- 1.0
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- 1.0
    values.[5] <- 0.0
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 1.0

  member _.Set(newValues: float[]) =
    values.[0] <- newValues.[0]
    values.[1] <- newValues.[1]
    values.[2] <- newValues.[2]
    values.[3] <- newValues.[3]
    values.[4] <- newValues.[4]
    values.[5] <- newValues.[5]
    values.[6] <- newValues.[6]
    values.[7] <- newValues.[7]
    values.[8] <- newValues.[8]
    m

  member _.Projection(width, height, ?result: Mat3) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- 2.0 / width
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- -2.0 / height
    values.[5] <- 0.0
    values.[6] <- -1.0
    values.[7] <- 1.0
    values.[8] <- 1.0
    result

  member _.ProjectionM(width, height) =
    m.Projection(width, height, m) |> ignore

  member _.Translation(x, y, ?result: Mat3) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- 1.0
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- 1.0
    values.[5] <- 0.0
    values.[6] <- x
    values.[7] <- y
    values.[8] <- 1.0
    result

  member _.RotationTrigZ(cos, sin, ?result: Mat3) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- cos
    values.[1] <- sin
    values.[2] <- 0.0
    values.[3] <- -sin
    values.[4] <- cos
    values.[5] <- 0.0
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 1.0
    result

  member _.RotationZ(angle: float<rad>, ?result: Mat3) =
    let ang = float angle in m.RotationTrigZ(cos ang, sin ang, ?result = result)

  member _.Mult(other: Mat3, ?result: Mat3) =
    let result = optionalMat result
    let values = result.Values
    let ovalues = other.Values
    let a00 = values.[0]
    let a01 = values.[1]
    let a02 = values.[2]
    let a10 = values.[3]
    let a11 = values.[4]
    let a12 = values.[5]
    let a20 = values.[6]
    let a21 = values.[7]
    let a22 = values.[8]
    let b00 = ovalues.[0]
    let b01 = ovalues.[1]
    let b02 = ovalues.[2]
    let b10 = ovalues.[3]
    let b11 = ovalues.[4]
    let b12 = ovalues.[5]
    let b20 = ovalues.[6]
    let b21 = ovalues.[7]
    let b22 = ovalues.[8]
    values.[0] <- a00 * b00 + a10 * b01 + a20 * b02
    values.[1] <- a01 * b00 + a11 * b01 + a21 * b02
    values.[2] <- a02 * b00 + a12 * b01 + a22 * b02
    values.[3] <- a00 * b10 + a10 * b11 + a20 * b12
    values.[4] <- a01 * b10 + a11 * b11 + a21 * b12
    values.[5] <- a02 * b10 + a12 * b11 + a22 * b12
    values.[6] <- a00 * b20 + a10 * b21 + a20 * b22
    values.[7] <- a01 * b20 + a11 * b21 + a21 * b22
    values.[8] <- a02 * b20 + a12 * b21 + a22 * b22
    result

  member _.MultM(other: Mat3) =
    m.Mult(other, m) |> ignore

  member _.Transform(v: Vec3, ?result: Vec3) =
    let result = Vec3.OptionalVec result
    let a00 = values.[0]
    let a01 = values.[1]
    let a02 = values.[2]
    let a10 = values.[3]
    let a11 = values.[4]
    let a12 = values.[5]
    let a20 = values.[6]
    let a21 = values.[7]
    let a22 = values.[8]
    result.X <- a00 * v.X + a10 * v.Y + a20 * v.Z
    result.Y <- a01 * v.X + a11 * v.Y + a21 * v.Z
    result.Z <- a02 * v.X + a12 * v.Y + a22 * v.Z
    result

  override _.ToString() =
    let v = values
    sprintf "%10.2f %10.2f %10.2f\n" (v.[0]) (v.[1]) (v.[2]) +
    sprintf "%10.2f %10.2f %10.2f\n" (v.[3]) (v.[4]) (v.[5]) +
    sprintf "%10.2f %10.2f %10.2f"   (v.[6]) (v.[7]) (v.[8])

type Mat4(values) as m =
  let optionalMat mat = Option.defaultValue m mat

  static member Identity with get() = [|
    1.0; 0.0; 0.0; 0.0
    0.0; 1.0; 0.0; 0.0
    0.0; 0.0; 1.0; 0.0
    0.0; 0.0; 0.0; 1.0
    |]

  static member Create() = Mat4(Mat4.Identity)

  member val Values = values with get

  member _.SetToIdentity() =
    values.[0] <- 1.0
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- 0.0
    values.[5] <- 1.0
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 0.0
    values.[9] <- 0.0
    values.[10] <- 1.0
    values.[11] <- 0.0
    values.[12] <- 0.0
    values.[13] <- 0.0
    values.[14] <- 0.0
    values.[15] <- 1.0

  member _.Set(newValues: float[]) =
    values.[0] <- newValues.[0]
    values.[1] <- newValues.[1]
    values.[2] <- newValues.[2]
    values.[3] <- newValues.[3]
    values.[4] <- newValues.[4]
    values.[5] <- newValues.[5]
    values.[6] <- newValues.[6]
    values.[7] <- newValues.[7]
    values.[8] <- newValues.[8]
    values.[9] <- newValues.[9]
    values.[10] <- newValues.[10]
    values.[11] <- newValues.[11]
    values.[12] <- newValues.[12]
    values.[13] <- newValues.[13]
    values.[14] <- newValues.[14]
    values.[15] <- newValues.[15]

  member _.Projection(width, height, depth, ?result: Mat4) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- 2.0 / width
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- 0.0
    values.[5] <- -2.0 / height
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 0.0
    values.[9] <- 0.0
    values.[10] <- 2.0 / depth
    values.[11] <- 0.0
    values.[12] <- -1.0
    values.[13] <- 1.0
    values.[14] <- 0.0
    values.[15] <- 1.0
    result

  member _.ProjectionM(width, height, depth) =
    m.Projection(width, height, depth, m) |> ignore

  member _.LookAt(cameraPosition: Vec3, target: Vec3, up: Vec3, ?result: Mat4) =
    let camera = cameraPosition
    let zAxis = !!(camera - target)
    let xAxis = !!(up +* zAxis)
    let yAxis = !!(zAxis +* xAxis)
    let result = optionalMat result
    let values = result.Values
    values.[0] <- xAxis.X
    values.[1] <- xAxis.Y
    values.[2] <- xAxis.Z
    values.[3] <- 0.0
    values.[4] <- yAxis.X
    values.[5] <- yAxis.Y
    values.[6] <- yAxis.Z
    values.[7] <- 0.0
    values.[8] <- zAxis.X
    values.[9] <- zAxis.Y
    values.[10] <- zAxis.Z
    values.[11] <- 0.0
    values.[12] <- -camera.X
    values.[13] <- -camera.Y
    values.[14] <- -camera.Z
    values.[15] <- 1.0
    result

  member _.LookAtM(cameraPosition: Vec3, target: Vec3, up: Vec3) =
    m.LookAt(cameraPosition, target, up, m) |> ignore

  member _.Ortho(left, right, bottom, top, near, far, ?result: Mat4) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- 2.0 / (right - left)
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- 0.0
    values.[5] <- 2.0 / (top - bottom)
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 0.0
    values.[9] <- 0.0
    values.[10] <- 2.0 / (near - far)
    values.[11] <- 0.0
    values.[12] <- (left + right) / (left - right)
    values.[13] <- (bottom + top) / (bottom - top)
    values.[14] <- (near + far) / (near - far)
    values.[15] <- 1.0
    result

  member _.OrthoM(left, right, bottom, top, near, far) =
    m.Ortho(left, right, bottom, top, near, far, m) |> ignore

  member _.Perspective(fov: float<rad>, aspect, near, far, ?result: Mat4) =
    let result = optionalMat result
    let values = result.Values
    let f = tan (Math.PI * 0.5 - float fov * 0.5)
    let rangeInv = 1.0 / (near - far)
    values.[0] <- f / aspect
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- 0.0
    values.[5] <- f
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 0.0
    values.[9] <- 0.0
    values.[10] <- (near + far) * rangeInv
    values.[11] <- -1.0
    values.[12] <- 0.0
    values.[13] <- 0.0
    values.[14] <- near * far * rangeInv * 2.0
    values.[15] <- 0.0
    result

  member _.PerspectiveM(fov: float<rad>, aspect, near, far) =
    m.Perspective(fov, aspect, near, far, m) |> ignore

  member _.Translation(x, y, z, ?result: Mat4) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- 1.0
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- 0.0
    values.[5] <- 1.0
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 0.0
    values.[9] <- 0.0
    values.[10] <- 1.0
    values.[11] <- 0.0
    values.[12] <- x
    values.[13] <- y
    values.[14] <- z
    values.[15] <- 1.0
    result

  member _.Scaled(x, y, z, ?result: Mat4) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- x
    values.[1] <- 0.0
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- 0.0
    values.[5] <- y
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 0.0
    values.[9] <- 0.0
    values.[10] <- z
    values.[11] <- 0.0
    values.[12] <- 0.0
    values.[13] <- 0.0
    values.[14] <- 0.0
    values.[15] <- 1.0
    result

  member _.RotationTrigZ(cos, sin, ?result: Mat4) =
    let result = optionalMat result
    let values = result.Values
    values.[0] <- cos
    values.[1] <- sin
    values.[2] <- 0.0
    values.[3] <- 0.0
    values.[4] <- -sin
    values.[5] <- cos
    values.[6] <- 0.0
    values.[7] <- 0.0
    values.[8] <- 0.0
    values.[9] <- 0.0
    values.[10] <- 1.0
    values.[11] <- 0.0
    values.[12] <- 0.0
    values.[13] <- 0.0
    values.[14] <- 0.0
    values.[15] <- 1.0
    result

  member _.RotationZ(angle: float<rad>, ?result: Mat4) =
    let ang = float angle in m.RotationTrigZ(cos ang, sin ang, ?result = result)

  member _.Mult(other: Mat4, ?result: Mat4) =
    let result = optionalMat result
    let a = values
    let b = other.Values
    let values = result.Values

    let a00 = a.[0]
    let a01 = a.[1]
    let a02 = a.[2]
    let a03 = a.[3]
    let a10 = a.[4]
    let a11 = a.[5]
    let a12 = a.[6]
    let a13 = a.[7]
    let a20 = a.[8]
    let a21 = a.[9]
    let a22 = a.[10]
    let a23 = a.[11]
    let a30 = a.[12]
    let a31 = a.[13]
    let a32 = a.[14]
    let a33 = a.[15]
    let b00 = b.[0]
    let b01 = b.[1]
    let b02 = b.[2]
    let b03 = b.[3]
    let b10 = b.[4]
    let b11 = b.[5]
    let b12 = b.[6]
    let b13 = b.[7]
    let b20 = b.[8]
    let b21 = b.[9]
    let b22 = b.[10]
    let b23 = b.[11]
    let b30 = b.[12]
    let b31 = b.[13]
    let b32 = b.[14]
    let b33 = b.[15]
    values.[0] <- b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
    values.[1] <- b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
    values.[2] <- b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
    values.[3] <- b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
    values.[4] <- b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
    values.[5] <- b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
    values.[6] <- b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
    values.[7] <- b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
    values.[8] <- b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
    values.[9] <- b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
    values.[10] <- b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
    values.[11] <- b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
    values.[12] <- b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
    values.[13] <- b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
    values.[14] <- b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
    values.[15] <- b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
    result

  member _.MultM(other: Mat4) =
    m.Mult(other, m) |> ignore

  member _.Translate(x, y, z, ?result: Mat4) =
    let temp = Mat4.Create()
    m.Mult(m.Translation(x, y, z, temp), ?result = result)

  member _.TranslateM(x, y, z) =
    m.Translate(x, y, z, m) |> ignore

  member _.Scale(x, y, z, ?result: Mat4) =
    let temp = Mat4.Create()
    m.Mult(m.Scaled(x, y, z, temp), ?result = result)

  member _.ScaleM(x, y, z) =
    m.Scale(x, y, z, m) |> ignore

  member _.RotateTrigZ(cos, sin, ?result: Mat4) =
    let temp = Mat4.Create()
    m.Mult(m.RotationTrigZ(cos, sin, temp), ?result = result)

  member _.RotateTrigZM(cos, sin) =
    m.RotateTrigZ(cos, sin, m) |> ignore

  member _.RotateZ(angle: float<rad>, ?result: Mat4) =
    let ang = float angle in m.RotateTrigZ(cos ang, sin ang, ?result = result)

  member _.RotateZM(angle: float<rad>) =
    m.RotateZ(angle, m) |> ignore

  member _.Inverse(?result: Mat4) =
    let result = result |> Option.defaultWith Mat4.Create
    let m00 = values.[0]
    let m01 = values.[1]
    let m02 = values.[2]
    let m03 = values.[3]
    let m10 = values.[4]
    let m11 = values.[5]
    let m12 = values.[6]
    let m13 = values.[7]
    let m20 = values.[8]
    let m21 = values.[9]
    let m22 = values.[10]
    let m23 = values.[11]
    let m30 = values.[12]
    let m31 = values.[13]
    let m32 = values.[14]
    let m33 = values.[15]
    let tmp00 = m22 * m33
    let tmp01 = m32 * m23
    let tmp02 = m12 * m33
    let tmp03 = m32 * m13
    let tmp04 = m12 * m23
    let tmp05 = m22 * m13
    let tmp06 = m02 * m33
    let tmp07 = m32 * m03
    let tmp08 = m02 * m23
    let tmp09 = m22 * m03
    let tmp10 = m02 * m13
    let tmp11 = m12 * m03
    let tmp12 = m20 * m31
    let tmp13 = m30 * m21
    let tmp14 = m10 * m31
    let tmp15 = m30 * m11
    let tmp16 = m10 * m21
    let tmp17 = m20 * m11
    let tmp18 = m00 * m31
    let tmp19 = m30 * m01
    let tmp20 = m00 * m21
    let tmp21 = m20 * m01
    let tmp22 = m00 * m11
    let tmp23 = m10 * m01

    let t0 = (tmp00 * m11 + tmp03 * m21 + tmp04 * m31) - (tmp01 * m11 + tmp02 * m21 + tmp05 * m31)
    let t1 = (tmp01 * m01 + tmp06 * m21 + tmp09 * m31) - (tmp00 * m01 + tmp07 * m21 + tmp08 * m31)
    let t2 = (tmp02 * m01 + tmp07 * m11 + tmp10 * m31) - (tmp03 * m01 + tmp06 * m11 + tmp11 * m31)
    let t3 = (tmp05 * m01 + tmp08 * m11 + tmp11 * m21) - (tmp04 * m01 + tmp09 * m11 + tmp10 * m21)

    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)
    let values = result.Values
    values.[0] <- t0 * d
    values.[1] <- t1 * d
    values.[2] <- t2 * d
    values.[3] <- t3 * d
    values.[4] <- ((tmp01 * m10 + tmp02 * m20 + tmp05 * m30) - (tmp00 * m10 + tmp03 * m20 + tmp04 * m30)) * d
    values.[5] <- ((tmp00 * m00 + tmp07 * m20 + tmp08 * m30) - (tmp01 * m00 + tmp06 * m20 + tmp09 * m30)) * d
    values.[6] <- ((tmp03 * m00 + tmp06 * m10 + tmp11 * m30) - (tmp02 * m00 + tmp07 * m10 + tmp10 * m30)) * d
    values.[7] <- ((tmp04 * m00 + tmp09 * m10 + tmp10 * m20) - (tmp05 * m00 + tmp08 * m10 + tmp11 * m20)) * d
    values.[8] <- ((tmp12 * m13 + tmp15 * m23 + tmp16 * m33) - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33)) * d
    values.[9] <- ((tmp13 * m03 + tmp18 * m23 + tmp21 * m33) - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33)) * d
    values.[10] <- ((tmp14 * m03 + tmp19 * m13 + tmp22 * m33) - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33)) * d
    values.[11] <- ((tmp17 * m03 + tmp20 * m13 + tmp23 * m23) - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23)) * d
    values.[12] <- ((tmp14 * m22 + tmp17 * m32 + tmp13 * m12) - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22)) * d
    values.[13] <- ((tmp20 * m32 + tmp12 * m02 + tmp19 * m22) - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02)) * d
    values.[14] <- ((tmp18 * m12 + tmp23 * m32 + tmp15 * m02) - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12)) * d
    values.[15] <- ((tmp22 * m22 + tmp16 * m02 + tmp21 * m12) - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02)) * d
    result

  member _.InverseM() =
    m.Inverse(m) |> ignore

  override _.ToString() =
    let v = values
    sprintf "%10.2f %10.2f %10.2f %10.2f\n" (v.[0]) (v.[1]) (v.[2]) (v.[3]) +
    sprintf "%10.2f %10.2f %10.2f %10.2f\n" (v.[4]) (v.[5]) (v.[6]) (v.[7]) +
    sprintf "%10.2f %10.2f %10.2f %10.2f\n" (v.[8]) (v.[9]) (v.[10]) (v.[11]) +
    sprintf "%10.2f %10.2f %10.2f %10.2f" (v.[12]) (v.[13]) (v.[14]) (v.[15])
