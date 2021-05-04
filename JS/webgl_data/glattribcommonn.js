import { float32ArrayFactory } from "../js/typedarray_utils.js";
import { getGlTypeInfo } from "../webgl_core/webgl_types.js";
import { GlBuffer__set_AutoClean_Z1FBCCD16, GlBuffer_$ctor_10C6D16C } from "./glbuffer.js";
import { iterate, reverse, map, cons, empty } from "../.fable/fable-library.3.0.0/List.js";
import { Data_GlAttributeData__get_Name, Data_GlAttributeData } from "./webgl_data.js";
import { dirtyObject, getAttribute, getObject, splitName } from "./glcommon.js";
import { curry, mapCurriedArgs } from "../.fable/fable-library.3.0.0/Util.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { GlProgram_getAttributeOrDefault } from "../webgl_core/program_utils.js";

export function defaultData(info, kind, parentObject) {
    return new Data_GlAttributeData(0, kind, info, true, 0, float32ArrayFactory, -1, -1, -1, getGlTypeInfo(5126), false, 0, -1, -1, -1, new Float64Array([]), -1, 35044, false, false, -1, GlBuffer_$ctor_10C6D16C(parentObject.Scene.Canvas.Context), empty(), parentObject, void 0, void 0, empty(), false, true, true, true, true, true, true);
}

function addLinkedChild(parent, data) {
    parent.LinkedChildren = cons(data, parent.LinkedChildren);
    return data;
}

function linkTo(parent, data) {
    GlBuffer__set_AutoClean_Z1FBCCD16(parent.Buffer, false);
    return addLinkedChild(parent, new Data_GlAttributeData(data.Id, data.Kind, data.Info, data.IsDirty, data.BaseType, data.ArrayCreator, data.RecordSize, data.ByteSize, data.DataLength, data.BaseTypeInfo, data.Normalize, data.StartIndex, data.IndexStride, data.Stride, data.Offset, new Float64Array([]), data.DataCount, data.BufferUsage, data.DeterminesVertexCount, data.DeterminesInstanceCount, data.Divisor, data.Buffer, data.ChildAttributes, data.ParentObject, data.ParentAttribute, parent, data.LinkedChildren, data.CanSingleCopy, data.AdjustsStride, data.EnableNeeded, data.RecalcNeeded, data.CalcDataCount, data.CalcStride, data.CalcOffset));
}

function processLink(name, data) {
    const patternInput = splitName(name);
    const objectName = patternInput[0];
    const attributeName = patternInput[1];
    const globj = getObject(objectName, data.ParentObject.Scene);
    const attribute = getAttribute(attributeName, globj);
    return linkTo(attribute, data);
}

export function updateCommonData(props, data) {
    const updateCommon = (data_1) => {
        const baseType = ((data_1.BaseType === 0) ? data_1.Info.TypeInfo.BaseType : data_1.BaseType) | 0;
        const baseTypeInfo = getGlTypeInfo(baseType);
        const res = new Data_GlAttributeData(data_1.Id, data_1.Kind, data_1.Info, data_1.IsDirty, baseType, data_1.Info.TypeInfo.TypeArrayCreator, data_1.Info.TypeInfo.ElementCount * baseTypeInfo.ByteSize, data_1.ByteSize, data_1.DataLength, baseTypeInfo, data_1.Normalize, data_1.StartIndex, data_1.IndexStride, data_1.Stride, data_1.Offset, data_1.Values, data_1.DataCount, data_1.BufferUsage, data_1.DeterminesVertexCount, data_1.DeterminesInstanceCount, data_1.Divisor, data_1.Buffer, data_1.ChildAttributes, data_1.ParentObject, data_1.ParentAttribute, data_1.Link, data_1.LinkedChildren, data_1.CanSingleCopy, data_1.AdjustsStride, data_1.EnableNeeded, data_1.RecalcNeeded, data_1.CalcDataCount, data_1.CalcStride, data_1.CalcOffset);
        return res;
    };
    const createChildren = (childCreators, parent, parentObject) => map(mapCurriedArgs((creator) => creator(empty(), parent, parentObject), [[0, 3]]), childCreators);
    const apply = (props_1, data_2) => {
        const loop = (props_2_mut, children_mut, data_3_mut) => {
            loop:
            while (true) {
                const props_2 = props_2_mut, children = children_mut, data_3 = data_3_mut;
                if (props_2.tail != null) {
                    const t = props_2.tail;
                    const h = props_2.head;
                    switch (h.tag) {
                        case 1: {
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, true, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 3: {
                            const x_1 = h.fields[0] | 0;
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, x_1, data_3.Offset, data_3.Values, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 2: {
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, false, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 4: {
                            const x_2 = h.fields[0] | 0;
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, x_2, data_3.Values, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 5: {
                            const x_3 = h.fields[0];
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, x_3, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 6: {
                            const x_4 = h.fields[0] | 0;
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, x_4, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 7: {
                            const x_5 = h.fields[0] | 0;
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, data_3.DataCount, x_5, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 8: {
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, data_3.DataCount, data_3.BufferUsage, true, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 9: {
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, true, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 10: {
                            const x_6 = h.fields[0] | 0;
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, x_6, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                        case 11: {
                            const x_7 = h.fields[0];
                            props_2_mut = t;
                            children_mut = cons(curry(3, x_7), children);
                            data_3_mut = data_3;
                            continue loop;
                        }
                        case 12: {
                            const x_8 = h.fields[0];
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = processLink(x_8, data_3);
                            continue loop;
                        }
                        default: {
                            const x = h.fields[0] | 0;
                            props_2_mut = t;
                            children_mut = children;
                            data_3_mut = (new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, x, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, data_3.ChildAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset));
                            continue loop;
                        }
                    }
                }
                else {
                    const childAttributes = createChildren(reverse(children), data_3, data_3.ParentObject);
                    return new Data_GlAttributeData(data_3.Id, data_3.Kind, data_3.Info, data_3.IsDirty, data_3.BaseType, data_3.ArrayCreator, data_3.RecordSize, data_3.ByteSize, data_3.DataLength, data_3.BaseTypeInfo, data_3.Normalize, data_3.StartIndex, data_3.IndexStride, data_3.Stride, data_3.Offset, data_3.Values, data_3.DataCount, data_3.BufferUsage, data_3.DeterminesVertexCount, data_3.DeterminesInstanceCount, data_3.Divisor, data_3.Buffer, childAttributes, data_3.ParentObject, data_3.ParentAttribute, data_3.Link, data_3.LinkedChildren, data_3.CanSingleCopy, data_3.AdjustsStride, data_3.EnableNeeded, data_3.RecalcNeeded, data_3.CalcDataCount, data_3.CalcStride, data_3.CalcOffset);
                }
                break;
            }
        };
        return loop(props_1, empty(), data_2);
    };
    return updateCommon(apply(props, data));
}

export function clean(data) {
    data.IsDirty = false;
    data.RecalcNeeded = false;
    data.EnableNeeded = false;
}

export function dirty(data) {
    data.IsDirty = true;
    const attribute = defaultArg(data.ParentAttribute, data);
    attribute.IsDirty = true;
    dirtyObject(attribute.ParentObject);
}

export function dirtyLinkedChildren(data) {
    iterate((data_1) => {
        dirty(data_1);
    }, data.LinkedChildren);
}

export function enableNeeded(data) {
    data.EnableNeeded = true;
    dirty(data);
}

export function linkedChildrenEnableNeeded(data) {
    iterate((data_1) => {
        enableNeeded(data_1);
    }, data.LinkedChildren);
}

export function recalcNeeded(data) {
    data.RecalcNeeded = true;
    const attribute = defaultArg(data.ParentAttribute, data);
    attribute.RecalcNeeded = true;
    data.ParentObject.RecalcNeeded = true;
    dirty(data);
}

export function linkedChildrenRecalcNeeded(data) {
    iterate((data_1) => {
        recalcNeeded(data_1);
    }, data.LinkedChildren);
}

export function childrenDirty(data) {
    iterate((data_1) => {
        dirty(data_1);
    }, data.ChildAttributes);
}

export function childrenEnableNeeded(data) {
    iterate((data_1) => {
        enableNeeded(data_1);
    }, data.ChildAttributes);
}

export function childrenRecalcNeeded(data) {
    iterate((data_1) => {
        recalcNeeded(data_1);
    }, data.ChildAttributes);
}

export function createLinked(data, parentObject) {
    const linkChildren = (data_1) => {
        const children = map((d) => createLinked(d, parentObject), data_1.ChildAttributes);
        return new Data_GlAttributeData(data_1.Id, data_1.Kind, data_1.Info, data_1.IsDirty, data_1.BaseType, data_1.ArrayCreator, data_1.RecordSize, data_1.ByteSize, data_1.DataLength, data_1.BaseTypeInfo, data_1.Normalize, data_1.StartIndex, data_1.IndexStride, data_1.Stride, data_1.Offset, data_1.Values, data_1.DataCount, data_1.BufferUsage, data_1.DeterminesVertexCount, data_1.DeterminesInstanceCount, data_1.Divisor, data_1.Buffer, children, data_1.ParentObject, data_1.ParentAttribute, data_1.Link, data_1.LinkedChildren, data_1.CanSingleCopy, data_1.AdjustsStride, data_1.EnableNeeded, data_1.RecalcNeeded, data_1.CalcDataCount, data_1.CalcStride, data_1.CalcOffset);
    };
    const updateChildrenParentAttribute = (data_2) => {
        const parent = data_2;
        iterate((c) => {
            c.ParentAttribute = parent;
        }, data_2.ChildAttributes);
        return data_2;
    };
    GlBuffer__set_AutoClean_Z1FBCCD16(data.Buffer, false);
    return addLinkedChild(data, updateChildrenParentAttribute(linkChildren(new Data_GlAttributeData(data.Id, data.Kind, GlProgram_getAttributeOrDefault(Data_GlAttributeData__get_Name(data), parentObject.ProgramInfo), data.IsDirty, data.BaseType, data.ArrayCreator, data.RecordSize, data.ByteSize, data.DataLength, data.BaseTypeInfo, data.Normalize, data.StartIndex, data.IndexStride, data.Stride, data.Offset, new Float64Array([]), data.DataCount, data.BufferUsage, data.DeterminesVertexCount, data.DeterminesInstanceCount, data.Divisor, data.Buffer, data.ChildAttributes, parentObject, data.ParentAttribute, data, empty(), data.CanSingleCopy, data.AdjustsStride, data.EnableNeeded, data.RecalcNeeded, data.CalcDataCount, data.CalcStride, data.CalcOffset))));
}

