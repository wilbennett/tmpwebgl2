import { WebglShaderUtils_addVertexShaderSource, WebglShaderUtils_addShaderInclude } from "../webgl_core/shader_utils.js";
import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { tryFind, ofSeq } from "../.fable/fable-library.3.0.0/Map.js";
import { map } from "../.fable/fable-library.3.0.0/Seq.js";
import { BuilderTypes_GlUniformProp, BuilderTypes_GlAttrProp, BuilderTypes_GlObjProp, Data_GlUniformData__get_Name } from "../webgl_data/webgl_data.js";
import { allUniforms } from "../webgl_data/glcommon.js";
import { WebglObject$reflection, WebglObject, WebglObject__get_ObjectDef } from "./webglobject.js";
import { uncurry, comparePrimitives } from "../.fable/fable-library.3.0.0/Util.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { setValue } from "../webgl_data/gluniform.js";
import { Vec2_Create, Vec_vec2Values, Vec4__get_Values, Vec4_$ctor_Z14AF5965, Vec2__get_Values, Vec2_$ctor_Z33A93963 } from "../core/vectors.js";
import { getAttribute } from "../webgl_data/globj.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { blendFunc } from "../webgl_data/glcapabilities.js";
import { Props_globject, UboProps_u, ObjectProps_ubo, InterleaveProps_child, ObjectProps_interleave } from "./props.js";
import { append } from "../.fable/fable-library.3.0.0/Array.js";
import { singleton, ofArray } from "../.fable/fable-library.3.0.0/List.js";
import { GlCanvasParams__get_MiterFallback, GlCanvasParams__get_MiterLimit, GlCanvasParams__get_LineJoin, GlCanvasParams__get_LineCap, GlCanvasParams__get_LineWidth, GlCanvasParams__get_StrokeColor } from "../webgl_data/glcanvasparams.js";
import { worldToPixels, pixelsToWorld } from "../webgl_data/glscene.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { setValue as setValue_1, setValues } from "../webgl_data/glattrib.js";

WebglShaderUtils_addShaderInclude("linepath-params", "\r\nuniform linepathParams {\r\n  vec4 strokeColor;\r\n  float lineWidth;\r\n  int lineCap;\r\n  int lineJoin;\r\n  float miterLimit;\r\n  int miterFallback;\r\n  int instanceCount;\r\n};");

const Shaders_linePath2dVertex = "#version 300 es\r\n// LinePathObject2D\r\n#include precision\r\n#include linepath-params\r\n#include path-outvars\r\n#include circle-outvars\r\n// #include lines2d-vertex\r\n// #include lines2d2-vertex\r\n// #include lines2d3-vertex\r\n#include sdf-consts\r\n#include sdf-line-outvars\r\n#include lines2d4-vertex\r\n#line 40\r\n\r\nin vec2 priorA;\r\nin vec2 a;\r\nin vec2 b;\r\nin vec2 c;\r\n\r\nvoid main() {\r\n  // vec3 position = linepath2d(a, b, c, lineWidth, lineCap, lineJoin, miterLimit, miterFallback, gl_InstanceID, instanceCount, gl_VertexID, v_isCircle, v_circleCenter, v_radiusDirection);\r\n  vec2 position = linepath2d(priorA, a, b, c, lineWidth, lineCap, lineJoin, miterLimit, miterFallback, gl_InstanceID, instanceCount, gl_VertexID, 2.0, worldScale, v_sdfLineParams, v_sdfPriorLineParams, v_sdfNextLineParams);\r\n\r\n  gl_Position = modelToClip(position);\r\n  v_fillColor = strokeColor;\r\n  v_strokeColor = strokeColor;\r\n\r\n  // if (gl_VertexID \u003e 1) v_strokeColor = vec4(vec3(1.0 - v_strokeColor.rgb), v_strokeColor.a);\r\n  // if (gl_VertexID % 3 == 0) v_fillColor = vec4(vec3(1.0 - v_fillColor.rgb), v_fillColor.a);\r\n  // if (gl_VertexID \u003e 5) v_fillColor = vec4(0.0, 0.0, 0.0, 1.0);\r\n  // if (gl_VertexID / 6 == 2 \u0026\u0026 gl_InstanceID != instanceCount - 1) {\r\n  //   if (gl_VertexID % 6 \u003c 3)\r\n  //     v_fillColor = vec4(vec3(0.0), 1.0);\r\n  //   else\r\n  //     v_fillColor = vec4(0.0, 1.0, 0.0, 1.0);\r\n  // }\r\n  // if (gl_VertexID / 6 != 2) gl_Position = vec4(0.0);\r\n}";

const Shaders_linePath2dVertexKey = "linePath2dVertex";

WebglShaderUtils_addVertexShaderSource(Shaders_linePath2dVertexKey, Shaders_linePath2dVertex);

export class LinePathObject2D extends WebglObject {
    constructor(config, scene, points, layer, name, linkTo, parallaxCam, parallaxDistance) {
        super(scene, uncurry(2, (() => {
            const props = ofArray([new BuilderTypes_GlObjProp(0, defaultArg(name, "")), new BuilderTypes_GlObjProp(26, defaultArg(linkTo, "")), new BuilderTypes_GlObjProp(17, defaultArg(parallaxCam, "")), new BuilderTypes_GlObjProp(18, defaultArg(parallaxDistance, 1)), new BuilderTypes_GlObjProp(19, defaultArg(layer, scene.DefaultLayer)), new BuilderTypes_GlObjProp(3, 4), new BuilderTypes_GlObjProp(2, 5), new BuilderTypes_GlObjProp(8, -2), blendFunc(1, 771), ObjectProps_interleave("priorA", ofArray([new BuilderTypes_GlAttrProp(9), new BuilderTypes_GlAttrProp(10, 1), new BuilderTypes_GlAttrProp(5, Vec_vec2Values(append([Vec2_Create()], points))), InterleaveProps_child("a", ofArray([new BuilderTypes_GlAttrProp(10, 1), new BuilderTypes_GlAttrProp(2)])), InterleaveProps_child("b", ofArray([new BuilderTypes_GlAttrProp(10, 1), new BuilderTypes_GlAttrProp(2)])), InterleaveProps_child("c", ofArray([new BuilderTypes_GlAttrProp(10, 1), new BuilderTypes_GlAttrProp(2)]))])), ObjectProps_ubo("linepathParams", ofArray([UboProps_u("strokeColor", singleton(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(GlCanvasParams__get_StrokeColor(config))))), UboProps_u("lineWidth", singleton(new BuilderTypes_GlUniformProp(0, pixelsToWorld(GlCanvasParams__get_LineWidth(config), scene)))), UboProps_u("lineCap", singleton(new BuilderTypes_GlUniformProp(0, GlCanvasParams__get_LineCap(config)))), UboProps_u("lineJoin", singleton(new BuilderTypes_GlUniformProp(0, GlCanvasParams__get_LineJoin(config)))), UboProps_u("miterLimit", singleton(new BuilderTypes_GlUniformProp(0, pixelsToWorld(GlCanvasParams__get_MiterLimit(config), scene)))), UboProps_u("miterFallback", singleton(new BuilderTypes_GlUniformProp(0, GlCanvasParams__get_MiterFallback(config)))), UboProps_u("instanceCount", singleton(new BuilderTypes_GlUniformProp(0, 2)))]))]);
            return (overrides) => ((scene_3) => Props_globject(Shaders_linePath2dVertexKey, "linepath2d-fragment", props, overrides, scene_3));
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
        this.setInt = ((name_4, value_2) => {
            let name_6, matchValue_1, msg_1, uniform_1;
            setValue(value_2, (name_6 = name_4, (matchValue_1 = tryFind(name_6, uniforms), (matchValue_1 == null) ? (msg_1 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_6])), (() => {
                throw (new Error(msg_1));
            })()) : (uniform_1 = matchValue_1, uniform_1))));
        });
        this.getFloat = ((name_7) => {
            let name_9, matchValue_2, msg_2, uniform_2;
            return (name_9 = name_7, (matchValue_2 = tryFind(name_9, uniforms), (matchValue_2 == null) ? (msg_2 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_9])), (() => {
                throw (new Error(msg_2));
            })()) : (uniform_2 = matchValue_2, uniform_2))).Value[0];
        });
        this.setFloat = ((name_10, value_4) => {
            let name_12, matchValue_3, msg_3, uniform_3;
            setValue(value_4, (name_12 = name_10, (matchValue_3 = tryFind(name_12, uniforms), (matchValue_3 == null) ? (msg_3 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_12])), (() => {
                throw (new Error(msg_3));
            })()) : (uniform_3 = matchValue_3, uniform_3))));
        });
        const getVec2 = (name_13) => {
            let name_15, matchValue_4, msg_4, uniform_4;
            return Vec2_$ctor_Z33A93963((name_15 = name_13, (matchValue_4 = tryFind(name_15, uniforms), (matchValue_4 == null) ? (msg_4 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_15])), (() => {
                throw (new Error(msg_4));
            })()) : (uniform_4 = matchValue_4, uniform_4))).Value);
        };
        const setVec2 = (name_16, value_6) => {
            let data_5;
            const name_18 = name_16;
            const matchValue_5 = tryFind(name_18, uniforms);
            if (matchValue_5 == null) {
                const msg_5 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_18]));
                throw (new Error(msg_5));
            }
            else {
                const uniform_5 = matchValue_5;
                data_5 = uniform_5;
            }
            setValue(Vec2__get_Values(value_6), data_5);
        };
        this.getVec4 = ((name_19) => {
            let name_21, matchValue_6, msg_6, uniform_6;
            return Vec4_$ctor_Z14AF5965((name_21 = name_19, (matchValue_6 = tryFind(name_21, uniforms), (matchValue_6 == null) ? (msg_6 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_21])), (() => {
                throw (new Error(msg_6));
            })()) : (uniform_6 = matchValue_6, uniform_6))).Value);
        });
        this.setVec4 = ((name_22, value_9) => {
            let data_6;
            const name_24 = name_22;
            const matchValue_7 = tryFind(name_24, uniforms);
            if (matchValue_7 == null) {
                const msg_7 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_24]));
                throw (new Error(msg_7));
            }
            else {
                const uniform_7 = matchValue_7;
                data_6 = uniform_7;
            }
            setValue(Vec4__get_Values(value_9), data_6);
        });
        this.a = getAttribute("priorA")(WebglObject__get_ObjectDef(o.contents));
        this["init@71-10"] = 1;
        LinePathObject2D__updateInstanceCount(this);
    }
}

export function LinePathObject2D$reflection() {
    return class_type("Wil.Webgl.LinePathObject2D", void 0, LinePathObject2D, WebglObject$reflection());
}

export function LinePathObject2D_$ctor_3F122D1B(config, scene, points, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return new LinePathObject2D(config, scene, points, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function LinePathObject2D__get_StrokeColor(_) {
    return _.getVec4("strokeColor");
}

export function LinePathObject2D__set_StrokeColor_Z3D47FC58(_, value) {
    _.setVec4("strokeColor", value);
}

export function LinePathObject2D__get_LineWidth(_) {
    return pixelsToWorld(_.getFloat("lineWidth") * 1, _.scene_1);
}

export function LinePathObject2D__set_LineWidth_5E38073B(_, value) {
    _.setFloat("lineWidth", worldToPixels(value, _.scene_1));
}

export function LinePathObject2D__get_LineCap(_) {
    return _.getInt("lineCap");
}

export function LinePathObject2D__set_LineCap_7B1263D0(_, value) {
    _.setInt("lineCap", value);
}

export function LinePathObject2D__get_LineJoin(_) {
    return _.getInt("lineJoin");
}

export function LinePathObject2D__set_LineJoin_Z229C3C20(_, value) {
    _.setInt("lineJoin", value);
}

export function LinePathObject2D__get_MiterFallback(_) {
    return _.getInt("miterFallback");
}

export function LinePathObject2D__set_MiterFallback_Z229C3C20(_, value) {
    _.setInt("miterFallback", value);
}

export function LinePathObject2D__get_MiterLimit(_) {
    return _.getFloat("miterLimit");
}

export function LinePathObject2D__set_MiterLimit_5E38073B(_, value) {
    _.setFloat("miterLimit", value);
}

export function LinePathObject2D__Add_Z3D47FC52(_, point) {
    const aValues = LinePathObject2D__getValues(_);
    setValues(append(aValues, Vec2__get_Values(point), Float64Array), _.a);
    LinePathObject2D__updateInstanceCount(_);
}

export function LinePathObject2D__Add_50C79F88(_, points) {
    const aValues = LinePathObject2D__getValues(_);
    setValues(append(aValues, Vec_vec2Values(points), Float64Array), _.a);
    LinePathObject2D__updateInstanceCount(_);
}

export function LinePathObject2D__Set_Z58358D8E(_, index, point) {
    setValue_1(index + 1, Vec2__get_Values(point), _.a);
}

function LinePathObject2D__getValues(this$) {
    const v = this$.a.Values;
    if (v.length === 0) {
        return Vec_vec2Values([Vec2_Create()]);
    }
    else {
        return v;
    }
}

function LinePathObject2D__calcInstanceCount(this$) {
    const aValues = this$.a.Values;
    return ((~(~(aValues.length / 2))) - 2) | 0;
}

function LinePathObject2D__updateInstanceCount(this$) {
    this$.setInt("instanceCount", LinePathObject2D__calcInstanceCount(this$));
}

