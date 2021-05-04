import { BuilderTypes_GlTextureProp, BuilderTypes_GlUniformProp, BuilderTypes_GlObjProp } from "../webgl_data/webgl_data.js";
import { uncurry } from "../.fable/fable-library.3.0.0/Util.js";
import { Props_gltexture, ObjectProps_pixelDataUint8, Props_glubo, UboProps_u } from "./props.js";
import { ofArray, singleton } from "../.fable/fable-library.3.0.0/List.js";
import { Vec4_Create_Z27E3A4C0, Vec4_Create_Z16DF143, Vec4__get_Values } from "../core/vectors.js";
import { PerlinShared_createPerm } from "../core/perlinnoise.js";
import { GlPalette_create } from "./glpalette.js";

export const noiseFractalParams = new BuilderTypes_GlObjProp(11, uncurry(2, (() => {
    const props = ofArray([UboProps_u("octaves", singleton(new BuilderTypes_GlUniformProp(0, 1))), UboProps_u("frequency", singleton(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(Vec4_Create_Z16DF143(1))))), UboProps_u("amplitude", singleton(new BuilderTypes_GlUniformProp(0, 2))), UboProps_u("lacunarity", singleton(new BuilderTypes_GlUniformProp(0, 1))), UboProps_u("gain", singleton(new BuilderTypes_GlUniformProp(0, 0.5))), UboProps_u("noiseTime", singleton(new BuilderTypes_GlUniformProp(0, 0)))]);
    return (overrides) => ((parentObject) => Props_glubo("noiseFractalParams", props, overrides, parentObject));
})()));

export function permTexture(seed) {
    let props;
    return new BuilderTypes_GlObjProp(14, uncurry(2, (props = ofArray([new BuilderTypes_GlTextureProp(4, 256), new BuilderTypes_GlTextureProp(5, 1), ObjectProps_pixelDataUint8(PerlinShared_createPerm(seed)), new BuilderTypes_GlTextureProp(9), new BuilderTypes_GlTextureProp(6, 33321), new BuilderTypes_GlTextureProp(7, 6403), new BuilderTypes_GlTextureProp(14, 10497), new BuilderTypes_GlTextureProp(15, 10497), new BuilderTypes_GlTextureProp(12, 9728), new BuilderTypes_GlTextureProp(13, 9728)]), (overrides) => ((parentObject) => Props_gltexture(props, overrides, parentObject)))));
}

export function defaultColorMap(index) {
    const stops = ofArray([[0, Vec4_Create_Z27E3A4C0(0, 0, 0, 255)], [1, Vec4_Create_Z27E3A4C0(255, 255, 255, 255)]]);
    return GlPalette_create("colorMap", index, 30, stops);
}

