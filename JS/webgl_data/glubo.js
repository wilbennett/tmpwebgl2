import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { record_type, lambda_type, list_type, option_type, string_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { Data_GlUboData__get_Name, Data_GlUboData, Data_GlUniformData__get_Name, Data_GlUniformData$reflection, Data_GlObjData$reflection, Data_GlUboData$reflection, BuilderTypes_GlUniformProp$reflection } from "./webgl_data.js";
import { length, cons, map, empty, sortBy, iterate, where, tryFind } from "../.fable/fable-library.3.0.0/List.js";
import { nextUboBufferIndex, getUbo, getObject, splitName, addUboUniform } from "./glcommon.js";
import { createFrom as createFrom_1 } from "./glubouniform.js";
import { curry, mapCurriedArgs, comparePrimitives, partialApply } from "../.fable/fable-library.3.0.0/Util.js";
import { GlCommon_uniformBlockBinding } from "../webgl_core/webgl_browser_types.js";
import { GlBuffer__Update, GlBuffer__Bind, GlBuffer__Delete, GlBuffer_$ctor_10C6D16C, GlBuffer__get_Data, GlBuffer__SetLength_Z524259A4, GlBuffer__Init_71B7C75E, GlBuffer__BindBase_Z524259A4 } from "./glbuffer.js";
import { uint8Array, emptyUint8Array, uint8ArrayFactory } from "../js/typedarray_utils.js";
import { GlProgram_getUboOrDefault, GlProgram_getUbo, GlProgram_emptyUboInfo } from "../webgl_core/program_utils.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";

class Builder extends Record {
    constructor(LinkTo, UniformCreators, Data) {
        super();
        this.LinkTo = LinkTo;
        this.UniformCreators = UniformCreators;
        this.Data = Data;
    }
}

function Builder$reflection() {
    return record_type("GlUbo.Builder", [], Builder, () => [["LinkTo", option_type(string_type)], ["UniformCreators", list_type(lambda_type(list_type(BuilderTypes_GlUniformProp$reflection()), lambda_type(Data_GlUboData$reflection(), lambda_type(Data_GlObjData$reflection(), Data_GlUniformData$reflection()))))], ["Data", Data_GlUboData$reflection()]]);
}

function addMissingUniforms(data) {
    const isMissingUniform = (info) => (tryFind((u) => (Data_GlUniformData__get_Name(u) === info.Name), data.Uniforms) == null);
    const addMissingUniform = (data_1, info_1) => {
        const value = addUboUniform((p, d, parentObject) => createFrom_1(info_1, p, d, parentObject), data_1);
        void value;
    };
    const list_2 = where(isMissingUniform, data.Info.Uniforms);
    iterate(partialApply(1, addMissingUniform, [data]), list_2);
    data.Uniforms = sortBy((u_1) => u_1.Info.Index, data.Uniforms, {
        Compare: comparePrimitives,
    });
    return data;
}

function applyCreators(builder) {
    const data = builder.Data;
    const createUniform = (creator) => creator(empty(), data, data.ParentObject);
    data.Uniforms = map(mapCurriedArgs(createUniform, [[0, 3]]), builder.UniformCreators);
    return data;
}

function addLinkedChild(parent, data) {
    parent.LinkedChildren = cons(data, parent.LinkedChildren);
    return data;
}

export function linkTo(parent, data) {
    return addLinkedChild(parent, new Data_GlUboData(data.Id, data.Info, data.IsDirty, data.Location, empty(), data.Buffer, data.Data, data.ParentObject, parent, data.LinkedChildren));
}

function processLink(builder) {
    const matchValue = builder.LinkTo;
    if (matchValue != null) {
        const name = matchValue;
        const data = builder.Data;
        const patternInput = splitName(name);
        const uboName = patternInput[1];
        const objectName = patternInput[0];
        const globj = getObject(objectName, data.ParentObject.Scene);
        const ubo = getUbo(uboName, globj);
        builder.Data = linkTo(ubo, data);
        return builder;
    }
    else {
        return builder;
    }
}

function build(builder) {
    const sortChildren = (data) => {
        data.Uniforms = sortBy((u) => u.Info.Index, data.Uniforms, {
            Compare: comparePrimitives,
        });
        return data;
    };
    return sortChildren(addMissingUniforms(applyCreators(processLink(builder))));
}

function bindToProgram(data) {
    const gl = data.ParentObject.Scene.Canvas.Context;
    const program = data.ParentObject.ProgramInfo.Program;
    GlCommon_uniformBlockBinding(gl, program, data.Info.BlockIndex, data.Location);
    return data;
}

function apply(props, builder) {
    const loop = (props_1_mut, b_mut) => {
        let inputRecord;
        loop:
        while (true) {
            const props_1 = props_1_mut, b = b_mut;
            const updateData = (data) => {
                b.Data = data;
                return b;
            };
            const addLink = (s) => {
                b.LinkTo = s;
                return b;
            };
            const addUniform = (creator) => {
                b.UniformCreators = cons(curry(3, creator), b.UniformCreators);
                return b;
            };
            if (props_1.tail != null) {
                const t = props_1.tail;
                const h = props_1.head;
                switch (h.tag) {
                    case 1: {
                        const x_1 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addUniform(x_1);
                        continue loop;
                    }
                    case 2: {
                        const x_2 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addLink(x_2);
                        continue loop;
                    }
                    default: {
                        const x = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord = b.Data, new Data_GlUboData(inputRecord.Id, inputRecord.Info, inputRecord.IsDirty, x, inputRecord.Uniforms, inputRecord.Buffer, inputRecord.Data, inputRecord.ParentObject, inputRecord.Link, inputRecord.LinkedChildren)));
                        continue loop;
                    }
                }
            }
            else {
                return b;
            }
            break;
        }
    };
    return loop(props, builder);
}

export function createFrom(info, props, parentObject) {
    const bindBufferBase = (data) => {
        GlBuffer__BindBase_Z524259A4(data.Buffer, data.Location);
        return data;
    };
    const initBuffer = (builder) => {
        if (builder.Data.Link == null) {
            const data_1 = builder.Data;
            const buffer = data_1.Buffer;
            GlBuffer__Init_71B7C75E(buffer, 35345, 35048, uint8ArrayFactory);
            GlBuffer__SetLength_Z524259A4(buffer, info.ByteSize);
            builder.Data = (new Data_GlUboData(data_1.Id, data_1.Info, data_1.IsDirty, data_1.Location, data_1.Uniforms, data_1.Buffer, GlBuffer__get_Data(buffer), data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
        }
        return builder;
    };
    return bindToProgram(build(initBuffer(apply(props, new Builder(void 0, empty(), new Data_GlUboData(0, info, true, nextUboBufferIndex(parentObject), empty(), GlBuffer_$ctor_10C6D16C(parentObject.Scene.Canvas.Context), emptyUint8Array, parentObject, void 0, empty()))))));
}

export function createEmpty(name, parentObject) {
    return new Data_GlUboData(0, GlProgram_emptyUboInfo(name), false, -1, empty(), GlBuffer_$ctor_10C6D16C(parentObject.Scene.Canvas.Context), uint8Array(0), parentObject, void 0, empty());
}

export function create(name, props, parentObject) {
    const matchValue = GlProgram_getUbo(name, parentObject.ProgramInfo);
    if (matchValue == null) {
        return createEmpty(name, parentObject);
    }
    else {
        const info = matchValue;
        return createFrom(info, props, parentObject);
    }
}

export function createLinked(data, parentObject) {
    return bindToProgram(addLinkedChild(data, new Data_GlUboData(data.Id, GlProgram_getUboOrDefault(Data_GlUboData__get_Name(data), parentObject.ProgramInfo), data.IsDirty, nextUboBufferIndex(parentObject), empty(), data.Buffer, uint8Array(0), parentObject, data, empty())));
}

export function delete$(data) {
    GlBuffer__Delete(data.Buffer);
}

export function clean(data) {
    data.IsDirty = false;
}

export function update(data) {
    if (data.Info.BlockIndex >= 0) {
        if (data.IsDirty) {
            clean(data);
            if (data.Link == null) {
                GlBuffer__Bind(data.Buffer);
                GlBuffer__Update(data.Buffer);
            }
        }
        if (length(data.LinkedChildren) === 0) {
            GlBuffer__BindBase_Z524259A4(data.Buffer, data.Location);
        }
    }
}

