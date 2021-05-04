import { FSharpRef } from "../.fable/fable-library.3.0.0/Types.js";
import { Vec2__WithXY_6DB1BD7B, Vec2_op_Subtraction_Z24FF8540, Vec2__get_Values, Vec2__Clone, Vec2_Create } from "../core/vectors.js";
import Event$ from "../.fable/fable-library.3.0.0/Event.js";
import { ListenerOptions } from "../browser/browser_extensions.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { equalsWith } from "../.fable/fable-library.3.0.0/Array.js";
import { round, comparePrimitives } from "../.fable/fable-library.3.0.0/Util.js";
import { rangeNumber, getEnumerator } from "../.fable/fable-library.3.0.0/Seq.js";
import { ofSeq } from "../.fable/fable-library.3.0.0/List.js";
import { getClientRect } from "../browser/browser_types.js";

export class GlMouse {
    constructor(canvas) {
        this.m = (new FSharpRef(null));
        const m = this.m;
        this.canvas = canvas;
        this.m.contents = this;
        this.leftButton = 0;
        this.rightButton = 2;
        this.buttonPressed = [false, false, false];
        this.buttonDownEvent = [false, false, false];
        this.buttonUpEvent = [false, false, false];
        this.buttonLast = [false, false, false];
        this.wheelEvent = false;
        this.wheelEventLast = false;
        this.wheelDelta = Vec2_Create();
        this.position = Vec2_Create();
        this.lastPosition = Vec2_Create();
        this.positionDelta = Vec2_Create();
        this.moveEvent = false;
        this.dragOrigin = [Vec2_Create(), Vec2_Create(), Vec2_Create()];
        this.dragOriginDelta = [Vec2_Create(), Vec2_Create(), Vec2_Create()];
        this.dragPending = [false, false, false];
        this.dragging = [false, false, false];
        this.dragStartEvent = [false, false, false];
        this.dragEvent = [false, false, false];
        this.dragEndEvent = [false, false, false];
        this.changes = (new Event$());
        window.addEventListener("contextmenu", (arg) => {
            const value = GlMouse__handleContextMenu_Z5B3E8D2(this, arg);
            void value;
        });
        window.addEventListener("mousemove", (arg_1) => {
            const value_1 = GlMouse__handleMouseMove_Z5B3E8D2(this, arg_1);
            void value_1;
        });
        window.addEventListener("mousedown", (arg_2) => {
            const value_2 = GlMouse__handleMouseDown_Z5B3E8D2(this, arg_2);
            void undefined;
        });
        window.addEventListener("mouseup", (arg_3) => {
            const value_3 = GlMouse__handleMouseUp_Z5B3E8D2(this, arg_3);
            void undefined;
        });
        const opts = new ListenerOptions(void 0, void 0, false);
        window.addEventListener("wheel", ((arg_4) => {
            const value_4 = GlMouse__handleMouseWheel_Z5B3E8D2(this, arg_4);
            void undefined;
        }), opts);
        this["DragTolerance@"] = 5;
        this["Changed@"] = this.changes.Publish;
        this["init@8-8"] = 1;
    }
}

export function GlMouse$reflection() {
    return class_type("Wil.Webgl.Data.GlMouse", void 0, GlMouse);
}

export function GlMouse_$ctor_Z38C79397(canvas) {
    return new GlMouse(canvas);
}

export function GlMouse__get_DragTolerance(__) {
    return __["DragTolerance@"];
}

export function GlMouse__set_DragTolerance_Z16DF143(__, v) {
    __["DragTolerance@"] = v;
}

export function GlMouse__get_Changed(__) {
    return __["Changed@"];
}

export function GlMouse__get_Position(_) {
    return Vec2__Clone(_.position);
}

export function GlMouse__get_LastPosition(_) {
    return Vec2__Clone(_.lastPosition);
}

export function GlMouse__get_PositionDelta(_) {
    return Vec2__Clone(_.positionDelta);
}

export function GlMouse__get_WheelDelta(_) {
    return Vec2__Clone(_.wheelDelta);
}

export function GlMouse__IsButtonPressed_Z524259A4(_, button) {
    return _.buttonPressed[button];
}

export function GlMouse__IsButtonDownEvent_Z524259A4(_, button) {
    return _.buttonDownEvent[button];
}

export function GlMouse__IsButtonUpEvent_Z524259A4(_, button) {
    return _.buttonUpEvent[button];
}

export function GlMouse__DragOrigin_Z524259A4(_, button) {
    return Vec2__Clone(_.dragOrigin[button]);
}

export function GlMouse__DragOriginDelta_Z524259A4(_, button) {
    return Vec2__Clone(_.dragOriginDelta[button]);
}

export function GlMouse__get_IsWheelEvent(_) {
    return _.wheelEvent;
}

export function GlMouse__get_IsMoveEvent(_) {
    return _.moveEvent;
}

export function GlMouse__IsDragStartEvent_Z524259A4(_, button) {
    return _.dragStartEvent[button];
}

export function GlMouse__IsDragEvent_Z524259A4(_, button) {
    return _.dragEvent[button];
}

export function GlMouse__IsDragEndEvent_Z524259A4(_, button) {
    return _.dragEndEvent[button];
}

export function GlMouse__Update(_) {
    let __25;
    _.moveEvent = (!equalsWith(comparePrimitives, Vec2__get_Values(_.position), Vec2__get_Values(_.lastPosition)));
    const other = Vec2_op_Subtraction_Z24FF8540(_.position, _.lastPosition);
    let value_2;
    const __4 = _.positionDelta.v.contents;
    const x_1 = other.values[0];
    const y_1 = other.values[1];
    const __5 = __4.v.contents;
    __5.values[0] = x_1;
    const __6 = __4.v.contents;
    __6.values[1] = y_1;
    value_2 = __4.v.contents;
    void value_2;
    const other_1 = _.position;
    let value_5;
    const __10 = _.lastPosition.v.contents;
    const x_2 = other_1.values[0];
    const y_2 = other_1.values[1];
    const __11 = __10.v.contents;
    __11.values[0] = x_2;
    const __12 = __10.v.contents;
    __12.values[1] = y_2;
    value_5 = __10.v.contents;
    void value_5;
    _.wheelEvent = (_.wheelEvent ? (!_.wheelEventLast) : false);
    _.wheelEventLast = _.wheelEvent;
    const enumerator = getEnumerator(ofSeq(rangeNumber(_.leftButton, 1, _.rightButton)));
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            const button = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]() | 0;
            _.buttonDownEvent[button] = ((!_.buttonLast[button]) ? _.buttonPressed[button] : false);
            _.buttonUpEvent[button] = (_.buttonLast[button] ? (!_.buttonPressed[button]) : false);
            _.buttonLast[button] = _.buttonPressed[button];
            _.dragEvent[button] = false;
            _.dragStartEvent[button] = false;
            _.dragEndEvent[button] = false;
            if (_.buttonUpEvent[button]) {
                _.dragEndEvent[button] = _.dragging[button];
                _.dragPending[button] = false;
                _.dragging[button] = false;
            }
            if (_.buttonDownEvent[button]) {
                const other_2 = _.position;
                let value_8;
                const __16 = _.dragOrigin[button].v.contents;
                const x_3 = other_2.values[0];
                const y_3 = other_2.values[1];
                const __17 = __16.v.contents;
                __17.values[0] = x_3;
                const __18 = __16.v.contents;
                __18.values[1] = y_3;
                value_8 = __16.v.contents;
                void value_8;
                _.dragPending[button] = true;
                _.dragging[button] = false;
            }
            if (_.buttonPressed[button] ? _.moveEvent : false) {
                const __19 = _.dragOriginDelta[button];
                const other_3 = Vec2_op_Subtraction_Z24FF8540(_.position, _.dragOrigin[button]);
                let value_11;
                const __22 = __19.v.contents;
                const x_4 = other_3.values[0];
                const y_4 = other_3.values[1];
                const __23 = __22.v.contents;
                __23.values[0] = x_4;
                const __24 = __22.v.contents;
                __24.values[1] = y_4;
                value_11 = __22.v.contents;
                void value_11;
                if (_.dragPending[button]) {
                    if ((__25 = _.dragOriginDelta[button], Math.sqrt((__25.v.contents.values[0] * __25.v.contents.values[0]) + (__25.v.contents.values[1] * __25.v.contents.values[1]))) > GlMouse__get_DragTolerance(_.m.contents)) {
                        _.dragPending[button] = false;
                        _.dragging[button] = true;
                        _.dragStartEvent[button] = true;
                        _.dragEvent[button] = true;
                    }
                }
                else if (_.dragging[button]) {
                    _.dragEvent[button] = true;
                }
            }
        }
    }
    finally {
        enumerator.Dispose();
    }
}

function GlMouse__handleContextMenu_Z5B3E8D2(this$, event) {
    event.preventDefault();
    return false;
}

function GlMouse__handleMouseMove_Z5B3E8D2(this$, event) {
    const event_1 = event;
    const rect = getClientRect(this$.canvas);
    const mx = round((event_1.clientX - (rect.x)) * (this$.canvas.width / rect.width));
    const my = round((event_1.clientY - (rect.y)) * (this$.canvas.height / rect.height));
    if ((((mx >= 0) ? (mx < rect.width) : false) ? (my >= 0) : false) ? (my < rect.height) : false) {
        const _ = this$.position;
        const value_2 = Vec2__WithXY_6DB1BD7B(_.v.contents, mx, (this$.canvas.height - 1) - my, _.v.contents);
        void value_2;
        this$.changes.Trigger();
        return true;
    }
    else {
        return false;
    }
}

function GlMouse__handleMouseDown_Z5B3E8D2(this$, event) {
    if (GlMouse__handleMouseMove_Z5B3E8D2(this$, event)) {
        const event_1 = event;
        this$.buttonPressed[~(~event_1.button)] = true;
        if ((~(~event_1.button)) === this$.rightButton) {
            event_1.preventDefault();
        }
        this$.changes.Trigger();
    }
}

function GlMouse__handleMouseUp_Z5B3E8D2(this$, event) {
    const value = GlMouse__handleMouseMove_Z5B3E8D2(this$, event);
    void value;
    const event_1 = event;
    this$.buttonPressed[~(~event_1.button)] = false;
    if ((~(~event_1.button)) === this$.rightButton) {
        event_1.preventDefault();
    }
    this$.changes.Trigger();
}

function GlMouse__handleMouseWheel_Z5B3E8D2(this$, event) {
    if (GlMouse__handleMouseMove_Z5B3E8D2(this$, event)) {
        const event_1 = event;
        this$.wheelEvent = true;
        const _ = this$.wheelDelta;
        const value = Vec2__WithXY_6DB1BD7B(_.v.contents, event_1.deltaX, event_1.deltaY, _.v.contents);
        void value;
        event_1.preventDefault();
        this$.changes.Trigger();
    }
}

export const Mouse_leftButton = 0;

export const Mouse_middleButton = 1;

export const Mouse_rightButton = 2;

