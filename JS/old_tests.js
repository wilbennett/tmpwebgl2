import { GlMouse__get_Changed, GlMouse__Update, GlMouse__get_WheelDelta, GlMouse__get_IsWheelEvent, GlMouse__IsDragEndEvent_Z524259A4, GlMouse__get_Position, GlMouse__IsDragEvent_Z524259A4, GlMouse__DragOrigin_Z524259A4, GlMouse__IsDragStartEvent_Z524259A4, Mouse_leftButton, GlMouse_$ctor_Z38C79397 } from "./webgl_data/glmouse.js";
import { interpolate, toText } from "./.fable/fable-library.3.0.0/String.js";
import { head as head_1, tryHead, collect, empty, concat, singleton, append, delay } from "./.fable/fable-library.3.0.0/Seq.js";
import { Vec2_op_Subtraction_Z24FF8540, Vec3_Create_Z18D5882D, Vec2_op_Subtraction_47807E55, Vec4__get_Values, Vec2_op_Division_Z24FF8540, Vec2_op_Multiply_Z24FF8540, Vec2_op_Multiply_47807E55, Vec4_Create_Z27E3A4C0, Vec3_op_Addition_Z24FF85E0, Vec3_op_Subtraction_Z24FF85E0, Vec3_Create, Vec2_Create_7B00E9A0, Vec2__get_Values } from "./core/vectors.js";
import { BoundsModule_bounds, BoundsModule_boundsCenterHalf, Bounds__get_Quadrant1, Bounds__get_Center, Bounds__get_HalfSize, Bounds__get_Size, BoundsModule_boundsCenterV, Bounds__get_Height, Bounds__get_Width, BoundsModule_boundsCenter, BoundsModule_boundsSize, Bounds__get_MaxLeft, Bounds__get_MaxRight, Bounds__get_MinRight, Bounds__get_MinLeft } from "./twod/bounds.js";
import { map, append as append_1 } from "./.fable/fable-library.3.0.0/Array.js";
import { some } from "./.fable/fable-library.3.0.0/Option.js";
import { tryGetObject, getObject, getCamera } from "./webgl_data/glscene.js";
import { dirtyObject, objects } from "./webgl_data/glcommon.js";
import { getSceneByIndex, render as render_1 } from "./webgl_data/glcanvas.js";
import { panToXYZ, panByXY, zoomToward, toWorldO } from "./webgl_data/glcamera.js";
import { executeDefault, call } from "./core/optionex.js";
import { dirty, getAttribute, getUniform, update as update_2, render as render_2, setPosition } from "./webgl_data/globj.js";
import { add } from "./.fable/fable-library.3.0.0/Observable.js";
import { WebglShaderUtils_addShaderInclude, WebglShaderUtils_addFragmentShaderSource, WebglShaderUtils_addVertexShaderSource } from "./webgl_core/shader_utils.js";
import { tableObjDef, tableObjDefAndContents } from "./webgl_data/gldebug.js";
import { GlProgram_emptyProgramInfo, GlProgram_Utils_createProgram } from "./webgl_core/program_utils.js";
import { toArrayBufferViewUint16, float32Array, toArrayBufferViewFloat32 } from "./js/typedarray_utils.js";
import { SceneProps_sharedObjectWithCamera2d, ObjectProps_position2dv, ObjectProps_pixelDataUint8, ObjectProps_pixelImageId, ObjectProps_texture, SceneProps_orthoCam2d, SceneProps_shared, UboProps_u, ObjectProps_ubo, IndicesProps_IndexValues, ObjectProps_Indices, InterleaveProps_child, ObjectProps_interleave, ObjectProps_attribute, ObjectProps_uniform, SceneProps_object, CanvasProps_scene, Props_glcanvas } from "./webgl_objects/props.js";
import { BuilderTypes_GlTextureProp, BuilderTypes_GlCamProp, BuilderTypes_GlCanvasProp, BuilderTypes_GlSceneProp, BuilderTypes_GlUboProp, BuilderTypes_GlAttrProp, BuilderTypes_GlUniformProp, BuilderTypes_GlObjProp } from "./webgl_data/webgl_data.js";
import { empty as empty_1, head, ofArray, singleton as singleton_1 } from "./.fable/fable-library.3.0.0/List.js";
import Timer from "./.fable/fable-library.3.0.0/Timer.js";
import { setValue } from "./webgl_data/gluniform.js";
import { setValues, setValue as setValue_1 } from "./webgl_data/glattrib.js";
import { cullBack, cullFront } from "./webgl_data/glcapabilities.js";
import { Mat4__RotateZM_6069AC9A, Mat4__TranslateM_8ED0A5D, Mat4_Create, Mat4__get_Values } from "./core/matricies.js";
import { GlPixelStorage } from "./webgl_data/webgl_data_types.js";
import { GlRenderer__LinePath2D_5BF31CC8, GlRenderer__Line2D_515305A0, GlRenderer__Vector2D_Z270D9612, GlRenderer__Grid2D_Z270D9612, GlRenderer_$ctor } from "./webgl_objects/renderer.js";
import { Grid2D__set_MinorTick_5E38073B } from "./webgl_objects/grid2d.js";
import { WebglObject__set_AngleDegreesZ_60759B6B, WebglObject__set_Scale_5E38073B, WebglObject__set_Position_Z3D47FC51 } from "./webgl_objects/webglobject.js";
import { VectorObject2D__get_Vector } from "./webgl_objects/vectorobject2d.js";
import { QuadObjectBase__set_StrokeColor_Z3D47FC58 } from "./webgl_objects/quadobjectbase.js";
import { LineObjects2D__set_LineCap_7B1263D0, LineObjects2D__set_StrokeColor_Z3D47FC58, LineObjects2D__set_LineWidth_5E38073B } from "./webgl_objects/lineobjects2d.js";
import { LinePathObject2D__get_LineWidth, LinePathObject2D__set_MiterLimit_5E38073B, LinePathObject2D__set_LineJoin_Z229C3C20, LinePathObject2D__set_LineCap_7B1263D0, LinePathObject2D__set_StrokeColor_Z3D47FC58, LinePathObject2D__set_LineWidth_5E38073B, LinePathObject2D__Set_Z58358D8E, LinePathObject2D__Add_50C79F88, LinePathObject2D__Add_Z3D47FC52 } from "./webgl_objects/linepathobject2d.js";

export const star = document.getElementById("star");

export const myCanvas = document.getElementById("myCanvas");

myCanvas.width = 400;

myCanvas.height = 400;

export const elMouse = document.getElementById("mouse");

export const mouse = GlMouse_$ctor_Z38C79397(myCanvas);

export function showMousePos(pos) {
    elMouse.textContent = toText(interpolate("%P()", [pos]));
}

export function createTriangleData(p1, p2, p3) {
    return new Float64Array([p1.values[0], p1.values[1], p2.values[0], p2.values[1], p3.values[0], p3.values[1]]);
}

export function createInterleaveData(p1, p2, p3, col) {
    return new Float64Array([p1.values[0], p1.values[1], col[0], col[1], col[2], col[3], p2.values[0], p2.values[1], col[0], col[1], col[2], col[3], p3.values[0], p3.values[1], col[0], col[1], col[2], col[3]]);
}

export function interleaveData(triangle, col) {
    return new Float64Array([triangle[0], triangle[1], col[0], col[1], col[2], col[3], triangle[2], triangle[3], col[0], col[1], col[2], col[3], triangle[4], triangle[5], col[0], col[1], col[2], col[3]]);
}

export function createInstanceData(p1, p2, p3, col) {
    return new Float64Array([p1.values[0], p1.values[1], p2.values[0], p2.values[1], p3.values[0], p3.values[1], col[0], col[1], col[2], col[3]]);
}

export function revTriangle(tri) {
    return new Float64Array([tri[0], tri[1], tri[4], tri[5], tri[2], tri[3]]);
}

export function boundsToTriangles(b) {
    return [Float64Array.from(delay(() => append(Vec2__get_Values(Bounds__get_MinLeft(b)), delay(() => append(Vec2__get_Values(Bounds__get_MinRight(b)), delay(() => Vec2__get_Values(Bounds__get_MaxRight(b)))))))), Float64Array.from(delay(() => append(Vec2__get_Values(Bounds__get_MinLeft(b)), delay(() => append(Vec2__get_Values(Bounds__get_MaxRight(b)), delay(() => Vec2__get_Values(Bounds__get_MaxLeft(b))))))))];
}

export const center = Vec2_Create_7B00E9A0(0, 0);

export const topMid = Vec2_Create_7B00E9A0(0, 1);

export const topMid1 = Vec2_Create_7B00E9A0(-0.5, 1);

export const topMid2 = Vec2_Create_7B00E9A0(0.5, 1);

export const topLeft = Vec2_Create_7B00E9A0(-1, 1);

export const left = Vec2_Create_7B00E9A0(-1, 0);

export const botLeft = Vec2_Create_7B00E9A0(-1, -1);

export const botMid = Vec2_Create_7B00E9A0(0, -1);

export const botRight = Vec2_Create_7B00E9A0(1, -1);

export const right = Vec2_Create_7B00E9A0(1, 0);

export const topRight = Vec2_Create_7B00E9A0(1, 1);

export const triangle1 = createTriangleData(center, topMid, topLeft);

export const triangle2 = createTriangleData(center, topLeft, left);

export const triangle3 = createTriangleData(center, left, botLeft);

export const triangle4 = createTriangleData(center, botLeft, botMid);

export const triangle5 = createTriangleData(center, botMid, botRight);

export const triangle6 = createTriangleData(center, botRight, right);

export const triangle7 = createTriangleData(center, topRight, topMid2);

export const triangle8 = createTriangleData(center, topMid2, topMid);

export const fillColor1 = new Float64Array([1, 0, 0, 1]);

export const posData1 = createTriangleData(center, topMid, topLeft);

export const fillColor2 = new Float64Array([0, 1, 0, 1]);

export const posData2 = createInterleaveData(center, topLeft, left, fillColor2);

export const fillColor3 = new Float64Array([0, 0, 1, 1]);

export const posData3 = createTriangleData(center, left, botLeft);

export const fillColor4 = new Float64Array([1, 1, 0, 1]);

export const fillColor5 = new Float64Array([1, 0, 1, 1]);

export const fillColor6 = new Float64Array([0, 1, 1, 1]);

export const fillColor7 = new Float64Array([0.5, 0.5, 1, 1]);

export const posData4 = (() => {
    const array2 = createInstanceData(center, botMid, botRight, fillColor5);
    return append_1(createInstanceData(center, botLeft, botMid, fillColor4), array2, Float64Array);
})();

export const posData5 = createTriangleData(center, botRight, right);

export const posData6 = createTriangleData(center, right, topRight);

export const posData7 = createTriangleData(center, topRight, topMid);

export function getUniforms(info) {
    return delay(() => append(singleton(info), delay(() => ((info.Children.length > 0) ? concat(map(getUniforms, info.Children)) : empty()))));
}

export function showUniforms(data) {
    const pinfo = data.ProgramInfo;
    console.table(some(Array.from(collect(getUniforms, pinfo.Uniforms))));
}

export function showUbos(data) {
    const pinfo = data.ProgramInfo;
    console.table(some(Array.from(collect((u) => u.Uniforms, pinfo.Ubos))));
}

export function showAttributes(data) {
    const pinfo = data.ProgramInfo;
    console.table(some(Array.from(pinfo.Attributes)));
}

export function run(f) {
    const patternInput = f();
    const update = patternInput[1];
    const frames = patternInput[3] | 0;
    const canvas = patternInput[0];
    const animating = patternInput[2];
    const scene = canvas.Scenes[0];
    const cam = getCamera("cam")(scene);
    const tri1 = tryHead(objects(scene));
    render_1(0, canvas);
    let frame = 0;
    const dragButton = Mouse_leftButton | 0;
    let dragging = false;
    let dragOffset = Vec3_Create();
    const processMouse = () => {
        if (GlMouse__IsDragStartEvent_Z524259A4(mouse, dragButton)) {
            dragging = true;
            const origin = toWorldO(GlMouse__DragOrigin_Z524259A4(mouse, dragButton), Vec3_Create(), cam);
            call((tri1_1) => {
                dragOffset = Vec3_op_Subtraction_Z24FF85E0(tri1_1.Position, origin);
            }, tri1);
        }
        if (GlMouse__IsDragEvent_Z524259A4(mouse, dragButton) ? dragging : false) {
            const worldPos = toWorldO(GlMouse__get_Position(mouse), Vec3_Create(), cam);
            call((tri1_2) => {
                setPosition(Vec3_op_Addition_Z24FF85E0(worldPos, dragOffset), tri1_2);
            }, tri1);
        }
        if (GlMouse__IsDragEndEvent_Z524259A4(mouse, dragButton)) {
            dragging = true;
        }
        if (GlMouse__get_IsWheelEvent(mouse)) {
            if (GlMouse__get_WheelDelta(mouse).values[1] !== 0) {
                const zoom = (GlMouse__get_WheelDelta(mouse).values[1] > 0) ? 1.03 : 0.97;
                const worldPos_1 = toWorldO(GlMouse__get_Position(mouse), Vec3_Create(), cam);
                zoomToward(worldPos_1, zoom, cam);
            }
            if (GlMouse__get_WheelDelta(mouse).values[0] !== 0) {
                const amount = (GlMouse__get_WheelDelta(mouse).values[0] > 0) ? 10 : -10;
                panByXY(amount, 0, cam);
            }
        }
    };
    const render = (time) => {
        frame = (frame + 1);
        if (animating ? (frame < frames) : false) {
            const value = window.requestAnimationFrame(render);
            void value;
        }
        GlMouse__Update(mouse);
        showMousePos(GlMouse__get_Position(mouse));
        processMouse();
        if (animating) {
            update(time / 1000);
        }
        render_1(0, canvas);
    };
    const scheduleRender = () => {
        const value_1 = window.requestAnimationFrame(render);
        void value_1;
    };
    add(scheduleRender, GlMouse__get_Changed(mouse));
    scheduleRender();
}

export function testc() {
    const gl = myCanvas.getContext('2d');
    gl.fillStyle = "blue";
    gl.fillRect(0, 0, gl.canvas.width, gl.canvas.height);
}

export function testw() {
    const vertex2d = "#version 300 es\r\n  in vec2 a_position;\r\n\r\n  void main() {\r\n    vec2 position = a_position;\r\n    gl_Position = vec4(position, 0.0, 1.0);\r\n  }";
    const fragment2d = "#version 300 es\r\n  precision mediump float;\r\n\r\n  uniform vec4 u_fillColor;\r\n  uniform float temp[3];\r\n  uniform bool tempBool;\r\n  out vec4 glFragColor;\r\n\r\n  void main() {\r\n    //glFragColor = vec4(1, 0, 0.5, 1);\r\n    // glFragColor = u_fillColor;\r\n    glFragColor = vec4(u_fillColor.x * temp[0], u_fillColor.y * temp[1], u_fillColor.z * temp[2], u_fillColor.w);\r\n    glFragColor *= float(tempBool);\r\n  }";
    const vertexInterleave = "#version 300 es\r\n  in vec2 a_position;\r\n  in vec4 a_fillColor;\r\n\r\n  out vec4 v_fillColor;\r\n\r\n  void main() {\r\n    gl_Position = vec4(a_position, 0.0, 1.0);\r\n    v_fillColor = a_fillColor;\r\n  }";
    const fragmentInterleave = "#version 300 es\r\n  precision mediump float;\r\n\r\n  in vec4 v_fillColor;\r\n\r\n  out vec4 glFragColor;\r\n\r\n  void main() {\r\n    glFragColor = v_fillColor;\r\n  }";
    const vertexInstance = "#version 300 es\r\n  in vec2 a_posA;\r\n  in vec2 a_posB;\r\n  in vec2 a_posC;\r\n  in vec4 a_fillColor;\r\n\r\n  out vec4 v_fillColor;\r\n\r\n  void main() {\r\n    switch (gl_VertexID) {\r\n      case 0:\r\n        gl_Position = vec4(a_posA, 0.0, 1.0);\r\n        break;\r\n      case 1:\r\n        gl_Position = vec4(a_posB, 0.0, 1.0);\r\n        break;\r\n      case 2:\r\n        gl_Position = vec4(a_posC, 0.0, 1.0);\r\n        break;\r\n    }\r\n\r\n    v_fillColor = a_fillColor;\r\n  }";
    const fragmentInstance = "#version 300 es\r\n  precision mediump float;\r\n\r\n  in vec4 v_fillColor;\r\n\r\n  out vec4 glFragColor;\r\n\r\n  void main() {\r\n    glFragColor = v_fillColor;\r\n  }";
    const vertexUbo = "#version 300 es\r\n  //layout (std140)\r\n\r\n  uniform perScene {\r\n    float value;\r\n    vec3 vector;\r\n    mat4 matrix;\r\n    float values[3];\r\n    bool boolean;\r\n    int integer;\r\n    mat3 matrix3;\r\n  \tvec4 color1;\r\n    mat3 mat3A[3];\r\n    vec4 color2;\r\n  };\r\n\r\n  uniform perModel {\r\n  \tvec4 color3;\r\n  };\r\n\r\n  in vec2 a_position;\r\n  uniform float flt;\r\n  out vec3 v_color;\r\n\r\n  void main() {\r\n    vec3 position = vec3(a_position, 0.0);\r\n    position = (matrix * vec4(position, 1.0)).xyz;\r\n    position *= matrix3;\r\n    // position *= mat3A[0];\r\n    // position *= mat3A[1];\r\n    gl_Position = vec4(position, 1.0);\r\n    v_color = color1.rgb + color2.rgb + color3.rgb + flt;\r\n    v_color *= value;\r\n    v_color *= float(boolean);\r\n    v_color *= float(integer);\r\n    v_color *= vector;\r\n    v_color *= vec3(values[0]);\r\n    v_color *= vec3(values[1]);\r\n    // v_color = vec3(1.0, 0.0, 0.0);\r\n    // v_color = vec3(mat3A[0][0][0], mat3A[0][0][1], mat3A[0][0][2]);\r\n    // v_color = vec3(mat3A[0][1][0], mat3A[0][1][1], mat3A[0][1][2]);\r\n    // v_color = vec3(mat3A[0][2][0], mat3A[0][2][1], mat3A[0][2][2]);\r\n\r\n    // v_color = vec3(mat3A[1][0][0], mat3A[1][0][1], mat3A[1][0][2]);\r\n    // v_color = vec3(mat3A[1][1][0], mat3A[1][1][1], mat3A[1][1][2]);\r\n    // v_color = vec3(mat3A[1][2][0], mat3A[1][2][1], mat3A[1][2][2]);\r\n\r\n    // v_color = vec3(mat3A[2][0][0], mat3A[2][0][1], mat3A[2][0][2]);\r\n    // v_color = vec3(mat3A[2][1][0], mat3A[2][1][1], mat3A[2][1][2]);\r\n    // v_color = vec3(mat3A[2][2][0], mat3A[2][2][1], mat3A[2][2][2]);\r\n  }\r\n  ";
    const fragmentUbo = "#version 300 es\r\n  precision mediump float;\r\n\r\n  in vec3 v_color;\r\n  out vec4 outColor;\r\n\r\n  void main() {\r\n  \toutColor = vec4(v_color, 1.0);\r\n  }\r\n  ";
    const vertexShared = "#version 300 es\r\n  // layout (std140)\r\n\r\n  uniform ubo1 {\r\n  \tvec4 red;\r\n  };\r\n\r\n  uniform ubo2 {\r\n    float temp[3];\r\n  \tvec4 green;\r\n  };\r\n\r\n  in vec2 a_position;\r\n  uniform vec4 blue;\r\n  out vec4 v_color;\r\n\r\n  void main() {\r\n    gl_Position = vec4(a_position, 0.0, 1.0);\r\n    v_color = red + green + blue;\r\n    // v_color = vec3(1.0, 0.0, 0.0);\r\n  }\r\n  ";
    const vertexShared2 = "#version 300 es\r\n  precision mediump sampler3D;\r\n\r\n  uniform ubo1 {\r\n  \tvec4 red;\r\n  };\r\n\r\n  uniform ubo2 {\r\n    float temp[3];\r\n  \tvec4 green;\r\n  };\r\n\r\n  uniform mat2x3 mat2x31;\r\n\r\n  in vec2 a_position;\r\n  uniform mat3 mat31;\r\n  uniform mat3 mat32[2];\r\n  uniform vec4 blue;\r\n  uniform bool yes;\r\n  uniform bool yesYes[2];\r\n  uniform bool no;\r\n  uniform bool noNo[2];\r\n  uniform int int1;\r\n  uniform int int2[2];\r\n  uniform uint uint1;\r\n  uniform uint uint2[2];\r\n  uniform vec2 v2;\r\n  uniform vec2 v22[2];\r\n  uniform vec3 v3;\r\n  uniform vec3 v32[2];\r\n  in vec2 s2;\r\n  uniform sampler2D s2d;\r\n  in vec3 s3;\r\n  uniform sampler3D s3d;\r\n  out vec4 v_color;\r\n\r\n  float add(vec2 v) { return v.x + v.y; }\r\n  float add(vec3 v) { return v.x + v.y + v.z; }\r\n  float add(vec4 v) { return v.x + v.y + v.z + v.w; }\r\n  float add0(vec4 v) { return v.x * 0.0 + v.y * 0.0 + v.z * 0.0 + v.w * 0.0; }\r\n\r\n  void main() {\r\n    vec3 position = vec3(a_position, 0.0);\r\n    position *= mat31;\r\n    position *= mat32[0];\r\n    position *= mat32[1];\r\n    vec2 b = position * mat2x31;\r\n    position += vec3(b, 0.0);\r\n    gl_Position = vec4(position, 1.0);\r\n    vec4 yy = vec4(float(yesYes[0]), float(yesYes[1]), 1.0, 1.0);\r\n    float sum = 1.0\r\n              + float(int1)\r\n              + float(int2[0]) + float(int2[1])\r\n              + float(no)\r\n              + float(noNo[0]) + float(noNo[1])\r\n              + add(v2)\r\n              + add(v22[0]) + add(v22[1])\r\n              + add(v3)\r\n              + add(v32[0]) + add(v32[1])\r\n              + add0(texture(s2d, s2))\r\n              + add0(texture(s3d, s3))\r\n              ;\r\n    v_color = red + green + blue;\r\n    v_color *= float(yes);\r\n    v_color *= yy;\r\n    v_color *= sum;\r\n    v_color *= float(uint1);\r\n    // v_color = texture(s2d, s2);\r\n  }\r\n  ";
    const fragmentShared = "#version 300 es\r\n  precision mediump float;\r\n\r\n  in vec4 v_color;\r\n  out vec4 outColor;\r\n\r\n  void main() {\r\n  \toutColor = v_color;\r\n  }\r\n  ";
    WebglShaderUtils_addVertexShaderSource("vertex2d", vertex2d);
    WebglShaderUtils_addFragmentShaderSource("fragment2d", fragment2d);
    WebglShaderUtils_addVertexShaderSource("vertexInterleave", vertexInterleave);
    WebglShaderUtils_addFragmentShaderSource("fragmentInterleave", fragmentInterleave);
    WebglShaderUtils_addVertexShaderSource("vertexInstance", vertexInstance);
    WebglShaderUtils_addFragmentShaderSource("fragmentInstance", fragmentInstance);
    WebglShaderUtils_addVertexShaderSource("vertexUbo", vertexUbo);
    WebglShaderUtils_addFragmentShaderSource("fragmentUbo", fragmentUbo);
    WebglShaderUtils_addVertexShaderSource("vertexShared", vertexShared);
    WebglShaderUtils_addVertexShaderSource("vertexShared2", vertexShared2);
    WebglShaderUtils_addFragmentShaderSource("fragmentShared", fragmentShared);
    const resetCanvas = () => {
        const gl = myCanvas.getContext("webgl2");
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    const run_1 = (f) => {
        const patternInput = f();
        const tri = patternInput[0];
        const cam = patternInput[1];
        render_2(cam, tri);
        tableObjDefAndContents(tri);
        const pinfo = tri.ProgramInfo;
    };
    const manualArray = () => {
        const gl_1 = myCanvas.getContext("webgl2");
        const program = GlProgram_Utils_createProgram(gl_1, vertex2d, fragment2d);
        gl_1.useProgram(program);
        const posLoc = gl_1.getAttribLocation(program, "a_position");
        const colorLoc = gl_1.getUniformLocation(program, "u_fillColor");
        const posBuffer = gl_1.createBuffer();
        gl_1.bindBuffer(gl_1.ARRAY_BUFFER, posBuffer);
        const pf = toArrayBufferViewFloat32(posData1);
        gl_1.bufferData(gl_1.ARRAY_BUFFER, pf, gl_1.STATIC_DRAW);
        gl_1.uniform4fv(colorLoc, float32Array(fillColor1));
        gl_1.enableVertexAttribArray(posLoc);
        gl_1.vertexAttribPointer(posLoc, 2, gl_1.FLOAT, false, 0, 0);
        gl_1.drawArrays(gl_1.TRIANGLES, 0, 3);
    };
    const manualArrayVao = () => {
        const gl_2 = myCanvas.getContext("webgl2");
        const program_1 = GlProgram_Utils_createProgram(gl_2, vertex2d, fragment2d);
        gl_2.useProgram(program_1);
        const posLoc_1 = gl_2.getAttribLocation(program_1, "a_position");
        const colorLoc_1 = gl_2.getUniformLocation(program_1, "u_fillColor");
        const posBuffer_1 = gl_2.createBuffer();
        gl_2.bindBuffer(gl_2.ARRAY_BUFFER, posBuffer_1);
        const pf_1 = toArrayBufferViewFloat32(posData1);
        gl_2.bufferData(gl_2.ARRAY_BUFFER, pf_1, gl_2.STATIC_DRAW);
        gl_2.uniform4fv(colorLoc_1, float32Array(fillColor1));
        const vao = gl_2.createVertexArray();
        gl_2.bindVertexArray(vao);
        gl_2.enableVertexAttribArray(posLoc_1);
        gl_2.vertexAttribPointer(posLoc_1, 2, gl_2.FLOAT, false, 0, 0);
        gl_2.drawArrays(gl_2.TRIANGLES, 0, 3);
    };
    const autoArray = () => {
        const canvas = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(singleton_1(SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri"), ObjectProps_uniform("u_fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor1))), ObjectProps_uniform("tempBool", singleton_1(new BuilderTypes_GlUniformProp(0, true))), ObjectProps_uniform("temp[0]", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 1, 1])))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, posData1)))]))))));
        const scene = canvas.Scenes[0];
        const cam_1 = head(scene.Cameras);
        return [head_1(objects(scene)), cam_1];
    };
    const manualInterleave = () => {
        const gl_3 = myCanvas.getContext("webgl2");
        const program_2 = GlProgram_Utils_createProgram(gl_3, vertexInterleave, fragmentInterleave);
        gl_3.useProgram(program_2);
        const posLoc_2 = gl_3.getAttribLocation(program_2, "a_position");
        const colorLoc_2 = gl_3.getAttribLocation(program_2, "a_fillColor");
        const posBuffer_2 = gl_3.createBuffer();
        gl_3.bindBuffer(gl_3.ARRAY_BUFFER, posBuffer_2);
        const pf_2 = toArrayBufferViewFloat32(posData2);
        gl_3.bufferData(gl_3.ARRAY_BUFFER, pf_2, gl_3.STATIC_DRAW);
        gl_3.enableVertexAttribArray(posLoc_2);
        gl_3.vertexAttribPointer(posLoc_2, 2, gl_3.FLOAT, false, 24, 0);
        gl_3.enableVertexAttribArray(colorLoc_2);
        gl_3.vertexAttribPointer(colorLoc_2, 4, gl_3.FLOAT, false, 24, 8);
        gl_3.drawArrays(gl_3.TRIANGLES, 0, 3);
    };
    const manualInterleaveVao = () => {
        const gl_4 = myCanvas.getContext("webgl2");
        const program_3 = GlProgram_Utils_createProgram(gl_4, vertexInterleave, fragmentInterleave);
        gl_4.useProgram(program_3);
        const posLoc_3 = gl_4.getAttribLocation(program_3, "a_position");
        const colorLoc_3 = gl_4.getAttribLocation(program_3, "a_fillColor");
        const posBuffer_3 = gl_4.createBuffer();
        gl_4.bindBuffer(gl_4.ARRAY_BUFFER, posBuffer_3);
        const pf_3 = toArrayBufferViewFloat32(posData2);
        gl_4.bufferData(gl_4.ARRAY_BUFFER, pf_3, gl_4.STATIC_DRAW);
        const vao_1 = gl_4.createVertexArray();
        gl_4.bindVertexArray(vao_1);
        gl_4.enableVertexAttribArray(posLoc_3);
        gl_4.vertexAttribPointer(posLoc_3, 2, gl_4.FLOAT, false, 24, 0);
        gl_4.enableVertexAttribArray(colorLoc_3);
        gl_4.vertexAttribPointer(colorLoc_3, 4, gl_4.FLOAT, false, 24, 8);
        gl_4.drawArrays(gl_4.TRIANGLES, 0, 3);
    };
    const autoInterleave = () => {
        const canvas_1 = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(singleton_1(SceneProps_object("vertexInterleave", "fragmentInterleave", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), ObjectProps_interleave("a_position", ofArray([new BuilderTypes_GlAttrProp(5, posData2), InterleaveProps_child("a_fillColor", ofArray([new BuilderTypes_GlAttrProp(8), new BuilderTypes_GlAttrProp(0, 5121)]))]))]))))));
        const scene_1 = canvas_1.Scenes[0];
        const cam_2 = head(scene_1.Cameras);
        return [head_1(objects(scene_1)), cam_2];
    };
    const manualIndexed = () => {
        const gl_5 = myCanvas.getContext("webgl2");
        const program_4 = GlProgram_Utils_createProgram(gl_5, vertex2d, fragment2d);
        gl_5.useProgram(program_4);
        const posLoc_4 = gl_5.getAttribLocation(program_4, "a_position");
        const colorLoc_4 = gl_5.getUniformLocation(program_4, "u_fillColor");
        const posBuffer_4 = gl_5.createBuffer();
        gl_5.bindBuffer(gl_5.ARRAY_BUFFER, posBuffer_4);
        const pf_4 = toArrayBufferViewFloat32(posData3);
        gl_5.bufferData(gl_5.ARRAY_BUFFER, pf_4, gl_5.STATIC_DRAW);
        const Indices = new Int32Array([0, 1, 2]);
        const pi = toArrayBufferViewUint16(Indices);
        const indexBuffer = gl_5.createBuffer();
        gl_5.bindBuffer(gl_5.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl_5.bufferData(gl_5.ELEMENT_ARRAY_BUFFER, pi, gl_5.STATIC_DRAW);
        gl_5.uniform4fv(colorLoc_4, float32Array(fillColor3));
        const vao_2 = gl_5.createVertexArray();
        gl_5.bindVertexArray(vao_2);
        gl_5.enableVertexAttribArray(posLoc_4);
        gl_5.vertexAttribPointer(posLoc_4, 2, gl_5.FLOAT, false, 0, 0);
        gl_5.drawElements(gl_5.TRIANGLES, 3, 5123, 0);
    };
    const manualIndexedVao = () => {
        const gl_6 = myCanvas.getContext("webgl2");
        const program_5 = GlProgram_Utils_createProgram(gl_6, vertex2d, fragment2d);
        gl_6.useProgram(program_5);
        const posLoc_5 = gl_6.getAttribLocation(program_5, "a_position");
        const colorLoc_5 = gl_6.getUniformLocation(program_5, "u_fillColor");
        gl_6.uniform4fv(colorLoc_5, float32Array(fillColor3));
        const posBuffer_5 = gl_6.createBuffer();
        gl_6.bindBuffer(gl_6.ARRAY_BUFFER, posBuffer_5);
        const pf_5 = toArrayBufferViewFloat32(posData3);
        gl_6.bufferData(gl_6.ARRAY_BUFFER, pf_5, gl_6.STATIC_DRAW);
        const indices = new Int32Array([0, 1, 2]);
        const pi_1 = toArrayBufferViewUint16(indices);
        const indexBuffer_1 = gl_6.createBuffer();
        const vao_3 = gl_6.createVertexArray();
        gl_6.bindVertexArray(vao_3);
        gl_6.bindBuffer(gl_6.ELEMENT_ARRAY_BUFFER, indexBuffer_1);
        gl_6.bufferData(gl_6.ELEMENT_ARRAY_BUFFER, pi_1, gl_6.STATIC_DRAW);
        gl_6.enableVertexAttribArray(posLoc_5);
        gl_6.vertexAttribPointer(posLoc_5, 2, gl_6.FLOAT, false, 0, 0);
        gl_6.drawElements(gl_6.TRIANGLES, 3, 5123, 0);
    };
    const autoIndexed = () => {
        const canvas_2 = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(singleton_1(SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), ObjectProps_uniform("u_fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor3))), ObjectProps_uniform("temp[0]", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 1, 1])))), ObjectProps_uniform("tempBool", singleton_1(new BuilderTypes_GlUniformProp(0, true))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, posData3))), ObjectProps_Indices(singleton_1(IndicesProps_IndexValues(new Int32Array([0, 1, 2]))))]))))));
        const scene_2 = canvas_2.Scenes[0];
        const cam_3 = head(scene_2.Cameras);
        return [head_1(objects(scene_2)), cam_3];
    };
    const manualArrayInstanced = () => {
        const gl_7 = myCanvas.getContext("webgl2");
        const program_6 = GlProgram_Utils_createProgram(gl_7, vertexInstance, fragmentInstance);
        gl_7.useProgram(program_6);
        const posALoc = gl_7.getAttribLocation(program_6, "a_posA");
        const posBLoc = gl_7.getAttribLocation(program_6, "a_posB");
        const posCLoc = gl_7.getAttribLocation(program_6, "a_posC");
        const colorLoc_6 = gl_7.getAttribLocation(program_6, "a_fillColor");
        const posBuffer_6 = gl_7.createBuffer();
        gl_7.bindBuffer(gl_7.ARRAY_BUFFER, posBuffer_6);
        const pf_6 = toArrayBufferViewFloat32(posData4);
        gl_7.bufferData(gl_7.ARRAY_BUFFER, pf_6, gl_7.STATIC_DRAW);
        const vao_4 = gl_7.createVertexArray();
        gl_7.bindVertexArray(vao_4);
        gl_7.enableVertexAttribArray(posALoc);
        gl_7.vertexAttribPointer(posALoc, 2, gl_7.FLOAT, false, 40, 0);
        gl_7.vertexAttribDivisor(posALoc, 1);
        gl_7.enableVertexAttribArray(posBLoc);
        gl_7.vertexAttribPointer(posBLoc, 2, gl_7.FLOAT, false, 40, 8);
        gl_7.vertexAttribDivisor(posBLoc, 1);
        gl_7.enableVertexAttribArray(posCLoc);
        gl_7.vertexAttribPointer(posCLoc, 2, gl_7.FLOAT, false, 40, 16);
        gl_7.vertexAttribDivisor(posCLoc, 1);
        gl_7.enableVertexAttribArray(colorLoc_6);
        gl_7.vertexAttribPointer(colorLoc_6, 4, gl_7.FLOAT, false, 40, 24);
        gl_7.vertexAttribDivisor(colorLoc_6, 1);
        gl_7.drawArraysInstanced(gl_7.TRIANGLES, 0, 6, 2);
    };
    const manualArrayInstancedVao = () => {
        const gl_8 = myCanvas.getContext("webgl2");
        const program_7 = GlProgram_Utils_createProgram(gl_8, vertexInstance, fragmentInstance);
        gl_8.useProgram(program_7);
        const posALoc_1 = gl_8.getAttribLocation(program_7, "a_posA");
        const posBLoc_1 = gl_8.getAttribLocation(program_7, "a_posB");
        const posCLoc_1 = gl_8.getAttribLocation(program_7, "a_posC");
        const colorLoc_7 = gl_8.getAttribLocation(program_7, "a_fillColor");
        const posBuffer_7 = gl_8.createBuffer();
        gl_8.bindBuffer(gl_8.ARRAY_BUFFER, posBuffer_7);
        const pf_7 = toArrayBufferViewFloat32(posData4);
        gl_8.bufferData(gl_8.ARRAY_BUFFER, pf_7, gl_8.STATIC_DRAW);
        gl_8.enableVertexAttribArray(posALoc_1);
        gl_8.vertexAttribPointer(posALoc_1, 2, gl_8.FLOAT, false, 40, 0);
        gl_8.vertexAttribDivisor(posALoc_1, 1);
        gl_8.enableVertexAttribArray(posBLoc_1);
        gl_8.vertexAttribPointer(posBLoc_1, 2, gl_8.FLOAT, false, 40, 8);
        gl_8.vertexAttribDivisor(posBLoc_1, 1);
        gl_8.enableVertexAttribArray(posCLoc_1);
        gl_8.vertexAttribPointer(posCLoc_1, 2, gl_8.FLOAT, false, 40, 16);
        gl_8.vertexAttribDivisor(posCLoc_1, 1);
        gl_8.enableVertexAttribArray(colorLoc_7);
        gl_8.vertexAttribPointer(colorLoc_7, 4, gl_8.FLOAT, false, 40, 24);
        gl_8.vertexAttribDivisor(colorLoc_7, 1);
        gl_8.drawArraysInstanced(gl_8.TRIANGLES, 0, 6, 2);
    };
    const autoArrayInstanced = () => {
        const canvas_3 = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(singleton_1(SceneProps_object("vertexInstance", "fragmentInstance", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), ObjectProps_interleave("a_posA", ofArray([new BuilderTypes_GlAttrProp(5, posData4), new BuilderTypes_GlAttrProp(10, 1), new BuilderTypes_GlAttrProp(8), new BuilderTypes_GlAttrProp(9), InterleaveProps_child("a_posB", ofArray([new BuilderTypes_GlAttrProp(10, 1), new BuilderTypes_GlAttrProp(8)])), InterleaveProps_child("a_posC", ofArray([new BuilderTypes_GlAttrProp(10, 1), new BuilderTypes_GlAttrProp(8)])), InterleaveProps_child("a_fillColor", singleton_1(new BuilderTypes_GlAttrProp(10, 1)))]))]))))));
        const scene_3 = canvas_3.Scenes[0];
        const cam_4 = head(scene_3.Cameras);
        return [head_1(objects(scene_3)), cam_4];
    };
    const autoUbo = () => {
        const canvas_4 = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(singleton_1(SceneProps_object("vertexUbo", "fragmentUbo", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, posData5))), ObjectProps_ubo("perScene", ofArray([UboProps_u("value", singleton_1(new BuilderTypes_GlUniformProp(0, 1))), UboProps_u("vector", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 1, 1])))), UboProps_u("matrix", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])))), UboProps_u("values[0]", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 1, 2])))), UboProps_u("boolean", singleton_1(new BuilderTypes_GlUniformProp(0, true))), UboProps_u("integer", singleton_1(new BuilderTypes_GlUniformProp(0, 1))), UboProps_u("matrix3", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1])))), UboProps_u("color1", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([0, 0, 0, 1])))), UboProps_u("mat3A[0]", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1])))), UboProps_u("color2", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([0, 1, 0, 1]))))])), ObjectProps_ubo("perModel", singleton_1(UboProps_u("color3", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([0, 0, 1, 1]))))))]))))));
        const scene_4 = canvas_4.Scenes[0];
        const cam_5 = head(scene_4.Cameras);
        return [head_1(objects(scene_4)), cam_5];
    };
    const autoShared = () => {
        const canvas_5 = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(ofArray([SceneProps_shared("vertexShared", "fragmentShared", ofArray([ObjectProps_uniform("blue", singleton_1(new BuilderTypes_GlUniformProp(0, new Float32Array([Math.fround(0), Math.fround(0), Math.fround(0.5), Math.fround(1)])))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, posData6))), ObjectProps_ubo("ubo1", ofArray([new BuilderTypes_GlUboProp(0, 3), UboProps_u("red", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([0.5, 0, 0, 0]))))])), ObjectProps_ubo("ubo2", ofArray([UboProps_u("temp[0]", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 1, 1])))), UboProps_u("green", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([0, 0.5, 0, 0]))))]))])), SceneProps_object("vertexShared", "fragmentShared", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), ObjectProps_ubo("ubo2", singleton_1(UboProps_u("green", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([0, 0.5, 0, 0]))))))])), SceneProps_object("vertexShared2", "fragmentShared", ofArray([new BuilderTypes_GlObjProp(0, "tri2"), ObjectProps_uniform("mat31", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1])))), ObjectProps_uniform("mat32[0]", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1])))), ObjectProps_uniform("blue", singleton_1(new BuilderTypes_GlUniformProp(0, new Float64Array([0, 0, 1, 1])))), ObjectProps_uniform("yes", singleton_1(new BuilderTypes_GlUniformProp(0, true))), ObjectProps_uniform("yesYes[0]", singleton_1(new BuilderTypes_GlUniformProp(0, [true, true]))), ObjectProps_uniform("s3d", singleton_1(new BuilderTypes_GlUniformProp(0, 1))), ObjectProps_uniform("byte1", singleton_1(new BuilderTypes_GlUniformProp(0, true))), ObjectProps_uniform("uint1", singleton_1(new BuilderTypes_GlUniformProp(0, 1))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, posData7))), ObjectProps_attribute("s2", singleton_1(new BuilderTypes_GlAttrProp(5, new Float64Array(2 * 3)))), ObjectProps_attribute("s3", singleton_1(new BuilderTypes_GlAttrProp(5, new Float64Array(3 * 3))))]))]))));
        const scene_5 = canvas_5.Scenes[0];
        const cam_6 = head(scene_5.Cameras);
        const tri1 = getObject("tri1")(scene_5);
        const tri2 = getObject("tri2")(scene_5);
        resetCanvas();
        update_2(cam_6, scene_5.Shared);
        render_2(cam_6, tri1);
        render_2(cam_6, tri2);
        tableObjDef(tri2);
        resetCanvas();
        call((data_5) => {
            update_2(cam_6, data_5);
        }, scene_5.Shared);
        render_2(cam_6, tri1);
        render_2(cam_6, tri2);
        const pinfo_1 = tri2.ProgramInfo;
        console.table(some(Array.from(collect(getUniforms, pinfo_1.Uniforms))));
        const uni = getUniform("blue")(tri1);
    };
    const doTest = () => {
        run_1(autoInterleave);
    };
    const doTestVao = () => {
        console.log(some("autoInterleave"));
        run_1(autoInterleave);
    };
    resetCanvas();
    doTestVao();
}

export function testScene() {
    const svertex2d = "#version 300 es\r\nprecision mediump float;\r\nin vec2 a_position;\r\nuniform float time;\r\n\r\nvoid main() {\r\n  gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\r\n  vec2 position = a_position;\r\n  gl_Position = vec4(position, 0.0, 1.0);\r\n  gl_Position *= time / time;\r\n}";
    const sfragment2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n  glFragColor *= time;\r\n}";
    const vertex2d = "#version 300 es\r\nin vec2 a_position;\r\n\r\nvoid main() {\r\n  vec2 position = a_position;\r\n  gl_Position = vec4(position, 0.0, 1.0);\r\n}";
    const fragment2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\nuniform vec4 fillColor;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = fillColor;\r\n  glFragColor *= fract(time);\r\n}";
    const svertexInterleave = "#version 300 es\r\nprecision mediump float;\r\nin vec2 a_position;\r\nin vec4 fillColor;\r\nuniform float time;\r\n\r\nout vec4 v_fillColor;\r\n\r\nvoid main() {\r\n  gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\r\n  vec2 position = a_position;\r\n  gl_Position = vec4(position, 0.0, 1.0);\r\n  gl_Position *= time / time;\r\n  v_fillColor = fillColor;\r\n}";
    const sfragmentInterleave = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\n\r\nin vec4 v_fillColor;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = v_fillColor;\r\n  glFragColor *= time;\r\n}";
    const vertexInterleave = "#version 300 es\r\nin vec2 a_position;\r\nin vec4 fillColor;\r\n\r\nout vec4 v_fillColor;\r\n\r\nvoid main() {\r\n  gl_Position = vec4(a_position, 0.0, 1.0);\r\n  v_fillColor = fillColor;\r\n}";
    const fragmentInterleave = "#version 300 es\r\nprecision mediump float;\r\n\r\nin vec4 v_fillColor;\r\n\r\nuniform float time;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = v_fillColor;\r\n  glFragColor *= fract(time);\r\n}";
    const svertexUbo = "#version 300 es\r\nprecision mediump float;\r\nin vec2 a_position;\r\n\r\nuniform uboShared {\r\n  uniform float time;\r\n  uniform vec4 fillColor;\r\n};\r\n\r\nout vec4 v_fillColor;\r\n\r\nvoid main() {\r\n  gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\r\n  vec2 position = a_position;\r\n  gl_Position = vec4(position, 0.0, 1.0);\r\n  gl_Position *= time / time;\r\n}";
    const sfragmentUbo = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform uboShared {\r\n  uniform float time;\r\n  uniform vec4 fillColor;\r\n};\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = fillColor;\r\n  glFragColor *= time;\r\n}";
    const vertexUbo = "#version 300 es\r\nin vec2 a_position;\r\n\r\nuniform uboShared {\r\n  uniform float time;\r\n  uniform vec4 fillColor;\r\n};\r\n\r\nvoid main() {\r\n  gl_Position = vec4(a_position, 0.0, 1.0);\r\n}";
    const fragmentUbo = "#version 300 es\r\nprecision highp float;\r\n// precision mediump uniform;\r\n\r\nuniform uboShared {\r\n  uniform float time;\r\n  uniform vec4 fillColor;\r\n};\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = fillColor;\r\n  glFragColor *= fract(time);\r\n}";
    WebglShaderUtils_addVertexShaderSource("svertex2d", svertex2d);
    WebglShaderUtils_addFragmentShaderSource("sfragment2d", sfragment2d);
    WebglShaderUtils_addVertexShaderSource("vertex2d", vertex2d);
    WebglShaderUtils_addFragmentShaderSource("fragment2d", fragment2d);
    WebglShaderUtils_addVertexShaderSource("svertexInterleave", svertexInterleave);
    WebglShaderUtils_addFragmentShaderSource("sfragmentInterleave", sfragmentInterleave);
    WebglShaderUtils_addVertexShaderSource("vertexInterleave", vertexInterleave);
    WebglShaderUtils_addFragmentShaderSource("fragmentInterleave", fragmentInterleave);
    WebglShaderUtils_addVertexShaderSource("svertexUbo", svertexUbo);
    WebglShaderUtils_addFragmentShaderSource("sfragmentUbo", sfragmentUbo);
    WebglShaderUtils_addVertexShaderSource("vertexUbo", vertexUbo);
    WebglShaderUtils_addFragmentShaderSource("fragmentUbo", fragmentUbo);
    const run_1 = (f) => {
        const patternInput = f();
        const update = patternInput[1];
        const glcanvas = patternInput[0];
        const tri1 = tryGetObject("tri1")(glcanvas.Scenes[0]);
        const tri2 = tryGetObject("tri2")(glcanvas.Scenes[0]);
        render_1(0, glcanvas);
        call((data) => {
            tableObjDef(data);
        }, glcanvas.Scenes[0].Shared);
        call((data_1) => {
            tableObjDef(data_1);
        }, tri1);
        call((data_2) => {
            tableObjDef(data_2);
        }, tri2);
        let pinfo;
        const gl = glcanvas.Context;
        const matchValue = glcanvas.Scenes[0].Shared;
        if (matchValue == null) {
            pinfo = executeDefault(GlProgram_emptyProgramInfo(gl), (x) => x.ProgramInfo, tri1);
        }
        else {
            const shared = matchValue;
            pinfo = shared.ProgramInfo;
        }
        const doUpdate = (_arg1) => {
            console.log(some("** ========================================== **"));
            update();
            render_1(0, glcanvas);
        };
        const t = new Timer(2000);
        t.AutoReset = false;
        add(doUpdate, t.Elapsed);
        t.Start();
    };
    const basic = () => {
        const canvas = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(3, Vec4_Create_Z27E3A4C0(0, 0, 0, 1)), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor1))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, triangle1)))]))]))));
        return [(canvasId) => ((props) => Props_glcanvas(canvasId, props)), (value) => {
            void value;
        }];
    };
    const sharedBasic = () => {
        const canvas_1 = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(ofArray([SceneProps_shared("svertex2d", "sfragment2d", ofArray([ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, triangle2)))])), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor2)))])), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri2"), ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor3))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, triangle3)))]))]))));
        return [(canvasId_1) => ((props_1) => Props_glcanvas(canvasId_1, props_1)), () => {
            const matchValue_1 = canvas_1.Scenes[0].Shared;
            if (matchValue_1 != null) {
                const shared_1 = matchValue_1;
                const time = getUniform("time")(shared_1);
                const tri2_1 = getObject("tri2")(canvas_1.Scenes[0]);
                const pos1 = getAttribute("a_position")(shared_1);
                const pos2 = getAttribute("a_position")(tri2_1);
                setValue(0.55, time);
                setValue_1(2, Vec2__get_Values(botLeft), pos1);
                setValues(triangle4, pos2);
            }
        }];
    };
    const interleaveShared = () => {
        const canvas_2 = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(ofArray([SceneProps_shared("svertexInterleave", "sfragmentInterleave", ofArray([ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_interleave("a_position", ofArray([new BuilderTypes_GlAttrProp(5, interleaveData(triangle5, fillColor4)), InterleaveProps_child("fillColor", singleton_1(new BuilderTypes_GlAttrProp(0, 5121)))]))])), SceneProps_object("vertexInterleave", "fragmentInterleave", singleton_1(new BuilderTypes_GlObjProp(0, "tri1"))), SceneProps_object("vertexInterleave", "fragmentInterleave", ofArray([new BuilderTypes_GlObjProp(0, "tri2"), ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_interleave("a_position", ofArray([new BuilderTypes_GlAttrProp(5, interleaveData(triangle6, fillColor5)), InterleaveProps_child("fillColor", empty_1())]))]))]))));
        return [(canvasId_2) => ((props_2) => Props_glcanvas(canvasId_2, props_2)), () => {
            const matchValue_2 = canvas_2.Scenes[0].Shared;
            if (matchValue_2 != null) {
                const shared_2 = matchValue_2;
                const time_1 = getUniform("time")(shared_2);
                const tri2_2 = getObject("tri2")(canvas_2.Scenes[0]);
                const pos2_1 = getAttribute("a_position")(tri2_2);
                setValue(0.85, time_1);
                setValue_1(2, Vec2__get_Values(topRight), pos2_1);
            }
        }];
    };
    const uboBasic = () => {
        const canvas_3 = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(ofArray([SceneProps_shared("svertexUbo", "sfragmentUbo", ofArray([ObjectProps_ubo("uboShared", ofArray([UboProps_u("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), UboProps_u("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor6)))])), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, triangle7)))])), SceneProps_object("vertexUbo", "fragmentUbo", singleton_1(new BuilderTypes_GlObjProp(0, "tri1"))), SceneProps_object("vertexUbo", "fragmentUbo", ofArray([new BuilderTypes_GlObjProp(0, "tri2"), ObjectProps_ubo("uboShared", ofArray([UboProps_u("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), UboProps_u("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor7)))])), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, triangle8)))]))]))));
        return [canvas_3, () => {
            const matchValue_3 = canvas_3.Scenes[0].Shared;
            if (matchValue_3 != null) {
                const shared_3 = matchValue_3;
                const time1 = getUniform("time")(shared_3);
                const tri2_3 = getObject("tri2")(canvas_3.Scenes[0]);
                const pos1_1 = getAttribute("a_position")(shared_3);
                const pos2_2 = getAttribute("a_position")(tri2_3);
                const time2 = getUniform("time")(tri2_3);
                setValue(0.85, time1);
                setValue(0.75, time2);
                setValue_1(2, new Float64Array([0.25, 0.5]), pos1_1);
                setValue_1(2, new Float64Array([0, 0.5]), pos2_2);
            }
        }];
    };
    run_1(uboBasic);
}

export function testCapabilities() {
    const svertex2d = "#version 300 es\r\nprecision mediump float;\r\nin vec2 a_position;\r\nuniform float time;\r\n\r\nvoid main() {\r\n  gl_Position = vec4(0.0, 0.0, 0.0, 0.0);\r\n  vec2 position = a_position;\r\n  gl_Position = vec4(position, 0.0, 1.0);\r\n  gl_Position *= time / time;\r\n}";
    const sfragment2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n  glFragColor *= time;\r\n}";
    const vertex2d = "#version 300 es\r\nin vec2 a_position;\r\n\r\nvoid main() {\r\n  vec2 position = a_position;\r\n  gl_Position = vec4(position, 0.0, 1.0);\r\n}";
    const fragment2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\nuniform vec4 fillColor;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = fillColor;\r\n  glFragColor *= fract(time);\r\n}";
    WebglShaderUtils_addVertexShaderSource("svertex2d", svertex2d);
    WebglShaderUtils_addFragmentShaderSource("sfragment2d", sfragment2d);
    WebglShaderUtils_addVertexShaderSource("vertex2d", vertex2d);
    WebglShaderUtils_addFragmentShaderSource("fragment2d", fragment2d);
    const run_1 = (f) => {
        const patternInput = f();
        const update = patternInput[1];
        const glcanvas = patternInput[0];
        const tri1 = tryGetObject("tri1")(glcanvas.Scenes[0]);
        const tri2 = tryGetObject("tri2")(glcanvas.Scenes[0]);
        render_1(0, glcanvas);
        call((data) => {
            tableObjDef(data);
        }, glcanvas.Scenes[0].Shared);
        call((data_1) => {
            tableObjDef(data_1);
        }, tri1);
        call((data_2) => {
            tableObjDef(data_2);
        }, tri2);
        const doUpdate = (_arg1) => {
            console.log(some("** ========================================== **"));
            update();
            render_1(0, glcanvas);
        };
        const t = new Timer(2000);
        t.AutoReset = false;
        add(doUpdate, t.Elapsed);
        t.Start();
    };
    const basic = () => {
        const canvas = Props_glcanvas("myCanvas", singleton_1(CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(3, Vec4_Create_Z27E3A4C0(1, 1, 1, 1)), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor1))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, triangle1)))])), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri2"), cullFront, ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor2))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, revTriangle(triangle2))))]))]))));
        return [canvas, (value) => {
            void value;
        }];
    };
    run_1(basic);
}

export function testCamera() {
    const svertex2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform camera {\r\n  mat4 projMat;\r\n  mat4 viewMat;\r\n};\r\n\r\nuniform float time;\r\n\r\nvoid main() {\r\n  gl_Position = projMat * viewMat * vec4(0.0, 0.0, 0.0, 0.0);\r\n  gl_Position *= time / time;\r\n}";
    const sfragment2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n  glFragColor *= time;\r\n}";
    const vertex2d = "#version 300 es\r\nuniform camera {\r\n  mat4 projMat;\r\n  mat4 viewMat;\r\n};\r\n\r\nin vec2 a_position;\r\n\r\nuniform mat4 modelMat;\r\n\r\nvoid main() {\r\n  vec2 pos = a_position;\r\n  // pos = vec2(pos.x, 400.0 - pos.y);\r\n  vec4 position = vec4(pos, 0.0, 1.0);\r\n  position = projMat * viewMat * modelMat * position;\r\n  // position = projMat * viewMat * position;\r\n  // position = projMat * position;\r\n  // position = viewMat * position;\r\n  gl_Position = position;\r\n}";
    const fragment2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\nuniform vec4 fillColor;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = fillColor;\r\n  glFragColor *= fract(time);\r\n}";
    WebglShaderUtils_addVertexShaderSource("svertex2d", svertex2d);
    WebglShaderUtils_addFragmentShaderSource("sfragment2d", sfragment2d);
    WebglShaderUtils_addVertexShaderSource("vertex2d", vertex2d);
    WebglShaderUtils_addFragmentShaderSource("fragment2d", fragment2d);
    const center_1 = Vec2_Create_7B00E9A0(100, 100);
    const topMid_1 = Vec2_Create_7B00E9A0(100, 0);
    const topMid1_1 = Vec2_Create_7B00E9A0(-0.5, 1);
    const topMid2_1 = Vec2_Create_7B00E9A0(0.5, 1);
    const topLeft_1 = Vec2_Create_7B00E9A0(0, 0);
    const left_1 = Vec2_Create_7B00E9A0(0, 100);
    const botLeft_1 = Vec2_Create_7B00E9A0(-1, -1);
    const botMid_1 = Vec2_Create_7B00E9A0(0, -1);
    const botRight_1 = Vec2_Create_7B00E9A0(1, -1);
    const right_1 = Vec2_Create_7B00E9A0(1, 0);
    const topRight_1 = Vec2_Create_7B00E9A0(1, 1);
    const triangle1_1 = createTriangleData(center_1, topMid_1, topLeft_1);
    const triangle2_1 = createTriangleData(center_1, topLeft_1, left_1);
    const run_1 = (f) => {
        const showUniforms_1 = (data) => {
            const pinfo = data.ProgramInfo;
            console.table(some(Array.from(collect(getUniforms, pinfo.Uniforms))));
        };
        const patternInput = f();
        const update = patternInput[1];
        const glcanvas = patternInput[0];
        const scene = glcanvas.Scenes[0];
        const tri1 = tryGetObject("tri1")(scene);
        const tri2 = tryGetObject("tri2")(scene);
        console.log(some(toText(interpolate("%P()", [tri1.ProgramInfo.ShaderSet.VertexShaderId]))));
        render_1(0, glcanvas);
        call((data_1) => {
            tableObjDef(data_1);
        }, scene.Shared);
        call((data_2) => {
            tableObjDef(data_2);
        }, tri1);
        call((data_3) => {
            tableObjDef(data_3);
        }, tri2);
        call(showUniforms_1, scene.Shared);
        const doUpdate = (_arg1) => {
            console.log(some("** ========================================== **"));
            update();
            render_1(0, glcanvas);
        };
        const t = new Timer(2000);
        t.AutoReset = false;
        add(doUpdate, t.Elapsed);
        t.Start();
    };
    const basic = () => {
        const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(17), CanvasProps_scene(ofArray([SceneProps_shared("svertex2d", "sfragment2d", singleton_1(ObjectProps_ubo("camera", ofArray([UboProps_u("projMat", singleton_1(new BuilderTypes_GlUniformProp(0, Mat4__get_Values(Mat4_Create())))), UboProps_u("viewMat", singleton_1(new BuilderTypes_GlUniformProp(0, Mat4__get_Values(Mat4_Create()))))])))), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), cullBack, ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor1))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, triangle1_1)))])), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri2"), ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor2))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, revTriangle(triangle2_1))))]))]))]));
        return [canvas, () => {
            const scene_1 = getSceneByIndex(0, canvas);
            const tri1_1 = getObject("tri1")(scene_1);
            const modelMatrix = tri1_1.ModelMatrix;
            Mat4__TranslateM_8ED0A5D(modelMatrix, 100, 100, 0);
            Mat4__RotateZM_6069AC9A(modelMatrix, (-10 * 3.141592653589793) / 180);
            Mat4__TranslateM_8ED0A5D(modelMatrix, -100, -100, 0);
            dirtyObject(tri1_1);
            console.log(some(toText(interpolate("canvas isDirty %P()", [canvas.IsDirty]))));
        }];
    };
    run_1(basic);
}

export function testTexture() {
    const svertex2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform camera {\r\n  mat4 projMat;\r\n  mat4 viewMat;\r\n};\r\n\r\nin vec2 a_texcoords;\r\n\r\nuniform float time;\r\n\r\nvoid main() {\r\n  gl_Position = projMat * viewMat * vec4(0.0, 0.0, 0.0, 0.0);\r\n  gl_Position *= time / time;\r\n  gl_Position *= vec4(a_texcoords / a_texcoords, 1.0, 1.0);\r\n}";
    const sfragment2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n  glFragColor *= time;\r\n}";
    const vertex2d = "#version 300 es\r\nuniform camera {\r\n  mat4 projMat;\r\n  mat4 viewMat;\r\n};\r\n\r\nin vec2 a_position;\r\nin vec2 a_texcoords;\r\n\r\nuniform mat4 modelMat;\r\n\r\nout vec2 v_texcoords;\r\n\r\nvoid main() {\r\n  vec2 pos = a_position;\r\n  // pos = vec2(pos.x, 400.0 - pos.y);\r\n  vec4 position = vec4(pos, 0.0, 1.0);\r\n  position = projMat * viewMat * modelMat * position;\r\n  // position = projMat * viewMat * position;\r\n  // position = projMat * position;\r\n  // position = viewMat * position;\r\n  gl_Position = position;\r\n  v_texcoords = a_texcoords;\r\n}";
    const fragment2d = "#version 300 es\r\nprecision mediump float;\r\n\r\nuniform float time;\r\nuniform vec4 fillColor;\r\nuniform sampler2D u_texture1;\r\n\r\nin vec2 v_texcoords;\r\n\r\nout vec4 glFragColor;\r\n\r\nvoid main() {\r\n  glFragColor = fillColor;\r\n  glFragColor *= fract(time);\r\n  glFragColor = texture(u_texture1, v_texcoords);\r\n}";
    WebglShaderUtils_addVertexShaderSource("svertex2d", svertex2d);
    WebglShaderUtils_addFragmentShaderSource("sfragment2d", sfragment2d);
    WebglShaderUtils_addVertexShaderSource("vertex2d", vertex2d);
    WebglShaderUtils_addFragmentShaderSource("fragment2d", fragment2d);
    const center_1 = Vec2_Create_7B00E9A0(100, 100);
    const topMid_1 = Vec2_Create_7B00E9A0(100, 0);
    const topMid1_1 = Vec2_Create_7B00E9A0(50, 0);
    const topMid2_1 = Vec2_Create_7B00E9A0(150, 0);
    const topLeft_1 = Vec2_Create_7B00E9A0(0, 0);
    const left_1 = Vec2_Create_7B00E9A0(0, 100);
    const botLeft_1 = Vec2_Create_7B00E9A0(0, 200);
    const botMid_1 = Vec2_Create_7B00E9A0(100, 200);
    const botRight_1 = Vec2_Create_7B00E9A0(200, 200);
    const right_1 = Vec2_Create_7B00E9A0(200, 100);
    const topRight_1 = Vec2_Create_7B00E9A0(1, 1);
    const triangle1_1 = createTriangleData(center_1, topMid_1, topLeft_1);
    const triangle2_1 = createTriangleData(center_1, topLeft_1, left_1);
    const triangle3_1 = createTriangleData(center_1, left_1, botLeft_1);
    const triangle4_1 = createTriangleData(center_1, botLeft_1, botMid_1);
    const triangle5_1 = createTriangleData(center_1, botMid_1, botRight_1);
    const triangle6_1 = createTriangleData(center_1, botRight_1, right_1);
    const run_1 = (f) => {
        const showUniforms_1 = (data) => {
            const pinfo = data.ProgramInfo;
            console.table(some(Array.from(collect(getUniforms, pinfo.Uniforms))));
        };
        const patternInput = f();
        const update = patternInput[1];
        const glcanvas = patternInput[0];
        const scene = glcanvas.Scenes[0];
        const tri1 = tryGetObject("tri1")(scene);
        const tri2 = tryGetObject("tri2")(scene);
        render_1(0, glcanvas);
        call((data_1) => {
            tableObjDef(data_1);
        }, scene.Shared);
        call((data_2) => {
            tableObjDef(data_2);
        }, tri1);
        call((data_3) => {
            tableObjDef(data_3);
        }, tri2);
        call(showUniforms_1, scene.Shared);
        const doUpdate = (_arg1) => {
            console.log(some("** ========================================== **"));
            update();
            render_1(0, glcanvas);
        };
        const t = new Timer(2000);
        t.AutoReset = false;
        add(doUpdate, t.Elapsed);
        t.Start();
    };
    const basic = () => {
        const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(17), new BuilderTypes_GlCanvasProp(7, new GlPixelStorage(2)), CanvasProps_scene(ofArray([SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_shared("svertex2d", "sfragment2d", ofArray([ObjectProps_ubo("camera", ofArray([UboProps_u("projMat", singleton_1(new BuilderTypes_GlUniformProp(0, Mat4__get_Values(Mat4_Create())))), UboProps_u("viewMat", singleton_1(new BuilderTypes_GlUniformProp(0, Mat4__get_Values(Mat4_Create()))))])), ObjectProps_attribute("a_texcoords", singleton_1(new BuilderTypes_GlAttrProp(5, new Float64Array([1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0]))))])), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), cullBack, ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor1))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, append_1(triangle1_1, triangle2_1, Float64Array)))), ObjectProps_texture(ofArray([new BuilderTypes_GlTextureProp(0, "tex1"), ObjectProps_pixelImageId("star")]))])), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri2"), cullBack, ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor2))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, append_1(triangle3_1, triangle4_1, Float64Array)))), ObjectProps_texture(ofArray([new BuilderTypes_GlTextureProp(0, "tex1"), new BuilderTypes_GlTextureProp(4, 1), new BuilderTypes_GlTextureProp(5, 1), ObjectProps_pixelDataUint8(new Int32Array([255, 0, 0, 255]))]))])), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri3"), cullBack, ObjectProps_uniform("time", singleton_1(new BuilderTypes_GlUniformProp(0, 0.99))), ObjectProps_uniform("fillColor", singleton_1(new BuilderTypes_GlUniformProp(0, fillColor1))), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, triangle5_1))), ObjectProps_texture(singleton_1(new BuilderTypes_GlTextureProp(0, "tex1")))]))]))]));
        return [canvas, () => {
            const scene_1 = getSceneByIndex(0, canvas);
            const tri1_1 = getObject("tri1")(scene_1);
            const modelMatrix = tri1_1.ModelMatrix;
            Mat4__TranslateM_8ED0A5D(modelMatrix, 100, 100, 0);
            Mat4__RotateZM_6069AC9A(modelMatrix, (-10 * 3.141592653589793) / 180);
            Mat4__TranslateM_8ED0A5D(modelMatrix, -100, -100, 0);
            dirty(tri1_1);
        }];
    };
    console.log(some("testTexture.basic"));
    run_1(basic);
}

export function testWorld() {
    const svertex2d = "#version 300 es\r\n#include precision\r\n#include camera-ubo\r\n#include vertex-texture2d0\r\n// #include time\r\n\r\nvoid main() {\r\n  gl_Position = projMat * viewMat * vec4(0.0, 0.0, 0.0, 0.0);\r\n// #include use-vertex-time\r\n#include use-vertex-texture2d0\r\n}";
    const sfragment2d = "#version 300 es\r\n#include precision\r\n#include fragment-texture2d0\r\n// #include time\r\n#include out-color\r\n\r\nvoid main() {\r\n  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n// #include use-fragment-time\r\n#include use-fragment-texture2d0\r\n}";
    const vertex2d = "#version 300 es\r\n#include camera-ubo\r\n#include model-params\r\n#include vertex-texture2d0\r\n\r\nin vec2 a_position;\r\n\r\nvoid main() {\r\n  vec2 pos = a_position;\r\n  vec4 position = vec4(pos, 0.0, 1.0);\r\n  position = projMat * viewMat * modelMat * position;\r\n  gl_Position = position;\r\n  v_texCoords0 = a_texCoords0;\r\n}";
    const fragment2d = "#version 300 es\r\n#include precision\r\n#include out-color\r\n#include fragment-texture2d0\r\n\r\nvoid main() {\r\n  glFragColor = texture(u_texture0, v_texCoords0);\r\n}";
    WebglShaderUtils_addVertexShaderSource("svertex2d", svertex2d);
    WebglShaderUtils_addFragmentShaderSource("sfragment2d", sfragment2d);
    WebglShaderUtils_addVertexShaderSource("vertex2d", vertex2d);
    WebglShaderUtils_addFragmentShaderSource("fragment2d", fragment2d);
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const worldBounds = BoundsModule_boundsCenter(0, 0, Bounds__get_Width(viewport), Bounds__get_Height(viewport));
    let quad;
    const tupledArg = boundsToTriangles(BoundsModule_boundsCenterV(Vec2_Create_7B00E9A0(0, 0), Bounds__get_Size(worldBounds)));
    quad = append_1(tupledArg[0], tupledArg[1], Float64Array);
    let quad2;
    const tupledArg_1 = boundsToTriangles(BoundsModule_boundsCenterV(Vec2_Create_7B00E9A0(0, 0), Vec2_op_Multiply_47807E55(Bounds__get_HalfSize(worldBounds), 0.5)));
    quad2 = append_1(tupledArg_1[0], tupledArg_1[1], Float64Array);
    const basic = () => {
        const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(2, 400), new BuilderTypes_GlCanvasProp(3, 400), new BuilderTypes_GlCanvasProp(17), new BuilderTypes_GlCanvasProp(7, new GlPixelStorage(2)), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(8, worldBounds), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_shared("svertex2d", "sfragment2d", singleton_1(ObjectProps_attribute("a_texCoords0", singleton_1(new BuilderTypes_GlAttrProp(5, new Float64Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1])))))), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri1"), cullBack, ObjectProps_position2dv(Bounds__get_Center(worldBounds)), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, quad))), ObjectProps_texture(ofArray([new BuilderTypes_GlTextureProp(0, "tex1"), ObjectProps_pixelImageId("star")]))])), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "tri2"), cullBack, ObjectProps_position2dv(Bounds__get_Center(Bounds__get_Quadrant1(worldBounds))), new BuilderTypes_GlObjProp(25, 0.25), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(12, "tri1.a_position"))), ObjectProps_texture(ofArray([new BuilderTypes_GlTextureProp(23, "tri1.tex1"), new BuilderTypes_GlTextureProp(13, 9729)]))]))]))]));
        const update = (_arg1) => {
        };
        return [canvas, update, false, 60 * 5];
    };
    const grid = () => {
        const canvas_1 = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(2, 400), new BuilderTypes_GlCanvasProp(3, 400), new BuilderTypes_GlCanvasProp(17), new BuilderTypes_GlCanvasProp(7, new GlPixelStorage(2)), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(8, worldBounds), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_shared("svertex2d", "sfragment2d", singleton_1(ObjectProps_attribute("a_texCoords0", singleton_1(new BuilderTypes_GlAttrProp(5, new Float64Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1])))))), SceneProps_object("vertex2d", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "grid"), cullBack, ObjectProps_position2dv(Bounds__get_Center(worldBounds)), ObjectProps_attribute("a_position", singleton_1(new BuilderTypes_GlAttrProp(5, quad))), ObjectProps_texture(empty_1())]))]))]));
        const update_1 = (_arg2) => {
        };
        return [canvas_1, update_1, false, 60 * 5];
    };
    console.log(some("testWorld.basic"));
    run(basic);
    console.log(some("testWorld.grid"));
    run(grid);
}

export function testGrid() {
    const gridUbo = "\r\nuniform grid {\r\n  vec4 lineColor;\r\n  float lineWidth;\r\n  float axisLineWidth;\r\n  vec2 size;\r\n  ivec2 axisDim;\r\n};\r\n";
    const svertex2d = "#version 300 es\r\n#include precision\r\n#include camera-ubo\r\n// #include grid-ubo\r\n\r\nvoid main() {\r\n  gl_Position = projMat * viewMat * vec4(0.0, 0.0, 0.0, 0.0);\r\n}";
    const sfragment2d = "#version 300 es\r\n#include precision\r\n#include out-color\r\n\r\nvoid main() {\r\n  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n}";
    const grid2Drect = "#version 300 es\r\n#include camera-ubo\r\n#include grid-ubo\r\n#include model-params\r\n#include vec2\r\n#include lines2d-vertex\r\n\r\n// x, y: point.  z, w: Adjustment (x, y) for line start point.\r\nconst vec4 cornerTemplate[] = vec4[4](\r\n  vec4(-0.5, -0.5, -0.5, 0.0),\r\n  vec4(0.5, -0.5, 0.0, -0.5),\r\n  vec4(0.5, 0.5, 0.5, 0.0),\r\n  vec4(-0.5, 0.5, 0.0, 0.5)\r\n);\r\n\r\nconst ivec2 abTemplate[] = ivec2[4](\r\n  ivec2(0, 1),\r\n  ivec2(1, 2),\r\n  ivec2(2, 3),\r\n  ivec2(3, 0)\r\n);\r\n\r\nout vec4 v_fillColor;\r\n\r\nvoid main() {\r\n  #line 1987\r\n  vec2 halfSize = size * 0.5;\r\n  vec2 cellSize = halfSize / vec2(axisDim);\r\n  ivec2 count = axisDim * 2;\r\n  int instanceCount = int(count.x * count.y);\r\n  vec2 start = -cellSize * 0.5 - vec2(axisDim - 1) * cellSize;\r\n\r\n  int cornerID = gl_VertexID / 6;\r\n  int vertexID = gl_VertexID % 6;\r\n  ivec2 colRow = ivec2(gl_InstanceID % count.x, gl_InstanceID / count.x);\r\n  vec2 center = start + vec2(colRow) * cellSize;\r\n  ivec2 ab = abTemplate[cornerID];\r\n  vec2 a = cornerTemplate[ab.x].xy * cellSize + cornerTemplate[ab.x].zw * lineWidth;\r\n  vec2 b = cornerTemplate[ab.y].xy * cellSize;\r\n  vec2 vertex = line2D(a, b, lineWidth, vertexID);\r\n  vertex += center;\r\n  vec4 position = vec4(vertex, 0.0, 1.0);\r\n\r\n  position = projMat * viewMat * modelMat * position;\r\n\r\n  gl_Position = position;\r\n  v_fillColor = lineColor;\r\n}";
    const grid2Dline = "#version 300 es\r\n#include camera-ubo\r\n#include grid-ubo\r\n#include model-params\r\n#include vec2\r\n#include lines2d-vertex\r\n\r\n// x, y: point a.  z, w: point b.\r\nconst vec4 edgeTemplate[] = vec4[2](\r\n  vec4(0.0, -0.5, 0.0, 0.5), // Vertical\r\n  vec4(-0.5, 0.0, 0.5, 0.0)  // Horizontal\r\n);\r\n\r\nconst vec2 offsetTemplate[] = vec2[2](\r\n  vec2(1.0, 0.0), // Vertical\r\n  vec2(0.0, 1.0)  // Horizontal\r\n);\r\n\r\nout vec4 v_fillColor;\r\n\r\nfloat isEqual(int value, int base) { return step(float(base), float(value)) * step(float(value), float(base)); }\r\n\r\nvoid main() {\r\n#line 2034\r\n  vec2 halfSize = size * 0.5;\r\n  vec2 cellSize = halfSize / vec2(axisDim);\r\n  ivec2 count = axisDim * 2 + 1;\r\n  int instanceCount = count.x + count.y;\r\n  vec2 start = -vec2(axisDim) * cellSize;\r\n  int edgeID = int(step(float(count.x), float(gl_InstanceID)));\r\n  vec4 edge = edgeTemplate[edgeID];\r\n  vec2 ofs = offsetTemplate[edgeID];\r\n\r\n  vec2 a = edge.xy * size;\r\n  vec2 b = edge.zw * size;\r\n\r\n  int vertexID = gl_VertexID % 6;\r\n  ivec2 colRow = ivec2(gl_InstanceID % count.x);\r\n  colRow.y = gl_InstanceID - count.x;\r\n  vec2 isAxisv = vec2(isEqual(colRow.x, axisDim.x), isEqual(colRow.y, axisDim.y));\r\n  vec2 center = start + vec2(colRow) * cellSize;\r\n  center *= ofs;\r\n  float isAxis = isAxisv.x * ofs.x + isAxisv.y * ofs.y;\r\n  float width = mix(lineWidth, axisLineWidth, isAxis);\r\n  vec2 vertex = line2D(a, b, width, vertexID);\r\n  vertex += center;\r\n  vec4 position = vec4(vertex, 0.0, 1.0);\r\n\r\n  position = projMat * viewMat * modelMat * position;\r\n\r\n  gl_Position = position;\r\n  v_fillColor = lineColor;\r\n}";
    const fragment2d = "#version 300 es\r\n#include precision\r\n#include out-color\r\n\r\nin vec4 v_fillColor;\r\n\r\nvoid main() {\r\n  glFragColor = v_fillColor;\r\n}";
    WebglShaderUtils_addShaderInclude("grid-ubo", gridUbo);
    WebglShaderUtils_addVertexShaderSource("svertex2d", svertex2d);
    WebglShaderUtils_addFragmentShaderSource("sfragment2d", sfragment2d);
    WebglShaderUtils_addVertexShaderSource("grid2Drect", grid2Drect);
    WebglShaderUtils_addVertexShaderSource("grid2Dline", grid2Dline);
    WebglShaderUtils_addFragmentShaderSource("fragment2d", fragment2d);
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const worldBounds = BoundsModule_boundsCenter(0, 0, Bounds__get_Width(viewport), Bounds__get_Height(viewport));
    const size = Vec2_op_Multiply_Z24FF8540(Bounds__get_Size(worldBounds), Vec2_Create_7B00E9A0(0.8, 0.8));
    const halfSize = Vec2_op_Multiply_47807E55(size, 0.5);
    const sx = Vec2_op_Division_Z24FF8540(halfSize, Vec2_Create_7B00E9A0(2, 2));
    const cellSize = sx;
    const halfCount = Vec2_Create_7B00E9A0(Math.ceil(halfSize.values[0] / cellSize.values[0]), Math.ceil(halfSize.values[1] / cellSize.values[1]));
    const count = Vec2_op_Multiply_47807E55(halfCount, 2);
    const colCount = (~(~count.values[0])) | 0;
    const rowCount = (~(~count.values[1])) | 0;
    const vertexCount = 24;
    const instanceCount = (colCount * rowCount) | 0;
    const lineVertexCount = 6;
    const lineInstanceCount = ((colCount + rowCount) + 2) | 0;
    console.log(some(toText(interpolate("cellSize: %P()", [cellSize]))));
    console.log(some(toText(interpolate("halfCount: %P()", [halfCount]))));
    const grid = () => {
        const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), new BuilderTypes_GlCanvasProp(7, new GlPixelStorage(2)), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(1, 2), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_shared("svertex2d", "sfragment2d", empty_1()), SceneProps_object("grid2Drect", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "gridRect"), new BuilderTypes_GlObjProp(19, 0), new BuilderTypes_GlObjProp(3, vertexCount), new BuilderTypes_GlObjProp(6, instanceCount), cullBack, ObjectProps_ubo("grid", ofArray([UboProps_u("lineColor", singleton_1(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(Vec4_Create_Z27E3A4C0(0, 0, 1, 1))))), UboProps_u("lineWidth", singleton_1(new BuilderTypes_GlUniformProp(0, 1))), UboProps_u("axisLineWidth", singleton_1(new BuilderTypes_GlUniformProp(0, 3))), UboProps_u("size", singleton_1(new BuilderTypes_GlUniformProp(0, Vec2__get_Values(size)))), UboProps_u("axisDim", singleton_1(new BuilderTypes_GlUniformProp(0, new Int32Array([~(~halfCount.values[0]), ~(~halfCount.values[1])]))))]))])), SceneProps_object("grid2Dline", "fragment2d", ofArray([new BuilderTypes_GlObjProp(0, "gridLine"), new BuilderTypes_GlObjProp(3, lineVertexCount), new BuilderTypes_GlObjProp(6, lineInstanceCount), cullBack, ObjectProps_ubo("grid", ofArray([UboProps_u("lineColor", singleton_1(new BuilderTypes_GlUniformProp(0, Vec4__get_Values(Vec4_Create_Z27E3A4C0(0, 0, 0, 1))))), UboProps_u("lineWidth", singleton_1(new BuilderTypes_GlUniformProp(0, 1))), UboProps_u("axisLineWidth", singleton_1(new BuilderTypes_GlUniformProp(0, 3))), UboProps_u("size", singleton_1(new BuilderTypes_GlUniformProp(0, Vec2__get_Values(size)))), UboProps_u("axisDim", singleton_1(new BuilderTypes_GlUniformProp(0, new Int32Array([~(~halfCount.values[0]), ~(~halfCount.values[1])]))))]))]))]))]));
        const update = (_arg1) => {
        };
        return [canvas, update, false, 2];
    };
    console.log(some("testGrid.grid"));
    run(grid);
}

export function testGridObject() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const dim = 34;
    const worldBounds = BoundsModule_boundsCenterHalf(0, 0, dim, dim);
    const worldScale = Bounds__get_HalfSize(viewport).values[0] / dim;
    const grid_1 = () => {
        const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(10, worldScale), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_sharedObjectWithCamera2d]))]));
        const renderer = GlRenderer_$ctor();
        const scene = canvas.Scenes[0];
        const grid = GlRenderer__Grid2D_Z270D9612(renderer, scene, Vec2_op_Subtraction_47807E55(Bounds__get_Size(worldBounds), 4), 2);
        const update = (time) => {
            Grid2D__set_MinorTick_5E38073B(grid, (time % 5) + 1);
        };
        return [canvas, update, false, 60 * 2];
    };
    console.log(some("testGridObject.grid"));
    run(grid_1);
}

export function testParallax() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const halfDim = 34;
    const dim = halfDim * 2;
    const worldBounds = BoundsModule_boundsCenterHalf(0, 0, dim, dim);
    const worldScale = Bounds__get_HalfSize(viewport).values[0] / halfDim;
    const basic = () => {
        const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(10, worldScale), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam2"), new BuilderTypes_GlCamProp(14, Bounds__get_Quadrant1(viewport)), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0.4, 0.4, 0, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_sharedObjectWithCamera2d]))]));
        const renderer = GlRenderer_$ctor();
        const scene = canvas.Scenes[0];
        const cam = head(scene.Cameras);
        const cam2 = getCamera("cam2")(scene);
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
        return [canvas, update, true, 60 * 10];
    };
    console.log(some("testParallax.basic"));
    run(basic);
}

export function testLink() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const halfDim = 16;
    const dim = halfDim * 2;
    const worldBounds = BoundsModule_boundsCenter(0, 0, dim, dim);
    const basic = () => {
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
        return [canvas, update, false, 60 * 10];
    };
    console.log(some("testLink.basic"));
    run(basic);
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
    const basic = () => {
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
        console.log(some(toText(interpolate("worldScale %P()", [worldScale]))));
        let angle = 0;
        const update = (time) => {
            angle = (angle + 3);
            if (angle > 360) {
                angle = (angle - 360);
            }
            const sin = Math.sin(angle * (3.141592653589793 / 180));
        };
        return [canvas, update, false, 60 * 10];
    };
    console.log(some("testLine.basic"));
    run(basic);
}

export function testLinePath() {
    const viewport = BoundsModule_boundsSize(myCanvas.width, myCanvas.height);
    const ofs = 0;
    const ofs2 = ofs * 2;
    const viewport_1 = BoundsModule_bounds(ofs, ofs, myCanvas.width - ofs2, myCanvas.height - ofs2);
    const halfDim = 3;
    const dim = halfDim * 2;
    const worldBounds = BoundsModule_boundsCenter(0, 0, dim, dim);
    const worldScale = Bounds__get_HalfSize(viewport_1).values[0] / halfDim;
    const basic = () => {
        const canvas = Props_glcanvas("myCanvas", ofArray([new BuilderTypes_GlCanvasProp(4, worldBounds), new BuilderTypes_GlCanvasProp(17), CanvasProps_scene(ofArray([new BuilderTypes_GlSceneProp(10, worldScale), new BuilderTypes_GlSceneProp(1, 3), new BuilderTypes_GlSceneProp(2, 1), SceneProps_orthoCam2d(ofArray([new BuilderTypes_GlCamProp(0, "cam"), new BuilderTypes_GlCamProp(14, viewport_1), new BuilderTypes_GlCamProp(2, Vec4_Create_Z27E3A4C0(0, 0.4, 0.4, 0.1)), new BuilderTypes_GlCamProp(7, 10)])), SceneProps_sharedObjectWithCamera2d]))]));
        const renderer = GlRenderer_$ctor();
        const scene = canvas.Scenes[0];
        const cam = head(scene.Cameras);
        const grid = GlRenderer__Grid2D_Z270D9612(renderer, scene, Vec2_op_Subtraction_47807E55(Bounds__get_Size(worldBounds), 0), 2, "grid");
        const path1 = GlRenderer__LinePath2D_5BF31CC8(renderer, scene, [Vec2_Create_7B00E9A0(-2, 0), Vec2_Create_7B00E9A0(-0.5, 1.5), Vec2_Create_7B00E9A0(0.5, 0), Vec2_Create_7B00E9A0(2.3, 1.5)], -1, "path1");
        const path2 = GlRenderer__LinePath2D_5BF31CC8(renderer, scene, [Vec2_Create_7B00E9A0(2.3, -2.5), Vec2_Create_7B00E9A0(0.5, -1), Vec2_Create_7B00E9A0(-0.5, -2.5), Vec2_Create_7B00E9A0(-2, -1)], -1, "path2");
        LinePathObject2D__Add_Z3D47FC52(path1, Vec2_Create_7B00E9A0(2.5, 0));
        LinePathObject2D__Add_50C79F88(path2, [Vec2_Create_7B00E9A0(-1.5, -2.5), Vec2_Create_7B00E9A0(-2.8, -2)]);
        LinePathObject2D__Set_Z58358D8E(path2, 0, Vec2_Create_7B00E9A0(2.8, -2.5));
        const join = 5;
        LinePathObject2D__set_LineWidth_5E38073B(path1, worldScale * 0.8);
        LinePathObject2D__set_StrokeColor_Z3D47FC58(path1, Vec4_Create_Z27E3A4C0(0, 0, 1, 0.4));
        LinePathObject2D__set_LineCap_7B1263D0(path1, 1);
        LinePathObject2D__set_LineJoin_Z229C3C20(path1, join);
        LinePathObject2D__set_MiterLimit_5E38073B(path1, 100 + (0.5 * LinePathObject2D__get_LineWidth(path1)));
        LinePathObject2D__set_LineWidth_5E38073B(path2, worldScale * 0.3);
        LinePathObject2D__set_StrokeColor_Z3D47FC58(path2, Vec4_Create_Z27E3A4C0(1, 0, 0, 0.1));
        LinePathObject2D__set_LineCap_7B1263D0(path2, 0);
        LinePathObject2D__set_LineJoin_Z229C3C20(path2, join);
        LinePathObject2D__set_MiterLimit_5E38073B(path2, 100 + (0.5 * LinePathObject2D__get_LineWidth(path2)));
        let angle = 0;
        const update = (time) => {
            angle = (angle + 3);
            if (angle > 360) {
                angle = (angle - 360);
            }
            const sin = Math.sin(angle * (3.141592653589793 / 180));
        };
        return [canvas, update, false, 60 * 10];
    };
    console.log(some("testLinePath.basic"));
    run(basic);
}

export function runTests() {
    testLinePath();
}

if (star.complete) {
    runTests();
}
else {
    star.onload = ((_arg1) => {
        runTests();
    });
}

