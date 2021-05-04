import { isNullOrWhiteSpace, interpolate, toText, split } from "../.fable/fable-library.3.0.0/String.js";
import { append as append_1, tryFind } from "../.fable/fable-library.3.0.0/Array.js";
import { reverse, tryFind as tryFind_2, singleton, delay, append, collect } from "../.fable/fable-library.3.0.0/Seq.js";
import { cons, filter, singleton as singleton_1, append as append_2, empty, sortBy, tryFind as tryFind_1 } from "../.fable/fable-library.3.0.0/List.js";
import { Data_GlAttributeData__get_Name, Data_GlUniformData__get_Name, Data_GlUboData__get_Name } from "./webgl_data.js";
import { comparePrimitives } from "../.fable/fable-library.3.0.0/Util.js";

export function splitName(name) {
    const pair = split(name, ["."], null, 0);
    return [pair[0], pair[1]];
}

export function getScene(name, data) {
    const matchValue = tryFind((u) => (u.Name === name), data.Scenes);
    if (matchValue == null) {
        throw (new Error(toText(interpolate("Scene \u0027%P()\u0027 not found", [name]))));
    }
    else {
        const scene = matchValue;
        return scene;
    }
}

export function allObjects(data) {
    const sceneObjects = (data_1) => collect((l) => l.Objects, data_1.Layers);
    return collect(sceneObjects, data.Scenes);
}

export function getAttributeData(attribute) {
    let pattern_matching_result, a;
    if (attribute.tag === 1) {
        pattern_matching_result = 0;
        a = attribute.fields[0];
    }
    else {
        pattern_matching_result = 0;
        a = attribute.fields[0];
    }
    switch (pattern_matching_result) {
        case 0: {
            return a;
        }
    }
}

export function getUbo(name, data) {
    const matchValue = tryFind_1((u) => (Data_GlUboData__get_Name(u) === name), data.Ubos);
    if (matchValue == null) {
        throw (new Error(toText(interpolate("Ubo \u0027%P()\u0027 not found", [name]))));
    }
    else {
        const ubo = matchValue;
        return ubo;
    }
}

export function tryGetUbo(name, data) {
    return tryFind_1((u) => (Data_GlUboData__get_Name(u) === name), data.Ubos);
}

export function allUniforms(data) {
    return append(data.Uniforms, collect((ubo) => ubo.Uniforms, data.Ubos));
}

export function allAttributes(data) {
    const getAttributes = (data_1) => delay(() => append(singleton(data_1), delay(() => collect(getAttributes, data_1.ChildAttributes))));
    return collect((arg) => getAttributes(getAttributeData(arg)), data.Attributes);
}

export function getUniform(name, data) {
    const matchValue = tryFind_2((u) => (Data_GlUniformData__get_Name(u) === name), allUniforms(data));
    if (matchValue == null) {
        throw (new Error(toText(interpolate("Uniform \u0027%P()\u0027 not found", [name]))));
    }
    else {
        const uniform = matchValue;
        return uniform;
    }
}

export function tryGetUniform(name, data) {
    return tryFind_2((u) => (Data_GlUniformData__get_Name(u) === name), allUniforms(data));
}

export function getAttribute(name, data) {
    const matchValue = tryFind_2((u) => (Data_GlAttributeData__get_Name(u) === name), allAttributes(data));
    if (matchValue == null) {
        throw (new Error(toText(interpolate("Attribute \u0027%P()\u0027 not found", [name]))));
    }
    else {
        const attribute = matchValue;
        return attribute;
    }
}

export function tryGetAttribute(name, data) {
    return tryFind_2((u) => (Data_GlAttributeData__get_Name(u) === name), allAttributes(data));
}

export function getTexture(name, data) {
    const matchValue = tryFind_1((u) => (u.Name === name), data.Textures);
    if (matchValue == null) {
        throw (new Error(toText(interpolate("Texture \u0027%P()\u0027 not found", [name]))));
    }
    else {
        const texture = matchValue;
        return texture;
    }
}

export function tryGetTexture(name, data) {
    return tryFind_1((u) => (u.Name === name), data.Textures);
}

export function objects(data) {
    return delay(() => collect((l) => l.Objects, reverse(data.Layers)));
}

export function getCamera(name, data) {
    const matchValue = tryFind_1((o) => (o.Name === name), data.Cameras);
    if (matchValue == null) {
        const msg = toText(interpolate("Camera \u0027%P()\u0027 not found", [name]));
        throw (new Error(msg));
    }
    else {
        const camera = matchValue;
        return camera;
    }
}

export function tryGetCamera(name, data) {
    return tryFind_1((u) => (u.Name === name), data.Cameras);
}

export function getObject(name, data) {
    const matchValue = tryFind_2((o) => (o.Name === name), objects(data));
    if (matchValue == null) {
        const msg = toText(interpolate("Object \u0027%P()\u0027 not found", [name]));
        throw (new Error(msg));
    }
    else {
        const object = matchValue;
        return object;
    }
}

export function tryGetObject(name, data) {
    return tryFind_2((u) => (u.Name === name), objects(data));
}

export function dirtyScene(data) {
    data.IsDirty = true;
    data.Canvas.IsDirty = true;
}

export function dirtyObject(data) {
    data.IsDirty = true;
    dirtyScene(data.Scene);
}

export function dirtyModel(data) {
    data.IsModelDirty = true;
    dirtyObject(data);
}

export function dirtyParallax(data) {
    if (data.ParallaxCamera != null) {
        data.IsParallaxDirty = true;
        dirtyObject(data);
    }
}

export function objectRecalcNeeded(data) {
    data.RecalcNeeded = true;
    dirtyObject(data);
}

export function nextUboBufferIndex(data) {
    const loop = (i_mut, ubos_mut) => {
        loop:
        while (true) {
            const i = i_mut, ubos = ubos_mut;
            if (ubos.tail != null) {
                const t = ubos.tail;
                const h = ubos.head;
                if (i < h.Location) {
                    return i | 0;
                }
                else {
                    i_mut = (i + 1);
                    ubos_mut = t;
                    continue loop;
                }
            }
            else {
                return i | 0;
            }
            break;
        }
    };
    return loop(0, sortBy((u) => u.Location, data.Ubos, {
        Compare: comparePrimitives,
    })) | 0;
}

export function nextTextureIndex(data) {
    const loop = (i_mut, ubos_mut) => {
        loop:
        while (true) {
            const i = i_mut, ubos = ubos_mut;
            if (ubos.tail != null) {
                const t = ubos.tail;
                const h = ubos.head;
                if (i < h.Index) {
                    return i | 0;
                }
                else {
                    i_mut = (i + 1);
                    ubos_mut = t;
                    continue loop;
                }
            }
            else {
                return i | 0;
            }
            break;
        }
    };
    return loop(0, sortBy((u) => u.Index, data.Textures, {
        Compare: comparePrimitives,
    })) | 0;
}

export function addScene(creator, data) {
    const sceneData = creator(empty(), data);
    data.Scenes = append_1(data.Scenes, [sceneData]);
    return sceneData;
}

export function removeScene(scene, data) {
    data.Scenes = data.Scenes.filter((o) => (!(o === scene)));
    data.IsDirty = true;
    return data;
}

export function addCamera(creator, data) {
    const camData = creator(empty(), data);
    data.Cameras = append_2(data.Cameras, singleton_1(camData));
    dirtyScene(data);
    return camData;
}

export function removeCamera(cam, data) {
    data.Cameras = filter((o) => (!(o === cam)), data.Cameras);
    dirtyScene(data);
    return data;
}

export function addObject(creator, data) {
    const objData = creator(empty(), data);
    const layer = data.Layers[objData.Layer];
    layer.Objects = append_2(layer.Objects, singleton_1(objData));
    dirtyScene(data);
    return objData;
}

export function removeObject(globj, data) {
    const layer = data.Layers[globj.Layer];
    layer.Objects = filter((o) => (!(o === globj)), layer.Objects);
    dirtyScene(data);
    return data;
}

export function addUbo(creator, data) {
    const uboData = creator(empty(), data);
    data.Ubos = append_2(data.Ubos, singleton_1(uboData));
    dirtyObject(data);
    return uboData;
}

export function addUniform(creator, data) {
    const uniformData = creator(empty(), data);
    data.Uniforms = append_2(data.Uniforms, singleton_1(uniformData));
    dirtyObject(data);
    return uniformData;
}

export function addAttribute(creator, data) {
    const attributeData = creator(empty(), data);
    data.Attributes = append_2(data.Attributes, singleton_1(attributeData));
    dirtyObject(data);
    return attributeData;
}

export function addTexture(creator, data) {
    const textureData = creator(empty(), data);
    data.Textures = append_2(data.Textures, singleton_1(textureData));
    dirtyObject(data);
    return textureData;
}

export function addUboUniform(creator, data) {
    const uniformData = creator(empty(), data, data.ParentObject);
    data.Uniforms = cons(uniformData, data.Uniforms);
    return uniformData;
}

export function objectDebugName(globj) {
    if (!isNullOrWhiteSpace(globj.Name)) {
        return globj.Name;
    }
    else if (globj.Parent == null) {
        return "shared";
    }
    else {
        return "";
    }
}

