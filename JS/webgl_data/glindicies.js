import { getObject, objectRecalcNeeded, dirtyObject } from "./glcommon.js";
import { empty, cons, iterate } from "../.fable/fable-library.3.0.0/List.js";
import { uint16ArrayFactory, uint8ArrayFactory } from "../js/typedarray_utils.js";
import { Data_GlIndicesData } from "./webgl_data.js";
import { GlBuffer__Update, GlBuffer__Bind, GlBuffer__Delete, GlBuffer_$ctor_10C6D16C, GlBuffer__set_AutoClean_Z1FBCCD16, GlBuffer__SetValues_5975E3, GlBuffer__Init_71B7C75E } from "./glbuffer.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";

function clean(data) {
    data.IsDirty = false;
}

function dirty(data) {
    data.IsDirty = true;
    dirtyObject(data.ParentObject);
}

function dirtyLinkedChildren(data) {
    iterate((data_1) => {
        dirty(data_1);
    }, data.LinkedChildren);
}

function recalcNeeded(data) {
    data.RecalcNeeded = true;
    data.IsDirty = true;
    objectRecalcNeeded(data.ParentObject);
}

function linkedChildrenRecalcNeeded(data) {
    iterate((data_1) => {
        recalcNeeded(data_1);
    }, data.LinkedChildren);
}

function updateArrayCreator(data) {
    let arrayCreator;
    const matchValue = data.IndicesType | 0;
    switch (matchValue) {
        case 5121: {
            arrayCreator = uint8ArrayFactory;
            break;
        }
        case 5123: {
            arrayCreator = uint16ArrayFactory;
            break;
        }
        default: {
            arrayCreator = uint16ArrayFactory;
        }
    }
    return new Data_GlIndicesData(data.Name, data.IsDirty, data.IndicesType, arrayCreator, data.Offset, data.Values, data.DataCount, data.BufferUsage, data.Buffer, data.ParentObject, data.Link, data.LinkedChildren, data.RecalcNeeded, data.CalcDataCount);
}

function initBuffer(data) {
    if (data.Link == null) {
        GlBuffer__Init_71B7C75E(data.Buffer, 34963, data.BufferUsage, data.ArrayCreator);
        GlBuffer__SetValues_5975E3(data.Buffer, data.Values);
    }
    return data;
}

function updateCalcFlags(data) {
    return new Data_GlIndicesData(data.Name, data.IsDirty, data.IndicesType, data.ArrayCreator, data.Offset, data.Values, data.DataCount, data.BufferUsage, data.Buffer, data.ParentObject, data.Link, data.LinkedChildren, data.RecalcNeeded, data.DataCount < 0);
}

function linkTo(parent, data) {
    GlBuffer__set_AutoClean_Z1FBCCD16(parent.Buffer, false);
    const data_1 = new Data_GlIndicesData(data.Name, data.IsDirty, data.IndicesType, data.ArrayCreator, data.Offset, data.Values, data.DataCount, data.BufferUsage, data.Buffer, data.ParentObject, parent, data.LinkedChildren, data.RecalcNeeded, data.CalcDataCount);
    parent.LinkedChildren = cons(data_1, parent.LinkedChildren);
    return data_1;
}

function processLink(objectName, data) {
    const globj = getObject(objectName, data.ParentObject.Scene);
    const matchValue = globj.Indices;
    if (matchValue == null) {
        const msg = toText(interpolate("Cannot link to undefined Indices of %P().", [globj.Name]));
        throw (new Error(msg));
    }
    else {
        const indices = matchValue;
        return linkTo(indices, data);
    }
}

function apply(props, data) {
    const loop = (props_1_mut, data_1_mut) => {
        loop:
        while (true) {
            const props_1 = props_1_mut, data_1 = data_1_mut;
            if (props_1.tail != null) {
                const t = props_1.tail;
                const h = props_1.head;
                switch (h.tag) {
                    case 1: {
                        const x_1 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlIndicesData(data_1.Name, data_1.IsDirty, data_1.IndicesType, data_1.ArrayCreator, x_1, data_1.Values, data_1.DataCount, data_1.BufferUsage, data_1.Buffer, data_1.ParentObject, data_1.Link, data_1.LinkedChildren, data_1.RecalcNeeded, data_1.CalcDataCount));
                        continue loop;
                    }
                    case 2: {
                        const x_2 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlIndicesData(data_1.Name, data_1.IsDirty, data_1.IndicesType, data_1.ArrayCreator, data_1.Offset, x_2, data_1.DataCount, data_1.BufferUsage, data_1.Buffer, data_1.ParentObject, data_1.Link, data_1.LinkedChildren, data_1.RecalcNeeded, data_1.CalcDataCount));
                        continue loop;
                    }
                    case 3: {
                        const x_3 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlIndicesData(data_1.Name, data_1.IsDirty, data_1.IndicesType, data_1.ArrayCreator, data_1.Offset, data_1.Values, data_1.DataCount, x_3, data_1.Buffer, data_1.ParentObject, data_1.Link, data_1.LinkedChildren, data_1.RecalcNeeded, data_1.CalcDataCount));
                        continue loop;
                    }
                    case 4: {
                        const x_4 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = processLink(x_4, data_1);
                        continue loop;
                    }
                    default: {
                        const x = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlIndicesData(data_1.Name, data_1.IsDirty, x, data_1.ArrayCreator, data_1.Offset, data_1.Values, data_1.DataCount, data_1.BufferUsage, data_1.Buffer, data_1.ParentObject, data_1.Link, data_1.LinkedChildren, data_1.RecalcNeeded, data_1.CalcDataCount));
                        continue loop;
                    }
                }
            }
            else {
                return data_1;
            }
            break;
        }
    };
    return initBuffer(updateCalcFlags(updateArrayCreator(loop(props, data))));
}

function updateCalculated(data) {
    if (data.RecalcNeeded) {
        data.RecalcNeeded = false;
        if (data.CalcDataCount) {
            const newDataCount = (data.Values.length - data.Offset) | 0;
            if (newDataCount !== data.DataCount) {
                data.DataCount = (data.Values.length - data.Offset);
                objectRecalcNeeded(data.ParentObject);
                linkedChildrenRecalcNeeded(data);
            }
        }
    }
}

export function create(props, parentObject) {
    return apply(props, new Data_GlIndicesData("Indices", true, 5121, uint8ArrayFactory, 0, new Int32Array([]), -1, 35044, GlBuffer_$ctor_10C6D16C(parentObject.Scene.Canvas.Context), parentObject, void 0, empty(), true, true));
}

export function delete$(data) {
    GlBuffer__Delete(data.Buffer);
}

export function update(data) {
    if (data.IsDirty) {
        updateCalculated(data);
        clean(data);
        GlBuffer__Bind(data.Buffer);
        GlBuffer__Update(data.Buffer);
    }
}

