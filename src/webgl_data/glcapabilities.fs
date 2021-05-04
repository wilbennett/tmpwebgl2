// [<AutoOpen>]
module GlCapability

open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data

// ====================================================== //
// Depth Testing
// ====================================================== //
let enableDepthTesting = Capability <| enable GlCapability.DEPTH_TEST
let disableDepthTesting = Capability <| disable GlCapability.DEPTH_TEST

let private defaultDepthTesting =
  fun (gl: GL) ->
    gl.disable(gl.DEPTH_TEST)

// ====================================================== //
// Culling
// ====================================================== //
let cullFront =
  let result (gl: GL) =
    enable GlCapability.CULL_FACE gl
    cullFace GlCullMode.FRONT gl
  Capability result

let cullBack =
  let result (gl: GL) =
    enable GlCapability.CULL_FACE gl
    cullFace GlCullMode.BACK gl
  Capability result

let cullFrontAndBack =
  let result (gl: GL) =
    enable GlCapability.CULL_FACE gl
    cullFace GlCullMode.FRONT_AND_BACK gl
  Capability result

let cullFace mode =
  let result (gl: GL) =
    enable GlCapability.CULL_FACE gl
    cullFace mode gl
  Capability result

let enableCulling = Capability <| enable GlCapability.CULL_FACE
let disableCulling = Capability <| disable GlCapability.CULL_FACE

let private defaultCulling =
  fun (gl: GL) ->
    gl.disable(gl.CULL_FACE)
    gl.cullFace(gl.BACK)

// ====================================================== //
// Blending
// ====================================================== //

let blendColor r g b a = Capability <| blendColor r g b a
let blendColorV (color: float[]) = blendColor color.[0] color.[1] color.[2] color.[3]

let blendFunc sfactor dfactor =
  let result (gl: GL) =
    enable GlCapability.BLEND gl
    blendFunc sfactor dfactor gl
  Capability result

let blendFuncSeparate srcRGB dstRGB srcAlpha dstAlpha =
  let result (gl: GL) =
    enable GlCapability.BLEND gl
    blendFuncSeparate srcRGB dstRGB srcAlpha dstAlpha gl
  Capability result

let blendEquation mode = Capability <| blendEquation mode

let blendEquationSeparate modeRGB modeAlpha =
  let result (gl: GL) =
    enable GlCapability.BLEND gl
    blendEquationSeparate modeRGB modeAlpha gl
  Capability result

let enableBlending = Capability <| enable GlCapability.BLEND
let disableBlending = Capability <| disable GlCapability.BLEND

let private defaultBlending =
  fun (gl: GL) ->
    gl.disable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ZERO)
    gl.blendEquation(gl.FUNC_ADD)

// ====================================================== //
// General
// ====================================================== //
let enable cap = Capability <| enable cap
let disable cap = Capability <| disable cap

let defaultCapabilities = [
  defaultDepthTesting
  defaultCulling
  defaultBlending
]

// ====================================================== //
// Shortcuts
// ====================================================== //
let zero = GlBlendFactor.ZERO
let one = GlBlendFactor.ONE
let src_color = GlBlendFactor.SRC_COLOR
let one_minus_src_color = GlBlendFactor.ONE_MINUS_SRC_COLOR
let src_alpha = GlBlendFactor.SRC_ALPHA
let one_minus_src_alpha = GlBlendFactor.ONE_MINUS_SRC_ALPHA
let dst_alpha = GlBlendFactor.DST_ALPHA
let one_minus_dst_alpha = GlBlendFactor.ONE_MINUS_DST_ALPHA
let dst_color = GlBlendFactor.DST_COLOR
let one_minus_dst_color = GlBlendFactor.ONE_MINUS_DST_COLOR
let src_alpha_saturate = GlBlendFactor.SRC_ALPHA_SATURATE
let constant_color = GlBlendFactor.CONSTANT_COLOR
let one_minus_constant_color = GlBlendFactor.ONE_MINUS_CONSTANT_COLOR
let constant_alpha = GlBlendFactor.CONSTANT_ALPHA
let one_minus_constant_alpha = GlBlendFactor.ONE_MINUS_CONSTANT_ALPHA

let func_add = GlBlendMode.FUNC_ADD
let func_subtract = GlBlendMode.FUNC_SUBTRACT
let func_reverse_subtract = GlBlendMode.FUNC_REVERSE_SUBTRACT
let func_min = GlBlendMode.MIN
let func_max = GlBlendMode.MAX
