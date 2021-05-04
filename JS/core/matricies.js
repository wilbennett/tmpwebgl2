import { printf, toText } from "../.fable/fable-library.3.0.0/String.js";
import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { calcDef } from "./optionex.js";
import { Vec3_op_PlusMultiply_Z24FF85E0, Vec3_op_Subtraction_Z24FF85E0, Vec3_op_BangBang_Z3D47FC51, Vec3_Create, Vec2_Create } from "./vectors.js";
import { defaultArgWith, defaultArg } from "../.fable/fable-library.3.0.0/Option.js";

export class Mat2 {
    constructor(values) {
        this.m = (new FSharpRef(null));
        const m = this.m;
        this.values = values;
        this.m.contents = this;
        this["Values@"] = this.values;
        this["init@6-3"] = 1;
    }
    toString() {
        let arg20, arg10, arg20_1, arg10_1;
        const _ = this;
        const v = _.values;
        return (arg20 = v[1], (arg10 = v[0], toText(printf("%10.2f %10.2f\n"))(arg10)(arg20))) + (arg20_1 = v[3], (arg10_1 = v[2], toText(printf("%10.2f %10.2f"))(arg10_1)(arg20_1)));
    }
}

export function Mat2$reflection() {
    return class_type("Wil.Core.Mat2", void 0, Mat2);
}

export function Mat2_$ctor_Z14AF5965(values) {
    return new Mat2(values);
}

export function Mat2_get_Identity() {
    return new Float64Array([1, 0, 0, 1]);
}

export function Mat2_Create() {
    return Mat2_$ctor_Z14AF5965(Mat2_get_Identity());
}

export function Mat2__get_Values(__) {
    return __["Values@"];
}

export function Mat2__SetToIdentity(_) {
    _.values[0] = 1;
    _.values[1] = 0;
    _.values[2] = 0;
    _.values[3] = 1;
}

export function Mat2__Set_Z33A93963(_, newValues) {
    _.values[0] = newValues[0];
    _.values[1] = newValues[1];
    _.values[2] = newValues[2];
    _.values[3] = newValues[3];
    return _.m.contents;
}

export function Mat2__RotationTrig_4055D7F3(_, cos, sin, result) {
    const result_1 = Mat2__optionalMat_Z49D52CED(_, result);
    const values = Mat2__get_Values(result_1);
    values[0] = cos;
    values[1] = (-sin);
    values[2] = sin;
    values[3] = cos;
    return result_1;
}

export function Mat2__Rotation_Z244A1337(_, angle, result) {
    const ang = angle;
    return Mat2__RotationTrig_4055D7F3(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat2__RotationTrigReverse_4055D7F3(_, cos, sin, result) {
    const result_1 = Mat2__optionalMat_Z49D52CED(_, result);
    const values = Mat2__get_Values(result_1);
    values[0] = cos;
    values[1] = sin;
    values[2] = (-sin);
    values[3] = cos;
    return result_1;
}

export function Mat2__RotationReverse_Z244A1337(_, angle, result) {
    const ang = angle;
    return Mat2__RotationTrigReverse_4055D7F3(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat2__Transpose_Z49D52CED(_, result) {
    const result_1 = Mat2__optionalMat_Z49D52CED(_, result);
    const values = Mat2__get_Values(result_1);
    const v1 = values[1];
    const v2 = values[2];
    values[0] = values[0];
    values[1] = v2;
    values[2] = v1;
    values[3] = values[3];
    return result_1;
}

export function Mat2__TransposeM(_) {
    const value = Mat2__Transpose_Z49D52CED(_.m.contents, _.m.contents);
    void value;
}

export function Mat2__Mult_Z51C349CB(_, other, result) {
    const result_1 = Mat2__optionalMat_Z49D52CED(_, result);
    const values = Mat2__get_Values(result_1);
    const ovalues = Mat2__get_Values(other);
    const v00 = values[0];
    const v01 = values[1];
    const v10 = values[2];
    const v11 = values[3];
    const o00 = ovalues[0];
    const o01 = ovalues[1];
    const o10 = ovalues[2];
    const o11 = ovalues[3];
    values[0] = ((v00 * o00) + (v01 * o10));
    values[1] = ((v00 * o01) + (v01 * o11));
    values[2] = ((v10 * o00) + (v11 * o10));
    values[3] = ((v10 * o01) + (v11 * o11));
    return result_1;
}

export function Mat2__MultM_Z3D54A79A(_, other) {
    const value = Mat2__Mult_Z51C349CB(_.m.contents, other, _.m.contents);
    void value;
}

export function Mat2__Transform_Z50E8264B(_, v, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const value = (_.values[0] * v.values[0]) + (_.values[1] * v.values[1]);
    result_1.values[0] = value;
    const value_1 = (_.values[2] * v.values[0]) + (_.values[3] * v.values[1]);
    result_1.values[1] = value_1;
    return result_1;
}

export function Mat2__TransformInverse_Z50E8264B(_, v, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const value = (_.values[0] * v.values[0]) + (_.values[2] * v.values[1]);
    result_1.values[0] = value;
    const value_1 = (_.values[1] * v.values[0]) + (_.values[3] * v.values[1]);
    result_1.values[1] = value_1;
    return result_1;
}

function Mat2__optionalMat_Z49D52CED(this$, mat) {
    return defaultArg(mat, this$.m.contents);
}

export class Mat2D {
    constructor(values) {
        this.m = (new FSharpRef(null));
        const m = this.m;
        this.values = values;
        this.m.contents = this;
        this["Values@"] = this.values;
        this["init@107-4"] = 1;
    }
    toString() {
        let arg20, arg10, arg20_1, arg10_1, arg20_2, arg10_2;
        const _ = this;
        const v = _.values;
        return ((arg20 = v[1], (arg10 = v[0], toText(printf("%10.2f %10.2f\n"))(arg10)(arg20))) + (arg20_1 = v[3], (arg10_1 = v[2], toText(printf("%10.2f %10.2f\n"))(arg10_1)(arg20_1)))) + (arg20_2 = v[4], (arg10_2 = v[4], toText(printf("%10.2f %10.2f"))(arg10_2)(arg20_2)));
    }
}

export function Mat2D$reflection() {
    return class_type("Wil.Core.Mat2D", void 0, Mat2D);
}

export function Mat2D_$ctor_Z14AF5965(values) {
    return new Mat2D(values);
}

export function Mat2D_get_Identity() {
    return new Float64Array([1, 0, 0, 1, 0, 0]);
}

export function Mat2D_Create() {
    return Mat2D_$ctor_Z14AF5965(Mat2D_get_Identity());
}

export function Mat2D__get_Values(__) {
    return __["Values@"];
}

export function Mat2D__SetToIdentity(_) {
    _.values[0] = 1;
    _.values[1] = 0;
    _.values[2] = 0;
    _.values[3] = 1;
    _.values[4] = 0;
    _.values[5] = 0;
}

export function Mat2D__Set_Z33A93963(_, newValues) {
    _.values[0] = newValues[0];
    _.values[1] = newValues[1];
    _.values[2] = newValues[2];
    _.values[3] = newValues[3];
    _.values[4] = newValues[4];
    _.values[5] = newValues[5];
    return _.m.contents;
}

export function Mat2D__Translation_Z7205CF09(_, x, y, result) {
    const result_1 = Mat2D__optionalMat_7B853417(_, result);
    const values = Mat2D__get_Values(result_1);
    values[0] = 1;
    values[1] = 0;
    values[2] = 0;
    values[3] = 1;
    values[4] = x;
    values[5] = y;
    return result_1;
}

export function Mat2D__RotationTrig_Z7205CF09(_, cos, sin, result) {
    const result_1 = Mat2D__optionalMat_7B853417(_, result);
    const values = Mat2D__get_Values(result_1);
    values[0] = cos;
    values[1] = (-sin);
    values[2] = sin;
    values[3] = cos;
    values[4] = 0;
    values[5] = 0;
    return result_1;
}

export function Mat2D__Rotation_161A0BCD(_, angle, result) {
    const ang = angle;
    return Mat2D__RotationTrig_Z7205CF09(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat2D__RotationTrigReverse_Z7205CF09(_, cos, sin, result) {
    const result_1 = Mat2D__optionalMat_7B853417(_, result);
    const values = Mat2D__get_Values(result_1);
    values[0] = cos;
    values[1] = sin;
    values[2] = (-sin);
    values[3] = cos;
    values[4] = 0;
    values[5] = 0;
    return result_1;
}

export function Mat2D__RotationReverse_161A0BCD(_, angle, result) {
    const ang = angle;
    return Mat2D__RotationTrigReverse_Z7205CF09(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat2D__Mult_616625B5(_, other, result) {
    const result_1 = Mat2D__optionalMat_7B853417(_, result);
    const values = Mat2D__get_Values(result_1);
    const ovalues = Mat2D__get_Values(other);
    const v0 = values[0];
    const v1 = values[1];
    const v2 = values[2];
    const v3 = values[3];
    const v4 = values[4];
    const v5 = values[5];
    const o0 = ovalues[0];
    const o1 = ovalues[1];
    const o2 = ovalues[2];
    const o3 = ovalues[3];
    values[0] = ((v0 * o0) + (v1 * o2));
    values[1] = ((v0 * o1) + (v1 * o3));
    values[2] = ((v2 * o0) + (v3 * o2));
    values[3] = ((v2 * o1) + (v3 * o3));
    values[4] = (((v4 * o0) + (v5 * o2)) + v4);
    values[5] = (((v4 * o1) + (v5 * o3)) + v5);
    return result_1;
}

export function Mat2D__MultM_18166562(_, other) {
    const value = Mat2D__Mult_616625B5(_.m.contents, other, _.m.contents);
    void value;
}

export function Mat2D__Translate_Z7205CF09(_, x, y, result) {
    const temp = Mat2D_Create();
    return Mat2D__Mult_616625B5(_.m.contents, Mat2D__Translation_Z7205CF09(_.m.contents, x, y, temp), result);
}

export function Mat2D__TranslateM_2E41E8E0(_, x, y) {
    const value = Mat2D__Translate_Z7205CF09(_.m.contents, x, y, _.m.contents);
    void value;
}

export function Mat2D__RotateTrig_Z7205CF09(_, cos, sin, result) {
    const temp = Mat2D_Create();
    return Mat2D__Mult_616625B5(_.m.contents, Mat2D__RotationTrig_Z7205CF09(_.m.contents, cos, sin, temp), result);
}

export function Mat2D__RotateTrigM_2E41E8E0(_, cos, sin) {
    const value = Mat2D__RotateTrig_Z7205CF09(_.m.contents, cos, sin, _.m.contents);
    void value;
}

export function Mat2D__Rotate_161A0BCD(_, angle, result) {
    const ang = angle;
    return Mat2D__RotateTrig_Z7205CF09(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat2D__RotateM_6069AC9A(_, angle) {
    const value = Mat2D__Rotate_161A0BCD(_.m.contents, angle, _.m.contents);
    void value;
}

export function Mat2D__RotateTrigReverse_Z7205CF09(_, cos, sin, result) {
    const temp = Mat2D_Create();
    return Mat2D__Mult_616625B5(_.m.contents, Mat2D__RotationTrigReverse_Z7205CF09(_.m.contents, cos, sin, temp), result);
}

export function Mat2D__RotateTrigReverseM_2E41E8E0(_, cos, sin) {
    const value = Mat2D__RotateTrigReverse_Z7205CF09(_.m.contents, cos, sin, _.m.contents);
    void value;
}

export function Mat2D__RotateReverse_161A0BCD(_, angle, result) {
    const ang = angle;
    return Mat2D__RotateTrigReverse_Z7205CF09(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat2D__RotateReverseM_6069AC9A(_, angle) {
    const value = Mat2D__RotateReverse_161A0BCD(_.m.contents, angle, _.m.contents);
    void value;
}

export function Mat2D__Transform_Z50E8264B(_, v, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const value = ((_.values[0] * v.values[0]) + (_.values[1] * v.values[1])) + _.values[4];
    result_1.values[0] = value;
    const value_1 = ((_.values[2] * v.values[0]) + (_.values[3] * v.values[1])) + _.values[5];
    result_1.values[1] = value_1;
    return result_1;
}

function Mat2D__optionalMat_7B853417(this$, mat) {
    return defaultArg(mat, this$.m.contents);
}

export class Mat3 {
    constructor(values) {
        this.m = (new FSharpRef(null));
        const m = this.m;
        this.values = values;
        this.m.contents = this;
        this["Values@"] = this.values;
        this["init@246-5"] = 1;
    }
    toString() {
        let arg30, arg20, arg10, arg30_1, arg20_1, arg10_1, arg30_2, arg20_2, arg10_2;
        const _ = this;
        const v = _.values;
        return ((arg30 = v[2], (arg20 = v[1], (arg10 = v[0], toText(printf("%10.2f %10.2f %10.2f\n"))(arg10)(arg20)(arg30)))) + (arg30_1 = v[5], (arg20_1 = v[4], (arg10_1 = v[3], toText(printf("%10.2f %10.2f %10.2f\n"))(arg10_1)(arg20_1)(arg30_1))))) + (arg30_2 = v[8], (arg20_2 = v[7], (arg10_2 = v[6], toText(printf("%10.2f %10.2f %10.2f"))(arg10_2)(arg20_2)(arg30_2))));
    }
}

export function Mat3$reflection() {
    return class_type("Wil.Core.Mat3", void 0, Mat3);
}

export function Mat3_$ctor_Z14AF5965(values) {
    return new Mat3(values);
}

export function Mat3_get_Identity() {
    return new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
}

export function Mat3_Create() {
    return Mat3_$ctor_Z14AF5965(Mat3_get_Identity());
}

export function Mat3__get_Values(__) {
    return __["Values@"];
}

export function Mat3__SetToIdentity(_) {
    _.values[0] = 1;
    _.values[1] = 0;
    _.values[2] = 0;
    _.values[3] = 0;
    _.values[4] = 1;
    _.values[5] = 0;
    _.values[6] = 0;
    _.values[7] = 0;
    _.values[8] = 1;
}

export function Mat3__Set_Z33A93963(_, newValues) {
    _.values[0] = newValues[0];
    _.values[1] = newValues[1];
    _.values[2] = newValues[2];
    _.values[3] = newValues[3];
    _.values[4] = newValues[4];
    _.values[5] = newValues[5];
    _.values[6] = newValues[6];
    _.values[7] = newValues[7];
    _.values[8] = newValues[8];
    return _.m.contents;
}

export function Mat3__Projection_4055D7D2(_, width, height, result) {
    const result_1 = Mat3__optionalMat_Z49D52CCE(_, result);
    const values = Mat3__get_Values(result_1);
    values[0] = (2 / width);
    values[1] = 0;
    values[2] = 0;
    values[3] = 0;
    values[4] = (-2 / height);
    values[5] = 0;
    values[6] = -1;
    values[7] = 1;
    values[8] = 1;
    return result_1;
}

export function Mat3__ProjectionM_2E41E8E0(_, width, height) {
    const value = Mat3__Projection_4055D7D2(_.m.contents, width, height, _.m.contents);
    void value;
}

export function Mat3__Translation_4055D7D2(_, x, y, result) {
    const result_1 = Mat3__optionalMat_Z49D52CCE(_, result);
    const values = Mat3__get_Values(result_1);
    values[0] = 1;
    values[1] = 0;
    values[2] = 0;
    values[3] = 0;
    values[4] = 1;
    values[5] = 0;
    values[6] = x;
    values[7] = y;
    values[8] = 1;
    return result_1;
}

export function Mat3__RotationTrigZ_4055D7D2(_, cos, sin, result) {
    const result_1 = Mat3__optionalMat_Z49D52CCE(_, result);
    const values = Mat3__get_Values(result_1);
    values[0] = cos;
    values[1] = sin;
    values[2] = 0;
    values[3] = (-sin);
    values[4] = cos;
    values[5] = 0;
    values[6] = 0;
    values[7] = 0;
    values[8] = 1;
    return result_1;
}

export function Mat3__RotationZ_Z244A1318(_, angle, result) {
    const ang = angle;
    return Mat3__RotationTrigZ_4055D7D2(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat3__Mult_Z51C3498B(_, other, result) {
    const result_1 = Mat3__optionalMat_Z49D52CCE(_, result);
    const values = Mat3__get_Values(result_1);
    const ovalues = Mat3__get_Values(other);
    const a00 = values[0];
    const a01 = values[1];
    const a02 = values[2];
    const a10 = values[3];
    const a11 = values[4];
    const a12 = values[5];
    const a20 = values[6];
    const a21 = values[7];
    const a22 = values[8];
    const b00 = ovalues[0];
    const b01 = ovalues[1];
    const b02 = ovalues[2];
    const b10 = ovalues[3];
    const b11 = ovalues[4];
    const b12 = ovalues[5];
    const b20 = ovalues[6];
    const b21 = ovalues[7];
    const b22 = ovalues[8];
    values[0] = (((a00 * b00) + (a10 * b01)) + (a20 * b02));
    values[1] = (((a01 * b00) + (a11 * b01)) + (a21 * b02));
    values[2] = (((a02 * b00) + (a12 * b01)) + (a22 * b02));
    values[3] = (((a00 * b10) + (a10 * b11)) + (a20 * b12));
    values[4] = (((a01 * b10) + (a11 * b11)) + (a21 * b12));
    values[5] = (((a02 * b10) + (a12 * b11)) + (a22 * b12));
    values[6] = (((a00 * b20) + (a10 * b21)) + (a20 * b22));
    values[7] = (((a01 * b20) + (a11 * b21)) + (a21 * b22));
    values[8] = (((a02 * b20) + (a12 * b21)) + (a22 * b22));
    return result_1;
}

export function Mat3__MultM_Z3D54A799(_, other) {
    const value = Mat3__Mult_Z51C3498B(_.m.contents, other, _.m.contents);
    void value;
}

export function Mat3__Transform_Z50E8268B(_, v, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const a00 = _.values[0];
    const a01 = _.values[1];
    const a02 = _.values[2];
    const a10 = _.values[3];
    const a11 = _.values[4];
    const a12 = _.values[5];
    const a20 = _.values[6];
    const a21 = _.values[7];
    const a22 = _.values[8];
    const value = ((a00 * v.values[0]) + (a10 * v.values[1])) + (a20 * v.values[2]);
    result_1.values[0] = value;
    const value_1 = ((a01 * v.values[0]) + (a11 * v.values[1])) + (a21 * v.values[2]);
    result_1.values[1] = value_1;
    const value_2 = ((a02 * v.values[0]) + (a12 * v.values[1])) + (a22 * v.values[2]);
    result_1.values[2] = value_2;
    return result_1;
}

function Mat3__optionalMat_Z49D52CCE(this$, mat) {
    return defaultArg(mat, this$.m.contents);
}

export class Mat4 {
    constructor(values) {
        this.m = (new FSharpRef(null));
        const m = this.m;
        this.values = values;
        this.m.contents = this;
        this["Values@"] = this.values;
        this["init@388-6"] = 1;
    }
    toString() {
        let arg40, arg30, arg20, arg10, arg40_1, arg30_1, arg20_1, arg10_1, arg40_2, arg30_2, arg20_2, arg10_2, arg40_3, arg30_3, arg20_3, arg10_3;
        const _ = this;
        const v = _.values;
        return (((arg40 = v[3], (arg30 = v[2], (arg20 = v[1], (arg10 = v[0], toText(printf("%10.2f %10.2f %10.2f %10.2f\n"))(arg10)(arg20)(arg30)(arg40))))) + (arg40_1 = v[7], (arg30_1 = v[6], (arg20_1 = v[5], (arg10_1 = v[4], toText(printf("%10.2f %10.2f %10.2f %10.2f\n"))(arg10_1)(arg20_1)(arg30_1)(arg40_1)))))) + (arg40_2 = v[11], (arg30_2 = v[10], (arg20_2 = v[9], (arg10_2 = v[8], toText(printf("%10.2f %10.2f %10.2f %10.2f\n"))(arg10_2)(arg20_2)(arg30_2)(arg40_2)))))) + (arg40_3 = v[15], (arg30_3 = v[14], (arg20_3 = v[13], (arg10_3 = v[12], toText(printf("%10.2f %10.2f %10.2f %10.2f"))(arg10_3)(arg20_3)(arg30_3)(arg40_3)))));
    }
}

export function Mat4$reflection() {
    return class_type("Wil.Core.Mat4", void 0, Mat4);
}

export function Mat4_$ctor_Z14AF5965(values) {
    return new Mat4(values);
}

export function Mat4_get_Identity() {
    return new Float64Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

export function Mat4_Create() {
    return Mat4_$ctor_Z14AF5965(Mat4_get_Identity());
}

export function Mat4__get_Values(__) {
    return __["Values@"];
}

export function Mat4__SetToIdentity(_) {
    _.values[0] = 1;
    _.values[1] = 0;
    _.values[2] = 0;
    _.values[3] = 0;
    _.values[4] = 0;
    _.values[5] = 1;
    _.values[6] = 0;
    _.values[7] = 0;
    _.values[8] = 0;
    _.values[9] = 0;
    _.values[10] = 1;
    _.values[11] = 0;
    _.values[12] = 0;
    _.values[13] = 0;
    _.values[14] = 0;
    _.values[15] = 1;
}

export function Mat4__Set_Z33A93963(_, newValues) {
    _.values[0] = newValues[0];
    _.values[1] = newValues[1];
    _.values[2] = newValues[2];
    _.values[3] = newValues[3];
    _.values[4] = newValues[4];
    _.values[5] = newValues[5];
    _.values[6] = newValues[6];
    _.values[7] = newValues[7];
    _.values[8] = newValues[8];
    _.values[9] = newValues[9];
    _.values[10] = newValues[10];
    _.values[11] = newValues[11];
    _.values[12] = newValues[12];
    _.values[13] = newValues[13];
    _.values[14] = newValues[14];
    _.values[15] = newValues[15];
}

export function Mat4__Projection_Z6F5B78D8(_, width, height, depth, result) {
    const result_1 = Mat4__optionalMat_Z49D52D2B(_, result);
    const values = Mat4__get_Values(result_1);
    values[0] = (2 / width);
    values[1] = 0;
    values[2] = 0;
    values[3] = 0;
    values[4] = 0;
    values[5] = (-2 / height);
    values[6] = 0;
    values[7] = 0;
    values[8] = 0;
    values[9] = 0;
    values[10] = (2 / depth);
    values[11] = 0;
    values[12] = -1;
    values[13] = 1;
    values[14] = 0;
    values[15] = 1;
    return result_1;
}

export function Mat4__ProjectionM_8ED0A5D(_, width, height, depth) {
    const value = Mat4__Projection_Z6F5B78D8(_.m.contents, width, height, depth, _.m.contents);
    void value;
}

export function Mat4__LookAt_Z797A4246(_, cameraPosition, target, up, result) {
    const camera = cameraPosition;
    const zAxis = Vec3_op_BangBang_Z3D47FC51(Vec3_op_Subtraction_Z24FF85E0(camera, target));
    const xAxis = Vec3_op_BangBang_Z3D47FC51(Vec3_op_PlusMultiply_Z24FF85E0(up, zAxis));
    const yAxis = Vec3_op_BangBang_Z3D47FC51(Vec3_op_PlusMultiply_Z24FF85E0(zAxis, xAxis));
    const result_1 = Mat4__optionalMat_Z49D52D2B(_, result);
    const values = Mat4__get_Values(result_1);
    values[0] = xAxis.values[0];
    values[1] = xAxis.values[1];
    values[2] = xAxis.values[2];
    values[3] = 0;
    values[4] = yAxis.values[0];
    values[5] = yAxis.values[1];
    values[6] = yAxis.values[2];
    values[7] = 0;
    values[8] = zAxis.values[0];
    values[9] = zAxis.values[1];
    values[10] = zAxis.values[2];
    values[11] = 0;
    values[12] = (-camera.values[0]);
    values[13] = (-camera.values[1]);
    values[14] = (-camera.values[2]);
    values[15] = 1;
    return result_1;
}

export function Mat4__LookAtM_Z6484271(_, cameraPosition, target, up) {
    const value = Mat4__LookAt_Z797A4246(_.m.contents, cameraPosition, target, up, _.m.contents);
    void value;
}

export function Mat4__Ortho_530735F5(_, left, right, bottom, top, near, far, result) {
    const result_1 = Mat4__optionalMat_Z49D52D2B(_, result);
    const values = Mat4__get_Values(result_1);
    values[0] = (2 / (right - left));
    values[1] = 0;
    values[2] = 0;
    values[3] = 0;
    values[4] = 0;
    values[5] = (2 / (top - bottom));
    values[6] = 0;
    values[7] = 0;
    values[8] = 0;
    values[9] = 0;
    values[10] = (2 / (near - far));
    values[11] = 0;
    values[12] = ((left + right) / (left - right));
    values[13] = ((bottom + top) / (bottom - top));
    values[14] = ((near + far) / (near - far));
    values[15] = 1;
    return result_1;
}

export function Mat4__OrthoM_357D8320(_, left, right, bottom, top, near, far) {
    const value = Mat4__Ortho_530735F5(_.m.contents, left, right, bottom, top, near, far, _.m.contents);
    void value;
}

export function Mat4__Perspective_7BDB5F74(_, fov, aspect, near, far, result) {
    const result_1 = Mat4__optionalMat_Z49D52D2B(_, result);
    const values = Mat4__get_Values(result_1);
    const f = Math.tan((3.141592653589793 * 0.5) - (fov * 0.5));
    const rangeInv = 1 / (near - far);
    values[0] = (f / aspect);
    values[1] = 0;
    values[2] = 0;
    values[3] = 0;
    values[4] = 0;
    values[5] = f;
    values[6] = 0;
    values[7] = 0;
    values[8] = 0;
    values[9] = 0;
    values[10] = ((near + far) * rangeInv);
    values[11] = -1;
    values[12] = 0;
    values[13] = 0;
    values[14] = (((near * far) * rangeInv) * 2);
    values[15] = 0;
    return result_1;
}

export function Mat4__PerspectiveM_Z18CA227F(_, fov, aspect, near, far) {
    const value = Mat4__Perspective_7BDB5F74(_.m.contents, fov, aspect, near, far, _.m.contents);
    void value;
}

export function Mat4__Translation_Z6F5B78D8(_, x, y, z, result) {
    const result_1 = Mat4__optionalMat_Z49D52D2B(_, result);
    const values = Mat4__get_Values(result_1);
    values[0] = 1;
    values[1] = 0;
    values[2] = 0;
    values[3] = 0;
    values[4] = 0;
    values[5] = 1;
    values[6] = 0;
    values[7] = 0;
    values[8] = 0;
    values[9] = 0;
    values[10] = 1;
    values[11] = 0;
    values[12] = x;
    values[13] = y;
    values[14] = z;
    values[15] = 1;
    return result_1;
}

export function Mat4__Scaled_Z6F5B78D8(_, x, y, z, result) {
    const result_1 = Mat4__optionalMat_Z49D52D2B(_, result);
    const values = Mat4__get_Values(result_1);
    values[0] = x;
    values[1] = 0;
    values[2] = 0;
    values[3] = 0;
    values[4] = 0;
    values[5] = y;
    values[6] = 0;
    values[7] = 0;
    values[8] = 0;
    values[9] = 0;
    values[10] = z;
    values[11] = 0;
    values[12] = 0;
    values[13] = 0;
    values[14] = 0;
    values[15] = 1;
    return result_1;
}

export function Mat4__RotationTrigZ_4055D635(_, cos, sin, result) {
    const result_1 = Mat4__optionalMat_Z49D52D2B(_, result);
    const values = Mat4__get_Values(result_1);
    values[0] = cos;
    values[1] = sin;
    values[2] = 0;
    values[3] = 0;
    values[4] = (-sin);
    values[5] = cos;
    values[6] = 0;
    values[7] = 0;
    values[8] = 0;
    values[9] = 0;
    values[10] = 1;
    values[11] = 0;
    values[12] = 0;
    values[13] = 0;
    values[14] = 0;
    values[15] = 1;
    return result_1;
}

export function Mat4__RotationZ_Z244A12F1(_, angle, result) {
    const ang = angle;
    return Mat4__RotationTrigZ_4055D635(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat4__Mult_Z51C3494B(_, other, result) {
    const result_1 = Mat4__optionalMat_Z49D52D2B(_, result);
    const a = _.values;
    const b = Mat4__get_Values(other);
    const values = Mat4__get_Values(result_1);
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];
    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];
    const b03 = b[3];
    const b10 = b[4];
    const b11 = b[5];
    const b12 = b[6];
    const b13 = b[7];
    const b20 = b[8];
    const b21 = b[9];
    const b22 = b[10];
    const b23 = b[11];
    const b30 = b[12];
    const b31 = b[13];
    const b32 = b[14];
    const b33 = b[15];
    values[0] = ((((b00 * a00) + (b01 * a10)) + (b02 * a20)) + (b03 * a30));
    values[1] = ((((b00 * a01) + (b01 * a11)) + (b02 * a21)) + (b03 * a31));
    values[2] = ((((b00 * a02) + (b01 * a12)) + (b02 * a22)) + (b03 * a32));
    values[3] = ((((b00 * a03) + (b01 * a13)) + (b02 * a23)) + (b03 * a33));
    values[4] = ((((b10 * a00) + (b11 * a10)) + (b12 * a20)) + (b13 * a30));
    values[5] = ((((b10 * a01) + (b11 * a11)) + (b12 * a21)) + (b13 * a31));
    values[6] = ((((b10 * a02) + (b11 * a12)) + (b12 * a22)) + (b13 * a32));
    values[7] = ((((b10 * a03) + (b11 * a13)) + (b12 * a23)) + (b13 * a33));
    values[8] = ((((b20 * a00) + (b21 * a10)) + (b22 * a20)) + (b23 * a30));
    values[9] = ((((b20 * a01) + (b21 * a11)) + (b22 * a21)) + (b23 * a31));
    values[10] = ((((b20 * a02) + (b21 * a12)) + (b22 * a22)) + (b23 * a32));
    values[11] = ((((b20 * a03) + (b21 * a13)) + (b22 * a23)) + (b23 * a33));
    values[12] = ((((b30 * a00) + (b31 * a10)) + (b32 * a20)) + (b33 * a30));
    values[13] = ((((b30 * a01) + (b31 * a11)) + (b32 * a21)) + (b33 * a31));
    values[14] = ((((b30 * a02) + (b31 * a12)) + (b32 * a22)) + (b33 * a32));
    values[15] = ((((b30 * a03) + (b31 * a13)) + (b32 * a23)) + (b33 * a33));
    return result_1;
}

export function Mat4__MultM_Z3D54A7A0(_, other) {
    const value = Mat4__Mult_Z51C3494B(_.m.contents, other, _.m.contents);
    void value;
}

export function Mat4__Translate_Z6F5B78D8(_, x, y, z, result) {
    const temp = Mat4_Create();
    return Mat4__Mult_Z51C3494B(_.m.contents, Mat4__Translation_Z6F5B78D8(_.m.contents, x, y, z, temp), result);
}

export function Mat4__TranslateM_8ED0A5D(_, x, y, z) {
    const value = Mat4__Translate_Z6F5B78D8(_.m.contents, x, y, z, _.m.contents);
    void value;
}

export function Mat4__Scale_Z6F5B78D8(_, x, y, z, result) {
    const temp = Mat4_Create();
    return Mat4__Mult_Z51C3494B(_.m.contents, Mat4__Scaled_Z6F5B78D8(_.m.contents, x, y, z, temp), result);
}

export function Mat4__ScaleM_8ED0A5D(_, x, y, z) {
    const value = Mat4__Scale_Z6F5B78D8(_.m.contents, x, y, z, _.m.contents);
    void value;
}

export function Mat4__RotateTrigZ_4055D635(_, cos, sin, result) {
    const temp = Mat4_Create();
    return Mat4__Mult_Z51C3494B(_.m.contents, Mat4__RotationTrigZ_4055D635(_.m.contents, cos, sin, temp), result);
}

export function Mat4__RotateTrigZM_2E41E8E0(_, cos, sin) {
    const value = Mat4__RotateTrigZ_4055D635(_.m.contents, cos, sin, _.m.contents);
    void value;
}

export function Mat4__RotateZ_Z244A12F1(_, angle, result) {
    const ang = angle;
    return Mat4__RotateTrigZ_4055D635(_.m.contents, Math.cos(ang), Math.sin(ang), result);
}

export function Mat4__RotateZM_6069AC9A(_, angle) {
    const value = Mat4__RotateZ_Z244A12F1(_.m.contents, angle, _.m.contents);
    void value;
}

export function Mat4__Inverse_Z49D52D2B(_, result) {
    const result_1 = defaultArgWith(result, Mat4_Create);
    const m00 = _.values[0];
    const m01 = _.values[1];
    const m02 = _.values[2];
    const m03 = _.values[3];
    const m10 = _.values[4];
    const m11 = _.values[5];
    const m12 = _.values[6];
    const m13 = _.values[7];
    const m20 = _.values[8];
    const m21 = _.values[9];
    const m22 = _.values[10];
    const m23 = _.values[11];
    const m30 = _.values[12];
    const m31 = _.values[13];
    const m32 = _.values[14];
    const m33 = _.values[15];
    const tmp00 = m22 * m33;
    const tmp01 = m32 * m23;
    const tmp02 = m12 * m33;
    const tmp03 = m32 * m13;
    const tmp04 = m12 * m23;
    const tmp05 = m22 * m13;
    const tmp06 = m02 * m33;
    const tmp07 = m32 * m03;
    const tmp08 = m02 * m23;
    const tmp09 = m22 * m03;
    const tmp10 = m02 * m13;
    const tmp11 = m12 * m03;
    const tmp12 = m20 * m31;
    const tmp13 = m30 * m21;
    const tmp14 = m10 * m31;
    const tmp15 = m30 * m11;
    const tmp16 = m10 * m21;
    const tmp17 = m20 * m11;
    const tmp18 = m00 * m31;
    const tmp19 = m30 * m01;
    const tmp20 = m00 * m21;
    const tmp21 = m20 * m01;
    const tmp22 = m00 * m11;
    const tmp23 = m10 * m01;
    const t0 = (((tmp00 * m11) + (tmp03 * m21)) + (tmp04 * m31)) - (((tmp01 * m11) + (tmp02 * m21)) + (tmp05 * m31));
    const t1 = (((tmp01 * m01) + (tmp06 * m21)) + (tmp09 * m31)) - (((tmp00 * m01) + (tmp07 * m21)) + (tmp08 * m31));
    const t2 = (((tmp02 * m01) + (tmp07 * m11)) + (tmp10 * m31)) - (((tmp03 * m01) + (tmp06 * m11)) + (tmp11 * m31));
    const t3 = (((tmp05 * m01) + (tmp08 * m11)) + (tmp11 * m21)) - (((tmp04 * m01) + (tmp09 * m11)) + (tmp10 * m21));
    const d = 1 / ((((m00 * t0) + (m10 * t1)) + (m20 * t2)) + (m30 * t3));
    const values = Mat4__get_Values(result_1);
    values[0] = (t0 * d);
    values[1] = (t1 * d);
    values[2] = (t2 * d);
    values[3] = (t3 * d);
    values[4] = (((((tmp01 * m10) + (tmp02 * m20)) + (tmp05 * m30)) - (((tmp00 * m10) + (tmp03 * m20)) + (tmp04 * m30))) * d);
    values[5] = (((((tmp00 * m00) + (tmp07 * m20)) + (tmp08 * m30)) - (((tmp01 * m00) + (tmp06 * m20)) + (tmp09 * m30))) * d);
    values[6] = (((((tmp03 * m00) + (tmp06 * m10)) + (tmp11 * m30)) - (((tmp02 * m00) + (tmp07 * m10)) + (tmp10 * m30))) * d);
    values[7] = (((((tmp04 * m00) + (tmp09 * m10)) + (tmp10 * m20)) - (((tmp05 * m00) + (tmp08 * m10)) + (tmp11 * m20))) * d);
    values[8] = (((((tmp12 * m13) + (tmp15 * m23)) + (tmp16 * m33)) - (((tmp13 * m13) + (tmp14 * m23)) + (tmp17 * m33))) * d);
    values[9] = (((((tmp13 * m03) + (tmp18 * m23)) + (tmp21 * m33)) - (((tmp12 * m03) + (tmp19 * m23)) + (tmp20 * m33))) * d);
    values[10] = (((((tmp14 * m03) + (tmp19 * m13)) + (tmp22 * m33)) - (((tmp15 * m03) + (tmp18 * m13)) + (tmp23 * m33))) * d);
    values[11] = (((((tmp17 * m03) + (tmp20 * m13)) + (tmp23 * m23)) - (((tmp16 * m03) + (tmp21 * m13)) + (tmp22 * m23))) * d);
    values[12] = (((((tmp14 * m22) + (tmp17 * m32)) + (tmp13 * m12)) - (((tmp16 * m32) + (tmp12 * m12)) + (tmp15 * m22))) * d);
    values[13] = (((((tmp20 * m32) + (tmp12 * m02)) + (tmp19 * m22)) - (((tmp18 * m22) + (tmp21 * m32)) + (tmp13 * m02))) * d);
    values[14] = (((((tmp18 * m12) + (tmp23 * m32)) + (tmp15 * m02)) - (((tmp22 * m32) + (tmp14 * m02)) + (tmp19 * m12))) * d);
    values[15] = (((((tmp22 * m22) + (tmp16 * m02)) + (tmp21 * m12)) - (((tmp20 * m12) + (tmp23 * m22)) + (tmp17 * m02))) * d);
    return result_1;
}

export function Mat4__InverseM(_) {
    const value = Mat4__Inverse_Z49D52D2B(_.m.contents, _.m.contents);
    void value;
}

function Mat4__optionalMat_Z49D52D2B(this$, mat) {
    return defaultArg(mat, this$.m.contents);
}

