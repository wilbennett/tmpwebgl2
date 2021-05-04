import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { dirty, clean, defaultData, updateCommonData, linkedChildrenRecalcNeeded, childrenRecalcNeeded } from "./glattribcommonn.js";
import { Data_GlAttributeData__get_Name, Data_GlRootAttribute, Data_GlAttributeKind, Data_GlAttributeData } from "./webgl_data.js";
import { length, ofSeq, forAll, sumBy, where, iterate, empty, cons } from "../.fable/fable-library.3.0.0/List.js";
import { GlBuffer__SetValuesOffset_Z59CA6BE1, GlBuffer__Update, GlBuffer__Bind, GlBuffer__DirtyRange_Z37302880, GlBuffer__get_Data, GlBuffer__SetLength_Z524259A4, GlBuffer__SetValues_5975E3, GlBuffer__Init_71B7C75E } from "./glbuffer.js";
import { rangeNumber, getEnumerator } from "../.fable/fable-library.3.0.0/Seq.js";
import { int8ArrayFactory } from "../js/typedarray_utils.js";
import { GlProgram_getAttribute, GlProgram_emptyAttributeInfo } from "../webgl_core/program_utils.js";
import { getViewWriter } from "../webgl_core/webgl_types.js";
import { GlCommon_vertexAttribDivisor, GlCommon_vertexAttribPointer, GlCommon_enableVertexAttribArray } from "../webgl_core/webgl_browser_types.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { update as update_1 } from "./glinterleavechildattribute.js";
import { isArrayLike } from "../.fable/fable-library.3.0.0/Util.js";

function updateCalculated(data) {
    if (data.RecalcNeeded) {
        const vdata = defaultArg(data.Link, data);
        if (data.CalcDataCount) {
            const newDataCount = (~(~(vdata.Values.length / data.IndexStride))) | 0;
            if (newDataCount !== data.DataCount) {
                data.DataCount = newDataCount;
                childrenRecalcNeeded(data);
                linkedChildrenRecalcNeeded(data);
            }
        }
        const newByteSize = (data.DataCount * data.Stride) | 0;
        if (newByteSize !== data.ByteSize) {
            data.ByteSize = newByteSize;
            childrenRecalcNeeded(data);
            linkedChildrenRecalcNeeded(data);
        }
        data.DataLength = (data.CanSingleCopy ? vdata.Values.length : data.ByteSize);
    }
    data.RecalcNeeded = false;
}

function getStride(currStride_mut, children_mut) {
    getStride:
    while (true) {
        const currStride = currStride_mut, children = children_mut;
        if (children.tail != null) {
            const remaining = children.tail;
            const c = children.head;
            const childSize = (c.AdjustsStride ? c.RecordSize : 0) | 0;
            currStride_mut = (currStride + childSize);
            children_mut = remaining;
            continue getStride;
        }
        else {
            return currStride | 0;
        }
        break;
    }
}

function updateChildrenOffset(currOffset_mut, children_mut) {
    updateChildrenOffset:
    while (true) {
        const currOffset = currOffset_mut, children = children_mut;
        if (children.tail != null) {
            const remainingChildren = children.tail;
            const child = children.head;
            child.Offset = currOffset;
            const nextOffset = (child.Offset + child.RecordSize) | 0;
            currOffset_mut = nextOffset;
            children_mut = remainingChildren;
            continue updateChildrenOffset;
        }
        break;
    }
}

function updateChildrenStartIndex(data) {
    const loop = (existing_mut, currIndex_mut, children_mut) => {
        loop:
        while (true) {
            const existing = existing_mut, currIndex = currIndex_mut, children = children_mut;
            if (existing.tail != null) {
                const remaining = existing.tail;
                const child = existing.head;
                if (child.CalcOffset) {
                    const newChildren = cons(new Data_GlAttributeData(child.Id, child.Kind, child.Info, child.IsDirty, child.BaseType, child.ArrayCreator, child.RecordSize, child.ByteSize, child.DataLength, child.BaseTypeInfo, child.Normalize, currIndex, child.IndexStride, child.Stride, child.Offset, child.Values, child.DataCount, child.BufferUsage, child.DeterminesVertexCount, child.DeterminesInstanceCount, child.Divisor, child.Buffer, child.ChildAttributes, child.ParentObject, child.ParentAttribute, child.Link, child.LinkedChildren, child.CanSingleCopy, child.AdjustsStride, child.EnableNeeded, child.RecalcNeeded, child.CalcDataCount, child.CalcStride, child.CalcOffset), children);
                    const nextIndex = (currIndex + child.Info.TypeInfo.ElementCount) | 0;
                    existing_mut = remaining;
                    currIndex_mut = nextIndex;
                    children_mut = newChildren;
                    continue loop;
                }
                else {
                    existing_mut = remaining;
                    currIndex_mut = currIndex;
                    children_mut = cons(child, children);
                    continue loop;
                }
            }
            else {
                return children;
            }
            break;
        }
    };
    const currIndex_1 = data.Info.TypeInfo.ElementCount | 0;
    return new Data_GlAttributeData(data.Id, data.Kind, data.Info, data.IsDirty, data.BaseType, data.ArrayCreator, data.RecordSize, data.ByteSize, data.DataLength, data.BaseTypeInfo, data.Normalize, data.StartIndex, data.IndexStride, data.Stride, data.Offset, data.Values, data.DataCount, data.BufferUsage, data.DeterminesVertexCount, data.DeterminesInstanceCount, data.Divisor, data.Buffer, loop(data.ChildAttributes, currIndex_1, empty()), data.ParentObject, data.ParentAttribute, data.Link, data.LinkedChildren, data.CanSingleCopy, data.AdjustsStride, data.EnableNeeded, data.RecalcNeeded, data.CalcDataCount, data.CalcStride, data.CalcOffset);
}

function updateChildrenParentAttribute(data) {
    iterate((c) => {
        c.ParentAttribute = data;
    }, data.ChildAttributes);
    return data;
}

export function createFrom(info, props, parentObject) {
    let inputRecord;
    const data_1 = updateCommonData(props, (inputRecord = defaultData(info, new Data_GlAttributeKind(1), parentObject), new Data_GlAttributeData(inputRecord.Id, inputRecord.Kind, inputRecord.Info, inputRecord.IsDirty, inputRecord.BaseType, inputRecord.ArrayCreator, inputRecord.RecordSize, inputRecord.ByteSize, inputRecord.DataLength, inputRecord.BaseTypeInfo, inputRecord.Normalize, inputRecord.StartIndex, inputRecord.IndexStride, inputRecord.Stride, 0, inputRecord.Values, inputRecord.DataCount, inputRecord.BufferUsage, inputRecord.DeterminesVertexCount, inputRecord.DeterminesInstanceCount, inputRecord.Divisor, inputRecord.Buffer, inputRecord.ChildAttributes, inputRecord.ParentObject, inputRecord.ParentAttribute, inputRecord.Link, inputRecord.LinkedChildren, inputRecord.CanSingleCopy, inputRecord.AdjustsStride, inputRecord.EnableNeeded, inputRecord.RecalcNeeded, inputRecord.CalcDataCount, inputRecord.CalcStride, inputRecord.CalcOffset)));
    const siblings = where((c) => c.CalcOffset, data_1.ChildAttributes);
    const strideSiblings = where((c_1) => c_1.AdjustsStride, siblings);
    const strideSiblingSum = (projection) => sumBy(projection, strideSiblings, {
        GetZero: () => 0,
        Add: (x, y) => (x + y),
    });
    const calcStride = data_1.Stride <= 0;
    const recordSize = data_1.RecordSize | 0;
    const stride = (calcStride ? getStride(recordSize, strideSiblings) : data_1.Stride) | 0;
    updateChildrenOffset(data_1.Offset + data_1.RecordSize, siblings);
    const ti = data_1.Info.TypeInfo;
    const indexStride = (ti.ElementCount + strideSiblingSum((c_2) => c_2.Info.TypeInfo.ElementCount)) | 0;
    const canSingleCopy = forAll((c_3) => (c_3.BaseType === data_1.BaseType), siblings);
    if (data_1.Link == null) {
        GlBuffer__Init_71B7C75E(data_1.Buffer, 34962, data_1.BufferUsage, data_1.ArrayCreator);
        if (canSingleCopy) {
            GlBuffer__SetValues_5975E3(data_1.Buffer, data_1.Values);
        }
    }
    const enumerator = getEnumerator(data_1.ChildAttributes);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const child = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
            const isDerived = !child.CalcOffset;
            if (child.CalcStride) {
                child.Stride = (isDerived ? child.Info.TypeInfo.ByteSize : stride);
            }
        }
    }
    finally {
        enumerator.Dispose();
    }
    return new Data_GlRootAttribute(1, updateChildrenParentAttribute(updateChildrenStartIndex(new Data_GlAttributeData(data_1.Id, data_1.Kind, data_1.Info, data_1.IsDirty, data_1.BaseType, canSingleCopy ? data_1.ArrayCreator : int8ArrayFactory, data_1.RecordSize, data_1.ByteSize, data_1.DataLength, data_1.BaseTypeInfo, data_1.Normalize, data_1.StartIndex, indexStride, stride, data_1.Offset, data_1.Values, data_1.DataCount, data_1.BufferUsage, data_1.DeterminesVertexCount, data_1.DeterminesInstanceCount, data_1.Divisor, data_1.Buffer, data_1.ChildAttributes, data_1.ParentObject, data_1.ParentAttribute, data_1.Link, data_1.LinkedChildren, canSingleCopy, data_1.AdjustsStride, data_1.EnableNeeded, data_1.RecalcNeeded, data_1.DataCount < 0, calcStride, data_1.Offset < 0))));
}

export function createEmpty(name, parentObject) {
    const info = GlProgram_emptyAttributeInfo(name);
    return new Data_GlRootAttribute(1, defaultData(info, new Data_GlAttributeKind(1), parentObject));
}

export function create(name, props, parentObject) {
    const matchValue = GlProgram_getAttribute(name, parentObject.ProgramInfo);
    if (matchValue == null) {
        return createEmpty(name, parentObject);
    }
    else {
        const info = matchValue;
        return createFrom(info, props, parentObject);
    }
}

function copyData(data) {
    if (data.Link == null) {
        const buffer = data.Buffer;
        const values = data.Values;
        const indexStride = data.IndexStride | 0;
        GlBuffer__SetLength_Z524259A4(buffer, data.DataLength);
        const view = new DataView(GlBuffer__get_Data(buffer).buffer);
        const writeData = (dataType, offset, stride, dataCount, byteSize, startIndex, elementCount) => {
            let writer;
            const clo1 = getViewWriter(dataType);
            writer = ((arg10) => {
                const clo2 = clo1(arg10);
                return (arg20) => {
                    const clo3 = clo2(arg20);
                    return clo3;
                };
            });
            const loop = (index_mut, ofs_mut, i_mut) => {
                loop:
                while (true) {
                    const index = index_mut, ofs = ofs_mut, i = i_mut;
                    if (i === 0) {
                    }
                    else {
                        const enumerator = getEnumerator(ofSeq(rangeNumber(0, 1, elementCount - 1)));
                        try {
                            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                                const s = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
                                const value = writer(view)(ofs + (s * byteSize))(values[index + s]) | 0;
                                void value;
                            }
                        }
                        finally {
                            enumerator.Dispose();
                        }
                        index_mut = (index + indexStride);
                        ofs_mut = (ofs + stride);
                        i_mut = (i - 1);
                        continue loop;
                    }
                    break;
                }
            };
            loop(startIndex, offset, dataCount);
        };
        const writeChildData = (startIndex_1_mut, children_mut) => {
            writeChildData:
            while (true) {
                const startIndex_1 = startIndex_1_mut, children = children_mut;
                if (children.tail != null) {
                    const remainingChildren = children.tail;
                    const c = children.head;
                    if (c.CalcOffset) {
                        const baseByteSize = c.BaseTypeInfo.ByteSize | 0;
                        writeData(c.BaseType, c.Offset, c.Stride, c.DataCount, baseByteSize, startIndex_1, c.Info.TypeInfo.ElementCount);
                        startIndex_1_mut = (startIndex_1 + c.Info.TypeInfo.ElementCount);
                        children_mut = remainingChildren;
                        continue writeChildData;
                    }
                    else {
                        startIndex_1_mut = startIndex_1;
                        children_mut = remainingChildren;
                        continue writeChildData;
                    }
                }
                break;
            }
        };
        writeData(data.BaseType, data.Offset, data.Stride, data.DataCount, data.BaseTypeInfo.ByteSize, 0, data.Info.TypeInfo.ElementCount);
        writeChildData(data.Info.TypeInfo.ElementCount, data.ChildAttributes);
        GlBuffer__DirtyRange_Z37302880(buffer, 0, data.DataLength - 1);
    }
}

function enable(data) {
    if (data.EnableNeeded) {
        data.EnableNeeded = false;
        if (data.ParentObject.ProcessLinked ? true : (length(data.LinkedChildren) === 0)) {
            const gl = data.ParentObject.Scene.Canvas.Context;
            const location = data.Info.Location;
            if (location >= 0) {
                GlCommon_enableVertexAttribArray(gl, location);
                GlCommon_vertexAttribPointer(gl, location, data.Info.TypeInfo.ElementCount, data.BaseType, data.Normalize, data.Stride, data.Offset);
                if (data.Divisor >= 0) {
                    GlCommon_vertexAttribDivisor(gl, location, data.Divisor);
                }
            }
        }
    }
}

export function update(data) {
    const vdata = defaultArg(data.Link, data);
    const shouldUpdate = data.ParentObject.ProcessLinked ? true : (length(data.LinkedChildren) > 0);
    if (data.IsDirty) {
        if (shouldUpdate) {
            GlBuffer__Bind(vdata.Buffer);
        }
        const isActive = data.Info.Location >= 0;
        if (isActive) {
            updateCalculated(data);
            enable(data);
        }
        iterate((data_1) => {
            update_1(data_1);
        }, data.ChildAttributes);
        if (shouldUpdate) {
            if (!data.CanSingleCopy) {
                copyData(data);
            }
            GlBuffer__Update(vdata.Buffer);
        }
        clean(data);
    }
}

export function _setValues(values, data) {
    const values_1 = isArrayLike(values) ? values : [values];
    data.Values = values_1;
    GlBuffer__SetValues_5975E3(data.Buffer, values_1);
    childrenRecalcNeeded(data);
}

export function _setValue(index, value, data) {
    const value_1 = isArrayLike(value) ? value : [value];
    const attribute = defaultArg(data.ParentAttribute, data);
    const startIndex = (data.StartIndex + (data.IndexStride * index)) | 0;
    const count = data.Info.TypeInfo.ElementCount | 0;
    const dataValues = data.Values;
    const enumerator = getEnumerator(ofSeq(rangeNumber(0, 1, count - 1)));
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const i = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
            dataValues[startIndex + i] = value_1[i];
        }
    }
    finally {
        enumerator.Dispose();
    }
    GlBuffer__SetValuesOffset_Z59CA6BE1(attribute.Buffer, value_1, startIndex);
    dirty(attribute);
}

