import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { record_type, lambda_type, list_type, option_type, string_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { BuilderTypes_GlUniformProp, Data_GlRootAttribute, Data_GlAttributeData__get_Name, Data_GlUniformData__get_Name, Data_GlUboData__get_Name, Data_GlObjData, Data_GlTextureData$reflection, BuilderTypes_GlTextureProp$reflection, Data_GlIndicesData$reflection, BuilderTypes_GlIndicesProp$reflection, Data_GlRootAttribute$reflection, BuilderTypes_GlAttrProp$reflection, Data_GlUniformData$reflection, BuilderTypes_GlUniformProp$reflection, Data_GlUboData$reflection, Data_GlObjData$reflection, BuilderTypes_GlUboProp$reflection } from "./webgl_data.js";
import { objectRecalcNeeded, getCamera, getObject, getAttributeData, objectDebugName, allAttributes, addTexture as addTexture_2, addAttribute as addAttribute_2, addUniform as addUniform_2, addUbo as addUbo_2, tryGetTexture as tryGetTexture_1, getTexture as getTexture_1, tryGetAttribute as tryGetAttribute_1, getAttribute as getAttribute_1, tryGetUniform as tryGetUniform_1, getUniform as getUniform_1, tryGetUbo as tryGetUbo_1, getUbo as getUbo_1, dirtyParallax as dirtyParallax_1, dirtyModel as dirtyModel_1, dirtyObject } from "./glcommon.js";
import { Vec3__WithXYZ_Z6FDE0AF9, Vec3_op_UnaryNegation_Z3D47FC51, Vec3_op_Multiply_Z18D588CE, Vec3_op_AdditionAssignment_Z24FF85E0, Vec3_op_Subtraction_Z24FF85E0, Vec3_op_Addition_Z24FF85E0, Vec3__Clone, Vec3_Create, Vec3_Create_8ED0A5D } from "../core/vectors.js";
import { RAD_PER_DEG } from "../core/utils.js";
import { GlProgram_deleteProgramInfo, GlProgram_createProgramInfo, GlProgram_emptyProgramInfo } from "../webgl_core/program_utils.js";
import { GlDrawMethod } from "../webgl_core/webgl_types.js";
import { sumBy, append as append_1, sortBy, reverse, map as map_1, iterate as iterate_1, singleton, ofSeq, cons, length, empty } from "../.fable/fable-library.3.0.0/List.js";
import { Mat4__RotateZM_6069AC9A, Mat4__TranslateM_8ED0A5D, Mat4__SetToIdentity, Mat4__ScaleM_8ED0A5D, Mat4__get_Values, Mat4__Set_Z33A93963, Mat4_Create } from "../core/matricies.js";
import { execute, call, executeDefault } from "../core/optionex.js";
import { exists, filter, map, append, choose, where, iterate } from "../.fable/fable-library.3.0.0/Seq.js";
import { GlBuffer__Clean_Z1FBCCD16 } from "./glbuffer.js";
import { isNullOrWhiteSpace, interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { update as update_3, delete$ as delete$_2, createFrom, createLinked } from "./glubo.js";
import { equals, uncurry, equalsSafe, comparePrimitives, curry, mapCurriedArgs, partialApply } from "../.fable/fable-library.3.0.0/Util.js";
import { update as update_4, setValue, createFrom as createFrom_1, createLinked as createLinked_1 } from "./gluniform.js";
import { createLinked as createLinked_2 } from "./glattribcommonn.js";
import { fill } from "../.fable/fable-library.3.0.0/Array.js";
import { update as update_2, createFrom as createFrom_2 } from "./glsingleattribute.js";
import { defaultCapabilities } from "./glcapabilities.js";
import { delete$ as delete$_1 } from "./glattrib.js";
import { update as update_5, delete$ as delete$_3 } from "./glindicies.js";
import { update as update_1 } from "./glinterleaveattribute.js";
import { GlCommon_drawArraysInstanced, GlCommon_drawElements, GlCommon_drawArrays, GlCommon_bindVertexArray, GlCommon_useProgram } from "../webgl_core/webgl_browser_types.js";
import { update as update_6 } from "./gltexture.js";
import { some } from "../.fable/fable-library.3.0.0/Option.js";

class Builder extends Record {
    constructor(Name, ParallaxCamera, LinkTo, UboCreators, UniformCreators, AttributeCreators, IndicesCreator, TextureCreators, Data) {
        super();
        this.Name = Name;
        this.ParallaxCamera = ParallaxCamera;
        this.LinkTo = LinkTo;
        this.UboCreators = UboCreators;
        this.UniformCreators = UniformCreators;
        this.AttributeCreators = AttributeCreators;
        this.IndicesCreator = IndicesCreator;
        this.TextureCreators = TextureCreators;
        this.Data = Data;
    }
}

function Builder$reflection() {
    return record_type("GlObj.Builder", [], Builder, () => [["Name", string_type], ["ParallaxCamera", option_type(string_type)], ["LinkTo", option_type(string_type)], ["UboCreators", list_type(lambda_type(list_type(BuilderTypes_GlUboProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlUboData$reflection())))], ["UniformCreators", list_type(lambda_type(list_type(BuilderTypes_GlUniformProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlUniformData$reflection())))], ["AttributeCreators", list_type(lambda_type(list_type(BuilderTypes_GlAttrProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlRootAttribute$reflection())))], ["IndicesCreator", option_type(lambda_type(list_type(BuilderTypes_GlIndicesProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlIndicesData$reflection())))], ["TextureCreators", list_type(lambda_type(list_type(BuilderTypes_GlTextureProp$reflection()), lambda_type(Data_GlObjData$reflection(), Data_GlTextureData$reflection())))], ["Data", Data_GlObjData$reflection()]]);
}

export const dirty = (data) => {
    dirtyObject(data);
};

export const dirtyModel = (data) => {
    dirtyModel_1(data);
};

export const dirtyParallax = (data) => {
    dirtyParallax_1(data);
};

export function degreesToRadians(angle) {
    return Vec3_Create_8ED0A5D((angle.values[0] * 1) * RAD_PER_DEG, (angle.values[1] * 1) * RAD_PER_DEG, (angle.values[2] * 1) * RAD_PER_DEG);
}

export function emptyObject(scene) {
    return new Data_GlObjData(0, "", GlProgram_emptyProgramInfo(scene.Canvas.Context), true, scene, new GlDrawMethod(4), 4, -1, 0, 0, 0, 0, 0, 0, empty(), empty(), empty(), empty(), void 0, empty(), empty(), empty(), null, false, -1, void 0, 1, Vec3_Create(), Vec3_Create(), Vec3_Create(), Vec3_Create(), 1, Mat4_Create(), void 0, void 0, void 0, empty(), true, true, true, true, true, true);
}

export const getUbo = (name) => ((data) => getUbo_1(name, data));

export const tryGetUbo = (name) => ((data) => tryGetUbo_1(name, data));

export const getUniform = (name) => ((data) => getUniform_1(name, data));

export const tryGetUniform = (name) => ((data) => tryGetUniform_1(name, data));

export const getAttribute = (name) => ((data) => getAttribute_1(name, data));

export const tryGetAttribute = (name) => ((data) => tryGetAttribute_1(name, data));

export const getTexture = (name) => ((data) => getTexture_1(name, data));

export const tryGetTexture = (name) => ((data) => tryGetTexture_1(name, data));

export const addUbo = (creator) => ((data) => addUbo_2(creator, data));

export const addUniform = (creator) => ((data) => addUniform_2(creator, data));

export const addAttribute = (creator) => ((data) => addAttribute_2(creator, data));

export const addTexture = (creator) => ((data) => addTexture_2(creator, data));

function tryGetParentUbo(name, data) {
    const matchValue = executeDefault(void 0, tryGetUbo(name), data.Parent);
    if (matchValue == null) {
        return executeDefault(void 0, (data_1) => tryGetParentUbo(name, data_1), data.Parent);
    }
    else {
        const result = matchValue;
        return result;
    }
}

function tryGetParentUniform(name, data) {
    const matchValue = executeDefault(void 0, tryGetUniform(name), data.Parent);
    if (matchValue == null) {
        return executeDefault(void 0, (data_1) => tryGetParentUniform(name, data_1), data.Parent);
    }
    else {
        const result = matchValue;
        return result;
    }
}

function getParentAttribute(name, data) {
    const matchValue = executeDefault(void 0, tryGetAttribute(name), data.Parent);
    if (matchValue == null) {
        return executeDefault(void 0, (data_1) => getParentAttribute(name, data_1), data.Parent);
    }
    else {
        const result = matchValue;
        return result;
    }
}

export function _cleanLinkedBuffers(data) {
    iterate((a_1) => {
        GlBuffer__Clean_Z1FBCCD16(a_1.Buffer, true);
    }, where((a) => (length(a.LinkedChildren) > 0), allAttributes(data)));
    const matchValue = data.Indices;
    if (matchValue == null) {
    }
    else {
        const a_2 = matchValue;
        if (length(a_2.LinkedChildren) > 0) {
            GlBuffer__Clean_Z1FBCCD16(a_2.Buffer, true);
        }
    }
}

function addLinkedUbos(data) {
    const addLinkedUbo = (data_1, parent) => {
        data_1.Ubos = cons(createLinked(parent, data_1), data_1.Ubos);
    };
    const source_2 = choose((info_1) => tryGetParentUbo(info_1.Name, data), where((info) => (tryGetUbo(info.Name)(data) == null), data.ProgramInfo.Ubos));
    iterate(partialApply(1, addLinkedUbo, [data]), source_2);
    return data;
}

function addLinkedUniforms(data) {
    let source_2;
    const createLinkedUniform = (data_1, parent) => {
        return createLinked_1(parent, data_1);
    };
    const assignUniforms = (uniforms) => {
        data.Uniforms = uniforms;
        return data;
    };
    return assignUniforms(ofSeq(append(data.Uniforms, (source_2 = choose((info_1) => tryGetParentUniform(info_1.Name, data), where((info) => (tryGetUniform(info.Name)(data) == null), data.ProgramInfo.Uniforms)), map(partialApply(1, createLinkedUniform, [data]), source_2)))));
}

function addLinkedAttributes(data) {
    let source_2;
    const createLinkedAttribute = (data_1, parent) => {
        if (parent.Kind.tag === 0) {
            return new Data_GlRootAttribute(0, createLinked_2(parent, data_1));
        }
        else {
            return new Data_GlRootAttribute(1, createLinked_2(parent, data_1));
        }
    };
    const assignAttributes = (attributes) => {
        data.Attributes = attributes;
        return data;
    };
    return assignAttributes(ofSeq(append(data.Attributes, (source_2 = choose((info_1) => getParentAttribute(info_1.Name, data), where((info) => (tryGetAttribute(info.Name)(data) == null), data.ProgramInfo.Attributes)), map(partialApply(1, createLinkedAttribute, [data]), source_2)))));
}

function addLinkedObjects(data) {
    if (data.Parent != null) {
        return addLinkedAttributes(addLinkedUniforms(addLinkedUbos(data)));
    }
    else {
        return data;
    }
}

function addDynamicUbos(data) {
    const addDynamicUbo = (data_1, info) => {
        data_1.Ubos = cons(createFrom(info, empty(), data_1), data_1.Ubos);
    };
    const source_1 = where((info_1) => (tryGetUbo(info_1.Name)(data) == null), data.ProgramInfo.Ubos);
    iterate(partialApply(1, addDynamicUbo, [data]), source_1);
    return data;
}

function getDefaultValue(info) {
    const count = (info.ElementCount * info.Length) | 0;
    const matchValue = info.Type | 0;
    switch (matchValue) {
        case 0: {
            throw (new Error("Uniform type not initialized"));
        }
        case 5120:
        case 5121:
        case 5122:
        case 5123:
        case 5125:
        case 36294:
        case 36295:
        case 36296: {
            return new Uint32Array(count);
        }
        case 5124:
        case 35667:
        case 35668:
        case 35669:
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
            return new Int32Array(count);
        }
        case 5126:
        case 5131:
        case 35664:
        case 35665:
        case 35666:
        case 35674:
        case 35675:
        case 35676:
        case 35685:
        case 35686:
        case 35687:
        case 35688:
        case 35689:
        case 35690: {
            return new Float64Array(count);
        }
        case 35670:
        case 35671:
        case 35672:
        case 35673: {
            return fill(new Array(count), 0, count, false);
        }
        default: {
            throw (new Error("Uniform type not initialized"));
        }
    }
}

function addDynamicUniforms(data) {
    let source_1;
    const createDynamicUniform = (data_1, info) => createFrom_1(info, singleton(new BuilderTypes_GlUniformProp(0, getDefaultValue(info))), data_1);
    const assignUniforms = (uniforms) => {
        data.Uniforms = uniforms;
        return data;
    };
    return assignUniforms(ofSeq(append(data.Uniforms, (source_1 = where((info_1) => (tryGetUniform(info_1.Name)(data) == null), data.ProgramInfo.Uniforms), map(partialApply(1, createDynamicUniform, [data]), source_1)))));
}

function addDynamicAttributes(data) {
    let source_1;
    const createDynamicAttribute = (data_1, info) => {
        return createFrom_2(info, empty(), data_1);
    };
    const assignAttributes = (attributes) => {
        data.Attributes = attributes;
        return data;
    };
    return assignAttributes(ofSeq(append(data.Attributes, (source_1 = where((info_1) => (tryGetAttribute(info_1.Name)(data) == null), data.ProgramInfo.Attributes), map(partialApply(1, createDynamicAttribute, [data]), source_1)))));
}

function addDynamicObjects(data) {
    return addDynamicAttributes(addDynamicUniforms(addDynamicUbos(data)));
}

function calcVertexCountAttributes(data) {
    const result = ofSeq(filter((a) => a.DeterminesVertexCount, allAttributes(data)));
    if (result.tail == null) {
        const matchValue = data.Attributes;
        if (matchValue.tail != null) {
            const first = matchValue.head;
            const a_1 = getAttributeData(first);
            return singleton(a_1);
        }
        else {
            return empty();
        }
    }
    else {
        const a_2 = result;
        return a_2;
    }
}

function calcInstanceCountAttributes(data) {
    return ofSeq(filter((a) => a.DeterminesInstanceCount, allAttributes(data)));
}

function linkTo(parent, data) {
    const data_1 = new Data_GlObjData(data.Id, data.Name, data.ProgramInfo, data.IsDirty, data.Scene, data.DrawMethod, data.DrawPrimitive, data.VertexCount, data.VertexOffset, data.VertexCountOffset, data.InstanceCount, data.InstanceOffset, data.InstanceCountOffset, data.IndicesOffset, data.Capabilities, data.Uniforms, data.Ubos, data.Attributes, data.Indices, data.Textures, data.VertexCountAttributes, data.InstanceCountAttributes, data.Vao, data.ProcessLinked, data.Layer, data.ParallaxCamera, data.ParallaxDistance, data.ParallaxOffset, data.ParallaxLastPosition, data.Angle, data.Position, data.Scale, data.ModelMatrix, data.ParallaxMatrix, data.Parent, parent, data.LinkedChildren, data.IsModelDirty, data.IsParallaxDirty, data.RecalcNeeded, data.CalcDrawMethod, data.CalcVertexCount, data.CalcInstanceCount);
    parent.LinkedChildren = cons(data_1, parent.LinkedChildren);
    return data_1;
}

function processLink(builder) {
    const matchValue = builder.LinkTo;
    if (matchValue != null) {
        const objectName = matchValue;
        if (!isNullOrWhiteSpace(objectName)) {
            const data = builder.Data;
            const globj = getObject(objectName, data.Scene);
            builder.Data = linkTo(globj, data);
        }
        return builder;
    }
    else {
        return builder;
    }
}

function applyCreators(builder) {
    const data = builder.Data;
    const createUniform = (creator) => creator(empty(), data);
    const createAttribute = (creator_1) => creator_1(empty(), data);
    const createIndices = (creator_2) => creator_2(empty(), data);
    const createTexture = (creator_3) => creator_3(empty(), data);
    const addUbo_1 = (c) => {
        const value = addUbo_2(c, data);
        void value;
    };
    iterate_1(mapCurriedArgs(addUbo_1, [[0, 2]]), builder.UboCreators);
    data.Uniforms = map_1(mapCurriedArgs(createUniform, [[0, 2]]), builder.UniformCreators);
    data.Attributes = map_1(mapCurriedArgs(createAttribute, [[0, 2]]), builder.AttributeCreators);
    call(mapCurriedArgs((c_1) => {
        data.Indices = createIndices(c_1);
    }, [[0, 2]]), curry(2, builder.IndicesCreator));
    data.Textures = map_1(mapCurriedArgs(createTexture, [[0, 2]]), reverse(builder.TextureCreators));
    data.VertexCountAttributes = calcVertexCountAttributes(data);
    data.InstanceCountAttributes = calcInstanceCountAttributes(data);
    return data;
}

function build(builder) {
    const sortChildren = (data) => {
        const getAttribIndex = (att) => {
            let pattern_matching_result, a;
            if (att.tag === 1) {
                pattern_matching_result = 0;
                a = att.fields[0];
            }
            else {
                pattern_matching_result = 0;
                a = att.fields[0];
            }
            switch (pattern_matching_result) {
                case 0: {
                    return a.Info.Index | 0;
                }
            }
        };
        data.Uniforms = sortBy((u) => u.Info.Index, data.Uniforms, {
            Compare: comparePrimitives,
        });
        data.Ubos = sortBy((u_1) => u_1.Info.BlockIndex, data.Ubos, {
            Compare: comparePrimitives,
        });
        data.Attributes = sortBy(getAttribIndex, data.Attributes, {
            Compare: comparePrimitives,
        });
        data.Id = 5;
        return data;
    };
    const applyCalculations = (builder_1) => {
        let name;
        const data_1 = builder_1.Data;
        let parallaxCamera;
        const matchValue = builder_1.ParallaxCamera;
        if (matchValue != null) {
            if (name = matchValue, isNullOrWhiteSpace(name)) {
                const name_1 = matchValue;
                parallaxCamera = (void 0);
            }
            else if (matchValue != null) {
                const name_2 = matchValue;
                parallaxCamera = getCamera(name_2, data_1.Scene);
            }
            else {
                throw (new Error("The match cases were incomplete"));
            }
        }
        else {
            parallaxCamera = (void 0);
        }
        let parallaxPosition;
        if (parallaxCamera != null) {
            const cam = parallaxCamera;
            parallaxPosition = Vec3__Clone(cam.Position);
        }
        else {
            parallaxPosition = data_1.ParallaxLastPosition;
        }
        const parallaxMatrix = execute((_arg1) => Mat4_Create(), parallaxCamera);
        const layer = (((data_1.Layer >= 0) ? (data_1.Layer < data_1.Scene.Layers.length) : false) ? data_1.Layer : data_1.Scene.DefaultLayer) | 0;
        builder_1.Data = (new Data_GlObjData(data_1.Id, builder_1.Name, data_1.ProgramInfo, data_1.IsDirty, data_1.Scene, data_1.DrawMethod, data_1.DrawPrimitive, data_1.VertexCount, data_1.VertexOffset, data_1.VertexCountOffset, data_1.InstanceCount, data_1.InstanceOffset, data_1.InstanceCountOffset, data_1.IndicesOffset, append_1(defaultCapabilities(), data_1.Capabilities), data_1.Uniforms, data_1.Ubos, data_1.Attributes, data_1.Indices, data_1.Textures, data_1.VertexCountAttributes, data_1.InstanceCountAttributes, data_1.Vao, data_1.ProcessLinked, layer, parallaxCamera, data_1.ParallaxDistance, data_1.ParallaxOffset, parallaxPosition, data_1.Angle, data_1.Position, data_1.Scale, data_1.ModelMatrix, parallaxMatrix, data_1.Parent, data_1.Link, data_1.LinkedChildren, data_1.IsModelDirty, data_1.IsParallaxDirty, data_1.RecalcNeeded, equalsSafe(builder_1.Data.DrawMethod, new GlDrawMethod(4)), builder_1.Data.VertexCount < 0, builder_1.Data.InstanceCount <= 0));
        return builder_1;
    };
    return sortChildren(addDynamicObjects(addLinkedObjects(applyCreators(processLink(applyCalculations(builder))))));
}

function apply(props, builder) {
    const loop = (props_1_mut, b_mut) => {
        let inputRecord, inputRecord_1, inputRecord_2, inputRecord_3, inputRecord_4, inputRecord_5, inputRecord_6, inputRecord_7, inputRecord_8, inputRecord_9, inputRecord_10, inputRecord_11, inputRecord_12, inputRecord_13, inputRecord_14, inputRecord_15, _, inputRecord_16, __1, value_2, inputRecord_17, inputRecord_18;
        loop:
        while (true) {
            const props_1 = props_1_mut, b = b_mut;
            const updateName = (name) => {
                if (b.Name !== "global") {
                    b.Name = name;
                }
                return b;
            };
            const updateData = (data) => {
                b.Data = data;
                return b;
            };
            const addParallaxCam = (c) => {
                b.ParallaxCamera = c;
                return b;
            };
            const addLink = (s) => {
                b.LinkTo = s;
                return b;
            };
            const addUniform_1 = (creator) => {
                b.UniformCreators = cons(curry(2, creator), b.UniformCreators);
                return b;
            };
            const addUbo_1 = (creator_1) => {
                b.UboCreators = cons(curry(2, creator_1), b.UboCreators);
                return b;
            };
            const addAttribute_1 = (creator_2) => {
                b.AttributeCreators = cons(curry(2, creator_2), b.AttributeCreators);
                return b;
            };
            const addIndices = (creator_3) => {
                b.IndicesCreator = creator_3;
                return b;
            };
            const addTexture_1 = (creator_4) => {
                b.TextureCreators = cons(curry(2, creator_4), b.TextureCreators);
                return b;
            };
            if (props_1.tail != null) {
                const t = props_1.tail;
                const h = props_1.head;
                switch (h.tag) {
                    case 1: {
                        const x_1 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord = b.Data, new Data_GlObjData(inputRecord.Id, inputRecord.Name, inputRecord.ProgramInfo, inputRecord.IsDirty, inputRecord.Scene, x_1, inputRecord.DrawPrimitive, inputRecord.VertexCount, inputRecord.VertexOffset, inputRecord.VertexCountOffset, inputRecord.InstanceCount, inputRecord.InstanceOffset, inputRecord.InstanceCountOffset, inputRecord.IndicesOffset, inputRecord.Capabilities, inputRecord.Uniforms, inputRecord.Ubos, inputRecord.Attributes, inputRecord.Indices, inputRecord.Textures, inputRecord.VertexCountAttributes, inputRecord.InstanceCountAttributes, inputRecord.Vao, inputRecord.ProcessLinked, inputRecord.Layer, inputRecord.ParallaxCamera, inputRecord.ParallaxDistance, inputRecord.ParallaxOffset, inputRecord.ParallaxLastPosition, inputRecord.Angle, inputRecord.Position, inputRecord.Scale, inputRecord.ModelMatrix, inputRecord.ParallaxMatrix, inputRecord.Parent, inputRecord.Link, inputRecord.LinkedChildren, inputRecord.IsModelDirty, inputRecord.IsParallaxDirty, inputRecord.RecalcNeeded, inputRecord.CalcDrawMethod, inputRecord.CalcVertexCount, inputRecord.CalcInstanceCount)));
                        continue loop;
                    }
                    case 2: {
                        const x_2 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_1 = b.Data, new Data_GlObjData(inputRecord_1.Id, inputRecord_1.Name, inputRecord_1.ProgramInfo, inputRecord_1.IsDirty, inputRecord_1.Scene, inputRecord_1.DrawMethod, x_2, inputRecord_1.VertexCount, inputRecord_1.VertexOffset, inputRecord_1.VertexCountOffset, inputRecord_1.InstanceCount, inputRecord_1.InstanceOffset, inputRecord_1.InstanceCountOffset, inputRecord_1.IndicesOffset, inputRecord_1.Capabilities, inputRecord_1.Uniforms, inputRecord_1.Ubos, inputRecord_1.Attributes, inputRecord_1.Indices, inputRecord_1.Textures, inputRecord_1.VertexCountAttributes, inputRecord_1.InstanceCountAttributes, inputRecord_1.Vao, inputRecord_1.ProcessLinked, inputRecord_1.Layer, inputRecord_1.ParallaxCamera, inputRecord_1.ParallaxDistance, inputRecord_1.ParallaxOffset, inputRecord_1.ParallaxLastPosition, inputRecord_1.Angle, inputRecord_1.Position, inputRecord_1.Scale, inputRecord_1.ModelMatrix, inputRecord_1.ParallaxMatrix, inputRecord_1.Parent, inputRecord_1.Link, inputRecord_1.LinkedChildren, inputRecord_1.IsModelDirty, inputRecord_1.IsParallaxDirty, inputRecord_1.RecalcNeeded, inputRecord_1.CalcDrawMethod, inputRecord_1.CalcVertexCount, inputRecord_1.CalcInstanceCount)));
                        continue loop;
                    }
                    case 3: {
                        const x_3 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_2 = b.Data, new Data_GlObjData(inputRecord_2.Id, inputRecord_2.Name, inputRecord_2.ProgramInfo, inputRecord_2.IsDirty, inputRecord_2.Scene, inputRecord_2.DrawMethod, inputRecord_2.DrawPrimitive, x_3, inputRecord_2.VertexOffset, inputRecord_2.VertexCountOffset, inputRecord_2.InstanceCount, inputRecord_2.InstanceOffset, inputRecord_2.InstanceCountOffset, inputRecord_2.IndicesOffset, inputRecord_2.Capabilities, inputRecord_2.Uniforms, inputRecord_2.Ubos, inputRecord_2.Attributes, inputRecord_2.Indices, inputRecord_2.Textures, inputRecord_2.VertexCountAttributes, inputRecord_2.InstanceCountAttributes, inputRecord_2.Vao, inputRecord_2.ProcessLinked, inputRecord_2.Layer, inputRecord_2.ParallaxCamera, inputRecord_2.ParallaxDistance, inputRecord_2.ParallaxOffset, inputRecord_2.ParallaxLastPosition, inputRecord_2.Angle, inputRecord_2.Position, inputRecord_2.Scale, inputRecord_2.ModelMatrix, inputRecord_2.ParallaxMatrix, inputRecord_2.Parent, inputRecord_2.Link, inputRecord_2.LinkedChildren, inputRecord_2.IsModelDirty, inputRecord_2.IsParallaxDirty, inputRecord_2.RecalcNeeded, inputRecord_2.CalcDrawMethod, inputRecord_2.CalcVertexCount, inputRecord_2.CalcInstanceCount)));
                        continue loop;
                    }
                    case 4: {
                        const x_4 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_3 = b.Data, new Data_GlObjData(inputRecord_3.Id, inputRecord_3.Name, inputRecord_3.ProgramInfo, inputRecord_3.IsDirty, inputRecord_3.Scene, inputRecord_3.DrawMethod, inputRecord_3.DrawPrimitive, inputRecord_3.VertexCount, x_4, inputRecord_3.VertexCountOffset, inputRecord_3.InstanceCount, inputRecord_3.InstanceOffset, inputRecord_3.InstanceCountOffset, inputRecord_3.IndicesOffset, inputRecord_3.Capabilities, inputRecord_3.Uniforms, inputRecord_3.Ubos, inputRecord_3.Attributes, inputRecord_3.Indices, inputRecord_3.Textures, inputRecord_3.VertexCountAttributes, inputRecord_3.InstanceCountAttributes, inputRecord_3.Vao, inputRecord_3.ProcessLinked, inputRecord_3.Layer, inputRecord_3.ParallaxCamera, inputRecord_3.ParallaxDistance, inputRecord_3.ParallaxOffset, inputRecord_3.ParallaxLastPosition, inputRecord_3.Angle, inputRecord_3.Position, inputRecord_3.Scale, inputRecord_3.ModelMatrix, inputRecord_3.ParallaxMatrix, inputRecord_3.Parent, inputRecord_3.Link, inputRecord_3.LinkedChildren, inputRecord_3.IsModelDirty, inputRecord_3.IsParallaxDirty, inputRecord_3.RecalcNeeded, inputRecord_3.CalcDrawMethod, inputRecord_3.CalcVertexCount, inputRecord_3.CalcInstanceCount)));
                        continue loop;
                    }
                    case 5: {
                        const x_5 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_4 = b.Data, new Data_GlObjData(inputRecord_4.Id, inputRecord_4.Name, inputRecord_4.ProgramInfo, inputRecord_4.IsDirty, inputRecord_4.Scene, inputRecord_4.DrawMethod, inputRecord_4.DrawPrimitive, inputRecord_4.VertexCount, inputRecord_4.VertexOffset, x_5, inputRecord_4.InstanceCount, inputRecord_4.InstanceOffset, inputRecord_4.InstanceCountOffset, inputRecord_4.IndicesOffset, inputRecord_4.Capabilities, inputRecord_4.Uniforms, inputRecord_4.Ubos, inputRecord_4.Attributes, inputRecord_4.Indices, inputRecord_4.Textures, inputRecord_4.VertexCountAttributes, inputRecord_4.InstanceCountAttributes, inputRecord_4.Vao, inputRecord_4.ProcessLinked, inputRecord_4.Layer, inputRecord_4.ParallaxCamera, inputRecord_4.ParallaxDistance, inputRecord_4.ParallaxOffset, inputRecord_4.ParallaxLastPosition, inputRecord_4.Angle, inputRecord_4.Position, inputRecord_4.Scale, inputRecord_4.ModelMatrix, inputRecord_4.ParallaxMatrix, inputRecord_4.Parent, inputRecord_4.Link, inputRecord_4.LinkedChildren, inputRecord_4.IsModelDirty, inputRecord_4.IsParallaxDirty, inputRecord_4.RecalcNeeded, inputRecord_4.CalcDrawMethod, inputRecord_4.CalcVertexCount, inputRecord_4.CalcInstanceCount)));
                        continue loop;
                    }
                    case 6: {
                        const x_6 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_5 = b.Data, new Data_GlObjData(inputRecord_5.Id, inputRecord_5.Name, inputRecord_5.ProgramInfo, inputRecord_5.IsDirty, inputRecord_5.Scene, inputRecord_5.DrawMethod, inputRecord_5.DrawPrimitive, inputRecord_5.VertexCount, inputRecord_5.VertexOffset, inputRecord_5.VertexCountOffset, x_6, inputRecord_5.InstanceOffset, inputRecord_5.InstanceCountOffset, inputRecord_5.IndicesOffset, inputRecord_5.Capabilities, inputRecord_5.Uniforms, inputRecord_5.Ubos, inputRecord_5.Attributes, inputRecord_5.Indices, inputRecord_5.Textures, inputRecord_5.VertexCountAttributes, inputRecord_5.InstanceCountAttributes, inputRecord_5.Vao, inputRecord_5.ProcessLinked, inputRecord_5.Layer, inputRecord_5.ParallaxCamera, inputRecord_5.ParallaxDistance, inputRecord_5.ParallaxOffset, inputRecord_5.ParallaxLastPosition, inputRecord_5.Angle, inputRecord_5.Position, inputRecord_5.Scale, inputRecord_5.ModelMatrix, inputRecord_5.ParallaxMatrix, inputRecord_5.Parent, inputRecord_5.Link, inputRecord_5.LinkedChildren, inputRecord_5.IsModelDirty, inputRecord_5.IsParallaxDirty, inputRecord_5.RecalcNeeded, inputRecord_5.CalcDrawMethod, inputRecord_5.CalcVertexCount, inputRecord_5.CalcInstanceCount)));
                        continue loop;
                    }
                    case 7: {
                        const x_7 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_6 = b.Data, new Data_GlObjData(inputRecord_6.Id, inputRecord_6.Name, inputRecord_6.ProgramInfo, inputRecord_6.IsDirty, inputRecord_6.Scene, inputRecord_6.DrawMethod, inputRecord_6.DrawPrimitive, inputRecord_6.VertexCount, inputRecord_6.VertexOffset, inputRecord_6.VertexCountOffset, inputRecord_6.InstanceCount, x_7, inputRecord_6.InstanceCountOffset, inputRecord_6.IndicesOffset, inputRecord_6.Capabilities, inputRecord_6.Uniforms, inputRecord_6.Ubos, inputRecord_6.Attributes, inputRecord_6.Indices, inputRecord_6.Textures, inputRecord_6.VertexCountAttributes, inputRecord_6.InstanceCountAttributes, inputRecord_6.Vao, inputRecord_6.ProcessLinked, inputRecord_6.Layer, inputRecord_6.ParallaxCamera, inputRecord_6.ParallaxDistance, inputRecord_6.ParallaxOffset, inputRecord_6.ParallaxLastPosition, inputRecord_6.Angle, inputRecord_6.Position, inputRecord_6.Scale, inputRecord_6.ModelMatrix, inputRecord_6.ParallaxMatrix, inputRecord_6.Parent, inputRecord_6.Link, inputRecord_6.LinkedChildren, inputRecord_6.IsModelDirty, inputRecord_6.IsParallaxDirty, inputRecord_6.RecalcNeeded, inputRecord_6.CalcDrawMethod, inputRecord_6.CalcVertexCount, inputRecord_6.CalcInstanceCount)));
                        continue loop;
                    }
                    case 8: {
                        const x_8 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_7 = b.Data, new Data_GlObjData(inputRecord_7.Id, inputRecord_7.Name, inputRecord_7.ProgramInfo, inputRecord_7.IsDirty, inputRecord_7.Scene, inputRecord_7.DrawMethod, inputRecord_7.DrawPrimitive, inputRecord_7.VertexCount, inputRecord_7.VertexOffset, inputRecord_7.VertexCountOffset, inputRecord_7.InstanceCount, inputRecord_7.InstanceOffset, x_8, inputRecord_7.IndicesOffset, inputRecord_7.Capabilities, inputRecord_7.Uniforms, inputRecord_7.Ubos, inputRecord_7.Attributes, inputRecord_7.Indices, inputRecord_7.Textures, inputRecord_7.VertexCountAttributes, inputRecord_7.InstanceCountAttributes, inputRecord_7.Vao, inputRecord_7.ProcessLinked, inputRecord_7.Layer, inputRecord_7.ParallaxCamera, inputRecord_7.ParallaxDistance, inputRecord_7.ParallaxOffset, inputRecord_7.ParallaxLastPosition, inputRecord_7.Angle, inputRecord_7.Position, inputRecord_7.Scale, inputRecord_7.ModelMatrix, inputRecord_7.ParallaxMatrix, inputRecord_7.Parent, inputRecord_7.Link, inputRecord_7.LinkedChildren, inputRecord_7.IsModelDirty, inputRecord_7.IsParallaxDirty, inputRecord_7.RecalcNeeded, inputRecord_7.CalcDrawMethod, inputRecord_7.CalcVertexCount, inputRecord_7.CalcInstanceCount)));
                        continue loop;
                    }
                    case 9: {
                        const x_9 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_8 = b.Data, new Data_GlObjData(inputRecord_8.Id, inputRecord_8.Name, inputRecord_8.ProgramInfo, inputRecord_8.IsDirty, inputRecord_8.Scene, inputRecord_8.DrawMethod, inputRecord_8.DrawPrimitive, inputRecord_8.VertexCount, inputRecord_8.VertexOffset, inputRecord_8.VertexCountOffset, inputRecord_8.InstanceCount, inputRecord_8.InstanceOffset, inputRecord_8.InstanceCountOffset, x_9, inputRecord_8.Capabilities, inputRecord_8.Uniforms, inputRecord_8.Ubos, inputRecord_8.Attributes, inputRecord_8.Indices, inputRecord_8.Textures, inputRecord_8.VertexCountAttributes, inputRecord_8.InstanceCountAttributes, inputRecord_8.Vao, inputRecord_8.ProcessLinked, inputRecord_8.Layer, inputRecord_8.ParallaxCamera, inputRecord_8.ParallaxDistance, inputRecord_8.ParallaxOffset, inputRecord_8.ParallaxLastPosition, inputRecord_8.Angle, inputRecord_8.Position, inputRecord_8.Scale, inputRecord_8.ModelMatrix, inputRecord_8.ParallaxMatrix, inputRecord_8.Parent, inputRecord_8.Link, inputRecord_8.LinkedChildren, inputRecord_8.IsModelDirty, inputRecord_8.IsParallaxDirty, inputRecord_8.RecalcNeeded, inputRecord_8.CalcDrawMethod, inputRecord_8.CalcVertexCount, inputRecord_8.CalcInstanceCount)));
                        continue loop;
                    }
                    case 10: {
                        const x_10 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addUniform_1(x_10);
                        continue loop;
                    }
                    case 11: {
                        const x_11 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addUbo_1(x_11);
                        continue loop;
                    }
                    case 12: {
                        const x_12 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addAttribute_1(x_12);
                        continue loop;
                    }
                    case 13: {
                        const x_13 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addIndices(x_13);
                        continue loop;
                    }
                    case 14: {
                        const x_14 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addTexture_1(x_14);
                        continue loop;
                    }
                    case 15: {
                        const x_15 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_9 = b.Data, new Data_GlObjData(inputRecord_9.Id, inputRecord_9.Name, inputRecord_9.ProgramInfo, inputRecord_9.IsDirty, inputRecord_9.Scene, inputRecord_9.DrawMethod, inputRecord_9.DrawPrimitive, inputRecord_9.VertexCount, inputRecord_9.VertexOffset, inputRecord_9.VertexCountOffset, inputRecord_9.InstanceCount, inputRecord_9.InstanceOffset, inputRecord_9.InstanceCountOffset, inputRecord_9.IndicesOffset, cons(x_15, b.Data.Capabilities), inputRecord_9.Uniforms, inputRecord_9.Ubos, inputRecord_9.Attributes, inputRecord_9.Indices, inputRecord_9.Textures, inputRecord_9.VertexCountAttributes, inputRecord_9.InstanceCountAttributes, inputRecord_9.Vao, inputRecord_9.ProcessLinked, inputRecord_9.Layer, inputRecord_9.ParallaxCamera, inputRecord_9.ParallaxDistance, inputRecord_9.ParallaxOffset, inputRecord_9.ParallaxLastPosition, inputRecord_9.Angle, inputRecord_9.Position, inputRecord_9.Scale, inputRecord_9.ModelMatrix, inputRecord_9.ParallaxMatrix, inputRecord_9.Parent, inputRecord_9.Link, inputRecord_9.LinkedChildren, inputRecord_9.IsModelDirty, inputRecord_9.IsParallaxDirty, inputRecord_9.RecalcNeeded, inputRecord_9.CalcDrawMethod, inputRecord_9.CalcVertexCount, inputRecord_9.CalcInstanceCount)));
                        continue loop;
                    }
                    case 16: {
                        const x_16 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_10 = b.Data, new Data_GlObjData(inputRecord_10.Id, inputRecord_10.Name, inputRecord_10.ProgramInfo, inputRecord_10.IsDirty, inputRecord_10.Scene, inputRecord_10.DrawMethod, inputRecord_10.DrawPrimitive, inputRecord_10.VertexCount, inputRecord_10.VertexOffset, inputRecord_10.VertexCountOffset, inputRecord_10.InstanceCount, inputRecord_10.InstanceOffset, inputRecord_10.InstanceCountOffset, inputRecord_10.IndicesOffset, inputRecord_10.Capabilities, inputRecord_10.Uniforms, inputRecord_10.Ubos, inputRecord_10.Attributes, inputRecord_10.Indices, inputRecord_10.Textures, inputRecord_10.VertexCountAttributes, inputRecord_10.InstanceCountAttributes, inputRecord_10.Vao, x_16, inputRecord_10.Layer, inputRecord_10.ParallaxCamera, inputRecord_10.ParallaxDistance, inputRecord_10.ParallaxOffset, inputRecord_10.ParallaxLastPosition, inputRecord_10.Angle, inputRecord_10.Position, inputRecord_10.Scale, inputRecord_10.ModelMatrix, inputRecord_10.ParallaxMatrix, inputRecord_10.Parent, inputRecord_10.Link, inputRecord_10.LinkedChildren, inputRecord_10.IsModelDirty, inputRecord_10.IsParallaxDirty, inputRecord_10.RecalcNeeded, inputRecord_10.CalcDrawMethod, inputRecord_10.CalcVertexCount, inputRecord_10.CalcInstanceCount)));
                        continue loop;
                    }
                    case 17: {
                        const x_17 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addParallaxCam(x_17);
                        continue loop;
                    }
                    case 18: {
                        const x_18 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_11 = b.Data, new Data_GlObjData(inputRecord_11.Id, inputRecord_11.Name, inputRecord_11.ProgramInfo, inputRecord_11.IsDirty, inputRecord_11.Scene, inputRecord_11.DrawMethod, inputRecord_11.DrawPrimitive, inputRecord_11.VertexCount, inputRecord_11.VertexOffset, inputRecord_11.VertexCountOffset, inputRecord_11.InstanceCount, inputRecord_11.InstanceOffset, inputRecord_11.InstanceCountOffset, inputRecord_11.IndicesOffset, inputRecord_11.Capabilities, inputRecord_11.Uniforms, inputRecord_11.Ubos, inputRecord_11.Attributes, inputRecord_11.Indices, inputRecord_11.Textures, inputRecord_11.VertexCountAttributes, inputRecord_11.InstanceCountAttributes, inputRecord_11.Vao, inputRecord_11.ProcessLinked, inputRecord_11.Layer, inputRecord_11.ParallaxCamera, x_18, inputRecord_11.ParallaxOffset, inputRecord_11.ParallaxLastPosition, inputRecord_11.Angle, inputRecord_11.Position, inputRecord_11.Scale, inputRecord_11.ModelMatrix, inputRecord_11.ParallaxMatrix, inputRecord_11.Parent, inputRecord_11.Link, inputRecord_11.LinkedChildren, inputRecord_11.IsModelDirty, inputRecord_11.IsParallaxDirty, inputRecord_11.RecalcNeeded, inputRecord_11.CalcDrawMethod, inputRecord_11.CalcVertexCount, inputRecord_11.CalcInstanceCount)));
                        continue loop;
                    }
                    case 19: {
                        const x_19 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_12 = b.Data, new Data_GlObjData(inputRecord_12.Id, inputRecord_12.Name, inputRecord_12.ProgramInfo, inputRecord_12.IsDirty, inputRecord_12.Scene, inputRecord_12.DrawMethod, inputRecord_12.DrawPrimitive, inputRecord_12.VertexCount, inputRecord_12.VertexOffset, inputRecord_12.VertexCountOffset, inputRecord_12.InstanceCount, inputRecord_12.InstanceOffset, inputRecord_12.InstanceCountOffset, inputRecord_12.IndicesOffset, inputRecord_12.Capabilities, inputRecord_12.Uniforms, inputRecord_12.Ubos, inputRecord_12.Attributes, inputRecord_12.Indices, inputRecord_12.Textures, inputRecord_12.VertexCountAttributes, inputRecord_12.InstanceCountAttributes, inputRecord_12.Vao, inputRecord_12.ProcessLinked, x_19, inputRecord_12.ParallaxCamera, inputRecord_12.ParallaxDistance, inputRecord_12.ParallaxOffset, inputRecord_12.ParallaxLastPosition, inputRecord_12.Angle, inputRecord_12.Position, inputRecord_12.Scale, inputRecord_12.ModelMatrix, inputRecord_12.ParallaxMatrix, inputRecord_12.Parent, inputRecord_12.Link, inputRecord_12.LinkedChildren, inputRecord_12.IsModelDirty, inputRecord_12.IsParallaxDirty, inputRecord_12.RecalcNeeded, inputRecord_12.CalcDrawMethod, inputRecord_12.CalcVertexCount, inputRecord_12.CalcInstanceCount)));
                        continue loop;
                    }
                    case 20: {
                        const x_20 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_13 = b.Data, new Data_GlObjData(inputRecord_13.Id, inputRecord_13.Name, inputRecord_13.ProgramInfo, inputRecord_13.IsDirty, inputRecord_13.Scene, inputRecord_13.DrawMethod, inputRecord_13.DrawPrimitive, inputRecord_13.VertexCount, inputRecord_13.VertexOffset, inputRecord_13.VertexCountOffset, inputRecord_13.InstanceCount, inputRecord_13.InstanceOffset, inputRecord_13.InstanceCountOffset, inputRecord_13.IndicesOffset, inputRecord_13.Capabilities, inputRecord_13.Uniforms, inputRecord_13.Ubos, inputRecord_13.Attributes, inputRecord_13.Indices, inputRecord_13.Textures, inputRecord_13.VertexCountAttributes, inputRecord_13.InstanceCountAttributes, inputRecord_13.Vao, inputRecord_13.ProcessLinked, inputRecord_13.Layer, inputRecord_13.ParallaxCamera, inputRecord_13.ParallaxDistance, inputRecord_13.ParallaxOffset, inputRecord_13.ParallaxLastPosition, x_20, inputRecord_13.Position, inputRecord_13.Scale, inputRecord_13.ModelMatrix, inputRecord_13.ParallaxMatrix, inputRecord_13.Parent, inputRecord_13.Link, inputRecord_13.LinkedChildren, inputRecord_13.IsModelDirty, inputRecord_13.IsParallaxDirty, inputRecord_13.RecalcNeeded, inputRecord_13.CalcDrawMethod, inputRecord_13.CalcVertexCount, inputRecord_13.CalcInstanceCount)));
                        continue loop;
                    }
                    case 21: {
                        const x_21 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_14 = b.Data, new Data_GlObjData(inputRecord_14.Id, inputRecord_14.Name, inputRecord_14.ProgramInfo, inputRecord_14.IsDirty, inputRecord_14.Scene, inputRecord_14.DrawMethod, inputRecord_14.DrawPrimitive, inputRecord_14.VertexCount, inputRecord_14.VertexOffset, inputRecord_14.VertexCountOffset, inputRecord_14.InstanceCount, inputRecord_14.InstanceOffset, inputRecord_14.InstanceCountOffset, inputRecord_14.IndicesOffset, inputRecord_14.Capabilities, inputRecord_14.Uniforms, inputRecord_14.Ubos, inputRecord_14.Attributes, inputRecord_14.Indices, inputRecord_14.Textures, inputRecord_14.VertexCountAttributes, inputRecord_14.InstanceCountAttributes, inputRecord_14.Vao, inputRecord_14.ProcessLinked, inputRecord_14.Layer, inputRecord_14.ParallaxCamera, inputRecord_14.ParallaxDistance, inputRecord_14.ParallaxOffset, inputRecord_14.ParallaxLastPosition, degreesToRadians(x_21), inputRecord_14.Position, inputRecord_14.Scale, inputRecord_14.ModelMatrix, inputRecord_14.ParallaxMatrix, inputRecord_14.Parent, inputRecord_14.Link, inputRecord_14.LinkedChildren, inputRecord_14.IsModelDirty, inputRecord_14.IsParallaxDirty, inputRecord_14.RecalcNeeded, inputRecord_14.CalcDrawMethod, inputRecord_14.CalcVertexCount, inputRecord_14.CalcInstanceCount)));
                        continue loop;
                    }
                    case 22: {
                        const x_22 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_15 = b.Data, new Data_GlObjData(inputRecord_15.Id, inputRecord_15.Name, inputRecord_15.ProgramInfo, inputRecord_15.IsDirty, inputRecord_15.Scene, inputRecord_15.DrawMethod, inputRecord_15.DrawPrimitive, inputRecord_15.VertexCount, inputRecord_15.VertexOffset, inputRecord_15.VertexCountOffset, inputRecord_15.InstanceCount, inputRecord_15.InstanceOffset, inputRecord_15.InstanceCountOffset, inputRecord_15.IndicesOffset, inputRecord_15.Capabilities, inputRecord_15.Uniforms, inputRecord_15.Ubos, inputRecord_15.Attributes, inputRecord_15.Indices, inputRecord_15.Textures, inputRecord_15.VertexCountAttributes, inputRecord_15.InstanceCountAttributes, inputRecord_15.Vao, inputRecord_15.ProcessLinked, inputRecord_15.Layer, inputRecord_15.ParallaxCamera, inputRecord_15.ParallaxDistance, inputRecord_15.ParallaxOffset, inputRecord_15.ParallaxLastPosition, ((_ = b.Data.Angle, _.values[2] = x_22), b.Data.Angle), inputRecord_15.Position, inputRecord_15.Scale, inputRecord_15.ModelMatrix, inputRecord_15.ParallaxMatrix, inputRecord_15.Parent, inputRecord_15.Link, inputRecord_15.LinkedChildren, inputRecord_15.IsModelDirty, inputRecord_15.IsParallaxDirty, inputRecord_15.RecalcNeeded, inputRecord_15.CalcDrawMethod, inputRecord_15.CalcVertexCount, inputRecord_15.CalcInstanceCount)));
                        continue loop;
                    }
                    case 23: {
                        const x_23 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_16 = b.Data, new Data_GlObjData(inputRecord_16.Id, inputRecord_16.Name, inputRecord_16.ProgramInfo, inputRecord_16.IsDirty, inputRecord_16.Scene, inputRecord_16.DrawMethod, inputRecord_16.DrawPrimitive, inputRecord_16.VertexCount, inputRecord_16.VertexOffset, inputRecord_16.VertexCountOffset, inputRecord_16.InstanceCount, inputRecord_16.InstanceOffset, inputRecord_16.InstanceCountOffset, inputRecord_16.IndicesOffset, inputRecord_16.Capabilities, inputRecord_16.Uniforms, inputRecord_16.Ubos, inputRecord_16.Attributes, inputRecord_16.Indices, inputRecord_16.Textures, inputRecord_16.VertexCountAttributes, inputRecord_16.InstanceCountAttributes, inputRecord_16.Vao, inputRecord_16.ProcessLinked, inputRecord_16.Layer, inputRecord_16.ParallaxCamera, inputRecord_16.ParallaxDistance, inputRecord_16.ParallaxOffset, inputRecord_16.ParallaxLastPosition, ((__1 = b.Data.Angle, (value_2 = (x_23 * RAD_PER_DEG), __1.values[2] = value_2)), b.Data.Angle), inputRecord_16.Position, inputRecord_16.Scale, inputRecord_16.ModelMatrix, inputRecord_16.ParallaxMatrix, inputRecord_16.Parent, inputRecord_16.Link, inputRecord_16.LinkedChildren, inputRecord_16.IsModelDirty, inputRecord_16.IsParallaxDirty, inputRecord_16.RecalcNeeded, inputRecord_16.CalcDrawMethod, inputRecord_16.CalcVertexCount, inputRecord_16.CalcInstanceCount)));
                        continue loop;
                    }
                    case 24: {
                        const x_24 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_17 = b.Data, new Data_GlObjData(inputRecord_17.Id, inputRecord_17.Name, inputRecord_17.ProgramInfo, inputRecord_17.IsDirty, inputRecord_17.Scene, inputRecord_17.DrawMethod, inputRecord_17.DrawPrimitive, inputRecord_17.VertexCount, inputRecord_17.VertexOffset, inputRecord_17.VertexCountOffset, inputRecord_17.InstanceCount, inputRecord_17.InstanceOffset, inputRecord_17.InstanceCountOffset, inputRecord_17.IndicesOffset, inputRecord_17.Capabilities, inputRecord_17.Uniforms, inputRecord_17.Ubos, inputRecord_17.Attributes, inputRecord_17.Indices, inputRecord_17.Textures, inputRecord_17.VertexCountAttributes, inputRecord_17.InstanceCountAttributes, inputRecord_17.Vao, inputRecord_17.ProcessLinked, inputRecord_17.Layer, inputRecord_17.ParallaxCamera, inputRecord_17.ParallaxDistance, inputRecord_17.ParallaxOffset, inputRecord_17.ParallaxLastPosition, inputRecord_17.Angle, x_24, inputRecord_17.Scale, inputRecord_17.ModelMatrix, inputRecord_17.ParallaxMatrix, inputRecord_17.Parent, inputRecord_17.Link, inputRecord_17.LinkedChildren, inputRecord_17.IsModelDirty, inputRecord_17.IsParallaxDirty, inputRecord_17.RecalcNeeded, inputRecord_17.CalcDrawMethod, inputRecord_17.CalcVertexCount, inputRecord_17.CalcInstanceCount)));
                        continue loop;
                    }
                    case 25: {
                        const x_25 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_18 = b.Data, new Data_GlObjData(inputRecord_18.Id, inputRecord_18.Name, inputRecord_18.ProgramInfo, inputRecord_18.IsDirty, inputRecord_18.Scene, inputRecord_18.DrawMethod, inputRecord_18.DrawPrimitive, inputRecord_18.VertexCount, inputRecord_18.VertexOffset, inputRecord_18.VertexCountOffset, inputRecord_18.InstanceCount, inputRecord_18.InstanceOffset, inputRecord_18.InstanceCountOffset, inputRecord_18.IndicesOffset, inputRecord_18.Capabilities, inputRecord_18.Uniforms, inputRecord_18.Ubos, inputRecord_18.Attributes, inputRecord_18.Indices, inputRecord_18.Textures, inputRecord_18.VertexCountAttributes, inputRecord_18.InstanceCountAttributes, inputRecord_18.Vao, inputRecord_18.ProcessLinked, inputRecord_18.Layer, inputRecord_18.ParallaxCamera, inputRecord_18.ParallaxDistance, inputRecord_18.ParallaxOffset, inputRecord_18.ParallaxLastPosition, inputRecord_18.Angle, inputRecord_18.Position, x_25, inputRecord_18.ModelMatrix, inputRecord_18.ParallaxMatrix, inputRecord_18.Parent, inputRecord_18.Link, inputRecord_18.LinkedChildren, inputRecord_18.IsModelDirty, inputRecord_18.IsParallaxDirty, inputRecord_18.RecalcNeeded, inputRecord_18.CalcDrawMethod, inputRecord_18.CalcVertexCount, inputRecord_18.CalcInstanceCount)));
                        continue loop;
                    }
                    case 26: {
                        const x_26 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addLink(x_26);
                        continue loop;
                    }
                    default: {
                        const x = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateName(x);
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

export function create(vertex, fragment, parent, scene, props) {
    let inputRecord;
    const gl = scene.Canvas.Context;
    const programInfo = GlProgram_createProgramInfo(gl, vertex, fragment);
    const vao = gl.createVertexArray();
    return build(apply(props, new Builder("", void 0, void 0, empty(), empty(), empty(), uncurry(2, void 0), empty(), (inputRecord = emptyObject(scene), new Data_GlObjData(inputRecord.Id, inputRecord.Name, programInfo, inputRecord.IsDirty, inputRecord.Scene, inputRecord.DrawMethod, inputRecord.DrawPrimitive, inputRecord.VertexCount, inputRecord.VertexOffset, inputRecord.VertexCountOffset, inputRecord.InstanceCount, inputRecord.InstanceOffset, inputRecord.InstanceCountOffset, inputRecord.IndicesOffset, inputRecord.Capabilities, inputRecord.Uniforms, inputRecord.Ubos, inputRecord.Attributes, inputRecord.Indices, inputRecord.Textures, inputRecord.VertexCountAttributes, inputRecord.InstanceCountAttributes, vao, true, inputRecord.Layer, inputRecord.ParallaxCamera, inputRecord.ParallaxDistance, inputRecord.ParallaxOffset, inputRecord.ParallaxLastPosition, inputRecord.Angle, inputRecord.Position, inputRecord.Scale, inputRecord.ModelMatrix, inputRecord.ParallaxMatrix, parent, inputRecord.Link, inputRecord.LinkedChildren, inputRecord.IsModelDirty, inputRecord.IsParallaxDirty, inputRecord.RecalcNeeded, inputRecord.CalcDrawMethod, inputRecord.CalcVertexCount, inputRecord.CalcInstanceCount)))));
}

export function delete$(data) {
    const deleteAttribute = (attribute) => {
        if (attribute.tag === 1) {
            const a_1 = attribute.fields[0];
            delete$_1(a_1);
        }
        else {
            const a = attribute.fields[0];
            delete$_1(a);
        }
    };
    const gl = data.Scene.Canvas.Context;
    GlProgram_deleteProgramInfo(data.ProgramInfo);
    gl.deleteVertexArray(data.Vao);
    iterate_1((data_1) => {
        delete$_2(data_1);
    }, data.Ubos);
    iterate_1(deleteAttribute, data.Attributes);
    call((data_2) => {
        delete$_3(data_2);
    }, data.Indices);
}

function updateCalculated(data) {
    const sumDataCount = (attribs) => sumBy((a) => a.DataCount, attribs, {
        GetZero: () => 0,
        Add: (x, y) => (x + y),
    });
    if (data.RecalcNeeded) {
        data.RecalcNeeded = false;
        if (data.CalcVertexCount) {
            data.VertexCount = sumDataCount(data.VertexCountAttributes);
        }
        if (data.CalcInstanceCount) {
            data.InstanceCount = sumDataCount(data.InstanceCountAttributes);
        }
        if (data.CalcDrawMethod) {
            const hasIndices = data.Indices != null;
            const hasDivisor = (data.InstanceCount > 0) ? true : exists((a_1) => (a_1.Divisor >= 0), allAttributes(data));
            if (data.CalcDrawMethod) {
                const matchValue_1 = [hasIndices, hasDivisor];
                data.DrawMethod = (matchValue_1[0] ? (matchValue_1[1] ? (new GlDrawMethod(3)) : (new GlDrawMethod(1))) : (matchValue_1[1] ? (new GlDrawMethod(2)) : (new GlDrawMethod(0))));
            }
        }
    }
}

function clean(data) {
    data.IsDirty = false;
    data.IsModelDirty = false;
}

function calcModelMatrix(data) {
    if (data.IsModelDirty) {
        const mat = data.ModelMatrix;
        const ws = data.Scene.WorldScale;
        const scale = (data.Scale === 1) ? ws : (data.Scale + ((ws !== 1) ? ws : 0));
        const matchValue_1 = data.Link;
        if (matchValue_1 != null) {
            const link = matchValue_1;
            Mat4__Set_Z33A93963(mat, Mat4__get_Values(link.ModelMatrix));
            if (ws !== 1) {
                const invScale = 1 / ws;
                Mat4__ScaleM_8ED0A5D(mat, invScale, invScale, invScale);
            }
        }
        else {
            Mat4__SetToIdentity(mat);
        }
        Mat4__TranslateM_8ED0A5D(mat, data.Position.values[0] * ws, data.Position.values[1] * ws, data.Position.values[2] * ws);
        Mat4__RotateZM_6069AC9A(mat, data.Angle.values[2] * 1);
        Mat4__ScaleM_8ED0A5D(mat, scale, scale, scale);
        data.IsModelDirty = false;
        data.IsParallaxDirty = true;
        iterate_1(dirtyModel, data.LinkedChildren);
    }
}

function calcParallaxMatrix(data) {
    if (data.IsParallaxDirty) {
        data.IsParallaxDirty = false;
        const matchValue = data.ParallaxMatrix;
        if (matchValue != null) {
            const mat = matchValue;
            const ws = data.Scene.WorldScale;
            const scale = data.Scale + ((ws !== 1) ? ws : 0);
            const position = Vec3_op_Addition_Z24FF85E0(data.Position, data.ParallaxOffset);
            Mat4__SetToIdentity(mat);
            Mat4__TranslateM_8ED0A5D(mat, position.values[0] * ws, position.values[1] * ws, position.values[2] * ws);
            Mat4__RotateZM_6069AC9A(mat, data.Angle.values[2] * 1);
            Mat4__ScaleM_8ED0A5D(mat, scale, scale, scale);
        }
    }
}

function isParallaxCamera(camera, data) {
    return camera === data.ParallaxCamera;
}

function updateModelMatrix(camera, data) {
    const matchValue = tryGetUniform("modelMat")(data);
    if (matchValue != null) {
        const modelMat = matchValue;
        calcModelMatrix(data);
        calcParallaxMatrix(data);
        let mat_1;
        const matchValue_1 = [isParallaxCamera(camera, data), data.ParallaxMatrix];
        let pattern_matching_result;
        if (matchValue_1[0]) {
            if (matchValue_1[1] != null) {
                pattern_matching_result = 0;
            }
            else {
                pattern_matching_result = 1;
            }
        }
        else {
            pattern_matching_result = 1;
        }
        switch (pattern_matching_result) {
            case 0: {
                const mat = matchValue_1[1];
                mat_1 = mat;
                break;
            }
            case 1: {
                mat_1 = data.ModelMatrix;
                break;
            }
        }
        setValue(Mat4__get_Values(mat_1), modelMat);
    }
}

function updateParallax(camera, data) {
    const matchValue = data.ParallaxCamera;
    if (matchValue != null) {
        const cam = matchValue;
        const isParallaxCam = isParallaxCamera(camera, data);
        if (isParallaxCam ? (!equals(data.ParallaxLastPosition, cam.LookAt)) : false) {
            const delta = Vec3_op_Subtraction_Z24FF85E0(data.ParallaxLastPosition, cam.LookAt);
            const frac = 1 - (1 / data.ParallaxDistance);
            Vec3_op_AdditionAssignment_Z24FF85E0(data.ParallaxOffset, Vec3_op_Multiply_Z18D588CE(Vec3_op_UnaryNegation_Z3D47FC51(delta), frac));
            const other = cam.LookAt;
            let value_3;
            const __4 = data.ParallaxLastPosition.v.contents;
            const x = other.values[0];
            const y = other.values[1];
            const z = other.values[2];
            const __5 = __4.v.contents;
            __5.values[0] = x;
            const __6 = __4.v.contents;
            __6.values[1] = y;
            const __7 = __4.v.contents;
            __7.values[2] = z;
            value_3 = __4.v.contents;
            void value_3;
            data.IsParallaxDirty = true;
        }
    }
}

function updateAttribute(attr) {
    if (attr.tag === 1) {
        const a_1 = attr.fields[0];
        update_1(a_1);
    }
    else {
        const a = attr.fields[0];
        update_2(a);
    }
}

export function update(camera, data) {
    const gl = data.Scene.Canvas.Context;
    GlCommon_useProgram(gl, data.ProgramInfo.Program);
    GlCommon_bindVertexArray(gl, data.Vao);
    if (data.IsDirty) {
        updateParallax(camera, data);
        updateModelMatrix(camera, data);
    }
    iterate_1((data_1) => {
        update_3(data_1);
    }, data.Ubos);
    if (data.IsDirty) {
        iterate_1((data_2) => {
            update_4(data_2);
        }, data.Uniforms);
        iterate_1((attr) => {
            updateAttribute(attr);
        }, data.Attributes);
        call((data_3) => {
            update_5(data_3);
        }, data.Indices);
        iterate_1((data_4) => {
            update_6(data_4);
        }, data.Textures);
        updateCalculated(data);
        clean(data);
    }
}

export function render(camera, data) {
    const gl = data.Scene.Canvas.Context;
    update(camera, data);
    iterate_1((capability) => {
        capability(gl);
    }, data.Capabilities);
    const uResolution = tryGetUniform("resolution")(data);
    if (uResolution != null) {
        const bounds = uResolution;
        const values = bounds.Value;
        console.log(some(toText(interpolate("got resolution: %P()", [values]))));
    }
    const matchValue = data.DrawMethod;
    switch (matchValue.tag) {
        case 4: {
            const vertexCount = (data.VertexCount + data.VertexCountOffset) | 0;
            GlCommon_drawArrays(gl, data.DrawPrimitive, data.VertexOffset, vertexCount);
            break;
        }
        case 1: {
            const index = data.Indices;
            GlCommon_drawElements(gl, data.DrawPrimitive, index.DataCount, index.IndicesType, index.Offset);
            break;
        }
        case 2: {
            const vertexCount_1 = (data.VertexCount + data.VertexCountOffset) | 0;
            const instanceCount = (data.InstanceCount + data.InstanceCountOffset) | 0;
            GlCommon_drawArraysInstanced(gl, data.DrawPrimitive, data.InstanceOffset, vertexCount_1, instanceCount);
            break;
        }
        case 3: {
            break;
        }
        default: {
            const vertexCount = (data.VertexCount + data.VertexCountOffset) | 0;
            GlCommon_drawArrays(gl, data.DrawPrimitive, data.VertexOffset, vertexCount);
        }
    }
}

export function setInstanceCount(value, data) {
    data.InstanceCount = value;
    objectRecalcNeeded(data);
}

export function setAngle(angle, data) {
    let value_4;
    const _ = angle;
    let value_3;
    const __4 = data.Angle;
    const x = _.v.contents.values[0];
    const y = _.v.contents.values[1];
    const z = _.v.contents.values[2];
    const __5 = __4.v.contents;
    __5.values[0] = x;
    const __6 = __4.v.contents;
    __6.values[1] = y;
    const __7 = __4.v.contents;
    __7.values[2] = z;
    value_3 = __4.v.contents;
    value_4 = (void value_3);
    void undefined;
    dirtyModel(data);
}

export function setAngleZ(angle, data) {
    data.Angle.values[2] = angle;
    dirtyModel(data);
}

export function setAngleDegrees(angle, data) {
    const __3 = data.Angle;
    const value_3 = Vec3__WithXYZ_Z6FDE0AF9(__3.v.contents, (angle.values[0] * 1) * RAD_PER_DEG, (angle.values[1] * 1) * RAD_PER_DEG, (angle.values[2] * 1) * RAD_PER_DEG, __3.v.contents);
    void value_3;
    dirtyModel(data);
}

export function setAngleDegreesZ(angle, data) {
    const value_1 = angle * RAD_PER_DEG;
    data.Angle.values[2] = value_1;
    dirtyModel(data);
}

export function setPositionXYZ(x, y, z, data) {
    const _ = data.Position;
    const value = Vec3__WithXYZ_Z6FDE0AF9(_.v.contents, x, y, z, _.v.contents);
    void value;
    dirtyModel(data);
}

export function setPositionXY(x, y, data) {
    setPositionXYZ(x, y, 0, data);
}

export function setPosition(position, data) {
    setPositionXYZ(position.values[0], position.values[1], position.values[2], data);
}

export function setScale(s, data) {
    data.Scale = s;
    dirtyModel(data);
}

