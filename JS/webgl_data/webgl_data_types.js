import { Union } from "../.fable/fable-library.3.0.0/Types.js";
import { class_type, enum_type, int32_type, union_type, string_type, bool_type } from "../.fable/fable-library.3.0.0/Reflection.js";

export class GlContextAttribute extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Alpha", "Desynchronized", "Antialias", "Depth", "FailIfMajorPerformanceCaveat", "PowerPreference", "PremultipliedAlpha", "PreserveDrawingBuffer", "Stencil"];
    }
}

export function GlContextAttribute$reflection() {
    return union_type("Wil.Webgl.DataTypes.GlContextAttribute", [], GlContextAttribute, () => [[["Item", bool_type]], [["Item", bool_type]], [["Item", bool_type]], [["Item", bool_type]], [["Item", bool_type]], [["Item", string_type]], [["Item", bool_type]], [["Item", bool_type]], [["Item", bool_type]]]);
}

export class GlPixelStorage extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["PACK_ALIGNMENT", "UNPACK_ALIGNMENT", "UNPACK_FLIP_Y_WEBGL", "UNPACK_PREMULTIPLY_ALPHA_WEBGL", "UNPACK_COLORSPACE_CONVERSION_WEBGL", "PACK_ROW_LENGTH", "PACK_SKIP_PIXELS", "PACK_SKIP_ROWS", "UNPACK_ROW_LENGTH", "UNPACK_IMAGE_HEIGHT", "UNPACK_SKIP_PIXELS", "UNPACK_SKIP_ROWS", "UNPACK_SKIP_IMAGES"];
    }
}

export function GlPixelStorage$reflection() {
    return union_type("Wil.Webgl.DataTypes.GlPixelStorage", [], GlPixelStorage, () => [[["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlPixelAlign", int32_type, [["ONE", 1], ["TWO", 2], ["FOUR", 4], ["EIGHT", 8]])]], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlPixelAlign", int32_type, [["ONE", 1], ["TWO", 2], ["FOUR", 4], ["EIGHT", 8]])]], [], [], [["Item", enum_type("Wil.Webgl.Types.WebglTypes.GlPixelConversion", int32_type, [["NONE", 0], ["BROWSER_DEFAULT_WEBGL", 37444]])]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]], [["Item", int32_type]]]);
}

export class GlTexturePixels extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["PixelData", "PixelImageData", "PixelHtmlImage", "PixelCanvas", "PixelVideo", "PixelBitmap"];
    }
}

export function GlTexturePixels$reflection() {
    return union_type("Wil.Webgl.DataTypes.GlTexturePixels", [], GlTexturePixels, () => [[["Item", class_type("Fable.Core.JS.TypedArray")]], [["Item", class_type("Browser.Types.ImageData")]], [["Item", class_type("Browser.Types.HTMLImageElement")]], [["Item", class_type("Browser.Types.HTMLCanvasElement")]], [["Item", class_type("Browser.Types.HTMLVideoElement")]], [["Item", class_type("Wil.Browser.Types.BrowserExtensions.ImageBitmap")]]]);
}

