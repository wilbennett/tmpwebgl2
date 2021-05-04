import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { Grid2D_$ctor_Z166BE183 } from "./grid2d.js";
import { VectorObject2D_$ctor_Z166BE183 } from "./vectorobject2d.js";
import { LineObjects2D_$ctor_22E93213 } from "./lineobjects2d.js";
import { LinePathObject2D_$ctor_3F122D1B } from "./linepathobject2d.js";
import { PerlinNoise1DObject2D_$ctor_C1A1B4 } from "./perlinnoise1dobject2d.js";
import { PerlinNoise2DObject2D_$ctor_C1A1B4 } from "./perlinnoise2dobject2d.js";

export class GlRenderer {
    constructor() {
    }
}

export function GlRenderer$reflection() {
    return class_type("Wil.Webgl.GlRenderer", void 0, GlRenderer);
}

export function GlRenderer_$ctor() {
    return new GlRenderer();
}

export function GlRenderer__Grid2D_Z270D9612(_, scene, size, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return Grid2D_$ctor_Z166BE183(scene.Canvas.Params, scene, size, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function GlRenderer__Vector2D_Z270D9612(_, scene, vector, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return VectorObject2D_$ctor_Z166BE183(scene.Canvas.Params, scene, vector, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function GlRenderer__Line2D_515305A0(_, scene, p1, p2, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return LineObjects2D_$ctor_22E93213(scene.Canvas.Params, scene, p1, p2, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function GlRenderer__LinePath2D_5BF31CC8(_, scene, points, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return LinePathObject2D_$ctor_3F122D1B(scene.Canvas.Params, scene, points, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function GlRenderer__PerlinNoise1DObject2D_Z4FCA04F9(_, scene, size, seed, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return PerlinNoise1DObject2D_$ctor_C1A1B4(scene.Canvas.Params, scene, size, seed, layer, name, linkTo, parallaxCam, parallaxDistance);
}

export function GlRenderer__PerlinNoise2DObject2D_Z4FCA04F9(_, scene, size, seed, layer, name, linkTo, parallaxCam, parallaxDistance) {
    return PerlinNoise2DObject2D_$ctor_C1A1B4(scene.Canvas.Params, scene, size, seed, layer, name, linkTo, parallaxCam, parallaxDistance);
}

