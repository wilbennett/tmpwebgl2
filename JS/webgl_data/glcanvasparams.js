import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { class_type, record_type, enum_type, int32_type, float64_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { Vec4__Clone, Vec4_Create_Z27E3A4C0, Vec4$reflection } from "../core/vectors.js";

export class CanvasConfig extends Record {
    constructor(LineWidth, MiterLimit, LineCap, LineJoin, MiterFallback, StrokeColor, FillColor, FillType) {
        super();
        this.LineWidth = LineWidth;
        this.MiterLimit = MiterLimit;
        this.LineCap = (LineCap | 0);
        this.LineJoin = (LineJoin | 0);
        this.MiterFallback = (MiterFallback | 0);
        this.StrokeColor = StrokeColor;
        this.FillColor = FillColor;
        this.FillType = (FillType | 0);
    }
}

export function CanvasConfig$reflection() {
    return record_type("Wil.Webgl.CanvasConfig", [], CanvasConfig, () => [["LineWidth", float64_type], ["MiterLimit", float64_type], ["LineCap", enum_type("Wil.Webgl.LineCap", int32_type, [["Butt", 0], ["Round", 1], ["Square", 2]])], ["LineJoin", enum_type("Wil.Webgl.LineJoin", int32_type, [["Round", 3], ["Bevel", 4], ["Miter", 5]])], ["MiterFallback", enum_type("Wil.Webgl.LineJoin", int32_type, [["Round", 3], ["Bevel", 4], ["Miter", 5]])], ["StrokeColor", Vec4$reflection()], ["FillColor", Vec4$reflection()], ["FillType", enum_type("Wil.Webgl.FillType", int32_type, [["Stroke", 1], ["Fill", 2], ["Border", 3]])]]);
}

export class GlCanvasParams {
    constructor() {
        this.config = (new CanvasConfig(1, 10, 0, 4, 4, Vec4_Create_Z27E3A4C0(0, 0, 0, 1), Vec4_Create_Z27E3A4C0(0, 0, 0, 1), 2));
    }
}

export function GlCanvasParams$reflection() {
    return class_type("Wil.Webgl.GlCanvasParams", void 0, GlCanvasParams);
}

export function GlCanvasParams_$ctor() {
    return new GlCanvasParams();
}

export function GlCanvasParams__get_LineWidth(_) {
    return _.config.LineWidth;
}

export function GlCanvasParams__set_LineWidth_21F3BA25(_, value) {
    const inputRecord = _.config;
    _.config = (new CanvasConfig(value, inputRecord.MiterLimit, inputRecord.LineCap, inputRecord.LineJoin, inputRecord.MiterFallback, inputRecord.StrokeColor, inputRecord.FillColor, inputRecord.FillType));
}

export function GlCanvasParams__get_MiterLimit(_) {
    return _.config.MiterLimit;
}

export function GlCanvasParams__set_MiterLimit_21F3BA25(_, value) {
    const inputRecord = _.config;
    _.config = (new CanvasConfig(inputRecord.LineWidth, value, inputRecord.LineCap, inputRecord.LineJoin, inputRecord.MiterFallback, inputRecord.StrokeColor, inputRecord.FillColor, inputRecord.FillType));
}

export function GlCanvasParams__get_LineCap(_) {
    return _.config.LineCap;
}

export function GlCanvasParams__set_LineCap_7B1263D0(_, value) {
    const inputRecord = _.config;
    _.config = (new CanvasConfig(inputRecord.LineWidth, inputRecord.MiterLimit, value, inputRecord.LineJoin, inputRecord.MiterFallback, inputRecord.StrokeColor, inputRecord.FillColor, inputRecord.FillType));
}

export function GlCanvasParams__get_LineJoin(_) {
    return _.config.LineJoin;
}

export function GlCanvasParams__set_LineJoin_Z229C3C20(_, value) {
    const inputRecord = _.config;
    _.config = (new CanvasConfig(inputRecord.LineWidth, inputRecord.MiterLimit, inputRecord.LineCap, value, inputRecord.MiterFallback, inputRecord.StrokeColor, inputRecord.FillColor, inputRecord.FillType));
}

export function GlCanvasParams__get_MiterFallback(_) {
    return _.config.MiterFallback;
}

export function GlCanvasParams__set_MiterFallback_Z229C3C20(_, value) {
    const inputRecord = _.config;
    _.config = (new CanvasConfig(inputRecord.LineWidth, inputRecord.MiterLimit, inputRecord.LineCap, inputRecord.LineJoin, value, inputRecord.StrokeColor, inputRecord.FillColor, inputRecord.FillType));
}

export function GlCanvasParams__get_StrokeColor(_) {
    return Vec4__Clone(_.config.StrokeColor);
}

export function GlCanvasParams__set_StrokeColor_Z3D47FC58(_, value) {
    const inputRecord = _.config;
    _.config = (new CanvasConfig(inputRecord.LineWidth, inputRecord.MiterLimit, inputRecord.LineCap, inputRecord.LineJoin, inputRecord.MiterFallback, Vec4__Clone(value), inputRecord.FillColor, inputRecord.FillType));
}

export function GlCanvasParams__get_FillColor(_) {
    return _.config.FillColor;
}

export function GlCanvasParams__set_FillColor_Z3D47FC58(_, value) {
    const inputRecord = _.config;
    _.config = (new CanvasConfig(inputRecord.LineWidth, inputRecord.MiterLimit, inputRecord.LineCap, inputRecord.LineJoin, inputRecord.MiterFallback, inputRecord.StrokeColor, Vec4__Clone(value), inputRecord.FillType));
}

export function GlCanvasParams__get_FillType(_) {
    return _.config.FillType;
}

export function GlCanvasParams__set_FillType_Z1454C5A5(_, value) {
    const inputRecord = _.config;
    _.config = (new CanvasConfig(inputRecord.LineWidth, inputRecord.MiterLimit, inputRecord.LineCap, inputRecord.LineJoin, inputRecord.MiterFallback, inputRecord.StrokeColor, inputRecord.FillColor, value));
}

