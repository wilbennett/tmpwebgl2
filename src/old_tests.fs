module OldTests

open System
open Fable.Core
open Fable.Core.JsInterop
open Fable.Import
open Browser.Types
open Browser.Dom
open Wil.Core
open Wil.Core.Utils
open Wil.Twod
open Wil.Twod.Bounds
open Wil.Js
open Wil.Js.Debug
open Wil.Webgl
open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.DataTypes
open Wil.Webgl.Data
open Wil.Webgl.Props
open Wil.Webgl.Core.GlProgram.Utils
open GlCapability

// Debug.enable()
// Debug.setLogCollapsed false

// the unbox keyword allows to make an unsafe cast. Here we assume that getElementById will return an HTMLCanvasElement 
let star = document.getElementById "star" |> unbox<HTMLImageElement>
let myCanvas = document.getElementById "myCanvas" |> unbox<HTMLCanvasElement>
myCanvas.width <- 400.0
myCanvas.height <- 400.0

let elMouse = document.getElementById "mouse" :?> HTMLParagraphElement
let mouse = GlMouse(myCanvas)

let showMousePos (pos: Vec2) = elMouse.textContent <- $"{pos}"

let createTriangleData (p1: Vec2) (p2: Vec2) (p3: Vec2) =
  [|
    p1.X; p1.Y
    p2.X; p2.Y
    p3.X; p3.Y
  |]

let createInterleaveData (p1: Vec2) (p2: Vec2) (p3: Vec2) (col: float[]) =
  [|
    p1.X; p1.Y
    col.[0]; col.[1]; col.[2]; col.[3]
    p2.X; p2.Y
    col.[0]; col.[1]; col.[2]; col.[3]
    p3.X; p3.Y
    col.[0]; col.[1]; col.[2]; col.[3]
  |]

let interleaveData (triangle: float[]) (col: float[]) =
  [|
    triangle.[0]; triangle.[1]
    col.[0]; col.[1]; col.[2]; col.[3]
    triangle.[2]; triangle.[3]
    col.[0]; col.[1]; col.[2]; col.[3]
    triangle.[4]; triangle.[5]
    col.[0]; col.[1]; col.[2]; col.[3]
  |]

let createInstanceData (p1: Vec2) (p2: Vec2) (p3: Vec2) (col: float[]) =
  [|
    p1.X; p1.Y
    p2.X; p2.Y
    p3.X; p3.Y
    col.[0]; col.[1]; col.[2]; col.[3]
  |]

let revTriangle (tri: float[]) = [|
  tri.[0]; tri.[1]
  tri.[4]; tri.[5]
  tri.[2]; tri.[3]
  |]

let boundsToTriangles (b: Bounds) =
  (
    [| yield! b.MinLeft.Values; yield! b.MinRight.Values; yield! b.MaxRight.Values |],
    [| yield! b.MinLeft.Values; yield! b.MaxRight.Values; yield! b.MaxLeft.Values |]
  )

let center = vec2 0.0 0.0
let topMid = vec2 0.0 1.0
let topMid1 = vec2 -0.5 1.0
let topMid2 = vec2 0.5 1.0
let topLeft = vec2 -1.0 1.0
let left = vec2 -1.0 0.0
let botLeft = vec2 -1.0 -1.0
let botMid = vec2 0.0 -1.0
let botRight = vec2 1.0 -1.0
let right = vec2 1.0 0.0
let topRight = vec2 1.0 1.0

let triangle1 = createTriangleData center topMid topLeft
let triangle2 = createTriangleData center topLeft left
let triangle3 = createTriangleData center left botLeft
let triangle4 = createTriangleData center botLeft botMid
let triangle5 = createTriangleData center botMid botRight
let triangle6 = createTriangleData center botRight right
let triangle7 = createTriangleData center topRight topMid2
let triangle8 = createTriangleData center topMid2 topMid

let fillColor1 = [| 1.0; 0.0; 0.0; 1.0 |]
let posData1 = createTriangleData center topMid topLeft
let fillColor2 = [| 0.0; 1.0; 0.0; 1.0 |]
let posData2 = createInterleaveData center topLeft left fillColor2
let fillColor3 = [| 0.0; 0.0; 1.0; 1.0 |]
let posData3 = createTriangleData center left botLeft
let fillColor4 = [| 1.0; 1.0; 0.0; 1.0 |]
let fillColor5 = [| 1.0; 0.0; 1.0; 1.0 |]
let fillColor6 = [| 0.0; 1.0; 1.0; 1.0 |]
let fillColor7 = [| 0.5; 0.5; 1.0; 1.0 |]

let posData4 =
  createInstanceData center botMid botRight fillColor5
  |> Array.append (createInstanceData center botLeft botMid fillColor4)

let posData5 = createTriangleData center botRight right
let posData6 = createTriangleData center right topRight
let posData7 = createTriangleData center topRight topMid

let rec getUniforms (info: GlUniformInfo) =
  seq {
    yield info
    if info.Children.Length > 0 then
      yield! (info.Children |> Array.map getUniforms |> Seq.concat)
  }

let showUniforms (data: GlObjData) =
  let pinfo = data.ProgramInfo
  JS.console.table(pinfo.Uniforms |> Seq.collect getUniforms |> Array.ofSeq)

let showUbos (data: GlObjData) =
  let pinfo = data.ProgramInfo
  JS.console.table(pinfo.Ubos |> Seq.collect (fun u -> u.Uniforms) |> Array.ofSeq)

let showAttributes (data: GlObjData) =
  let pinfo = data.ProgramInfo
  JS.console.table(pinfo.Attributes |> Array.ofList)

let run f =
  let (canvas, update, animating, frames) = f()
  let scene = canvas.Scenes.[0]
  let cam = scene |> GlScene.getCamera "cam"
  let tri1 = scene |> GlCommon.objects |> Seq.tryHead
  GlCanvas.render 0.0 canvas
  // scene.Shared |> Option.call GlDebug.tableObjDefAndContents
  // scene.Layers.[1].Objects |> List.iter GlDebug.tableObjDefAndContents
  // scene |> GlCommon.objects |> Seq.iter GlDebug.tableObjDef
  // scene.Shared |> Option.call showUniforms
  // scene.Objects |> List.iter showUniforms
  // scene.Objects |> List.iter showUbos

  let mutable frame = 0
  let dragButton = Mouse.leftButton
  // let dragButton = CanvasMouse.middleButton
  let mutable dragging = false
  let mutable dragOffset = Vec3.Create()

  let processMouse () =
    if mouse.IsDragStartEvent(dragButton) then
      dragging <- true
      let origin = cam |> GlCamera.toWorld (mouse.DragOrigin(dragButton))
      tri1 |> Option.call (fun tri1 -> dragOffset <- tri1.Position - origin)

    if mouse.IsDragEvent(dragButton) && dragging then
      let worldPos = cam |> GlCamera.toWorld mouse.Position
      // cam |> GlCamera.panTo (Vec3.Create(worldPos, 0.0))
      tri1 |> Option.call (fun tri1 -> tri1 |> GlObj.setPosition (worldPos + dragOffset))

    if mouse.IsDragEndEvent(dragButton) then dragging <- true

    if mouse.IsWheelEvent then
      if mouse.WheelDelta.Y <> 0.0 then
        let zoom = if mouse.WheelDelta.Y > 0.0 then 1.03 else 0.97
        // cam |> GlCamera.zoomBy zoom
        let worldPos = cam |> GlCamera.toWorld mouse.Position
        cam |> GlCamera.zoomToward worldPos zoom
      if mouse.WheelDelta.X <> 0.0 then
        let amount = if mouse.WheelDelta.X > 0.0 then 10.0 else -10.0
        cam |> GlCamera.panByXY amount 0.0
    ()

  let rec render time =
    frame <- frame + 1

    if animating && frame < frames then
      window.requestAnimationFrame render |> ignore

    mouse.Update()
    showMousePos mouse.Position
    processMouse()
    if animating then update (time / 1000.0)
    GlCanvas.render 0.0 canvas

  let scheduleRender () =
    window.requestAnimationFrame render |> ignore

  mouse.Changed.Add scheduleRender
  scheduleRender()
  ()

let testc () =
  let gl = myCanvas.getContext_2d()
  gl.fillStyle <- !^"blue"
  gl.fillRect(0.0, 0.0, gl.canvas.width, gl.canvas.height)

let testw () =
  let vertex2d = """#version 300 es
  in vec2 a_position;

  void main() {
    vec2 position = a_position;
    gl_Position = vec4(position, 0.0, 1.0);
  }"""

  let fragment2d = """#version 300 es
  precision mediump float;

  uniform vec4 u_fillColor;
  uniform float temp[3];
  uniform bool tempBool;
  out vec4 glFragColor;

  void main() {
    //glFragColor = vec4(1, 0, 0.5, 1);
    // glFragColor = u_fillColor;
    glFragColor = vec4(u_fillColor.x * temp[0], u_fillColor.y * temp[1], u_fillColor.z * temp[2], u_fillColor.w);
    glFragColor *= float(tempBool);
  }"""

  let vertexInterleave = """#version 300 es
  in vec2 a_position;
  in vec4 a_fillColor;

  out vec4 v_fillColor;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_fillColor = a_fillColor;
  }"""

  let fragmentInterleave = """#version 300 es
  precision mediump float;

  in vec4 v_fillColor;

  out vec4 glFragColor;

  void main() {
    glFragColor = v_fillColor;
  }"""

  let vertexInstance = """#version 300 es
  in vec2 a_posA;
  in vec2 a_posB;
  in vec2 a_posC;
  in vec4 a_fillColor;

  out vec4 v_fillColor;

  void main() {
    switch (gl_VertexID) {
      case 0:
        gl_Position = vec4(a_posA, 0.0, 1.0);
        break;
      case 1:
        gl_Position = vec4(a_posB, 0.0, 1.0);
        break;
      case 2:
        gl_Position = vec4(a_posC, 0.0, 1.0);
        break;
    }

    v_fillColor = a_fillColor;
  }"""

  let fragmentInstance = """#version 300 es
  precision mediump float;

  in vec4 v_fillColor;

  out vec4 glFragColor;

  void main() {
    glFragColor = v_fillColor;
  }"""

  let vertexUbo = """#version 300 es
  //layout (std140)

  uniform perScene {
    float value;
    vec3 vector;
    mat4 matrix;
    float values[3];
    bool boolean;
    int integer;
    mat3 matrix3;
  	vec4 color1;
    mat3 mat3A[3];
    vec4 color2;
  };

  uniform perModel {
  	vec4 color3;
  };

  in vec2 a_position;
  uniform float flt;
  out vec3 v_color;

  void main() {
    vec3 position = vec3(a_position, 0.0);
    position = (matrix * vec4(position, 1.0)).xyz;
    position *= matrix3;
    // position *= mat3A[0];
    // position *= mat3A[1];
    gl_Position = vec4(position, 1.0);
    v_color = color1.rgb + color2.rgb + color3.rgb + flt;
    v_color *= value;
    v_color *= float(boolean);
    v_color *= float(integer);
    v_color *= vector;
    v_color *= vec3(values[0]);
    v_color *= vec3(values[1]);
    // v_color = vec3(1.0, 0.0, 0.0);
    // v_color = vec3(mat3A[0][0][0], mat3A[0][0][1], mat3A[0][0][2]);
    // v_color = vec3(mat3A[0][1][0], mat3A[0][1][1], mat3A[0][1][2]);
    // v_color = vec3(mat3A[0][2][0], mat3A[0][2][1], mat3A[0][2][2]);

    // v_color = vec3(mat3A[1][0][0], mat3A[1][0][1], mat3A[1][0][2]);
    // v_color = vec3(mat3A[1][1][0], mat3A[1][1][1], mat3A[1][1][2]);
    // v_color = vec3(mat3A[1][2][0], mat3A[1][2][1], mat3A[1][2][2]);

    // v_color = vec3(mat3A[2][0][0], mat3A[2][0][1], mat3A[2][0][2]);
    // v_color = vec3(mat3A[2][1][0], mat3A[2][1][1], mat3A[2][1][2]);
    // v_color = vec3(mat3A[2][2][0], mat3A[2][2][1], mat3A[2][2][2]);
  }
  """

  let fragmentUbo = """#version 300 es
  precision mediump float;

  in vec3 v_color;
  out vec4 outColor;

  void main() {
  	outColor = vec4(v_color, 1.0);
  }
  """

  let vertexShared = """#version 300 es
  // layout (std140)

  uniform ubo1 {
  	vec4 red;
  };

  uniform ubo2 {
    float temp[3];
  	vec4 green;
  };

  in vec2 a_position;
  uniform vec4 blue;
  out vec4 v_color;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_color = red + green + blue;
    // v_color = vec3(1.0, 0.0, 0.0);
  }
  """

  let vertexShared2 = """#version 300 es
  precision mediump sampler3D;

  uniform ubo1 {
  	vec4 red;
  };

  uniform ubo2 {
    float temp[3];
  	vec4 green;
  };

  uniform mat2x3 mat2x31;

  in vec2 a_position;
  uniform mat3 mat31;
  uniform mat3 mat32[2];
  uniform vec4 blue;
  uniform bool yes;
  uniform bool yesYes[2];
  uniform bool no;
  uniform bool noNo[2];
  uniform int int1;
  uniform int int2[2];
  uniform uint uint1;
  uniform uint uint2[2];
  uniform vec2 v2;
  uniform vec2 v22[2];
  uniform vec3 v3;
  uniform vec3 v32[2];
  in vec2 s2;
  uniform sampler2D s2d;
  in vec3 s3;
  uniform sampler3D s3d;
  out vec4 v_color;

  float add(vec2 v) { return v.x + v.y; }
  float add(vec3 v) { return v.x + v.y + v.z; }
  float add(vec4 v) { return v.x + v.y + v.z + v.w; }
  float add0(vec4 v) { return v.x * 0.0 + v.y * 0.0 + v.z * 0.0 + v.w * 0.0; }

  void main() {
    vec3 position = vec3(a_position, 0.0);
    position *= mat31;
    position *= mat32[0];
    position *= mat32[1];
    vec2 b = position * mat2x31;
    position += vec3(b, 0.0);
    gl_Position = vec4(position, 1.0);
    vec4 yy = vec4(float(yesYes[0]), float(yesYes[1]), 1.0, 1.0);
    float sum = 1.0
              + float(int1)
              + float(int2[0]) + float(int2[1])
              + float(no)
              + float(noNo[0]) + float(noNo[1])
              + add(v2)
              + add(v22[0]) + add(v22[1])
              + add(v3)
              + add(v32[0]) + add(v32[1])
              + add0(texture(s2d, s2))
              + add0(texture(s3d, s3))
              ;
    v_color = red + green + blue;
    v_color *= float(yes);
    v_color *= yy;
    v_color *= sum;
    v_color *= float(uint1);
    // v_color = texture(s2d, s2);
  }
  """

  let fragmentShared = """#version 300 es
  precision mediump float;

  in vec4 v_color;
  out vec4 outColor;

  void main() {
  	outColor = v_color;
  }
  """

  addVertexShaderSource "vertex2d" vertex2d
  addFragmentShaderSource "fragment2d" fragment2d
  addVertexShaderSource "vertexInterleave" vertexInterleave
  addFragmentShaderSource "fragmentInterleave" fragmentInterleave
  addVertexShaderSource "vertexInstance" vertexInstance
  addFragmentShaderSource "fragmentInstance" fragmentInstance
  addVertexShaderSource "vertexUbo" vertexUbo
  addFragmentShaderSource "fragmentUbo" fragmentUbo
  addVertexShaderSource "vertexShared" vertexShared
  addVertexShaderSource "vertexShared2" vertexShared2
  addFragmentShaderSource "fragmentShared" fragmentShared
    
  let resetCanvas() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

  let run f =
    let (tri, cam) = f()
    GlObj.render cam tri
    // GlDebug.logObjDef tri
    // GlDebug.tableObjDef tri
    GlDebug.tableObjDefAndContents tri
    // resetCanvas()
    // GlObj.render tri

    let pinfo = tri.ProgramInfo
    // let pinfo = createProgramInfo gl vertexUbo fragmentUbo
    // let pinfo = createProgramInfo gl vertexShared fragmentShared
    // let program = pinfo.Program
    // let blockName = gl.getActiveUniformBlockName(program, 0.0)
    // let uIndices = gl.getActiveUniformBlockParameter(program, 0.0, GlBlockParam.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES)
    // let size = gl.getActiveUniformBlockParameter(program, 0.0, GlBlockParam.UNIFORM_BLOCK_DATA_SIZE)
    // jsLog "%A" blockName
    // jsLog "Active Indices: %A" uIndices
    // jsLog "UBO size: %A" size
    // JS.console.table(pinfo.Uniforms |> Seq.collect getUniforms |> Array.ofSeq)
    // JS.console.table(pinfo.Ubos |> Array.ofSeq |> Array.sortBy (fun x -> x.Name))
    // JS.console.table(pinfo.Attributes |> Array.ofSeq |> Array.sortBy (fun x -> x.Name))
    // GlDebug.logUboInfosTree pinfo.Ubos
    // pinfo.Uniforms |> List.where (fun u -> u.BlockIndex < 0) |> GlDebug.logUniformInfosTree
    // GlDebug.logUbosTree tri.Ubos
    // GlDebug.logUniformsTree tri.Uniforms
    ()

  let manualArray() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    let program = createProgram gl vertex2d fragment2d
    gl.useProgram(program)
    let posLoc = gl.getAttribLocation(program, "a_position")
    let colorLoc = gl.getUniformLocation(program, "u_fillColor")

    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    let pf = toArrayBufferViewFloat32 posData1
    gl.bufferData(gl.ARRAY_BUFFER, !^pf, gl.STATIC_DRAW)

    gl.uniform4fv(colorLoc, float32Array fillColor1)

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2.0, gl.FLOAT, false, 0.0, 0.0)
    gl.drawArrays(gl.TRIANGLES, 0.0, 3.0)

  let manualArrayVao() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    let program = createProgram gl vertex2d fragment2d
    gl.useProgram(program)
    let posLoc = gl.getAttribLocation(program, "a_position")
    let colorLoc = gl.getUniformLocation(program, "u_fillColor")
    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    let pf = toArrayBufferViewFloat32 posData1
    gl.bufferData(gl.ARRAY_BUFFER, !^pf, gl.STATIC_DRAW)

    gl.uniform4fv(colorLoc, float32Array fillColor1)

    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2.0, gl.FLOAT, false, 0.0, 0.0)
    gl.drawArrays(gl.TRIANGLES, 0.0, 3.0)

  let autoArray() =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          object "vertex2d" "fragment2d" [
            ObjectName "tri"
            uniform "u_fillColor" [ Value fillColor1 ]
            uniform "tempBool" [ Value true ]
            uniform "temp[0]" [ Value [| 1.0; 1.0; 1.0 |] ]
            attribute "a_position" [ Values posData1 ]
          ]
        ]
      ]
    
    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    (scene |> GlCommon.objects |> Seq.head, cam)

  let manualInterleave() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    let program = createProgram gl vertexInterleave fragmentInterleave
    gl.useProgram(program)
    let posLoc = gl.getAttribLocation(program, "a_position")
    let colorLoc = gl.getAttribLocation(program, "a_fillColor")
    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    let pf = toArrayBufferViewFloat32 posData2
    gl.bufferData(gl.ARRAY_BUFFER, !^pf, gl.STATIC_DRAW)

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2.0, gl.FLOAT, false, 24.0, 0.0)
    gl.enableVertexAttribArray(colorLoc)
    gl.vertexAttribPointer(colorLoc, 4.0, gl.FLOAT, false, 24.0, 8.0)
    gl.drawArrays(gl.TRIANGLES, 0.0, 3.0)

  let manualInterleaveVao() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    let program = createProgram gl vertexInterleave fragmentInterleave
    gl.useProgram(program)
    let posLoc = gl.getAttribLocation(program, "a_position")
    let colorLoc = gl.getAttribLocation(program, "a_fillColor")

    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    let pf = toArrayBufferViewFloat32 posData2
    gl.bufferData(gl.ARRAY_BUFFER, !^pf, gl.STATIC_DRAW)

    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2.0, gl.FLOAT, false, 24.0, 0.0)
    gl.enableVertexAttribArray(colorLoc)
    gl.vertexAttribPointer(colorLoc, 4.0, gl.FLOAT, false, 24.0, 8.0)

    gl.drawArrays(gl.TRIANGLES, 0.0, 3.0)

  let autoInterleave() =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          object "vertexInterleave" "fragmentInterleave" [
            ObjectName "tri1"
            interleave "a_position" [
              Values posData2
              child "a_fillColor" [ DeterminesVertexCount; BaseType GlType.UNSIGNED_BYTE ]
              // child "a_fillColor" [ DeterminesVertexCount; ]
            ]
          ]
        ]
      ]

    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    (scene |> GlCommon.objects |> Seq.head, cam)

  let manualIndexed() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    let program = createProgram gl vertex2d fragment2d
    gl.useProgram(program)
    let posLoc = gl.getAttribLocation(program, "a_position")
    let colorLoc = gl.getUniformLocation(program, "u_fillColor")

    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    let pf = toArrayBufferViewFloat32 posData3
    gl.bufferData(gl.ARRAY_BUFFER, !^pf, gl.STATIC_DRAW)

    let Indices = [| 0; 1; 2 |]
    let pi = toArrayBufferViewUint16 Indices
    let indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, !^pi, gl.STATIC_DRAW)

    gl.uniform4fv(colorLoc, float32Array fillColor3)

    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2.0, gl.FLOAT, false, 0.0, 0.0)
    gl.drawElements(gl.TRIANGLES, 3.0, float GlType.UNSIGNED_SHORT, 0.0)

  let manualIndexedVao() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    let program = createProgram gl vertex2d fragment2d
    gl.useProgram(program)
    let posLoc = gl.getAttribLocation(program, "a_position")
    let colorLoc = gl.getUniformLocation(program, "u_fillColor")

    gl.uniform4fv(colorLoc, float32Array fillColor3)

    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    let pf = toArrayBufferViewFloat32 posData3
    gl.bufferData(gl.ARRAY_BUFFER, !^pf, gl.STATIC_DRAW)

    let indices = [| 0; 1; 2 |]
    let pi = toArrayBufferViewUint16 indices
    let indexBuffer = gl.createBuffer()

    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, !^pi, gl.STATIC_DRAW)

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2.0, gl.FLOAT, false, 0.0, 0.0)
    gl.drawElements(gl.TRIANGLES, 3.0, float GlType.UNSIGNED_SHORT, 0.0)

  let autoIndexed() =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          object "vertex2d" "fragment2d" [
            ObjectName "tri1"
            uniform "u_fillColor" [ Value fillColor3 ]
            uniform "temp[0]" [ Value [| 1.0; 1.0; 1.0 |] ]
            uniform "tempBool" [ Value true ]
            attribute "a_position" [ Values posData3 ]
            Indices [ IndexValues [| 0; 1; 2 |] ]
          ]
        ]
      ]

    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    (scene |> GlCommon.objects |> Seq.head, cam)

  let manualArrayInstanced() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    let program = createProgram gl vertexInstance fragmentInstance
    gl.useProgram(program)
    let posALoc = gl.getAttribLocation(program, "a_posA")
    let posBLoc = gl.getAttribLocation(program, "a_posB")
    let posCLoc = gl.getAttribLocation(program, "a_posC")
    let colorLoc = gl.getAttribLocation(program, "a_fillColor")

    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    let pf = toArrayBufferViewFloat32 posData4
    gl.bufferData(gl.ARRAY_BUFFER, !^pf, gl.STATIC_DRAW)

    let vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    gl.enableVertexAttribArray(posALoc)
    gl.vertexAttribPointer(posALoc, 2.0, gl.FLOAT, false, 40.0, 0.0)
    gl.vertexAttribDivisor(posALoc, 1.0)

    gl.enableVertexAttribArray(posBLoc)
    gl.vertexAttribPointer(posBLoc, 2.0, gl.FLOAT, false, 40.0, 8.0)
    gl.vertexAttribDivisor(posBLoc, 1.0)

    gl.enableVertexAttribArray(posCLoc)
    gl.vertexAttribPointer(posCLoc, 2.0, gl.FLOAT, false, 40.0, 16.0)
    gl.vertexAttribDivisor(posCLoc, 1.0)

    gl.enableVertexAttribArray(colorLoc)
    gl.vertexAttribPointer(colorLoc, 4.0, gl.FLOAT, false, 40.0, 24.0)
    gl.vertexAttribDivisor(colorLoc, 1.0)

    gl.drawArraysInstanced(gl.TRIANGLES, 0.0, 6.0, 2.0)

  let manualArrayInstancedVao() =
    let gl = myCanvas.getContext("webgl2") |> unbox<WebGLRenderingContext>
    let program = createProgram gl vertexInstance fragmentInstance
    gl.useProgram(program)
    let posALoc = gl.getAttribLocation(program, "a_posA")
    let posBLoc = gl.getAttribLocation(program, "a_posB")
    let posCLoc = gl.getAttribLocation(program, "a_posC")
    let colorLoc = gl.getAttribLocation(program, "a_fillColor")

    let posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    let pf = toArrayBufferViewFloat32 posData4
    gl.bufferData(gl.ARRAY_BUFFER, !^pf, gl.STATIC_DRAW)

    gl.enableVertexAttribArray(posALoc)
    gl.vertexAttribPointer(posALoc, 2.0, gl.FLOAT, false, 40.0, 0.0)
    gl.vertexAttribDivisor(posALoc, 1.0)

    gl.enableVertexAttribArray(posBLoc)
    gl.vertexAttribPointer(posBLoc, 2.0, gl.FLOAT, false, 40.0, 8.0)
    gl.vertexAttribDivisor(posBLoc, 1.0)

    gl.enableVertexAttribArray(posCLoc)
    gl.vertexAttribPointer(posCLoc, 2.0, gl.FLOAT, false, 40.0, 16.0)
    gl.vertexAttribDivisor(posCLoc, 1.0)

    gl.enableVertexAttribArray(colorLoc)
    gl.vertexAttribPointer(colorLoc, 4.0, gl.FLOAT, false, 40.0, 24.0)
    gl.vertexAttribDivisor(colorLoc, 1.0)

    gl.drawArraysInstanced(gl.TRIANGLES, 0.0, 6.0, 2.0)

  let autoArrayInstanced() =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          object "vertexInstance" "fragmentInstance" [
            ObjectName "tri1"
            interleave "a_posA" [
              Values posData4
              Divisor 1
              DeterminesVertexCount
              DeterminesInstanceCount
              child "a_posB" [ Divisor 1; DeterminesVertexCount ]
              child "a_posC" [ Divisor 1; DeterminesVertexCount ]
              child "a_fillColor" [ Divisor 1 ]
            ]
          ]
        ]
      ]

    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    (scene |> GlCommon.objects |> Seq.head, cam)

  let autoUbo() =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          object "vertexUbo" "fragmentUbo" [
            ObjectName "tri1"
            attribute "a_position" [ Values posData5 ]

            ubo "perScene" [
              u "value" [ Value 1.0 ]
              u "vector" [ Value [| 1.0; 1.0; 1.0 |] ]
              u "matrix" [ Value [|
                                    1.0; 0.0; 0.0; 0.0;
                                    0.0; 1.0; 0.0; 0.0;
                                    0.0; 0.0; 1.0; 0.0;
                                    0.0; 0.0; 0.0; 1.0 |] ]
              u "values[0]" [ Value [| 1.0; 1.0; 2.0 |] ]
              u "boolean" [ Value true ]
              u "integer" [ Value 1 ]
              u "matrix3" [ Value [|
                1.0; 0.0; 0.0
                0.0; 1.0; 0.0
                0.0; 0.0; 1.0
                |] ]
              u "color1" [ Value [| 0.0; 0.0; 0.0; 1.0 |] ]
              u "mat3A[0]" [ Value [|
                1.0; 0.0; 0.0
                0.0; 1.0; 0.0
                0.0; 0.0; 1.0

                1.0; 0.0; 0.0
                0.0; 1.0; 0.0
                0.0; 0.0; 1.0

                1.0; 0.0; 0.0
                0.0; 1.0; 0.0
                0.0; 0.0; 1.0
                |] ]
              u "color2" [ Value [| 0.0; 1.0; 0.0; 1.0 |] ]
            ]

            ubo "perModel" [
              u "color3" [ Value [| 0.0; 0.0; 1.0; 1.0 |] ]
            ]
          ]
        ]
      ]

    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    (scene |> GlCommon.objects |> Seq.head, cam)

  let autoShared() =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          shared "vertexShared" "fragmentShared" [
            // uniform "blue" [ Value [| 0.0; 0.0; 0.5; 1.0 |] ]
            uniform "blue" [ Value [| 0.0f; 0.0f; 0.5f; 1.0f |] ]
            attribute "a_position" [ Values posData6 ]

            ubo "ubo1" [
              BufferIndex 3
              u "red" [ Value [| 0.5; 0.0; 0.0; 0.0 |] ]
            ]

            ubo "ubo2" [
              u "temp[0]" [ Value [| 1.0; 1.0; 1.0 |] ]
              u "green" [ Value [| 0.0; 0.5; 0.0; 0.0 |] ]
            ]
          ]

          object "vertexShared" "fragmentShared" [
            ObjectName "tri1"
            // uniform "blue" [ Value [| 0.0; 0.0; 0.5; 1.0 |] ]
            // attribute "a_position" [ Values posData6 ]

            ubo "ubo2" [
              u "green" [ Value [| 0.0; 0.5; 0.0; 0.0 |] ]
            ]
          ]

          object "vertexShared2" "fragmentShared" [
            ObjectName "tri2"
            uniform "mat31" [ Value [|
              1.0; 0.0; 0.0
              0.0; 1.0; 0.0
              0.0; 0.0; 1.0
              |] ]
            uniform "mat32[0]" [ Value [|
              1.0; 0.0; 0.0
              0.0; 1.0; 0.0
              0.0; 0.0; 1.0

              1.0; 0.0; 0.0
              0.0; 1.0; 0.0
              0.0; 0.0; 1.0
              |] ]
            uniform "blue" [ Value [| 0.0; 0.0; 1.0; 1.0 |] ]
            uniform "yes" [ Value true ]
            uniform "yesYes[0]" [ Value [| true; true |] ]
            uniform "s3d" [ Value 1 ]
            uniform "byte1" [ Value true ]
            uniform "uint1" [ Value 1 ]
            attribute "a_position" [ Values posData7 ]
            attribute "s2" [ Values (Array.zeroCreate<float> (2 * 3)) ]
            attribute "s3" [ Values (Array.zeroCreate<float> (3 * 3)) ]
          ]
        ]
      ]

    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    let tri1 = GlScene.getObject "tri1" scene
    let tri2 = GlScene.getObject "tri2" scene
    resetCanvas()
    GlObj.update cam scene.Shared.Value
    GlObj.render cam tri1
    GlObj.render cam tri2
    // GlDebug.tableObjDef scene
    // GlDebug.tableObjDef tri1
    GlDebug.tableObjDef tri2
    resetCanvas()
    scene.Shared |> Option.call (GlObj.update cam)
    GlObj.render cam tri1
    GlObj.render cam tri2
    // let pinfo = createProgramInfo gl vertexShared fragmentShared
    let pinfo = tri2.ProgramInfo
    JS.console.table( pinfo.Uniforms |> Seq.collect getUniforms |> Array.ofSeq)
    // GlDebug.logUboInfosTree pinfo.Ubos
    // pinfo.Uniforms |> List.where (fun u -> u.BlockIndex < 0)  |> GlDebug.logUniformInfosTree
    // GlDebug.logUbosTree tri2.Ubos
    // GlDebug.logUniformsTree tri2.Uniforms
    // let ubo = GlObj.getUbo "dummy" tri1
    let uni = GlObj.getUniform "blue" tri1
    // let att = GlObj.getAttribute "dummy" tri1
    ()

  let doTest() =
    // run autoArray
    run autoInterleave
    // run autoIndexed
    // run autoArrayInstanced
    // manualArray()
    // manualInterleave()
    // manualIndexed()
    // manualArrayInstanced()
    ()

  let doTestVao() =
    // jsLog "autoArray";          run autoArray
    jsLog "autoInterleave";     run autoInterleave
    // jsLog "autoIndexed";        run autoIndexed
    // jsLog "autoArrayInstanced"; run autoArrayInstanced
    // jsLog "autoUbo";            run autoUbo
    // jsLog "autoShared";         autoShared()
    // manualArrayVao()
    // manualInterleaveVao()
    // manualIndexedVao()
    // manualArrayInstancedVao()
    ()

  resetCanvas()
  // doTest()
  doTestVao()

  // let count = gl.getProgramParameter(program1, gl.ACTIVE_UNIFORMS) :?> int
  // let par = gl.getActiveUniform(program1, 0.0)
  // jsLog "ARRAY_BUFFER: %A" gl.ARRAY_BUFFER
  // jsLog "ELEMENT_ARRAY_BUFFER: %A" gl.ELEMENT_ARRAY_BUFFER
  // jsLog "COPY_READ_BUFFER: %A" gl.COPY_READ_BUFFER
  // jsLog "COPY_WRITE_BUFFER: %A" gl.COPY_WRITE_BUFFER
  // jsLog "TRANSFORM_FEEDBACK_BUFFER: %A" gl.TRANSFORM_FEEDBACK_BUFFER
  // jsLog "UNIFORM_BUFFER: %A" gl.UNIFORM_BUFFER
  // jsLog "PIXEL_PACK_BUFFER: %A" gl.PIXEL_PACK_BUFFER
  // jsLog "PIXEL_UNPACK_BUFFER: %A" gl.PIXEL_UNPACK_BUFFER
  ()

let testScene () =
  let svertex2d = """#version 300 es
precision mediump float;
in vec2 a_position;
uniform float time;

void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 position = a_position;
  gl_Position = vec4(position, 0.0, 1.0);
  gl_Position *= time / time;
}"""

  let sfragment2d = """#version 300 es
precision mediump float;

uniform float time;

out vec4 glFragColor;

void main() {
  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);
  glFragColor *= time;
}"""

  let vertex2d = """#version 300 es
in vec2 a_position;

void main() {
  vec2 position = a_position;
  gl_Position = vec4(position, 0.0, 1.0);
}"""

  let fragment2d = """#version 300 es
precision mediump float;

uniform float time;
uniform vec4 fillColor;

out vec4 glFragColor;

void main() {
  glFragColor = fillColor;
  glFragColor *= fract(time);
}"""

  let svertexInterleave = """#version 300 es
precision mediump float;
in vec2 a_position;
in vec4 fillColor;
uniform float time;

out vec4 v_fillColor;

void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 position = a_position;
  gl_Position = vec4(position, 0.0, 1.0);
  gl_Position *= time / time;
  v_fillColor = fillColor;
}"""

  let sfragmentInterleave = """#version 300 es
precision mediump float;

uniform float time;

in vec4 v_fillColor;

out vec4 glFragColor;

void main() {
  glFragColor = v_fillColor;
  glFragColor *= time;
}"""

  let vertexInterleave = """#version 300 es
in vec2 a_position;
in vec4 fillColor;

out vec4 v_fillColor;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_fillColor = fillColor;
}"""

  let fragmentInterleave = """#version 300 es
precision mediump float;

in vec4 v_fillColor;

uniform float time;

out vec4 glFragColor;

void main() {
  glFragColor = v_fillColor;
  glFragColor *= fract(time);
}"""

  let svertexUbo = """#version 300 es
precision mediump float;
in vec2 a_position;

uniform uboShared {
  uniform float time;
  uniform vec4 fillColor;
};

out vec4 v_fillColor;

void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 position = a_position;
  gl_Position = vec4(position, 0.0, 1.0);
  gl_Position *= time / time;
}"""

  let sfragmentUbo = """#version 300 es
precision mediump float;

uniform uboShared {
  uniform float time;
  uniform vec4 fillColor;
};

out vec4 glFragColor;

void main() {
  glFragColor = fillColor;
  glFragColor *= time;
}"""

  let vertexUbo = """#version 300 es
in vec2 a_position;

uniform uboShared {
  uniform float time;
  uniform vec4 fillColor;
};

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}"""

  let fragmentUbo = """#version 300 es
precision highp float;
// precision mediump uniform;

uniform uboShared {
  uniform float time;
  uniform vec4 fillColor;
};

out vec4 glFragColor;

void main() {
  glFragColor = fillColor;
  glFragColor *= fract(time);
}"""

  addVertexShaderSource "svertex2d" svertex2d
  addFragmentShaderSource "sfragment2d" sfragment2d
  addVertexShaderSource "vertex2d" vertex2d
  addFragmentShaderSource "fragment2d" fragment2d
  addVertexShaderSource "svertexInterleave" svertexInterleave
  addFragmentShaderSource "sfragmentInterleave" sfragmentInterleave
  addVertexShaderSource "vertexInterleave" vertexInterleave
  addFragmentShaderSource "fragmentInterleave" fragmentInterleave
  addVertexShaderSource "svertexUbo" svertexUbo
  addFragmentShaderSource "sfragmentUbo" sfragmentUbo
  addVertexShaderSource "vertexUbo" vertexUbo
  addFragmentShaderSource "fragmentUbo" fragmentUbo

  let run f =
    let (glcanvas, update) = f()
    let tri1 = glcanvas.Scenes.[0] |> GlScene.tryGetObject "tri1"
    let tri2 = glcanvas.Scenes.[0] |> GlScene.tryGetObject "tri2"
    GlCanvas.render 0.0 glcanvas
    glcanvas.Scenes.[0].Shared |> Option.call GlDebug.tableObjDef
    tri1 |> Option.call GlDebug.tableObjDef
    tri2 |> Option.call GlDebug.tableObjDef

    let pinfo =
      let gl = glcanvas.Context
      match glcanvas.Scenes.[0].Shared with
      | Some shared -> shared.ProgramInfo
      | None -> tri1 |> Option.executeDefault (GlProgram.emptyProgramInfo gl) (fun x -> x.ProgramInfo)
    // let pinfo = createProgramInfo gl vertexUbo fragmentUbo
    // let pinfo = createProgramInfo gl vertexShared fragmentShared
    // let program = pinfo.Program
    // JS.console.table( pinfo.Uniforms |> Seq.collect getUniforms |> Array.ofSeq)
    // JS.console.table(pinfo.Ubos |> Array.ofSeq |> Array.sortBy (fun x -> x.Name))
    // JS.console.table(pinfo.Attributes |> Array.ofSeq |> Array.sortBy (fun x -> x.Name))
    // GlDebug.logUboInfosTree pinfo.Ubos
    // pinfo.Uniforms |> List.where (fun u -> u.BlockIndex < 0) |> GlDebug.logUniformInfosTree
    // GlDebug.logUbosTree tri.Ubos
    // GlDebug.logUniformsTree tri.Uniforms
    
    let doUpdate _ =
      jsLog "** ========================================== **"
      update()
      GlCanvas.render 0.0 glcanvas
  
    let t = new Timers.Timer(2000.0)
    t.AutoReset <- false
    t.Elapsed.Add doUpdate
    t.Start()
    ()

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          SceneBackground (vec4 0.0 0.0 0.0 1.0)

          object "vertex2d" "fragment2d" [
            ObjectName "tri1"
            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor1 ]
            attribute "a_position" [ Values triangle1 ]
          ]
        ]
      ]
    
    (glcanvas, ignore)
  
  let sharedBasic () =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          shared "svertex2d" "sfragment2d" [
            uniform "time" [ Value 0.99 ]
            attribute "a_position" [ Values triangle2 ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri1"
            uniform "fillColor" [ Value fillColor2 ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri2"
            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor3 ]
            attribute "a_position" [ Values triangle3 ]
          ]
        ]
      ]
    
    (
      glcanvas,
      fun () ->
        match canvas.Scenes.[0].Shared with
        | None -> ()
        | Some shared ->
            let time = shared |> GlObj.getUniform "time"
            let tri2 = canvas.Scenes.[0] |> GlScene.getObject "tri2"
            let pos1 = shared |> GlObj.getAttribute "a_position"
            let pos2 = tri2 |> GlObj.getAttribute "a_position"
            GlUniform.setValue 0.55 time
            GlAttrib.setValue 2 botLeft.Values pos1
            GlAttrib.setValues triangle4 pos2
    )
  
  let interleaveShared () =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          shared "svertexInterleave" "sfragmentInterleave" [
            uniform "time" [ Value 0.99 ]

            interleave "a_position" [
              Values (interleaveData triangle5 fillColor4)
              child "fillColor" [ BaseType GlType.UNSIGNED_BYTE ]
            ]
          ]

          object "vertexInterleave" "fragmentInterleave" [
            ObjectName "tri1"
          ]

          object "vertexInterleave" "fragmentInterleave" [
            ObjectName "tri2"
            uniform "time" [ Value 0.99 ]

            interleave "a_position" [
              Values (interleaveData triangle6 fillColor5)
              child "fillColor" []
            ]
          ]
        ]
      ]
    
    (
      glcanvas,
      fun () ->
        match canvas.Scenes.[0].Shared with
        | None -> ()
        | Some shared ->
            let time = shared |> GlObj.getUniform "time"
            let tri2 = canvas.Scenes.[0] |> GlScene.getObject "tri2"
            let pos2 = tri2 |> GlObj.getAttribute "a_position"
            GlUniform.setValue 0.85 time
            GlAttrib.setValue 2 topRight.Values pos2
    )

  let uboBasic () =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          shared "svertexUbo" "sfragmentUbo" [
            ubo "uboShared" [
              u "time" [ Value 0.99 ]
              u "fillColor" [ Value fillColor6]
            ]

            attribute "a_position" [ Values triangle7 ]
          ]

          object "vertexUbo" "fragmentUbo" [
            ObjectName "tri1"
          ]

          object "vertexUbo" "fragmentUbo" [
            ObjectName "tri2"
            ubo "uboShared" [
              u "time" [ Value 0.99 ]
              u "fillColor" [ Value fillColor7]
            ]

            attribute "a_position" [
              Values triangle8
            ]
          ]
        ]
      ]
    
    (
      canvas,
      // ignore
      fun () ->
        match canvas.Scenes.[0].Shared with
        | None -> ()
        | Some shared ->
            let time1 = shared |> GlObj.getUniform "time"
            let tri2 = canvas.Scenes.[0] |> GlScene.getObject "tri2"
            let pos1 = shared |> GlObj.getAttribute "a_position"
            let pos2 = tri2 |> GlObj.getAttribute "a_position"
            let time2 = tri2 |> GlObj.getUniform "time"
            GlUniform.setValue 0.85 time1
            GlUniform.setValue 0.75 time2
            GlAttrib.setValue 2 [| 0.25; 0.5 |] pos1
            GlAttrib.setValue 2 [| 0.0; 0.5 |] pos2
    )

  // run basic
  // run sharedBasic
  // run interleaveShared
  run uboBasic
  ()

let testCapabilities () =
  let svertex2d = """#version 300 es
precision mediump float;
in vec2 a_position;
uniform float time;

void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 position = a_position;
  gl_Position = vec4(position, 0.0, 1.0);
  gl_Position *= time / time;
}"""

  let sfragment2d = """#version 300 es
precision mediump float;

uniform float time;

out vec4 glFragColor;

void main() {
  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);
  glFragColor *= time;
}"""

  let vertex2d = """#version 300 es
in vec2 a_position;

void main() {
  vec2 position = a_position;
  gl_Position = vec4(position, 0.0, 1.0);
}"""

  let fragment2d = """#version 300 es
precision mediump float;

uniform float time;
uniform vec4 fillColor;

out vec4 glFragColor;

void main() {
  glFragColor = fillColor;
  glFragColor *= fract(time);
}"""

  addVertexShaderSource "svertex2d" svertex2d
  addFragmentShaderSource "sfragment2d" sfragment2d
  addVertexShaderSource "vertex2d" vertex2d
  addFragmentShaderSource "fragment2d" fragment2d

  let run f =
    let (glcanvas, update) = f()
    let tri1 = glcanvas.Scenes.[0] |> GlScene.tryGetObject "tri1"
    let tri2 = glcanvas.Scenes.[0] |> GlScene.tryGetObject "tri2"
    GlCanvas.render 0.0 glcanvas
    glcanvas.Scenes.[0].Shared |> Option.call GlDebug.tableObjDef
    tri1 |> Option.call GlDebug.tableObjDef
    tri2 |> Option.call GlDebug.tableObjDef
    
    let doUpdate _ =
      jsLog "** ========================================== **"
      update()
      GlCanvas.render 0.0 glcanvas
  
    let t = new Timers.Timer(2000.0)
    t.AutoReset <- false
    t.Elapsed.Add doUpdate
    t.Start()
    ()

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        scene [
          SceneBackground (vec4 1.0 1.0 1.0 1.0)

          object "vertex2d" "fragment2d" [
            ObjectName "tri1"
            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor1 ]
            attribute "a_position" [ Values triangle1 ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri2"
            // cullBack
            cullFront

            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor2 ]
            attribute "a_position" [ Values (revTriangle triangle2) ]
          ]
        ]
      ]
    
    (canvas, ignore)
  
  run basic

let testCamera () =
  let svertex2d = """#version 300 es
precision mediump float;

uniform camera {
  mat4 projMat;
  mat4 viewMat;
};

uniform float time;

void main() {
  gl_Position = projMat * viewMat * vec4(0.0, 0.0, 0.0, 0.0);
  gl_Position *= time / time;
}"""

  let sfragment2d = """#version 300 es
precision mediump float;

uniform float time;

out vec4 glFragColor;

void main() {
  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);
  glFragColor *= time;
}"""

  let vertex2d = """#version 300 es
uniform camera {
  mat4 projMat;
  mat4 viewMat;
};

in vec2 a_position;

uniform mat4 modelMat;

void main() {
  vec2 pos = a_position;
  // pos = vec2(pos.x, 400.0 - pos.y);
  vec4 position = vec4(pos, 0.0, 1.0);
  position = projMat * viewMat * modelMat * position;
  // position = projMat * viewMat * position;
  // position = projMat * position;
  // position = viewMat * position;
  gl_Position = position;
}"""

  let fragment2d = """#version 300 es
precision mediump float;

uniform float time;
uniform vec4 fillColor;

out vec4 glFragColor;

void main() {
  glFragColor = fillColor;
  glFragColor *= fract(time);
}"""

  addVertexShaderSource "svertex2d" svertex2d
  addFragmentShaderSource "sfragment2d" sfragment2d
  addVertexShaderSource "vertex2d" vertex2d
  addFragmentShaderSource "fragment2d" fragment2d

  let center = vec2 100.0 100.0
  let topMid = vec2 100.0 0.0
  let topMid1 = vec2 -0.5 1.0
  let topMid2 = vec2 0.5 1.0
  let topLeft = vec2 0.0 0.0
  let left = vec2 0.0 100.0
  let botLeft = vec2 -1.0 -1.0
  let botMid = vec2 0.0 -1.0
  let botRight = vec2 1.0 -1.0
  let right = vec2 1.0 0.0
  let topRight = vec2 1.0 1.0

  let triangle1 = createTriangleData center topMid topLeft
  let triangle2 = createTriangleData center topLeft left

  let run f =
    let showUniforms (data: GlObjData) =
      let pinfo = data.ProgramInfo
      JS.console.table(pinfo.Uniforms |> Seq.collect getUniforms |> Array.ofSeq)

    let (glcanvas, update) = f()
    let scene = glcanvas.Scenes.[0] 
    let tri1 = scene |> GlScene.tryGetObject "tri1"
    let tri2 = scene |> GlScene.tryGetObject "tri2"
    jsLog $"{tri1.Value.ProgramInfo.ShaderSet.VertexShaderId}"
    GlCanvas.render 0.0 glcanvas
    scene.Shared |> Option.call GlDebug.tableObjDef
    tri1 |> Option.call GlDebug.tableObjDef
    tri2 |> Option.call GlDebug.tableObjDef
    scene.Shared |> Option.call showUniforms
    
    let doUpdate _ =
      jsLog "** ========================================== **"
      update()
      GlCanvas.render 0.0 glcanvas
  
    let t = new Timers.Timer(2000.0)
    t.AutoReset <- false
    t.Elapsed.Add doUpdate
    t.Start()
    ()

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        NoAlpha

        scene [
          shared "svertex2d" "sfragment2d" [
            ubo "camera" [
              u "projMat" [  Value (Mat4.Create().Values) ]
              u "viewMat" [  Value (Mat4.Create().Values) ]
            ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri1"
            cullBack
            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor1 ]
            attribute "a_position" [ Values triangle1 ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri2"
            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor2 ]
            attribute "a_position" [ Values (revTriangle triangle2) ]
          ]
        ]
      ]
    
    (
      canvas,
      //ignore
      fun () ->
        let scene = GlCanvas.getSceneByIndex 0 canvas
        let tri1 = GlScene.getObject "tri1" scene
        let modelMatrix = tri1.ModelMatrix
        modelMatrix.TranslateM(100.0, 100.0, 0.0)
        modelMatrix.RotateZM(-10.0<rad> * Math.PI / 180.0)
        modelMatrix.TranslateM(-100.0, -100.0, 0.0)
        GlCommon.dirtyObject tri1
        jsLog $"canvas isDirty {canvas.IsDirty}"
        ()
    )
  
  run basic

let testTexture () =
  let svertex2d = """#version 300 es
precision mediump float;

uniform camera {
  mat4 projMat;
  mat4 viewMat;
};

in vec2 a_texcoords;

uniform float time;

void main() {
  gl_Position = projMat * viewMat * vec4(0.0, 0.0, 0.0, 0.0);
  gl_Position *= time / time;
  gl_Position *= vec4(a_texcoords / a_texcoords, 1.0, 1.0);
}"""

  let sfragment2d = """#version 300 es
precision mediump float;

uniform float time;

out vec4 glFragColor;

void main() {
  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);
  glFragColor *= time;
}"""

  let vertex2d = """#version 300 es
uniform camera {
  mat4 projMat;
  mat4 viewMat;
};

in vec2 a_position;
in vec2 a_texcoords;

uniform mat4 modelMat;

out vec2 v_texcoords;

void main() {
  vec2 pos = a_position;
  // pos = vec2(pos.x, 400.0 - pos.y);
  vec4 position = vec4(pos, 0.0, 1.0);
  position = projMat * viewMat * modelMat * position;
  // position = projMat * viewMat * position;
  // position = projMat * position;
  // position = viewMat * position;
  gl_Position = position;
  v_texcoords = a_texcoords;
}"""

  let fragment2d = """#version 300 es
precision mediump float;

uniform float time;
uniform vec4 fillColor;
uniform sampler2D u_texture1;

in vec2 v_texcoords;

out vec4 glFragColor;

void main() {
  glFragColor = fillColor;
  glFragColor *= fract(time);
  glFragColor = texture(u_texture1, v_texcoords);
}"""

  addVertexShaderSource "svertex2d" svertex2d
  addFragmentShaderSource "sfragment2d" sfragment2d
  addVertexShaderSource "vertex2d" vertex2d
  addFragmentShaderSource "fragment2d" fragment2d

  let center = vec2 100.0 100.0
  let topMid = vec2 100.0 0.0
  let topMid1 = vec2 50.0 0.0
  let topMid2 = vec2 150.0 0.0
  let topLeft = vec2 0.0 0.0
  let left = vec2 0.0 100.0
  let botLeft = vec2 0.0 200.0
  let botMid = vec2 100.0 200.0
  let botRight = vec2 200.0 200.0
  let right = vec2 200.0 100.0
  let topRight = vec2 1.0 1.0

  let triangle1 = createTriangleData center topMid topLeft
  let triangle2 = createTriangleData center topLeft left
  let triangle3 = createTriangleData center left botLeft
  let triangle4 = createTriangleData center botLeft botMid
  let triangle5 = createTriangleData center botMid botRight
  let triangle6 = createTriangleData center botRight right

  let run f =
    let showUniforms (data: GlObjData) =
      let pinfo = data.ProgramInfo
      JS.console.table(pinfo.Uniforms |> Seq.collect getUniforms |> Array.ofSeq)

    let (glcanvas, update) = f()
    let scene = glcanvas.Scenes.[0] 
    let tri1 = scene |> GlScene.tryGetObject "tri1"
    let tri2 = scene |> GlScene.tryGetObject "tri2"
    GlCanvas.render 0.0 glcanvas
    scene.Shared |> Option.call GlDebug.tableObjDef
    tri1 |> Option.call GlDebug.tableObjDef
    tri2 |> Option.call GlDebug.tableObjDef
    scene.Shared |> Option.call showUniforms
    
    let doUpdate _ =
      jsLog "** ========================================== **"
      update()
      GlCanvas.render 0.0 glcanvas
  
    let t = new Timers.Timer(2000.0)
    t.AutoReset <- false
    t.Elapsed.Add doUpdate
    t.Start()
    ()

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        NoAlpha
        PixelStorage UNPACK_FLIP_Y_WEBGL

        scene [
          orthoCam2d [
            CameraName "cam"
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          shared "svertex2d" "sfragment2d" [
            ubo "camera" [
              u "projMat" [  Value (Mat4.Create().Values) ]
              u "viewMat" [  Value (Mat4.Create().Values) ]
            ]

            attribute "a_texcoords" [
              Values [|
                1.0; 0.0
                1.0; 1.0
                0.0; 1.0

                1.0; 0.0
                0.0; 1.0
                0.0; 0.0
              |]
            ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri1"
            cullBack
            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor1 ]
            attribute "a_position" [ Values (Array.append triangle1 triangle2) ]
            // texture "tex1" []
            texture [ TextureName "tex1"; pixelImageId "star" ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri2"
            cullBack
            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor2 ]
            attribute "a_position" [ Values (Array.append triangle3 triangle4) ]
            texture [
              TextureName "tex1"
              TextureWidth 1.0
              TextureHeight 1.0
              pixelDataUint8 [| 255; 0; 0; 255 |]
            ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri3"
            cullBack
            uniform "time" [ Value 0.99 ]
            uniform "fillColor" [ Value fillColor1 ]
            // attribute "a_position" [ Values (Array.append triangle5 triangle6) ]
            attribute "a_position" [ Values triangle5 ]
            texture [ TextureName "tex1" ]
            // texture [ TextureName "tex1"; pixelImageId "star" ]
          ]
        ]
      ]
    
    (
      canvas,
      //ignore
      fun () ->
        let scene = GlCanvas.getSceneByIndex 0 canvas
        let tri1 = GlScene.getObject "tri1" scene
        let modelMatrix = tri1.ModelMatrix
        modelMatrix.TranslateM(100.0, 100.0, 0.0)
        modelMatrix.RotateZM(-10.0<rad> * Math.PI / 180.0)
        modelMatrix.TranslateM(-100.0, -100.0, 0.0)
        GlObj.dirty tri1
        ()
    )
  
  jsLog "testTexture.basic"; run basic

let testWorld () =
  let svertex2d = """#version 300 es
#include precision
#include camera-ubo
#include vertex-texture2d0
// #include time

void main() {
  gl_Position = projMat * viewMat * vec4(0.0, 0.0, 0.0, 0.0);
// #include use-vertex-time
#include use-vertex-texture2d0
}"""

  let sfragment2d = """#version 300 es
#include precision
#include fragment-texture2d0
// #include time
#include out-color

void main() {
  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);
// #include use-fragment-time
#include use-fragment-texture2d0
}"""

  let vertex2d = """#version 300 es
#include camera-ubo
#include model-params
#include vertex-texture2d0

in vec2 a_position;

void main() {
  vec2 pos = a_position;
  vec4 position = vec4(pos, 0.0, 1.0);
  position = projMat * viewMat * modelMat * position;
  gl_Position = position;
  v_texCoords0 = a_texCoords0;
}"""

  let fragment2d = """#version 300 es
#include precision
#include out-color
#include fragment-texture2d0

void main() {
  glFragColor = texture(u_texture0, v_texCoords0);
}"""

  addVertexShaderSource "svertex2d" svertex2d
  addFragmentShaderSource "sfragment2d" sfragment2d
  addVertexShaderSource "vertex2d" vertex2d
  addFragmentShaderSource "fragment2d" fragment2d

  let viewport = boundsSize myCanvas.width myCanvas.height
  let worldBounds = boundsCenter 0.0 0.0 viewport.Width viewport.Height

  let quad = boundsCenterV (vec2 0.0 0.0) worldBounds.Size |> boundsToTriangles ||> Array.append
  let quad2 = boundsCenterV (vec2 0.0 0.0) (worldBounds.HalfSize * 0.5) |> boundsToTriangles ||> Array.append

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        CanvasWidth 400.0
        CanvasHeight 400.0
        NoAlpha
        PixelStorage UNPACK_FLIP_Y_WEBGL

        scene [
          SceneWorldBounds worldBounds

          orthoCam2d [
            CameraName "cam"
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          shared "svertex2d" "sfragment2d" [
            attribute "a_texCoords0" [
              Values [|
                0.0; 0.0;   1.0; 0.0;   1.0; 1.0
                0.0; 0.0;   1.0; 1.0;   0.0; 1.0
              |]
            ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri1"
            cullBack
            position2dv worldBounds.Center
            attribute "a_position" [ Values quad ]
            texture [
              TextureName "tex1"
              pixelImageId "star"
              ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "tri2"
            cullBack
            position2dv worldBounds.Quadrant1.Center
            Scale 0.25
            attribute "a_position" [
              AttributeLink "tri1.a_position"
            ]
            texture [
              // TextureName "tex1"
              TextureLink "tri1.tex1"
              MinFilter GlMinFilter.LINEAR
            ]
          ]
        ]
      ]
    
    let update _ = ()
    (canvas, update, false, 60 * 5)

  let grid () =
    let canvas =
      glcanvas "myCanvas" [
        CanvasWidth 400.0
        CanvasHeight 400.0
        NoAlpha
        PixelStorage UNPACK_FLIP_Y_WEBGL

        scene [
          SceneWorldBounds worldBounds

          orthoCam2d [
            CameraName "cam"
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          shared "svertex2d" "sfragment2d" [
            attribute "a_texCoords0" [
              Values [|
                0.0; 0.0;   1.0; 0.0;   1.0; 1.0
                0.0; 0.0;   1.0; 1.0;   0.0; 1.0
              |]
            ]
          ]

          object "vertex2d" "fragment2d" [
            ObjectName "grid"
            cullBack
            position2dv worldBounds.Center
            attribute "a_position" [ Values quad ]
            texture [ ]
          ]
        ]
      ]
    
    let update _ = ()
    (canvas, update, false, 60 * 5)

  jsLog "testWorld.basic"; run basic
  jsLog "testWorld.grid"; run grid

let testGrid () =
  let gridUbo = """
uniform grid {
  vec4 lineColor;
  float lineWidth;
  float axisLineWidth;
  vec2 size;
  ivec2 axisDim;
};
"""

  let svertex2d = """#version 300 es
#include precision
#include camera-ubo
// #include grid-ubo

void main() {
  gl_Position = projMat * viewMat * vec4(0.0, 0.0, 0.0, 0.0);
}"""

  let sfragment2d = """#version 300 es
#include precision
#include out-color

void main() {
  glFragColor = vec4(0.0, 0.0, 0.0, 0.0);
}"""

  let grid2Drect = """#version 300 es
#include camera-ubo
#include grid-ubo
#include model-params
#include vec2
#include lines2d-vertex

// x, y: point.  z, w: Adjustment (x, y) for line start point.
const vec4 cornerTemplate[] = vec4[4](
  vec4(-0.5, -0.5, -0.5, 0.0),
  vec4(0.5, -0.5, 0.0, -0.5),
  vec4(0.5, 0.5, 0.5, 0.0),
  vec4(-0.5, 0.5, 0.0, 0.5)
);

const ivec2 abTemplate[] = ivec2[4](
  ivec2(0, 1),
  ivec2(1, 2),
  ivec2(2, 3),
  ivec2(3, 0)
);

out vec4 v_fillColor;

void main() {
  #line 1987
  vec2 halfSize = size * 0.5;
  vec2 cellSize = halfSize / vec2(axisDim);
  ivec2 count = axisDim * 2;
  int instanceCount = int(count.x * count.y);
  vec2 start = -cellSize * 0.5 - vec2(axisDim - 1) * cellSize;

  int cornerID = gl_VertexID / 6;
  int vertexID = gl_VertexID % 6;
  ivec2 colRow = ivec2(gl_InstanceID % count.x, gl_InstanceID / count.x);
  vec2 center = start + vec2(colRow) * cellSize;
  ivec2 ab = abTemplate[cornerID];
  vec2 a = cornerTemplate[ab.x].xy * cellSize + cornerTemplate[ab.x].zw * lineWidth;
  vec2 b = cornerTemplate[ab.y].xy * cellSize;
  vec2 vertex = line2D(a, b, lineWidth, vertexID);
  vertex += center;
  vec4 position = vec4(vertex, 0.0, 1.0);

  position = projMat * viewMat * modelMat * position;

  gl_Position = position;
  v_fillColor = lineColor;
}"""

  let grid2Dline = """#version 300 es
#include camera-ubo
#include grid-ubo
#include model-params
#include vec2
#include lines2d-vertex

// x, y: point a.  z, w: point b.
const vec4 edgeTemplate[] = vec4[2](
  vec4(0.0, -0.5, 0.0, 0.5), // Vertical
  vec4(-0.5, 0.0, 0.5, 0.0)  // Horizontal
);

const vec2 offsetTemplate[] = vec2[2](
  vec2(1.0, 0.0), // Vertical
  vec2(0.0, 1.0)  // Horizontal
);

out vec4 v_fillColor;

float isEqual(int value, int base) { return step(float(base), float(value)) * step(float(value), float(base)); }

void main() {
#line 2034
  vec2 halfSize = size * 0.5;
  vec2 cellSize = halfSize / vec2(axisDim);
  ivec2 count = axisDim * 2 + 1;
  int instanceCount = count.x + count.y;
  vec2 start = -vec2(axisDim) * cellSize;
  int edgeID = int(step(float(count.x), float(gl_InstanceID)));
  vec4 edge = edgeTemplate[edgeID];
  vec2 ofs = offsetTemplate[edgeID];

  vec2 a = edge.xy * size;
  vec2 b = edge.zw * size;

  int vertexID = gl_VertexID % 6;
  ivec2 colRow = ivec2(gl_InstanceID % count.x);
  colRow.y = gl_InstanceID - count.x;
  vec2 isAxisv = vec2(isEqual(colRow.x, axisDim.x), isEqual(colRow.y, axisDim.y));
  vec2 center = start + vec2(colRow) * cellSize;
  center *= ofs;
  float isAxis = isAxisv.x * ofs.x + isAxisv.y * ofs.y;
  float width = mix(lineWidth, axisLineWidth, isAxis);
  vec2 vertex = line2D(a, b, width, vertexID);
  vertex += center;
  vec4 position = vec4(vertex, 0.0, 1.0);

  position = projMat * viewMat * modelMat * position;

  gl_Position = position;
  v_fillColor = lineColor;
}"""

  let fragment2d = """#version 300 es
#include precision
#include out-color

in vec4 v_fillColor;

void main() {
  glFragColor = v_fillColor;
}"""

  addShaderInclude "grid-ubo" gridUbo

  addVertexShaderSource "svertex2d" svertex2d
  addFragmentShaderSource "sfragment2d" sfragment2d
  addVertexShaderSource "grid2Drect" grid2Drect
  addVertexShaderSource "grid2Dline" grid2Dline
  addFragmentShaderSource "fragment2d" fragment2d

  let viewport = boundsSize myCanvas.width myCanvas.height
  let worldBounds = boundsCenter 0.0 0.0 viewport.Width viewport.Height

  let size = worldBounds.Size * vec2 0.8 0.8
  let halfSize = size * 0.5
  let sx = halfSize / Vec2.Create(2.0, 2.0)
  let cellSize = sx
  let halfCount = vec2 (ceil <| halfSize.X / cellSize.X) (ceil <| halfSize.Y / cellSize.Y)
  let count = halfCount * 2.0
  let colCount = int count.X
  let rowCount = int count.Y
  let vertexCount = 24
  let instanceCount = colCount * rowCount
  let lineVertexCount = 6
  let lineInstanceCount = colCount + rowCount + 2
  jsLog $"cellSize: {cellSize}"
  jsLog $"halfCount: {halfCount}"
 
  let grid () =
    let canvas =
      glcanvas "myCanvas" [
        WorldBounds worldBounds
        NoAlpha
        PixelStorage UNPACK_FLIP_Y_WEBGL

        scene [
          Layers 2
          DefaultLayer 1

          orthoCam2d [
            CameraName "cam"
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          shared "svertex2d" "sfragment2d" [
          ]

          object "grid2Drect" "fragment2d" [
            ObjectName "gridRect"
            Layer 0
            VertexCount vertexCount
            InstanceCount instanceCount
            cullBack
            ubo "grid" [
              u "lineColor" [ Value (vec4 0.0 0.0 1.0 1.0).Values ]
              u "lineWidth" [ Value 1.0 ]
              u "axisLineWidth" [ Value 3.0 ]
              u "size" [ Value size.Values ]
              u "axisDim" [ Value [| int halfCount.X; int halfCount.Y |] ]
            ]
          ]

          object "grid2Dline" "fragment2d" [
            ObjectName "gridLine"
            VertexCount lineVertexCount
            InstanceCount lineInstanceCount
            cullBack
            ubo "grid" [
              u "lineColor" [ Value (vec4 0.0 0.0 0.0 1.0).Values ]
              u "lineWidth" [ Value 1.0 ]
              u "axisLineWidth" [ Value 3.0 ]
              u "size" [ Value size.Values ]
              u "axisDim" [ Value [| int halfCount.X; int halfCount.Y |] ]
            ]
          ]
        ]
      ]
    
    let update _ = ()
    (canvas, update, false, 2)

  jsLog "testGrid.grid"; run grid

let testGridObject () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let dim = 34.0
  let worldBounds = boundsCenterHalf 0.0 0.0 dim dim
  let worldScale = viewport.HalfSize.X / dim

  let grid () =
    let canvas =
      glcanvas "myCanvas" [
        WorldBounds worldBounds
        NoAlpha

        scene [
          WorldScale worldScale
          Layers 3
          DefaultLayer 1

          orthoCam2d [
            CameraName "cam"
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          sharedObjectWithCamera2d
        ]
      ]

    let renderer = GlRenderer()
    let scene = canvas.Scenes.[0]
    // let grid = Grid2D(scene, worldBounds.Size * 0.8, 2)
    let grid = renderer.Grid2D(scene, worldBounds.Size - 4.0, 2)
    // grid.MinorLineWidth <- 1.0
    // grid.MinorLineColor <- vec4 0.0 0.0 1.0 1.0
    // let v = VectorObject2D(scene, vec2 1.0 1.0)
    // v.Position2 <- vec2 0.1 0.0

    let update (time: float) =
      // let fracTime = Math.Ceiling(time) - time
      // let angle = Math.Sin(time * 3.0 / 2.0) * Math.PI
      // grid.AngleZ <- abs angle |> radians
      // grid.LineWidth <- time % 10.0 + 1.0
      // v.LineWidth <- grid.LineWidth
      grid.MinorTick <- time % 5.0 + 1.0
      // grid.MinorTick <- 3 - grid.MinorTick
      ()

    (canvas, update, false, 60 * 2)

  jsLog "testGridObject.grid"; run grid

let testParallax () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let halfDim = 34.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenterHalf 0.0 0.0 dim dim
  let worldScale = viewport.HalfSize.X / halfDim

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        WorldBounds worldBounds
        NoAlpha

        scene [
          WorldScale worldScale
          Layers 3
          DefaultLayer 1

          orthoCam2d [
            CameraName "cam"
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          orthoCam2d [
            CameraName "cam2"
            ViewportBounds viewport.Quadrant1
            CameraBackground <| vec4 0.4 0.4 0.0 0.1
            BorderWidth 10.0
          ]

          sharedObjectWithCamera2d
        ]
      ]

    let renderer = GlRenderer()
    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    let cam2 = scene |> GlScene.getCamera "cam2"
    let grid = renderer.Grid2D(scene, worldBounds.Size - 2.0, 2, "", "", "cam", 4.5)
    let v1 = renderer.Vector2D(scene, vec2 5.0 -10.0, -1, "v1", "", "cam", 2.1)
    let v2 = renderer.Vector2D(scene, vec2 10.0 10.0, -1, "v2", "", "cam", 1.0)
    v1.Position <- Vec3.Create(v2.Vector, 0.0) // vec3 5.0 12.0 0.0
    v1.LineWidth <- 8.0
    v2.LineWidth <- 10.0
    v2.StrokeColor <- vec4 0.3 0.0 0.5 1.0
    let mutable angle = 0.0

    let update (time: float) =
      let maxView = (worldBounds.Size - cam.ViewSize) * 0.5
      angle <- angle + 3.0
      if angle > 360.0 then angle <- angle - 360.0
      let sin = Math.Sin(angle * (Math.PI / 180.0))
      let x = sin * maxView.X
      cam |> GlCamera.panToXY x 0.0
      ()

    (canvas, update, true, 60 * 10)

  jsLog "testParallax.basic"; run basic

let testLink () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let halfDim = 16.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenter 0.0 0.0 dim dim

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        WorldBounds worldBounds
        NoAlpha

        scene [
          WorldScale 5.0
          Layers 3
          DefaultLayer 1

          orthoCam2d [
            CameraName "cam"
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          sharedObjectWithCamera2d
        ]
      ]

    let renderer = GlRenderer()
    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    let v1 = renderer.Vector2D(scene, vec2 5.0 5.0, -1, "v1", "")
    let v2 = renderer.Vector2D(scene, vec2 5.0 -5.0, -1, "v2", "v1")
    let v3 = renderer.Vector2D(scene, vec2 5.0 5.0, -1, "v3", "v2")
    // v1.ObjectDef.LinkedChildren |> List.iter (fun c -> jsLog $"{c.Name}")
    v1.LineWidth <- 3.0
    v1.StrokeColor <- vec4 0.3 0.0 0.5 1.0
    v2.Position <- Vec3.Create(v1.Vector, 0.0)
    v2.LineWidth <- 3.0
    v3.Position <- Vec3.Create(v2.Vector, 0.0)
    v3.LineWidth <- 3.0
    let mutable angle = 0.0

    let update (time: float) =
      let maxView = (worldBounds.Size - cam.ViewSize) * 0.5
      angle <- angle + 3.0
      if angle > 360.0 then angle <- angle - 360.0
      let sin = Math.Sin(angle * (Math.PI / 180.0))
      v1.Scale <- sin |> abs |> (+) 0.3
      v1.AngleDegreesZ <- angle |> degrees
      v2.AngleDegreesZ <- sin * 360.0 |> degrees
      v3.Scale <- 1.6 - sin |> abs |> (+) 0.3
      ()

    (canvas, update, false, 60 * 10)

  jsLog "testLink.basic"; run basic

let testLine () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let ofs = 0.0
  let ofs2 = ofs * 2.0
  let viewport = bounds ofs ofs (myCanvas.width - ofs2) (myCanvas.height - ofs2)
  let halfDim = 3.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenter 0.0 0.0 dim dim
  let worldScale = viewport.HalfSize.X / halfDim

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        WorldBounds worldBounds
        NoAlpha

        scene [
          WorldScale worldScale
          Layers 3
          DefaultLayer 1

          orthoCam2d [
            CameraName "cam"
            ViewportBounds viewport
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          sharedObjectWithCamera2d
        ]
      ]

    let renderer = GlRenderer()
    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    let grid = renderer.Grid2D(scene, worldBounds.Size - 0.0, 2)
    let line1 = renderer.Line2D(scene, vec2 0.0 0.5, vec2 2.0 1.5)
    let line2 = renderer.Line2D(scene, vec2 2.0 -2.0, vec2 1.0 -1.0)
    let line3 = renderer.Line2D(scene, vec2 -1.5 -2.0, vec2 -0.5 -1.0)
    line1.LineWidth <- worldScale
    line1.StrokeColor <- vec4 0.0 0.0 1.0 1.0
    line1.LineCap <- LineCap.Round
    line2.LineWidth <- worldScale * 0.5
    line2.LineCap <- LineCap.Square
    line3.LineWidth <- worldScale * 0.25
    jsLog $"worldScale {worldScale}"
    let mutable angle = 0.0

    let update (time: float) =
      angle <- angle + 3.0
      if angle > 360.0 then angle <- angle - 360.0
      let sin = Math.Sin(angle * (Math.PI / 180.0))
      ()

    (canvas, update, false, 60 * 10)

  jsLog "testLine.basic"; run basic

let testLinePath () =
  let viewport = boundsSize myCanvas.width myCanvas.height
  let ofs = 0.0
  let ofs2 = ofs * 2.0
  let viewport = bounds ofs ofs (myCanvas.width - ofs2) (myCanvas.height - ofs2)
  let halfDim = 3.0
  let dim = halfDim * 2.0
  let worldBounds = boundsCenter 0.0 0.0 dim dim
  let worldScale = viewport.HalfSize.X / halfDim

  let basic () =
    let canvas =
      glcanvas "myCanvas" [
        WorldBounds worldBounds
        NoAlpha

        scene [
          WorldScale worldScale
          Layers 3
          DefaultLayer 1

          orthoCam2d [
            CameraName "cam"
            ViewportBounds viewport
            CameraBackground <| vec4 0.0 0.4 0.4 0.1
            BorderWidth 10.0
          ]

          sharedObjectWithCamera2d
        ]
      ]

    let renderer = GlRenderer()
    let scene = canvas.Scenes.[0]
    let cam = scene.Cameras.Head
    let grid = renderer.Grid2D(scene, worldBounds.Size - 0.0, 2, "grid")
    let path1 = renderer.LinePath2D(scene, [|
      vec2 -2.0 0.0
      vec2 -0.5 1.5
      vec2 0.5 0.0
      vec2 2.3 1.5
    |], -1, "path1")
    let path2 = renderer.LinePath2D(scene, [|
      vec2 2.3 -2.5
      vec2 0.5 -1.0
      vec2 -0.5 -2.5
      vec2 -2.0 -1.0
    |], -1, "path2")
    path1.Add(vec2 2.5 0.0)
    path2.Add([| vec2 -1.5 -2.5; vec2 -2.8 -2.0 |])
    path2.Set(0, vec2 2.8 -2.5)
    let join = LineJoin.Miter
    path1.LineWidth <- worldScale * 0.8
    path1.StrokeColor <- vec4 0.0 0.0 1.0 0.4
    path1.LineCap <- LineCap.Round
    path1.LineJoin <- join
    path1.MiterLimit <- 100.0 + 0.5 * path1.LineWidth
    path2.LineWidth <- worldScale * 0.3
    path2.StrokeColor <- vec4 1.0 0.0 0.0 0.1
    path2.LineCap <- LineCap.Butt
    path2.LineJoin <- join
    path2.MiterLimit <- 100.0 + 0.5 * path2.LineWidth
    let mutable angle = 0.0

    let update (time: float) =
      angle <- angle + 3.0
      if angle > 360.0 then angle <- angle - 360.0
      let sin = Math.Sin(angle * (Math.PI / 180.0))
      ()

    (canvas, update, false, 60 * 10)

  jsLog "testLinePath.basic"; run basic

let runTests() =
  // testc ()
  // testScene ()
  // testCapabilities ()
  // testCamera ()
  // testTexture ()
  // testGrid ()
  // testGridObject ()
  // testParallax ()
  // testLink ()
  // testLine ()
  // testw ()
  testLinePath ()

if star.complete then
  runTests()
else
  star.onload <- fun _ -> runTests()
