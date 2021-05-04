import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { objectRecalcNeeded } from "./glcommon.js";
import { clean, defaultData, updateCommonData, linkedChildrenRecalcNeeded } from "./glattribcommonn.js";
import { Data_GlAttributeData__get_Name, Data_GlAttributeData, Data_GlAttributeKind } from "./webgl_data.js";
import { GlProgram_getAttribute, GlProgram_emptyAttributeInfo } from "../webgl_core/program_utils.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { length } from "../.fable/fable-library.3.0.0/List.js";
import { GlCommon_vertexAttribDivisor, GlCommon_vertexAttribPointer, GlCommon_enableVertexAttribArray } from "../webgl_core/webgl_browser_types.js";

function updateCalculated(data) {
    if (data.RecalcNeeded) {
        data.RecalcNeeded = false;
        const matchValue = data.ParentAttribute;
        if (matchValue != null) {
            const pdata = matchValue;
            if (data.CalcDataCount) {
                const vdata = defaultArg(pdata.Link, pdata);
                const parentSize = vdata.ByteSize | 0;
                const newDataCount = (~(~Math.ceil((parentSize - data.Offset) / data.Stride))) | 0;
                if (newDataCount !== data.DataCount) {
                    data.DataCount = newDataCount;
                    objectRecalcNeeded(data.ParentObject);
                    linkedChildrenRecalcNeeded(data);
                }
            }
        }
    }
}

export function createFrom(info, props, parentAttribute, parentObject) {
    let inputRecord;
    const data_1 = updateCommonData(props, (inputRecord = defaultData(info, new Data_GlAttributeKind(2), parentObject), new Data_GlAttributeData(inputRecord.Id, inputRecord.Kind, inputRecord.Info, inputRecord.IsDirty, inputRecord.BaseType, inputRecord.ArrayCreator, inputRecord.RecordSize, inputRecord.ByteSize, inputRecord.DataLength, inputRecord.BaseTypeInfo, inputRecord.Normalize, inputRecord.StartIndex, inputRecord.IndexStride, inputRecord.Stride, inputRecord.Offset, inputRecord.Values, inputRecord.DataCount, inputRecord.BufferUsage, inputRecord.DeterminesVertexCount, inputRecord.DeterminesInstanceCount, inputRecord.Divisor, inputRecord.Buffer, inputRecord.ChildAttributes, inputRecord.ParentObject, parentAttribute, inputRecord.Link, inputRecord.LinkedChildren, inputRecord.CanSingleCopy, inputRecord.AdjustsStride, inputRecord.EnableNeeded, inputRecord.RecalcNeeded, inputRecord.CalcDataCount, inputRecord.CalcStride, inputRecord.CalcOffset)));
    const ti = data_1.Info.TypeInfo;
    const calcStride = data_1.Stride <= 0;
    const stride = (calcStride ? ti.ByteSize : data_1.Stride) | 0;
    return new Data_GlAttributeData(data_1.Id, data_1.Kind, data_1.Info, data_1.IsDirty, data_1.BaseType, data_1.ArrayCreator, data_1.RecordSize, data_1.ByteSize, data_1.DataLength, data_1.BaseTypeInfo, data_1.Normalize, data_1.StartIndex, data_1.IndexStride, stride, data_1.Offset, data_1.Values, data_1.DataCount, data_1.BufferUsage, data_1.DeterminesVertexCount, data_1.DeterminesInstanceCount, data_1.Divisor, data_1.Buffer, data_1.ChildAttributes, data_1.ParentObject, data_1.ParentAttribute, data_1.Link, data_1.LinkedChildren, data_1.CanSingleCopy, data_1.AdjustsStride ? (data_1.Offset < 0) : false, data_1.EnableNeeded, data_1.RecalcNeeded, data_1.DataCount < 0, calcStride, data_1.Offset < 0);
}

export function createEmpty(name, parentAttribute, parentObject) {
    const info = GlProgram_emptyAttributeInfo(name);
    const inputRecord = defaultData(info, new Data_GlAttributeKind(2), parentObject);
    return new Data_GlAttributeData(inputRecord.Id, inputRecord.Kind, inputRecord.Info, inputRecord.IsDirty, inputRecord.BaseType, inputRecord.ArrayCreator, inputRecord.RecordSize, inputRecord.ByteSize, inputRecord.DataLength, inputRecord.BaseTypeInfo, inputRecord.Normalize, inputRecord.StartIndex, inputRecord.IndexStride, inputRecord.Stride, inputRecord.Offset, inputRecord.Values, inputRecord.DataCount, inputRecord.BufferUsage, inputRecord.DeterminesVertexCount, inputRecord.DeterminesInstanceCount, inputRecord.Divisor, inputRecord.Buffer, inputRecord.ChildAttributes, inputRecord.ParentObject, parentAttribute, inputRecord.Link, inputRecord.LinkedChildren, inputRecord.CanSingleCopy, inputRecord.AdjustsStride, inputRecord.EnableNeeded, inputRecord.RecalcNeeded, inputRecord.CalcDataCount, inputRecord.CalcStride, inputRecord.CalcOffset);
}

export function create(name, props, parentAttribute, parentObject) {
    const matchValue = GlProgram_getAttribute(name, parentObject.ProgramInfo);
    if (matchValue == null) {
        return createEmpty(name, parentAttribute, parentObject);
    }
    else {
        const info = matchValue;
        return createFrom(info, props, parentAttribute, parentObject);
    }
}

export function update(data) {
    const isActive = data.Info.Location >= 0;
    if (isActive ? data.IsDirty : false) {
        updateCalculated(data);
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
        clean(data);
    }
}

