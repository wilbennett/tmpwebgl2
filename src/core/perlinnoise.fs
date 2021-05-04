namespace Wil.Core

open System
open Wil.Core
open Wil.Core.Utils

module PerlinShared =
  let defaultPerms = [|
    // 108uy;189uy;91uy;56uy;185uy;7uy;75uy;84uy;114uy;127uy;74uy;40uy;109uy;250uy;208uy;65uy;138uy;80uy;177uy;245uy;247uy;254uy;230uy;139uy;154uy;92uy;16uy;29uy;95uy;233uy;59uy;146uy;246uy;198uy;106uy;163uy;57uy;125uy;24uy;26uy;27uy;105uy;239uy;192uy;203uy;61uy;72uy;136uy;195uy;51uy;183uy;20uy;217uy;161uy;67uy;169uy;121uy;85uy;202uy;176uy;184uy;6uy;215uy;156uy;209uy;103uy;115uy;25uy;131uy;180uy;123uy;178uy;42uy;30uy;251uy;70uy;248uy;13uy;12uy;97uy;148uy;96uy;32uy;101uy;201uy;255uy;211uy;122uy;234uy;10uy;126uy;44uy;204uy;15uy;86uy;142uy;110uy;205uy;50uy;11uy;149uy;66uy;222uy;63uy;237uy;197uy;143uy;199uy;242uy;145uy;220uy;213uy;158uy;78uy;23uy;112uy;38uy;128uy;196uy;152uy;170uy;35uy;76uy;191uy;162uy;253uy;159uy;58uy;113uy;168uy;249uy;90uy;238uy;18uy;227uy;99uy;193uy;210uy;118uy;48uy;235uy;28uy;173uy;104uy;147uy;174uy;150uy;190uy;144uy;46uy;212uy;8uy;243uy;116uy;36uy;54uy;52uy;60uy;98uy;181uy;3uy;43uy;22uy;37uy;231uy;0uy;130uy;89uy;71uy;186uy;134uy;157uy;62uy;135uy;117uy;160uy;124uy;69uy;111uy;21uy;175uy;81uy;100uy;41uy;226uy;187uy;207uy;87uy;132uy;119uy;19uy;228uy;55uy;218uy;68uy;153uy;232uy;165uy;4uy;107uy;102uy;129uy;172uy;151uy;194uy;45uy;73uy;240uy;31uy;252uy;179uy;79uy;53uy;39uy;47uy;17uy;221uy;236uy;241uy;49uy;164uy;182uy;137uy;2uy;5uy;171uy;82uy;141uy;120uy;229uy;216uy;9uy;225uy;167uy;219uy;244uy;64uy;223uy;33uy;94uy;88uy;1uy;206uy;77uy;224uy;166uy;83uy;140uy;133uy;34uy;188uy;14uy;155uy;93uy;214uy;200uy
    151uy;137uy;91uy;90uy;160uy;15uy;131uy;13uy;201uy;95uy;96uy;53uy;194uy;233uy;7uy;225uy;140uy;36uy;103uy;30uy;69uy;142uy;8uy;99uy;37uy;240uy;21uy;10uy;23uy;190uy;6uy;148uy;247uy;120uy;234uy;75uy;0uy;26uy;197uy;62uy;94uy;252uy;219uy;203uy;117uy;35uy;11uy;32uy;57uy;177uy;33uy;88uy;237uy;149uy;56uy;87uy;174uy;20uy;125uy;136uy;171uy;168uy;68uy;175uy;74uy;165uy;71uy;134uy;139uy;48uy;27uy;166uy;77uy;146uy;158uy;231uy;83uy;111uy;229uy;122uy;60uy;211uy;133uy;230uy;220uy;105uy;92uy;41uy;55uy;46uy;245uy;40uy;244uy;102uy;143uy;54uy;65uy;25uy;63uy;161uy;1uy;216uy;80uy;73uy;209uy;76uy;132uy;187uy;208uy;89uy;18uy;169uy;200uy;196uy;135uy;130uy;116uy;188uy;159uy;86uy;164uy;100uy;109uy;198uy;173uy;186uy;3uy;64uy;52uy;217uy;226uy;250uy;124uy;123uy;5uy;202uy;38uy;147uy;118uy;126uy;255uy;82uy;85uy;212uy;207uy;206uy;59uy;227uy;47uy;16uy;58uy;17uy;182uy;189uy;28uy;42uy;223uy;183uy;170uy;213uy;119uy;248uy;152uy;2uy;44uy;154uy;163uy;70uy;221uy;153uy;101uy;155uy;167uy;43uy;172uy;9uy;129uy;22uy;39uy;253uy;19uy;98uy;108uy;110uy;79uy;113uy;224uy;232uy;178uy;185uy;112uy;104uy;218uy;246uy;97uy;228uy;251uy;34uy;242uy;193uy;238uy;210uy;144uy;12uy;191uy;179uy;162uy;241uy;81uy;51uy;145uy;235uy;249uy;14uy;239uy;107uy;49uy;192uy;214uy;31uy;181uy;199uy;106uy;157uy;184uy;84uy;204uy;176uy;115uy;121uy;50uy;45uy;127uy;4uy;150uy;254uy;138uy;236uy;205uy;93uy;222uy;114uy;67uy;29uy;24uy;72uy;243uy;141uy;128uy;195uy;78uy;66uy;215uy;61uy;156uy;180uy
    |]

  let createPerm seed =
    if seed = 0 then
      defaultPerms
    else
      let rand = Random(seed)

      Array.init<byte> 256 (fun i -> byte(i))
      |> Array.shuffleInPlace rand.Next

type PerlinNoise() =
  let perms = Array.append PerlinShared.defaultPerms PerlinShared.defaultPerms
  let frequency = Vec4.Create(0.01)

  let fade t = t * t * t * (t * (t * 6.0 - 15.0) + 10.0)

  let perm1 idx = perms.[int idx]
  let perm2 x y = x |> perm1 |> int |> (+) y |> perm1
  let perm3 x y z = x |> perm1 |> int |> (+) y |> perm1 |> int |> (+) z |> perm1

  let grad1 (hash: byte) p = if (hash &&& 1uy) = 0uy then -p else p

  let grad2 (hash: byte) (p: Vec2) =
    match hash &&& 3uy with
    | 0uy ->  p.X + p.Y
    | 1uy -> -p.X + p.Y
    | 2uy ->  p.X - p.Y
    | 3uy -> -p.X - p.Y
    | _ -> throw "Can't happen!"

  let grad3 (hash: byte) (p: Vec3) =
    match hash &&& 0xFuy with
    |  0uy ->  p.X + p.Y
    |  1uy -> -p.X + p.Y
    |  2uy ->  p.X - p.Y
    |  3uy -> -p.X - p.Y
    |  4uy ->  p.X + p.Z
    |  5uy -> -p.X + p.Z
    |  6uy ->  p.X - p.Z
    |  7uy -> -p.X - p.Z
    |  8uy ->  p.Y + p.Z
    |  9uy -> -p.Y + p.Z
    | 10uy ->  p.Y - p.Z
    | 11uy -> -p.Y - p.Z
    | 12uy ->  p.X + p.Y
    | 13uy -> -p.X + p.Y
    | 14uy -> -p.Y + p.Z
    | 15uy -> -p.Y - p.Z
    | _ -> throw "Can't happen!"

  let grad4 (hash: byte) (p: Vec4) =
    match hash &&& 0x1Fuy with
    |  0uy ->  p.X +  p.Y +  p.W
    |  1uy -> -p.X +  p.Y +  p.W
    |  2uy ->  p.X + -p.Y +  p.W
    |  3uy -> -p.X + -p.Y +  p.W
    |  4uy ->  p.X +  p.Z +  p.W
    |  5uy -> -p.X +  p.Z +  p.W
    |  6uy ->  p.X + -p.Z +  p.W
    |  7uy -> -p.X + -p.Z +  p.W
    |  8uy ->  p.Y +  p.Z +  p.W
    |  9uy -> -p.Y +  p.Z +  p.W
    | 10uy ->  p.Y + -p.Z +  p.W
    | 11uy -> -p.Y + -p.Z +  p.W
    | 12uy ->  p.X +  p.Y + -p.W
    | 13uy -> -p.X +  p.Y + -p.W
    | 14uy ->  p.X + -p.Y + -p.W
    | 15uy -> -p.X + -p.Y + -p.W
    | 16uy ->  p.X +  p.Z + -p.W
    | 17uy -> -p.X +  p.Z + -p.W
    | 18uy ->  p.X + -p.Z + -p.W
    | 19uy -> -p.X + -p.Z + -p.W
    | 20uy ->  p.Y +  p.Z + -p.W
    | 21uy -> -p.Y +  p.Z + -p.W
    | 22uy ->  p.Y + -p.Z + -p.W
    | 23uy -> -p.Y + -p.Z + -p.W
    | 24uy ->  p.X +  p.Y +  p.Z
    | 25uy -> -p.X +  p.Y +  p.Z
    | 26uy ->  p.X + -p.Y + -p.Z
    | 27uy -> -p.X + -p.Y + -p.Z
    | 28uy ->  p.X +  p.Y + -p.Z
    | 29uy -> -p.X +  p.Y + -p.Z
    | 30uy ->  p.X + -p.Y +  p.Z
    | 31uy -> -p.X + -p.Y +  p.Z
    | _ -> throw "Can't happen!"

  member val Octaves = 4 with get, set
  member val Frequency = Vec4.Create(0.01) with get, set
  member val Amplitude = 10.0 with get, set
  member val Lacunarity = 2.0 with get, set
  member val Gain = 0.5 with get, set

  // member _.Frequency
  //   with get() = frequency.Clone()
  //   and set(value) = frequency.CopyFrom(value)

  member _.Noise(p) =
    let p0 = fract p
    let p1 = p0 - 1.0
    
    let idx = floor p |> int
    let v0 = perm1 idx
    let v1 = perm1 (idx + 1)

    let fx = fade p0
    lerp (grad1 v0 p0) (grad1 v1 p1) fx

  member _.Noise(p: Vec2) =
    let p0 = p.Fract()             // By subtracting, we are actually
    let p1 = Vec.add2 p0 -1.0  0.0 // Calculating the vector from each
    let p2 = Vec.add2 p0  0.0 -1.0 // corner to p.
    let p3 = Vec.add2 p0 -1.0 -1.0

    let id = p.Floor()
    let v0 = perm2 (int id.X    ) (int id.Y    )
    let v1 = perm2 (int id.X + 1) (int id.Y    )
    let v2 = perm2 (int id.X    ) (int id.Y + 1)
    let v3 = perm2 (int id.X + 1) (int id.Y + 1)

    let fx = fade p0.X
    let fy = fade p0.Y
    let a = lerp (grad2 v0 p0) (grad2 v1 p1) fx
    let b = lerp (grad2 v2 p2) (grad2 v3 p3) fx
    lerp a b fy

  member _.Noise(p: Vec3) =
    let p0 = p.Fract()
    let p1 = Vec.add3 p0 -1.0  0.0  0.0
    let p2 = Vec.add3 p0  0.0 -1.0  0.0
    let p3 = Vec.add3 p0 -1.0 -1.0  0.0
    let p4 = Vec.add3 p0  0.0  0.0 -1.0
    let p5 = Vec.add3 p0 -1.0  0.0 -1.0
    let p6 = Vec.add3 p0  0.0 -1.0 -1.0
    let p7 = Vec.add3 p0 -1.0 -1.0 -1.0

    let id = p.Floor()
    let v0 = perm3 (int id.X    ) (int id.Y    ) (int id.Z    )
    let v1 = perm3 (int id.X + 1) (int id.Y    ) (int id.Z    )
    let v2 = perm3 (int id.X    ) (int id.Y + 1) (int id.Z    )
    let v3 = perm3 (int id.X + 1) (int id.Y + 1) (int id.Z    )
    let v4 = perm3 (int id.X    ) (int id.Y    ) (int id.Z + 1)
    let v5 = perm3 (int id.X + 1) (int id.Y    ) (int id.Z + 1)
    let v6 = perm3 (int id.X    ) (int id.Y + 1) (int id.Z + 1)
    let v7 = perm3 (int id.X + 1) (int id.Y + 1) (int id.Z + 1)

    let fx = fade p0.X
    let fy = fade p0.Y
    let fz = fade p0.Z
    let a1 = lerp (grad3 v0 p0) (grad3 v1 p1) fx
    let b1 = lerp (grad3 v2 p2) (grad3 v3 p3) fx
    let a2 = lerp (grad3 v4 p4) (grad3 v5 p5) fx
    let b2 = lerp (grad3 v6 p6) (grad3 v7 p7) fx
    let c1 = lerp a1 b1 fy
    let c2 = lerp a2 b2 fy
    lerp c1 c2 fz

  member this.Fbm(p: float, ?octaves, ?frequency, ?amplitude, ?lacunarity, ?gain) =
    let mutable freq = defaultArg frequency this.Frequency.X
    let mutable amp = defaultArg amplitude this.Amplitude
    let mutable lac = defaultArg lacunarity this.Lacunarity
    let mutable gain = defaultArg gain this.Gain
    let mutable result = 0.0
    let oct = max (defaultArg octaves this.Octaves) 1

    for i in 0 .. oct - 1 do
      result <- result + this.Noise(p * freq) * amp
      freq <- freq * lac
      amp <- amp * gain

    result

  member this.Fbm(p: Vec2, ?octaves, ?frequency: Vec2, ?amplitude, ?lacunarity, ?gain) =
    let mutable freq = defaultArg frequency this.Frequency.XY
    let mutable amp = defaultArg amplitude this.Amplitude
    let mutable lac = defaultArg lacunarity this.Lacunarity
    let mutable gain = defaultArg gain this.Gain
    let mutable result = 0.0
    let oct = max (defaultArg octaves this.Octaves) 1

    for i in 0 .. oct - 1 do
      result <- result + this.Noise(p * freq) * amp
      freq <- freq * lac
      amp <- amp * gain

    result

  member this.Fbm(p: Vec3, ?octaves, ?frequency: Vec3, ?amplitude, ?lacunarity, ?gain) =
    let mutable freq = defaultArg frequency this.Frequency.XYZ
    let mutable amp = defaultArg amplitude this.Amplitude
    let mutable lac = defaultArg lacunarity this.Lacunarity
    let mutable gain = defaultArg gain this.Gain
    let mutable result = 0.0
    let oct = max (defaultArg octaves this.Octaves) 1

    for i in 0 .. oct - 1 do
      result <- result + this.Noise(p * freq) * amp
      freq <- freq * lac
      amp <- amp * gain

    result

  member this.Turbulence(pos: Vec2, pixelSize) =
    let mutable t = 0.0
    let mutable scale = 1.0
    let p = pos.Clone()

    while scale > pixelSize do
      p /= scale
      t <- t + abs(this.Noise(p)) * scale
      scale <- scale * 0.5

    t //- 0.3 // Avg 0.0.

  member this.Turbulence(pos: Vec3, pixelSize) =
    let mutable t = 0.0
    let mutable scale = 1.0
    let p = pos.Clone()

    while scale > pixelSize do
      p /= scale
      t <- t + abs(this.Noise(p)) * scale
      scale <- scale * 0.5

    t //- 0.3 // Avg 0.0.

[<AutoOpen>]
module Noise =
  let private _noise = PerlinNoise()

  let getOctaves () = _noise.Octaves
  let setOctaves x () = _noise.Octaves <- x
  let getFrequency () = _noise.Frequency
  let setFrequency x () = _noise.Frequency <- x
  let getAmplitude () = _noise.Amplitude
  let setAmplitude x () = _noise.Amplitude <- x
  let getLacunarity () = _noise.Lacunarity
  let setLacunarity x () = _noise.Lacunarity <- x
  let getGain () = _noise.Gain
  let setGain x () = _noise.Gain <- x

  let noise1 (p: float) = _noise.Noise(p)
  let noise2 (p: Vec2) = _noise.Noise(p)
  let noise3 (p: Vec3) = _noise.Noise(p)
  let fbm1 (p: float) = _noise.Fbm(p)
  let fbm2 (p: Vec2) = _noise.Fbm(p)
  let fbm3 (p: Vec3) = _noise.Fbm(p)
  let turbulence2 (p: Vec2) pixelSize = _noise.Turbulence(p, pixelSize)
  let turbulence3 (p: Vec3) pixelSize = _noise.Turbulence(p, pixelSize)
