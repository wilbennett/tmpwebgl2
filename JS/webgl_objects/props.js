import { interpolate, toText } from "../.fable/fable-library.3.0.0/String.js";
import { create } from "../webgl_data/glcanvas.js";
import { pixelsToWorld, create as create_1 } from "../webgl_data/glscene.js";
import { ofArray, singleton, empty, cons, append } from "../.fable/fable-library.3.0.0/List.js";
import { create as create_2 } from "../webgl_data/globj.js";
import { create as create_3 } from "../webgl_data/glubo.js";
import { create as create_4 } from "../webgl_data/gltexture.js";
import { BuilderTypes_GlTextureProp, BuilderTypes_GlIndicesProp, BuilderTypes_GlAttrProp, BuilderTypes_GlUboProp, BuilderTypes_GlUniformProp, BuilderTypes_GlCamProp, BuilderTypes_GlSceneProp, BuilderTypes_GlCanvasProp, BuilderTypes_GlObjProp } from "../webgl_data/webgl_data.js";
import { GlTexturePixels, GlPixelStorage, GlContextAttribute } from "../webgl_data/webgl_data_types.js";
import { create as create_5 } from "../webgl_data/glortho2d.js";
import { Vec3_Create_Z18D5882D, Vec3_Create_8ED0A5D, Vec_vec2Values, Vec4__get_Values, Vec2__get_Values } from "../core/vectors.js";
import { create as create_6 } from "../webgl_data/glubouniform.js";
import { create as create_7 } from "../webgl_data/glinterleavechildattribute.js";
import { create as create_8 } from "../webgl_data/gluniform.js";
import { create as create_9 } from "../webgl_data/glsingleattribute.js";
import { create as create_10 } from "../webgl_data/glinterleaveattribute.js";
import { create as create_11 } from "../webgl_data/glindicies.js";
import { uint8Array } from "../js/typedarray_utils.js";
import { uncurry } from "../.fable/fable-library.3.0.0/Util.js";
import { GlCanvasParams__get_LineWidth, GlCanvasParams__get_FillColor, GlCanvasParams__get_StrokeColor } from "../webgl_data/glcanvasparams.js";
import { disable, enable, disableBlending, enableBlending, blendEquationSeparate, blendEquation, blendFuncSeparate, blendFunc, blendColorV, blendColor, disableCulling, enableCulling, cullFace, cullFrontAndBack, cullBack, cullFront, disableDepthTesting, enableDepthTesting } from "../webgl_data/glcapabilities.js";

export function Props_glcanvas(canvasId, props) {
    const res = (() => create(canvasId, props))();
    return res;
}

export function Props_glscene(props, overrides, canvas) {
    const res = (() => create_1(canvas, append(props, overrides)))();
    return res;
}

export function Props_globject(vertex, fragment, props, overrides, scene) {
    const res = (() => create_2(vertex, fragment, scene.Shared, scene, append(props, overrides)))();
    return res;
}

export function Props_glubo(name, props, overrides, parentObject) {
    const name_1 = toText(interpolate("UBO %P()", [name]));
    const res = (() => create_3(name, append(props, overrides), parentObject))();
    return res;
}

export function Props_gltexture(props, overrides, parentObject) {
    const name = toText(interpolate("texture", []));
    const res = (() => create_4(append(props, overrides), parentObject))();
    return res;
}

export function CanvasProps_canvasglobal(vertex, fragment, props) {
    const result = (overrides, scene) => {
        const res = (() => create_2(vertex, fragment, void 0, scene, cons(new BuilderTypes_GlObjProp(16, false), append(props, overrides))))();
        return res;
    };
    return new BuilderTypes_GlCanvasProp(14, result);
}

export function CanvasProps_scene(props) {
    return new BuilderTypes_GlCanvasProp(15, (overrides, canvas) => Props_glscene(props, overrides, canvas));
}

export const CanvasProps_globalWithResolutionTime2d = CanvasProps_canvasglobal("globalVertex2d", "emptyFragment", empty());

export function CanvasProps_canvasName(name) {
    return new BuilderTypes_GlCanvasProp(0, name);
}

export function CanvasProps_canvasSize(x) {
    return new BuilderTypes_GlCanvasProp(1, x);
}

export function CanvasProps_canvasWidth(x) {
    return new BuilderTypes_GlCanvasProp(2, x);
}

export function CanvasProps_canvasHeight(x) {
    return new BuilderTypes_GlCanvasProp(3, x);
}

export function CanvasProps_worldBounds(x) {
    return new BuilderTypes_GlCanvasProp(4, x);
}

export function CanvasProps_pixelStorageParams(x) {
    return new BuilderTypes_GlCanvasProp(6, x);
}

export function CanvasProps_pixelStorage(x) {
    return new BuilderTypes_GlCanvasProp(7, x);
}

export function CanvasProps_canvasBackground(x) {
    return new BuilderTypes_GlCanvasProp(8, x);
}

export const CanvasProps_clearColorBuffer = new BuilderTypes_GlCanvasProp(9);

export const CanvasProps_clearDepthBuffer = new BuilderTypes_GlCanvasProp(10);

export const CanvasProps_clearStencilBuffer = new BuilderTypes_GlCanvasProp(11);

export function CanvasProps_clearMask(x) {
    return new BuilderTypes_GlCanvasProp(12, x);
}

export const CanvasProps_dontClearCanvas = new BuilderTypes_GlCanvasProp(13);

export function CanvasProps_attributes(x) {
    return new BuilderTypes_GlCanvasProp(16, x);
}

export const CanvasProps_noAlpha = new BuilderTypes_GlCanvasProp(17);

export const CanvasProps_desynchronized = new BuilderTypes_GlCanvasProp(18);

export const CanvasProps_noAntialias = new BuilderTypes_GlCanvasProp(19);

export const CanvasProps_noDepth = new BuilderTypes_GlCanvasProp(20);

export const CanvasProps_failIfMajorPerformanceCaveat = new BuilderTypes_GlCanvasProp(21);

export const CanvasProps_noPremultipliedAlpha = new BuilderTypes_GlCanvasProp(22);

export const CanvasProps_preserveDrawingBuffer = new BuilderTypes_GlCanvasProp(23);

export const CanvasProps_stencil = new BuilderTypes_GlCanvasProp(24);

export const CanvasProps_powerPreferenceDefault = new BuilderTypes_GlCanvasProp(25);

export const CanvasProps_powerPreferenceHighPerformance = new BuilderTypes_GlCanvasProp(26);

export const CanvasProps_powerPreferenceLowPower = new BuilderTypes_GlCanvasProp(27);

export function AttributesProps_alpha(x) {
    return new GlContextAttribute(0, x);
}

export function AttributesProps_desynchronized(x) {
    return new GlContextAttribute(1, x);
}

export function AttributesProps_antialias(x) {
    return new GlContextAttribute(2, x);
}

export function AttributesProps_depth(x) {
    return new GlContextAttribute(3, x);
}

export function AttributesProps_failIfMajorPerformanceCaveat(x) {
    return new GlContextAttribute(4, x);
}

export function AttributesProps_powerPreference(x) {
    return new GlContextAttribute(5, x);
}

export function AttributesProps_premultipliedAlpha(x) {
    return new GlContextAttribute(6, x);
}

export function AttributesProps_preserveDrawingBuffer(x) {
    return new GlContextAttribute(7, x);
}

export function AttributesProps_stencil(x) {
    return new GlContextAttribute(8, x);
}

export function PixelStorageParamsProps_pack_alignment(x) {
    return new GlPixelStorage(0, x);
}

export function PixelStorageParamsProps_unpack_alignment(x) {
    return new GlPixelStorage(1, x);
}

export const PixelStorageParamsProps_unpack_flip_y_webgl = new GlPixelStorage(2);

export const PixelStorageParamsProps_unpack_premultiply_alpha_webgl = new GlPixelStorage(3);

export function PixelStorageParamsProps_unpack_colorspace_conversion_webgl(x) {
    return new GlPixelStorage(4, x);
}

export function PixelStorageParamsProps_pack_row_length(x) {
    return new GlPixelStorage(5, x);
}

export function PixelStorageParamsProps_pack_skip_pixels(x) {
    return new GlPixelStorage(6, x);
}

export function PixelStorageParamsProps_pack_skip_rows(x) {
    return new GlPixelStorage(7, x);
}

export function PixelStorageParamsProps_unpack_row_length(x) {
    return new GlPixelStorage(8, x);
}

export function PixelStorageParamsProps_unpack_image_height(x) {
    return new GlPixelStorage(9, x);
}

export function PixelStorageParamsProps_unpack_skip_pixels(x) {
    return new GlPixelStorage(10, x);
}

export function PixelStorageParamsProps_unpack_skip_rows(x) {
    return new GlPixelStorage(11, x);
}

export function PixelStorageParamsProps_unpack_skip_images(x) {
    return new GlPixelStorage(12, x);
}

export function SceneProps_orthoCam2d(props) {
    const result = (overrides, scene) => {
        const res = (() => create_5(append(props, overrides), scene))();
        return res;
    };
    return new BuilderTypes_GlSceneProp(12, result);
}

export function SceneProps_shared(vertex, fragment, props) {
    const result = (overrides, scene) => {
        const parent = scene.Canvas.Global;
        const res = (() => create_2(vertex, fragment, parent, scene, cons(new BuilderTypes_GlObjProp(16, false), append(props, overrides))))();
        return res;
    };
    return new BuilderTypes_GlSceneProp(13, result);
}

export const SceneProps_sharedObjectWithCamera2d = SceneProps_shared("sharedCameraVertex2d", "emptyFragment", empty());

export function SceneProps_object(vertex, fragment, props) {
    return new BuilderTypes_GlSceneProp(14, (overrides, scene) => Props_globject(vertex, fragment, props, overrides, scene));
}

export function SceneProps_sceneName(x) {
    return new BuilderTypes_GlSceneProp(0, x);
}

export function SceneProps_layers(x) {
    return new BuilderTypes_GlSceneProp(1, x);
}

export function SceneProps_defaultLayer(x) {
    return new BuilderTypes_GlSceneProp(2, x);
}

export function SceneProps_sceneBackground(x) {
    return new BuilderTypes_GlSceneProp(3, x);
}

export const SceneProps_sceneClearColorBuffer = new BuilderTypes_GlSceneProp(4);

export const SceneProps_sceneClearDepthBuffer = new BuilderTypes_GlSceneProp(5);

export const SceneProps_sceneClearStencilBuffer = new BuilderTypes_GlSceneProp(6);

export function SceneProps_sceneClearMask(x) {
    return new BuilderTypes_GlSceneProp(7, x);
}

export function SceneProps_sceneWorldBounds(x) {
    return new BuilderTypes_GlSceneProp(8, x);
}

export function SceneProps_sceneBounds(x) {
    return new BuilderTypes_GlSceneProp(9, x);
}

export function SceneProps_worldScale(x) {
    return new BuilderTypes_GlSceneProp(10, x);
}

export const SceneProps_dontClearSceneBackground = new BuilderTypes_GlSceneProp(11);

export function SceneProps_camera(x) {
    return new BuilderTypes_GlSceneProp(12, x);
}

export function SceneProps_sceneObject(x) {
    return new BuilderTypes_GlSceneProp(14, x);
}

export function CameraProps_cameraName(x) {
    return new BuilderTypes_GlCamProp(0, x);
}

export const CameraProps_dontClearViewport = new BuilderTypes_GlCamProp(1);

export function CameraProps_cameraBackground(x) {
    return new BuilderTypes_GlCamProp(2, x);
}

export const CameraProps_cameraClearColorBuffer = new BuilderTypes_GlCamProp(3);

export const CameraProps_cameraClearDepthBuffer = new BuilderTypes_GlCamProp(4);

export const CameraProps_cameraClearStencilBuffer = new BuilderTypes_GlCamProp(5);

export function CameraProps_cameraClearMask(x) {
    return new BuilderTypes_GlCamProp(6, x);
}

export function CameraProps_borderWidth(x) {
    return new BuilderTypes_GlCamProp(7, x);
}

export const CameraProps_dontAutoSizeViewport = new BuilderTypes_GlCamProp(8);

export const CameraProps_dontUseViewSizeAspect = new BuilderTypes_GlCamProp(9);

export const CameraProps_dontAutoPosition = new BuilderTypes_GlCamProp(10);

export function CameraProps_cameraPosition(x) {
    return new BuilderTypes_GlCamProp(11, x);
}

export function CameraProps_lookAt(x) {
    return new BuilderTypes_GlCamProp(12, x);
}

export function CameraProps_viewSize(x) {
    return new BuilderTypes_GlCamProp(13, x);
}

export function CameraProps_viewportBounds(x) {
    return new BuilderTypes_GlCamProp(14, x);
}

export function CameraProps_up(x) {
    return new BuilderTypes_GlCamProp(15, x);
}

export function CameraProps_near(x) {
    return new BuilderTypes_GlCamProp(16, x);
}

export function CameraProps_far(x) {
    return new BuilderTypes_GlCamProp(17, x);
}

export function CameraProps_aspect(x) {
    return new BuilderTypes_GlCamProp(18, x);
}

export function CameraProps_fov(x) {
    return new BuilderTypes_GlCamProp(19, x);
}

export function UniformProps_value(x) {
    return new BuilderTypes_GlUniformProp(0, x);
}

export function UniformProps_uniformLink(x) {
    return new BuilderTypes_GlUniformProp(1, x);
}

export function UniformProps_vec2Value(x, y) {
    return new BuilderTypes_GlUniformProp(0, [x, y]);
}

export function UniformProps_vec2ValueV(v) {
    return new BuilderTypes_GlUniformProp(0, Vec2__get_Values(v));
}

export function UniformProps_vec4Value(x, y, z, w) {
    return new BuilderTypes_GlUniformProp(0, [x, y, z, w]);
}

export function UniformProps_vec4ValueV(v) {
    return new BuilderTypes_GlUniformProp(0, Vec4__get_Values(v));
}

export function UboProps_u(name, props) {
    const result = (overrides, parentUbo, parentObject) => {
        const name_1 = toText(interpolate("ubo uniform %P()", [name]));
        const res = (() => create_6(name, append(props, overrides), parentUbo, parentObject))();
        return res;
    };
    return new BuilderTypes_GlUboProp(1, result);
}

export function UboProps_bufferIndex(x) {
    return new BuilderTypes_GlUboProp(0, x);
}

export function UboProps_uboUniform(x) {
    return new BuilderTypes_GlUboProp(1, x);
}

export function UboProps_uboLink(x) {
    return new BuilderTypes_GlUboProp(2, x);
}

export function AttributeProps_baseType(x) {
    return new BuilderTypes_GlAttrProp(0, x);
}

export const AttributeProps_normalize = new BuilderTypes_GlAttrProp(1);

export function AttributeProps_stride(x) {
    return new BuilderTypes_GlAttrProp(3, x);
}

export function AttributeProps_offset(x) {
    return new BuilderTypes_GlAttrProp(4, x);
}

export function AttributeProps_values(x) {
    return new BuilderTypes_GlAttrProp(5, x);
}

export function AttributeProps_dataCount(x) {
    return new BuilderTypes_GlAttrProp(6, x);
}

export function AttributeProps_bufferUsage(x) {
    return new BuilderTypes_GlAttrProp(7, x);
}

export const AttributeProps_determinesVertexCount = new BuilderTypes_GlAttrProp(8);

export const AttributeProps_determinesInstanceCount = new BuilderTypes_GlAttrProp(9);

export function AttributeProps_divisor(x) {
    return new BuilderTypes_GlAttrProp(10, x);
}

export function AttributeProps_childAttribute(x) {
    return new BuilderTypes_GlAttrProp(11, x);
}

export function AttributeProps_attributeLink(x) {
    return new BuilderTypes_GlAttrProp(12, x);
}

export function AttributeProps_vec2Values(arr) {
    return new BuilderTypes_GlAttrProp(5, Vec_vec2Values(arr));
}

export function AttributeProps_vec2ValuesL(arr) {
    return AttributeProps_vec2Values(Array.from(arr));
}

export function IndicesProps_IndexType(x) {
    return new BuilderTypes_GlIndicesProp(0, x);
}

export function IndicesProps_IndexOffset(x) {
    return new BuilderTypes_GlIndicesProp(1, x);
}

export function IndicesProps_IndexValues(x) {
    return new BuilderTypes_GlIndicesProp(2, x);
}

export function IndicesProps_IndexBufferUsage(x) {
    return new BuilderTypes_GlIndicesProp(3, x);
}

export function IndicesProps_IndicesLink(x) {
    return new BuilderTypes_GlIndicesProp(4, x);
}

export function TextureProps_textureName(x) {
    return new BuilderTypes_GlTextureProp(0, x);
}

export function TextureProps_textureTarget(x) {
    return new BuilderTypes_GlTextureProp(1, x);
}

export function TextureProps_textureIndex(x) {
    return new BuilderTypes_GlTextureProp(2, x);
}

export function TextureProps_level(x) {
    return new BuilderTypes_GlTextureProp(3, x);
}

export function TextureProps_internalFormat(x) {
    return new BuilderTypes_GlTextureProp(6, x);
}

export function TextureProps_textureWidth(x) {
    return new BuilderTypes_GlTextureProp(4, x);
}

export function TextureProps_textureHeight(x) {
    return new BuilderTypes_GlTextureProp(5, x);
}

export function TextureProps_format(x) {
    return new BuilderTypes_GlTextureProp(7, x);
}

export function TextureProps_textureDataType(x) {
    return new BuilderTypes_GlTextureProp(8, x);
}

export function TextureProps_pixels(x) {
    return new BuilderTypes_GlTextureProp(10, x);
}

export function TextureProps_byteOffset(x) {
    return new BuilderTypes_GlTextureProp(11, x);
}

export const TextureProps_noMipMap = new BuilderTypes_GlTextureProp(9);

export function TextureProps_magFilter(x) {
    return new BuilderTypes_GlTextureProp(12, x);
}

export function TextureProps_minFilter(x) {
    return new BuilderTypes_GlTextureProp(13, x);
}

export function TextureProps_wrapS(x) {
    return new BuilderTypes_GlTextureProp(14, x);
}

export function TextureProps_wrapT(x) {
    return new BuilderTypes_GlTextureProp(15, x);
}

export function TextureProps_wrapR(x) {
    return new BuilderTypes_GlTextureProp(16, x);
}

export function TextureProps_baseLevel(x) {
    return new BuilderTypes_GlTextureProp(17, x);
}

export function TextureProps_compareFunc(x) {
    return new BuilderTypes_GlTextureProp(18, x);
}

export function TextureProps_compareMode(x) {
    return new BuilderTypes_GlTextureProp(19, x);
}

export function TextureProps_maxLevel(x) {
    return new BuilderTypes_GlTextureProp(20, x);
}

export function TextureProps_maxLod(x) {
    return new BuilderTypes_GlTextureProp(21, x);
}

export function TextureProps_minLod(x) {
    return new BuilderTypes_GlTextureProp(22, x);
}

export function TextureProps_textureLink(x) {
    return new BuilderTypes_GlTextureProp(23, x);
}

export function InterleaveProps_child(name, props) {
    const result = (overrides, parentAttribute, parentObject) => {
        const name_1 = toText(interpolate("child %P()", [name]));
        const res = (() => create_7(name, append(props, overrides), parentAttribute, parentObject))();
        return res;
    };
    return new BuilderTypes_GlAttrProp(11, result);
}

export function ObjectProps_uniform(name, props) {
    const result = (overrides, parentObject) => {
        const name_1 = toText(interpolate("uniform %P()", [name]));
        const res = (() => create_8(name, append(props, overrides), parentObject))();
        return res;
    };
    return new BuilderTypes_GlObjProp(10, result);
}

export function ObjectProps_ubo(name, props) {
    return new BuilderTypes_GlObjProp(11, (overrides, parentObject) => Props_glubo(name, props, overrides, parentObject));
}

export function ObjectProps_attribute(name, props) {
    const result = (overrides, parentObject) => {
        const name_1 = toText(interpolate("attribute %P()", [name]));
        const res = (() => create_9(name, append(props, overrides), parentObject))();
        return res;
    };
    return new BuilderTypes_GlObjProp(12, result);
}

export function ObjectProps_interleave(name, props) {
    const result = (overrides, parentObject) => {
        const name_1 = toText(interpolate("attribute %P()", [name]));
        const res = (() => create_10(name, append(props, overrides), parentObject))();
        return res;
    };
    return new BuilderTypes_GlObjProp(12, result);
}

export function ObjectProps_Indices(props) {
    const result = (overrides, parentObject) => {
        const res = (() => create_11(append(props, overrides), parentObject))();
        return res;
    };
    return new BuilderTypes_GlObjProp(13, result);
}

export function ObjectProps_texture(props) {
    return new BuilderTypes_GlObjProp(14, (overrides, parentObject) => Props_gltexture(props, overrides, parentObject));
}

export function ObjectProps_position2d(x, y) {
    return new BuilderTypes_GlObjProp(24, Vec3_Create_8ED0A5D(x, y, 0));
}

export function ObjectProps_position2dv(p) {
    return new BuilderTypes_GlObjProp(24, Vec3_Create_Z18D5882D(p, 0));
}

export function ObjectProps_pixelDataUint8(values) {
    return new BuilderTypes_GlTextureProp(10, new GlTexturePixels(0, uint8Array(values)));
}

export function ObjectProps_pixelImageId(id) {
    const img = document.getElementById(id);
    return new BuilderTypes_GlTextureProp(10, new GlTexturePixels(2, img));
}

export function ObjectProps_objectName(x) {
    return new BuilderTypes_GlObjProp(0, x);
}

export function ObjectProps_drawMethod(x) {
    return new BuilderTypes_GlObjProp(1, x);
}

export function ObjectProps_drawPrimitive(x) {
    return new BuilderTypes_GlObjProp(2, x);
}

export function ObjectProps_vertexCount(x) {
    return new BuilderTypes_GlObjProp(3, x);
}

export function ObjectProps_vertexOffset(x) {
    return new BuilderTypes_GlObjProp(4, x);
}

export function ObjectProps_vertexCountOffset(x) {
    return new BuilderTypes_GlObjProp(5, x);
}

export function ObjectProps_instanceCount(x) {
    return new BuilderTypes_GlObjProp(6, x);
}

export function ObjectProps_instanceOffset(x) {
    return new BuilderTypes_GlObjProp(7, x);
}

export function ObjectProps_instanceCountOffset(x) {
    return new BuilderTypes_GlObjProp(8, x);
}

export function ObjectProps_IndicesOffset(x) {
    return new BuilderTypes_GlObjProp(9, x);
}

export function ObjectProps_capability(x) {
    return new BuilderTypes_GlObjProp(15, x);
}

export function ObjectProps_processLinked(x) {
    return new BuilderTypes_GlObjProp(16, x);
}

export function ObjectProps_parallaxCamera(x) {
    return new BuilderTypes_GlObjProp(17, x);
}

export function ObjectProps_parallaxDistance(x) {
    return new BuilderTypes_GlObjProp(18, x);
}

export function ObjectProps_layer(x) {
    return new BuilderTypes_GlObjProp(19, x);
}

export function ObjectProps_angle(x) {
    return new BuilderTypes_GlObjProp(20, x);
}

export function ObjectProps_angleDegrees(x) {
    return new BuilderTypes_GlObjProp(21, x);
}

export function ObjectProps_angleZ(x) {
    return new BuilderTypes_GlObjProp(22, x);
}

export function ObjectProps_angleDegreesZ(x) {
    return new BuilderTypes_GlObjProp(23, x);
}

export function ObjectProps_position(x) {
    return new BuilderTypes_GlObjProp(24, x);
}

export function ObjectProps_scale(x) {
    return new BuilderTypes_GlObjProp(25, x);
}

export function ObjectProps_objectLink(x) {
    return new BuilderTypes_GlObjProp(26, x);
}

export function ObjectProps_pathParams(config, scene) {
    let props;
    return new BuilderTypes_GlObjProp(11, uncurry(2, (props = ofArray([UboProps_u("strokeColor", singleton(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(GlCanvasParams__get_StrokeColor(config))))), UboProps_u("fillColor", singleton(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(GlCanvasParams__get_FillColor(config))))), UboProps_u("lineWidth", singleton(new BuilderTypes_GlUniformProp(0, pixelsToWorld(GlCanvasParams__get_LineWidth(config), scene))))]), (overrides) => ((parentObject) => Props_glubo("pathParams", props, overrides, parentObject)))));
}

export const ObjectProps_enableDepthTesting = enableDepthTesting;

export const ObjectProps_disableDepthTesting = disableDepthTesting;

export const ObjectProps_cullFront = cullFront;

export const ObjectProps_cullBack = cullBack;

export const ObjectProps_cullFrontAndBack = cullFrontAndBack;

export const ObjectProps_cullFace = cullFace;

export const ObjectProps_enableCulling = enableCulling;

export const ObjectProps_disableCulling = disableCulling;

export const ObjectProps_blendColor = (r) => ((g) => ((b) => ((a) => blendColor(r, g, b, a))));

export const ObjectProps_blendColorV = blendColorV;

export const ObjectProps_blendFunc = (sfactor) => ((dfactor) => blendFunc(sfactor, dfactor));

export const ObjectProps_blendFuncSeparate = (srcRGB) => ((dstRGB) => ((srcAlpha) => ((dstAlpha) => blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha))));

export const ObjectProps_blendEquation = blendEquation;

export const ObjectProps_blendEquationSeparate = (modeRGB) => ((modeAlpha) => blendEquationSeparate(modeRGB, modeAlpha));

export const ObjectProps_enableBlending = enableBlending;

export const ObjectProps_disableBlending = disableBlending;

export const ObjectProps_enable = enable;

export const ObjectProps_disable = disable;

