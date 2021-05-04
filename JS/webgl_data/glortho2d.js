import { objects, dirtyScene } from "./glcommon.js";
import { Vec2__Rotate_Z24CF60FF, Vec2__SetAngle_Z24CF60FF, Vec3__Scale_667C46A7, Vec3_op_Subtraction_Z24FF85E0, Vec2__Scale_Z6C68B1C0, Vec3_Create, Vec2_op_Division_Z24FF8540, Vec2__Sub_Z50E8264B, Vec2_op_Multiply_Z24FF8540, Vec2_op_Addition_Z24FF8540, Vec2_op_Subtraction_Z24FF8540, Vec3_op_Multiply_Z18D588CE, Vec2_op_Multiply_47807E55, Vec3_Create_8ED0A5D, Vec3_Create_Z18D5882D, Vec4_Create_Z27E3A4C0, Vec2__WithY_Z6C68B1C0, Vec2__Min_Z50E8264B, Vec2_op_Division_47807E55, Vec3__WithXY_Z50E8266C, Vec2_Create_7B00E9A0, Vec3__WithXYZ_Z6FDE0AF9 } from "../core/vectors.js";
import { Bounds__Contains_Z3D47FC52, Bounds__get_Height, Bounds__get_Min, Bounds__Inflate_5E38073B, Bounds__Clone, Bounds__get_Size, Bounds__get_Center, Bounds__ClampM_Z134B2C62, BoundsModule_boundsCenterV } from "../twod/bounds.js";
import { Data_GlCameraKind, Data_GlCameraData } from "./webgl_data.js";
import { Mat4__OrthoM_357D8320, Mat4__LookAtM_Z6484271, Mat4_Create } from "../core/matricies.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { iterate } from "../.fable/fable-library.3.0.0/Seq.js";
import { render as render_1 } from "./globj.js";

const positionZ = 10;

function dirty(data) {
    data.IsDirty = true;
    dirtyScene(data.Scene);
}

export function clean(data) {
    data.IsDirty = false;
}

function updatePosition(data) {
    const lookAt = data.LookAt;
    const __2 = data.Position;
    const value = Vec3__WithXYZ_Z6FDE0AF9(__2.v.contents, lookAt.values[0], lookAt.values[1], positionZ, __2.v.contents);
    void value;
}

function clampViewToWorld(data) {
    let viewCenter;
    const _ = data.LookAt;
    viewCenter = Vec2_Create_7B00E9A0(_.v.contents.values[0], _.v.contents.values[1]);
    const viewBounds = BoundsModule_boundsCenterV(viewCenter, data.ViewSize);
    Bounds__ClampM_Z134B2C62(viewBounds, data.Scene.WorldBounds);
    const __3 = data.LookAt;
    const value = Vec3__WithXY_Z50E8266C(__3.v.contents, Bounds__get_Center(viewBounds), __3.v.contents);
    void value;
    updatePosition(data);
}

function clampViewToViewport(data) {
    const scaledViewportSize = Vec2_op_Division_47807E55(Bounds__get_Size(data.ViewportBounds), data.Scene.WorldScale);
    const _ = data.ViewSize;
    const value = Vec2__Min_Z50E8264B(_.v.contents, scaledViewportSize, _.v.contents);
    void value;
    let viewCenter;
    const __1 = data.LookAt;
    viewCenter = Vec2_Create_7B00E9A0(__1.v.contents.values[0], __1.v.contents.values[1]);
    const viewBounds = BoundsModule_boundsCenterV(viewCenter, data.ViewSize);
    const __4 = data.LookAt;
    const value_1 = Vec3__WithXY_Z50E8266C(__4.v.contents, Bounds__get_Center(viewBounds), __4.v.contents);
    void value_1;
}

function clampView(data) {
    clampViewToViewport(data);
    clampViewToWorld(data);
}

function clampViewportToScene(data) {
    Bounds__ClampM_Z134B2C62(data.ViewportBounds, data.Scene.SceneBounds);
}

export function setLookAtXYZ(x, y, z, data) {
    const _ = data.LookAt;
    const value = Vec3__WithXYZ_Z6FDE0AF9(_.v.contents, x, y, z, _.v.contents);
    void value;
    clampView(data);
    dirty(data);
}

export function setViewSize(size, data) {
    const value = Vec2__Min_Z50E8264B(size, Bounds__get_Size(data.Scene.WorldBounds), data.ViewSize);
    void value;
    if (data.UseViewSizeAspect) {
        const viewps = Bounds__get_Size(data.ViewportBounds);
        const __3 = data.ViewSize;
        const value_1 = Vec2__WithY_Z6C68B1C0(__3.v.contents, (data.ViewSize.values[0] * viewps.values[1]) / viewps.values[0], __3.v.contents);
        void value_1;
    }
    clampView(data);
    dirty(data);
}

function apply(props, data) {
    const loop = (props_1_mut, data_1_mut) => {
        loop:
        while (true) {
            const props_1 = props_1_mut, data_1 = data_1_mut;
            if (props_1.tail != null) {
                const t = props_1.tail;
                const h = props_1.head;
                switch (h.tag) {
                    case 1: {
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, false, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 2: {
                        const x_1 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, x_1, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 3: {
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask | 16384, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 4: {
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask | 256, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 5: {
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask | 1024, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 6: {
                        const x_2 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, x_2, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 7: {
                        const x_3 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, x_3, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 8: {
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, false, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 9: {
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, false, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 10: {
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, false, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 11: {
                        props_1_mut = t;
                        data_1_mut = data_1;
                        continue loop;
                    }
                    case 12: {
                        const x_4 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, x_4, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 13: {
                        const x_5 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, x_5, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 14: {
                        const x_6 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, x_6, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 15: {
                        const x_7 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, x_7, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 16: {
                        const x_8 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, x_8, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 17: {
                        const x_9 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, x_9, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 18: {
                        const x_10 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, x_10, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    case 19: {
                        const x_11 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, data_1.Name, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, x_11, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                    default: {
                        const x = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlCameraData(data_1.Id, data_1.Kind, x, data_1.IsDirty, data_1.Scene, data_1.ClearViewport, data_1.CameraBackground, data_1.ClearMask, data_1.BorderWidth, data_1.AutoSizeViewport, data_1.UseViewSizeAspect, data_1.AutoPosition, data_1.Position, data_1.LookAt, data_1.ViewSize, data_1.ViewportBounds, data_1.ScissorBounds, data_1.Up, data_1.Near, data_1.Far, data_1.Aspect, data_1.Fov, data_1.ProjectionMatrix, data_1.ViewMatrix));
                        continue loop;
                    }
                }
            }
            else {
                return data_1;
            }
            break;
        }
    };
    return loop(props, data);
}

export function create(props, scene) {
    const worldBounds = scene.WorldBounds;
    const viewport = Bounds__Clone(scene.SceneBounds);
    const scaledViewportSize = Vec2_op_Division_47807E55(Bounds__get_Size(viewport), scene.WorldScale);
    const updateScissorBounds = (data) => (new Data_GlCameraData(data.Id, data.Kind, data.Name, data.IsDirty, data.Scene, data.ClearViewport, data.CameraBackground, data.ClearMask, data.BorderWidth, data.AutoSizeViewport, data.UseViewSizeAspect, data.AutoPosition, data.Position, data.LookAt, data.ViewSize, Bounds__Inflate_5E38073B(data.ViewportBounds, -data.BorderWidth), data.ViewportBounds, data.Up, data.Near, data.Far, data.Aspect, data.Fov, data.ProjectionMatrix, data.ViewMatrix));
    const adjustParams = (data_1) => {
        clampViewportToScene(data_1);
        setViewSize(data_1.ViewSize, data_1);
        const center = data_1.LookAt;
        setLookAtXYZ(center.values[0], center.values[1], center.values[2], data_1);
        return data_1;
    };
    return adjustParams(updateScissorBounds(apply(props, new Data_GlCameraData(0, new Data_GlCameraKind(0), "", true, scene, true, Vec4_Create_Z27E3A4C0(0, 0, 0, 1), 16384, 0, true, true, true, Vec3_Create_Z18D5882D(Bounds__get_Center(worldBounds), positionZ), Vec3_Create_Z18D5882D(Bounds__get_Center(worldBounds), 0), Vec2__Min_Z50E8264B(Bounds__get_Size(worldBounds), scaledViewportSize), viewport, viewport, Vec3_Create_8ED0A5D(0, 1, 0), 0, 1000, 0, 3.141592653589793, Mat4_Create(), Mat4_Create()))));
}

export function update(data) {
    if (data.IsDirty) {
        clean(data);
        const cam = data;
        const ws = cam.Scene.WorldScale;
        const halfSize = Vec2_op_Multiply_47807E55(Vec2_op_Multiply_47807E55(cam.ViewSize, ws), 0.5);
        const hw = halfSize.values[0];
        const hh = halfSize.values[1];
        const position = Vec3_op_Multiply_Z18D588CE(cam.Position, ws);
        const lookAt = Vec3_op_Multiply_Z18D588CE(cam.LookAt, ws);
        Mat4__LookAtM_Z6484271(cam.ViewMatrix, position, lookAt, cam.Up);
        Mat4__OrthoM_357D8320(cam.ProjectionMatrix, -hw, hw, -hh, hh, cam.Near, cam.Far);
    }
}

export function render(data) {
    update(data);
    iterate((data_2) => {
        render_1(data, data_2);
    }, objects(data.Scene));
}

export function toWorldO(point, result, data) {
    let __2;
    const gl = data.Scene.Canvas.Context;
    const vb = data.ViewportBounds;
    const minViewport = Bounds__get_Min(vb);
    const __1 = minViewport;
    const value = Vec2__WithY_Z6C68B1C0(__1.v.contents, (gl.canvas.height - minViewport.values[1]) - Bounds__get_Height(vb), __1.v.contents);
    void value;
    const minWorld = Vec2_op_Subtraction_Z24FF8540((__2 = data.LookAt, Vec2_Create_7B00E9A0(__2.v.contents.values[0], __2.v.contents.values[1])), Vec2_op_Multiply_47807E55(data.ViewSize, 0.5));
    const pos = Vec2_op_Addition_Z24FF8540(minWorld, Vec2_op_Multiply_Z24FF8540(Vec2__Sub_Z50E8264B(point, minViewport), Vec2_op_Division_Z24FF8540(data.ViewSize, Bounds__get_Size(vb))));
    const __7 = result;
    const value_1 = Vec3__WithXYZ_Z6FDE0AF9(__7.v.contents, pos.values[0], pos.values[1], 0, __7.v.contents);
    void value_1;
    return result;
}

export function containsPoint(point, data) {
    let _, __3;
    const worldPoint = toWorldO(point, Vec3_Create(), data);
    const viewBounds = BoundsModule_boundsCenterV((_ = data.LookAt, Vec2_Create_7B00E9A0(_.v.contents.values[0], _.v.contents.values[1])), data.ViewSize);
    return Bounds__Contains_Z3D47FC52(viewBounds, (__3 = worldPoint, Vec2_Create_7B00E9A0(__3.v.contents.values[0], __3.v.contents.values[1])));
}

export function getZoom(data) {
    return Bounds__get_Size(data.Scene.WorldBounds).values[0] / data.ViewSize.values[0];
}

export function zoom(amount, data) {
    if (amount > 0) {
        setViewSize(Vec2__Scale_Z6C68B1C0(Bounds__get_Size(data.Scene.WorldBounds), amount), data);
    }
}

export function zoomBy(amount, data) {
    if (amount > 0) {
        const _ = data.ViewSize;
        const value = Vec2__Scale_Z6C68B1C0(_.v.contents, amount, _.v.contents);
        void value;
        setViewSize(data.ViewSize, data);
    }
}

export function zoomToward(center, amount, data) {
    const delta = Vec3_op_Subtraction_Z24FF85E0(center, data.LookAt);
    const _ = delta;
    const value = Vec3__Scale_667C46A7(_.v.contents, amount - 1, _.v.contents);
    void value;
    zoomBy(amount, data);
    const center_1 = Vec3_op_Subtraction_Z24FF85E0(data.LookAt, delta);
    setLookAtXYZ(center_1.values[0], center_1.values[1], center_1.values[2], data);
}

export function rotateTo(angle, data) {
    let up;
    const _ = data.Up;
    up = Vec2_Create_7B00E9A0(_.v.contents.values[0], _.v.contents.values[1]);
    const __3 = up;
    const value = Vec2__SetAngle_Z24CF60FF(__3.v.contents, angle, __3.v.contents);
    void value;
    const __4 = data.Up;
    const value_1 = Vec3__WithXY_Z50E8266C(__4.v.contents, up, __4.v.contents);
    void value_1;
    dirty(data);
}

export function rotateBy(angle, data) {
    let up;
    const _ = data.Up;
    up = Vec2_Create_7B00E9A0(_.v.contents.values[0], _.v.contents.values[1]);
    const __3 = up;
    const value = Vec2__Rotate_Z24CF60FF(__3.v.contents, angle, __3.v.contents);
    void value;
    const __4 = data.Up;
    const value_1 = Vec3__WithXY_Z50E8266C(__4.v.contents, up, __4.v.contents);
    void value_1;
    dirty(data);
}

