import { printf, toText } from "../.fable/fable-library.3.0.0/String.js";
import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { Vec2_Create, Vec2__Mult_Z50E8264B, Vec2__WithY_Z6C68B1C0, Vec2__WithX_Z6C68B1C0, Vec2__WithXY_6DB1BD7B, Vec2_op_Multiply_47807E55, Vec2_op_Subtraction_Z24FF8540, Vec2_op_Addition_Z24FF8540, Vec2__Add_Z50E8264B, Vec2__Sub_Z50E8264B, Vec2__Scale_Z6C68B1C0, Vec2__Clone, Vec2_Create_7B00E9A0 } from "../core/vectors.js";
import { calcDef } from "../core/optionex.js";
import { min as min_1, comparePrimitives, max as max_1 } from "../.fable/fable-library.3.0.0/Util.js";

export class Bounds {
    constructor(center, halfSize) {
        this.b = (new FSharpRef(null));
        const b = this.b;
        this.center = center;
        this.halfSize = halfSize;
        this.b.contents = this;
        this["init@6-7"] = 1;
    }
    toString() {
        const b = this;
        const arg20 = Bounds__get_Max(b);
        const arg10 = Bounds__get_Min(b);
        return toText(printf("%A -\u003e %A"))(arg10)(arg20);
    }
}

export function Bounds$reflection() {
    return class_type("Wil.Twod.Bounds", void 0, Bounds);
}

export function Bounds_$ctor_Z24FF8540(center, halfSize) {
    return new Bounds(center, halfSize);
}

export function Bounds_Create_299C7800(x, y, w, h) {
    return Bounds_$ctor_Z24FF8540(Vec2_Create_7B00E9A0(x, y), Vec2_Create_7B00E9A0(w * 0.5, h * 0.5));
}

export function Bounds__get_Center(_) {
    return Vec2__Clone(_.center);
}

export function Bounds__get_HalfSize(_) {
    return Vec2__Clone(_.halfSize);
}

export function Bounds__get_Values(_) {
    const m = Bounds__get_Min(_.b.contents);
    return new Float64Array([m.values[0], m.values[1], Bounds__get_HalfSize(_.b.contents).values[0] * 2, Bounds__get_HalfSize(_.b.contents).values[1] * 2]);
}

export function Bounds__get_RectValues(_) {
    const mn = Bounds__get_Min(_.b.contents);
    const mx = Bounds__get_Max(_.b.contents);
    return new Float64Array([mn.values[0], mn.values[1], mx.values[0], mx.values[1]]);
}

export function Bounds__get_Size(_) {
    return Vec2__Scale_Z6C68B1C0(Bounds__get_HalfSize(_.b.contents), 2);
}

export function Bounds__get_Min(_) {
    return Vec2__Sub_Z50E8264B(Bounds__get_Center(_.b.contents), Bounds__get_HalfSize(_.b.contents));
}

export function Bounds__get_Max(_) {
    return Vec2__Add_Z50E8264B(Bounds__get_Center(_.b.contents), Bounds__get_HalfSize(_.b.contents));
}

export function Bounds__get_Left(_) {
    return Bounds__get_Center(_.b.contents).values[0] - Bounds__get_HalfSize(_.b.contents).values[0];
}

export function Bounds__get_Right(_) {
    return Bounds__get_Center(_.b.contents).values[0] + Bounds__get_HalfSize(_.b.contents).values[0];
}

export function Bounds__get_Anchor(_) {
    return Bounds__get_Min(_.b.contents);
}

export function Bounds__get_X(_) {
    return Bounds__get_Min(_.b.contents).values[0];
}

export function Bounds__get_Y(_) {
    return Bounds__get_Min(_.b.contents).values[1];
}

export function Bounds__get_Width(_) {
    return Bounds__get_HalfSize(_.b.contents).values[0] * 2;
}

export function Bounds__get_Height(_) {
    return Bounds__get_HalfSize(_.b.contents).values[1] * 2;
}

export function Bounds__get_W(_) {
    return Bounds__get_HalfSize(_.b.contents).values[0] * 2;
}

export function Bounds__get_H(_) {
    return Bounds__get_HalfSize(_.b.contents).values[1] * 2;
}

export function Bounds__get_CenterX(_) {
    return Bounds__get_Center(_.b.contents).values[0];
}

export function Bounds__get_CenterY(_) {
    return Bounds__get_Center(_.b.contents).values[1];
}

export function Bounds__get_MaxRight(_) {
    return Vec2_op_Addition_Z24FF8540(Bounds__get_Center(_.b.contents), Bounds__get_HalfSize(_.b.contents));
}

export function Bounds__get_MaxCenter(_) {
    return Vec2_Create_7B00E9A0(Bounds__get_Center(_.b.contents).values[0], Bounds__get_Center(_.b.contents).values[1] + Bounds__get_HalfSize(_.b.contents).values[1]);
}

export function Bounds__get_MaxLeft(_) {
    return Vec2_Create_7B00E9A0(Bounds__get_Center(_.b.contents).values[0] - Bounds__get_HalfSize(_.b.contents).values[0], Bounds__get_Center(_.b.contents).values[1] + Bounds__get_HalfSize(_.b.contents).values[1]);
}

export function Bounds__get_LeftCenter(_) {
    return Vec2_Create_7B00E9A0(Bounds__get_Center(_.b.contents).values[0] - Bounds__get_HalfSize(_.b.contents).values[0], Bounds__get_Center(_.b.contents).values[1]);
}

export function Bounds__get_MinLeft(_) {
    return Vec2_op_Subtraction_Z24FF8540(Bounds__get_Center(_.b.contents), Bounds__get_HalfSize(_.b.contents));
}

export function Bounds__get_MinCenter(_) {
    return Vec2_Create_7B00E9A0(Bounds__get_Center(_.b.contents).values[0], Bounds__get_Center(_.b.contents).values[1] - Bounds__get_HalfSize(_.b.contents).values[1]);
}

export function Bounds__get_MinRight(_) {
    return Vec2_Create_7B00E9A0(Bounds__get_Center(_.b.contents).values[0] + Bounds__get_HalfSize(_.b.contents).values[0], Bounds__get_Center(_.b.contents).values[1] - Bounds__get_HalfSize(_.b.contents).values[1]);
}

export function Bounds__get_RightCenter(_) {
    return Vec2_Create_7B00E9A0(Bounds__get_Center(_.b.contents).values[0] + Bounds__get_HalfSize(_.b.contents).values[0], Bounds__get_Center(_.b.contents).values[1]);
}

export function Bounds__get_Quadrant1(_) {
    const quarterSize = Vec2_op_Multiply_47807E55(Bounds__get_HalfSize(_.b.contents), 0.5);
    return Bounds_$ctor_Z24FF8540(Vec2_op_Addition_Z24FF8540(Bounds__get_Center(_.b.contents), quarterSize), quarterSize);
}

export function Bounds__get_Quadrant2(_) {
    const quarterSize = Vec2_op_Multiply_47807E55(Bounds__get_HalfSize(_.b.contents), 0.5);
    return Bounds_$ctor_Z24FF8540(Vec2_op_Addition_Z24FF8540(Bounds__get_Center(_.b.contents), Vec2_Create_7B00E9A0(-quarterSize.values[0], quarterSize.values[1])), quarterSize);
}

export function Bounds__get_Quadrant3(_) {
    const quarterSize = Vec2_op_Multiply_47807E55(Bounds__get_HalfSize(_.b.contents), 0.5);
    return Bounds_$ctor_Z24FF8540(Vec2_op_Subtraction_Z24FF8540(Bounds__get_Center(_.b.contents), quarterSize), quarterSize);
}

export function Bounds__get_Quadrant4(_) {
    const quarterSize = Vec2_op_Multiply_47807E55(Bounds__get_HalfSize(_.b.contents), 0.5);
    return Bounds_$ctor_Z24FF8540(Vec2_op_Addition_Z24FF8540(Bounds__get_Center(_.b.contents), Vec2_Create_7B00E9A0(quarterSize.values[0], -quarterSize.values[1])), quarterSize);
}

export function Bounds__Clone(_) {
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), Vec2__Clone(Bounds__get_HalfSize(_.b.contents)));
}

export function Bounds__WithCenter_Z3D47FC52(_, value) {
    return Bounds_$ctor_Z24FF8540(value, Vec2__Clone(Bounds__get_HalfSize(_.b.contents)));
}

export function Bounds__WithCenterM_Z4BDB77B1(_, value) {
    const tupledArg = value;
    const __1 = Bounds__get_Center(_.b.contents);
    const value_1 = Vec2__WithXY_6DB1BD7B(__1.v.contents, tupledArg[0], tupledArg[1], __1.v.contents);
    void value_1;
}

export function Bounds__WithAnchor_Z3D47FC52(_, value) {
    return Bounds_$ctor_Z24FF8540(Vec2__Add_Z50E8264B(value, Bounds__get_HalfSize(_.b.contents)), Vec2__Clone(Bounds__get_HalfSize(_.b.contents)));
}

export function Bounds__WithAnchor_7B00E9A0(_, x, y) {
    return Bounds__WithAnchor_Z3D47FC52(_.b.contents, Vec2_Create_7B00E9A0(x, y));
}

export function Bounds__WithAnchorM_Z3D47FC52(_, value) {
    const __1 = Bounds__get_Center(_.b.contents);
    const other = Vec2__Add_Z50E8264B(value, Bounds__get_HalfSize(_.b.contents));
    let value_3;
    const __4 = __1.v.contents;
    const x = other.values[0];
    const y = other.values[1];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    value_3 = __4.v.contents;
    void value_3;
}

export function Bounds__WithAnchorM_7B00E9A0(_, x, y) {
    const value = Bounds__WithAnchor_Z3D47FC52(_.b.contents, Vec2_Create_7B00E9A0(x, y));
    void value;
}

export function Bounds__WithWidth_5E38073B(_, w) {
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), Vec2_Create_7B00E9A0(w, Bounds__get_Height(_.b.contents)));
}

export function Bounds__WithWidthM_Z16DF143(_, w) {
    const __1 = Bounds__get_HalfSize(_.b.contents);
    const value = Vec2__WithX_Z6C68B1C0(__1.v.contents, w * 0.5, __1.v.contents);
    void value;
}

export function Bounds__WithHeight_5E38073B(_, h) {
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), Vec2_Create_7B00E9A0(Bounds__get_Width(_.b.contents), h));
}

export function Bounds__WithHeightM_Z16DF143(_, h) {
    const __1 = Bounds__get_HalfSize(_.b.contents);
    const value = Vec2__WithY_Z6C68B1C0(__1.v.contents, h * 0.5, __1.v.contents);
    void value;
}

export function Bounds__WithSize_Z3D47FC52(_, value) {
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), Vec2__Scale_Z6C68B1C0(value, 0.5));
}

export function Bounds__WithSize_2E41E8E0(_, x, y) {
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), Vec2_Create_7B00E9A0(x * 0.5, y * 0.5));
}

export function Bounds__WithSize_Z16DF143(_, s) {
    const hs = s * 0.5;
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), Vec2_Create_7B00E9A0(hs, hs));
}

export function Bounds__WithSizeM_Z3D47FC52(_, value) {
    const value_1 = Vec2__Scale_Z6C68B1C0(value, 0.5, Bounds__get_HalfSize(_.b.contents));
    void value_1;
}

export function Bounds__WithSizeM_2E41E8E0(_, x, y) {
    const value = Vec2__WithXY_6DB1BD7B(Bounds__get_HalfSize(_.b.contents), x * 0.5, y * 0.5);
    void value;
}

export function Bounds__WithSizeM_Z16DF143(_, s) {
    const hs = s * 0.5;
    const value = Vec2__WithXY_6DB1BD7B(Bounds__get_HalfSize(_.b.contents), hs, hs);
    void value;
}

export function Bounds__WithHalfSize_Z3D47FC52(_, value) {
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), value);
}

export function Bounds__WithHalfSize_7B00E9A0(_, x, y) {
    return Bounds__WithHalfSize_Z3D47FC52(_.b.contents, Vec2_Create_7B00E9A0(x, y));
}

export function Bounds__WithHalfSize_5E38073B(_, s) {
    return Bounds__WithHalfSize_Z3D47FC52(_.b.contents, Vec2_Create_7B00E9A0(s, s));
}

export function Bounds__WithHalfSizeM_Z3D47FC52(_, value) {
    const other = value;
    let value_3;
    const __4 = Bounds__get_HalfSize(_.b.contents).v.contents;
    const x = other.values[0];
    const y = other.values[1];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    value_3 = __4.v.contents;
    void value_3;
}

export function Bounds__WithHalfSizeM_7B00E9A0(_, x, y) {
    const value = Vec2__WithXY_6DB1BD7B(Bounds__get_HalfSize(_.b.contents), x, y);
    void value;
}

export function Bounds__WithHalfSizeM_5E38073B(_, s) {
    const value = Vec2__WithXY_6DB1BD7B(Bounds__get_HalfSize(_.b.contents), s, s);
    void value;
}

export function Bounds__Inflate_Z3D47FC52(_, value) {
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), Vec2__Add_Z50E8264B(Bounds__get_HalfSize(_.b.contents), value));
}

export function Bounds__Inflate_7B00E9A0(_, x, y) {
    return Bounds__Inflate_Z3D47FC52(_.b.contents, Vec2_Create_7B00E9A0(x, y));
}

export function Bounds__Inflate_5E38073B(_, s) {
    return Bounds__Inflate_Z3D47FC52(_.b.contents, Vec2_Create_7B00E9A0(s, s));
}

export function Bounds__InflateM_Z3D47FC52(_, value) {
    const hs = Bounds__get_HalfSize(_.b.contents);
    const value_1 = Vec2__WithXY_6DB1BD7B(hs, hs.values[0] + value.values[0], hs.values[1] + value.values[1]);
    void value_1;
}

export function Bounds__InflateM_7B00E9A0(_, x, y) {
    const hs = Bounds__get_HalfSize(_.b.contents);
    const value = Vec2__WithXY_6DB1BD7B(hs, hs.values[0] + x, hs.values[1] + y);
    void value;
}

export function Bounds__InflateM_5E38073B(_, s) {
    const hs = Bounds__get_HalfSize(_.b.contents);
    const value = Vec2__WithXY_6DB1BD7B(hs, hs.values[0] + s, hs.values[1] + s);
    void value;
}

export function Bounds__InflatePct_Z3D47FC52(_, value) {
    return Bounds_$ctor_Z24FF8540(Vec2__Clone(Bounds__get_Center(_.b.contents)), Vec2__Mult_Z50E8264B(Bounds__get_HalfSize(_.b.contents), value));
}

export function Bounds__InflatePct_7B00E9A0(_, x, y) {
    return Bounds__InflatePct_Z3D47FC52(_.b.contents, Vec2_Create_7B00E9A0(x, y));
}

export function Bounds__InflatePct_5E38073B(_, p) {
    return Bounds__InflatePct_Z3D47FC52(_.b.contents, Vec2_Create_7B00E9A0(p, p));
}

export function Bounds__InflatePctM_Z3D47FC52(_, value) {
    const hs = Bounds__get_HalfSize(_.b.contents);
    const value_1 = Vec2__WithXY_6DB1BD7B(hs, hs.values[0] * value.values[0], hs.values[1] * value.values[1]);
    void value_1;
}

export function Bounds__InflatePctM_7B00E9A0(_, x, y) {
    const hs = Bounds__get_HalfSize(_.b.contents);
    const value = Vec2__WithXY_6DB1BD7B(hs, hs.values[0] * x, hs.values[1] * y);
    void value;
}

export function Bounds__InflatePctM_5E38073B(_, p) {
    const hs = Bounds__get_HalfSize(_.b.contents);
    const value = Vec2__WithXY_6DB1BD7B(hs, hs.values[0] * p, hs.values[1] * p);
    void value;
}

export function Bounds__MaxWith_Z780DF58B(_, other, result) {
    let result_1;
    const __1 = _.b.contents;
    result_1 = calcDef(() => Bounds_Create_299C7800(0, 0, 0, 0), result);
    const __4 = Bounds__get_HalfSize(result_1);
    const value_1 = max_1(comparePrimitives, Bounds__get_HalfSize(_.b.contents).values[0], Bounds__get_HalfSize(other).values[0]);
    __4.values[0] = value_1;
    const __7 = Bounds__get_HalfSize(result_1);
    const value_2 = max_1(comparePrimitives, Bounds__get_HalfSize(_.b.contents).values[1], Bounds__get_HalfSize(other).values[1]);
    __7.values[1] = value_2;
    return result_1;
}

export function Bounds__MaxWithM_Z134B2C62(_, other) {
    const value = Bounds__MaxWith_Z780DF58B(_.b.contents, other, _.b.contents);
    void value;
}

export function Bounds__MinWith_Z780DF58B(_, other, result) {
    let result_1;
    const __1 = _.b.contents;
    result_1 = calcDef(() => Bounds_Create_299C7800(0, 0, 0, 0), result);
    const __4 = Bounds__get_HalfSize(result_1);
    const value_1 = min_1(comparePrimitives, Bounds__get_HalfSize(_.b.contents).values[0], Bounds__get_HalfSize(other).values[0]);
    __4.values[0] = value_1;
    const __7 = Bounds__get_HalfSize(result_1);
    const value_2 = min_1(comparePrimitives, Bounds__get_HalfSize(_.b.contents).values[1], Bounds__get_HalfSize(other).values[1]);
    __7.values[1] = value_2;
    return result_1;
}

export function Bounds__MinWithM_Z134B2C62(_, other) {
    const value = Bounds__MinWith_Z780DF58B(_.b.contents, other, _.b.contents);
    void value;
}

export function Bounds__Clamp_Z780DF58B(_, other, result) {
    let result_1;
    const __1 = _.b.contents;
    result_1 = calcDef(() => Bounds_Create_299C7800(0, 0, 0, 0), result);
    const value_1 = Bounds__MinWith_Z780DF58B(_.b.contents, other, result_1);
    void value_1;
    const bmin = Bounds__get_Min(result_1);
    const omin = Bounds__get_Min(other);
    if (bmin.values[0] < omin.values[0]) {
        const __6 = Bounds__get_Center(result_1);
        const value_2 = omin.values[0] + Bounds__get_HalfSize(result_1).values[0];
        __6.values[0] = value_2;
    }
    if (bmin.values[1] < omin.values[1]) {
        const __11 = Bounds__get_Center(result_1);
        const value_3 = omin.values[1] + Bounds__get_HalfSize(result_1).values[1];
        __11.values[1] = value_3;
    }
    const bmax = Bounds__get_Max(result_1);
    const omax = Bounds__get_Max(other);
    if (bmax.values[0] > omax.values[0]) {
        const __16 = Bounds__get_Center(result_1);
        const value_4 = omax.values[0] - Bounds__get_HalfSize(result_1).values[0];
        __16.values[0] = value_4;
    }
    if (bmax.values[1] > omax.values[1]) {
        const __21 = Bounds__get_Center(result_1);
        const value_5 = omax.values[1] - Bounds__get_HalfSize(result_1).values[1];
        __21.values[1] = value_5;
    }
    return result_1;
}

export function Bounds__ClampM_Z134B2C62(_, other) {
    const value = Bounds__Clamp_Z780DF58B(_.b.contents, other, _.b.contents);
    void value;
}

export function Bounds__ClampVec_Z50E8264B(_, v, result) {
    const result_1 = calcDef(Vec2_Create, result);
    const mn = Bounds__get_Min(_.b.contents);
    const mx = Bounds__get_Max(_.b.contents);
    const value = min_1(comparePrimitives, max_1(comparePrimitives, v.values[0], mn.values[0]), mx.values[0]);
    result_1.values[0] = value;
    const value_1 = min_1(comparePrimitives, max_1(comparePrimitives, v.values[1], mn.values[1]), mx.values[1]);
    result_1.values[1] = value_1;
    return result_1;
}

export function Bounds__Contains_Z3D47FC52(_, point) {
    const min = Bounds__get_Min(_.b.contents);
    const max = Bounds__get_Max(_.b.contents);
    if (((point.values[0] >= min.values[0]) ? (point.values[0] <= max.values[0]) : false) ? (point.values[1] >= min.values[1]) : false) {
        return point.values[1] <= max.values[1];
    }
    else {
        return false;
    }
}

export function Bounds__IntersectsWith_Z134B2C62(_, other) {
    const min = Bounds__get_Min(_.b.contents);
    const max = Bounds__get_Max(_.b.contents);
    const otherMin = Bounds__get_Min(other);
    const otherMax = Bounds__get_Max(other);
    if (((min.values[0] <= otherMax.values[0]) ? (max.values[0] >= otherMin.values[0]) : false) ? (min.values[1] <= otherMax.values[1]) : false) {
        return max.values[1] >= otherMin.values[1];
    }
    else {
        return false;
    }
}

export function Bounds_get_Zero() {
    return Bounds_$ctor_Z24FF8540(Vec2_Create_7B00E9A0(0, 0), Vec2_Create_7B00E9A0(0, 0));
}

export function BoundsPatterns_$007CBoundsRect$007C(b) {
    const anchor = Bounds__get_Anchor(b);
    const size = Bounds__get_Size(b);
    return [anchor.values[0], anchor.values[1], size.values[0], size.values[1]];
}

export function BoundsPatterns_$007COptBoundsRect$007C(b) {
    if (b == null) {
        return [void 0, void 0, void 0, void 0];
    }
    else {
        const b_1 = b;
        const anchor = Bounds__get_Anchor(b_1);
        const size = Bounds__get_Size(b_1);
        return [anchor.values[0], anchor.values[1], size.values[0], size.values[1]];
    }
}

export function BoundsPatterns_$007CBoundsRange$007C(b) {
    const min = Bounds__get_Min(b);
    const max = Bounds__get_Max(b);
    return [min.values[0], min.values[1], max.values[0], max.values[1]];
}

export function BoundsPatterns_$007COptBoundsRange$007C(b) {
    if (b == null) {
        return [void 0, void 0, void 0, void 0];
    }
    else {
        const b_1 = b;
        const min = Bounds__get_Min(b_1);
        const max = Bounds__get_Max(b_1);
        return [min.values[0], min.values[1], max.values[0], max.values[1]];
    }
}

export function BoundsPatterns_$007CBoundsDim$007C(b) {
    return [Bounds__get_Anchor(b), Bounds__get_Size(b)];
}

export function BoundsModule_bounds(x, y, w, h) {
    return Bounds_$ctor_Z24FF8540(Vec2_Create_7B00E9A0(x + (w * 0.5), y + (h * 0.5)), Vec2_Create_7B00E9A0(w * 0.5, h * 0.5));
}

export function BoundsModule_boundsV(anchor, size) {
    let anchor_1, size_1;
    return Bounds_$ctor_Z24FF8540((anchor_1 = anchor, (size_1 = size, Vec2_Create_7B00E9A0(anchor_1.values[0] + (size_1.values[0] * 0.5), anchor_1.values[1] + (size_1.values[1] * 0.5)))), Vec2__Scale_Z6C68B1C0(size, 0.5));
}

export function BoundsModule_boundsSize(w, h) {
    return BoundsModule_bounds(0, 0, w, h);
}

export function BoundsModule_boundsSizeV(size) {
    return BoundsModule_boundsV(Vec2_Create_7B00E9A0(0, 0), size);
}

export function BoundsModule_boundsCenter(cx, cy, w, h) {
    return Bounds_$ctor_Z24FF8540(Vec2_Create_7B00E9A0(cx, cy), Vec2_Create_7B00E9A0(w * 0.5, h * 0.5));
}

export function BoundsModule_boundsCenterV(center, size) {
    return Bounds_$ctor_Z24FF8540(center, Vec2__Scale_Z6C68B1C0(size, 0.5));
}

export function BoundsModule_boundsCenterHalf(cx, cy, hw, hh) {
    return Bounds_$ctor_Z24FF8540(Vec2_Create_7B00E9A0(cx, cy), Vec2_Create_7B00E9A0(hw, hh));
}

export function BoundsModule_boundsCenterHalfV(center, halfSize) {
    return Bounds_$ctor_Z24FF8540(center, halfSize);
}

