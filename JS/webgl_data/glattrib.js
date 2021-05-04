import { GlBuffer__Delete } from "./glbuffer.js";
import { _setValue, _setValues } from "./glinterleaveattribute.js";
import { _setValue as _setValue_1, _setValues as _setValues_1 } from "./glsingleattribute.js";

export function delete$(data) {
    GlBuffer__Delete(data.Buffer);
}

export function setValues(values, data) {
    if (data.Link == null) {
        const matchValue_1 = data.Kind;
        switch (matchValue_1.tag) {
            case 1: {
                _setValues(values, data);
                break;
            }
            case 2: {
                break;
            }
            default: {
                _setValues_1(values, data);
            }
        }
    }
}

export function setValue(index, value, data) {
    if (data.Link == null) {
        const matchValue_1 = data.Kind;
        switch (matchValue_1.tag) {
            case 1: {
                _setValue(index, value, data);
                break;
            }
            case 2: {
                break;
            }
            default: {
                _setValue_1(index, value, data);
            }
        }
    }
}

