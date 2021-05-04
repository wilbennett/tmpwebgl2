import { WebglShaderUtils_addVertexShaderSource, WebglShaderUtils_addShaderInclude } from "../webgl_core/shader_utils.js";
import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { tryFind, ofSeq } from "../.fable/fable-library.3.0.0/Map.js";
import { map } from "../.fable/fable-library.3.0.0/Seq.js";
import { BuilderTypes_GlUniformProp, BuilderTypes_GlObjProp, Data_GlUniformData__get_Name } from "../webgl_data/webgl_data.js";
import { allUniforms } from "../webgl_data/glcommon.js";
import { WebglObject$reflection, WebglObject, WebglObject__get_ObjectDef } from "./webglobject.js";
import { uncurry, comparePrimitives } from "../.fable/fable-library.3.0.0/Util.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { setValue } from "../webgl_data/gluniform.js";
import { Vec4__get_Values, Vec4_$ctor_Z14AF5965, Vec2__get_Values, Vec2_$ctor_Z33A93963 } from "../core/vectors.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { blendFunc } from "../webgl_data/glcapabilities.js";
import { Props_globject, UboProps_u, ObjectProps_ubo } from "./props.js";
import { ofArray, singleton } from "../.fable/fable-library.3.0.0/List.js";
import { GlCanvasParams__get_LineCap, GlCanvasParams__get_LineWidth, GlCanvasParams__get_StrokeColor } from "../webgl_data/glcanvasparams.js";
import { pixelsToWorld } from "../webgl_data/glscene.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";

WebglShaderUtils_addShaderInclude("line2d-params", "\r\nuniform line2dParams {\r\n  vec2 p1;\r\n  vec2 p2;\r\n  vec4 strokeColor;\r\n  float lineWidth;\r\n  int lineCap;\r\n};");

const Shaders_line2dVertex = "#version 300 es\r\n// LineObjects2D\r\n#include precision\r\n#include line2d-params\r\n#include path-outvars\r\n#include circle-outvars\r\n// #include lines2d-vertex\r\n// #include lines2d2-vertex\r\n#include lines2d3-vertex\r\n#line 28\r\n\r\nvoid main() {\r\n  vec2 position = line2d(p1, p2, lineWidth, lineCap, gl_VertexID, v_isSemicircle, v_circleCenter, v_radiusDirection);\r\n\r\n  gl_Position = modelToClip(position);\r\n  v_fillColor = strokeColor;\r\n\r\n  // if (gl_VertexID % 6 \u003e= 3) v_fillColor = 1.0 - v_fillColor;\r\n  // if (gl_VertexID % 4 == 0) v_fillColor = vec4(vec3(1.0 - v_fillColor.rgb), v_fillColor.a);\r\n}";

const Shaders_line2dVertexKey = "line2dVertex";

WebglShaderUtils_addVertexShaderSource(Shaders_line2dVertexKey, Shaders_line2dVertex);

export class LineObjects2D extends WebglObject {
    constructor(config, scene, p1, p2, layer, name, linkTo, parallaxCam, parallaxDistance) {
        super(scene, uncurry(2, (() => {
            const props = ofArray([new BuilderTypes_GlObjProp(0, defaultArg(name, "")), new BuilderTypes_GlObjProp(26, defaultArg(linkTo, "")), new BuilderTypes_GlObjProp(17, defaultArg(parallaxCam, "")), new BuilderTypes_GlObjProp(18, defaultArg(parallaxDistance, 1)), new BuilderTypes_GlObjProp(19, defaultArg(layer, scene.DefaultLayer)), new BuilderTypes_GlObjProp(3, 8), new BuilderTypes_GlObjProp(2, 5), blendFunc(1, 771), ObjectProps_ubo("line2dParams", ofArray([UboProps_u("p1", singleton(new BuilderTypes_GlUniformProp(0, Vec2__get_Values(p1)))), UboProps_u("p2", singleton(new BuilderTypes_GlUniformProp(0, Vec2__get_Values(p2)))), UboProps_u("strokeColor", singleton(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(GlCanvasParams__get_StrokeColor(config))))), UboProps_u("lineWidth", singleton(new BuilderTypes_GlUniformProp(0, pixelsToWorld(GlCanvasParams__get_LineWidth(config), scene)))), UboProps_u("lineCap", singleton(new BuilderTypes_GlUniformProp(0, GlCanvasParams__get_LineCap(config))))]))]);
            return (overrides) => ((scene_1) => Props_globject(Shaders_line2dVertexKey, "semicircleFragment2d", props, overrides, scene_1));
        })()));
        const o = new FSharpRef(null);
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
        this.getVec2 = ((name_13) => {
            let name_15, matchValue_4, msg_4, uniform_4;
            return Vec2_$ctor_Z33A93963((name_15 = name_13, (matchValue_4 = tryFind(name_15, uniforms), (matchValue_4 == null) ? (msg_4 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_15])), (() => {
                throw (new Error(msg_4));
            })()) : (uniform_4 = matchValue_4, uniform_4))).Value);
        });
        this.setVec2 = ((name_16, value_4) => {
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
        });
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
        this["init@47-9"] = 1;
    }
}

export function LineObjects2D$reflection() {
    return class_type("Wil.Webgl.LineObjects2D", void 0, LineObjects2D, WebglObject$reflection());
}

export function LineObjects2D_$ctor_22E93213(config, scene, p1, p2, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return new LineObjects2D(config, scene, p1, p2, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function LineObjects2D__get_P1(_) {
    return _.getVec2("p1");
}

export function LineObjects2D__set_P1_Z3D47FC52(_, value) {
    _.setVec2("p1", value);
}

export function LineObjects2D__get_P2(_) {
    return _.getVec2("p2");
}

export function LineObjects2D__set_P2_Z3D47FC52(_, value) {
    _.setVec2("p2", value);
}

export function LineObjects2D__get_StrokeColor(_) {
    return _.getVec4("strokeColor");
}

export function LineObjects2D__set_StrokeColor_Z3D47FC58(_, value) {
    _.setVec4("strokeColor", value);
}

export function LineObjects2D__get_LineWidth(_) {
    return _.getFloat("lineWidth");
}

export function LineObjects2D__set_LineWidth_5E38073B(_, value) {
    _.setFloat("lineWidth", value);
}

export function LineObjects2D__get_LineCap(_) {
    return _.getInt("lineCap");
}

export function LineObjects2D__set_LineCap_7B1263D0(_, value) {
    _.setInt("lineCap", value);
}

