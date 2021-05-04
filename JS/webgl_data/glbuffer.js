import { float32ArrayFactory } from "../js/typedarray_utils.js";
import { GlCommon_bufferData, GlCommon_bufferSubData, GlCommon_bindBufferBase, GlCommon_bindBuffer, GlCommon_getEmptyBuffer } from "../webgl_core/webgl_browser_types.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { max, comparePrimitives, min, equals } from "../.fable/fable-library.3.0.0/Util.js";
import { rangeNumber, getEnumerator } from "../.fable/fable-library.3.0.0/Seq.js";
import { ofSeq } from "../.fable/fable-library.3.0.0/List.js";

export class GlBuffer {
    constructor(gl) {
        this.gl = gl;
        this.isBuffered = false;
        this.dirtyOffset = 2147483647;
        this.dirtyEndOffset = -1;
        this.target = 34962;
        this.usage = 35044;
        this.factory = float32ArrayFactory;
        this.data = this.factory.Create(0);
        this.buffer = GlCommon_getEmptyBuffer(this.gl);
        this["BufferKind@"] = this.target;
        this["Usage@"] = this.usage;
        this["AutoClean@"] = true;
    }
}

export function GlBuffer$reflection() {
    return class_type("Wil.Webgl.Data.GlBuffer", void 0, GlBuffer);
}

export function GlBuffer_$ctor_10C6D16C(gl) {
    return new GlBuffer(gl);
}

export function GlBuffer__get_BufferKind(__) {
    return __["BufferKind@"];
}

export function GlBuffer__get_Usage(__) {
    return __["Usage@"];
}

export function GlBuffer__get_Data(_) {
    return _.data;
}

export function GlBuffer__get_AutoClean(__) {
    return __["AutoClean@"];
}

export function GlBuffer__set_AutoClean_Z1FBCCD16(__, v) {
    __["AutoClean@"] = v;
}

export function GlBuffer__Init_71B7C75E(_, bufferTarget, bufferUsage, arrayFactory) {
    _.target = bufferTarget;
    _.usage = bufferUsage;
    _.factory = arrayFactory;
    _.buffer = _.gl.createBuffer();
}

export function GlBuffer__Delete(_) {
    const empty = GlCommon_getEmptyBuffer(_.gl);
    if (!equals(_.buffer, empty)) {
        _.gl.deleteBuffer(_.buffer);
    }
}

export function GlBuffer__Clean_Z1FBCCD16(_, buffered) {
    _.dirtyOffset = 2147483647;
    _.dirtyEndOffset = -1;
    _.isBuffered = buffered;
}

export function GlBuffer__DirtyRange_Z37302880(_, startOffset, endOffset) {
    _.dirtyOffset = min(comparePrimitives, startOffset, _.dirtyOffset);
    _.dirtyEndOffset = max(comparePrimitives, endOffset, _.dirtyEndOffset);
    _.dirtyOffset = max(comparePrimitives, _.dirtyOffset, 0);
    _.dirtyEndOffset = min(comparePrimitives, _.dirtyEndOffset, _.data.length - 1);
}

export function GlBuffer__SetLength_Z524259A4(this$, length) {
    if (length !== this$.data.length) {
        const length_1 = max(comparePrimitives, length, 0) | 0;
        this$.data = this$.factory.Create(length_1);
        this$.isBuffered = false;
        GlBuffer__DirtyRange_Z37302880(this$, 0, length_1 - 1);
    }
}

export function GlBuffer__Bind(_) {
    GlCommon_bindBuffer(_.gl, _.target, _.buffer);
}

export function GlBuffer__BindBase_Z524259A4(_, location) {
    GlCommon_bindBufferBase(_.gl, _.target, location, _.buffer);
}

export function GlBuffer__SetValuesRange_Z3EAA4E5D(this$, values, startOffset, endOffset) {
    GlBuffer__DirtyRange_Z37302880(this$, startOffset, endOffset);
    const dataArray = this$.data;
    const enumerator = getEnumerator(ofSeq(rangeNumber(startOffset, 1, endOffset)));
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const i = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
            dataArray[i]=values[i];
        }
    }
    finally {
        enumerator.Dispose();
    }
}

export function GlBuffer__SetValuesOffset_Z59CA6BE1(this$, values, startOffset) {
    GlBuffer__DirtyRange_Z37302880(this$, startOffset, (startOffset + values.length) - 1);
    const value = this$.data.set(values, startOffset);
    void value;
}

export function GlBuffer__SetValues_Z3EAA4E5D(this$, values, startOffset, endOffset) {
    if (this$.data.length !== values.length) {
        this$.data = this$.factory.Create(values);
        this$.isBuffered = false;
    }
    else {
        const value = this$.data.set(values);
        void value;
    }
    GlBuffer__DirtyRange_Z37302880(this$, startOffset, endOffset);
}

export function GlBuffer__SetValues_5975E3(this$, values) {
    GlBuffer__SetValues_Z3EAA4E5D(this$, values, 0, values.length - 1);
}

export function GlBuffer__Update(this$) {
    if (this$.dirtyEndOffset >= 0) {
        if (this$.isBuffered) {
            const dirtyLength = ((this$.dirtyEndOffset - this$.dirtyOffset) + 1) | 0;
            const bytesPerIndex = (~(~(this$.data.byteLength / this$.data.length))) | 0;
            const startOffset = (this$.dirtyOffset * bytesPerIndex) | 0;
            GlCommon_bufferSubData(this$.gl, this$.target, startOffset, this$.data, this$.dirtyOffset, dirtyLength);
        }
        else {
            this$.isBuffered = GlBuffer__get_AutoClean(this$);
            GlCommon_bufferData(this$.gl, this$.target, this$.data, this$.usage);
        }
    }
    if (GlBuffer__get_AutoClean(this$)) {
        GlBuffer__Clean_Z1FBCCD16(this$, true);
    }
}

