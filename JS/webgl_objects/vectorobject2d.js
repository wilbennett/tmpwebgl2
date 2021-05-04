import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { tryFind, ofSeq } from "../.fable/fable-library.3.0.0/Map.js";
import { map } from "../.fable/fable-library.3.0.0/Seq.js";
import { Data_GlUniformData__get_Name } from "../webgl_data/webgl_data.js";
import { allUniforms } from "../webgl_data/glcommon.js";
import { WebglObject__get_ObjectDef } from "./webglobject.js";
import { comparePrimitives } from "../.fable/fable-library.3.0.0/Util.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { setValue } from "../webgl_data/gluniform.js";
import { getUniform } from "../webgl_data/globj.js";
import { QuadObjectBase$reflection, QuadObjectBase } from "./quadobjectbase.js";
import { ObjectProps_blendFunc } from "./props.js";
import { singleton } from "../.fable/fable-library.3.0.0/List.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { Vec2__get_Angle, Vec2_Create_7B00E9A0, Vec2__get_Values } from "../core/vectors.js";


export class VectorObject2D extends QuadObjectBase {
    constructor(config, scene, vector, layer, name, linkTo, parallaxCam, parallaxDistance) {
        super(config, scene, "quadStripRightVertex2d", "vectorFragment2d", singleton(ObjectProps_blendFunc(1)(771)), layer, name, linkTo, parallaxCam, parallaxDistance);
        const o = new FSharpRef(null);
        o.contents = this;
        const uniforms = ofSeq(map((u) => [Data_GlUniformData__get_Name(u), u], allUniforms(WebglObject__get_ObjectDef(o.contents))), {
            Compare: comparePrimitives,
        });
        this.getFloat_1 = ((name_1) => {
            let name_3, matchValue, msg, uniform;
            return (name_3 = name_1, (matchValue = tryFind(name_3, uniforms), (matchValue == null) ? (msg = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_3])), (() => {
                throw (new Error(msg));
            })()) : (uniform = matchValue, uniform))).Value[0];
        });
        this.setFloat_1 = ((name_4, value) => {
            let name_6, matchValue_1, msg_1, uniform_1;
            setValue(value, (name_6 = name_4, (matchValue_1 = tryFind(name_6, uniforms), (matchValue_1 == null) ? (msg_1 = toText(interpolate("Uniform \u0027%P()\u0027 not found.", [name_6])), (() => {
                throw (new Error(msg_1));
            })()) : (uniform_1 = matchValue_1, uniform_1))));
        });
        this.vec = vector;
        this.uSize = getUniform("size")(WebglObject__get_ObjectDef(o.contents));
        this.uAngle = getUniform("angle")(WebglObject__get_ObjectDef(o.contents));
        this["init@18-13"] = 1;
        VectorObject2D__updateSize(this);
        VectorObject2D__updateAngle(this);
    }
    ["Wil.Webgl.QuadObjectBase.get_LineWidth"]() {
        const _ = this;
        return _.getFloat_1("lineWidth");
    }
    ["Wil.Webgl.QuadObjectBase.set_LineWidth"](value) {
        const _ = this;
        _.setFloat_1("lineWidth", value);
        VectorObject2D__updateSize(_);
    }
}

export function VectorObject2D$reflection() {
    return class_type("Wil.Webgl.VectorObject2D", void 0, VectorObject2D, QuadObjectBase$reflection());
}

export function VectorObject2D_$ctor_Z166BE183(config, scene, vector, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return new VectorObject2D(config, scene, vector, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function VectorObject2D__get_Vector(_) {
    return _.vec;
}

export function VectorObject2D__set_Vector_Z3D47FC52(_, value) {
    const other = value;
    let value_3;
    const __4 = _.vec.v.contents;
    const x = other.values[0];
    const y = other.values[1];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    value_3 = __4.v.contents;
    void value_3;
    VectorObject2D__updateSize(_);
    VectorObject2D__updateAngle(_);
}

function VectorObject2D__calcSize(this$) {
    let _, __5;
    return Vec2__get_Values(Vec2_Create_7B00E9A0((_ = this$.vec, Math.sqrt((_.v.contents.values[0] * _.v.contents.values[0]) + (_.v.contents.values[1] * _.v.contents.values[1]))), (__5 = this$.vec, Math.sqrt((__5.v.contents.values[0] * __5.v.contents.values[0]) + (__5.v.contents.values[1] * __5.v.contents.values[1])))));
}

function VectorObject2D__updateSize(this$) {
    setValue(VectorObject2D__calcSize(this$), this$.uSize);
}

function VectorObject2D__updateAngle(this$) {
    setValue(Vec2__get_Angle(this$.vec), this$.uAngle);
}

