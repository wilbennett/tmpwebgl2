import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { record_type, class_type, enum_type, int32_type, float64_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { bufferView, uint8Array } from "../js/typedarray_utils.js";
import { GlTexturePixels } from "./webgl_data_types.js";
import { iterate, cons, empty as empty_1 } from "../.fable/fable-library.3.0.0/List.js";
import { Data_GlTextureData } from "./webgl_data.js";
import { dirtyObject, nextTextureIndex, getTexture, getObject, splitName } from "./glcommon.js";
import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { enumName } from "../core/utils.js";
import { GlTextureParamT, GlTextureTargetT } from "../webgl_core/webgl_types.js";
import { GlCommon_texImage2DImage2, GlCommon_texImage2DData2 } from "../webgl_core/webgl_browser_types.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";

export class TextureDataInfo extends Record {
    constructor(Width, Height, InternalFormat, Format, DataType, Data) {
        super();
        this.Width = Width;
        this.Height = Height;
        this.InternalFormat = (InternalFormat | 0);
        this.Format = (Format | 0);
        this.DataType = (DataType | 0);
        this.Data = Data;
    }
}

export function TextureDataInfo$reflection() {
    return record_type("GlTexture.TextureDataInfo", [], TextureDataInfo, () => [["Width", float64_type], ["Height", float64_type], ["InternalFormat", enum_type("Wil.Webgl.Types.WebglTypes.GlInternalColorFormat", int32_type, [["RGB", 6407], ["RGBA", 6408], ["LUMINANCE", 6409], ["LUMINANCE_ALPHA", 6410], ["ALPHA", 6406], ["R8", 33321], ["R16F", 33325], ["R32F", 33326], ["R8UI", 33330], ["RG8", 33323], ["RG16F", 33327], ["RG32F", 33328], ["RG8UI", 33336], ["RGB8", 32849], ["SRGB8", 35905], ["RGB565", 36194], ["R11F_G11F_B10F", 35898], ["RGB9_E5", 35901], ["RGB16F", 34843], ["RGB32F", 34837], ["RGB8UI", 36221], ["RGBA8", 32856], ["SRGB8_ALPHA8", 35907], ["RGB5_A1", 32855], ["RGB10_A2", 32857], ["RGBA4", 32854], ["RGBA16F", 34842], ["RGBA32F", 34836], ["RGBA8UI", 36220], ["R8_SNORM", 36756], ["RG8_SNORM", 36757], ["RGB8_SNORM", 36758], ["RGBA8_SNORM", 36759], ["RGB10_A2UI", 36975], ["R8I", 33329], ["R16I", 33331], ["R16UI", 33332], ["R32I", 33333], ["R32UI", 33334], ["RG8I", 33335], ["RG16I", 33337], ["RG16UI", 33338], ["RG32I", 33339], ["RG32UI", 33340], ["RGB16I", 36233], ["RGB16UI", 36215], ["RGB32I", 36227], ["RGB32UI", 36209], ["RGBA8I", 36238], ["RGBA16I", 36232], ["RGBA16UI", 36214], ["RGBA32I", 36226], ["RGBA32UI", 36208], ["DEPTH_COMPONENT16", 33189], ["DEPTH_COMPONENT24", 33190], ["DEPTH_COMPONENT32F", 36012], ["DEPTH24_STENCIL8", 35056], ["DEPTH32F_STENCIL8", 36013]])], ["Format", enum_type("Wil.Webgl.Types.WebglTypes.GlColorFormat", int32_type, [["RGB", 6407], ["RGBA", 6408], ["LUMINANCE_ALPHA", 6410], ["LUMINANCE", 6409], ["ALPHA", 6406], ["RED", 6403], ["RED_INTEGER", 36244], ["RG", 33319], ["RG_INTEGER", 33320], ["RGB_INTEGER", 36248], ["RGBA_INTEGER", 36249], ["DEPTH_COMPONENT", 6402], ["DEPTH_STENCIL", 34041]])], ["DataType", enum_type("Wil.Webgl.Types.WebglTypes.GlTextureType", int32_type, [["UNSIGNED_BYTE", 5121], ["UNSIGNED_SHORT_4_4_4_4", 32819], ["UNSIGNED_SHORT_5_5_5_1", 32820], ["UNSIGNED_SHORT_5_6_5", 33635], ["UNSIGNED_SHORT", 5123], ["UNSIGNED_INT", 5125], ["UNSIGNED_INT_24_8", 34042], ["FLOAT", 5126], ["HALF_FLOAT", 5131], ["BYTE", 5120], ["SHORT", 5122], ["INT", 5124], ["UNSIGNED_INT_2_10_10_10_REV", 33640], ["UNSIGNED_INT_10F_11F_11F_REV", 35899], ["UNSIGNED_INT_5_9_9_9_REV", 35902], ["FLOAT_32_UNSIGNED_INT_24_8_REV", 36269]])], ["Data", class_type("Fable.Core.JS.TypedArray")]]);
}

export const emptyTextureData = new TextureDataInfo(2, 2, 6408, 6408, 5121, uint8Array(new Int32Array([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 0, 255])));

export function emptyTexture(parent) {
    const gl = parent.Scene.Canvas.Context;
    const empty = emptyTextureData;
    return new Data_GlTextureData(0, "", true, 3553, gl.createTexture(), -1, 0, empty.Width, empty.Height, empty.InternalFormat, empty.Format, empty.DataType, new GlTexturePixels(0, empty.Data), 0, true, 9728, 9728, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, parent, void 0, empty_1());
}

function addLinkedChild(parent, data) {
    parent.LinkedChildren = cons(data, parent.LinkedChildren);
    return data;
}

function linkTo(parent, data) {
    return addLinkedChild(parent, new Data_GlTextureData(data.Id, data.Name, data.IsDirty, data.Target, data.TextureId, data.Index, data.Level, data.Width, data.Height, data.InternalFormat, data.Format, data.DataType, new GlTexturePixels(0, emptyTextureData.Data), data.Offset, data.GenerateMipMap, data.MagFilter, data.MinFilter, data.WrapS, data.WrapT, data.WrapR, data.BaseLevel, data.CompareFunc, data.CompareMode, data.MaxLevel, data.MaxLod, data.MinLod, data.ParentObject, parent, data.LinkedChildren));
}

function processLink(name, data) {
    const patternInput = splitName(name);
    const textureName = patternInput[1];
    const objectName = patternInput[0];
    const globj = getObject(objectName, data.ParentObject.Scene);
    const texture = getTexture(textureName, globj);
    return linkTo(texture, data);
}

export function apply(props, data) {
    const loop = (props_1_mut, data_1_mut) => {
        loop:
        while (true) {
            const props_1 = props_1_mut, data_1 = data_1_mut;
            if (props_1.tail != null) {
                const t = props_1.tail;
                const h = props_1.head;
                switch (h.tag) {
                    case 1: {
                        const x_1 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, x_1, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 2: {
                        const x_2 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, x_2, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 3: {
                        const x_3 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, x_3, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 6: {
                        const x_4 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, x_4, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 4: {
                        const x_5 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, x_5, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 5: {
                        const x_6 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, x_6, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 7: {
                        const x_7 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, x_7, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 8: {
                        const x_8 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, x_8, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 10: {
                        const x_9 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, x_9, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 11: {
                        const x_10 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, x_10, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 9: {
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, false, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 12: {
                        const x_11 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, x_11, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 13: {
                        const x_12 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, x_12, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 14: {
                        const x_13 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, x_13, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 15: {
                        const x_14 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, x_14, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 16: {
                        const x_15 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, x_15, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 17: {
                        const x_16 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, x_16, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 18: {
                        const x_17 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, x_17, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 19: {
                        const x_18 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, x_18, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 20: {
                        const x_19 = h.fields[0] | 0;
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, x_19, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 21: {
                        const x_20 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, x_20, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 22: {
                        const x_21 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, data_1.Name, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, x_21, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
                        continue loop;
                    }
                    case 23: {
                        const x_22 = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = processLink(x_22, data_1);
                        continue loop;
                    }
                    default: {
                        const x = h.fields[0];
                        props_1_mut = t;
                        data_1_mut = (new Data_GlTextureData(data_1.Id, x, data_1.IsDirty, data_1.Target, data_1.TextureId, data_1.Index, data_1.Level, data_1.Width, data_1.Height, data_1.InternalFormat, data_1.Format, data_1.DataType, data_1.Pixels, data_1.Offset, data_1.GenerateMipMap, data_1.MagFilter, data_1.MinFilter, data_1.WrapS, data_1.WrapT, data_1.WrapR, data_1.BaseLevel, data_1.CompareFunc, data_1.CompareMode, data_1.MaxLevel, data_1.MaxLod, data_1.MinLod, data_1.ParentObject, data_1.Link, data_1.LinkedChildren));
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

export function create(props, parentObject) {
    let inputRecord;
    return apply(props, (inputRecord = emptyTexture(parentObject), new Data_GlTextureData(inputRecord.Id, inputRecord.Name, inputRecord.IsDirty, inputRecord.Target, inputRecord.TextureId, nextTextureIndex(parentObject), inputRecord.Level, inputRecord.Width, inputRecord.Height, inputRecord.InternalFormat, inputRecord.Format, inputRecord.DataType, inputRecord.Pixels, inputRecord.Offset, inputRecord.GenerateMipMap, inputRecord.MagFilter, inputRecord.MinFilter, inputRecord.WrapS, inputRecord.WrapT, inputRecord.WrapR, inputRecord.BaseLevel, inputRecord.CompareFunc, inputRecord.CompareMode, inputRecord.MaxLevel, inputRecord.MaxLod, inputRecord.MinLod, inputRecord.ParentObject, inputRecord.Link, inputRecord.LinkedChildren)));
}

export function delete$(data) {
    const gl = data.ParentObject.Scene.Canvas.Context;
    gl.deleteTexture(data.TextureId);
}

export function clean(data) {
    data.IsDirty = false;
}

export function dirty(data) {
    data.IsDirty = true;
    dirtyObject(data.ParentObject);
}

export function dirtyLinkedChildren(data) {
    iterate((data_1) => {
        dirty(data_1);
    }, data.LinkedChildren);
}

function activateTexture(vdata, data) {
    const gl = data.ParentObject.Scene.Canvas.Context;
    const value = data.MinFilter;
    if (value == null) {
    }
    else {
        const value_1 = value | 0;
        const target = vdata.Target | 0;
        const param_1 = 10241;
        const value_2 = value_1;
        gl.texParameteri(target, param_1, value_2);
    }
    const value_3 = data.MagFilter;
    if (value_3 == null) {
    }
    else {
        const value_4 = value_3 | 0;
        const target_1 = vdata.Target | 0;
        const param_3 = 10240;
        const value_5 = value_4;
        gl.texParameteri(target_1, param_3, value_5);
    }
    const value_6 = data.WrapS;
    if (value_6 == null) {
    }
    else {
        const value_7 = value_6 | 0;
        const target_2 = vdata.Target | 0;
        const param_5 = 10242;
        const value_8 = value_7;
        gl.texParameteri(target_2, param_5, value_8);
    }
    const value_9 = data.WrapT;
    if (value_9 == null) {
    }
    else {
        const value_10 = value_9 | 0;
        const target_3 = vdata.Target | 0;
        const param_7 = 10243;
        const value_11 = value_10;
        gl.texParameteri(target_3, param_7, value_11);
    }
    const value_12 = data.WrapR;
    if (value_12 == null) {
    }
    else {
        const value_13 = value_12 | 0;
        const target_4 = vdata.Target | 0;
        const param_9 = 32882;
        const value_14 = value_13;
        gl.texParameteri(target_4, param_9, value_14);
    }
    const value_15 = data.BaseLevel;
    if (value_15 == null) {
    }
    else {
        const value_16 = value_15 | 0;
        const target_5 = vdata.Target | 0;
        const param_11 = 33084;
        const value_17 = value_16;
        gl.texParameteri(target_5, param_11, value_17);
    }
    const value_18 = data.CompareFunc;
    if (value_18 == null) {
    }
    else {
        const value_19 = value_18 | 0;
        const target_6 = vdata.Target | 0;
        const param_13 = 34893;
        const value_20 = value_19;
        gl.texParameteri(target_6, param_13, value_20);
    }
    const value_21 = data.CompareMode;
    if (value_21 == null) {
    }
    else {
        const value_22 = value_21 | 0;
        const target_7 = vdata.Target | 0;
        const param_15 = 34892;
        const value_23 = value_22;
        gl.texParameteri(target_7, param_15, value_23);
    }
    const value_24 = data.MaxLevel;
    if (value_24 == null) {
    }
    else {
        const value_25 = value_24 | 0;
        const target_8 = vdata.Target | 0;
        const param_17 = 33085;
        const value_26 = value_25;
        gl.texParameteri(target_8, param_17, value_26);
    }
    const value_27 = data.MaxLod;
    if (value_27 == null) {
    }
    else {
        const value_28 = value_27;
        const target_9 = vdata.Target | 0;
        const param_19 = 33083;
        const value_29 = value_28;
        gl.texParameterf(target_9, param_19, value_29);
    }
    const value_30 = data.MinLod;
    if (value_30 == null) {
    }
    else {
        const value_31 = value_30;
        const target_10 = vdata.Target | 0;
        const param_21 = 33082;
        const value_32 = value_31;
        gl.texParameterf(target_10, param_21, value_32);
    }
}

function updateDataTexture(pixels, vdata, data) {
    GlCommon_texImage2DData2(vdata.Target, vdata.Level, vdata.InternalFormat, vdata.Width, vdata.Height, vdata.Format, vdata.DataType, bufferView(pixels), vdata.Offset, data.ParentObject.Scene.Canvas.Context);
    if (data.GenerateMipMap) {
        data.ParentObject.Scene.Canvas.Context.generateMipmap(vdata.Target);
    }
    clean(data);
}

function updateImageTexture(pixels, vdata, data) {
    const isLoaded = pixels.complete ? (pixels.naturalWidth !== 0) : false;
    if (isLoaded) {
        vdata.Width = pixels.naturalWidth;
        vdata.Height = pixels.naturalHeight;
        GlCommon_texImage2DImage2(vdata.Target, vdata.Level, vdata.InternalFormat, vdata.Width, vdata.Height, vdata.Format, vdata.DataType, pixels, data.ParentObject.Scene.Canvas.Context);
        if (data.GenerateMipMap) {
            data.ParentObject.Scene.Canvas.Context.generateMipmap(vdata.Target);
        }
        clean(data);
    }
    else {
        const empty = emptyTextureData;
        GlCommon_texImage2DData2(vdata.Target, vdata.Level, empty.InternalFormat, empty.Width, empty.Height, empty.Format, empty.DataType, bufferView(empty.Data), vdata.Offset, data.ParentObject.Scene.Canvas.Context);
    }
}

export function update(data) {
    const gl = data.ParentObject.Scene.Canvas.Context;
    const vdata = defaultArg(data.Link, data);
    gl.activeTexture(gl.TEXTURE0 + data.Index);
    gl.bindTexture(data.Target, data.TextureId);
    if (data.IsDirty) {
        const matchValue = vdata.Pixels;
        switch (matchValue.tag) {
            case 1: {
                throw (new Error("PixelImageData not implemented"));
                break;
            }
            case 2: {
                const pixels_1 = matchValue.fields[0];
                updateImageTexture(pixels_1, vdata, data);
                break;
            }
            case 3: {
                throw (new Error("PixelCanvas not implemented"));
                break;
            }
            case 4: {
                throw (new Error("PixelVideo not implemented"));
                break;
            }
            case 5: {
                throw (new Error("PixelBitmap not implemented"));
                break;
            }
            default: {
                const pixels = matchValue.fields[0];
                updateDataTexture(pixels, vdata, data);
            }
        }
        activateTexture(vdata, data);
    }
}

export function setPixelData(height, pixels, data) {
    data.Pixels = (new GlTexturePixels(0, uint8Array(pixels)));
    data.Width = (~(~((~(~(pixels.length / height))) / 4)));
    data.Height = height;
    dirty(data);
}

