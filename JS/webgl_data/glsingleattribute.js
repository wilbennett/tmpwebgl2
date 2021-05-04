import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { dirtyLinkedChildren, dirty, linkedChildrenRecalcNeeded, recalcNeeded, clean, defaultData, updateCommonData } from "./glattribcommonn.js";
import { Data_GlAttributeData__get_Name, Data_GlRootAttribute, Data_GlAttributeData, Data_GlAttributeKind } from "./webgl_data.js";
import { GlBuffer__SetValuesOffset_Z59CA6BE1, GlBuffer__Update, GlBuffer__Bind, GlBuffer__SetValues_5975E3, GlBuffer__Init_71B7C75E } from "./glbuffer.js";
import { GlProgram_getAttribute, GlProgram_emptyAttributeInfo } from "../webgl_core/program_utils.js";
import { ofSeq, length } from "../.fable/fable-library.3.0.0/List.js";
import { GlCommon_vertexAttribDivisor, GlCommon_vertexAttribPointer, GlCommon_enableVertexAttribArray } from "../webgl_core/webgl_browser_types.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { isArrayLike } from "../.fable/fable-library.3.0.0/Util.js";
import { rangeNumber, getEnumerator } from "../.fable/fable-library.3.0.0/Seq.js";

function updateCalculated(data) {
    if (data.RecalcNeeded) {
        data.RecalcNeeded = false;
        const vdata = defaultArg(data.Link, data);
        if (data.CalcDataCount) {
            const ti = data.Info.TypeInfo;
            const totValuesByteSize = ((~(~(vdata.Values.length / ti.ElementCount))) * ti.ByteSize) | 0;
            const valuesByteSize = (totValuesByteSize - data.Offset) | 0;
            data.DataCount = (~(~Math.ceil(valuesByteSize / data.Stride)));
        }
        data.ByteSize = (data.DataCount * data.Stride);
    }
}

export function createFrom(info, props, parentObject) {
    let inputRecord;
    const data_1 = updateCommonData(props, (inputRecord = defaultData(info, new Data_GlAttributeKind(0), parentObject), new Data_GlAttributeData(inputRecord.Id, inputRecord.Kind, inputRecord.Info, inputRecord.IsDirty, inputRecord.BaseType, inputRecord.ArrayCreator, inputRecord.RecordSize, inputRecord.ByteSize, inputRecord.DataLength, inputRecord.BaseTypeInfo, inputRecord.Normalize, inputRecord.StartIndex, inputRecord.IndexStride, inputRecord.Stride, 0, inputRecord.Values, inputRecord.DataCount, inputRecord.BufferUsage, inputRecord.DeterminesVertexCount, inputRecord.DeterminesInstanceCount, inputRecord.Divisor, inputRecord.Buffer, inputRecord.ChildAttributes, inputRecord.ParentObject, inputRecord.ParentAttribute, inputRecord.Link, inputRecord.LinkedChildren, inputRecord.CanSingleCopy, inputRecord.AdjustsStride, inputRecord.EnableNeeded, inputRecord.RecalcNeeded, inputRecord.CalcDataCount, inputRecord.CalcStride, false)));
    const ti = data_1.Info.TypeInfo;
    const stride = ((data_1.Stride <= 0) ? ti.ByteSize : data_1.Stride) | 0;
    if (data_1.Link == null) {
        const buffer = data_1.Buffer;
        GlBuffer__Init_71B7C75E(buffer, 34962, data_1.BufferUsage, data_1.ArrayCreator);
        GlBuffer__SetValues_5975E3(buffer, data_1.Values);
    }
    return new Data_GlRootAttribute(0, new Data_GlAttributeData(data_1.Id, data_1.Kind, data_1.Info, data_1.IsDirty, data_1.BaseType, data_1.ArrayCreator, data_1.RecordSize, data_1.ByteSize, data_1.DataLength, data_1.BaseTypeInfo, data_1.Normalize, data_1.StartIndex, data_1.IndexStride, stride, data_1.Offset, data_1.Values, data_1.DataCount, data_1.BufferUsage, data_1.DeterminesVertexCount, data_1.DeterminesInstanceCount, data_1.Divisor, data_1.Buffer, data_1.ChildAttributes, data_1.ParentObject, data_1.ParentAttribute, data_1.Link, data_1.LinkedChildren, data_1.CanSingleCopy, data_1.AdjustsStride, data_1.EnableNeeded, data_1.RecalcNeeded, data_1.DataCount < 0, data_1.CalcStride, data_1.CalcOffset));
}

export function createEmpty(name, parentObject) {
    const info = GlProgram_emptyAttributeInfo(name);
    return new Data_GlRootAttribute(0, defaultData(info, new Data_GlAttributeKind(0), parentObject));
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
    const hasLinked = length(data.LinkedChildren) > 0;
    const isActive = data.Info.Location >= 0;
    if (isActive ? data.IsDirty : false) {
        updateCalculated(data);
        if (data.ParentObject.ProcessLinked ? true : (!hasLinked)) {
            GlBuffer__Bind(vdata.Buffer);
            GlBuffer__Update(vdata.Buffer);
            enable(data);
        }
        clean(data);
    }
}

export function _setValues(values, data) {
    const values_1 = isArrayLike(values) ? values : [values];
    data.Values = values_1;
    GlBuffer__SetValues_5975E3(data.Buffer, values_1);
    recalcNeeded(data);
    linkedChildrenRecalcNeeded(data);
}

export function _setValue(index, value, data) {
    const value_1 = isArrayLike(value) ? value : [value];
    const count = data.Info.TypeInfo.ElementCount | 0;
    const startIndex = (count * index) | 0;
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
    GlBuffer__SetValuesOffset_Z59CA6BE1(data.Buffer, value_1, startIndex);
    dirty(data);
    dirtyLinkedChildren(data);
}

