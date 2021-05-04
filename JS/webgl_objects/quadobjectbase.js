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
import { ofArray, singleton, append } from "../.fable/fable-library.3.0.0/List.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { Props_globject, UniformProps_vec4ValueV, UniformProps_vec2Value, UboProps_u, ObjectProps_ubo } from "./props.js";
import { GlCanvasParams__get_LineWidth, GlCanvasParams__get_FillType, GlCanvasParams__get_FillColor, GlCanvasParams__get_StrokeColor } from "../webgl_data/glcanvasparams.js";
import { worldToPixels, pixelsToWorld } from "../webgl_data/glscene.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";

export class QuadObjectBase extends WebglObject {
    constructor(config, scene, vertex, fragment, props, layer, name, linkTo, parallaxCam, parallaxDistance) {
        super(scene, uncurry(2, (() => {
            const props_1 = append(ofArray([new BuilderTypes_GlObjProp(0, defaultArg(name, "")), new BuilderTypes_GlObjProp(26, defaultArg(linkTo, "")), new BuilderTypes_GlObjProp(17, defaultArg(parallaxCam, "")), new BuilderTypes_GlObjProp(18, defaultArg(parallaxDistance, 1)), new BuilderTypes_GlObjProp(19, defaultArg(layer, scene.DefaultLayer)), new BuilderTypes_GlObjProp(3, 4), new BuilderTypes_GlObjProp(2, 5), ObjectProps_ubo("quadParams", ofArray([UboProps_u("size", singleton(UniformProps_vec2Value(0, 0))), UboProps_u("strokeColor", singleton(UniformProps_vec4ValueV(GlCanvasParams__get_StrokeColor(config)))), UboProps_u("fillColor", singleton(UniformProps_vec4ValueV(GlCanvasParams__get_FillColor(config)))), UboProps_u("fillType", singleton(new BuilderTypes_GlUniformProp(0, GlCanvasParams__get_FillType(config)))), UboProps_u("lineWidth", singleton(new BuilderTypes_GlUniformProp(0, pixelsToWorld(GlCanvasParams__get_LineWidth(config), scene)))), UboProps_u("aliasWidth", singleton(new BuilderTypes_GlUniformProp(0, 2))), UboProps_u("angle", singleton(new BuilderTypes_GlUniformProp(0, 0))), UboProps_u("instanceCount", singleton(new BuilderTypes_GlUniformProp(0, 1)))]))]), props);
            return (overrides) => ((scene_1) => Props_globject(vertex, fragment, props_1, overrides, scene_1));
        })()));
        const o = new FSharpRef(null);
        this.scene_1 = scene;
        o.contents = this;
        const uniforms = ofSeq(map((u) => [Data_GlUniformData__get_Name(u), u], allUniforms(WebglObject__get_ObjectDef(o.contents))), {
            Compare: comparePrimitives,
        });
        this.getFloat = ((name_1) => {
            let name_3, matchValue, msg, uniform;
            return (name_3 = name_1, (matchValue = tryFind(name_3, uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_3])), (() => {
                throw (new Error(msg));
            })()) : (uniform = matchValue, uniform))).Value[0];
        });
        this.setFloat = ((name_4, value) => {
            let name_6, matchValue_1, msg_1, uniform_1;
            setValue(value, (name_6 = name_4, (matchValue_1 = tryFind(name_6, uniforms), (matchValue_1 == null) ? (msg_1 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_6])), (() => {
                throw (new Error(msg_1));
            })()) : (uniform_1 = matchValue_1, uniform_1))));
        });
        this.getInt = ((name_7) => {
            let name_9, matchValue_2, msg_2, uniform_2;
            return (name_9 = name_7, (matchValue_2 = tryFind(name_9, uniforms), (matchValue_2 == null) ? (msg_2 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_9])), (() => {
                throw (new Error(msg_2));
            })()) : (uniform_2 = matchValue_2, uniform_2))).Value[0];
        });
        this.setInt = ((name_10, value_2) => {
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
        this["init@12-12"] = 1;
    }
    ["Wil.Webgl.QuadObjectBase.get_LineWidth"]() {
        const _ = this;
        return _.getFloat("lineWidth");
    }
    ["Wil.Webgl.QuadObjectBase.set_LineWidth"](value) {
        const _ = this;
        _.setFloat("lineWidth", value);
    }
}

export function QuadObjectBase$reflection() {
    return class_type("Wil.Webgl.QuadObjectBase", void 0, QuadObjectBase, WebglObject$reflection());
}

export function QuadObjectBase_$ctor_5421FB7E(config, scene, vertex, fragment, props, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return new QuadObjectBase(config, scene, vertex, fragment, props, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function QuadObjectBase__get_Size(_) {
    return _.getVec2("size");
}

export function QuadObjectBase__set_Size_Z3D47FC52(_, value) {
    _.setVec2("size", value);
}

export function QuadObjectBase__get_StrokeColor(_) {
    return _.getVec4("strokeColor");
}

export function QuadObjectBase__set_StrokeColor_Z3D47FC58(_, value) {
    _.setVec4("strokeColor", value);
}

export function QuadObjectBase__get_FillColor(_) {
    return _.getVec4("fillColor");
}

export function QuadObjectBase__set_FillColor_Z3D47FC58(_, value) {
    _.setVec4("fillColor", value);
}

export function QuadObjectBase__get_FillType(_) {
    return _.getInt("fillType");
}

export function QuadObjectBase__set_FillType_Z1454C5A5(_, value) {
    _.setInt("fillType", value);
}

export function QuadObjectBase__get_AliasWidth(_) {
    return worldToPixels(_.getFloat("aliasWidth"), _.scene_1);
}

export function QuadObjectBase__set_AliasWidth_21F3BA25(_, value) {
    _.setFloat("aliasWidth", pixelsToWorld(value, _.scene_1));
}

