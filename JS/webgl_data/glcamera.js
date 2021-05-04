import { dirtyScene } from "./glcommon.js";
import { Bounds__get_Values } from "../twod/bounds.js";
import { Vec4__get_Values } from "../core/vectors.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { rotateBy as rotateBy_1, rotateTo as rotateTo_1, zoomToward as zoomToward_1, zoomBy as zoomBy_1, zoom as zoom_1, setLookAtXYZ, getZoom as getZoom_1, containsPoint as containsPoint_1, toWorldO as toWorldO_1, render as render_1, update as update_1 } from "./glortho2d.js";

export function dirty(data) {
    data.IsDirty = true;
    dirtyScene(data.Scene);
}

export function getGlViewportValues(data) {
    const gl = data.Scene.Canvas.Context;
    const vp = Bounds__get_Values(data.ViewportBounds);
    const vpy = (gl.canvas.height - vp[1]) - vp[3];
    vp[1] = vpy;
    return vp;
}

function resetViewport(data) {
    const gl = data.Scene.Canvas.Context;
    const vp = getGlViewportValues(data);
    gl.viewport(vp[0], vp[1], vp[2], vp[3]);
}

function clearViewport(data) {
    const gl = data.Scene.Canvas.Context;
    const sb = Bounds__get_Values(data.ScissorBounds);
    const cc = Vec4__get_Values(data.CameraBackground);
    const sby = (gl.canvas.height - sb[1]) - sb[3];
    gl.scissor(sb[0], sby, sb[2], sb[3]);
    gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
    gl.enable(gl.SCISSOR_TEST);
    gl.clear(data.ClearMask);
    gl.disable(gl.SCISSOR_TEST);
}

export function update(data) {
    if (data.IsDirty) {
        if (data.Kind.tag === 1) {
            const msg = toText(interpolate("Perspective camera update not implemented", []));
            throw (new Error(msg));
        }
        else {
            update_1(data);
        }
    }
}

export function render(data) {
    update(data);
    if (data.ClearViewport) {
        clearViewport(data);
    }
    resetViewport(data);
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera rendering not implemented", []));
        throw (new Error(msg));
    }
    else {
        render_1(data);
    }
}

export function toWorldO(point, result, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera conversions not implemented", []));
        throw (new Error(msg));
    }
    else {
        return toWorldO_1(point, result, data);
    }
}

export function containsPoint(point, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera containsPoint not implemented", []));
        throw (new Error(msg));
    }
    else {
        return containsPoint_1(point, data);
    }
}

export function getZoom(data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera zooming not implemented", []));
        throw (new Error(msg));
    }
    else {
        return getZoom_1(data);
    }
}

export function panByXY(x, y, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera panning not implemented", []));
        throw (new Error(msg));
    }
    else {
        const data_1 = data;
        const lookAt = data_1.LookAt;
        const data_2 = data_1;
        setLookAtXYZ(lookAt.values[0] + x, lookAt.values[1] + y, data_2.LookAt.values[2], data_2);
    }
}

export function panToXYZ(x, y, z, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera panning not implemented", []));
        throw (new Error(msg));
    }
    else {
        setLookAtXYZ(x, y, z, data);
    }
}

export function zoom(amount, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera zooming not implemented", []));
        throw (new Error(msg));
    }
    else {
        zoom_1(amount, data);
    }
}

export function zoomBy(amount, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera zooming not implemented", []));
        throw (new Error(msg));
    }
    else {
        zoomBy_1(amount, data);
    }
}

export function zoomToward(center, amount, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera zooming not implemented", []));
        throw (new Error(msg));
    }
    else {
        zoomToward_1(center, amount, data);
    }
}

export function rotateTo(angle, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera rotating not implemented", []));
        throw (new Error(msg));
    }
    else {
        rotateTo_1(angle, data);
    }
}

export function rotateBy(angle, data) {
    if (data.Kind.tag === 1) {
        const msg = toText(interpolate("Perspective camera rotating not implemented", []));
        throw (new Error(msg));
    }
    else {
        rotateBy_1(angle, data);
    }
}

