import { WebglShaderUtils_addVertexShaderSource, WebglShaderUtils_addShaderInclude } from "../webgl_core/shader_utils.js";
import { Vec2_op_Division_Z24FF8540, Vec2_op_Multiply_47807E55, Vec2_op_Addition_47807E55, Vec2_Create_5E38073B, Vec2_$ctor_Z33A93963, Vec4_$ctor_Z14AF5965, Vec2__Clone, Vec2__get_Values, Vec4__get_Values, Vec2__WithXY_6DB1BD7B } from "../core/vectors.js";
import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { tryFind, ofSeq } from "../.fable/fable-library.3.0.0/Map.js";
import { map } from "../.fable/fable-library.3.0.0/Seq.js";
import { BuilderTypes_GlUniformProp, BuilderTypes_GlObjProp, Data_GlUniformData__get_Name } from "../webgl_data/webgl_data.js";
import { allUniforms } from "../webgl_data/glcommon.js";
import { WebglObject$reflection, WebglObject, WebglObject__get_ObjectDef } from "./webglobject.js";
import { uncurry, comparePrimitives } from "../.fable/fable-library.3.0.0/Util.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { Props_globject, UboProps_u, ObjectProps_ubo } from "./props.js";
import { GlCanvasParams__get_LineWidth, GlCanvasParams__get_StrokeColor } from "../webgl_data/glcanvasparams.js";
import { ofArray, singleton } from "../.fable/fable-library.3.0.0/List.js";
import { pixelsToWorld } from "../webgl_data/glscene.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { setValue } from "../webgl_data/gluniform.js";
import { setInstanceCount } from "../webgl_data/globj.js";

const Shaders_gridUbo = "\r\nuniform grid {\r\n  vec4 minorLineColor;\r\n  vec4 majorLineColor;\r\n  vec4 axisLineColor;\r\n  float minorLineWidth;\r\n  float majorLineWidth;\r\n  float axisLineWidth;\r\n  vec2 size;\r\n  vec2 minorTick;\r\n  ivec2 majorTick;\r\n};\r\n";

const Shaders_grid2dVertex = "#version 300 es\r\n// Grid2D\r\n#include precision\r\n#include grid-ubo\r\n#include path-outvars\r\n#include lines2d-vertex\r\n#line 30\r\n// x, y: point a.  z, w: point b.\r\nconst vec4 edgeTemplate[] = vec4[2](\r\n  vec4(0.0, -0.5, 0.0, 0.5), // Vertical\r\n  vec4(-0.5, 0.0, 0.5, 0.0)  // Horizontal\r\n);\r\n\r\nconst vec2 offsetTemplate[] = vec2[2](\r\n  vec2(1.0, 0.0), // Vertical\r\n  vec2(0.0, 1.0)  // Horizontal\r\n);\r\n\r\nfloat priorEvenFloat(float f) {\r\n  int x = int(floor(f));\r\n  return mix(float(x), float(x) - 1.0, float(x % 2));\r\n}\r\n\r\nvec2 priorEven(vec2 v) { return vec2(priorEvenFloat(v.x), priorEvenFloat(v.y)); }\r\n\r\nfloat fmod(float a, float b) {\r\n  float res = abs(a / b);\r\n  return ceil(res) - res;\r\n}\r\n\r\nvoid main() {\r\n  vec2 majorValue = minorTick * vec2(majorTick);\r\n  vec2 esize = priorEven(size);\r\n  ivec2 halfTicks = ivec2(esize * 0.5 / minorTick);\r\n  ivec2 minorTickCount = halfTicks * 2 + 1;\r\n  int instanceCount = minorTickCount.x + minorTickCount.y;\r\n  ivec2 majorOffset = majorTick - (halfTicks % majorTick);\r\n  vec2 start = -vec2(halfTicks) * minorTick;\r\n  int edgeID = int(step(float(minorTickCount.x), float(gl_InstanceID)));\r\n  vec4 edge = edgeTemplate[edgeID];\r\n  vec2 ofs = offsetTemplate[edgeID];\r\n\r\n  vec2 a = edge.xy * size;\r\n  vec2 b = edge.zw * size;\r\n\r\n  int vertexID = gl_VertexID % 6;\r\n  ivec2 colRow = ivec2(gl_InstanceID % minorTickCount.x);\r\n  colRow.y = gl_InstanceID - minorTickCount.x;\r\n  vec2 center = start + vec2(colRow) * vec2(minorTick);\r\n  center *= ofs;\r\n\r\n  ivec2 isMajorv = (colRow + majorOffset) % majorTick;\r\n  isMajorv = ivec2(vec2(float(isMajorv.x == 0), float(isMajorv.y == 0)));\r\n  float isMajor = float(isMajorv.x) * ofs.x + float(isMajorv.y) * ofs.y;\r\n  vec2 isAxisv = vec2(float(colRow.x == halfTicks.x), float(colRow.y == halfTicks.y));\r\n  float isAxis = isAxisv.x * ofs.x + isAxisv.y * ofs.y;\r\n\r\n  float width = mix(minorLineWidth, majorLineWidth, isMajor);\r\n  width = mix(width, axisLineWidth, isAxis);\r\n  vec4 color = mix(minorLineColor, majorLineColor, isMajor);\r\n  color = mix(color, axisLineColor, isAxis);\r\n\r\n  vec2 direction = b - a;\r\n  vec2 leftNormal = normalize(perp(direction));\r\n  vec2 vertex = line2d(a, direction, leftNormal, width, vertexID);\r\n  vertex += center;\r\n  vec4 position = vec4(vertex, 0.0, 1.0);\r\n\r\n  position = projMat * viewMat * modelMat * position;\r\n\r\n  gl_Position = position;\r\n  v_fillColor = color;\r\n}";

const Shaders_grid2dVertexKey = "grid2dVertex";

WebglShaderUtils_addShaderInclude("grid-ubo", Shaders_gridUbo);

WebglShaderUtils_addVertexShaderSource(Shaders_grid2dVertexKey, Shaders_grid2dVertex);

function VecUtils_priorEven(v) {
    const priorEvenFloat = (value) => {
        const x = (~(~Math.floor(value))) | 0;
        if ((x % 2) === 0) {
            return x;
        }
        else {
            return x - 1;
        }
    };
    const __2 = v;
    const value_2 = Vec2__WithXY_6DB1BD7B(__2.v.contents, priorEvenFloat(v.values[0]), priorEvenFloat(v.values[1]), __2.v.contents);
    void value_2;
    return v;
}

export class Grid2D extends WebglObject {
    constructor(config, scene, size, layer, name, linkTo, parallaxCam, parallaxDistance) {
        super(scene, uncurry(2, (() => {
            const props = ofArray([new BuilderTypes_GlObjProp(0, defaultArg(name, "")), new BuilderTypes_GlObjProp(26, defaultArg(linkTo, "")), new BuilderTypes_GlObjProp(17, defaultArg(parallaxCam, "")), new BuilderTypes_GlObjProp(18, defaultArg(parallaxDistance, 1)), new BuilderTypes_GlObjProp(19, defaultArg(layer, scene.DefaultLayer)), new BuilderTypes_GlObjProp(3, 6), new BuilderTypes_GlObjProp(6, 1), ObjectProps_ubo("grid", ofArray([UboProps_u("minorLineColor", singleton(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(GlCanvasParams__get_StrokeColor(config))))), UboProps_u("majorLineColor", singleton(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(GlCanvasParams__get_StrokeColor(config))))), UboProps_u("axisLineColor", singleton(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(GlCanvasParams__get_StrokeColor(config))))), UboProps_u("minorLineWidth", singleton(new BuilderTypes_GlUniformProp(0, pixelsToWorld(GlCanvasParams__get_LineWidth(config) * 0.8, scene)))), UboProps_u("majorLineWidth", singleton(new BuilderTypes_GlUniformProp(0, pixelsToWorld(GlCanvasParams__get_LineWidth(config) * 1.5, scene)))), UboProps_u("axisLineWidth", singleton(new BuilderTypes_GlUniformProp(0, pixelsToWorld(GlCanvasParams__get_LineWidth(config) * 3, scene)))), UboProps_u("size", singleton(new BuilderTypes_GlUniformProp(0, Vec2__get_Values(Vec2__Clone(size))))), UboProps_u("minorTick", singleton(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 1])))), UboProps_u("majorTick", singleton(new BuilderTypes_GlUniformProp(0, new Int32Array([10, 10]))))]))]);
            return (overrides) => ((scene_4) => Props_globject(Shaders_grid2dVertexKey, "simpleFragment2d", props, overrides, scene_4));
        })()));
        this.o = (new FSharpRef(null));
        this.o.contents = this;
        this.uniforms = ofSeq(map((u) => [Data_GlUniformData__get_Name(u), u], allUniforms(WebglObject__get_ObjectDef(this.o.contents))), {
            Compare: comparePrimitives,
        });
        this["init@112-11"] = 1;
        Grid2D__updateInstanceCount(this);
    }
}

export function Grid2D$reflection() {
    return class_type("Wil.Webgl.Grid2D", void 0, Grid2D, WebglObject$reflection());
}

export function Grid2D_$ctor_Z166BE183(config, scene, size, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return new Grid2D(config, scene, size, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function Grid2D__get_MinorLineColor(_) {
    let name_1, matchValue, msg, uniform;
    return Vec4_$ctor_Z14AF5965((name_1 = "minorLineColor", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value);
}

export function Grid2D__set_MinorLineColor_Z3D47FC58(_, value) {
    let data;
    const name_1 = "minorLineColor";
    const matchValue = tryFind(name_1, _.uniforms);
    if (matchValue == null) {
        const msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1]));
        throw (new Error(msg));
    }
    else {
        const uniform = matchValue;
        data = uniform;
    }
    setValue(Vec4__get_Values(value), data);
}

export function Grid2D__get_MajorLineColor(_) {
    let name_1, matchValue, msg, uniform;
    return Vec4_$ctor_Z14AF5965((name_1 = "majorLineColor", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value);
}

export function Grid2D__set_MajorLineColor_Z3D47FC58(_, value) {
    let data;
    const name_1 = "majorLineColor";
    const matchValue = tryFind(name_1, _.uniforms);
    if (matchValue == null) {
        const msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1]));
        throw (new Error(msg));
    }
    else {
        const uniform = matchValue;
        data = uniform;
    }
    setValue(Vec4__get_Values(value), data);
}

export function Grid2D__get_AxisLineColor(_) {
    let name_1, matchValue, msg, uniform;
    return Vec4_$ctor_Z14AF5965((name_1 = "axisLineColor", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value);
}

export function Grid2D__set_AxisLineColor_Z3D47FC58(_, value) {
    let data;
    const name_1 = "axisLineColor";
    const matchValue = tryFind(name_1, _.uniforms);
    if (matchValue == null) {
        const msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1]));
        throw (new Error(msg));
    }
    else {
        const uniform = matchValue;
        data = uniform;
    }
    setValue(Vec4__get_Values(value), data);
}

export function Grid2D__get_MinorLineWidth(_) {
    let name_1, matchValue, msg, uniform;
    return (name_1 = "minorLineWidth", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value[0];
}

export function Grid2D__set_MinorLineWidth_5E38073B(_, value) {
    let name_1, matchValue, msg, uniform;
    setValue(value, (name_1 = "minorLineWidth", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))));
}

export function Grid2D__get_MajorLineWidth(_) {
    let name_1, matchValue, msg, uniform;
    return (name_1 = "majorLineWidth", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value[0];
}

export function Grid2D__set_MajorLineWidth_5E38073B(_, value) {
    let name_1, matchValue, msg, uniform;
    setValue(value, (name_1 = "majorLineWidth", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))));
}

export function Grid2D__get_AxisLineWidth(_) {
    let name_1, matchValue, msg, uniform;
    return (name_1 = "axisLineWidth", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value[0];
}

export function Grid2D__set_AxisLineWidth_5E38073B(_, value) {
    let name_1, matchValue, msg, uniform;
    setValue(value, (name_1 = "axisLineWidth", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))));
}

export function Grid2D__get_Size(_) {
    let name_1, matchValue, msg, uniform;
    return Vec2_$ctor_Z33A93963((name_1 = "size", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value);
}

export function Grid2D__set_Size_Z3D47FC52(_, value) {
    let data;
    const name_1 = "size";
    const matchValue = tryFind(name_1, _.uniforms);
    if (matchValue == null) {
        const msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1]));
        throw (new Error(msg));
    }
    else {
        const uniform = matchValue;
        data = uniform;
    }
    setValue(Vec2__get_Values(value), data);
    Grid2D__updateInstanceCount(_);
}

export function Grid2D__get_MinorTick(_) {
    let name_1, matchValue, msg, uniform;
    return Vec2_$ctor_Z33A93963((name_1 = "minorTick", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value).values[0];
}

export function Grid2D__set_MinorTick_5E38073B(_, value) {
    let data;
    const name_1 = "minorTick";
    const matchValue = tryFind(name_1, _.uniforms);
    if (matchValue == null) {
        const msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1]));
        throw (new Error(msg));
    }
    else {
        const uniform = matchValue;
        data = uniform;
    }
    setValue(Vec2__get_Values(Vec2_Create_5E38073B(value)), data);
    Grid2D__updateInstanceCount(_);
}

export function Grid2D__get_MajorTick(_) {
    let name_1, matchValue, msg, uniform;
    return ~(~Vec2_$ctor_Z33A93963((name_1 = "majorTick", (matchValue = tryFind(name_1, _.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value).values[0]);
}

export function Grid2D__set_MajorTick_Z524259A4(_, value) {
    let data;
    const name_1 = "majorTick";
    const matchValue = tryFind(name_1, _.uniforms);
    if (matchValue == null) {
        const msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1]));
        throw (new Error(msg));
    }
    else {
        const uniform = matchValue;
        data = uniform;
    }
    setValue(Vec2__get_Values(Vec2_Create_5E38073B(value)), data);
}

function Grid2D__calcInstanceCount(this$) {
    let name_1, matchValue, msg, uniform, name_3, matchValue_1, msg_1, uniform_1;
    const size = VecUtils_priorEven(Vec2_$ctor_Z33A93963((name_1 = "size", (matchValue = tryFind(name_1, this$.uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_1])), (() => {
        throw (new Error(msg));
    })()) : (uniform = matchValue, uniform))).Value));
    const minorTicks = Vec2_$ctor_Z33A93963((name_3 = "minorTick", (matchValue_1 = tryFind(name_3, this$.uniforms), (matchValue_1 == null) ? (msg_1 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_3])), (() => {
        throw (new Error(msg_1));
    })()) : (uniform_1 = matchValue_1, uniform_1))).Value);
    const minorTickCount = Vec2_op_Addition_47807E55(Vec2_op_Multiply_47807E55(Vec2_op_Division_Z24FF8540(Vec2_op_Multiply_47807E55(size, 0.5), minorTicks), 2), 1);
    return (~(~(minorTickCount.values[0] + minorTickCount.values[1]))) | 0;
}

function Grid2D__updateInstanceCount(this$) {
    const data = WebglObject__get_ObjectDef(this$.o.contents);
    setInstanceCount(Grid2D__calcInstanceCount(this$), data);
}

