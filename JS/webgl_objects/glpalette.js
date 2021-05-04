import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { record_type, int32_type, float64_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { Vec_lerp4, Vec4$reflection } from "../core/vectors.js";
import { ofArray, foldBack, pairwise, map, singleton, append, cons, last, head } from "../.fable/fable-library.3.0.0/List.js";
import { uncurry, round } from "../.fable/fable-library.3.0.0/Util.js";
import { BuilderTypes_GlTextureProp, BuilderTypes_GlObjProp } from "../webgl_data/webgl_data.js";
import { Props_gltexture, ObjectProps_pixelDataUint8 } from "./props.js";

export class ColorStopData extends Record {
    constructor(StartPct, EndPct, StartColor, EndColor, StartIndex, EndIndex) {
        super();
        this.StartPct = StartPct;
        this.EndPct = EndPct;
        this.StartColor = StartColor;
        this.EndColor = EndColor;
        this.StartIndex = (StartIndex | 0);
        this.EndIndex = (EndIndex | 0);
    }
}

export function ColorStopData$reflection() {
    return record_type("Wil.Webgl.ColorStopData", [], ColorStopData, () => [["StartPct", float64_type], ["EndPct", float64_type], ["StartColor", Vec4$reflection()], ["EndColor", Vec4$reflection()], ["StartIndex", int32_type], ["EndIndex", int32_type]]);
}

export function GlPalette_normalizeStops(stops) {
    const patternInput = head(stops);
    const firstPct = patternInput[0];
    const firstColor = patternInput[1];
    const patternInput_1 = last(stops);
    const lastPct = patternInput_1[0];
    const lastColor = patternInput_1[1];
    let res;
    if (firstPct === 0) {
        res = stops;
    }
    else {
        const h = [0, firstColor];
        res = cons(h, stops);
    }
    if (lastPct === 1) {
        return res;
    }
    else {
        const t = [1, lastColor];
        return append(res, singleton(t));
    }
}

export function GlPalette_calcStopData(count, s1, s2) {
    const countMinus1 = count - 1;
    return new ColorStopData(s1[0], s2[0], s1[1], s2[1], ~(~round(countMinus1 * s1[0])), ~(~round(countMinus1 * s2[0])));
}

export function GlPalette_createPaletteData(count, stops) {
    const loop = (startColor_mut, endColor_mut, count_1_mut, index_mut, remain_mut, acc_mut) => {
        loop:
        while (true) {
            const startColor = startColor_mut, endColor = endColor_mut, count_1 = count_1_mut, index = index_mut, remain = remain_mut, acc = acc_mut;
            if (remain < 0) {
                return acc;
            }
            else {
                const t = remain / count_1;
                const color = Vec_lerp4(startColor, endColor, t);
                acc[index - 0] = (color.values[3] & 0xFF);
                acc[index - 1] = (color.values[2] & 0xFF);
                acc[index - 2] = (color.values[1] & 0xFF);
                acc[index - 3] = (color.values[0] & 0xFF);
                startColor_mut = startColor;
                endColor_mut = endColor;
                count_1_mut = count_1;
                index_mut = (index - 4);
                remain_mut = (remain - 1);
                acc_mut = acc;
                continue loop;
            }
            break;
        }
    };
    const processData = (d, a) => {
        const count_2 = (d.EndIndex - d.StartIndex) | 0;
        const startIndex = (((d.EndIndex + 1) * 4) - 1) | 0;
        return loop(d.StartColor, d.EndColor, count_2, startIndex, count_2, a);
    };
    const stopData = map((tupledArg) => GlPalette_calcStopData(count, tupledArg[0], tupledArg[1]), pairwise(GlPalette_normalizeStops(stops)));
    const acc_1 = new Uint8Array(count * 4);
    return foldBack(processData, stopData, acc_1);
}

export function GlPalette_create(name, index, count, stops) {
    let props;
    return new BuilderTypes_GlObjProp(14, uncurry(2, (props = ofArray([new BuilderTypes_GlTextureProp(0, name), new BuilderTypes_GlTextureProp(2, index), new BuilderTypes_GlTextureProp(4, count), new BuilderTypes_GlTextureProp(5, 1), ObjectProps_pixelDataUint8(GlPalette_createPaletteData(count, stops)), new BuilderTypes_GlTextureProp(9), new BuilderTypes_GlTextureProp(6, 6408), new BuilderTypes_GlTextureProp(7, 6408), new BuilderTypes_GlTextureProp(14, 33071), new BuilderTypes_GlTextureProp(15, 33071), new BuilderTypes_GlTextureProp(12, 9728), new BuilderTypes_GlTextureProp(13, 9728)]), (overrides) => ((parentObject) => Props_gltexture(props, overrides, parentObject)))));
}

