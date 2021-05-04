import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { clipArray, clipObj, enumName } from "../core/utils.js";
import { GlDrawPrimitiveT, GlTextureTypeT, GlColorFormatT, GlIndicesTypeT, GlBufferUsageT, GlTypeT } from "../webgl_core/webgl_types.js";
import { Data_GlAttributeData__get_Name, Data_GlUboData__get_Name, Data_GlUniformData__get_Name } from "./webgl_data.js";
import { call, executeDefault } from "../core/optionex.js";
import { collect as collect_1, ofSeq, map as map_1, iterate, ofArray } from "../.fable/fable-library.3.0.0/List.js";
import { iterate as iterate_1, collect, map as map_2, empty, concat, singleton, append, delay } from "../.fable/fable-library.3.0.0/Seq.js";
import { equalsWith, map } from "../.fable/fable-library.3.0.0/Array.js";
import { GlBuffer__get_Data } from "./glbuffer.js";
import { toString } from "../.fable/fable-library.3.0.0/Types.js";
import { compareSafe, createObj } from "../.fable/fable-library.3.0.0/Util.js";
import { some } from "../.fable/fable-library.3.0.0/Option.js";
import { of1 } from "../core/seqex.js";

export function objFullName(data) {
    return toText(interpolate("%P().%P().%P()", [data.Scene.Canvas.Name, data.Scene.Name, data.Name]));
}

function getUniformInfoTreeDesc(info) {
    const offsetEnd = toText(interpolate(" .. %P()", [(info.Offset + info.ByteSize) - 1]));
    return (((info.Name + toText(interpolate(" - %P()", [enumName(GlTypeT, info.Type)]))) + (info.IsArray ? toText(interpolate("[%P()]", [info.Length])) : "")) + toText(interpolate(" [%P() .. %P()]", [info.StartIndex, (info.StartIndex + (info.ElementCount * info.Length)) - 1]))) + ((info.BlockIndex >= 0) ? toText(interpolate(" (%P()%P())(%P())", [info.Offset, offsetEnd, info.Length])) : "");
}

function getUniformTreeDesc(data) {
    const offsetEnd = (data.Data.length > 0) ? toText(interpolate(" .. %P()", [(data.Info.Offset + data.Data.byteLength) - 1])) : "";
    return (((((Data_GlUniformData__get_Name(data) + toText(interpolate(" - %P()", [enumName(GlTypeT, data.Info.Type)]))) + (data.Info.IsArray ? toText(interpolate("[%P()]", [data.Info.Length])) : "")) + executeDefault("", (u) => toText(interpolate(" Root: %P()", [Data_GlUniformData__get_Name(u)])), data.RootUniform)) + executeDefault(toText(interpolate(" (%P())", [data.Value.length])), (u_1) => toText(interpolate("", [])), data.RootUniform)) + toText(interpolate(" [%P() .. %P()]", [data.Info.StartIndex, (data.Info.StartIndex + (data.Info.ElementCount * data.Info.Length)) - 1]))) + ((data.Info.BlockIndex >= 0) ? toText(interpolate(" (%P()%P())(%P())", [data.Info.Offset, offsetEnd, data.Data.length])) : "");
}

export function logUniformData(data) {
    data.ChildUniforms.forEach((data_1) => {
        logUniformData(data_1);
    });
}

function getUniformDataEntries(data) {
    const hasParentUbo = data.ParentUbo != null;
    const hasRootUniform = data.RootUniform != null;
    const isChild = hasRootUniform;
    return delay(() => append(singleton(ofArray([["Ubo", hasParentUbo ? Data_GlUboData__get_Name(data.ParentUbo) : null], ["Name", isChild ? null : Data_GlUniformData__get_Name(data)], ["ChildName", isChild ? Data_GlUniformData__get_Name(data) : null], ["Location", data.Info.Location], ["ByteSize", data.Info.ByteSize], ["Offset", data.Info.Offset], ["Index", data.Info.Index], ["Type", enumName(GlTypeT, data.Info.Type)], ["IsArray", data.Info.IsArray], ["Length", data.Info.Length], ["Data", data.Data], ["Value", data.Value]])), delay(() => ((data.ChildUniforms.length > 0) ? concat(map(getUniformDataEntries, data.ChildUniforms)) : empty()))));
}

function getUboInfoTreeDesc(info) {
    return toText(interpolate("UBO %P() (%P()) %P() bytes", [info.Name, info.BlockIndex, info.ByteSize]));
}

function getUboTreeDesc(data) {
    return toText(interpolate("UBO %P() (%P()) %P() bytes", [Data_GlUboData__get_Name(data), data.Info.BlockIndex, data.Info.ByteSize]));
}

export function logUboData(data) {
    iterate((data_1) => {
        logUniformData(data_1);
    }, data.Uniforms);
}

function getUboDataEntry(data) {
    return delay(() => append(singleton(ofArray([["Ubo", Data_GlUboData__get_Name(data)], ["Name", null], ["ChildName", null], ["Location", data.Location], ["ByteSize", data.Info.ByteSize], ["Data", data.Data], ["Value", null]])), delay(() => concat(map_1(getUniformDataEntries, data.Uniforms)))));
}

export function logSingleAttributeData(data) {
}

function getSingleAttributeDataEntry(data) {
    return ofArray([["Name", Data_GlAttributeData__get_Name(data)], ["ChildName", null], ["Location", data.Info.Location], ["DataCount", data.DataCount], ["Stride", data.Stride], ["Offset", data.Offset], ["StartIndex", data.StartIndex], ["Divisor", data.Divisor], ["Type", enumName(GlTypeT, data.Info.Type)], ["RecordSize", data.RecordSize], ["ByteSize", data.ByteSize], ["DeterminesInstanceCount", data.DeterminesInstanceCount]]);
}

export function logIndexAttributeData(data) {
}

function getIndexAttributeDataEntry(data) {
    return ofArray([["Name", data.Name], ["DataCount", data.DataCount], ["Type", enumName(GlIndicesTypeT, data.IndicesType)], ["Offset", data.Offset]]);
}

export function logInterleaveAttributeData(data) {
}

function getInterleaveAttributeDataEntry(data) {
    return ofArray([["Name", Data_GlAttributeData__get_Name(data)], ["ChildName", null], ["Kind", toString(data.Kind)], ["Location", data.Info.Location], ["DataCount", data.DataCount], ["Stride", data.Stride], ["Offset", data.Offset], ["StartIndex", data.StartIndex], ["Divisor", data.Divisor], ["SingleCopy", data.CanSingleCopy], ["Type", enumName(GlTypeT, data.Info.Type)], ["RecordSize", data.RecordSize], ["ByteSize", data.ByteSize], ["DeterminesInstanceCount", data.DeterminesInstanceCount]]);
}

export function logInterleaveChilAttributeData(data) {
}

function getInterleaveChilAttributeDataEntry(data) {
    return ofArray([["Name", ""], ["Kind", toString(data.Kind)], ["ChildName", Data_GlAttributeData__get_Name(data)], ["Location", data.Info.Location], ["DataCount", data.DataCount], ["Stride", data.Stride], ["Offset", data.Offset], ["StartIndex", data.StartIndex], ["Divisor", data.Divisor], ["Type", enumName(GlTypeT, data.Info.Type)], ["RecordSize", data.RecordSize]]);
}

export function logRootAttribute(attrib) {
    if (attrib.tag === 1) {
        const data_1 = attrib.fields[0];
        logInterleaveAttributeData(data_1);
        iterate((data_2) => {
            logInterleaveChilAttributeData(data_2);
        }, data_1.ChildAttributes);
    }
    else {
        const data = attrib.fields[0];
        logSingleAttributeData(data);
    }
}

function getRootAttributeEntries(attrib) {
    return ofSeq(delay(() => {
        if (attrib.tag === 1) {
            const data_1 = attrib.fields[0];
            return append(singleton(getInterleaveAttributeDataEntry(data_1)), delay(() => {
                const childEntries = map_1(getInterleaveChilAttributeDataEntry, data_1.ChildAttributes);
                return childEntries;
            }));
        }
        else {
            const data = attrib.fields[0];
            return singleton(getSingleAttributeDataEntry(data));
        }
    }));
}

function getTexturePixels(data) {
    const matchValue = data.Pixels;
    switch (matchValue.tag) {
        case 1: {
            const x_1 = matchValue.fields[0];
            return x_1;
        }
        case 2: {
            const x_2 = matchValue.fields[0];
            return x_2;
        }
        case 3: {
            const x_3 = matchValue.fields[0];
            return x_3;
        }
        case 4: {
            const x_4 = matchValue.fields[0];
            return x_4;
        }
        case 5: {
            const x_5 = matchValue.fields[0];
            return x_5;
        }
        default: {
            const x = matchValue.fields[0];
            return x;
        }
    }
}

export function logTextureData(data) {
}

function getTextureDataEntries(data) {
    return delay(() => singleton(ofArray([["Name", data.Name], ["Location", data.Index], ["Level", data.Level], ["Internal", enumName(GlColorFormatT, data.InternalFormat)], ["Format", enumName(GlColorFormatT, data.Format)], ["Width", data.Width], ["Height", data.Height], ["Type", enumName(GlTextureTypeT, data.DataType)], ["Pixels", getTexturePixels(data)], ["Offset", data.Offset]])));
}

function toJsObjPair(key, value) {
    return [key, value];
}

function entryToJsObject(entry) {
    return createObj(map_2((tupledArg) => toJsObjPair(tupledArg[0], tupledArg[1]), entry));
}

function entriesToJsObjects(entries) {
    return Array.from(map_2(entryToJsObject, entries));
}

function consoleTable(o) {
    console.table(some(o));
}

export function logUniforms(uniforms) {
    iterate((data) => {
        logUniformData(data);
    }, uniforms);
}

export function logUbos(ubos) {
    iterate((data) => {
        logUboData(data);
    }, ubos);
}

export function logAttributes(attributes) {
    iterate((attrib) => {
        logRootAttribute(attrib);
    }, attributes);
}

export function logIndices(indices) {
    logIndexAttributeData(indices);
}

export function logTextures(textures) {
    iterate((data) => {
        logTextureData(data);
    }, textures);
}

export function tableUniforms(uniforms) {
    consoleTable(entriesToJsObjects(collect(getUniformDataEntries, uniforms)));
}

export function tableUbos(ubos) {
    consoleTable(entriesToJsObjects(collect(getUboDataEntry, ubos)));
}

export function tableUbosAndUniforms(ubos, uniforms) {
    consoleTable(entriesToJsObjects(delay(() => append(concat(map_1(getUboDataEntry, ubos)), delay(() => concat(map_1(getUniformDataEntries, uniforms)))))));
}

export function tableAttributes(attributes) {
    consoleTable(entriesToJsObjects(collect_1(getRootAttributeEntries, attributes)));
}

export function tableIndices(indices) {
    consoleTable(entriesToJsObjects(collect((arg) => of1(getIndexAttributeDataEntry(arg)), indices)));
}

export function tableAttributesAndIndices(attributes, indices) {
    consoleTable(entriesToJsObjects(delay(() => append(concat(map_1(getRootAttributeEntries, attributes)), delay(() => collect((arg) => of1(getIndexAttributeDataEntry(arg)), indices))))));
}

export function tableTextures(textures) {
    consoleTable(entriesToJsObjects(collect(getTextureDataEntries, textures)));
}

export function logUniformInfoTree(info) {
    const loop = (info_1) => {
        const arg00$0040 = getUniformInfoTreeDesc(info_1);
        const matchValue = info_1.Children;
        if ((!equalsWith(compareSafe, matchValue, null)) ? (matchValue.length === 0) : false) {
        }
        else {
            const children = matchValue;
            children.forEach(loop);
        }
    };
    loop(info);
}

export function logUboInfoTree(info) {
    const arg00$0040 = getUboInfoTreeDesc(info);
    iterate((info_1) => {
        logUniformInfoTree(info_1);
    }, info.Uniforms);
}

export function logUniformTree(data) {
    const loop = (data_1) => {
        const arg00$0040 = getUniformTreeDesc(data_1);
        const matchValue = data_1.ChildUniforms;
        if ((!equalsWith(compareSafe, matchValue, null)) ? (matchValue.length === 0) : false) {
        }
        else {
            const children = matchValue;
            children.forEach(loop);
        }
    };
    loop(data);
}

export function logUboTree(data) {
    const arg00$0040 = getUboTreeDesc(data);
    iterate((data_1) => {
        logUniformTree(data_1);
    }, data.Uniforms);
}

export function logUniformInfosTree(uniforms) {
    iterate_1((info) => {
        logUniformInfoTree(info);
    }, uniforms);
}

export function logUboInfosTree(ubos) {
    iterate_1((info) => {
        logUboInfoTree(info);
    }, ubos);
}

export function logUniformsTree(uniforms) {
    iterate_1((data) => {
        logUniformTree(data);
    }, uniforms);
}

export function logUbosTree(ubos) {
    iterate_1((data) => {
        logUboTree(data);
    }, ubos);
}

export function logObjDef(data) {
    logUniforms(data.Uniforms);
    logUbos(data.Ubos);
    logAttributes(data.Attributes);
    call((indices) => {
        logIndices(indices);
    }, data.Indices);
    logTextures(data.Textures);
}

export function tableObjDef(data) {
    console.group(toText(interpolate("%P() Info", [objFullName(data)])));
    consoleTable(entriesToJsObjects([ofArray([["Method", toString(data.DrawMethod)], ["Primitive", enumName(GlDrawPrimitiveT, data.DrawPrimitive)], ["Verticies", data.VertexCount], ["VertexStart", data.VertexOffset], ["VerticiesOffset", data.VertexCountOffset], ["Instances", data.InstanceCount], ["InstanceStart", data.InstanceOffset], ["InstancesOffset", data.InstanceCountOffset], ["IndicesOffset", data.IndicesOffset]])]));
    console.log(some("groupEnd"));
    console.groupEnd();
}

export function tableObjDefAndContents(data) {
    tableObjDef(data);
    console.group(toText(interpolate("%P() Info", [objFullName(data)])));
    let indices;
    const opt = data.Indices;
    indices = executeDefault(empty(), of1, opt);
    tableUbosAndUniforms(data.Ubos, data.Uniforms);
    tableAttributesAndIndices(data.Attributes, indices);
    tableTextures(data.Textures);
    console.log(some("groupEnd"));
    console.groupEnd();
}

