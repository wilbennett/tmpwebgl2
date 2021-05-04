namespace Wil.Core

module Utils =
  open System
  open System.Text.RegularExpressions

  [<Measure>]
  type rad

  [<Measure>]
  type deg

  [<Measure>]
  type px

  let inline throw msg = raise (exn msg)
  let inline fract x = x - floor x
  let isPowerOf2 x = x &&& (x - 1) = 0
  let adjustOffset offset align = (ceil(float offset / float align) |> int) * align
  let boolToInt b = if b then 1 else 0
  let inline asArray<'a> (o: obj) = o :?> 'a[]

  let ONE_RADIAN = 180.0 / Math.PI
  let ONE_DEGREE = Math.PI / 180.0
  let RAD_PER_DEG = ONE_DEGREE * 1.0<rad>
  let DEG_PER_RAD = ONE_RADIAN * 1.0<deg>

  let inline radians v = v * 1.0<rad>
  let inline degrees v = v * 1.0<deg>

  let inline toRadians (degrees: float<deg>) : float<rad> = float degrees * RAD_PER_DEG
  let inline toDegrees (radians: float<rad>) : float<deg> = float radians * DEG_PER_RAD
  let inline pixels (value: float) : float<px> = value * 1.0<px>

  let inline lerp a b t = a * (1.0 - t) + b * t
  let inline lerpc a c t = a + t * c

  let clipString count (str: string) =
    if str.Length > count
    then str.Substring(0, count - 3) + "..."
    else str

  let clipArray count (arr: 'a[]) = clipString count (sprintf "%A" arr)
  let clipObj count o = clipString count (o.ToString())

  let enumName enumType value =
    Enum.GetName(enumType, value)

  let stringJoin (sep: string) (str: string seq) = String.Join(sep, str)

  let addLineNumbers (txt: string) =
    Regex.Split(txt, "\r?\n")
    |> Array.mapi (fun i s -> $"%4i{i + 1}: {s}")
    |> stringJoin "\r\n"
