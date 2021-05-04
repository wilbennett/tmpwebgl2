import { addObject, removeObject } from "../webgl_data/glscene.js";
import { setScale, setAngleDegreesZ, setAngleDegrees, degreesToRadians, setAngleZ, setAngle, setPositionXY, setPosition, delete$ } from "../webgl_data/globj.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { Vec2_Create_7B00E9A0 } from "../core/vectors.js";
import { DEG_PER_RAD } from "../core/utils.js";

export class WebglObject {
    constructor(scene, objectCreator) {
        this.scene = scene;
        this.objectDef = addObject(objectCreator)(this.scene);
    }
    ["Wil.Webgl.WebglObject.Delete"]() {
        const _ = this;
        const value = removeObject(_.objectDef)(_.scene);
        void value;
        delete$(_.objectDef);
    }
}

export function WebglObject$reflection() {
    return class_type("Wil.Webgl.WebglObject", void 0, WebglObject);
}

export function WebglObject_$ctor_E676F7D(scene, objectCreator) {
    return new WebglObject(scene, objectCreator);
}

export function WebglObject__get_ObjectDef(_) {
    return _.objectDef;
}

export function WebglObject__get_Scene(_) {
    return _.objectDef.Scene;
}

export function WebglObject__get_Position(_) {
    return _.objectDef.Position;
}

export function WebglObject__set_Position_Z3D47FC51(_, value) {
    setPosition(value, _.objectDef);
}

export function WebglObject__get_Position2(_) {
    const __1 = _.objectDef.Position;
    return Vec2_Create_7B00E9A0(__1.v.contents.values[0], __1.v.contents.values[1]);
}

export function WebglObject__set_Position2_Z3D47FC52(_, value) {
    setPositionXY(value.values[0], value.values[1], _.objectDef);
}

export function WebglObject__get_Angle(_) {
    return _.objectDef.Angle;
}

export function WebglObject__set_Angle_Z3D47FC51(_, value) {
    setAngle(value, _.objectDef);
}

export function WebglObject__get_AngleZ(_) {
    return _.objectDef.Angle.values[2] * 1;
}

export function WebglObject__set_AngleZ_6069AC9A(_, value) {
    setAngleZ(value, _.objectDef);
}

export function WebglObject__get_AngleDegrees(_) {
    return degreesToRadians(_.objectDef.Angle);
}

export function WebglObject__set_AngleDegrees_Z3D47FC51(_, value) {
    setAngleDegrees(value, _.objectDef);
}

export function WebglObject__get_AngleDegreesZ(_) {
    return (_.objectDef.Angle.values[2] * 1) * DEG_PER_RAD;
}

export function WebglObject__set_AngleDegreesZ_60759B6B(_, value) {
    setAngleDegreesZ(value, _.objectDef);
}

export function WebglObject__get_Scale(_) {
    return _.objectDef.Scale;
}

export function WebglObject__set_Scale_5E38073B(_, value) {
    setScale(value, _.objectDef);
}

