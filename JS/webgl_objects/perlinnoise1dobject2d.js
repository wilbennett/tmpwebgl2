import { WebglShaderUtils_addFragmentShaderSource, WebglShaderUtils_addVertexShaderSource, WebglShaderUtils_addShaderInclude } from "../webgl_core/shader_utils.js";
import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { tryFind, ofSeq } from "../.fable/fable-library.3.0.0/Map.js";
import { map } from "../.fable/fable-library.3.0.0/Seq.js";
import { BuilderTypes_GlUniformProp, BuilderTypes_GlObjProp, Data_GlUniformData__get_Name } from "../webgl_data/webgl_data.js";
import { allUniforms } from "../webgl_data/glcommon.js";
import { WebglObject$reflection, WebglObject, WebglObject__get_ObjectDef } from "./webglobject.js";
import { uncurry, comparePrimitives } from "../.fable/fable-library.3.0.0/Util.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { setValue } from "../webgl_data/gluniform.js";
import { Vec4_Create_32EB7C8E, Vec2_Create_7B00E9A0, Vec4__get_Values, Vec4_$ctor_Z14AF5965, Vec2__get_Values, Vec2_$ctor_Z33A93963 } from "../core/vectors.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { noiseFractalParams, permTexture } from "./perlin_common.js";
import { Props_globject, UboProps_u, ObjectProps_ubo, ObjectProps_pathParams } from "./props.js";
import { ofArray, singleton } from "../.fable/fable-library.3.0.0/List.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";

WebglShaderUtils_addShaderInclude("noise1d-params", "\r\nuniform noise1dParams {\r\n  vec2 size;\r\n  float start;\r\n  float noiseRange;\r\n};");

const Shaders_perlinNoise1d2dVertex = "#version 300 es\r\n// PerlinNoise1dObject2D\r\n#include precision\r\n#include noise1d-params\r\n#include path-params\r\n#include noise-outvars\r\n#include path-outvars\r\n#include coordinate-conversion-vertex\r\n#include quad-points-strip\r\n#line 34\r\n\r\nvoid main() {\r\n  int vertexID = gl_VertexID % 4;\r\n  vec2 position = quadPointsStrip[vertexID] * size;\r\n\r\n  vec2 centerLeft = vec2(-0.5, 0.0) * size;\r\n  vec2 centerLeftS = modelToScreen(centerLeft);\r\n  vec2 centerRight = vec2(0.5, 0.0) * size;\r\n  vec2 centerRightS = modelToScreen(centerRight);\r\n\r\n  gl_Position = modelToClip(position);\r\n  v_noiseStart = vec4(start);\r\n  v_noiseRange = noiseRange;\r\n  v_noiseDim = vec3(size, 0.0);\r\n  v_noiseCenterLeft = centerLeftS;\r\n  v_noiseCenterRight = centerRightS;\r\n  v_fillColor = fillColor;\r\n  v_strokeColor = strokeColor;\r\n  v_strokeWidth = lineWidth;\r\n}";

const Shaders_perlinNoise1d2dFragment = "#version 300 es\r\n// PerlinNoise1dObject2D\r\n#include precision\r\n#include noise-fractal-params\r\n#include noise-invars\r\n#include path-invars\r\n#include out-color-fragment\r\n#include conditionals\r\n#include vec2\r\n#include line-utils\r\n#include perlin-noise\r\n#line 66\r\n\r\nvoid main() {\r\n  vec2 p = gl_FragCoord.xy;\r\n  vec2 a = v_noiseCenterLeft;\r\n  vec2 b = v_noiseCenterRight;\r\n  vec2 ab = b - a;\r\n  vec2 r = normalize(ab);\r\n  vec2 up = perp(r);\r\n  vec2 ap = p - a;\r\n  float noiseScale = v_noiseDim.x / length(ab);\r\n  // float x = v_noiseStart.x + dot(ap, r) * noiseScale;\r\n  // float n = noise(x) * v_noiseRange;\r\n  vec2 coord = vec2(v_noiseStart.x + dot(ap, r) * noiseScale, noiseTime);\r\n  float n = noise(coord) * v_noiseRange;\r\n  float yDist = distToLine(p, up, a);\r\n  vec4 color = abs(n - yDist) \u003c= v_strokeWidth ? v_strokeColor : v_fillColor;\r\n\r\n  if (abs(cross(ap, up)) \u003c= 1.0) color = vec4(0.0, 0.0, 1.0, 1.0);\r\n\r\n\tglFragColor = color;\r\n}";

const Shaders_perlinNoise1d2dVertexKey = "perlinNoise1d2dVertex";

const Shaders_perlinNoise1d2dFragmentKey = "perlinNoise1d2dFragment";

WebglShaderUtils_addVertexShaderSource(Shaders_perlinNoise1d2dVertexKey, Shaders_perlinNoise1d2dVertex);

WebglShaderUtils_addFragmentShaderSource(Shaders_perlinNoise1d2dFragmentKey, Shaders_perlinNoise1d2dFragment);

export class PerlinNoise1DObject2D extends WebglObject {
    constructor(config, scene, size, seed, layer, name, linkTo, parallaxCam, parallaxDistance) {
        super(scene, uncurry(2, (() => {
            const props = ofArray([new BuilderTypes_GlObjProp(0, defaultArg(name, "")), new BuilderTypes_GlObjProp(26, defaultArg(linkTo, "")), new BuilderTypes_GlObjProp(17, defaultArg(parallaxCam, "")), new BuilderTypes_GlObjProp(18, defaultArg(parallaxDistance, 1)), new BuilderTypes_GlObjProp(19, defaultArg(layer, scene.DefaultLayer)), new BuilderTypes_GlObjProp(3, 4), new BuilderTypes_GlObjProp(2, 5), permTexture(defaultArg(seed, 0)), noiseFractalParams, ObjectProps_pathParams(config, scene), ObjectProps_ubo("noise1dParams", ofArray([UboProps_u("size", singleton(new BuilderTypes_GlUniformProp(0, Vec2__get_Values(size)))), UboProps_u("start", singleton(new BuilderTypes_GlUniformProp(0, 0))), UboProps_u("noiseRange", singleton(new BuilderTypes_GlUniformProp(0, 10)))]))]);
            return (overrides) => ((scene_1) => Props_globject(Shaders_perlinNoise1d2dVertexKey, Shaders_perlinNoise1d2dFragmentKey, props, overrides, scene_1));
        })()));
        const o = new FSharpRef(null);
        this.scene_1 = scene;
        o.contents = this;
        const uniforms = ofSeq(map((u) => [Data_GlUniformData__get_Name(u), u], allUniforms(WebglObject__get_ObjectDef(o.contents))), {
            Compare: comparePrimitives,
        });
        this.getInt = ((name_1) => {
            let name_3, matchValue, msg, uniform;
            return (name_3 = name_1, (matchValue = tryFind(name_3, uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_3])), (() => {
                throw (new Error(msg));
            })()) : (uniform = matchValue, uniform))).Value[0];
        });
        this.setInt = ((name_4, value) => {
            let name_6, matchValue_1, msg_1, uniform_1;
            setValue(value, (name_6 = name_4, (matchValue_1 = tryFind(name_6, uniforms), (matchValue_1 == null) ? (msg_1 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_6])), (() => {
                throw (new Error(msg_1));
            })()) : (uniform_1 = matchValue_1, uniform_1))));
        });
        this.getFloat = ((name_7) => {
            let name_9, matchValue_2, msg_2, uniform_2;
            return (name_9 = name_7, (matchValue_2 = tryFind(name_9, uniforms), (matchValue_2 == null) ? (msg_2 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_9])), (() => {
                throw (new Error(msg_2));
            })()) : (uniform_2 = matchValue_2, uniform_2))).Value[0];
        });
        this.setFloat = ((name_10, value_2) => {
            let name_12, matchValue_3, msg_3, uniform_3;
            setValue(value_2, (name_12 = name_10, (matchValue_3 = tryFind(name_12, uniforms), (matchValue_3 == null) ? (msg_3 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_12])), (() => {
                throw (new Error(msg_3));
            })()) : (uniform_3 = matchValue_3, uniform_3))));
        });
        const getVec2 = (name_13) => {
            let name_15, matchValue_4, msg_4, uniform_4;
            return Vec2_$ctor_Z33A93963((name_15 = name_13, (matchValue_4 = tryFind(name_15, uniforms), (matchValue_4 == null) ? (msg_4 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_15])), (() => {
                throw (new Error(msg_4));
            })()) : (uniform_4 = matchValue_4, uniform_4))).Value);
        };
        const setVec2 = (name_16, value_4) => {
            let data_3;
            const name_18 = name_16;
            const matchValue_5 = tryFind(name_18, uniforms);
            if (matchValue_5 == null) {
                const msg_5 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_18]));
                throw (new Error(msg_5));
            }
            else {
                const uniform_5 = matchValue_5;
                data_3 = uniform_5;
            }
            setValue(Vec2__get_Values(value_4), data_3);
        };
        this.getVec4 = ((name_19) => {
            let name_21, matchValue_6, msg_6, uniform_6;
            return Vec4_$ctor_Z14AF5965((name_21 = name_19, (matchValue_6 = tryFind(name_21, uniforms), (matchValue_6 == null) ? (msg_6 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_21])), (() => {
                throw (new Error(msg_6));
            })()) : (uniform_6 = matchValue_6, uniform_6))).Value);
        });
        this.setVec4 = ((name_22, value_7) => {
            let data_4;
            const name_24 = name_22;
            const matchValue_7 = tryFind(name_24, uniforms);
            if (matchValue_7 == null) {
                const msg_7 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_24]));
                throw (new Error(msg_7));
            }
            else {
                const uniform_7 = matchValue_7;
                data_4 = uniform_7;
            }
            setValue(Vec4__get_Values(value_7), data_4);
        });
        this["init@96-14"] = 1;
    }
}

export function PerlinNoise1DObject2D$reflection() {
    return class_type("Wil.Webgl.PerlinNoise1DObject2D", void 0, PerlinNoise1DObject2D, WebglObject$reflection());
}

export function PerlinNoise1DObject2D_$ctor_C1A1B4(config, scene, size, seed, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return new PerlinNoise1DObject2D(config, scene, size, seed, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function PerlinNoise1DObject2D__get_Octaves(_) {
    return _.getInt("octaves");
}

export function PerlinNoise1DObject2D__set_Octaves_Z524259A4(_, value) {
    _.setInt("octaves", value);
}

export function PerlinNoise1DObject2D__get_Frequency(_) {
    const __1 = _.getVec4("frequency");
    return Vec2_Create_7B00E9A0(__1.v.contents.values[0], __1.v.contents.values[1]);
}

export function PerlinNoise1DObject2D__set_Frequency_Z3D47FC52(_, value) {
    _.setVec4("frequency", Vec4_Create_32EB7C8E(value, 0, 0));
}

export function PerlinNoise1DObject2D__get_Amplitude(_) {
    return _.getFloat("amplitude");
}

export function PerlinNoise1DObject2D__set_Amplitude_5E38073B(_, value) {
    _.setFloat("amplitude", value);
}

export function PerlinNoise1DObject2D__get_Lacunarity(_) {
    return _.getFloat("lacunarity");
}

export function PerlinNoise1DObject2D__set_Lacunarity_5E38073B(_, value) {
    _.setFloat("lacunarity", value);
}

export function PerlinNoise1DObject2D__get_Gain(_) {
    return _.getFloat("gain");
}

export function PerlinNoise1DObject2D__set_Gain_5E38073B(_, value) {
    _.setFloat("gain", value);
}

export function PerlinNoise1DObject2D__get_Time(_) {
    return _.getFloat("noiseTime");
}

export function PerlinNoise1DObject2D__set_Time_5E38073B(_, value) {
    _.setFloat("noiseTime", value);
}

export function PerlinNoise1DObject2D__get_Range(_) {
    return _.getFloat("noiseRange");
}

export function PerlinNoise1DObject2D__set_Range_5E38073B(_, value) {
    _.setFloat("noiseRange", value);
}

export function PerlinNoise1DObject2D__get_Start(_) {
    return _.getFloat("start");
}

export function PerlinNoise1DObject2D__set_Start_5E38073B(_, value) {
    _.setFloat("start", value);
}

export function PerlinNoise1DObject2D__get_StrokeColor(_) {
    return _.getVec4("strokeColor");
}

export function PerlinNoise1DObject2D__set_StrokeColor_Z3D47FC58(_, value) {
    _.setVec4("strokeColor", value);
}

export function PerlinNoise1DObject2D__get_FillColor(_) {
    return _.getVec4("fillColor");
}

export function PerlinNoise1DObject2D__set_FillColor_Z3D47FC58(_, value) {
    _.setVec4("fillColor", value);
}

export function PerlinNoise1DObject2D__get_LineWidth(_) {
    return _.getFloat("lineWidth") / _.scene_1.LineWidthScale;
}

export function PerlinNoise1DObject2D__set_LineWidth_5E38073B(_, value) {
    _.setFloat("lineWidth", value * _.scene_1.LineWidthScale);
}

