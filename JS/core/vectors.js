import { max, min, sign, comparePrimitives, identityHash } from "../.fable/fable-library.3.0.0/Util.js";
import { collect, equalsWith } from "../.fable/fable-library.3.0.0/Array.js";
import { printf, toText } from "../.fable/fable-library.3.0.0/String.js";
import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { DEG_PER_RAD } from "./utils.js";
import { calcDef } from "./optionex.js";

export class Vec2 {
    constructor(values) {
        this.v = (new FSharpRef(null));
        const v = this.v;
        this.values = values;
        this.v.contents = this;
        this["Values@"] = this.values;
        this["init@6"] = 1;
    }
    GetHashCode() {
        const _ = this;
        return identityHash(Vec2__get_Values(_.v.contents)) | 0;
    }
    Equals(other) {
        let o;
        const _ = this;
        return (other instanceof Vec2) ? (o = other, equalsWith(comparePrimitives, Vec2__get_Values(_.v.contents), Vec2__get_Values(o))) : false;
    }
    toString() {
        const _ = this;
        const arg20 = _.v.contents.values[1];
        const arg10 = _.v.contents.values[0];
        return toText(printf("[%.2f, %.2f]"))(arg10)(arg20);
    }
}

export function Vec2$reflection() {
    return class_type("Wil.Core.Vec2", void 0, Vec2);
}

export function Vec2_$ctor_Z33A93963(values) {
    return new Vec2(values);
}

export function Vec2_Create() {
    return Vec2_$ctor_Z33A93963(new Float64Array([0, 0]));
}

export function Vec2_Create_5E38073B(x) {
    return Vec2_$ctor_Z33A93963(new Float64Array([x, x]));
}

export function Vec2_Create_7B00E9A0(x, y) {
    return Vec2_$ctor_Z33A93963(new Float64Array([x, y]));
}

export function Vec2__get_Values(__) {
    return __["Values@"];
}

export function Vec2__get_IntValues(_) {
    return new Int32Array([~(~_.values[0]), ~(~_.values[1])]);
}

export function Vec2__get_Angle(_) {
    const res = Math.atan2(_.v.contents.values[1], _.v.contents.values[0]);
    return ((res >= 0) ? res : (res + (2 * 3.141592653589793))) * 1;
}

export function Vec2__get_AngleDegrees(_) {
    return Vec2__get_Angle(_.v.contents) * DEG_PER_RAD;
}

export function Vec2__Clone(_) {
    return Vec2_$ctor_Z33A93963(new Float64Array([_.v.contents.values[0], _.v.contents.values[1]]));
}

export function Vec2__Add_Z50E8264B(_, other, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __5 = result_1;
    const x = _.v.contents.values[0] + other.values[0];
    const y = _.v.contents.values[1] + other.values[1];
    const __6 = __5.v.contents;
    __6.values[0] = x;
    const __7 = __5.v.contents;
    __7.values[1] = y;
    return __5.v.contents;
}

export function Vec2__AddM_Z3D47FC52(_, other) {
    const value = Vec2__Add_Z50E8264B(_.v.contents, other, _.v.contents);
    void value;
}

export function Vec2__Sub_Z50E8264B(_, other, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __5 = result_1;
    const x = _.v.contents.values[0] - other.values[0];
    const y = _.v.contents.values[1] - other.values[1];
    const __6 = __5.v.contents;
    __6.values[0] = x;
    const __7 = __5.v.contents;
    __7.values[1] = y;
    return __5.v.contents;
}

export function Vec2__Scale_Z6C68B1C0(_, s, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __3 = result_1;
    const x = _.v.contents.values[0] * s;
    const y = _.v.contents.values[1] * s;
    const __4 = __3.v.contents;
    __4.values[0] = x;
    const __5 = __3.v.contents;
    __5.values[1] = y;
    return __3.v.contents;
}

export function Vec2__Mult_Z50E8264B(_, other, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __5 = result_1;
    const x = _.v.contents.values[0] * other.values[0];
    const y = _.v.contents.values[1] * other.values[1];
    const __6 = __5.v.contents;
    __6.values[0] = x;
    const __7 = __5.v.contents;
    __7.values[1] = y;
    return __5.v.contents;
}

export function Vec2__Div_Z50E8264B(_, other, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __5 = result_1;
    const x = _.v.contents.values[0] / other.values[0];
    const y = _.v.contents.values[1] / other.values[1];
    const __6 = __5.v.contents;
    __6.values[0] = x;
    const __7 = __5.v.contents;
    __7.values[1] = y;
    return __5.v.contents;
}

export function Vec2__Negate_Z49505F25(_, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __3 = result_1;
    const x = -_.v.contents.values[0];
    const y = -_.v.contents.values[1];
    const __4 = __3.v.contents;
    __4.values[0] = x;
    const __5 = __3.v.contents;
    __5.values[1] = y;
    return __3.v.contents;
}

export function Vec2__Normalize_Z49505F25(_, result) {
    const result_1 = calcDef(Vec2_Create, result);
    let mag;
    const __1 = _.v.contents;
    mag = Math.sqrt((__1.v.contents.values[0] * __1.v.contents.values[0]) + (__1.v.contents.values[1] * __1.v.contents.values[1]));
    if (mag < 1E-09) {
        const __6 = result_1;
        const __7 = __6.v.contents;
        __7.values[0] = 0;
        const __8 = __6.v.contents;
        __8.values[1] = 0;
        return __6.v.contents;
    }
    else {
        const magInv = 1 / mag;
        const __11 = result_1;
        const x_1 = _.v.contents.values[0] * magInv;
        const y_1 = _.v.contents.values[1] * magInv;
        const __12 = __11.v.contents;
        __12.values[0] = x_1;
        const __13 = __11.v.contents;
        __13.values[1] = y_1;
        return __11.v.contents;
    }
}

export function Vec2__Rotate_Z24CF60FF(_, angle, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const angle_1 = angle;
    const sin = Math.sin(angle_1);
    const cos = Math.cos(angle_1);
    const __5 = result_1;
    const x = (_.v.contents.values[0] * cos) - (_.v.contents.values[1] * sin);
    const y = (_.v.contents.values[0] * sin) + (_.v.contents.values[1] * cos);
    const __6 = __5.v.contents;
    __6.values[0] = x;
    const __7 = __5.v.contents;
    __7.values[1] = y;
    return __5.v.contents;
}

export function Vec2__SetAngle_Z24CF60FF(_, angle, result) {
    const result_1 = calcDef(Vec2_Create, result);
    let mag;
    const __1 = _.v.contents;
    mag = Math.sqrt((__1.v.contents.values[0] * __1.v.contents.values[0]) + (__1.v.contents.values[1] * __1.v.contents.values[1]));
    const angle_1 = angle;
    const sin = Math.sin(angle_1);
    const cos = Math.cos(angle_1);
    const __6 = result_1;
    const x = cos * mag;
    const y = sin * mag;
    const __7 = __6.v.contents;
    __7.values[0] = x;
    const __8 = __6.v.contents;
    __8.values[1] = y;
    return __6.v.contents;
}

export function Vec2__Perp_Z49505F25(_, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __3 = result_1;
    const x = -_.v.contents.values[1];
    const y = _.v.contents.values[0];
    const __4 = __3.v.contents;
    __4.values[0] = x;
    const __5 = __3.v.contents;
    __5.values[1] = y;
    return __3.v.contents;
}

export function Vec2__PerpLeft_Z49505F25(_, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __3 = result_1;
    const x = -_.v.contents.values[1];
    const y = _.v.contents.values[0];
    const __4 = __3.v.contents;
    __4.values[0] = x;
    const __5 = __3.v.contents;
    __5.values[1] = y;
    return __3.v.contents;
}

export function Vec2__PerpRight_Z49505F25(_, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __3 = result_1;
    const x = _.v.contents.values[1];
    const y = -_.v.contents.values[0];
    const __4 = __3.v.contents;
    __4.values[0] = x;
    const __5 = __3.v.contents;
    __5.values[1] = y;
    return __3.v.contents;
}

export function Vec2__PerpToward_Z50E8264B(_, toward, result) {
    let __1, other;
    const result_1 = calcDef(Vec2_Create, result);
    const sgn = sign((__1 = toward, (other = _.v.contents, (__1.v.contents.values[0] * other.values[1]) - (__1.v.contents.values[1] * other.values[0]))));
    const __8 = result_1;
    const x = _.v.contents.values[1] * sgn;
    const y = _.v.contents.values[0] * sgn;
    const __9 = __8.v.contents;
    __9.values[0] = x;
    const __10 = __8.v.contents;
    __10.values[1] = y;
    return __8.v.contents;
}

export function Vec2__Min_Z50E8264B(_, other, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __5 = result_1;
    const x_2 = min(comparePrimitives, _.v.contents.values[0], other.values[0]);
    const y_2 = min(comparePrimitives, _.v.contents.values[1], other.values[1]);
    const __6 = __5.v.contents;
    __6.values[0] = x_2;
    const __7 = __5.v.contents;
    __7.values[1] = y_2;
    return __5.v.contents;
}

export function Vec2__Max_Z50E8264B(_, other, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __5 = result_1;
    const x_2 = max(comparePrimitives, _.v.contents.values[0], other.values[0]);
    const y_2 = max(comparePrimitives, _.v.contents.values[1], other.values[1]);
    const __6 = __5.v.contents;
    __6.values[0] = x_2;
    const __7 = __5.v.contents;
    __7.values[1] = y_2;
    return __5.v.contents;
}

export function Vec2__Ceil_Z49505F25(_, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __3 = result_1;
    const x = Math.ceil(_.v.contents.values[0]);
    const y = Math.ceil(_.v.contents.values[1]);
    const __4 = __3.v.contents;
    __4.values[0] = x;
    const __5 = __3.v.contents;
    __5.values[1] = y;
    return __3.v.contents;
}

export function Vec2__Floor_Z49505F25(_, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __3 = result_1;
    const x = Math.floor(_.v.contents.values[0]);
    const y = Math.floor(_.v.contents.values[1]);
    const __4 = __3.v.contents;
    __4.values[0] = x;
    const __5 = __3.v.contents;
    __5.values[1] = y;
    return __3.v.contents;
}

export function Vec2__Fract_Z49505F25(_, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __5 = result_1;
    const x = _.v.contents.values[0] - Math.floor(_.v.contents.values[0]);
    const y = _.v.contents.values[1] - Math.floor(_.v.contents.values[1]);
    const __6 = __5.v.contents;
    __6.values[0] = x;
    const __7 = __5.v.contents;
    __7.values[1] = y;
    return __5.v.contents;
}

export function Vec2__WithXY_6DB1BD7B(_, x, y, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __1 = result_1;
    const __2 = __1.v.contents;
    __2.values[0] = x;
    const __3 = __1.v.contents;
    __3.values[1] = y;
    return __1.v.contents;
}

export function Vec2__WithX_Z6C68B1C0(_, x, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __2 = result_1;
    const y = _.v.contents.values[1];
    const __3 = __2.v.contents;
    __3.values[0] = x;
    const __4 = __2.v.contents;
    __4.values[1] = y;
    return __2.v.contents;
}

export function Vec2__WithY_Z6C68B1C0(_, y, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const __2 = result_1;
    const x = _.v.contents.values[0];
    const __3 = __2.v.contents;
    __3.values[0] = x;
    const __4 = __2.v.contents;
    __4.values[1] = y;
    return __2.v.contents;
}

export function Vec2_op_UnaryNegation_Z3D47FC52(v1) {
    return Vec2__Negate_Z49505F25(v1);
}

export function Vec2_op_TwiddleMinusDot_Z3D47FC52(v1) {
    const _ = v1;
    const value = Vec2__Negate_Z49505F25(_.v.contents, _.v.contents);
    void value;
}

export function Vec2_op_BangBang_Z3D47FC52(v1) {
    return Vec2__Normalize_Z49505F25(v1);
}

export function Vec2_op_BangBangEquals_Z3D47FC52(v1) {
    const _ = v1;
    const value = Vec2__Normalize_Z49505F25(_.v.contents, _.v.contents);
    void value;
}

export function Vec2_op_Addition_47807E55(v1, value) {
    return Vec2_Create_7B00E9A0(v1.values[0] + value, v1.values[1] + value);
}

export function Vec2_op_Addition_Z187F12CB(value, v1) {
    return Vec2_Create_7B00E9A0(v1.values[0] + value, v1.values[1] + value);
}

export function Vec2_op_Addition_Z24FF8540(v1, v2) {
    return Vec2__Add_Z50E8264B(v1, v2);
}

export function Vec2_op_AdditionAssignment_47807E55(v1, value) {
    const __2 = v1;
    const value_1 = Vec2__WithXY_6DB1BD7B(__2.v.contents, v1.values[0] + value, v1.values[1] + value, __2.v.contents);
    void value_1;
}

export function Vec2_op_AdditionAssignment_Z187F12CB(value, v1) {
    const __2 = v1;
    const value_1 = Vec2__WithXY_6DB1BD7B(__2.v.contents, v1.values[0] + value, v1.values[1] + value, __2.v.contents);
    void value_1;
}

export function Vec2_op_AdditionAssignment_Z24FF8540(v1, v2) {
    Vec2__AddM_Z3D47FC52(v1, v2);
}

export function Vec2_op_Subtraction_47807E55(v1, value) {
    return Vec2_Create_7B00E9A0(v1.values[0] - value, v1.values[1] - value);
}

export function Vec2_op_Subtraction_Z187F12CB(value, v1) {
    return Vec2_Create_7B00E9A0(value - v1.values[0], value - v1.values[1]);
}

export function Vec2_op_Subtraction_Z24FF8540(v1, v2) {
    return Vec2__Sub_Z50E8264B(v1, v2);
}

export function Vec2_op_SubtractionAssignment_47807E55(v1, value) {
    const __2 = v1;
    const value_1 = Vec2__WithXY_6DB1BD7B(__2.v.contents, v1.values[0] - value, v1.values[1] - value, __2.v.contents);
    void value_1;
}

export function Vec2_op_SubtractionAssignment_Z187F12CB(value, v1) {
    const __2 = v1;
    const value_1 = Vec2__WithXY_6DB1BD7B(__2.v.contents, value - v1.values[0], value - v1.values[1], __2.v.contents);
    void value_1;
}

export function Vec2_op_SubtractionAssignment_Z24FF8540(v1, v2) {
    const _ = v1;
    const value = Vec2__Sub_Z50E8264B(_.v.contents, v2, _.v.contents);
    void value;
}

export function Vec2_op_Multiply_47807E55(v1, scale) {
    return Vec2__Scale_Z6C68B1C0(v1, scale);
}

export function Vec2_op_Multiply_Z187F12CB(scale, v1) {
    return Vec2__Scale_Z6C68B1C0(v1, scale);
}

export function Vec2_op_MultiplyAssignment_47807E55(v1, scale) {
    const _ = v1;
    const value = Vec2__Scale_Z6C68B1C0(_.v.contents, scale, _.v.contents);
    void value;
}

export function Vec2_op_MultiplyAssignment_Z187F12CB(scale, v1) {
    const _ = v1;
    const value = Vec2__Scale_Z6C68B1C0(_.v.contents, scale, _.v.contents);
    void value;
}

export function Vec2_op_Multiply_Z24FF8540(v1, v2) {
    return Vec2__Mult_Z50E8264B(v1, v2);
}

export function Vec2_op_MultiplyAssignment_Z24FF8540(v1, v2) {
    const _ = v1;
    const value = Vec2__Mult_Z50E8264B(_.v.contents, v2, _.v.contents);
    void value;
}

export function Vec2_op_Division_47807E55(v1, divisor) {
    return Vec2__Scale_Z6C68B1C0(v1, 1 / divisor);
}

export function Vec2_op_Division_Z187F12CB(value, v1) {
    return Vec2_Create_7B00E9A0(value / v1.values[0], value / v1.values[1]);
}

export function Vec2_op_Division_Z24FF8540(v1, v2) {
    return Vec2__Div_Z50E8264B(v1, v2);
}

export function Vec2_op_DivisionAssignment_47807E55(v1, divisor) {
    const _ = v1;
    const value = Vec2__Scale_Z6C68B1C0(_.v.contents, 1 / divisor, _.v.contents);
    void value;
}

export function Vec2_op_DivisionAssignment_Z24FF8540(v1, v2) {
    const _ = v1;
    const value = Vec2__Div_Z50E8264B(_.v.contents, v2, _.v.contents);
    void value;
}

export function Vec2_op_Modulus_47807E55(v1, value) {
    return Vec2_Create_7B00E9A0(v1.values[0] % value, v1.values[1] % value);
}

export function Vec2_op_Modulus_Z187F12CB(value, v1) {
    return Vec2_Create_7B00E9A0(value % v1.values[0], value % v1.values[1]);
}

export function Vec2_op_Modulus_Z24FF8540(v1, v2) {
    return Vec2_Create_7B00E9A0(v1.values[0] % v2.values[0], v1.values[1] % v2.values[1]);
}

export function Vec2_op_PercentEquals_Z24FF8540(v1, v2) {
    const __4 = v1;
    const value = Vec2__WithXY_6DB1BD7B(__4.v.contents, v1.values[0] % v2.values[0], v1.values[1] % v2.values[1], __4.v.contents);
    void value;
}

export function Vec2_op_DotMultiply_Z24FF8540(v1, v2) {
    const _ = v1;
    const other = v2;
    return (_.v.contents.values[0] * other.values[0]) + (_.v.contents.values[1] * other.values[1]);
}

export function Vec2_op_PlusMultiply_Z24FF8540(v1, v2) {
    const _ = v1;
    const other = v2;
    return (_.v.contents.values[0] * other.values[1]) - (_.v.contents.values[1] * other.values[0]);
}

export class Vec3 {
    constructor(values) {
        this.v = (new FSharpRef(null));
        const v = this.v;
        this.values = values;
        this.v.contents = this;
        this["Values@"] = this.values;
        this["init@273-1"] = 1;
    }
    GetHashCode() {
        const _ = this;
        return identityHash(Vec3__get_Values(_.v.contents)) | 0;
    }
    Equals(other) {
        let o;
        const _ = this;
        return (other instanceof Vec3) ? (o = other, equalsWith(comparePrimitives, Vec3__get_Values(_.v.contents), Vec3__get_Values(o))) : false;
    }
    toString() {
        const _ = this;
        const arg30 = _.v.contents.values[2];
        const arg20 = _.v.contents.values[1];
        const arg10 = _.v.contents.values[0];
        return toText(printf("[%.2f, %.2f, %.2f]"))(arg10)(arg20)(arg30);
    }
}

export function Vec3$reflection() {
    return class_type("Wil.Core.Vec3", void 0, Vec3);
}

export function Vec3_$ctor_Z14AF5965(values) {
    return new Vec3(values);
}

export function Vec3_Create() {
    return Vec3_$ctor_Z14AF5965(new Float64Array([0, 0, 0]));
}

export function Vec3_Create_5E38073B(x) {
    return Vec3_$ctor_Z14AF5965(new Float64Array([x, x, x]));
}

export function Vec3_Create_8ED0A5D(x, y, z) {
    return Vec3_$ctor_Z14AF5965(new Float64Array([x, y, z]));
}

export function Vec3_Create_Z18D5882D(v2, z) {
    return Vec3_$ctor_Z14AF5965(new Float64Array([v2.values[0], v2.values[1], z]));
}

export function Vec3__get_Values(__) {
    return __["Values@"];
}

export function Vec3__get_IntValues(_) {
    return new Int32Array([~(~_.values[0]), ~(~_.values[1]), ~(~_.values[2])]);
}

export function Vec3__Clone(_) {
    return Vec3_$ctor_Z14AF5965(new Float64Array([_.v.contents.values[0], _.v.contents.values[1], _.v.contents.values[2]]));
}

export function Vec3__CrossM_Z3D47FC51(_, other) {
    let value_3;
    const __1 = _.v.contents;
    const other_1 = other;
    const result_1 = calcDef(Vec3_Create, _.v.contents);
    const __14 = result_1;
    const x = (__1.v.contents.values[1] * other_1.values[2]) - (__1.v.contents.values[2] * other_1.values[1]);
    const y = (__1.v.contents.values[2] * other_1.values[0]) - (__1.v.contents.values[0] * other_1.values[2]);
    const z = (__1.v.contents.values[0] * other_1.values[1]) - (__1.v.contents.values[1] * other_1.values[0]);
    const __15 = __14.v.contents;
    __15.values[0] = x;
    const __16 = __14.v.contents;
    __16.values[1] = y;
    const __17 = __14.v.contents;
    __17.values[2] = z;
    value_3 = __14.v.contents;
    void value_3;
}

export function Vec3__Add_Z50E8268B(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __7 = result_1;
    const x = _.v.contents.values[0] + other.values[0];
    const y = _.v.contents.values[1] + other.values[1];
    const z = _.v.contents.values[2] + other.values[2];
    const __8 = __7.v.contents;
    __8.values[0] = x;
    const __9 = __7.v.contents;
    __9.values[1] = y;
    const __10 = __7.v.contents;
    __10.values[2] = z;
    return __7.v.contents;
}

export function Vec3__AddM_Z3D47FC51(_, other) {
    const value = Vec3__Add_Z50E8268B(_.v.contents, other, _.v.contents);
    void value;
}

export function Vec3__Sub_Z50E8268B(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __7 = result_1;
    const x = _.v.contents.values[0] - other.values[0];
    const y = _.v.contents.values[1] - other.values[1];
    const z = _.v.contents.values[2] - other.values[2];
    const __8 = __7.v.contents;
    __8.values[0] = x;
    const __9 = __7.v.contents;
    __9.values[1] = y;
    const __10 = __7.v.contents;
    __10.values[2] = z;
    return __7.v.contents;
}

export function Vec3__Scale_667C46A7(_, s, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = _.v.contents.values[0] * s;
    const y = _.v.contents.values[1] * s;
    const z = _.v.contents.values[2] * s;
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__Mult_Z50E8268B(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __7 = result_1;
    const x = _.v.contents.values[0] * other.values[0];
    const y = _.v.contents.values[1] * other.values[1];
    const z = _.v.contents.values[2] * other.values[2];
    const __8 = __7.v.contents;
    __8.values[0] = x;
    const __9 = __7.v.contents;
    __9.values[1] = y;
    const __10 = __7.v.contents;
    __10.values[2] = z;
    return __7.v.contents;
}

export function Vec3__Div_Z50E8268B(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __7 = result_1;
    const x = _.v.contents.values[0] / other.values[0];
    const y = _.v.contents.values[1] / other.values[1];
    const z = _.v.contents.values[2] / other.values[2];
    const __8 = __7.v.contents;
    __8.values[0] = x;
    const __9 = __7.v.contents;
    __9.values[1] = y;
    const __10 = __7.v.contents;
    __10.values[2] = z;
    return __7.v.contents;
}

export function Vec3__Negate_Z49505F06(_, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = -_.v.contents.values[0];
    const y = -_.v.contents.values[1];
    const z = -_.v.contents.values[2];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__Normalize_Z49505F06(_, result) {
    const result_1 = calcDef(Vec3_Create, result);
    let mag;
    const __1 = _.v.contents;
    mag = Math.sqrt(((__1.v.contents.values[0] * __1.v.contents.values[0]) + (__1.v.contents.values[1] * __1.v.contents.values[1])) + (__1.v.contents.values[2] * __1.v.contents.values[2]));
    if (mag < 1E-09) {
        const __8 = result_1;
        const __9 = __8.v.contents;
        __9.values[0] = 0;
        const __10 = __8.v.contents;
        __10.values[1] = 0;
        const __11 = __8.v.contents;
        __11.values[2] = 0;
        return __8.v.contents;
    }
    else {
        const magInv = 1 / mag;
        const __15 = result_1;
        const x_1 = _.v.contents.values[0] * magInv;
        const y_1 = _.v.contents.values[1] * magInv;
        const z_1 = _.v.contents.values[2] * magInv;
        const __16 = __15.v.contents;
        __16.values[0] = x_1;
        const __17 = __15.v.contents;
        __17.values[1] = y_1;
        const __18 = __15.v.contents;
        __18.values[2] = z_1;
        return __15.v.contents;
    }
}

export function Vec3__Ceil_Z49505F06(_, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = Math.ceil(_.v.contents.values[0]);
    const y = Math.ceil(_.v.contents.values[1]);
    const z = Math.ceil(_.v.contents.values[2]);
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__Floor_Z49505F06(_, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = Math.floor(_.v.contents.values[0]);
    const y = Math.floor(_.v.contents.values[1]);
    const z = Math.floor(_.v.contents.values[2]);
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__Fract_Z49505F06(_, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __7 = result_1;
    const x = _.v.contents.values[0] - Math.floor(_.v.contents.values[0]);
    const y = _.v.contents.values[1] - Math.floor(_.v.contents.values[1]);
    const z = _.v.contents.values[2] - Math.floor(_.v.contents.values[2]);
    const __8 = __7.v.contents;
    __8.values[0] = x;
    const __9 = __7.v.contents;
    __9.values[1] = y;
    const __10 = __7.v.contents;
    __10.values[2] = z;
    return __7.v.contents;
}

export function Vec3__WithXYZ_Z6FDE0AF9(_, x, y, z, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __1 = result_1;
    const __2 = __1.v.contents;
    __2.values[0] = x;
    const __3 = __1.v.contents;
    __3.values[1] = y;
    const __4 = __1.v.contents;
    __4.values[2] = z;
    return __1.v.contents;
}

export function Vec3__WithXY_40D0A41A(_, x, y, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __2 = result_1;
    const z = _.v.contents.values[2];
    const __3 = __2.v.contents;
    __3.values[0] = x;
    const __4 = __2.v.contents;
    __4.values[1] = y;
    const __5 = __2.v.contents;
    __5.values[2] = z;
    return __2.v.contents;
}

export function Vec3__WithXY_Z50E8266C(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = other.values[0];
    const y = other.values[1];
    const z = _.v.contents.values[2];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__WithXY_Z50E8268B(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = other.values[0];
    const y = other.values[1];
    const z = _.v.contents.values[2];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__WithXZ_40D0A41A(_, x, z, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __2 = result_1;
    const y = _.v.contents.values[1];
    const __3 = __2.v.contents;
    __3.values[0] = x;
    const __4 = __2.v.contents;
    __4.values[1] = y;
    const __5 = __2.v.contents;
    __5.values[2] = z;
    return __2.v.contents;
}

export function Vec3__WithXZ_Z50E8266C(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = other.values[0];
    const y = _.v.contents.values[1];
    const z = other.values[1];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__WithXZ_Z50E8268B(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = other.values[0];
    const y = _.v.contents.values[1];
    const z = other.values[1];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__WithYZ_40D0A41A(_, y, z, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __2 = result_1;
    const x = _.v.contents.values[0];
    const __3 = __2.v.contents;
    __3.values[0] = x;
    const __4 = __2.v.contents;
    __4.values[1] = y;
    const __5 = __2.v.contents;
    __5.values[2] = z;
    return __2.v.contents;
}

export function Vec3__WithYZ_Z50E8266C(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = _.v.contents.values[0];
    const y = other.values[0];
    const z = other.values[1];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3__WithYZ_Z50E8268B(_, other, result) {
    const result_1 = calcDef(Vec3_Create, result);
    const __4 = result_1;
    const x = _.v.contents.values[0];
    const y = other.values[0];
    const z = other.values[1];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    return __4.v.contents;
}

export function Vec3_op_UnaryNegation_Z3D47FC51(v1) {
    return Vec3__Negate_Z49505F06(v1);
}

export function Vec3_op_TwiddleMinusDot_Z3D47FC51(v1) {
    const _ = v1;
    const value = Vec3__Negate_Z49505F06(_.v.contents, _.v.contents);
    void value;
}

export function Vec3_op_BangBang_Z3D47FC51(v1) {
    return Vec3__Normalize_Z49505F06(v1);
}

export function Vec3_op_BangBangEquals_Z3D47FC51(v1) {
    const _ = v1;
    const value = Vec3__Normalize_Z49505F06(_.v.contents, _.v.contents);
    void value;
}

export function Vec3_op_Addition_Z24FF85E0(v1, v2) {
    return Vec3__Add_Z50E8268B(v1, v2);
}

export function Vec3_op_AdditionAssignment_Z24FF85E0(v1, v2) {
    Vec3__AddM_Z3D47FC51(v1, v2);
}

export function Vec3_op_Subtraction_126BE5F2(value, v1) {
    return Vec3_Create_8ED0A5D(value - v1.values[0], value - v1.values[1], value - v1.values[2]);
}

export function Vec3_op_Subtraction_Z24FF85E0(v1, v2) {
    return Vec3__Sub_Z50E8268B(v1, v2);
}

export function Vec3_op_SubtractionAssignment_Z24FF85E0(v1, v2) {
    const _ = v1;
    const value = Vec3__Sub_Z50E8268B(_.v.contents, v2, _.v.contents);
    void value;
}

export function Vec3_op_Multiply_Z18D588CE(v1, scale) {
    return Vec3__Scale_667C46A7(v1, scale);
}

export function Vec3_op_Multiply_126BE5F2(scale, v1) {
    return Vec3__Scale_667C46A7(v1, scale);
}

export function Vec3_op_MultiplyAssignment_Z18D588CE(v1, scale) {
    const _ = v1;
    const value = Vec3__Scale_667C46A7(_.v.contents, scale, _.v.contents);
    void value;
}

export function Vec3_op_MultiplyAssignment_126BE5F2(scale, v1) {
    const _ = v1;
    const value = Vec3__Scale_667C46A7(_.v.contents, scale, _.v.contents);
    void value;
}

export function Vec3_op_Multiply_Z24FF85E0(v1, v2) {
    return Vec3__Mult_Z50E8268B(v1, v2);
}

export function Vec3_op_MultiplyAssignment_Z24FF85E0(v1, v2) {
    const _ = v1;
    const value = Vec3__Mult_Z50E8268B(_.v.contents, v2, _.v.contents);
    void value;
}

export function Vec3_op_Division_47807EB4(v1, divisor) {
    return Vec3__Scale_667C46A7(v1, 1 / divisor);
}

export function Vec3_op_Division_Z187F12CC(value, v1) {
    return Vec3_Create_8ED0A5D(value / v1.values[0], value / v1.values[2], value / v1.values[2]);
}

export function Vec3_op_Division_Z24FF85E0(v1, v2) {
    return Vec3__Div_Z50E8268B(v1, v2);
}

export function Vec3_op_DivisionAssignment_47807EB4(v1, divisor) {
    const _ = v1;
    const value = Vec3__Scale_667C46A7(_.v.contents, 1 / divisor, _.v.contents);
    void value;
}

export function Vec3_op_DivisionAssignment_Z24FF85E0(v1, v2) {
    const _ = v1;
    const value = Vec3__Div_Z50E8268B(_.v.contents, v2, _.v.contents);
    void value;
}

export function Vec3_op_DotMultiply_Z24FF85E0(v1, v2) {
    const _ = v1;
    const other = v2;
    return ((_.v.contents.values[0] * other.values[0]) + (_.v.contents.values[1] * other.values[1])) + (_.v.contents.values[2] * other.values[2]);
}

export function Vec3_op_PlusMultiply_Z24FF85E0(v1, v2) {
    const _ = v1;
    const other = v2;
    const result_1 = calcDef(Vec3_Create, void 0);
    const __13 = result_1;
    const x = (_.v.contents.values[1] * other.values[2]) - (_.v.contents.values[2] * other.values[1]);
    const y = (_.v.contents.values[2] * other.values[0]) - (_.v.contents.values[0] * other.values[2]);
    const z = (_.v.contents.values[0] * other.values[1]) - (_.v.contents.values[1] * other.values[0]);
    const __14 = __13.v.contents;
    __14.values[0] = x;
    const __15 = __13.v.contents;
    __15.values[1] = y;
    const __16 = __13.v.contents;
    __16.values[2] = z;
    return __13.v.contents;
}

export class Vec4 {
    constructor(values) {
        this.v = (new FSharpRef(null));
        const v = this.v;
        this.values = values;
        this.v.contents = this;
        this["Values@"] = this.values;
        this["init@513-2"] = 1;
    }
    GetHashCode() {
        const _ = this;
        return identityHash(Vec4__get_Values(_.v.contents)) | 0;
    }
    Equals(other) {
        let o;
        const _ = this;
        return (other instanceof Vec4) ? (o = other, equalsWith(comparePrimitives, Vec4__get_Values(_.v.contents), Vec4__get_Values(o))) : false;
    }
}

export function Vec4$reflection() {
    return class_type("Wil.Core.Vec4", void 0, Vec4);
}

export function Vec4_$ctor_Z14AF5965(values) {
    return new Vec4(values);
}

export function Vec4_Create_Z27E3A4C0(x, y, z, w) {
    return Vec4_$ctor_Z14AF5965(new Float64Array([x, y, z, w]));
}

export function Vec4_Create_Z16DF143(x) {
    return Vec4_$ctor_Z14AF5965(new Float64Array([x, x, x, x]));
}

export function Vec4_Create() {
    return Vec4_$ctor_Z14AF5965(new Float64Array([0, 0, 0, 1]));
}

export function Vec4_Create_32EB7C8E(v2, z, w) {
    return Vec4_$ctor_Z14AF5965(new Float64Array([v2.values[0], v2.values[1], z, w]));
}

export function Vec4_Create_Z18D588CE(v3, w) {
    return Vec4_$ctor_Z14AF5965(new Float64Array([v3.values[0], v3.values[1], v3.values[2], w]));
}

export function Vec4__get_Values(__) {
    return __["Values@"];
}

export function Vec4__get_IntValues(_) {
    return new Int32Array([~(~_.values[0]), ~(~_.values[1]), ~(~_.values[2]), ~(~_.values[3])]);
}

export function Vec4__Clone(_) {
    return Vec4_$ctor_Z14AF5965(new Float64Array([_.v.contents.values[0], _.v.contents.values[1], _.v.contents.values[2], _.v.contents.values[3]]));
}

export function Vec4__Add_Z50E818CB(_, other, result) {
    const result_1 = calcDef(Vec4_Create, result);
    const __9 = result_1;
    const x = _.v.contents.values[0] + other.values[0];
    const y = _.v.contents.values[1] + other.values[1];
    const z = _.v.contents.values[2] + other.values[2];
    const w = _.v.contents.values[3] + other.values[3];
    const __10 = __9.v.contents;
    __10.values[0] = x;
    const __11 = __9.v.contents;
    __11.values[1] = y;
    const __12 = __9.v.contents;
    __12.values[2] = z;
    const __13 = __9.v.contents;
    __13.values[3] = w;
    return __9.v.contents;
}

export function Vec4__AddM_Z3D47FC58(_, other) {
    const value = Vec4__Add_Z50E818CB(_.v.contents, other, _.v.contents);
    void value;
}

export function Vec4__Sub_Z50E818CB(_, other, result) {
    const result_1 = calcDef(Vec4_Create, result);
    const __9 = result_1;
    const x = _.v.contents.values[0] - other.values[0];
    const y = _.v.contents.values[1] - other.values[1];
    const z = _.v.contents.values[2] - other.values[2];
    const w = _.v.contents.values[3] - other.values[3];
    const __10 = __9.v.contents;
    __10.values[0] = x;
    const __11 = __9.v.contents;
    __11.values[1] = y;
    const __12 = __9.v.contents;
    __12.values[2] = z;
    const __13 = __9.v.contents;
    __13.values[3] = w;
    return __9.v.contents;
}

export function Vec4__Scale_667C79C0(_, s, result) {
    const result_1 = calcDef(Vec4_Create, result);
    const __5 = result_1;
    const x = _.v.contents.values[0] * s;
    const y = _.v.contents.values[1] * s;
    const z = _.v.contents.values[2] * s;
    const w = _.v.contents.values[3];
    const __6 = __5.v.contents;
    __6.values[0] = x;
    const __7 = __5.v.contents;
    __7.values[1] = y;
    const __8 = __5.v.contents;
    __8.values[2] = z;
    const __9 = __5.v.contents;
    __9.values[3] = w;
    return __5.v.contents;
}

export function Vec4__Negate_Z49506063(_, result) {
    const result_1 = calcDef(Vec4_Create, result);
    const __5 = result_1;
    const x = -_.v.contents.values[0];
    const y = -_.v.contents.values[1];
    const z = -_.v.contents.values[2];
    const w = _.v.contents.values[3];
    const __6 = __5.v.contents;
    __6.values[0] = x;
    const __7 = __5.v.contents;
    __7.values[1] = y;
    const __8 = __5.v.contents;
    __8.values[2] = z;
    const __9 = __5.v.contents;
    __9.values[3] = w;
    return __5.v.contents;
}

export function Vec4__Normalize_Z49506063(_, result) {
    const result_1 = calcDef(Vec4_Create, result);
    let mag;
    const __1 = _.v.contents;
    mag = Math.sqrt(((__1.v.contents.values[0] * __1.v.contents.values[0]) + (__1.v.contents.values[1] * __1.v.contents.values[1])) + (__1.v.contents.values[2] * __1.v.contents.values[2]));
    if (mag < 1E-09) {
        const __8 = result_1;
        const __9 = __8.v.contents;
        __9.values[0] = 0;
        const __10 = __8.v.contents;
        __10.values[1] = 0;
        const __11 = __8.v.contents;
        __11.values[2] = 0;
        const __12 = __8.v.contents;
        __12.values[3] = 0;
        return __8.v.contents;
    }
    else {
        const magInv = 1 / mag;
        if ((_.v.contents.values[3] !== 0) ? (_.v.contents.values[3] !== 1) : false) {
            const mult = (1 / _.v.contents.values[3]) * magInv;
            const __19 = result_1;
            const x_1 = _.v.contents.values[0] * mult;
            const y_1 = _.v.contents.values[1] * mult;
            const z_1 = _.v.contents.values[2] * mult;
            const __20 = __19.v.contents;
            __20.values[0] = x_1;
            const __21 = __19.v.contents;
            __21.values[1] = y_1;
            const __22 = __19.v.contents;
            __22.values[2] = z_1;
            const __23 = __19.v.contents;
            __23.values[3] = 1;
            return __19.v.contents;
        }
        else {
            const __28 = result_1;
            const x_2 = _.v.contents.values[0] * magInv;
            const y_2 = _.v.contents.values[1] * magInv;
            const z_2 = _.v.contents.values[2] * magInv;
            const w_2 = _.v.contents.values[3];
            const __29 = __28.v.contents;
            __29.values[0] = x_2;
            const __30 = __28.v.contents;
            __30.values[1] = y_2;
            const __31 = __28.v.contents;
            __31.values[2] = z_2;
            const __32 = __28.v.contents;
            __32.values[3] = w_2;
            return __28.v.contents;
        }
    }
}

export function Vec4_op_Subtraction_126BE5F5(value, v1) {
    return Vec4_Create_Z27E3A4C0(value - v1.values[0], value - v1.values[1], value - v1.values[2], value - v1.values[3]);
}

export function Vec_lerp2(v1, v2, t) {
    return Vec2_Create_7B00E9A0(v1.values[0] + ((v2.values[0] - v1.values[0]) * t), v1.values[1] + ((v2.values[1] - v1.values[1]) * t));
}

export function Vec_lerp2v(v1, v2, t) {
    const u = Vec2_op_Subtraction_Z187F12CB(1, t);
    return Vec2_Create_7B00E9A0(v1.values[0] + ((v2.values[0] - v1.values[0]) * t.values[0]), v1.values[1] + ((v2.values[1] - v1.values[1]) * t.values[1]));
}

export function Vec_lerp3(v1, v2, t) {
    return Vec3_Create_8ED0A5D(v1.values[0] + ((v2.values[0] - v1.values[0]) * t), v1.values[1] + ((v2.values[1] - v1.values[1]) * t), v1.values[2] + ((v2.values[2] - v1.values[2]) * t));
}

export function Vec_lerp3v(v1, v2, t) {
    return Vec3_Create_8ED0A5D(v1.values[0] + ((v2.values[0] - v1.values[0]) * t.values[0]), v1.values[1] + ((v2.values[1] - v1.values[1]) * t.values[1]), v1.values[2] + ((v2.values[2] - v1.values[2]) * t.values[2]));
}

export function Vec_lerp4(v1, v2, t) {
    return Vec4_Create_Z27E3A4C0(v1.values[0] + ((v2.values[0] - v1.values[0]) * t), v1.values[1] + ((v2.values[1] - v1.values[1]) * t), v1.values[2] + ((v2.values[2] - v1.values[2]) * t), v1.values[3] + ((v2.values[3] - v1.values[3]) * t));
}

export function Vec_lerp4v(v1, v2, t) {
    return Vec4_Create_Z27E3A4C0(v1.values[0] + ((v2.values[0] - v1.values[0]) * t.values[0]), v1.values[1] + ((v2.values[1] - v1.values[1]) * t.values[1]), v1.values[2] + ((v2.values[2] - v1.values[2]) * t.values[2]), v1.values[3] + ((v2.values[3] - v1.values[3]) * t.values[3]));
}

export function Vec_vec2Values(lst) {
    return collect(Vec2__get_Values, lst, Float64Array);
}

export function Vec_vec2ValuesL(lst) {
    return Vec_vec2Values(Array.from(lst));
}

