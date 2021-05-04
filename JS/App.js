import { enabled } from "./js/jsutils.js";
import { interpolate, toText } from "./.fable/fable-library.3.0.0/String.js";
import { tryHead, collect, empty, concat, singleton, append, delay } from "./.fable/fable-library.3.0.0/Seq.js";
import { tryPick, map } from "./.fable/fable-library.3.0.0/Array.js";
import { some } from "./.fable/fable-library.3.0.0/Option.js";
import { dirty, getScene, addScene as addScene_1, render as render_1 } from "./webgl_data/glcanvas.js";
import { GlMouse__get_Changed, GlMouse__Update, GlMouse__get_WheelDelta, GlMouse__get_IsWheelEvent, GlMouse__IsDragEndEvent_Z524259A4, GlMouse__IsDragEvent_Z524259A4, GlMouse__DragOrigin_Z524259A4, GlMouse__get_Position, GlMouse__IsDragStartEvent_Z524259A4, Mouse_leftButton } from "./webgl_data/glmouse.js";
import { Vec2__Rotate_Z24CF60FF, Vec2_op_Subtraction_Z24FF8540, Vec2_op_Multiply_47807E55, Vec3_Create_Z18D5882D, Vec2_Create_7B00E9A0, Vec2_op_Subtraction_47807E55, Vec4_Create_Z27E3A4C0, Vec3_op_Addition_Z24FF85E0, Vec3_op_Subtraction_Z24FF85E0, Vec3_Create } from "./core/vectors.js";
import { iterate, head, ofArray, tryFind } from "./.fable/fable-library.3.0.0/List.js";
import { panToXYZ, panByXY, zoomToward, toWorldO, containsPoint } from "./webgl_data/glcamera.js";
import { uncurry, partialApply } from "./.fable/fable-library.3.0.0/Util.js";
import { objects } from "./webgl_data/glcommon.js";
import { call } from "./core/optionex.js";
import { setPosition } from "./webgl_data/globj.js";
import { add } from "./.fable/fable-library.3.0.0/Observable.js";
import { Bounds__InflatePct_5E38073B, BoundsModule_boundsCenterV, Bounds__get_Quadrant4, Bounds__get_Quadrant3, Bounds__get_Quadrant2, BoundsModule_bounds, BoundsModule_boundsCenter, Bounds__get_Quadrant1, Bounds__get_Size, Bounds__get_HalfSize, BoundsModule_boundsCenterHalf, BoundsModule_boundsSize } from "./twod/bounds.js";
import { CanvasProps_globalWithResolutionTime2d, Props_glscene, CameraProps_cameraClearDepthBuffer, SceneProps_sharedObjectWithCamera2d, SceneProps_orthoCam2d, CanvasProps_scene, Props_glcanvas } from "./webgl_objects/props.js";
import { BuilderTypes_GlCamProp, BuilderTypes_GlSceneProp, BuilderTypes_GlCanvasProp } from "./webgl_data/webgl_data.js";
import { GlRenderer__LinePath2D_5BF31CC8, GlRenderer__Line2D_515305A0, GlRenderer__Vector2D_Z270D9612, GlRenderer__Grid2D_Z270D9612, GlRenderer_$ctor } from "./webgl_objects/renderer.js";
import { Grid2D__set_MinorTick_5E38073B } from "./webgl_objects/grid2d.js";
import { pixelsToWorld, getCamera as getCamera_1 } from "./webgl_data/glscene.js";
import { WebglObject__set_Position2_Z3D47FC52, WebglObject__set_AngleDegreesZ_60759B6B, WebglObject__set_Scale_5E38073B, WebglObject__set_Position_Z3D47FC51 } from "./webgl_objects/webglobject.js";
import { VectorObject2D__set_Vector_Z3D47FC52, VectorObject2D__get_Vector } from "./webgl_objects/vectorobject2d.js";
import { QuadObjectBase__set_AliasWidth_21F3BA25, QuadObjectBase__set_FillColor_Z3D47FC58, QuadObjectBase__set_StrokeColor_Z3D47FC58 } from "./webgl_objects/quadobjectbase.js";
import { LineObjects2D__set_LineCap_7B1263D0, LineObjects2D__set_StrokeColor_Z3D47FC58, LineObjects2D__set_LineWidth_5E38073B } from "./webgl_objects/lineobjects2d.js";
import { LinePathObject2D__Set_Z58358D8E, LinePathObject2D__Add_50C79F88, LinePathObject2D__get_LineWidth, LinePathObject2D__set_MiterLimit_5E38073B, LinePathObject2D__set_LineJoin_Z229C3C20, LinePathObject2D__set_LineCap_7B1263D0, LinePathObject2D__set_StrokeColor_Z3D47FC58, LinePathObject2D__set_LineWidth_5E38073B, LinePathObject2D__Add_Z3D47FC52 } from "./webgl_objects/linepathobject2d.js";
import { RAD_PER_DEG } from "./core/utils.js";

enabled(true, true);

export const star = document.getElementById("star");

export const myCanvas = document.getElementById("myCanvas");

myCanvas.width = 400;

myCanvas.height = 400;

export const elFps = document.getElementById("fps");

export const elMouse = document.getElementById("mouse");

export function showMousePos(pos) {
    elMouse.textContent = toText(interpolate("%P()", [pos]));
}

export function Helpers_getUniforms(info) {
    return delay(() => append(singleton(info), delay(() => ((info.Children.length > 0) ? concat(map(Helpers_getUniforms, info.Children)) : empty()))));
}

export function Helpers_showUniforms(data) {
    const pinfo = data.ProgramInfo;
    console.log(some(toText(interpolate("%P()", [data.Name]))));
    console.table(some(Array.from(collect(Helpers_getUniforms, pinfo.Uniforms))));
}

export function Helpers_showUbos(data) {
    const pinfo = data.ProgramInfo;
    console.log(some(toText(interpolate("%P()", [data.Name]))));
    console.table(some(Array.from(collect((u) => u.Uniforms, pinfo.Ubos))));
}

export function Helpers_showAttributes(data) {
    const pinfo = data.ProgramInfo;
    console.log(some(toText(interpolate("%P()", [data.Name]))));
    console.table(some(Array.from(pinfo.Attributes)));
}

export function run(f) {
    const patternInput = f();
    const update = patternInput[2];
    const frames = patternInput[4] | 0;
    const desc = patternInput[0];
    const canvas = patternInput[1];
    const animating = patternInput[3];
    console.log(some(toText(interpolate("Test %P()", [desc]))));
    const mouse = canvas.Mouse;
    render_1(0, canvas);
    let active = false;
    let fps = 0;
    let frame = 1;
    let lastFpsTime = 0;
    let framesLastSecond = 0;
    const dragButton = Mouse_leftButton | 0;
    let dragging = false;
    let dragOffset = Vec3_Create();
    const getMouseCamera = (p) => {
        const getCamera = (p_1, scene) => tryFind((c) => containsPoint(p_1, c), scene.Cameras);
        const array = canvas.Scenes;
        return tryPick(partialApply(1, getCamera, [p]), array);
    };
    const processMouse = () => {
        if (GlMouse__IsDragStartEvent_Z524259A4(mouse, dragButton)) {
            const matchValue = getMouseCamera(GlMouse__get_Position(mouse));
            if (matchValue != null) {
                const cam = matchValue;
                dragging = true;
                const scene_1 = cam.Scene;
                const origin = toWorldO(GlMouse__DragOrigin_Z524259A4(mouse, dragButton), Vec3_Create(), cam);
                const obj1 = tryHead(objects(scene_1));
                call((o) => {
                    dragOffset = Vec3_op_Subtraction_Z24FF85E0(o.Position, origin);
                }, obj1);
            }
        }
        if (GlMouse__IsDragEvent_Z524259A4(mouse, dragButton) ? dragging : false) {
            const matchValue_1 = getMouseCamera(GlMouse__get_Position(mouse));
            if (matchValue_1 != null) {
                const cam_1 = matchValue_1;
                const scene_2 = cam_1.Scene;
                const worldPos = toWorldO(GlMouse__get_Position(mouse), Vec3_Create(), cam_1);
                const obj1_1 = tryHead(objects(scene_2));
                call((o_1) => {
                    setPosition(Vec3_op_Addition_Z24FF85E0(worldPos, dragOffset), o_1);
                }, obj1_1);
            }
        }
        if (GlMouse__IsDragEndEvent_Z524259A4(mouse, dragButton)) {
            dragging = true;
        }
        if (GlMouse__get_IsWheelEvent(mouse)) {
            const matchValue_2 = getMouseCamera(GlMouse__get_Position(mouse));
            if (matchValue_2 != null) {
                const cam_2 = matchValue_2;
                if (GlMouse__get_WheelDelta(mouse).values[1] !== 0) {
                    const zoom = (GlMouse__get_WheelDelta(mouse).values[1] > 0) ? 1.03 : 0.97;
                    const worldPos_1 = toWorldO(GlMouse__get_Position(mouse), Vec3_Create(), cam_2);
                    zoomToward(worldPos_1, zoom, cam_2);
                }
                if (GlMouse__get_WheelDelta(mouse).values[0] !== 0) {
                    const amount = (GlMouse__get_WheelDelta(mouse).values[0] > 0) ? 10 : -10;
                    panByXY(amount, 0, cam_2);
                }
            }
        }
    };
    const render = (time) => {
        const seconds = time / 1000;
        frame = (frame + 1);
        if (animating ? (frame < frames) : false) {
            const value = window.requestAnimationFrame(render);
            void value;
        }
        else {
            active = false;
        }
        GlMouse__Update(mouse);
        showMousePos(GlMouse__get_Position(mouse));
        processMouse();
        if (animating) {
            update(seconds);
        }
        render_1(seconds, canvas);
        if ((seconds - lastFpsTime) >= 1) {
            const t = 0.75;
            fps = ((fps * (1 - t)) + (framesLastSecond * t));
            lastFpsTime = seconds;
            framesLastSecond = 0;
            elFps.textContent = toText(interpolate("%3.1f%P()", [fps]));
        }
        framesLastSecond = (framesLastSecond + 1);
    };
    const scheduleRender = () => {
        if (!active) {
            const value_1 = window.requestAnimationFrame(render);
            void value_1;
        }
    };
    add(scheduleRender, GlMouse__get_Changed(mouse));
    if (animating ? (frame < frames) : false) {
        scheduleRender();
        active = true;
    }
}

export function testGridObject() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const dim = 34;
    const worldBounds = BoundsModule_boundsCenterHalf(0, 0, dim, dim);
    const worldScale = Bounds__get_HalfSize(viewport).values[0] / dim;
    const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(10, worldScale), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_sharedObjectWithCamera2d]))]));
    const renderer = GlRenderer_$ctor();
    const scene = canvas.Scenes[0];
    const grid = GlRenderer__Grid2D_Z270D9612(renderer, scene, Vec2_op_Subtraction_47807E55(Bounds__get_Size(worldBounds), 4), 2);
    const update = (time) => {
        Grid2D__set_MinorTick_5E38073B(grid, (time % 5) + 1);
    };
    return ["grid", canvas, update, false, 60 * 2];
}

export function testParallax() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const halfDim = 34;
    const dim = halfDim * 2;
    const worldBounds = BoundsModule_boundsCenterHalf(0, 0, dim, dim);
    const worldScale = Bounds__get_HalfSize(viewport).values[0] / halfDim;
    const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(10, worldScale), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam2"), new BuilderTypes_GlCamProp(14, Bounds__get_Quadrant1(viewport)), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0.4, 0.4, 0, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_sharedObjectWithCamera2d]))]));
    const renderer = GlRenderer_$ctor();
    const scene = canvas.Scenes[0];
    const cam = head(scene.Cameras);
    const cam2 = getCamera_1("cam2")(scene);
    const grid = GlRenderer__Grid2D_Z270D9612(renderer, scene, Vec2_op_Subtraction_47807E55(Bounds__get_Size(worldBounds), 2), 2, "", "", "cam", 4.5);
    const v1 = GlRenderer__Vector2D_Z270D9612(renderer, scene, Vec2_Create_7B00E9A0(5, -10), -1, "v1", "", "cam", 2.1);
    const v2 = GlRenderer__Vector2D_Z270D9612(renderer, scene, Vec2_Create_7B00E9A0(10, 10), -1, "v2", "", "cam", 1);
    WebglObject__set_Position_Z3D47FC51(v1, Vec3_Create_Z18D5882D(VectorObject2D__get_Vector(v2), 0));
    v1["Wil.Webgl.QuadObjectBase.set_LineWidth"](8);
    v2["Wil.Webgl.QuadObjectBase.set_LineWidth"](10);
    QuadObjectBase__set_StrokeColor_Z3D47FC58(v2, Vec4_Create_Z27E3A4C0(0.3, 0, 0.5, 1));
    let angle = 0;
    const update = (time) => {
        const maxView = Vec2_op_Multiply_47807E55(Vec2_op_Subtraction_Z24FF8540(Bounds__get_Size(worldBounds), cam.ViewSize), 0.5);
        angle = (angle + 3);
        if (angle > 360) {
            angle = (angle - 360);
        }
        const sin = Math.sin(angle * (3.141592653589793 / 180));
        const x_5 = sin * maxView.values[0];
        const data_1 = cam;
        panToXYZ(x_5, 0, data_1.LookAt.values[2], data_1);
    };
    return ["Parallax", canvas, update, true, 60 * 10];
}

export function testLink() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const halfDim = 16;
    const dim = halfDim * 2;
    const worldBounds = BoundsModule_boundsCenter(0, 0, dim, dim);
    const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(10, 5), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_sharedObjectWithCamera2d]))]));
    const renderer = GlRenderer_$ctor();
    const scene = canvas.Scenes[0];
    const cam = head(scene.Cameras);
    const v1 = GlRenderer__Vector2D_Z270D9612(renderer, scene, Vec2_Create_7B00E9A0(5, 5), -1, "v1", "");
    const v2 = GlRenderer__Vector2D_Z270D9612(renderer, scene, Vec2_Create_7B00E9A0(5, -5), -1, "v2", "v1");
    const v3 = GlRenderer__Vector2D_Z270D9612(renderer, scene, Vec2_Create_7B00E9A0(5, 5), -1, "v3", "v2");
    v1["Wil.Webgl.QuadObjectBase.set_LineWidth"](3);
    QuadObjectBase__set_StrokeColor_Z3D47FC58(v1, Vec4_Create_Z27E3A4C0(0.3, 0, 0.5, 1));
    WebglObject__set_Position_Z3D47FC51(v2, Vec3_Create_Z18D5882D(VectorObject2D__get_Vector(v1), 0));
    v2["Wil.Webgl.QuadObjectBase.set_LineWidth"](3);
    WebglObject__set_Position_Z3D47FC51(v3, Vec3_Create_Z18D5882D(VectorObject2D__get_Vector(v2), 0));
    v3["Wil.Webgl.QuadObjectBase.set_LineWidth"](3);
    let angle = 0;
    const update = (time) => {
        const maxView = Vec2_op_Multiply_47807E55(Vec2_op_Subtraction_Z24FF8540(Bounds__get_Size(worldBounds), cam.ViewSize), 0.5);
        angle = (angle + 3);
        if (angle > 360) {
            angle = (angle - 360);
        }
        const sin = Math.sin(angle * (3.141592653589793 / 180));
        WebglObject__set_Scale_5E38073B(v1, 0.3 + Math.abs(sin));
        WebglObject__set_AngleDegreesZ_60759B6B(v1, angle * 1);
        WebglObject__set_AngleDegreesZ_60759B6B(v2, (sin * 360) * 1);
        WebglObject__set_Scale_5E38073B(v3, 0.3 + Math.abs(1.6 - sin));
    };
    return ["Link", canvas, update, false, 60 * 10];
}

export function testLine() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const ofs = 0;
    const ofs2 = ofs * 2;
    const viewport_1 = BoundsModule_bounds(ofs, ofs, myCanvas.width - ofs2, myCanvas.height - ofs2);
    const halfDim = 3;
    const dim = halfDim * 2;
    const worldBounds = BoundsModule_boundsCenter(0, 0, dim, dim);
    const worldScale = Bounds__get_HalfSize(viewport_1).values[0] / halfDim;
    const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(10, worldScale), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(14, viewport_1), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_sharedObjectWithCamera2d]))]));
    const renderer = GlRenderer_$ctor();
    const scene = canvas.Scenes[0];
    const cam = head(scene.Cameras);
    const grid = GlRenderer__Grid2D_Z270D9612(renderer, scene, Vec2_op_Subtraction_47807E55(Bounds__get_Size(worldBounds), 0), 2);
    const line1 = GlRenderer__Line2D_515305A0(renderer, scene, Vec2_Create_7B00E9A0(0, 0.5), Vec2_Create_7B00E9A0(2, 1.5));
    const line2 = GlRenderer__Line2D_515305A0(renderer, scene, Vec2_Create_7B00E9A0(2, -2), Vec2_Create_7B00E9A0(1, -1));
    const line3 = GlRenderer__Line2D_515305A0(renderer, scene, Vec2_Create_7B00E9A0(-1.5, -2), Vec2_Create_7B00E9A0(-0.5, -1));
    LineObjects2D__set_LineWidth_5E38073B(line1, worldScale);
    LineObjects2D__set_StrokeColor_Z3D47FC58(line1, Vec4_Create_Z27E3A4C0(0, 0, 1, 1));
    LineObjects2D__set_LineCap_7B1263D0(line1, 1);
    LineObjects2D__set_LineWidth_5E38073B(line2, worldScale * 0.5);
    LineObjects2D__set_LineCap_7B1263D0(line2, 2);
    LineObjects2D__set_LineWidth_5E38073B(line3, worldScale * 0.25);
    LineObjects2D__set_LineCap_7B1263D0(line3, 0);
    let angle = 0;
    const update = (time) => {
        angle = (angle + 3);
        if (angle > 360) {
            angle = (angle - 360);
        }
        const sin = Math.sin(angle * (3.141592653589793 / 180));
    };
    return ["Line", canvas, update, false, 60 * 10];
}

export function testLinePath() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const ofs = 0;
    const ofs2 = ofs * 2;
    const viewport_1 = BoundsModule_bounds(ofs, ofs, myCanvas.width - ofs2, myCanvas.height - ofs2);
    const halfDim = 3;
    const dim = halfDim * 2;
    const worldBounds = BoundsModule_boundsCenter(0, 0, dim, dim);
    const calcScale = (bounds) => (Bounds__get_HalfSize(bounds).values[0] / halfDim);
    const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17)]));
    const renderer = GlRenderer_$ctor();
    const addScene = (idx, bounds_1, join, cap) => {
        let props;
        const scene = addScene_1(uncurry(2, (props = ofArray([new BuilderTypes_GlSceneProp(9, bounds_1), new BuilderTypes_GlSceneProp(10, calcScale(bounds_1)), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, toText(interpolate("cam%P()", [idx]))), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), CameraProps_cameraClearDepthBuffer])), SceneProps_sharedObjectWithCamera2d]), (overrides) => ((canvas_1) => Props_glscene(props, overrides, canvas_1)))))(canvas);
        const value = head(scene.Cameras);
        void value;
        const value_1 = GlRenderer__Grid2D_Z270D9612(renderer, scene, Bounds__get_Size(worldBounds), 2, "grid");
        void value_1;
        const path1 = GlRenderer__LinePath2D_5BF31CC8(renderer, scene, [Vec2_Create_7B00E9A0(-2, 0.5), Vec2_Create_7B00E9A0(-0.5, 1.8), Vec2_Create_7B00E9A0(0.5, 0.5), Vec2_Create_7B00E9A0(2.3, 1.8)], -1, "path1");
        const path2 = GlRenderer__LinePath2D_5BF31CC8(renderer, scene, [Vec2_Create_7B00E9A0(2.5, 0), Vec2_Create_7B00E9A0(0.5, -0.5), Vec2_Create_7B00E9A0(-0.5, -2), Vec2_Create_7B00E9A0(-2, -0.5)], -1, "path2");
        LinePathObject2D__Add_Z3D47FC52(path1, Vec2_Create_7B00E9A0(2.5, 0));
        LinePathObject2D__set_LineWidth_5E38073B(path1, scene.WorldScale * 0.8);
        LinePathObject2D__set_StrokeColor_Z3D47FC58(path1, Vec4_Create_Z27E3A4C0(0, 0, 1, 0.4));
        LinePathObject2D__set_LineCap_7B1263D0(path1, cap);
        LinePathObject2D__set_LineJoin_Z229C3C20(path1, join);
        LinePathObject2D__set_MiterLimit_5E38073B(path1, 100 + (0.5 * LinePathObject2D__get_LineWidth(path1)));
        LinePathObject2D__Add_50C79F88(path2, [Vec2_Create_7B00E9A0(-1.5, -2), Vec2_Create_7B00E9A0(-2.8, -1)]);
        LinePathObject2D__set_LineWidth_5E38073B(path2, scene.WorldScale * 0.6);
        LinePathObject2D__set_StrokeColor_Z3D47FC58(path2, Vec4_Create_Z27E3A4C0(1, 0, 0, 0.1));
        LinePathObject2D__set_LineCap_7B1263D0(path2, cap);
        LinePathObject2D__set_LineJoin_Z229C3C20(path2, join);
        LinePathObject2D__set_MiterLimit_5E38073B(path2, 100 + (0.5 * LinePathObject2D__get_LineWidth(path2)));
        return [path1, path2];
    };
    const s_1 = ofArray([addScene(1, Bounds__get_Quadrant1(viewport_1), 4, 0), addScene(2, Bounds__get_Quadrant2(viewport_1), 3, 1), addScene(3, Bounds__get_Quadrant3(viewport_1), 5, 2), addScene(4, Bounds__get_Quadrant4(viewport_1), 3, 1)]);
    let angle = 0;
    const update = (time) => {
        const updatePaths = (sin) => {
            const y_14 = sin * 2.5;
            const v1 = Vec2_Create_7B00E9A0(2.5, y_14);
            const v2 = Vec2_Create_7B00E9A0(2.5, 0 - y_14);
            iterate((tupledArg) => {
                const p1 = tupledArg[0];
                const p2 = tupledArg[1];
                LinePathObject2D__Set_Z58358D8E(p1, 4, v1);
                LinePathObject2D__Set_Z58358D8E(p2, 0, v2);
            }, s_1);
        };
        angle = (angle + 0.4);
        if (angle > 360) {
            angle = (angle - 360);
        }
        const sin_1 = Math.sin(angle * (3.141592653589793 / 180));
        updatePaths(sin_1);
    };
    return ["Linepath", canvas, update, false, 60 * 120];
}

export function testLinePathAligned() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const ofs = 0;
    const ofs2 = ofs * 2;
    const viewport_1 = BoundsModule_bounds(ofs, ofs, myCanvas.width - ofs2, myCanvas.height - ofs2);
    const halfDim = 3;
    const dim = halfDim * 2;
    const worldBounds = BoundsModule_boundsCenter(0, 0, dim, dim);
    const calcScale = (bounds) => (Bounds__get_HalfSize(bounds).values[0] / halfDim);
    const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17)]));
    const renderer = GlRenderer_$ctor();
    const addScene = (bounds_1, join, cap) => {
        let props;
        const scene = addScene_1(uncurry(2, (props = ofArray([new BuilderTypes_GlSceneProp(9, bounds_1), new BuilderTypes_GlSceneProp(10, calcScale(bounds_1)), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), CameraProps_cameraClearDepthBuffer, new BuilderTypes_GlCamProp(7, 10)])), SceneProps_sharedObjectWithCamera2d]), (overrides) => ((canvas_1) => Props_glscene(props, overrides, canvas_1)))))(canvas);
        const value = head(scene.Cameras);
        void value;
        const value_1 = GlRenderer__Grid2D_Z270D9612(renderer, scene, Bounds__get_Size(worldBounds), 2, "grid");
        void value_1;
        const addPath = (name, color, points) => {
            const path = GlRenderer__LinePath2D_5BF31CC8(renderer, scene, points, -1, name);
            LinePathObject2D__set_LineWidth_5E38073B(path, scene.WorldScale * 0.8);
            LinePathObject2D__set_StrokeColor_Z3D47FC58(path, color);
            LinePathObject2D__set_LineCap_7B1263D0(path, cap);
            LinePathObject2D__set_LineJoin_Z229C3C20(path, join);
            return path;
        };
        const color1 = Vec4_Create_Z27E3A4C0(0, 0, 1, 0.4);
        const color2 = Vec4_Create_Z27E3A4C0(1, 0.2, 0.5, 0.1);
        const color3 = Vec4_Create_Z27E3A4C0(0.2, 0.5, 1, 0.4);
        const value_2 = addPath("path1", color1, [Vec2_Create_7B00E9A0(-2, 2.3), Vec2_Create_7B00E9A0(0.5, 2.3), Vec2_Create_7B00E9A0(2, 2.3)]);
        void value_2;
        const value_3 = addPath("path2", color1, [Vec2_Create_7B00E9A0(2, -2.3), Vec2_Create_7B00E9A0(0.5, -2.3), Vec2_Create_7B00E9A0(-2, -2.3)]);
        void value_3;
        const value_4 = addPath("path3", color2, [Vec2_Create_7B00E9A0(-2, 2), Vec2_Create_7B00E9A0(-2, 0), Vec2_Create_7B00E9A0(-2, -2)]);
        void value_4;
        const value_5 = addPath("path4", color2, [Vec2_Create_7B00E9A0(2, -2), Vec2_Create_7B00E9A0(2, 0), Vec2_Create_7B00E9A0(2, 2)]);
        void value_5;
        const value_6 = addPath("path5", color3, [Vec2_Create_7B00E9A0(-1, -1), Vec2_Create_7B00E9A0(0, 0), Vec2_Create_7B00E9A0(1, 1)]);
        void value_6;
    };
    addScene(Bounds__get_Quadrant1(viewport_1), 4, 0);
    addScene(Bounds__get_Quadrant2(viewport_1), 3, 1);
    addScene(Bounds__get_Quadrant3(viewport_1), 5, 2);
    addScene(Bounds__get_Quadrant4(viewport_1), 3, 1);
    return ["Linepath Aligned", canvas, (value_7) => {
        void value_7;
    }, false, 0];
}

export function testNoise() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const worldBounds = BoundsModule_boundsCenterV(Vec2_Create_7B00E9A0(0, 0), Bounds__get_Size(viewport));
    const halfDim = 2;
    const dim = halfDim * 2;
    const gridWorld = BoundsModule_boundsCenter(0, 0, dim, dim);
    const calcScale = (bounds) => (Bounds__get_HalfSize(bounds).values[0] / halfDim);
    const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_globalWithResolutionTime2d, CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(0, "scene4"), new BuilderTypes_GlSceneProp(8, gridWorld), new BuilderTypes_GlSceneProp(10, calcScale(viewport)), new BuilderTypes_GlSceneProp(9, viewport), new BuilderTypes_GlSceneProp(1, 2), new BuilderTypes_GlSceneProp(2, 0), SceneProps_sharedObjectWithCamera2d, SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, toText(interpolate("gridCam", []))), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), CameraProps_cameraClearDepthBuffer]))]))]));
    const scene4 = getScene("scene4")(canvas);
    const renderer = GlRenderer_$ctor();
    const vec = GlRenderer__Vector2D_Z270D9612(renderer, scene4, Vec2_Create_7B00E9A0(1, 0));
    WebglObject__set_AngleDegreesZ_60759B6B(vec, 0);
    vec["Wil.Webgl.QuadObjectBase.set_LineWidth"](pixelsToWorld(10, scene4));
    QuadObjectBase__set_StrokeColor_Z3D47FC58(vec, Vec4_Create_Z27E3A4C0(0, 0, 1, 1.4));
    QuadObjectBase__set_FillColor_Z3D47FC58(vec, Vec4_Create_Z27E3A4C0(0, 0.7, 0, 0.1));
    WebglObject__set_Position2_Z3D47FC52(vec, Vec2_Create_7B00E9A0(-0, 0.5));
    QuadObjectBase__set_AliasWidth_21F3BA25(vec, 2);
    const noiseSize = Bounds__get_Size(Bounds__InflatePct_5E38073B(Bounds__get_Quadrant1(worldBounds), 0.9));
    const grid = GlRenderer__Grid2D_Z270D9612(renderer, scene4, Bounds__get_Size(gridWorld), 1, "grid");
    let incF = 0.001;
    let incS = 0.01;
    let oct = 1;
    let incO = 1 / (60 * 0.1);
    let noiseTime = 0;
    let timeO = 1 / (60 * 0.03);
    let frame = 0;
    const update = (time) => {
        dirty(canvas);
        frame = (frame + 1);
        noiseTime = (noiseTime + timeO);
    };
    return ["Noise", canvas, update, true, 60 * 120];
}

export function testVector() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const worldBounds = BoundsModule_boundsCenterV(Vec2_Create_7B00E9A0(0, 0), Bounds__get_Size(viewport));
    const halfDim = 2;
    const dim = halfDim * 2;
    const gridWorld = BoundsModule_boundsCenter(0, 0, dim, dim);
    const calcScale = (bounds) => (Bounds__get_HalfSize(bounds).values[0] / halfDim);
    const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_globalWithResolutionTime2d, CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(0, "scene4"), new BuilderTypes_GlSceneProp(8, gridWorld), new BuilderTypes_GlSceneProp(10, calcScale(viewport)), new BuilderTypes_GlSceneProp(9, viewport), new BuilderTypes_GlSceneProp(1, 2), new BuilderTypes_GlSceneProp(2, 0), SceneProps_sharedObjectWithCamera2d, SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, toText(interpolate("gridCam", []))), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), CameraProps_cameraClearDepthBuffer]))]))]));
    const scene4 = getScene("scene4")(canvas);
    const renderer = GlRenderer_$ctor();
    const vec = GlRenderer__Vector2D_Z270D9612(renderer, scene4, Vec2_Create_7B00E9A0(1, 0));
    WebglObject__set_AngleDegreesZ_60759B6B(vec, 0);
    vec["Wil.Webgl.QuadObjectBase.set_LineWidth"](pixelsToWorld(10, scene4));
    QuadObjectBase__set_StrokeColor_Z3D47FC58(vec, Vec4_Create_Z27E3A4C0(0, 0, 1, 1.4));
    QuadObjectBase__set_FillColor_Z3D47FC58(vec, Vec4_Create_Z27E3A4C0(0, 0.7, 0, 0.1));
    WebglObject__set_Position2_Z3D47FC52(vec, Vec2_Create_7B00E9A0(-0, 0.5));
    QuadObjectBase__set_AliasWidth_21F3BA25(vec, 2);
    const grid = GlRenderer__Grid2D_Z270D9612(renderer, scene4, Bounds__get_Size(gridWorld), 1, "grid");
    let frame = 0;
    const update = (time) => {
        dirty(canvas);
        VectorObject2D__set_Vector_Z3D47FC52(vec, Vec2__Rotate_Z24CF60FF(VectorObject2D__get_Vector(vec), 1 * RAD_PER_DEG));
        frame = (frame + 1);
    };
    return ["Vector", canvas, update, true, 60 * 120];
}

export function runTests() {
    run(testVector);
}

if (star.complete) {
    runTests();
}
else {
    star.onload = ((_arg1) => {
        runTests();
    });
}

