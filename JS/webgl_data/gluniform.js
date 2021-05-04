import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { record_type, list_type, lambda_type, option_type, string_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { Data_GlUniformData__get_Name, Data_GlUniformData, Data_GlUniformData$reflection } from "./webgl_data.js";
import { ofSeq, iterate, ofArray, empty, cons, map } from "../.fable/fable-library.3.0.0/List.js";
import { objectDebugName, dirtyObject, getUniform, getObject, splitName } from "./glcommon.js";
import { compareSafe, partialApply, isArrayLike } from "../.fable/fable-library.3.0.0/Util.js";
import { emptyFloat32Array } from "../js/typedarray_utils.js";
import { GlProgram_getUniformOrDefault, GlProgram_getUniform, GlProgram_emptyUniformInfo } from "../webgl_core/program_utils.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";
import { rangeNumber, getEnumerator } from "../.fable/fable-library.3.0.0/Seq.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { equalsWith } from "../.fable/fable-library.3.0.0/Array.js";
import { GlBuffer__DirtyRange_Z37302880 } from "./glbuffer.js";
import { GlCommon_uniformMatrix4x3fv, GlCommon_uniformMatrix4x2fv, GlCommon_uniformMatrix3x4fv, GlCommon_uniformMatrix3x2fv, GlCommon_uniformMatrix2x4fv, GlCommon_uniformMatrix2x3fv, GlCommon_uniformMatrix4fv, GlCommon_uniformMatrix3fv, GlCommon_uniformMatrix2fv, GlCommon_uniform4uiv, GlCommon_uniform3uiv, GlCommon_uniform2uiv, GlCommon_uniform4iv, GlCommon_uniform3iv, GlCommon_uniform2iv, GlCommon_uniform4fv, GlCommon_uniform3fv, GlCommon_uniform2fv, GlCommon_uniform1iv, GlCommon_uniform1fv, GlCommon_uniform1uiv } from "../webgl_core/webgl_browser_types.js";

export class UniformBuilder extends Record {
    constructor(LinkTo, ChildCreators, Data) {
        super();
        this.LinkTo = LinkTo;
        this.ChildCreators = ChildCreators;
        this.Data = Data;
    }
}

export function UniformBuilder$reflection() {
    return record_type("GlUniform.UniformBuilder", [], UniformBuilder, () => [["LinkTo", option_type(string_type)], ["ChildCreators", list_type(lambda_type(option_type(Data_GlUniformData$reflection()), Data_GlUniformData$reflection()))], ["Data", Data_GlUniformData$reflection()]]);
}

function applyCreators(builder) {
    const data = builder.Data;
    const parent = data;
    const createUniform = (creator) => creator(parent);
    const createUniforms = (creators) => map(createUniform, creators);
    data.ChildUniforms = Array.from(map(createUniform, builder.ChildCreators));
    return data;
}

function addLinkedChild(parent, data) {
    parent.LinkedChildren = cons(data, parent.LinkedChildren);
    return data;
}

function linkTo(parent, data) {
    return addLinkedChild(parent, new Data_GlUniformData(data.Id, data.Info, data.IsDirty, data.Data, data.Value, data.ParentObject, data.ParentUbo, data.RootUniform, data.ChildUniforms, parent, data.LinkedChildren));
}

function processLink(builder) {
    const matchValue = builder.LinkTo;
    if (matchValue != null) {
        const name = matchValue;
        const data = builder.Data;
        const patternInput = splitName(name);
        const uniformName = patternInput[1];
        const objectName = patternInput[0];
        const globj = getObject(objectName, data.ParentObject.Scene);
        const uniform = getUniform(uniformName, globj);
        builder.Data = linkTo(uniform, data);
        return builder;
    }
    else {
        return builder;
    }
}

export function _build(builder) {
    return applyCreators(processLink(builder));
}

export function _apply(props_mut, b_mut) {
    let inputRecord;
    _apply:
    while (true) {
        const props = props_mut, b = b_mut;
        const updateData = (data) => {
            b.Data = data;
            return b;
        };
        const addLink = (s) => {
            b.LinkTo = s;
            return b;
        };
        if (props.tail != null) {
            const t = props.tail;
            const h = props.head;
            if (h.tag === 0) {
                const x_1 = h.fields[0];
                const value = isArrayLike(x_1) ? x_1 : [x_1];
                props_mut = t;
                b_mut = updateData((inputRecord = b.Data, new Data_GlUniformData(inputRecord.Id, inputRecord.Info, inputRecord.IsDirty, inputRecord.Data, value, inputRecord.ParentObject, inputRecord.ParentUbo, inputRecord.RootUniform, inputRecord.ChildUniforms, inputRecord.Link, inputRecord.LinkedChildren)));
                continue _apply;
            }
            else {
                const x = h.fields[0];
                props_mut = t;
                b_mut = addLink(x);
                continue _apply;
            }
        }
        else {
            return b;
        }
        break;
    }
}

export function createFrom(info, props, parentObject) {
    const doCreate = (props_1, info_1, rootUniform) => {
        const createChild = (info_2) => partialApply(1, doCreate, [empty(), info_2]);
        return _build(_apply(props_1, new UniformBuilder(void 0, map(createChild, ofArray(info_1.Children)), new Data_GlUniformData(0, info_1, true, emptyFloat32Array, 0, parentObject, void 0, rootUniform, [], void 0, empty()))));
    };
    return doCreate(props, info, void 0);
}

function createEmpty(name, rootUniform, parentObject) {
    return new Data_GlUniformData(0, GlProgram_emptyUniformInfo(name), false, emptyFloat32Array, 0, parentObject, void 0, rootUniform, [], void 0, empty());
}

export function create(name, props, parentObject) {
    const matchValue = GlProgram_getUniform(name, parentObject.ProgramInfo);
    if (matchValue == null) {
        return createEmpty(name, void 0, parentObject);
    }
    else {
        const info = matchValue;
        return createFrom(info, props, parentObject);
    }
}

export function createLinked(data, parentObject) {
    return addLinkedChild(data, new Data_GlUniformData(data.Id, GlProgram_getUniformOrDefault(Data_GlUniformData__get_Name(data), parentObject.ProgramInfo), data.IsDirty, data.Data, 0, parentObject, void 0, void 0, [], data, empty()));
}

function dirty(data) {
    const dirtyUbo = (data_1) => {
        data_1.IsDirty = true;
        dirtyObject(data_1.ParentObject);
        iterate(dirtyUbo, data_1.LinkedChildren);
    };
    const matchValue = data.ParentUbo;
    if (matchValue == null) {
        dirtyObject(data.ParentObject);
        const uniform = defaultArg(data.RootUniform, data);
        uniform.IsDirty = true;
        iterate((data_2) => {
            dirty(data_2);
        }, uniform.LinkedChildren);
    }
    else {
        const ubo = matchValue;
        dirtyUbo(ubo);
    }
}

export function clean(data) {
    data.IsDirty = false;
}

function writeArray(typedArr, startIndex, count, value) {
    if (value.length === typedArr.length) {
        const value_1 = typedArr.set(value);
        void value_1;
    }
    else {
        const enumerator = getEnumerator(ofSeq(rangeNumber(0, 1, count - 1)));
        try {
            while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                const i = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
                typedArr[i]=value[startIndex + i];
            }
        }
        finally {
            enumerator.Dispose();
        }
    }
}

export function updateUbo(value, ubo, data) {
    const matchValue = data.ChildUniforms;
    if ((!equalsWith(compareSafe, matchValue, null)) ? (matchValue.length === 0) : false) {
        const info = data.Info;
        const offset = info.Offset | 0;
        const floatArr = data.Data;
        GlBuffer__DirtyRange_Z37302880(ubo.Buffer, offset, (offset + info.ByteSize) - 1);
        writeArray(floatArr, info.StartIndex, info.ElementCount, value);
    }
    else {
        data.ChildUniforms.forEach((data_1) => {
            updateUbo(value, ubo, data_1);
        });
    }
}

function updateSingle(value, vdata, data) {
    const info = data.Info;
    const location = info.Location;
    const gl = data.ParentObject.Scene.Canvas.Context;
    const value_1 = value;
    const matchValue = vdata.Info.Type | 0;
    switch (matchValue) {
        case 0: {
            throw (new Error("Uniform type not initialized"));
            break;
        }
        case 5120:
        case 5121:
        case 5123:
        case 5125:
        case 35670: {
            GlCommon_uniform1uiv(gl, location, value_1);
            break;
        }
        case 5122:
        case 5126:
        case 5131: {
            GlCommon_uniform1fv(gl, location, value_1);
            break;
        }
        case 5124:
        case 35678:
        case 35679:
        case 35680:
        case 35682:
        case 36289:
        case 36292:
        case 36293:
        case 36298:
        case 36299:
        case 36300:
        case 36303:
        case 36306:
        case 36307:
        case 36308:
        case 36311: {
            GlCommon_uniform1iv(gl, location, value_1);
            break;
        }
        case 35664: {
            GlCommon_uniform2fv(gl, location, value_1);
            break;
        }
        case 35665: {
            GlCommon_uniform3fv(gl, location, value_1);
            break;
        }
        case 35666: {
            GlCommon_uniform4fv(gl, location, value_1);
            break;
        }
        case 35667: {
            GlCommon_uniform2iv(gl, location, value_1);
            break;
        }
        case 35668: {
            GlCommon_uniform3iv(gl, location, value_1);
            break;
        }
        case 35669: {
            GlCommon_uniform4iv(gl, location, value_1);
            break;
        }
        case 35671:
        case 36294: {
            GlCommon_uniform2uiv(gl, location, value_1);
            break;
        }
        case 35672:
        case 36295: {
            GlCommon_uniform3uiv(gl, location, value_1);
            break;
        }
        case 35673:
        case 36296: {
            GlCommon_uniform4uiv(gl, location, value_1);
            break;
        }
        case 35674: {
            GlCommon_uniformMatrix2fv(gl, location, value_1);
            break;
        }
        case 35675: {
            GlCommon_uniformMatrix3fv(gl, location, value_1);
            break;
        }
        case 35676: {
            GlCommon_uniformMatrix4fv(gl, location, value_1);
            break;
        }
        case 35685: {
            GlCommon_uniformMatrix2x3fv(gl, location, value_1);
            break;
        }
        case 35686: {
            GlCommon_uniformMatrix2x4fv(gl, location, value_1);
            break;
        }
        case 35687: {
            GlCommon_uniformMatrix3x2fv(gl, location, value_1);
            break;
        }
        case 35688: {
            GlCommon_uniformMatrix3x4fv(gl, location, value_1);
            break;
        }
        case 35689: {
            GlCommon_uniformMatrix4x2fv(gl, location, value_1);
            break;
        }
        case 35690: {
            GlCommon_uniformMatrix4x3fv(gl, location, value_1);
            break;
        }
        default: {
        }
    }
}

export function update(data) {
    const isActive = data.Info.Index >= 0;
    if (isActive ? data.IsDirty : false) {
        const d = defaultArg(data.Link, data);
        if (d.ParentUbo == null) {
            updateSingle(d.Value, d, data);
        }
    }
    clean(data);
}

export function setValue(value, data) {
    if (data.Link == null) {
        const value_1 = isArrayLike(value) ? value : [value];
        const isRoot = data.RootUniform == null;
        const uniform = defaultArg(data.RootUniform, data);
        if (isRoot) {
            uniform.Value = value_1;
        }
        else {
            const info = data.Info;
            const count = (info.ElementCount * info.Length) | 0;
            const uniformValue = uniform.Value;
            const startIndex = info.StartIndex | 0;
            const enumerator = getEnumerator(ofSeq(rangeNumber(0, 1, count - 1)));
            try {
                while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                    const i = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
                    uniformValue[startIndex + i] = value_1[i];
                }
            }
            finally {
                enumerator.Dispose();
            }
        }
        const matchValue_1 = data.ParentUbo;
        if (matchValue_1 != null) {
            const ubo = matchValue_1;
            updateUbo(value_1, ubo, uniform);
        }
        dirty(uniform);
    }
}

