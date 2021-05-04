import { BuilderTypes_GlObjProp } from "./webgl_data.js";
import { GlCommon_blendEquationSeparate, GlCommon_blendEquation, GlCommon_blendFuncSeparate, GlCommon_blendFunc, GlCommon_blendColor, GlCommon_cullFace, GlCommon_disable, GlCommon_enable } from "../webgl_core/webgl_browser_types.js";
import { ofArray } from "../.fable/fable-library.3.0.0/List.js";

export const enableDepthTesting = new BuilderTypes_GlObjProp(15, (gl) => {
    GlCommon_enable(2929, gl);
});

export const disableDepthTesting = new BuilderTypes_GlObjProp(15, (gl) => {
    GlCommon_disable(2929, gl);
});

function defaultDepthTesting(gl) {
    gl.disable(gl.DEPTH_TEST);
}

export const cullFront = (() => {
    const result = (gl) => {
        GlCommon_enable(2884, gl);
        GlCommon_cullFace(1028, gl);
    };
    return new BuilderTypes_GlObjProp(15, result);
})();

export const cullBack = (() => {
    const result = (gl) => {
        GlCommon_enable(2884, gl);
        GlCommon_cullFace(1029, gl);
    };
    return new BuilderTypes_GlObjProp(15, result);
})();

export const cullFrontAndBack = (() => {
    const result = (gl) => {
        GlCommon_enable(2884, gl);
        GlCommon_cullFace(1032, gl);
    };
    return new BuilderTypes_GlObjProp(15, result);
})();

export function cullFace(mode) {
    const result = (gl) => {
        GlCommon_enable(2884, gl);
        GlCommon_cullFace(mode, gl);
    };
    return new BuilderTypes_GlObjProp(15, result);
}

export const enableCulling = new BuilderTypes_GlObjProp(15, (gl) => {
    GlCommon_enable(2884, gl);
});

export const disableCulling = new BuilderTypes_GlObjProp(15, (gl) => {
    GlCommon_disable(2884, gl);
});

function defaultCulling(gl) {
    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
}

export function blendColor(r, g, b, a) {
    return new BuilderTypes_GlObjProp(15, (gl) => {
        GlCommon_blendColor(r, g, b, a, gl);
    });
}

export function blendColorV(color) {
    return blendColor(color[0], color[1], color[2], color[3]);
}

export function blendFunc(sfactor, dfactor) {
    const result = (gl) => {
        GlCommon_enable(3042, gl);
        GlCommon_blendFunc(sfactor, dfactor, gl);
    };
    return new BuilderTypes_GlObjProp(15, result);
}

export function blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha) {
    const result = (gl) => {
        GlCommon_enable(3042, gl);
        GlCommon_blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha, gl);
    };
    return new BuilderTypes_GlObjProp(15, result);
}

export function blendEquation(mode) {
    return new BuilderTypes_GlObjProp(15, (gl) => {
        GlCommon_blendEquation(mode, gl);
    });
}

export function blendEquationSeparate(modeRGB, modeAlpha) {
    const result = (gl) => {
        GlCommon_enable(3042, gl);
        GlCommon_blendEquationSeparate(modeRGB, modeAlpha, gl);
    };
    return new BuilderTypes_GlObjProp(15, result);
}

export const enableBlending = new BuilderTypes_GlObjProp(15, (gl) => {
    GlCommon_enable(3042, gl);
});

export const disableBlending = new BuilderTypes_GlObjProp(15, (gl) => {
    GlCommon_disable(3042, gl);
});

function defaultBlending(gl) {
    gl.disable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ZERO);
    gl.blendEquation(gl.FUNC_ADD);
}

export function enable(cap) {
    return new BuilderTypes_GlObjProp(15, (gl) => {
        GlCommon_enable(cap, gl);
    });
}

export function disable(cap) {
    return new BuilderTypes_GlObjProp(15, (gl) => {
        GlCommon_disable(cap, gl);
    });
}

export function defaultCapabilities() {
    return ofArray([(gl) => {
        defaultDepthTesting(gl);
    }, (gl_1) => {
        defaultCulling(gl_1);
    }, (gl_2) => {
        defaultBlending(gl_2);
    }]);
}

export const zero = 0;

export const one = 1;

export const src_color = 768;

export const one_minus_src_color = 769;

export const src_alpha = 770;

export const one_minus_src_alpha = 771;

export const dst_alpha = 772;

export const one_minus_dst_alpha = 773;

export const dst_color = 774;

export const one_minus_dst_color = 775;

export const src_alpha_saturate = 776;

export const constant_color = 32769;

export const one_minus_constant_color = 32770;

export const constant_alpha = 32771;

export const one_minus_constant_alpha = 32772;

export const func_add = 32774;

export const func_subtract = 32778;

export const func_reverse_subtract = 32779;

export const func_min = 32775;

export const func_max = 32776;

