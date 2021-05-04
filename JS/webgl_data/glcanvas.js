import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { record_type, lambda_type, list_type, class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { GlContextAttribute, GlPixelStorage$reflection, GlContextAttribute$reflection } from "./webgl_data_types.js";
import { BuilderTypes_GlObjProp, BuilderTypes_GlSceneProp, Data_GlCanvasData, Data_GlCanvasData$reflection, BuilderTypes_GlSceneProp$reflection, Data_GlObjData$reflection, Data_GlSceneData$reflection, BuilderTypes_GlObjProp$reflection } from "./webgl_data.js";
import { getScene as getScene_1, removeScene as removeScene_1, addScene as addScene_2 } from "./glcommon.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { enumName } from "../core/utils.js";
import { GlPixelStoreParamT } from "../webgl_core/webgl_types.js";
import { keyValueList } from "../.fable/fable-library.3.0.0/MapUtil.js";
import { some } from "../.fable/fable-library.3.0.0/Option.js";
import { head, cons, reverse, singleton, map, empty } from "../.fable/fable-library.3.0.0/List.js";
import { comparePrimitives, equals, curry, mapCurriedArgs } from "../.fable/fable-library.3.0.0/Util.js";
import { render as render_1, create as create_1 } from "./glscene.js";
import { Vec2__get_Values, Vec4__get_Values, Vec4_Create, Vec2_Create_7B00E9A0, Vec2__WithY_Z6C68B1C0, Vec2__WithX_Z6C68B1C0 } from "../core/vectors.js";
import { update, tryGetUniform, create as create_2 } from "./globj.js";
import { GlCanvasParams_$ctor } from "./glcanvasparams.js";
import { BoundsModule_boundsSizeV } from "../twod/bounds.js";
import { GlMouse__get_Position, GlMouse_$ctor_Z38C79397 } from "./glmouse.js";
import { equalsWith } from "../.fable/fable-library.3.0.0/Array.js";
import { setValue } from "./gluniform.js";
import { call } from "../core/optionex.js";

class Builder extends Record {
    constructor(Canvas, Attributes, PixelStorageParams, GlobalCreator, SceneCreators, Data) {
        super();
        this.Canvas = Canvas;
        this.Attributes = Attributes;
        this.PixelStorageParams = PixelStorageParams;
        this.GlobalCreator = GlobalCreator;
        this.SceneCreators = SceneCreators;
        this.Data = Data;
    }
}

function Builder$reflection() {
    return record_type("GlCanvas.Builder", [], Builder, () => [["Canvas", class_type("Browser.Types.HTMLCanvasElement")], ["Attributes", list_type(GlContextAttribute$reflection())], ["PixelStorageParams", list_type(GlPixelStorage$reflection())], ["GlobalCreator", lambda_type(list_type(BuilderTypes_GlObjProp$reflection()), lambda_type(Data_GlSceneData$reflection(), Data_GlObjData$reflection()))], ["SceneCreators", list_type(lambda_type(list_type(BuilderTypes_GlSceneProp$reflection()), lambda_type(Data_GlCanvasData$reflection(), Data_GlSceneData$reflection())))], ["Data", Data_GlCanvasData$reflection()]]);
}

export const addScene = (creator) => ((data) => addScene_2(creator, data));

export const removeScene = (scene) => ((data) => removeScene_1(scene, data));

export const getScene = (name) => ((data) => getScene_1(name, data));

export function getSceneCount(data) {
    return data.Scenes.length;
}

export function getSceneByIndex(index, data) {
    return data.Scenes[index];
}

export function dirty(data) {
    data.IsDirty = true;
}

export function clean(data) {
    data.IsDirty = false;
}

function applyPixelStorageParams(gl, builder) {
    const loop = (storageParams_mut) => {
        loop:
        while (true) {
            const storageParams = storageParams_mut;
            if (storageParams.tail != null) {
                const remaining = storageParams.tail;
                const param = storageParams.head;
                switch (param.tag) {
                    case 1: {
                        const x_1 = param.fields[0] | 0;
                        const param_2 = 3317;
                        const value_1 = x_1 | 0;
                        gl.pixelStorei(param_2, value_1);
                        break;
                    }
                    case 2: {
                        const param_3 = 37440;
                        const value_2 = 1;
                        gl.pixelStorei(param_3, value_2);
                        break;
                    }
                    case 3: {
                        const param_4 = 37441;
                        const value_3 = 1;
                        gl.pixelStorei(param_4, value_3);
                        break;
                    }
                    case 4: {
                        const x_2 = param.fields[0] | 0;
                        const param_5 = 37443;
                        const value_4 = x_2 | 0;
                        gl.pixelStorei(param_5, value_4);
                        break;
                    }
                    case 5: {
                        const x_3 = param.fields[0] | 0;
                        const param_6 = 3330;
                        const value_5 = x_3 | 0;
                        gl.pixelStorei(param_6, value_5);
                        break;
                    }
                    case 6: {
                        const x_4 = param.fields[0] | 0;
                        const param_7 = 3332;
                        const value_6 = x_4 | 0;
                        gl.pixelStorei(param_7, value_6);
                        break;
                    }
                    case 7: {
                        const x_5 = param.fields[0] | 0;
                        const param_8 = 3331;
                        const value_7 = x_5 | 0;
                        gl.pixelStorei(param_8, value_7);
                        break;
                    }
                    case 8: {
                        const x_6 = param.fields[0] | 0;
                        const param_9 = 3314;
                        const value_8 = x_6 | 0;
                        gl.pixelStorei(param_9, value_8);
                        break;
                    }
                    case 9: {
                        const x_7 = param.fields[0] | 0;
                        const param_10 = 32878;
                        const value_9 = x_7 | 0;
                        gl.pixelStorei(param_10, value_9);
                        break;
                    }
                    case 10: {
                        const x_8 = param.fields[0] | 0;
                        const param_11 = 3316;
                        const value_10 = x_8 | 0;
                        gl.pixelStorei(param_11, value_10);
                        break;
                    }
                    case 11: {
                        const x_9 = param.fields[0] | 0;
                        const param_12 = 3315;
                        const value_11 = x_9 | 0;
                        gl.pixelStorei(param_12, value_11);
                        break;
                    }
                    case 12: {
                        const x_10 = param.fields[0] | 0;
                        const param_13 = 32877;
                        const value_12 = x_10 | 0;
                        gl.pixelStorei(param_13, value_12);
                        break;
                    }
                    default: {
                        const x = param.fields[0] | 0;
                        const param_1 = 3333;
                        const value = x | 0;
                        gl.pixelStorei(param_1, value);
                    }
                }
                storageParams_mut = remaining;
                continue loop;
            }
            break;
        }
    };
    loop(builder.PixelStorageParams);
}

function updateContext(builder) {
    const canvas = builder.Canvas;
    const data = builder.Data;
    canvas.width = data.Size.values[0];
    canvas.height = data.Size.values[1];
    const att = keyValueList(builder.Attributes, 1);
    const gl = canvas.getContext("webgl2", some(att));
    applyPixelStorageParams(gl, builder);
    const inputRecord = builder.Data;
    builder.Data = (new Data_GlCanvasData(inputRecord.Name, inputRecord.IsDirty, gl, inputRecord.Params, inputRecord.CanvasBackground, inputRecord.ClearMask, inputRecord.ClearCanvas, inputRecord.Size, inputRecord.WorldBounds, inputRecord.Mouse, inputRecord.Global, inputRecord.Scenes));
    return builder;
}

function applyCreators(builder) {
    const data = builder.Data;
    const createScene = (creator) => creator(empty(), data);
    const createScenes = (creators) => map(mapCurriedArgs(createScene, [[0, 2]]), creators);
    const createGlobal = (creator_1) => {
        const scene = create_1(data, singleton(new BuilderTypes_GlSceneProp(0, "globalScene")));
        return creator_1(singleton(new BuilderTypes_GlObjProp(0, "global")), scene);
    };
    data.Global = createGlobal(builder.GlobalCreator);
    data.Scenes = Array.from(createScenes(reverse(builder.SceneCreators)));
    return data;
}

function build(builder) {
    return applyCreators(updateContext(builder));
}

function apply(props, builder) {
    const loop = (props_1_mut, b_mut) => {
        let inputRecord_1, inputRecord_2, inputRecord_3, inputRecord_4, inputRecord_5, inputRecord_6, inputRecord_7, inputRecord_8, inputRecord_9, _, value, inputRecord_10, __1, value_1, inputRecord;
        loop:
        while (true) {
            const props_1 = props_1_mut, b = b_mut;
            const updateData = (data) => {
                b.Data = data;
                return b;
            };
            const addGlobal = (creator) => {
                b.GlobalCreator = creator;
                return b;
            };
            const addScene_1 = (creator_1) => {
                b.SceneCreators = cons(curry(2, creator_1), b.SceneCreators);
                return b;
            };
            const addAttribute = (x) => {
                b.Attributes = cons(x, b.Attributes);
                return b;
            };
            const addPixelStorage = (x_1) => {
                b.PixelStorageParams = cons(x_1, b.PixelStorageParams);
                return b;
            };
            if (props_1.tail != null) {
                const t = props_1.tail;
                const h = props_1.head;
                switch (h.tag) {
                    case 5: {
                        const x_3 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addAttribute(x_3);
                        continue loop;
                    }
                    case 6: {
                        const x_4 = h.fields[0];
                        props_1_mut = t;
                        b_mut = (b.PixelStorageParams = x_4, b);
                        continue loop;
                    }
                    case 7: {
                        const x_5 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addPixelStorage(x_5);
                        continue loop;
                    }
                    case 8: {
                        const x_6 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_1 = b.Data, new Data_GlCanvasData(inputRecord_1.Name, inputRecord_1.IsDirty, inputRecord_1.Context, inputRecord_1.Params, x_6, inputRecord_1.ClearMask, inputRecord_1.ClearCanvas, inputRecord_1.Size, inputRecord_1.WorldBounds, inputRecord_1.Mouse, inputRecord_1.Global, inputRecord_1.Scenes)));
                        continue loop;
                    }
                    case 9: {
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_2 = b.Data, new Data_GlCanvasData(inputRecord_2.Name, inputRecord_2.IsDirty, inputRecord_2.Context, inputRecord_2.Params, inputRecord_2.CanvasBackground, b.Data.ClearMask | 16384, inputRecord_2.ClearCanvas, inputRecord_2.Size, inputRecord_2.WorldBounds, inputRecord_2.Mouse, inputRecord_2.Global, inputRecord_2.Scenes)));
                        continue loop;
                    }
                    case 10: {
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_3 = b.Data, new Data_GlCanvasData(inputRecord_3.Name, inputRecord_3.IsDirty, inputRecord_3.Context, inputRecord_3.Params, inputRecord_3.CanvasBackground, b.Data.ClearMask | 256, inputRecord_3.ClearCanvas, inputRecord_3.Size, inputRecord_3.WorldBounds, inputRecord_3.Mouse, inputRecord_3.Global, inputRecord_3.Scenes)));
                        continue loop;
                    }
                    case 11: {
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_4 = b.Data, new Data_GlCanvasData(inputRecord_4.Name, inputRecord_4.IsDirty, inputRecord_4.Context, inputRecord_4.Params, inputRecord_4.CanvasBackground, b.Data.ClearMask | 1024, inputRecord_4.ClearCanvas, inputRecord_4.Size, inputRecord_4.WorldBounds, inputRecord_4.Mouse, inputRecord_4.Global, inputRecord_4.Scenes)));
                        continue loop;
                    }
                    case 12: {
                        const x_7 = h.fields[0] | 0;
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_5 = b.Data, new Data_GlCanvasData(inputRecord_5.Name, inputRecord_5.IsDirty, inputRecord_5.Context, inputRecord_5.Params, inputRecord_5.CanvasBackground, x_7, inputRecord_5.ClearCanvas, inputRecord_5.Size, inputRecord_5.WorldBounds, inputRecord_5.Mouse, inputRecord_5.Global, inputRecord_5.Scenes)));
                        continue loop;
                    }
                    case 13: {
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_6 = b.Data, new Data_GlCanvasData(inputRecord_6.Name, inputRecord_6.IsDirty, inputRecord_6.Context, inputRecord_6.Params, inputRecord_6.CanvasBackground, inputRecord_6.ClearMask, false, inputRecord_6.Size, inputRecord_6.WorldBounds, inputRecord_6.Mouse, inputRecord_6.Global, inputRecord_6.Scenes)));
                        continue loop;
                    }
                    case 4: {
                        const x_8 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_7 = b.Data, new Data_GlCanvasData(inputRecord_7.Name, inputRecord_7.IsDirty, inputRecord_7.Context, inputRecord_7.Params, inputRecord_7.CanvasBackground, inputRecord_7.ClearMask, inputRecord_7.ClearCanvas, inputRecord_7.Size, x_8, inputRecord_7.Mouse, inputRecord_7.Global, inputRecord_7.Scenes)));
                        continue loop;
                    }
                    case 1: {
                        const x_9 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_8 = b.Data, new Data_GlCanvasData(inputRecord_8.Name, inputRecord_8.IsDirty, inputRecord_8.Context, inputRecord_8.Params, inputRecord_8.CanvasBackground, inputRecord_8.ClearMask, inputRecord_8.ClearCanvas, x_9, inputRecord_8.WorldBounds, inputRecord_8.Mouse, inputRecord_8.Global, inputRecord_8.Scenes)));
                        continue loop;
                    }
                    case 2: {
                        const x_10 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_9 = b.Data, new Data_GlCanvasData(inputRecord_9.Name, inputRecord_9.IsDirty, inputRecord_9.Context, inputRecord_9.Params, inputRecord_9.CanvasBackground, inputRecord_9.ClearMask, inputRecord_9.ClearCanvas, ((_ = b.Data.Size, (value = Vec2__WithX_Z6C68B1C0(_.v.contents, x_10, _.v.contents), void value)), b.Data.Size), inputRecord_9.WorldBounds, inputRecord_9.Mouse, inputRecord_9.Global, inputRecord_9.Scenes)));
                        continue loop;
                    }
                    case 3: {
                        const x_12 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord_10 = b.Data, new Data_GlCanvasData(inputRecord_10.Name, inputRecord_10.IsDirty, inputRecord_10.Context, inputRecord_10.Params, inputRecord_10.CanvasBackground, inputRecord_10.ClearMask, inputRecord_10.ClearCanvas, ((__1 = b.Data.Size, (value_1 = Vec2__WithY_Z6C68B1C0(__1.v.contents, x_12, __1.v.contents), void value_1)), b.Data.Size), inputRecord_10.WorldBounds, inputRecord_10.Mouse, inputRecord_10.Global, inputRecord_10.Scenes)));
                        continue loop;
                    }
                    case 14: {
                        const x_13 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addGlobal(x_13);
                        continue loop;
                    }
                    case 15: {
                        const x_14 = h.fields[0];
                        props_1_mut = t;
                        b_mut = addScene_1(x_14);
                        continue loop;
                    }
                    case 16: {
                        const x_15 = h.fields[0];
                        props_1_mut = t;
                        b_mut = (b.Attributes = x_15, b);
                        continue loop;
                    }
                    case 17: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(0, false));
                        continue loop;
                    }
                    case 18: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(1, true));
                        continue loop;
                    }
                    case 19: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(2, false));
                        continue loop;
                    }
                    case 20: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(3, false));
                        continue loop;
                    }
                    case 21: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(4, true));
                        continue loop;
                    }
                    case 22: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(6, false));
                        continue loop;
                    }
                    case 23: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(7, true));
                        continue loop;
                    }
                    case 24: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(8, true));
                        continue loop;
                    }
                    case 25: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(5, "default"));
                        continue loop;
                    }
                    case 26: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(5, "high-performance"));
                        continue loop;
                    }
                    case 27: {
                        props_1_mut = t;
                        b_mut = addAttribute(new GlContextAttribute(5, "low-power"));
                        continue loop;
                    }
                    default: {
                        const x_2 = h.fields[0];
                        props_1_mut = t;
                        b_mut = updateData((inputRecord = b.Data, new Data_GlCanvasData(x_2, inputRecord.IsDirty, inputRecord.Context, inputRecord.Params, inputRecord.CanvasBackground, inputRecord.ClearMask, inputRecord.ClearCanvas, inputRecord.Size, inputRecord.WorldBounds, inputRecord.Mouse, inputRecord.Global, inputRecord.Scenes)));
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

export function create(canvasId, props) {
    let canvas;
    const matchValue = document.getElementById(canvasId);
    if (equals(matchValue, null)) {
        const msg = toText(interpolate("Could not find canvas with ID \u0027%P()\u0027.", [canvasId]));
        throw (new Error(msg));
    }
    else {
        const element = matchValue;
        if (element.nodeName.toLocaleLowerCase() === "canvas") {
            canvas = element;
        }
        else {
            const c = document.createElement("canvas");
            const value = element.appendChild(c);
            void value;
            canvas = c;
        }
    }
    const canvasSize = Vec2_Create_7B00E9A0(canvas.width, canvas.height);
    const globalCreator = (props_1, scene) => create_2("globalVertex2d", "emptyFragment", void 0, scene, props_1);
    return build(apply(props, new Builder(canvas, empty(), empty(), globalCreator, empty(), new Data_GlCanvasData(canvasId, true, null, GlCanvasParams_$ctor(), Vec4_Create(), 16384, false, canvasSize, BoundsModule_boundsSizeV(canvasSize), GlMouse_$ctor_Z38C79397(canvas), void 0, []))));
}

function clearCanvas(data) {
    const gl = data.Context;
    const cc = Vec4__get_Values(data.CanvasBackground);
    gl.clearColor(cc[0], cc[1], cc[2], cc[3]);
    gl.clear(data.ClearMask);
}

function updateGlobal(time, data) {
    let value;
    const glob = data.Global;
    const uResolution = tryGetUniform("resolution")(glob);
    const uMouse = tryGetUniform("mouse")(glob);
    const uTime = tryGetUniform("time")(glob);
    if (uResolution != null) {
        const bounds = uResolution;
        const values = bounds.Value;
        const bvalues = Vec2__get_Values(data.Size);
        if (!equalsWith(comparePrimitives, values, bvalues)) {
            setValue(bvalues, bounds);
        }
    }
    call((value = Vec2__get_Values(GlMouse__get_Position(data.Mouse)), (data_1) => {
        setValue(value, data_1);
    }), uMouse);
    call((data_2) => {
        setValue(time, data_2);
    }, uTime);
    const cam = head(glob.Scene.Cameras);
    update(cam, glob);
}

export function render(time, data) {
    if (data.IsDirty) {
        if (data.ClearCanvas) {
            clearCanvas(data);
        }
        updateGlobal(time, data);
        data.Scenes.forEach((data_1) => {
            render_1(data_1);
        });
    }
    clean(data);
}

