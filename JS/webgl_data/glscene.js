import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { Data_GlSceneData, Data_GlLayerData, BuilderTypes_GlCamProp, BuilderTypes_GlObjProp, Data_GlObjData$reflection, BuilderTypes_GlObjProp$reflection, Data_GlCameraData$reflection, Data_GlSceneData$reflection, BuilderTypes_GlCamProp$reflection } from "./webgl_data.js";
import { record_type, lambda_type, list_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { objects, removeObject as removeObject_1, addObject as addObject_2, removeCamera as removeCamera_1, addCamera as addCamera_2, tryGetObject as tryGetObject_1, getObject as getObject_1, tryGetCamera as tryGetCamera_1, getCamera as getCamera_1 } from "./glcommon.js";
import { head, cons, append, reverse, iterate, singleton, map, empty } from "../.fable/fable-library.3.0.0/List.js";
import { partialApply, curry, mapCurriedArgs } from "../.fable/fable-library.3.0.0/Util.js";
import { create as create_1 } from "./glortho2d.js";
import { map as map_1 } from "../.fable/fable-library.3.0.0/Array.js";
import { iterate as iterate_1, rangeNumber } from "../.fable/fable-library.3.0.0/Seq.js";
import { Bounds__get_Values, BoundsModule_boundsSizeV, Bounds__Clone } from "../twod/bounds.js";
import { _cleanLinkedBuffers, tryGetUniform, update, create as create_2 } from "./globj.js";
import { Vec4__get_Values, Vec4_Create } from "../core/vectors.js";
import { update as update_1, render as render_1, getZoom, getGlViewportValues } from "./glcamera.js";
import { setValue } from "./gluniform.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { Mat4__get_Values } from "../core/matricies.js";
import { call } from "../core/optionex.js";

class Builder extends Record {
    constructor(CameraCreators, ObjectCreators, SharedCreator, Data) {
        super();
        this.CameraCreators = CameraCreators;
        this.ObjectCreators = ObjectCreators;
        this.SharedCreator = SharedCreator;
        this.Data = Data;
    }
}

function Builder$reflection() {
    return record_type("GlScene.Builder", [], Builder, () => [["CameraCreators", list_type(lambda_type(list_type(BuilderTypes_GlCamProp$reflection()), lambda_type(Data_GlSceneData$reflection(), Data_GlCameraData$reflection())))], ["ObjectCreators", list_type(lambda_type(list_type(BuilderTypes_GlObjProp$reflection()), lambda_type(Data_GlSceneData$reflection(), Data_GlObjData$reflection())))], ["SharedCreator", lambda_type(list_type(BuilderTypes_GlObjProp$reflection()), lambda_type(Data_GlSceneData$reflection(), Data_GlObjData$reflection()))], ["Data", Data_GlSceneData$reflection()]]);
}

export const getCamera = (name) => ((data) => getCamera_1(name, data));

export const tryGetCamera = (name) => ((data) => tryGetCamera_1(name, data));

export const getObject = (name) => ((data) => getObject_1(name, data));

export const tryGetObject = (name) => ((data) => tryGetObject_1(name, data));

export const addCamera = (creator) => ((data) => addCamera_2(creator, data));

export const removeCamera = (cam) => ((data) => removeCamera_1(cam, data));

export const addObject = (creator) => ((data) => addObject_2(creator, data));

export const removeObject = (globj) => ((data) => removeObject_1(globj, data));

export function clean(data) {
    data.IsDirty = false;
}

function applyCreators(builder) {
    const data = builder.Data;
    const createCamera = (creator) => creator(empty(), data);
    const createCameras = (creators) => map(mapCurriedArgs(createCamera, [[0, 2]]), creators);
    const createObject = (creator_1) => creator_1(empty(), data);
    const createObjects = (creators_1) => map(mapCurriedArgs(createObject, [[0, 2]]), creators_1);
    const createShared = (creator_2) => creator_2(singleton(new BuilderTypes_GlObjProp(0, "shared")), data);
    const addObjects = (data_1) => {
        iterate(mapCurriedArgs((c) => {
            const value = addObject_2(c, data_1);
            void value;
        }, [[0, 2]]), reverse(builder.ObjectCreators));
        return data_1;
    };
    if (builder.CameraCreators.tail == null) {
        builder.CameraCreators = singleton((p) => ((d) => create_1(append(singleton(new BuilderTypes_GlCamProp(0, "defaultCamera")), p), d)));
    }
    data.Shared = createShared(builder.SharedCreator);
    data.Cameras = createCameras(reverse(builder.CameraCreators));
    return addObjects(data);
}

function build(builder) {
    return applyCreators(builder);
}

function createLayer(index) {
    return new Data_GlLayerData(index, empty());
}

function apply(props, builder) {
    const loop = (props_1_mut, b_mut) => {
        let inputRecord_1, inputRecord_2, inputRecord_3, inputRecord_4, inputRecord_5, inputRecord_6, inputRecord_7, inputRecord_8, inputRecord_9, inputRecord_10, inputRecord_11, inputRecord;
        loop:
        while (true) {
            const props_1 = props_1_mut, b = b_mut;
            const updateData = (data) => {
                b.Data = data;
                return b;
            };
            const addShared = (creator) => {
                b.SharedCreator = creator;
                return b;
            };
            const addCamera_1 = (creator_1) => {
                b.CameraCreators = cons(curry(2, creator_1), b.CameraCreators);
                return b;
            };
            const addObject_1 = (creator_2) => {
                b.ObjectCreators = cons(curry(2, creator_2), b.ObjectCreators);
                return b;
            };
            const createLayers = (count) => map_1(createLayer, Int32Array.from(rangeNumber(0, 1, count - 1)));
            if (props_1.tail != null) {
                const t = props_1.tail;
                const h = props_1.head;
                switch (h.tag) {
                    case 3: {
                        const x_1 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_1 = b.Data, new Data_GlSceneData(inputRecord_1.Id, inputRecord_1.Name, inputRecord_1.IsDirty, inputRecord_1.Canvas, x_1, inputRecord_1.ClearMask, inputRecord_1.WorldBounds, inputRecord_1.SceneBounds, inputRecord_1.WorldScale, inputRecord_1.LineWidthScale, inputRecord_1.ClearSceneBackground, inputRecord_1.Layers, inputRecord_1.DefaultLayer, inputRecord_1.Shared, inputRecord_1.Cameras)));
                        continue loop;
                    }
                    case 4: {
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_2 = b.Data, new Data_GlSceneData(inputRecord_2.Id, inputRecord_2.Name, inputRecord_2.IsDirty, inputRecord_2.Canvas, inputRecord_2.SceneBackground, b.Data.ClearMask | 16384, inputRecord_2.WorldBounds, inputRecord_2.SceneBounds, inputRecord_2.WorldScale, inputRecord_2.LineWidthScale, inputRecord_2.ClearSceneBackground, inputRecord_2.Layers, inputRecord_2.DefaultLayer, inputRecord_2.Shared, inputRecord_2.Cameras)));
                        continue loop;
                    }
                    case 5: {
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_3 = b.Data, new Data_GlSceneData(inputRecord_3.Id, inputRecord_3.Name, inputRecord_3.IsDirty, inputRecord_3.Canvas, inputRecord_3.SceneBackground, b.Data.ClearMask | 256, inputRecord_3.WorldBounds, inputRecord_3.SceneBounds, inputRecord_3.WorldScale, inputRecord_3.LineWidthScale, inputRecord_3.ClearSceneBackground, inputRecord_3.Layers, inputRecord_3.DefaultLayer, inputRecord_3.Shared, inputRecord_3.Cameras)));
                        continue loop;
                    }
                    case 6: {
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_4 = b.Data, new Data_GlSceneData(inputRecord_4.Id, inputRecord_4.Name, inputRecord_4.IsDirty, inputRecord_4.Canvas, inputRecord_4.SceneBackground, b.Data.ClearMask | 1024, inputRecord_4.WorldBounds, inputRecord_4.SceneBounds, inputRecord_4.WorldScale, inputRecord_4.LineWidthScale, inputRecord_4.ClearSceneBackground, inputRecord_4.Layers, inputRecord_4.DefaultLayer, inputRecord_4.Shared, inputRecord_4.Cameras)));
                        continue loop;
                    }
                    case 7: {
                        const x_2 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_5 = b.Data, new Data_GlSceneData(inputRecord_5.Id, inputRecord_5.Name, inputRecord_5.IsDirty, inputRecord_5.Canvas, inputRecord_5.SceneBackground, x_2, inputRecord_5.WorldBounds, inputRecord_5.SceneBounds, inputRecord_5.WorldScale, inputRecord_5.LineWidthScale, inputRecord_5.ClearSceneBackground, inputRecord_5.Layers, inputRecord_5.DefaultLayer, inputRecord_5.Shared, inputRecord_5.Cameras)));
                        continue loop;
                    }
                    case 8: {
                        const x_3 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_6 = b.Data, new Data_GlSceneData(inputRecord_6.Id, inputRecord_6.Name, inputRecord_6.IsDirty, inputRecord_6.Canvas, inputRecord_6.SceneBackground, inputRecord_6.ClearMask, x_3, inputRecord_6.SceneBounds, inputRecord_6.WorldScale, inputRecord_6.LineWidthScale, inputRecord_6.ClearSceneBackground, inputRecord_6.Layers, inputRecord_6.DefaultLayer, inputRecord_6.Shared, inputRecord_6.Cameras)));
                        continue loop;
                    }
                    case 9: {
                        const x_4 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_7 = b.Data, new Data_GlSceneData(inputRecord_7.Id, inputRecord_7.Name, inputRecord_7.IsDirty, inputRecord_7.Canvas, inputRecord_7.SceneBackground, inputRecord_7.ClearMask, inputRecord_7.WorldBounds, x_4, inputRecord_7.WorldScale, inputRecord_7.LineWidthScale, inputRecord_7.ClearSceneBackground, inputRecord_7.Layers, inputRecord_7.DefaultLayer, inputRecord_7.Shared, inputRecord_7.Cameras)));
                        continue loop;
                    }
                    case 10: {
                        const x_5 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_8 = b.Data, new Data_GlSceneData(inputRecord_8.Id, inputRecord_8.Name, inputRecord_8.IsDirty, inputRecord_8.Canvas, inputRecord_8.SceneBackground, inputRecord_8.ClearMask, inputRecord_8.WorldBounds, inputRecord_8.SceneBounds, x_5, 1 / x_5, inputRecord_8.ClearSceneBackground, inputRecord_8.Layers, inputRecord_8.DefaultLayer, inputRecord_8.Shared, inputRecord_8.Cameras)));
                        continue loop;
                    }
                    case 11: {
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_9 = b.Data, new Data_GlSceneData(inputRecord_9.Id, inputRecord_9.Name, inputRecord_9.IsDirty, inputRecord_9.Canvas, inputRecord_9.SceneBackground, inputRecord_9.ClearMask, inputRecord_9.WorldBounds, inputRecord_9.SceneBounds, inputRecord_9.WorldScale, inputRecord_9.LineWidthScale, false, inputRecord_9.Layers, inputRecord_9.DefaultLayer, inputRecord_9.Shared, inputRecord_9.Cameras)));
                        continue loop;
                    }
                    case 1: {
                        const x_6 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_10 = b.Data, new Data_GlSceneData(inputRecord_10.Id, inputRecord_10.Name, inputRecord_10.IsDirty, inputRecord_10.Canvas, inputRecord_10.SceneBackground, inputRecord_10.ClearMask, inputRecord_10.WorldBounds, inputRecord_10.SceneBounds, inputRecord_10.WorldScale, inputRecord_10.LineWidthScale, inputRecord_10.ClearSceneBackground, createLayers(x_6), inputRecord_10.DefaultLayer, inputRecord_10.Shared, inputRecord_10.Cameras)));
                        continue loop;
                    }
                    case 2: {
                        const x_7 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_11 = b.Data, new Data_GlSceneData(inputRecord_11.Id, inputRecord_11.Name, inputRecord_11.IsDirty, inputRecord_11.Canvas, inputRecord_11.SceneBackground, inputRecord_11.ClearMask, inputRecord_11.WorldBounds, inputRecord_11.SceneBounds, inputRecord_11.WorldScale, inputRecord_11.LineWidthScale, inputRecord_11.ClearSceneBackground, inputRecord_11.Layers, x_7, inputRecord_11.Shared, inputRecord_11.Cameras)));
                        continue loop;
                    }
                    case 13: {
                        const x_8 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addShared(x_8);
                        continue loop;
                    }
                    case 12: {
                        const x_9 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addCamera_1(x_9);
                        continue loop;
                    }
                    case 14: {
                        const x_10 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addObject_1(x_10);
                        continue loop;
                    }
                    default: {
                        const x = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord = b.Data, new Data_GlSceneData(inputRecord.Id, x, inputRecord.IsDirty, inputRecord.Canvas, inputRecord.SceneBackground, inputRecord.ClearMask, inputRecord.WorldBounds, inputRecord.SceneBounds, inputRecord.WorldScale, inputRecord.LineWidthScale, inputRecord.ClearSceneBackground, inputRecord.Layers, inputRecord.DefaultLayer, inputRecord.Shared, inputRecord.Cameras)));
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

export function create(canvas, props) {
    const gl = canvas.Context;
    const worldBounds = Bounds__Clone(canvas.WorldBounds);
    const sharedCreator = (props_1, scene) => create_2("emptyVertex", "emptyFragment", canvas.Global, scene, props_1);
    return build(apply(props, new Builder(empty(), empty(), sharedCreator, new Data_GlSceneData(0, "", true, canvas, Vec4_Create(), 16384, worldBounds, BoundsModule_boundsSizeV(canvas.Size), 1, 1, false, [createLayer(0)], 0, void 0, empty()))));
}

export function clearSceneBackground(data) {
    const gl = data.Canvas.Context;
    const vp = Bounds__get_Values(data.SceneBounds);
    const cc = Vec4__get_Values(data.SceneBackground);
    gl.scissor(vp[0], vp[1], vp[2], vp[3]);
    gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
    gl.enable(gl.SCISSOR_TEST);
    gl.clear(data.ClearMask);
    gl.disable(gl.SCISSOR_TEST);
}

export function render(data) {
    const updateCameraViewport = (camera, viewport) => {
        const vp = getGlViewportValues(camera);
        setValue(vp, viewport);
    };
    const updateCameraZoom = (camera_1, zoom) => {
        const z = getZoom(camera_1);
        setValue(z, zoom);
    };
    const renderCamera = (camera_2) => {
        update(camera_2, data.Shared);
        render_1(camera_2);
    };
    const renderCameraMat = (projMat, viewMat, camera_3) => {
        update_1(camera_3);
        setValue(Mat4__get_Values(camera_3.ProjectionMatrix), projMat);
        setValue(Mat4__get_Values(camera_3.ViewMatrix), viewMat);
        update(camera_3, data.Shared);
        render_1(camera_3);
    };
    if (data.IsDirty) {
        if (data.ClearSceneBackground) {
            clearSceneBackground(data);
        }
        const glob = data.Canvas.Global;
        const viewport_1 = tryGetUniform("viewport")(data.Shared);
        const projMat_1 = tryGetUniform("projMat")(data.Shared);
        const viewMat_1 = tryGetUniform("viewMat")(data.Shared);
        const zoom_1 = tryGetUniform("zoom")(data.Shared);
        const matchValue = tryGetUniform("worldScale")(glob);
        if (matchValue != null) {
            const uWorldScale = matchValue;
            setValue(data.WorldScale, uWorldScale);
            update(head(data.Cameras), glob);
        }
        const renderCam = (camera_5) => {
            call(partialApply(1, updateCameraViewport, [camera_5]), viewport_1);
            call(partialApply(1, updateCameraZoom, [camera_5]), zoom_1);
            const matchValue_1 = [projMat_1, viewMat_1];
            let pattern_matching_result, proj, view;
            if (matchValue_1[0] != null) {
                if (matchValue_1[1] != null) {
                    pattern_matching_result = 0;
                    proj = matchValue_1[0];
                    view = matchValue_1[1];
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
                    renderCameraMat(proj, view, camera_5);
                    break;
                }
                case 1: {
                    renderCamera(camera_5);
                    break;
                }
            }
        };
        iterate(renderCam, data.Cameras);
        _cleanLinkedBuffers(data.Shared);
        iterate_1((data_5) => {
            _cleanLinkedBuffers(data_5);
        }, objects(data));
    }
}

export function pixelsToWorld(pixels, data) {
    return pixels * data.LineWidthScale;
}

export function worldToPixels(value, data) {
    return (value * data.WorldScale) * 1;
}

