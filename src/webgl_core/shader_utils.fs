namespace Wil.Webgl.Core

[<AutoOpenAttribute>]
module WebglShaderUtils =
  open System.Text.RegularExpressions
  open Wil.Core.Utils
  open Wil.Js
  open Wil.Webgl.Types

  type ShaderSources () =
    let mutable vertexSources = new Map<string, string>([])
    let mutable fragmentSources = new Map<string, string>([])

    member _.VertexSources with get() = vertexSources
    member _.FragmentSources with get() = fragmentSources

    member _.VertexSource with get(name) =
      match Map.tryFind name vertexSources with
      | Some source -> source
      | None -> raise (exn $"Vertex source '{name}' has not been registered")

    member _.FragmentSource with get(name) =
      match Map.tryFind name fragmentSources with
      | Some source -> source
      | None -> raise (exn $"Fragment source '{name}' has not been registered")

    member _.AddVertexSource(name, source) = vertexSources <- vertexSources.Add(name, source)
    member _.AddFragmentSource(name, source) = fragmentSources <- fragmentSources.Add(name, source)

  let mutable private shaderIncludes = Map.empty

  let addShaderInclude (name: string) (text: string) = shaderIncludes <- shaderIncludes.Add(name, text)
  let removeShaderInclude name = shaderIncludes <- shaderIncludes.Remove(name)

  let getShaderInclude name =
    match shaderIncludes |> Map.tryFind name with
    | Some text -> text
    | None -> throw $"Shader include '{name}' not found"

  let private processIncludes text =
    let mutable replaced = Set([])

    let rec loop text =
      let replaceInclude (m: Match) =
        let name = (m.Groups.Item 1).Value

        match replaced.Contains name with
        | true -> ""
        | false ->
            replaced <- replaced.Add name

            let newText =
              let t = getShaderInclude name
              if Regex.Match(t, "\r?\n$").Success then t else t + "\n"

            newText |> loop

      Regex.Replace(text, "^#include\s+(.+)(?:\r?\n)", MatchEvaluator(replaceInclude), RegexOptions.Multiline)

    let replaceMultipleBlankLines text =
      Regex.Replace(text, "^(\s*\r?\n){2,}", "\r\n", RegexOptions.Multiline)

    text
    |> loop
    // |> replaceMultipleBlankLines

  let private shaderSources = ShaderSources()

  let addVertexShaderSource name source =
    shaderSources.AddVertexSource(name, source)

  let addFragmentShaderSource name source =
    shaderSources.AddFragmentSource(name, source)

  // let getVertexShaderSource name = shaderSources.VertexSource(name) |> processIncludes
  // let getFragmentShaderSource name = shaderSources.FragmentSource(name) |> processIncludes

  let getVertexShaderSource name =
    let res = shaderSources.VertexSource(name) |> processIncludes
    Debug.logIndent $"Vertex shader {name}"
    Debug.log $"{res}"
    Debug.popIndent()
    res

  let getFragmentShaderSource name =
    let res = shaderSources.FragmentSource(name) |> processIncludes
    Debug.logIndent $"Fragment shader {name}"
    Debug.log $"{res}"
    Debug.popIndent()
    res

  let createShader (gl: GL) typ source =
    let shader = gl.createShader typ
    gl.shaderSource(shader, source)
    gl.compileShader shader
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) :?> bool

    if success then
      shader
    else
      let msg = sprintf "%s" <| gl.getShaderInfoLog(shader)
      gl.deleteShader shader
      raise <| exn msg

[<AutoOpen>]
module private DefaultValues =
  let addInclude (key, source) = addShaderInclude key source
  let addVertex (key, source) = addVertexShaderSource key source
  let addFragment (key, source) = addFragmentShaderSource key source

  [
    ("precision", """
precision mediump float;""")

    ("out-color-fragment", """
out vec4 glFragColor;""")

    ("init-color", """
  vec4 color = v_fillColor;""")

    ("set-out-color", """
  glFragColor = color;""")

    ("transparent-color", """
vec4 transparent = vec4(0.0);""")

    ("path-params", """
uniform pathParams {
  vec4 strokeColor;
  vec4 fillColor;
  float lineWidth;
};""")

    ("path-outvars", """
flat out float v_scale;
flat out float v_aliasWidth;
out vec4 v_fillColor;
out vec4 v_strokeColor;
flat out float v_strokeWidth;""")

    ("path-invars", """
flat in float v_scale;
flat in float v_aliasWidth;
in vec4 v_fillColor;
in vec4 v_strokeColor;
flat in float v_strokeWidth;""")

    ("global-ubo", """
uniform global {
  vec2 resolution;
  vec2 mouse;
  float time;
  float worldScale;
};""")

    ("camera-ubo", """
uniform camera {
  vec4 viewport;
  mat4 projMat;
  mat4 viewMat;
  float zoom;
};""")

    ("model-params", """
uniform model {
  mat4 modelMat;
};
// uniform mat4 modelMat;""")

    ("coordinate-conversion-vertex", """
#include global-ubo
#include camera-ubo
#include model-params

vec4 toVec4(vec2 p) { return vec4(p, 0.0, 1.0); }
vec4 toVec4(vec3 p) { return vec4(p, 1.0); }
vec4 modelToClip(vec2 p) { return projMat * viewMat * modelMat * toVec4(p); }
vec4 modelToClip(vec3 p) { return projMat * viewMat * modelMat * vec4(p, 1.0); }
vec4 modelToClip(vec4 p) { return projMat * viewMat * modelMat * p; }
vec4 worldToClip(vec4 p) { return projMat * viewMat * p; }
vec3 clipToNDC(vec4 p) { return p.xyz / p.w; }
vec3 modelToNDC(vec2 p) { return clipToNDC(modelToClip(p)); }
vec3 modelToNDC(vec3 p) { return clipToNDC(modelToClip(p)); }
vec3 modelToNDC(vec4 p) { return clipToNDC(modelToClip(p)); }
vec4 modelToWorld(vec2 p) { return modelMat * toVec4(p); }
vec4 modelToWorld(vec3 p) { return modelMat * toVec4(p); }
vec4 modelToWorld(vec4 p) { return modelMat * p; }
vec4 modelToEye(vec2 p) { return viewMat * modelMat * toVec4(p); }
vec4 modelToEye(vec3 p) { return viewMat * modelMat * toVec4(p); }
vec4 modelToEye(vec4 p) { return viewMat * modelMat * p; }

vec2 ndcToScreen(vec3 p) {
  // float y = resolution.x - viewport.y;
  // return (p.xy * 0.5 + 0.5) * viewport.zw + vec2(viewport.x, y);
  return (p.xy * 0.5 + 0.5) * viewport.zw + viewport.xy;
}

vec2 modelToScreen(vec2 p) { return ndcToScreen(modelToNDC(p)); }
vec2 modelToScreen(vec3 p) { return ndcToScreen(modelToNDC(p)); }
vec2 modelToScreen(vec4 p) { return ndcToScreen(modelToNDC(p)); }
vec2 clipToScreen(vec4 p) { return ndcToScreen(clipToNDC(p)); }
vec2 worldToScreen(vec4 p) { return clipToScreen(worldToClip(p)); }
  """)

    ("mixes", """
int mix(int a, int b, float t) { return int(mix(float(a), float(b), t)); }
bool mix(bool a, bool b, float t) { return bool(mix(float(a), float(b), t)); }""")

    ("comparisons", """
// step(edge, value)
//   if value < edge then 0 else 1
//   if value >= edge then 1 else 0
//
//   if edge > value then 0 else 1
//   if edge <= value then 1 else 0
//
float isGreater(float value, float base) { return 1.0 - step(value, base); }
float isGreater(int value, int base) { return 1.0 - step(float(value), float(base)); }

float isGreaterOrEqual(float value, float base) { return step(base, value); }
float isGreaterOrEqual(int value, int base) { return step(float(base), float(value)); }

float isLess(float value, float base) { return 1.0 - step(base, value); }
float isLess(int value, int base) { return 1.0 - step(float(base), float(value)); }

float isLessOrEqual(float value, float base) { return step(value, base); }
float isLessOrEqual(int value, int base) { return step(float(value), float(base)); }

float isEqual(float value, float base) { return step(base, value) * step(value, base); }
float isEqual(int value, int base) { return step(float(base), float(value)) * step(float(value), float(base)); }""")

    ("conditionals", """
bool boolIif[2];
int intIif[2];
float floatIif[2];
vec2 vec2Iif[2];
vec3 vec3Iif[2];
vec4 vec4Iif[2];

bool iif(bool condition, bool thenValue, bool elseValue) {
  boolIif[0] = elseValue;
  boolIif[1] = thenValue;
  return boolIif[int(condition)];
}

int iif(bool condition, int thenValue, int elseValue) {
 intIif[0] = elseValue;
  intIif[1] = thenValue;
  return intIif[int(condition)];
}

float iif(bool condition, float thenValue, float elseValue) {
  floatIif[0] = elseValue;
  floatIif[1] = thenValue;
  return floatIif[int(condition)];
}

vec2 iif(bool condition, vec2 thenValue, vec2 elseValue) {
  vec2Iif[0] = elseValue;
  vec2Iif[1] = thenValue;
  return vec2Iif[int(condition)];
}

vec3 iif(bool condition, vec3 thenValue, vec3 elseValue) {
  vec3Iif[0] = elseValue;
  vec3Iif[1] = thenValue;
  return vec3Iif[int(condition)];
}

vec4 iif(bool condition, vec4 thenValue, vec4 elseValue) {
  vec4Iif[0] = elseValue;
  vec4Iif[1] = thenValue;
  return vec4Iif[int(condition)];
}

bool iif(float condition, bool thenValue, bool elseValue) {
  boolIif[0] = elseValue;
  boolIif[1] = thenValue;
  return boolIif[int(clamp(condition, 0.0, 1.0))];
}

int iif(float condition, int thenValue, int elseValue) {
  intIif[0] = elseValue;
  intIif[1] = thenValue;
  return intIif[int(clamp(condition, 0.0, 1.0))];
}

float iif(float condition, float thenValue, float elseValue) {
  floatIif[0] = elseValue;
  floatIif[1] = thenValue;
  return floatIif[int(clamp(condition, 0.0, 1.0))];
}

vec2 iif(float condition, vec2 thenValue, vec2 elseValue) {
  vec2Iif[0] = elseValue;
  vec2Iif[1] = thenValue;
  return vec2Iif[int(clamp(condition, 0.0, 1.0))];
}

vec3 iif(float condition, vec3 thenValue, vec3 elseValue) {
  vec3Iif[0] = elseValue;
  vec3Iif[1] = thenValue;
  return vec3Iif[int(clamp(condition, 0.0, 1.0))];
}

vec4 iif(float condition, vec4 thenValue, vec4 elseValue) {
  vec4Iif[0] = elseValue;
  vec4Iif[1] = thenValue;
  return vec4Iif[int(clamp(condition, 0.0, 1.0))];
}""")

    ("math-consts", """
// #define PI = 3.14156265358979323846
// #define TWO_PI = 6.28318530718
const float PI = 3.14156265358979323846;
const float TWO_PI = 6.28318530718;
  """)

    ("path-consts", """
const int FILL_STROKE = 1;
const int FILL_FILL = 2;
const int FILL_BORDER = 3;
  """)

    ("quad-params", """
uniform quadParams {
  vec2 size;
  vec4 strokeColor;
  vec4 fillColor;
  int fillType;
  float lineWidth;
  float aliasWidth;
  float angle;
  int instanceCount;
};""")

    ("quad-points-strip", """
vec2 quadPointsStrip[] = vec2[] (
  vec2(-0.5,  0.5),
  vec2(-0.5, -0.5),
  vec2( 0.5,  0.5),
  vec2( 0.5, -0.5)
);""")

    ("quad-points-strip-right", """
vec2 quadPointsStripRight[] = vec2[] (
  vec2(0.0,  0.5),
  vec2(0.0, -0.5),
  vec2(1.0,  0.5),
  vec2(1.0, -0.5)
);""")

    ("quad-common", """
struct QuadParams {
  vec2 screenSize;
  vec2 size;
  vec2 halfSize;
  vec2 centerScreen;
  vec2 center;
  vec2 bottomLeft;
  vec2 topRight;
  vec2 rotation;
  vec4 strokeColor;
  vec4 fillColor;
  int fillType;
  float pixelScale;
  float strokeWidth;
  float aliasWidth;
  int instance;
  int instanceCount;
};""")

    ("quad-outvars", """
#include quad-common
flat out QuadParams v_params;""")

    ("quad-invars", """
#include quad-common
flat in QuadParams v_params;""")

    ("calc-quad-vertexid", """
  int vertexIndex = gl_VertexID % 4;""")

    ("calc-scaled-quad-points", """
  vec2 rotation = vec2(cos(angle), sin(angle));

  vec2 pointsT[] = vec2[] (
    rotate(points[0] * size, rotation),
    rotate(points[1] * size, rotation),
    rotate(points[2] * size, rotation),
    rotate(points[3] * size, rotation)
  );""")

    ("calc-quad-dim", """
  vec2 topLeft = pointsT[0];
  vec2 bottomLeft = pointsT[1];
  vec2 topRight = pointsT[2];
  vec2 topLeftS = modelToScreen(topLeft);
  vec2 bottomLeftS = modelToScreen(bottomLeft);
  vec2 topRightS = modelToScreen(topRight);""")

    ("calc-quad-center", """
  vec2 center = (bottomLeftS + topRightS) * 0.5;""")

    ("calc-quad-rotation", """
  vec2 ab = topRightS - topLeftS;
  float currentAngle = -atan(ab.y, ab.x);
  rotation = vec2(cos(currentAngle), sin(currentAngle));""")

    ("calc-quad-vertex", """
  float aliasOffsetX = mix(-aliasWidth, aliasWidth, float(vertexIndex > 1));
  float aliasOffsetY = mix(-aliasWidth, aliasWidth, step(float(vertexIndex % 2), 0.0));
  vec2 lr = normalize(topRight - topLeft) * aliasOffsetX;
  vec2 bt = normalize(topLeft - bottomLeft) * aliasOffsetY;
  vec2 vertex = pointsT[vertexIndex] + lr + bt; """);

    ("set-quad-position", """
  gl_Position = modelToClip(vertex);""")

    ("set-quad-params", """
  vec2 size = vec2(length(topRightS - topLeftS), length(topLeftS - bottomLeftS));
  float quadSize = max(size.x, size.y);
  float screenSize = max(resolution.x, resolution.y);
  float pixelScale = screenSize / quadSize / screenSize;

  v_params.size = size;
  v_params.screenSize = resolution;
  v_params.halfSize = size * 0.5;
  v_params.centerScreen = center;
  v_params.rotation = rotation;
  v_params.strokeColor = strokeColor;
  v_params.fillColor = fillColor;
  v_params.fillType = fillType;
  v_params.pixelScale = pixelScale;
  v_params.strokeWidth = lineWidth * worldScale * zoom;
  v_params.aliasWidth = aliasWidth * worldScale;
  v_params.instance = gl_InstanceID;
  v_params.instanceCount = instanceCount;""")

    ("vec2", """
float dot(vec2 v) { return dot(v, v); }
vec2 perp(vec2 v) { return vec2(-v.y, v.x); }
vec2 perpRight(vec2 v) { return vec2(v.y, -v.x); }
float cross(vec2 v1, vec2 v2) { return v1.x * v2.y - v1.y * v2.x; }
bool isLeftOf(vec2 v1, vec2 v2) { return cross(v1, v2) < 0.0; }
bool isRightOf(vec2 v1, vec2 v2) { return cross(v1, v2) > 0.0; }
vec2 faceToward(vec2 v1, vec2 v2) { return v1 * sign(dot(v1, v2)); }

vec2 perpToward(vec2 v, vec2 toward) {
  float sgn = sign(cross(toward, v));
  return vec2(sgn * v.y, -sgn * v.x);
}

vec2 rotate(vec2 v, vec2 rotation) {
  return vec2(rotation.x * v.x - rotation.y * v.y, rotation.y * v.x + rotation.x * v.y);
}""")

    ("line-utils", """
#include vec2

vec2 closestLinePoint(vec2 p, vec2 normal, vec2 linePoint) {
  float d = dot(normal, linePoint);  // Distance to origin.
  float t = d - dot(normal, p);
  return p + normal * t;
}

float distToLine(vec2 p, vec2 normal, vec2 linePoint) {
  float d = dot(normal, linePoint);
  return dot(normal, p) - d;
}

vec2 closestSegmentPoint(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = dot(p - a, ab) / dot(ab, ab);
  t = clamp(t, 0.0, 1.0);
  return a + t * ab;
}

float closestSegmentTimePoint(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  float t = dot(p - a, ab) / dot(ab, ab);
  return clamp(t, 0.0, 1.0);
}

float signedDistToSegment(vec2 p, vec2 a, vec2 b, out float t) {
  vec2 ab = b - a;
  vec2 ap = p - a;
  vec2 normal = perp(ab);
  t = dot(ap, ab) / dot(ab, ab);

  if (t <= 0.0) {
    t = 0.0;
    return length(ap);
  }

  if (t >= 1.0) {
    t = 1.0;
    return length(p - b);
  }

  return dot(ap, normal) / dot(ab, ab);
}

float signedDistToSegment(vec2 p, vec2 a, vec2 b) {
  float t;
  return signedDistToSegment(p, a, b, t);
}

float sqrDistToSegment(vec2 p, vec2 a, vec2 b) {
  vec2 ab = b - a;
  vec2 ap = p - a;

  float e = dot(ap, ab);
  if (e <= 0.0) return dot(ap, ap);
  float f = dot(ab, ab);
  
  if (e >= f) {
    vec2 bp = p - b;
    return dot(bp, bp);
  }

  return dot(ap, ap) - e * e / f;
}

float distToSegment(vec2 p, vec2 a, vec2 b) { return sqrt(sqrDistToSegment(p, a, b)); }

vec2 rayLineIntersection(vec2 rayStart, vec2 rayDir, vec2 normal, vec2 linePoint) {
  float d = dot(normal, linePoint);   // Distance to origin.
  float t = (d - dot(normal, rayStart)) / dot(normal, rayDir);
  return rayStart + rayDir * t;
}

vec2 LineLineIntersection(vec2 point1, vec2 dir1, vec2 point2, vec2 dir2) {
  float t = cross(dir2, (point2 - point1)) / cross(dir2, dir1);
  return point1 + dir1 * t;
}""")

    ("sdf-consts", """
const int SDF_CUSTOM = 0;
const int SDF_LINE = 1;
const int SDF_CIRCLE = 2;
const int SDF_SQUARE = 3;
  """)

    ("sdf-outvars", """
#include quad-common
flat out QuadParams v_sdfParams;""")

    ("sdf-invars", """
#include quad-common
flat in QuadParams v_sdfParams;""")

    ("sdf-line-outvars", """
#include sdf-line-common
flat out SdfLineParams v_sdfLineParams;
flat out SdfLineParams v_sdfPriorLineParams;
flat out SdfLineParams v_sdfNextLineParams;""")

    ("sdf-line-invars", """
#include sdf-line-common
flat in SdfLineParams v_sdfLineParams;
flat in SdfLineParams v_sdfPriorLineParams;
flat in SdfLineParams v_sdfNextLineParams;""")

    ("sdf-utils", """
#include path-consts
#include transparent-color
#include quad-common
vec2 sdfToLocalOrient(vec2 p, vec2 center, vec2 rotation) {
  p = p - center;
  return vec2(rotation.x * p.x - rotation.y * p.y, rotation.y * p.x + rotation.x * p.y);
}

vec2 sdfToLocalOrient(vec2 p, QuadParams sp) {
  return sdfToLocalOrient(p, sp.center, sp.rotation);
}

QuadParams sdfToLocal1(QuadParams params) {
  QuadParams sp = params;
  float size = max(sp.size.x, sp.size.y);

  // WTF: Same calculation as vertex shader but doesn't work!!!
  // float quadSize = size;
  // float screenSize = max(sp.screenSize.x, sp.screenSize.y);
  // float strokeScale = screenSize / quadSize;
  // sp.strokeWidth = sp.strokeWidth / screenSize * strokeScale;

  sp.strokeWidth = sp.strokeWidth * sp.pixelScale;
  sp.center = vec2(0.0);
  sp.bottomLeft = vec2(-0.5);
  sp.topRight = vec2(0.5);
  return sp;
}

vec2 sdfPointToLocal1(vec2 p, QuadParams sp) {
  vec2 rotation = sp.rotation;
  p = p - sp.centerScreen;
  p = vec2(rotation.x * p.x - rotation.y * p.y, rotation.y * p.x + rotation.x * p.y);
  p /= sp.size;
  return p;
}

float sdfUnion(float distance1, float distance2) { return min(distance1, distance2); }
float sdfUnion(float d1, float d2, float d3) { return min(min(d1, d2), d3); }
float sdfUnion(float d1, float d2, float d3, float d4) { return min(min(min(d1, d2), d3), d4); }
float sdfDiff(float distance1, float distance2) { return max(distance1, -distance2); }
float sdfDiff(float d1, float d2, float d3) { return max(max(d1, -d2), -d3); }
float sdfDiff(float d1, float d2, float d3, float d4) { return max(max(max(d1, -d2), -d3), -d4); }
float sdfIntersect(float distance1, float distance2) { return max(distance1, distance2); }
float sdfIntersect(float d1, float d2, float d3) { return max(max(d1, d2), d3); }
float sdfIntersect(float d1, float d2, float d3, float d4) { return max(max(max(d1, d2), d3), d4); }

vec4 sdfStroke(float distance, vec4 strokeColor, float strokeWidth, float aliasWidth) {
  float edgeDist = 0.0;
  float strokeDist = edgeDist - strokeWidth;
  float innerEdgeDist = strokeDist - aliasWidth;
  float pct = smoothstep(edgeDist, aliasWidth, distance);
  vec4 edgeColor = mix(strokeColor, transparent, pct);
  pct = smoothstep(innerEdgeDist, strokeDist, distance);
  vec4 innerEdgeColor = mix(transparent, strokeColor, pct);
  vec4 color = transparent;
  color = mix(color, innerEdgeColor, float(distance >= innerEdgeDist));
  color = mix(color, strokeColor, float(distance >= strokeDist));
  color = mix(color, edgeColor, float(distance > edgeDist));
  return color;
}

vec4 sdfFill(float distance, vec4 fillColor, float aliasWidth) {
  float edgeDist = 0.0;
  float pct = smoothstep(edgeDist, aliasWidth, distance);
  vec4 edgeColor = mix(fillColor, transparent, pct);
  edgeColor = mix(fillColor, vec4(0.3, 0.3, 0.3, 0.4), pct);
  vec4 color = fillColor;
  color = mix(color, edgeColor, float(distance >= edgeDist));
  // color = mix(color, transparent, float(distance > edgeDist + aliasWidth));
  color = mix(color, transparent, float(distance > 0.0 && aliasWidth == 0.0));
  return color;
}

vec4 sdfBorder(float distance, vec4 fillColor, vec4 strokeColor, float strokeWidth, float aliasWidth) {
  float edgeDist = 0.0;
  float strokeDist = edgeDist - strokeWidth;
  float innerEdgeDist = strokeDist - aliasWidth;
  float pct = smoothstep(edgeDist, aliasWidth, distance);
  vec4 edgeColor = mix(strokeColor, transparent, pct);
  pct = smoothstep(innerEdgeDist, strokeDist, distance);
  vec4 innerEdgeColor = mix(fillColor, strokeColor, pct);
  vec4 color = fillColor;
  color = mix(color, innerEdgeColor, float(distance >= innerEdgeDist));
  color = mix(color, strokeColor, float(distance >= strokeDist));
  color = mix(color, edgeColor, float(distance > edgeDist));
  return color;
}

vec4 sdfDraw(float distance, QuadParams params) {
  switch (params.fillType) {
    case FILL_STROKE: return sdfStroke(distance, params.strokeColor, params.strokeWidth, params.aliasWidth);
    case FILL_FILL: return sdfFill(distance, params.fillColor, params.aliasWidth);
    case FILL_BORDER: return sdfBorder(distance, params.fillColor, params.strokeColor, params.strokeWidth, params.aliasWidth);
    default: return transparent;
  }
}

float sdfRect(vec2 p, vec2 bottomLeft, vec2 topRight) {
  vec2 center = (bottomLeft + topRight) * 0.5;
  vec2 extent = topRight - center;
  float dist = max(abs(p.x - center.x) - extent.x, abs(p.y - center.y) - extent.y);
  return dist;
}

float sdfCircle(vec2 p, vec2 center, float radius) {
  float dist = length(p - center) - radius;
  return dist;
}

float sdfCircle(vec2 p, float centerX, float radius) {
  return sdfCircle(p, vec2(centerX, 0.0), radius);
}

float sdfCircle(vec2 p, float centerX, float centerY, float radius) {
  return sdfCircle(p, vec2(centerX, centerY), radius);
}
  """)

    ("sdf-line-common", """
struct SdfLineParams {
  int startCap;
  int endCap;
  vec2 position;
  vec2 rotation;
  vec2 bottomLeft;
  vec2 topRight;
  vec2 startBottomLeft;
  vec2 endTopRight;
  vec2 join1;
  vec2 join2;
  vec2 join3;
  vec2 miterPoint;
  float aliasWidth;
  float hasPrior;
  float hasNext;
};

float sdfRect(vec2 p, vec2 bottomLeft, vec2 topRight, bool include) {
  vec2 center = (bottomLeft + topRight) * 0.5;
  vec2 extent = topRight - center;
  float dist = max(abs(p.x - center.x) - extent.x, abs(p.y - center.y) - extent.y);
  return mix(0.00001, dist, include);
}

float sdfCircle(vec2 p, vec2 center, float radius, bool include) {
  float dist = length(p - center) - radius;
  return mix(0.00001, dist, include);
}

float sdfCircle(vec2 p, float centerX, float radius, bool include) {
  return sdfCircle(p, vec2(centerX, 0.0), radius, include);
}

float sdfCircle(vec2 p, float centerX, float centerY, float radius, bool include) {
  return sdfCircle(p, vec2(centerX, centerY), radius, include);
}
  """)

    ("sdf-line-utils", """
struct SdfLineValues {
  int startCap;
  int endCap;
  vec2 position;
  vec2 rotation;
  vec2 startBottomLeft;
  vec2 endTopRight;
  vec2 bottomLeft;
  vec2 topRight;
  vec2 b;
  vec2 d;
  vec2 e;
  vec2 miterPoint;
  float radius;
};

float sdfSegment(vec2 p, SdfLineValues values) {
  return sdfRect(p, values.bottomLeft, values.topRight, true);
}

float sdfSegmentLeftSquare(vec2 p, SdfLineValues values, bool include) {
  return sdfRect(p, values.startBottomLeft, values.topRight, include);
}

float sdfSegmentRightSquare(vec2 p, SdfLineValues values, bool include) {
  return sdfRect(p, values.bottomLeft, values.endTopRight, include);
}

float sdfSegmentLeftRound(vec2 p, SdfLineValues values, bool include) {
  return sdfCircle(p, values.bottomLeft.x, values.radius, include);
}

float sdfSegmentRightRound(vec2 p, SdfLineValues values, bool include) {
  return sdfCircle(p, values.topRight.x, values.radius, include);
}
  """)

    ("sdf-linepath-fragment", """
#include line-consts
#include vec2
#include sdf-utils
#include sdf-line-utils

SdfLineValues sdfLinePathValues(SdfLineParams params) {
  SdfLineValues result;
  vec2 pos = params.position;
  vec2 rot = params.rotation;
  result.startCap = params.startCap;
  result.endCap = params.endCap;
  result.position = pos;
  result.rotation = rot;
  result.startBottomLeft = sdfToLocalOrient(params.startBottomLeft, pos, rot);
  result.endTopRight = sdfToLocalOrient(params.endTopRight, pos, rot);
  result.bottomLeft = sdfToLocalOrient(params.bottomLeft, pos, rot);
  result.topRight = sdfToLocalOrient(params.topRight, pos, rot);
  result.b = sdfToLocalOrient(params.join1, pos, rot);
  result.d = sdfToLocalOrient(params.join2, pos, rot);
  result.e = sdfToLocalOrient(params.join3, pos, rot);
  result.miterPoint = sdfToLocalOrient(params.miterPoint, pos, rot);
  result.radius = abs(result.bottomLeft.x - result.startBottomLeft.x);
  return result;
}

float sdfSegmentJoinBevel(vec2 p, SdfLineValues values, bool include) {
  vec2 b = values.b;
  vec2 d = values.d;
  vec2 e = values.e;

  float s1 = cross(p - b, (d - b));          // Positive if bp is right of bd, negative if left.
  float s2 = cross(p - d, normalize(e - d)); // Normalize to reduce aliasing.
  float s3 = cross(p - e, (b - e));
  float square = sdfSegmentRightSquare(p, values, include);

  float dist = sdfIntersect(s1, s2, s3, square);
  return mix(0.00001, dist, include);
}

float sdfSegmentJoinMiter(vec2 p, SdfLineValues values, bool include) {
  vec2 b = values.b;
  vec2 d = values.d;
  vec2 e = values.e;
  vec2 m = values.miterPoint;

  float s1 = cross(p - b, (d - b));
  float s2 = cross(p - d, normalize(m - d)); // Normalize outer edges to reduce aliasing.
  float s3 = cross(p - m, normalize(e - m));
  float s4 = cross(p - e, (b - e));
  float dist = sdfIntersect(s1, s2, s3, s4);
  return mix(0.00001, dist, include);
}

float sdfLinePath(vec2 p, SdfLineValues values) {
  float startCap =
    sdfSegmentLeftSquare(p, values, values.startCap == CAP_SQUARE) +
    sdfSegmentLeftRound(p, values, values.startCap == CAP_ROUND);

  float endCap =
    sdfSegmentRightRound(p, values, values.endCap == CAP_ROUND) +
    sdfSegmentRightSquare(p, values, values.endCap == CAP_SQUARE) +
    sdfSegmentJoinBevel(p, values, values.endCap == JOIN_BEVEL) +
    sdfSegmentJoinMiter(p, values, values.endCap == JOIN_MITER) +
    sdfSegmentRightRound(p, values, values.endCap == JOIN_ROUND);
  
  startCap = mix(startCap, 10.0, startCap == 0.00002);
  endCap = mix(endCap, 10.0, endCap == 0.00005);
  return sdfUnion(sdfSegment(p, values), startCap, endCap);
}

vec4 sdfDrawLinePath(SdfLineParams lineParams, SdfLineParams priorParams, SdfLineParams nextParams, vec4 color, float aliasWidth) {
  SdfLineValues values = sdfLinePathValues(lineParams);
  vec2 p = sdfToLocalOrient(gl_FragCoord.xy, values.position, values.rotation);
  float line = sdfLinePath(p, values);

  values = sdfLinePathValues(priorParams);
  p = sdfToLocalOrient(gl_FragCoord.xy, values.position, values.rotation);
  float prior = sdfLinePath(p, values);
  float priorIntersect = sdfIntersect(line, prior);
  priorIntersect = mix(10.0, priorIntersect, lineParams.hasPrior == 1.0);

  values = sdfLinePathValues(nextParams);
  p = sdfToLocalOrient(gl_FragCoord.xy, values.position, values.rotation);
  float next = sdfSegment(p, values);
  float intersect = sdfIntersect(line, next);
  intersect = mix(10.0, sdfIntersect(line, next), lineParams.hasNext == 1.0);
  line = mix(line, sdfDiff(line, next), lineParams.hasNext == 1.0);

  intersect = min(intersect, priorIntersect);
  aliasWidth = mix(aliasWidth, 0.0, intersect <= line);
  return sdfFill(line, color, aliasWidth);
}
  """)

    ("circle-outvars", """
flat out float v_isCircle;
flat out float v_isSemicircle;
flat out float v_isWedge;
flat out vec2 v_circleCenter;
flat out vec2 v_radiusDirection;
flat out float v_wedgeCrossLimit;""")

    ("circle-invars", """
flat in float v_isCircle;
flat in float v_isSemicircle;
flat in float v_isWedge;
flat in vec2 v_circleCenter;
flat in vec2 v_radiusDirection;
flat in float v_wedgeCrossLimit;""")

    ("plots-fragment", """
float plotPct(float targetY, float y, float width) {
  return step(abs(targetY - y), width);
}

float smoothPlotPct(float targetY, float y, float width) {
  return smoothstep(targetY - width, targetY, y) - smoothstep(targetY, targetY + width,  y);
}

float innerEdge(in float radius, in float width, in float dist) {
  return step(radius - width, dist);
}

float smoothEdge(in float radius, in float width, in float dist) {
  return smoothstep(radius - width, radius + width, dist);
}

float smoothInnerEdge(in float radius, in float width, in float dist) {
  return smoothstep(radius - width, radius, dist);
}

float smoothOuterEdge(in float radius, in float width, in float dist) {
  return smoothstep(radius, radius + width, dist);
}""")

    ("circles-fragment", """
#include transparent-color
#include plots-fragment
#include conditionals
#include vec2
#line 328
float circleDist(in vec2 center, in float radius, in vec2 p){
  // vec2 cp = p - center;
	// return dot(cp, cp) * 4.0;
  return distance(p, center);
}

vec4 semicircle(vec2 center, vec2 radiusDirection, vec4 fillColor, vec2 p) {
  float radius = length(radiusDirection);
  vec2 fragDirection = p - center;
  float dist = length(fragDirection);
  float delta = fwidth(dist);
  float pct = smoothEdge(radius, delta, dist);
  vec4 color = mix(fillColor, transparent, pct);
  vec4 innerColor = iif(dist <= radius, fillColor, transparent);
  float dotDR = dot(fragDirection, radiusDirection);
  return iif(dist < (radius - delta), innerColor, color);
}

vec4 wedge(vec2 center, vec2 radiusDirection, float wedgeCrossLimit, vec4 fillColor, vec2 p) {
  float radius = length(radiusDirection);
  vec2 fragDirection = p - center;
  float wedgeCross = abs(cross(normalize(fragDirection), normalize(radiusDirection)));
  float dist = length(fragDirection);
  float delta = fwidth(dist);
  float pct = smoothEdge(radius, delta, dist);
  vec4 color = mix(fillColor, transparent, pct);
  vec4 innerColor = iif(dist <= radius, fillColor, transparent);
  bool isInCircle = dist <= radius;
  bool isInSemiCircle = isInCircle && dot(fragDirection, radiusDirection) >= 0.0;
  bool isInWedge = isInSemiCircle && wedgeCross <= wedgeCrossLimit;
  // bool isOnSide = isInWedge && abs(wedgeCross - wedgeCrossLimit) <= 0.01;
  color = iif(isInSemiCircle && isInWedge, color, transparent);
  color = iif(dist < (radius - delta), innerColor, color);
  // TODO: Smooth sides.
  return color;
}

vec4 circle(vec2 center, float radius, vec4 fillColor, vec2 p) {
  float dist = circleDist(center, radius, p);
  float pct = smoothEdge(radius, fwidth(dist), dist);
  return mix(fillColor, transparent, pct);
}

vec4 circle(vec2 center, float radius, float strokeWidth, vec4 fillColor, vec4 strokeColor, vec2 p) {
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  float bw = max(strokeWidth, 0.0001);
  float dist = circleDist(center, radius, p);
  float fillPct = innerEdge(radius, bw, dist);
  float bmult = step(radius, dist);
  vec4 fill = mix(fillColor, strokeColor, fillPct);
  return mix(fill, transparent, bmult);
}

vec4 smoothCircle(vec2 center, float radius, float strokeWidth, vec4 fillColor, vec4 strokeColor, vec2 p) {
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  float bw = max(strokeWidth, 0.0001);
  float iw = bw * 0.01;
  float ow = bw * 0.02;
  float ir = radius - bw + iw;
  float or = radius - ow;
  float dist = circleDist(center, radius, p);
  float fillPct = smoothInnerEdge(ir, iw, dist);
  float bordPct = smoothOuterEdge(or, ow, dist);
  vec4 fill = mix(fillColor, strokeColor, fillPct);
  vec4 bord = mix(strokeColor, transparent, bordPct);
  float bmult = 1.0 - step(bordPct, 0.0);
  return mix(fill, bord, bmult);
}""")

    ("circle-color-fragment", """
  vec4 circleColor = circle(v_circleCenter, length(v_radiusDirection), v_fillColor, gl_FragCoord.xy);
  color = iif(v_isCircle, circleColor, color);""")

    ("circle-color-discard-fragment", """
  vec4 circleColor = circle(v_circleCenter, length(v_radiusDirection), v_fillColor, gl_FragCoord.xy);
  if (v_isCircle == 1.0 && circleColor == transparent) discard;
  color = iif(v_isCircle, circleColor, color);""")

    ("semicircle-color-fragment", """
  vec4 semicircleColor = semicircle(v_circleCenter, v_radiusDirection, v_fillColor, gl_FragCoord.xy);
  color = iif(v_isSemicircle, semicircleColor, color);""")

    ("semicircle-color-discard-fragment", """
  vec4 semicircleColor = semicircle(v_circleCenter, v_radiusDirection, v_fillColor, gl_FragCoord.xy);
  if (v_isSemicircle == 1.0 && semicircleColor == transparent) discard;
  color = iif(v_isSemicircle, semicircleColor, color);""")

    ("wedge-color-fragment", """
  vec4 wedgeColor = wedge(v_circleCenter, v_radiusDirection, v_wedgeCrossLimit, v_fillColor, gl_FragCoord.xy);
  color = iif(v_isWedge, wedgeColor, color);""")

    ("wedge-color-discard-fragment", """
  vec4 wedgeColor = wedge(v_circleCenter, v_radiusDirection, v_wedgeCrossLimit, v_fillColor, gl_FragCoord.xy);
  if (v_isWedge == 1.0 && wedgeColor == transparent) discard;
  color = iif(v_isWedge, wedgeColor, color);""")

    ("line-consts", """
const int CAP_BUTT = 0;
const int CAP_ROUND = 1;
const int CAP_SQUARE = 2;
const int JOIN_ROUND = 3;
const int JOIN_BEVEL = 4;
const int JOIN_MITER = 5;""")

    ("lines2d-vertex", """
#include line-consts
#include coordinate-conversion-vertex
#include conditionals
#include vec2
#line 433

const int CAP_LINE = 6;

const vec2 emptyVertex = vec2(0.0);

bool capFlags[] = bool[7](false, false, false, false, false, false, false);
vec2 tp[3];

const vec2 lineTemplate[] = vec2[18](
  // Start
  vec2(0.5, -0.5),
  vec2(0.0, -0.5),
  vec2(0.5,  0.5),

  vec2(0.0, -0.5),
  vec2(0.0,  0.5),
  vec2(0.5,  0.5),

  // Line
  vec2(0.0, -0.5),
  vec2(1.0, -0.5),
  vec2(0.0,  0.5),

  vec2(1.0, -0.5),
  vec2(1.0,  0.5),
  vec2(0.0,  0.5),

  // End
  vec2(0.0, -0.5),
  vec2(0.5, -0.5),
  vec2(0.0,  0.5),

  vec2(0.5, -0.5),
  vec2(0.5,  0.5),
  vec2(0.0,  0.5)
);

void setCapFlag(int cap, bool value) {
  capFlags[CAP_BUTT] = false;
  capFlags[CAP_SQUARE] = false;
  capFlags[CAP_ROUND] = false;
  capFlags[JOIN_ROUND] = false;
  capFlags[JOIN_BEVEL] = false;
  capFlags[JOIN_MITER] = false;
  capFlags[CAP_LINE] = false;
  capFlags[cap] = value;
}

vec2 addSquareCap(vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex) {
  vec2 offset = lineTemplate[vertexIndex];
  vec2 vertex = point + direction * (lineWidth * offset.x) + leftNormal * (lineWidth * offset.y);
  return iif(capFlags[CAP_SQUARE], vertex, emptyVertex);
}

vec2 addRoundCap(vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isSemicircle, inout vec2 center, inout vec2 radiusDir) {
  bool isActive = capFlags[CAP_ROUND];

  vec2 sCircleEdge = modelToScreen(point + direction * (lineWidth * 0.5));
  isSemicircle = iif(isActive, 1.0, isSemicircle);
  center = iif(isActive, modelToScreen(point), center);
  radiusDir = iif(isActive, sCircleEdge - center, radiusDir);

  vec2 offset = lineTemplate[vertexIndex];
  vec2 vertex = point + direction * (lineWidth * offset.x) + leftNormal * (lineWidth * offset.y);
  return iif(isActive, vertex, emptyVertex);
}

void joinCommon(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, out vec2 d, out vec2 e, out vec2 bd, out vec2 be) {
  float halfLineWidth = lineWidth * 0.5;
  vec2 cb = b - c;
  vec2 abDirection = normalize(ab);
  vec2 joinDirection = ab + cb;
  vec2 abNormal = perpToward(abDirection, joinDirection);
  vec2 cbNormal = perpToward(normalize(cb), joinDirection);
  vec2 p1 = b + abNormal * halfLineWidth;
  vec2 p2 = b + cbNormal * halfLineWidth;
  vec2 b1 = p1 - b;
  vec2 b2 = p2 - b;
  // Make sure correct winding in case face culling is enabled.
  bool p2IsRight = isRightOf(b2, b1);
  d = iif(p2IsRight, p2, p1);
  e = iif(p2IsRight, p1, p2);
  bd = iif(p2IsRight, b2, b1);
  be = iif(p2IsRight, b1, b2);
}

vec2 addRoundJoin(vec2 a, vec2 b, vec2 c, vec2 ab, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isWedge, inout vec2 center, inout vec2 radiusDir, inout float wedgeCrossLimit) {
  int vertexID = vertexIndex % 6;
  bool isActive = capFlags[JOIN_ROUND];

  vec2 d;
  vec2 e;
  vec2 bd;
  vec2 be;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be);
  vec2 circleEdge = b + normalize(bd + be) * (lineWidth * 0.5);

  vec2 sD = modelToScreen(d);
  vec2 sCircleEdge = modelToScreen(circleEdge);
  // WEIRD:  Is this a bug in GLSL? radiusDir is not set correctly!!! (capFlags as float).
  // isWedge = mix(isWedge, 1.0, isActive);
  // center = mix(center, modelToScreen(b), isActive);
  // radiusDir = mix(radiusDir, sCircleEdge - center, isActive);
  // wedgeCrossLimit = mix(wedgeCrossLimit, cross(normalize(sD - center), radiusDir), isActive);

  isWedge = iif(isActive, 1.0, isWedge);
  center = iif(isActive, modelToScreen(b), center);
  radiusDir = iif(isActive, sCircleEdge - center, radiusDir);
  wedgeCrossLimit = iif(isActive, cross(normalize(sD - center), normalize(radiusDir)), wedgeCrossLimit);

  vec2 offset = lineTemplate[vertexIndex];
  vec2 vertex = b + ab * (lineWidth * offset.x) + leftNormal * (lineWidth * offset.y);
  return iif(isActive, vertex, emptyVertex);
}

vec2 addBevel(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, int vertexIndex) {
  int vertexID = vertexIndex % 6;
  int id = vertexID % 3;         // Vertex index for the current triangle.

  vec2 d;
  vec2 e;
  vec2 bd;
  vec2 be;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be);

  tp[0] = b;
  tp[1] = d;
  tp[2] = e;
  return iif(capFlags[JOIN_BEVEL] && vertexID < 3, tp[id], emptyVertex); // Only using first triangle.
}

vec2 addMiter(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, float miterLimit, int miterFallback, int vertexIndex) {
  int vertexID = vertexIndex % 6;
  int id = vertexID % 3;         // Vertex index for the current triangle.
  float isFirstTriangle = float(vertexID < 3);

  vec2 d;
  vec2 e;
  vec2 bd;
  vec2 be;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be);
  vec2 miter = normalize(bd + be);

  // Find the intersection of miter and the segment (2D sdfPlane) going through d.
  vec2 normal = normalize(bd); // Normal to the sdfPlane.
  float nd = dot(normal, d);   // Distance to origin.
  float t = (nd - dot(normal, b)) / dot(normal, miter);
  vec2 miterPoint = b + miter * t;

  bool useFallback = t > miterLimit;
  capFlags[miterFallback] = capFlags[miterFallback] || (useFallback && capFlags[JOIN_MITER]);
  capFlags[JOIN_MITER] = capFlags[JOIN_MITER] && !useFallback;

  tp[0] = b;
  tp[1] = iif(isFirstTriangle, d, miterPoint);
  tp[2] = iif(isFirstTriangle, miterPoint, e);

  // BUG: Another weird case. Does not work correctly. 0.0 should return vec2(0.0) and 1.0 the original.
  // Using mix doesn't work either.
  // return tp[id] * vec2(capFlags[JOIN_MITER]);

  return iif(capFlags[JOIN_MITER], tp[id], emptyVertex);
}

vec2 addCap(int cap, vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isSemicircle, inout vec2 center, inout vec2 radiusDir) {
  return addSquareCap(point, direction, leftNormal, lineWidth, vertexIndex)
    + addRoundCap(point, direction, leftNormal, lineWidth, vertexIndex, isSemicircle, center, radiusDir);
}

vec2 addCap(int cap, float miterLimit, int miterFallback, vec2 point, vec2 a, vec2 b, vec2 c, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isSemicircle, inout float isWedge, inout vec2 center, inout vec2 radiusDir, inout float wedgeCrossLimit) {
  return addMiter(a, b, c, direction, lineWidth, miterLimit, miterFallback, vertexIndex)
    + addSquareCap(point, direction, leftNormal, lineWidth, vertexIndex)
    + addRoundCap(point, direction, leftNormal, lineWidth, vertexIndex, isSemicircle, center, radiusDir)
    + addRoundJoin(a, b, c, direction, leftNormal, lineWidth, vertexIndex, isWedge, center, radiusDir, wedgeCrossLimit)
    + addBevel(a, b, c, direction, lineWidth, vertexIndex);
}

vec2 line2d(vec2 a, vec2 direction, vec2 leftNormal, float lineWidth, int vertexID) {
  vec2 offset = lineTemplate[vertexID + 6];
  return a + direction * offset.x + leftNormal * (lineWidth * offset.y);
}

vec2 _line2d(vec2 a, vec2 direction, vec2 leftNormal, float lineWidth, int vertexID) {
  vec2 vertex = line2d(a, direction, leftNormal, lineWidth, vertexID);
  return iif(capFlags[CAP_LINE], vertex, emptyVertex);
}

vec2 line2d(vec2 a, vec2 b, float lineWidth, int cap, int vertexIndex, inout float isSemicircle, inout vec2 center, inout vec2 radiusDir) {
  int section = vertexIndex / 6;
  int vertexID = vertexIndex % 6;

  vec2 direction = b - a;
  vec2 normalizedDirection = normalize(direction);
  vec2 leftNormal = perp(normalizedDirection);
  setCapFlag(cap, section == 0);
  vec2 startVertex = addCap(cap, a, -normalizedDirection, leftNormal, lineWidth, vertexIndex, isSemicircle, center, radiusDir);
  setCapFlag(CAP_LINE, section == 1);
  vec2 lineVertex = _line2d(a, direction, leftNormal, lineWidth, vertexID);
  setCapFlag(cap, section == 2);
  vec2 endVertex = addCap(cap, b, normalizedDirection, leftNormal, lineWidth, vertexIndex, isSemicircle, center, radiusDir);
  return startVertex + lineVertex + endVertex;
}

vec3 linepath2d(vec2 a, vec2 b, vec2 c, float lineWidth, int lineCap, int lineJoin, float miterLimit, int miterFallback, int instance, int instanceCount, int vertexIndex, inout float isSemicircle, inout float isWedge, inout vec2 center, inout vec2 radiusDir, inout float wedgeCrossLimit) {
  int section = vertexIndex / 6;
  int vertexID = vertexIndex % 6;

  int startCap = int(mix(float(CAP_BUTT), float(lineCap), float(instance == 0)));
  int endCap = int(mix(float(lineJoin), float(lineCap), float(instance == instanceCount - 1)));
  // endCap = int(mix(float(lineCap), float(lineCap), float(instance == instanceCount - 1)));

  vec2 direction = b - a;
  vec2 normalizedDirection = normalize(direction);
  vec2 leftNormal = perp(normalizedDirection);
  setCapFlag(startCap, section == 0);
  vec2 startVertex = addCap(startCap, miterLimit, miterFallback, a, a, b, c, -normalizedDirection, leftNormal, lineWidth, vertexIndex, isSemicircle, isWedge, center, radiusDir, wedgeCrossLimit);
  setCapFlag(CAP_LINE, section == 1);
  vec2 lineVertex = _line2d(a, direction, leftNormal, lineWidth, vertexID);
  setCapFlag(endCap, section == 2);
  vec2 endVertex = addCap(endCap, miterLimit, miterFallback, b, a, b, c, normalizedDirection, leftNormal, lineWidth, vertexIndex, isSemicircle, isWedge, center, radiusDir, wedgeCrossLimit);
  vec2 vertex = startVertex + lineVertex + endVertex;
  return vec3(vertex, float(instanceCount - instance) * 0.00001);
}""")

    ("lines2d2-vertex", """
#include line-consts
#include coordinate-conversion-vertex
#include conditionals
#include vec2
#include line-utils
#line 679

const int CAP_LINE = 6;
int section;

const vec2 emptyVertex = vec2(0.0);

bool capFlags[] = bool[7](false, false, false, false, false, false, false);
vec2 tp[4];

const vec2 lineTemplate[] = vec2[11](
  // Start
  vec2(0.5, -0.5),
  vec2(0.0, -0.5),
  vec2(0.5,  0.5),
  vec2(0.0,  0.5),

  // Line
  vec2(0.0,  0.5),
  vec2(0.0, -0.5),
  vec2(1.0,  0.5),
  vec2(1.0, -0.5),

  // End
  vec2(0.5,  0.5),
  vec2(0.5, -0.5),
  vec2(0.5, -0.5)
);

// vec2 texCoords[] = vec2[18] (
// );

void setCapFlag(int cap, bool value) {
  capFlags[CAP_BUTT] = false;
  capFlags[CAP_SQUARE] = false;
  capFlags[CAP_ROUND] = false;
  capFlags[JOIN_ROUND] = false;
  capFlags[JOIN_BEVEL] = false;
  capFlags[JOIN_MITER] = false;
  capFlags[CAP_LINE] = false;
  capFlags[cap] = value;
}

vec2 addVerticies(bool flag, vec2 offset, vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex) {
  vec2 vertex = point + direction * (lineWidth * offset.x) + leftNormal * (lineWidth * offset.y);
  return iif(flag, vertex, emptyVertex);
}

vec2 processRoundCap(vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isSemicircle, inout vec2 center, inout vec2 radiusDir) {
  bool isActive = capFlags[CAP_ROUND];

  vec2 sCircleEdge = modelToScreen(point + direction * (lineWidth * 0.5));
  isSemicircle = iif(isActive, 1.0, isSemicircle);
  center = iif(isActive, modelToScreen(point), center);
  radiusDir = iif(isActive, sCircleEdge - center, radiusDir);
  return emptyVertex;
}

void joinCommon(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, out vec2 d, out vec2 e, out vec2 bd, out vec2 be, out vec2 miter) {
  float halfLineWidth = lineWidth * 0.5;
  vec2 cb = b - c;
  vec2 abDirection = normalize(ab);
  vec2 joinDirection = ab + cb;
  vec2 abNormal = perpToward(abDirection, joinDirection);
  vec2 cbNormal = perpToward(normalize(cb), joinDirection);
  vec2 p1 = b + abNormal * halfLineWidth;
  vec2 p2 = b + cbNormal * halfLineWidth;
  vec2 b1 = p1 - b;
  vec2 b2 = p2 - b;
  // Make sure correct winding in case face culling is enabled.
  bool p2IsRight = isRightOf(b2, b1);
  d = iif(p2IsRight, p2, p1);
  e = iif(p2IsRight, p1, p2);
  bd = iif(p2IsRight, b2, b1);
  be = iif(p2IsRight, b1, b2);
  miter = normalize(bd + be);
}

vec2 addBevel(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, int vertexIndex) {
  vec2 d, e, bd, be, miter;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be, miter);

  // Find the closest point on the line (2D sdfPlane) containing de to b.
  vec2 midPoint = (d + e) * 0.5;

  tp[0] = b;
  tp[1] = e;
  tp[2] = d;
  tp[3] = midPoint;
  return iif(capFlags[JOIN_BEVEL], tp[vertexIndex - 7], emptyVertex);
}

vec2 addRoundJoin(vec2 a, vec2 b, vec2 c, vec2 ab, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isWedge, inout vec2 center, inout vec2 radiusDir, inout float wedgeCrossLimit) {
  vec2 d, e, bd, be, miter;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be, miter);
  bool isActive = capFlags[JOIN_ROUND];
  vec2 circleEdge = b + miter * (lineWidth * 0.5);

  vec2 sD = modelToScreen(d);
  vec2 circleEdgeS = modelToScreen(circleEdge);
  isWedge = iif(isActive, 1.0, isWedge);
  center = iif(isActive, modelToScreen(b), center);
  radiusDir = iif(isActive, circleEdgeS - center, radiusDir);
  wedgeCrossLimit = iif(isActive, cross(normalize(sD - center), normalize(radiusDir)), wedgeCrossLimit);

  // Find the intersection of miter and the segment (2D sdfPlane) going through d.
  vec2 normal = bd;            // Normal to the sdfPlane.
  float nd = dot(normal, d);   // Distance to origin.
  float t = (nd - dot(normal, b)) / dot(normal, miter);
  vec2 miterPoint = b + miter * t;

  tp[0] = b;
  tp[1] = e;
  tp[2] = d;
  tp[3] = miterPoint;
  return iif(isActive, tp[vertexIndex - 7], emptyVertex);
}

vec2 addMiter(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, float miterLimit, int miterFallback, int vertexIndex) {
  vec2 d, e, bd, be, miter;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be, miter);

  // Find the intersection of miter and the segment (2D sdfPlane) going through d.
  vec2 normal = normalize(bd); // Normal to the sdfPlane.
  float nd = dot(normal, d);   // Distance to origin.
  float t = (nd - dot(normal, b)) / dot(normal, miter);
  vec2 miterPoint = b + miter * t;

  bool useFallback = t > miterLimit;
  capFlags[miterFallback] = capFlags[miterFallback] || (useFallback && capFlags[JOIN_MITER]);
  capFlags[JOIN_MITER] = capFlags[JOIN_MITER] && !useFallback;

  bool eIsRight = isRightOf(be, bd);
  tp[0] = b;
  tp[1] = e;
  tp[2] = d;
  tp[3] = miterPoint;
  return iif(capFlags[JOIN_MITER], tp[vertexIndex - 7], emptyVertex);
}

vec2 addCap(int cap, vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isSemicircle, inout vec2 center, inout vec2 radiusDir) {
  vec2 buttOffset = vec2(0.0, lineTemplate[vertexIndex].y);

  return addVerticies(capFlags[CAP_BUTT], buttOffset, point, direction, leftNormal, lineWidth, vertexIndex)
    + addVerticies(capFlags[CAP_SQUARE], lineTemplate[vertexIndex], point, direction, leftNormal, lineWidth, vertexIndex)
    + addVerticies(capFlags[CAP_ROUND], lineTemplate[vertexIndex], point, direction, leftNormal, lineWidth, vertexIndex)
    + processRoundCap(point, direction, leftNormal, lineWidth, vertexIndex, isSemicircle, center, radiusDir);
}

vec2 addCap(int cap, float miterLimit, int miterFallback, vec2 point, vec2 a, vec2 b, vec2 c, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isSemicircle, inout float isWedge, inout vec2 center, inout vec2 radiusDir, inout float wedgeCrossLimit) {
  return addMiter(a, b, c, direction, lineWidth, miterLimit, miterFallback, vertexIndex)
    + addRoundJoin(a, b, c, direction, leftNormal, lineWidth, vertexIndex, isWedge, center, radiusDir, wedgeCrossLimit)
    + addBevel(a, b, c, direction, lineWidth, vertexIndex)
    + addCap(cap, point, direction, leftNormal, lineWidth, vertexIndex, isSemicircle, center, radiusDir)
    ;
}

vec2 line2d(vec2 a, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex) {
  vec2 offset = lineTemplate[vertexIndex];
  return a + direction * offset.x + leftNormal * (lineWidth * offset.y);
}

vec2 _line2d(vec2 a, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex) {
  vec2 vertex = line2d(a, direction, leftNormal, lineWidth, vertexIndex);
  return iif(capFlags[CAP_LINE], vertex, emptyVertex);
}

vec2 line2d(vec2 a, vec2 b, float lineWidth, int cap, int vertexIndex, inout float isSemicircle, inout vec2 center, inout vec2 radiusDir) {
  int section = iif(vertexIndex < 4, 0, -1);
  section = iif(vertexIndex > 7, 2, section);
  section = iif(section == -1, 1, section);

  vec2 direction = b - a;
  vec2 normalizedDirection = normalize(direction);
  vec2 leftNormal = perp(normalizedDirection);
  setCapFlag(cap, section == 0);
  vec2 startVertex = addCap(cap, a, -normalizedDirection, leftNormal, lineWidth, vertexIndex, isSemicircle, center, radiusDir);
  setCapFlag(CAP_LINE, section == 1);
  vec2 lineVertex = _line2d(a, direction, leftNormal, lineWidth, vertexIndex);
  setCapFlag(cap, section == 2);
  vec2 endVertex = addCap(cap, b, normalizedDirection, leftNormal, lineWidth, vertexIndex, isSemicircle, center, radiusDir);
  return startVertex + lineVertex + endVertex;
}

vec3 linepath2d(vec2 a, vec2 b, vec2 c, float lineWidth, int lineCap, int lineJoin, float miterLimit, int miterFallback, int instance, int instanceCount, int vertexIndex, inout float isSemicircle, inout float isWedge, inout vec2 center, inout vec2 radiusDir, inout float wedgeCrossLimit) {
  int section = iif(vertexIndex < 4, 0, -1);
  section = iif(vertexIndex > 7, 2, section);
  section = iif(section == -1, 1, section);

  int startCap = iif(instance == 0, lineCap, CAP_BUTT);
  int endCap = iif(instance == instanceCount - 1, lineCap, lineJoin);
  // int endCap = iif(instance == instanceCount - 1, lineCap, lineCap);

  vec2 direction = b - a;
  vec2 normalizedDirection = normalize(direction);
  vec2 leftNormal = perp(normalizedDirection);
  setCapFlag(startCap, section == 0);
  vec2 startVertex = addCap(startCap, miterLimit, miterFallback, a, a, b, c, -normalizedDirection, leftNormal, lineWidth, vertexIndex, isSemicircle, isWedge, center, radiusDir, wedgeCrossLimit);
  setCapFlag(CAP_LINE, section == 1);
  vec2 lineVertex = _line2d(a, direction, leftNormal, lineWidth, vertexIndex);
  setCapFlag(endCap, section == 2);
  vec2 endVertex = addCap(endCap, miterLimit, miterFallback, b, a, b, c, normalizedDirection, leftNormal, lineWidth, vertexIndex, isSemicircle, isWedge, center, radiusDir, wedgeCrossLimit);
  vec2 vertex = startVertex + lineVertex + endVertex;
  return vec3(vertex, float(instanceCount - instance) * 0.00001);
}""")

    ("lines2d3-vertex", """
#include line-consts
#include coordinate-conversion-vertex
#include conditionals
#include vec2
#include line-utils
#line 938

const int CAP_LINE = 6;
int section;

const vec2 emptyVertex = vec2(0.0);

bool capFlags[] = bool[7](false, false, false, false, false, false, false);
vec2 tp[5];

const vec3 lineTemplate[] = vec3[8](
  // Start
  vec3(0.5,  0.5, 0.0),
  vec3(0.5, -0.5, 0.0),
  vec3(0.0,  0.5, 0.0),
  vec3(0.0, -0.5, 0.0),

  // Line
  vec3(1.0,  0.5, 1.0),
  vec3(1.0, -0.5, 1.0),

  // End
  vec3(0.5,  0.5, 2.0),
  vec3(0.5, -0.5, 2.0)
);

// vec2 texCoords[] = vec2[10] (
// );

void setCapFlag(int cap, bool value) {
  capFlags[CAP_BUTT] = false;
  capFlags[CAP_SQUARE] = false;
  capFlags[CAP_ROUND] = false;
  capFlags[JOIN_ROUND] = false;
  capFlags[JOIN_BEVEL] = false;
  capFlags[JOIN_MITER] = false;
  capFlags[CAP_LINE] = false;
  capFlags[cap] = value;
}

vec2 addVerticies(bool flag, vec2 offset, vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex) {
  vec2 vertex = point + direction * (lineWidth * offset.x) + leftNormal * (lineWidth * offset.y);
  return iif(flag, vertex, emptyVertex);
}

vec2 processRoundCap(vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isSemicircle, inout vec2 center, inout vec2 radiusDir) {
  bool isActive = capFlags[CAP_ROUND];

  vec2 sCircleEdge = modelToScreen(point + direction * (lineWidth * 0.5));
  isSemicircle = iif(isActive, 1.0, isSemicircle);
  center = iif(isActive, modelToScreen(point), center);
  radiusDir = iif(isActive, sCircleEdge - center, radiusDir);
  return emptyVertex;
}

void joinCommon(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, out vec2 d, out vec2 e, out vec2 bd, out vec2 be, out vec2 miter, out bool eIsRight) {
  float halfLineWidth = lineWidth * 0.5;
  vec2 cb = b - c;
  vec2 abDirection = normalize(ab);
  vec2 joinDirection = ab + cb;
  vec2 abNormal = perpToward(abDirection, joinDirection);
  vec2 cbNormal = perpToward(normalize(cb), joinDirection);
  d = b + abNormal * halfLineWidth;
  e = b + cbNormal * halfLineWidth;
  bd = d - b;
  be = e - b;
  miter = normalize(bd + be);
  eIsRight = isRightOf(be, bd);
}

void calcJoinPoints(vec2 b, vec2 d, vec2 e, vec2 middlePoint, bool eIsRight) {
  tp[0] = iif(eIsRight, d, b);
  tp[1] = iif(eIsRight, d, b);
  tp[2] = iif(eIsRight, b, d);
  tp[3] = iif(eIsRight, middlePoint, e);
  tp[4] = iif(eIsRight, e, middlePoint);
}

vec2 addBevel(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, int vertexIndex) {
  vec2 d, e, bd, be, miter;
  bool eIsRight;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be, miter, eIsRight);

  // Find the midpoint between d and e.
  vec2 midPoint = (d + e) * 0.5;

  calcJoinPoints(b, d, e, midPoint, eIsRight);
  return iif(capFlags[JOIN_BEVEL], tp[vertexIndex - 5], emptyVertex);
}

vec2 addRoundJoin(vec2 a, vec2 b, vec2 c, vec2 ab, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isCircle, inout vec2 center, inout vec2 radiusDir) {
  vec2 d, e, bd, be, miter;
  bool eIsRight;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be, miter, eIsRight);
  bool isActive = capFlags[JOIN_ROUND];
  vec2 circleEdge = b + miter * (lineWidth * 0.5);

  vec2 sD = modelToScreen(d);
  vec2 circleEdgeS = modelToScreen(circleEdge);
  isCircle = iif(isActive, 1.0, isCircle);
  center = iif(isActive, modelToScreen(b), center);
  radiusDir = iif(isActive, circleEdgeS - center, radiusDir);

  // Find the intersection of miter and the line (2D sdfPlane) going through d.
  vec2 miterPoint = LineLineIntersection(b, miter, d, ab);

  calcJoinPoints(b, d, e, miterPoint, eIsRight);
  return iif(isActive, tp[vertexIndex - 5], emptyVertex);
}

vec2 addMiter(vec2 a, vec2 b, vec2 c, vec2 ab, float lineWidth, float miterLimit, int miterFallback, int vertexIndex) {
  vec2 d, e, bd, be, miter;
  bool eIsRight;
  joinCommon(a, b, c, ab, lineWidth, d, e, bd, be, miter, eIsRight);

  // Find the intersection of miter and the line (2D sdfPlane) going through d.
  vec2 miterPoint = LineLineIntersection(b, miter, d, ab);

  bool useFallback = length(miterPoint - b) > miterLimit;
  capFlags[miterFallback] = capFlags[miterFallback] || (useFallback && capFlags[JOIN_MITER]);
  capFlags[JOIN_MITER] = capFlags[JOIN_MITER] && !useFallback;

  calcJoinPoints(b, d, e, miterPoint, eIsRight);
  return iif(capFlags[JOIN_MITER], tp[vertexIndex - 5], emptyVertex);
}

vec2 addCap(int cap, vec2 point, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isCircle, inout vec2 center, inout vec2 radiusDir) {
  vec2 offset = lineTemplate[vertexIndex].xy;
  vec2 buttOffset = vec2(0.0, offset.y);

  return addVerticies(capFlags[CAP_BUTT], buttOffset, point, direction, leftNormal, lineWidth, vertexIndex)
    + addVerticies(capFlags[CAP_SQUARE], offset, point, direction, leftNormal, lineWidth, vertexIndex)
    + addVerticies(capFlags[CAP_ROUND], offset, point, direction, leftNormal, lineWidth, vertexIndex)
    + processRoundCap(point, direction, leftNormal, lineWidth, vertexIndex, isCircle, center, radiusDir);
}

vec2 addCapOrJoin(int cap, float miterLimit, int miterFallback, vec2 point, vec2 a, vec2 b, vec2 c, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex, inout float isCircle, inout vec2 center, inout vec2 radiusDir) {
  return addMiter(a, b, c, direction, lineWidth, miterLimit, miterFallback, vertexIndex)
    + addRoundJoin(a, b, c, direction, leftNormal, lineWidth, vertexIndex, isCircle, center, radiusDir)
    + addBevel(a, b, c, direction, lineWidth, vertexIndex)
    + addCap(cap, point, direction, leftNormal, lineWidth, vertexIndex, isCircle, center, radiusDir);
}

vec2 line2d(vec2 a, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex) {
  vec2 offset = lineTemplate[vertexIndex].xy;
  return a + direction * offset.x + leftNormal * (lineWidth * offset.y);
}

vec2 _line2d(vec2 a, vec2 direction, vec2 leftNormal, float lineWidth, int vertexIndex) {
  vec2 vertex = line2d(a, direction, leftNormal, lineWidth, vertexIndex);
  return iif(capFlags[CAP_LINE], vertex, emptyVertex);
}

vec2 line2d(vec2 a, vec2 b, float lineWidth, int cap, int vertexIndex, inout float isCircle, inout vec2 center, inout vec2 radiusDir) {
  int section = int(lineTemplate[vertexIndex].z);

  vec2 direction = b - a;
  vec2 normalizedDirection = normalize(direction);
  vec2 leftNormal = perp(normalizedDirection);
  setCapFlag(cap, section == 0);
  vec2 startVertex = addCap(cap, a, -normalizedDirection, leftNormal, lineWidth, vertexIndex, isCircle, center, radiusDir);
  setCapFlag(CAP_LINE, section == 1);
  vec2 lineVertex = _line2d(a, direction, leftNormal, lineWidth, vertexIndex);
  setCapFlag(cap, section == 2);
  vec2 endVertex = addCap(cap, b, normalizedDirection, leftNormal, lineWidth, vertexIndex, isCircle, center, radiusDir);
  return startVertex + lineVertex + endVertex;
}

vec3 linepath2d(vec2 a, vec2 b, vec2 c, float lineWidth, int lineCap, int lineJoin, float miterLimit, int miterFallback, int instance, int instanceCount, int vertexIndex, inout float isCircle, inout vec2 center, inout vec2 radiusDir) {
  int section = int(lineTemplate[vertexIndex].z);
  int startCap = iif(instance == 0, lineCap, CAP_BUTT);
  int endCap = iif(instance == instanceCount - 1, lineCap, lineJoin);

  vec2 direction = b - a;
  vec2 normalizedDirection = normalize(direction);
  vec2 leftNormal = perp(normalizedDirection);
  setCapFlag(startCap, section == 0);
  vec2 startVertex = addCap(startCap, a, -normalizedDirection, leftNormal, lineWidth, vertexIndex, isCircle, center, radiusDir);
  setCapFlag(CAP_LINE, section == 1);
  vec2 lineVertex = _line2d(a, direction, leftNormal, lineWidth, vertexIndex);
  setCapFlag(endCap, section == 2);
  vec2 endVertex = addCapOrJoin(endCap, miterLimit, miterFallback, b, a, b, c, normalizedDirection, leftNormal, lineWidth, vertexIndex, isCircle, center, radiusDir);
  vec2 vertex = startVertex + lineVertex + endVertex;
  // Fudge the z component to allow removal of rear faces in transparent lines.
  // NEEDS SOME WORK: Does not play well with other objects.
  float z = iif(section == 1, float(instanceCount - instance) * 0.00001, 0.0);
  z = 0.0;
  return vec3(vertex, z);
}""")

    ("lines2d4-vertex", """
// lines2d4-vertex
#include line-consts
#include sdf-consts
#include coordinate-conversion-vertex
#include line-utils
#line 1396

vec4 offsets[] = vec4[4] (
  vec4(0.0,  1.1, -1.0, 0.0), // x,y: offset. z: direction to add half line width for caps.
  vec4(0.0, -1.1, -1.0, 0.0), // z: add offset for miter.
  vec4(1.0,  1.1,  1.0, 1.0),
  vec4(1.0, -1.1,  1.0, 1.0)
);

SdfLineParams createLinePathParams(int instance, int instanceCount, float miterLimit, int miterFallback, int lineCap, int lineJoin, vec2 a, vec2 b, vec2 c, float hlw, out float lineLength, out vec2 rotation) {
  vec2 ab = b - a;
  vec2 cb = b - c;
  lineLength = length(ab);
  vec2 abDir = normalize(ab);
  vec2 abNormal = perp(abDir);
  vec2 cbNormal = perp(normalize(cb));
  vec2 startBottomLeft = a - abDir * hlw + abNormal * -hlw;
  vec2 endTopRight = b + abDir * hlw + abNormal * hlw;
  vec2 bottomLeft = a + abNormal * -hlw;
  vec2 topRight = b + abNormal * hlw;

  vec2 joinDirection = ab + cb;
  abNormal = faceToward(abNormal, joinDirection);
  cbNormal = faceToward(cbNormal, joinDirection);
  vec2 d = b + cbNormal * hlw;
  vec2 e = b + abNormal * hlw;
  vec2 bd = d - b;
  vec2 be = e - b;
  vec2 miter = normalize(bd + be);

  // Find the intersection of miter and the line (2D sdfPlane) going through d.
  vec2 miterPoint = LineLineIntersection(b, miter, d, cb);

  float lineAngle = atan(ab.y, ab.x);
  rotation = vec2(cos(lineAngle), sin(lineAngle));
  lineAngle = -lineAngle; // TODO: Figure out what's going on here with negative.

  vec2 bS = modelToScreen(b);
  vec2 miterPointS = modelToScreen(miterPoint);

  float isLastInstance = float(instance == instanceCount - 1);
  int startCap = int(mix(float(CAP_BUTT), float(lineCap), float(instance == 0)));
  int endCap = int(mix(float(lineJoin), float(lineCap), isLastInstance));
  bool useFallback = isLastInstance == 0.0 && endCap == JOIN_MITER && length(miterPointS - bS) > miterLimit;
  endCap = int(mix(float(endCap), float(miterFallback), useFallback));

  float dIsRight = float(isRightOf(bd, be));

  SdfLineParams result;
  result.startCap = startCap;
  result.endCap = endCap;
  result.position = modelToScreen(a);
  result.rotation = vec2(cos(lineAngle), sin(lineAngle));
  result.startBottomLeft = modelToScreen(startBottomLeft);
  result.endTopRight = modelToScreen(endTopRight);
  result.bottomLeft = modelToScreen(bottomLeft);
  result.topRight = modelToScreen(topRight);
  result.join1 = bS;
  result.join2 = modelToScreen(mix(e, d, dIsRight));
  result.join3 = modelToScreen(mix(d, e, dIsRight));
  result.miterPoint = miterPointS;
  result.hasPrior = float(instance > 0);
  result.hasNext = float(instance < instanceCount - 1);
  return result;
}

vec2 linepath2d(vec2 priorA, vec2 a, vec2 b, vec2 c, float lineWidth, int lineCap, int lineJoin, float miterLimit, int miterFallback, int instance, int instanceCount, int vertexIndex, float aliasWidth, float worldScale, out SdfLineParams lineParams, out SdfLineParams priorLineParams, out SdfLineParams nextLineParams) {
  vec2 pts[] = vec2[] (priorA, a, b, c );
  float miterLimitS = miterLimit * worldScale;
  float hlw = lineWidth * 0.5;

  vec2 rotation;
  float lineLength;
  priorLineParams = createLinePathParams(instance - 1, instanceCount, miterLimitS, miterFallback, lineCap, lineJoin, priorA, a, b, hlw, lineLength, rotation);
  nextLineParams = createLinePathParams(instance + 1, instanceCount, miterLimitS, miterFallback, lineCap, lineJoin, b, c, vec2(0.0, 0.0), hlw, lineLength, rotation);
  lineParams = createLinePathParams(instance, instanceCount, miterLimitS, miterFallback, lineCap, lineJoin, a, b, c, hlw, lineLength, rotation);
  lineParams.aliasWidth = aliasWidth;

  vec4 offset = offsets[vertexIndex];
  float miterOffset = mix(0.0, offset.w, lineParams.hasNext == 1.0);
  float startHlw = mix(0.0, -hlw, offset.x < 1.0);
  float endHlw = mix(0.0, hlw, offset.x > 0.0 && lineParams.hasNext == 0.0);
  vec2 v = offset.xy * vec2(lineLength, hlw) + vec2(startHlw + endHlw + ((miterLimit * 1.7) * miterOffset), 0.0);
  v = rotate(v, rotation) + a;
  return v;
}""")

    ("vector2d", """
#include vec2

const vec2 vecTemplate[] = vec2[9](
  vec2(0.0, -0.5),
  vec2(0.85, -0.5),
  vec2(0.0,  0.5),

  vec2(0.85, -0.5),
  vec2(0.85,  0.5),
  vec2(0.0,   0.5),

  vec2(0.85, -1.0),
  vec2(1.0,  0.0),
  vec2(0.85,  1.0)
);

vec2 vector2d(vec2 vec, float lineWidth, int vertexID, out float isTip) {
  isTip = step(7.0, float(vertexID));
  vec2 leftNormal = normalize(perp(vec));
  vec2 offset = vecTemplate[vertexID];
  return vec2(0.0) + vec * offset.x + leftNormal * (lineWidth * offset.y);
 }""")

    ("noise-fractal-params", """
uniform noiseFractalParams {
  int octaves;
  vec4 frequency;
  float amplitude;
  float lacunarity;
  float gain;
  float noiseTime;
};""")

    ("noise-outvars", """
flat out vec4 v_noiseStart;
flat out vec3 v_noiseDim;
flat out vec2 v_noiseCenterLeft;
flat out vec2 v_noiseCenterRight;
flat out vec2 v_noiseCenterTop;
flat out vec2 v_noiseCenterBottom;
flat out float v_noiseRange;""")

    ("noise-invars", """
uniform sampler2D permTexture;
flat in vec4 v_noiseStart;
flat in vec3 v_noiseDim;
flat in vec2 v_noiseCenterLeft;
flat in vec2 v_noiseCenterRight;
flat in vec2 v_noiseCenterTop;
flat in vec2 v_noiseCenterBottom;
flat in float v_noiseRange;""")

    ("perlin-noise", """
#include conditionals
#line 1187

vec2 add(vec2 v, float x, float y) { return vec2(v.x + x, v.y + y); }
vec3 add(vec3 v, float x, float y, float z) { return vec3(v.x + x, v.y + y, v.z + z); }
vec4 add(vec4 v, float x, float y, float z, float w) { return vec4(v.x + x, v.y + y, v.z + z, v.w + w); }

float fade(float t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

int perm(int idx) { return int(texelFetch(permTexture, ivec2(idx, 0), 0).r * 255.0) & 0xFF; }
int perm(int x, int y) { return perm(perm(x) + y); }
int perm(int x, int y, int z) { return perm(perm(perm(x) + y) + z); }

float grad(int hash, float p) {
  return float[2] (-p, p)[hash & 1];
}

float grad(int hash, vec2 p) {
  // TODO: Test if this is more efficient than using a switch.
  return float[4] (
     p.x + p.y,
    -p.x + p.y,
     p.x - p.y,
    -p.x - p.y
  )[hash & 3];
}

float grad(int hash, vec3 p) {
  // TODO: This is probably less efficient than using a switch. Test.
  return float[16] (
     p.x + p.y,
    -p.x + p.y,
     p.x - p.y,
    -p.x - p.y,

     p.x + p.z,
    -p.x + p.z,
     p.x - p.z,
    -p.x - p.z,
     p.y + p.z,
    -p.y + p.z,
     p.y - p.z,
    -p.y - p.z, // 12th
     p.x + p.y,
    -p.x + p.y,
    -p.y + p.z,
    -p.y - p.z
  )[hash & 0xF];
}

float grad(int hash, vec4 p) {
  // TODO: This is probably less efficient than using a switch. Test.
  return float[32] (
     p.x +  p.y +  p.w,
    -p.x +  p.y +  p.w,
     p.x + -p.y +  p.w,
    -p.x + -p.y +  p.w,
     
     p.x +  p.z +  p.w,
    -p.x +  p.z +  p.w,
     p.x + -p.z +  p.w,
    -p.x + -p.z +  p.w,

     p.y +  p.z +  p.w,
    -p.y +  p.z +  p.w,
     p.y + -p.z +  p.w,
    -p.y + -p.z +  p.w,

     p.x +  p.y + -p.w,
    -p.x +  p.y + -p.w,
     p.x + -p.y + -p.w,
    -p.x + -p.y + -p.w,

     p.x +  p.z + -p.w,
    -p.x +  p.z + -p.w,
     p.x + -p.z + -p.w,
    -p.x + -p.z + -p.w,

     p.y +  p.z + -p.w,
    -p.y +  p.z + -p.w,
     p.y + -p.z + -p.w,
    -p.y + -p.z + -p.w,

     p.x +  p.y +  p.z,
    -p.x +  p.y +  p.z,
     p.x + -p.y + -p.z,
    -p.x + -p.y + -p.z,

     p.x +  p.y + -p.z,
    -p.x +  p.y + -p.z,
     p.x + -p.y +  p.z,
    -p.x + -p.y +  p.z
   )[hash & 0x1F];
}

float _noise(float p) {
  float p0 = fract(p);
  float p1 = p0 - 1.0;
  
  int idx = int(floor(p));
  int v0 = perm(idx);
  int v1 = perm(idx + 1);

  float fx = fade(p0);
  return mix(grad(v0, p0), grad(v1, p1), fx);
}

float _noise(vec2 p) {
  vec2 p0 = fract(p);            // By subtracting, we are actually
  vec2 p1 = add(p0, -1.0,  0.0); // Calculating the vector from each
  vec2 p2 = add(p0,  0.0, -1.0); // corner to p.
  vec2 p3 = add(p0, -1.0, -1.0);

  ivec2 id = ivec2(floor(p));
  int v0 = perm(id.x    , id.y    );
  int v1 = perm(id.x + 1, id.y    );
  int v2 = perm(id.x    , id.y + 1);
  int v3 = perm(id.x + 1, id.y + 1);

  float fx = fade(p0.x);
  float fy = fade(p0.y);
  float a = mix(grad(v0, p0), grad(v1, p1), fx);
  float b = mix(grad(v2, p2), grad(v3, p3), fx);
  return mix(a, b, fy);
}

float _noise(vec3 p) {
  vec3 p0 = fract(p);
  vec3 p1 = add(p0, -1.0,  0.0,  0.0);
  vec3 p2 = add(p0,  0.0, -1.0,  0.0);
  vec3 p3 = add(p0, -1.0, -1.0,  0.0);
  vec3 p4 = add(p0,  0.0,  0.0, -1.0);
  vec3 p5 = add(p0, -1.0,  0.0, -1.0);
  vec3 p6 = add(p0,  0.0, -1.0, -1.0);
  vec3 p7 = add(p0, -1.0, -1.0, -1.0);

  ivec3 id = ivec3(floor(p));
  int v0 = perm(id.x    , id.y    , id.z    );
  int v1 = perm(id.x + 1, id.y    , id.z    );
  int v2 = perm(id.x    , id.y + 1, id.z    );
  int v3 = perm(id.x + 1, id.y + 1, id.z    );
  int v4 = perm(id.x    , id.y    , id.z + 1);
  int v5 = perm(id.x + 1, id.y    , id.z + 1);
  int v6 = perm(id.x    , id.y + 1, id.z + 1);
  int v7 = perm(id.x + 1, id.y + 1, id.z + 1);

  float fx = fade(p0.x);
  float fy = fade(p0.y);
  float fz = fade(p0.z);
  float a1 = mix(grad(v0, p0), grad(v1, p1), fx);
  float b1 = mix(grad(v2, p2), grad(v3, p3), fx);
  float a2 = mix(grad(v4, p4), grad(v5, p5), fx);
  float b2 = mix(grad(v6, p6), grad(v7, p7), fx);
  float c1 = mix(a1, b1, fy);
  float c2 = mix(a2, b2, fy);
  return mix(c1, c2, fz);
}

float noise(float p) {
  float freq = frequency.x;
  float amp = amplitude;
  float result = 0.0;
  int oct = max(octaves, 1);

  for (int i = 0; i < oct; i++) {
    result += _noise(p * freq) * amp;
    freq *= lacunarity;
    amp *= gain;
  }

  return result;
}

float noise(vec2 p) {
  vec2 freq = frequency.xy;
  float amp = amplitude;
  float result = 0.0;
  int oct = max(octaves, 1);

  for (int i = 0; i < oct; i++) {
    result += _noise(p * freq) * amp;
    freq *= lacunarity;
    amp *= gain;
  }

  return result;
}

float noise(vec3 p) {
  vec3 freq = frequency.xyz;
  float amp = amplitude;
  float result = 0.0;
  int oct = max(octaves, 1);

  for (int i = 0; i < oct; i++) {
    result += _noise(p * freq) * amp;
    freq *= lacunarity;
    amp *= gain;
  }

  return result;
}

float turbulence1(vec2 pos, float loFreq, float hiFreq) {
  float t = 0.0;
  vec2 p = vec2(pos.x + 123.456, pos.y);

  for (float freq = loFreq; freq < hiFreq; freq *= 2.0) {
    t += abs(_noise(p)) / freq;
    p *= 2.0;
  }

  return t;// - 0.3; // Avg 0.0.
}

float turbulence(vec2 pos, float pixelSize) {
  float t = 0.0;
  vec2 p = pos.xy;

  for (float scale = 1.0; scale > pixelSize; scale *= 0.5) {
    p /= scale;
    t += abs(_noise(p)) * scale;
  }

  return t;// - 0.3;
}

float turbulence(vec3 pos, float pixelSize) {
  float t = 0.0;
  vec3 p = pos.xyz;

  for (float scale = 1.0; scale > pixelSize; scale *= 0.5) {
    p /= scale;
    t += abs(_noise(p)) * scale;
  }

  return t;// - 0.3;
}
  """)
  ]
  |> List.iter addInclude

  let shaderIncludeVertexTexture2d0 = """
in vec2 a_texCoords0;
out vec2 v_texCoords0;
"""

  let shaderIncludeUseVertexTexture2d0 = """
  gl_Position *= vec4(a_texCoords0 / a_texCoords0, 1.0, 1.0);
"""

  let shaderIncludeFragmentTexture2d0 = """
uniform sampler2D u_texture0;
in vec2 v_texCoords0;
"""

  let shaderIncludeUseFragmentTexture2d0 = """
  glFragColor *= texture(u_texture0, v_texCoords0);
"""

  for i in [0 .. 15] do
    addShaderInclude $"vertex-texture2d{i}" (shaderIncludeVertexTexture2d0.Replace("0", $"{i}"))
    addShaderInclude $"use-vertex-texture2d{i}" (shaderIncludeUseVertexTexture2d0.Replace("0", $"{i}"))
    addShaderInclude $"fragment-texture2d{i}" (shaderIncludeFragmentTexture2d0.Replace("0", $"{i}"))
    addShaderInclude $"use-fragment-texture2d{i}" (shaderIncludeUseFragmentTexture2d0.Replace("0", $"{i}"))

  [
    ("emptyVertex", """#version 300 es
// emptyVertex
void main() {
  gl_Position = vec4(0.0);
}""")

    ("globalVertex2d", """#version 300 es
// globalVertex2d
#include precision
#include global-ubo

void main() {
  gl_Position = vec4(0.0);
}""")

    ("sharedCameraVertex2d", """#version 300 es
// sharedCameraVertex2d
#include precision
#include camera-ubo

void main() {
  gl_Position = projMat * viewMat * vec4(0.0);
}""")

    ("fullSizeVertex2d", """#version 300 es
// fullSizeVertex2d
#include precision
#include global-ubo
#include path-outvars

vec2 points[] = vec2[4] (
  vec2(-1.0, -1.0),
  vec2(1.0, -1.0),
  vec2(-1.0, 1.0),
  vec2(1.0, 1.0)
);

void main() {
  int vertexID = gl_VertexID % 4;

  gl_Position = vec4(points[vertexID], 0.0, 1.0);
  // vec4 c[] = vec4[4](
  //   vec4(1.0, 0.0, 0.0, 1.0),
  //   mix(vec4(1.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 1.0, 1.0), 0.5),
  //   mix(vec4(1.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 1.0, 1.0), 0.5),
  //   vec4(0.0, 0.0, 1.0, 1.0)
  // );
  // v_fillColor = c[vertexID];
}""")

    ("quadStripVertex2d", """#version 300 es
// quadStripVertex2d
#include precision
#include quad-params
#include quad-outvars
#include quad-points-strip
#include coordinate-conversion-vertex
#include vec2

void main() {
  vec2[] points = quadPointsStrip;
#include calc-quad-vertexid
#include calc-scaled-quad-points
#include calc-quad-dim
#include calc-quad-center
#include calc-quad-rotation
#include calc-quad-vertex
#include set-quad-position
#include set-quad-params
}""")

    ("quadStripRightVertex2d", """#version 300 es
// quadStripRightVertex2d
#include precision
#include quad-params
#include quad-outvars
#include quad-points-strip-right
#include coordinate-conversion-vertex
#include vec2

void main() {
  vec2[] points = quadPointsStripRight;
#include calc-quad-vertexid
#include calc-scaled-quad-points
#include calc-quad-dim
#include calc-quad-center
#include calc-quad-rotation
#include calc-quad-vertex
#include set-quad-position
#include set-quad-params
}""")

    ("sdf", """#version 300 es
// sdf
#include precision
#include global-ubo
#include math-consts
#include line-consts
#include path-outvars
#include sdf-consts
#include sdf-outvars
#include coordinate-conversion-vertex
#include vec2
#include lines2d4-vertex
#line 1865

uniform int instanceCount;

in vec2 p1;
in vec2 p2;
in vec2 p3;
in vec2 p4;

void main() {
  int lineCap;
  lineCap = CAP_BUTT;
  lineCap = CAP_SQUARE;
  lineCap = CAP_ROUND;

  int lineJoin;
  lineJoin = JOIN_ROUND;
  // lineJoin = JOIN_BEVEL;
  lineJoin = JOIN_MITER;

  int vertexIndex = gl_VertexID;
  int triangleID = int(gl_VertexID >= 3);
  int instance = gl_InstanceID;

  float worldScale = 66.66;
  float lineWidthScale = 1.0 / worldScale;
  float lineWidth = 80.0 * lineWidthScale;
  float hlw = lineWidth * 0.5;
  float strokeWidth = lineWidth * worldScale;
  strokeWidth *= v_scale;

  float miterLimit = 2.0;
  float miterLimitS = miterLimit * worldScale;
  int miterFallback = JOIN_BEVEL;

  vec2 priorA = p1;
  vec2 a = p2;
  vec2 b = p3;
  vec2 c = p4;
  
  float angle = fract(time * 0.055) * TWO_PI;
  if (instance == 0) {
    b = rotate(b, vec2(cos(angle), sin(angle)));
  } else {
    a = rotate(a, vec2(cos(angle), sin(angle)));
  }

  vec2 vertex = linepath2d(priorA, a, b, c, lineWidth, lineCap, lineJoin, miterLimit, miterFallback, instance, instanceCount, vertexIndex, worldScale, v_sdfLineParams, v_sdfPriorLineParams, v_sdfNextLineParams);

  gl_Position = modelToClip(vertex);
  v_aliasWidth = 2.0;

  v_strokeWidth = strokeWidth;
  v_strokeColor = vec4(0.0, 1.0, 0.0, 0.2);
  v_strokeColor = vec4(1.0, 0.5, 1.0, 0.4);
  v_fillColor = vec4(1.0, 0.0, 0.0, 1.0);
  if (instanceCount < 2) v_strokeColor = vec4(0.0, 1.0, 0.0, 0.2);
  // if (angle > 0.0) v_fillColor = vec4(0.0, 0.0, 0.0, 1.0);
  // if (triangleID == 1) v_fillColor = vec4(0.0, 0.0, 1.0, 1.0);
}""")
  ]
  |> List.iter addVertex

  [
    ("sdf", """#version 300 es
// sdf
#include precision
#include global-ubo
#include transparent-color
#include path-invars
#include out-color-fragment
#include sdf-consts
#include sdf-invars
#include sdf-linepath-fragment
#line 1910

void main() {
  vec4 color = sdfDrawLinePath(
    v_sdfLineParams,
    v_sdfPriorLineParams,
    v_sdfNextLineParams,
    v_strokeColor,
    v_aliasWidth,
    resolution * 0.5);

  vec2 p = gl_FragCoord.xy;
  // float dist = length(p - v_sdfLineParams.join1);
  // if (dist <= 5.0) color = vec4(0.5, 0.0, 0.0, 1.0);
  // dist = length(p - v_sdfLineParams.join2);
  // if (dist <= 5.0) color = vec4(0.0, 1.0, 0.0, 1.0);
  // dist = length(p - v_sdfLineParams.miterPoint);
  // if (dist <= 5.0) color = vec4(0.0, 0.0, 1.0, 1.0);
  // dist = length(p - v_sdfLineParams.join3);
  // if (dist <= 5.0) color = vec4(1.0, 1.0, 0.0, 1.0);

  // float dist = length(p - v_sdfLineParams.startBottomLeft);
  // if (dist <= 5.0) color = vec4(0.5, 0.0, 0.0, 1.0);
  // dist = length(p - v_sdfLineParams.bottomLeft);
  // if (dist <= 5.0) color = vec4(0.0, 1.0, 0.0, 1.0);
  // dist = length(p - v_sdfLineParams.topRight);
  // if (dist <= 5.0) color = vec4(0.0, 0.0, 1.0, 1.0);
  // dist = length(p - v_sdfLineParams.endTopRight);
  // if (dist <= 5.0) color = vec4(1.0, 1.0, 0.0, 1.0);

  glFragColor = color;
}""")

    ("emptyFragment", """#version 300 es
// emptyFragment
#include precision
#include out-color-fragment

void main() {
  glFragColor = vec4(0.0);
}""")

    ("simpleFragment2d", """#version 300 es
// simpleFragment2d
#include precision
#include path-invars
#include out-color-fragment

void main() {
  glFragColor = v_fillColor;
}""")

    ("simpleQuadFragment2d", """#version 300 es
// simpleQuadFragment2d
#include precision
#include quad-common
#include quad-invars
#include out-color-fragment

void main() {
  glFragColor = v_params.fillColor;
}""")

    ("simpleQuadSdfFragment2d", """#version 300 es
// simpleQuadSdfFragment2d
#include precision
#include global-ubo
#include quad-common
#include quad-invars
#include out-color-fragment
#include sdf-utils

float sdfRect(vec2 p, QuadParams params) {
  vec2 size = params.halfSize;
  return max(abs(p.x) - size.x, abs(p.y) - size.y);
}

void main() {
  vec2 halfResolution = resolution * 0.5;
  vec2 p = sdfToLocalOrient(gl_FragCoord.xy, v_params);

  vec4 color;
  color = sdfDraw(sdfRect(p, v_params), v_params);

  glFragColor = color;
}""")

    ("circleFragment2d", """#version 300 es
// circleFragment2d
#include precision
#include path-invars
#include circle-invars
#include out-color-fragment
#include circles-fragment

void main() {
#include init-color
#include circle-color-fragment
#include set-out-color
}""")

    ("circleDiscardFragment2d", """#version 300 es
// circleDiscardFragment2d
#include precision
#include path-invars
#include circle-invars
#include out-color-fragment
#include circles-fragment

void main() {
#include init-color
#include circle-color-discard-fragment
#include set-out-color
}""")

    ("semicircleFragment2d", """#version 300 es
// semicircleFragment2d
#include precision
#include path-invars
#include circle-invars
#include out-color-fragment
#include circles-fragment

void main() {
#include init-color
#include semicircle-color-fragment
#include set-out-color
}""")

    ("semicircleDiscardFragment2d", """#version 300 es
// semicircleDiscardFragment2d
#include precision
#include path-invars
#include circle-invars
#include out-color-fragment
#include circles-fragment

void main() {
#include init-color
#include semicircle-color-discard-fragment
#include set-out-color
}""")

    ("semicircleWedgeFragment2d", """#version 300 es
// semicircleWedgeFragment2d
#include precision
#include path-invars
#include circle-invars
#include out-color-fragment
#include circles-fragment

void main() {
#include init-color
#include semicircle-color-fragment
#include wedge-color-fragment
#include set-out-color
}""")

    ("semicircleWedgeDiscardFragment2d", """#version 300 es
// semicircleWedgeDiscardFragment2d
#include precision
#include path-invars
#include circle-invars
#include out-color-fragment
#include circles-fragment

void main() {
#include init-color
#include semicircle-color-discard-fragment
#include wedge-color-discard-fragment
#include set-out-color
}""")

    ("linepath2d-fragment", """#version 300 es
// linepath2d-fragment
#include precision
#include global-ubo
#include transparent-color
#include path-invars
#include out-color-fragment
#include sdf-consts
#include sdf-line-invars
#include sdf-linepath-fragment
#line 2085

void main() {
  vec4 color = sdfDrawLinePath(
    v_sdfLineParams,
    v_sdfPriorLineParams,
    v_sdfNextLineParams,
    v_strokeColor,
    v_aliasWidth);

  glFragColor = color;
}""")

    ("vectorFragment2d", """#version 300 es
// simpleQuadSdfFragment2d
#include precision
#include math-consts
#include global-ubo
#include quad-common
#include quad-invars
#include out-color-fragment
#include vec2
#include line-utils
#include sdf-utils
#line 2447

void calcSlopeIntercept(vec2 p1, vec2 p2, out float slope, out float xIntercept, out float yIntercept) {
  float run = (p2.x - p1.x);
  slope = (p2.y - p1.y) / run;
  slope = mix(slope, 1.0, run == 0.0);
  yIntercept = p1.y - p1.x * slope;
  xIntercept = yIntercept / slope;
}

void calcRiseRunIntercept(vec2 p1, vec2 p2, out float rise, out float run, out float xIntercept, out float yIntercept) {
  rise = (p2.y - p1.y);
  run = (p2.x - p1.x);
  float slope = rise / run;
  slope = mix(slope, 1.0, run == 0.0);
  yIntercept = p1.y - p1.x * slope;
  xIntercept = yIntercept / slope;
}

float planePointSlope(vec2 p, vec2 p1, vec2 p2) {
  float slope, xIntercept, yIntercept;
  calcSlopeIntercept(p1, p2, slope, xIntercept, yIntercept);
  float run = p2.x - p1.x;
  float result = p.y - p1.y - slope * p.x + slope * p1.x;
  // result = mix(result, p.x - p1.x, step(run, 0.0));
  if (run == 0.0) result = p1.x - p.x;
  return result;
}

float sdfPlaneStandard(vec2 p, vec2 p1, vec2 p2) {
  float rise, run, slope, xIntercept, yIntercept;
  calcRiseRunIntercept(p1, p2, rise, run, xIntercept, yIntercept);
  return -(run * p.y - rise * p.x - yIntercept);
}

float sdfPlane(vec2 p, vec2 p1, vec2 p2) {
  return cross(p - p1, p2 - p1);
}

float sdfPlaneNorm(vec2 p, vec2 p1, vec2 p2) {
  return cross(p - p1, normalize(p2 - p1));
}

float sdfPlaneDot(vec2 p, vec2 p1, vec2 p2) {
  vec2 normal = (perpRight(p2 - p1));
  return dot(p, normal);
}

float sdfPlaneDotNorm(vec2 p, vec2 p1, vec2 p2) {
  vec2 normal = normalize(perpRight(p2 - p1));
  return dot(p, normal);
}

// https://stackoverflow.com/questions/21087065/tangent-to-circle-from-external-point-p
vec4 calcTangents(vec2 center, float radius, vec2 p) {
  // Center at origin and make unit circle.
  vec2 n = (p - center) / radius;
  float xy = dot(n, n);

  // TODO: Equals check with epsilon.
  if (xy == 1.0) return vec4(p.x, p.y, p.x, p.y); // Point on circle, one tangent.
  if (xy < 1.0) return vec4(0.0, 0.0, 0.0, 0.0);  // Point in circle, no tangents.

  float d = n.y * sqrt(xy - 1.0);
  vec2 t1 = vec2((n.x - d) / xy, 0.0);
  vec2 t2 = vec2((n.x + d) / xy, 0.0);

  if (n.y != 0.0) {
    t1.y = center.y + radius * (1.0 - t1.x * n.x) / n.y;
    t2.y = center.y + radius * (1.0 - t2.x * n.x) / n.y;
  } else {
    d = radius * sqrt(1.0 - t1.x * t1.x);
    t1.y = center.y + d;
    t2.y = center.y - d;
  }

  // Recenter and scale.
  return vec4(center.x + radius * t1.x, t1.y, center.x + radius * t2.x, t2.y);
}

float sdfTripleCircle(vec2 p, vec2 pos, float radius, out float headRegion) {
  float radius2 = radius + radius;
  float leftOffsetX = sqrt(radius2 * radius2 - radius * radius);
  float centerOffsetX = (leftOffsetX - radius) * 0.5;
  vec2 topCenter = pos + vec2(0.0, radius);
  vec2 bottomCenter = pos + vec2(0.0, -radius);
  vec4 tangents = calcTangents(topCenter, radius, bottomCenter);
  vec2 b = tangents.xy;
  vec2 c = tangents.zw;
  float tanHeight = c.y - pos.y;

  float topCircle = sdfCircle(p, topCenter, radius);
  float bottomCircle = sdfCircle(p, bottomCenter, radius);
  float leftCircle = sdfCircle(p, pos + vec2(-leftOffsetX, 0.0), radius);
  float rightRect = sdfRect(p, vec2(c.x, pos.y - c.y), vec2(pos.x, pos.y + c.y));
  float headRect = sdfRect(p, vec2(c.x, pos.y - c.y), vec2(1.0, pos.y + c.y));
  headRegion = sdfDiff(headRect, leftCircle);
  return sdfDiff(rightRect, leftCircle, topCircle, bottomCircle);
  return rightRect;
  return sdfUnion(leftCircle, topCircle, bottomCircle, rightRect);
  return sdfUnion(leftCircle, topCircle, bottomCircle);
}

float sdfTripleCircle2(vec2 p, vec2 pos, float radius, float radius2, float pct, out float headRegion) {
  float hyp = radius + radius2;
  float leftOffsetX = sqrt(hyp * hyp - radius * radius) * pct;
  float centerOffsetX = (leftOffsetX - radius) * 0.5;
  vec2 topCenter = pos + vec2(0.0, radius);
  vec2 bottomCenter = pos + vec2(0.0, -radius);
  vec2 leftCenter = pos + vec2(-leftOffsetX, 0.0);
  vec2 ab = normalize(topCenter - leftCenter);
  vec2 c = leftCenter + ab * radius2;
  float th = c.y - pos.y;

  float topCircle = sdfCircle(p, topCenter, radius);
  float bottomCircle = sdfCircle(p, bottomCenter, radius);
  float leftCircle = sdfCircle(p, leftCenter, radius2);
  float leftCircle2 = sdfCircle(p, leftCenter, radius2 + 0.01);
  float rightRect = sdfRect(p, vec2(c.x, pos.y - th), vec2(pos.x, pos.y + th));
  float headRect = sdfRect(p, vec2(c.x, pos.y - th), vec2(pos.x + 1.0, pos.y + th));
  headRegion = sdfDiff(headRect, leftCircle2);
  return sdfDiff(rightRect, leftCircle, topCircle, bottomCircle);
  return sdfUnion(leftCircle, topCircle, bottomCircle);
  return rightRect;
  return sdfUnion(leftCircle, topCircle, bottomCircle, rightRect);
}

float sdfVector(vec2 p, QuadParams sp, out float body, out float head) {
  vec2 bottomLeft = vec2(-0.5, -0.5);
  vec2 topRight = vec2(0.5, 0.5);
  float height = sp.strokeWidth / 2.0;
  float headWidth = 0.25;
  float headStart = topRight.x - headWidth;
  float radius = sp.strokeWidth * 1.2;
  vec2 m = vec2(headStart - radius, 0.0);
  vec2 a = vec2(topRight.x, 0.0);
  vec4 tangents = calcTangents(m, radius, a);
  vec2 b = tangents.xy;
  vec2 c = tangents.zw;
  float leftPlane = bottomLeft.x - p.x;
  float rightPlane = b.x - p.x;
  float bodyRightPlane = p.x - headStart;
  float bodyLine = abs(p.y) - height;
  float s1 = cross(a - p, normalize(b - a));
  float s2 = cross(c - p, normalize(a - c));
  float leftCircle = sdfCircle(p, m, radius);
  float bodyLeftCircle = sdfCircle(p, m, radius - sp.aliasWidth);
  body = sdfIntersect(bodyLine, leftPlane, bodyRightPlane);
  // body = sdfDiff(body, sdfDiff(rightPlane, bodyLeftCircle));
  body = sdfDiff(body, sdfDiff(rightPlane, leftCircle));
  head = sdfDiff(rightPlane, leftCircle, s1, s2);
  return sdfUnion(body, head);
}

float sdfVector2(vec2 p, QuadParams sp, out float body, out float head) {
  float height = sp.strokeWidth * 0.5;
  vec2 centerRight = vec2(0.5, 0.0);
  float radius = height * 8.0;
  float headRegion;
  head = sdfTripleCircle2(p, centerRight, radius, radius * 1.5, 0.95, headRegion);
  body = abs(p.y) - height;
  body = sdfDiff(body, headRegion);
  return sdfUnion(body, head);
}

vec4 fill(vec2 p, float distance, vec4 fillColor, float antialias) {
  float len = length(p);
  float aliasWidth = fwidth(len) * 2.0;
  aliasWidth = fwidth(len);
  aliasWidth = mix(aliasWidth, 0.0, step(antialias, 0.0));
  float edgeDist = 0.0;
  float pct = smoothstep(edgeDist, aliasWidth, distance);
  pct = smoothstep(edgeDist - aliasWidth, edgeDist + aliasWidth, distance);
  vec4 edgeColor = mix(fillColor, transparent, pct);
  // edgeColor = mix(fillColor, vec4(0.3, 0.3, 0.3, 0.4), pct);
  vec4 color = fillColor;
  // color = mix(color, edgeColor, step(edgeDist, distance));
  color = mix(color, edgeColor, step(edgeDist - aliasWidth, distance));
  // color = mix(color, transparent, step(edgeDist + aliasWidth, distance));
  color = mix(color, transparent, step(0.0, distance) * step(aliasWidth, 0.0));
  return color;
}

vec4 border(vec2 p, float distance, vec4 fillColor, vec4 strokeColor, float strokeWidth) {
  float len = length(p);
  float aliasWidth = fwidth(len) * 2.0;
  float edgeDist = 0.0;
  float strokeDist = edgeDist - strokeWidth;
  float innerEdgeDist = strokeDist - aliasWidth;
  float pct = smoothstep(edgeDist, aliasWidth, distance);
  vec4 edgeColor = mix(strokeColor, transparent, pct);
  edgeColor = mix(strokeColor, vec4(0.3, 0.3, 0.3, 0.4), pct);
  pct = smoothstep(innerEdgeDist, strokeDist, distance);
  vec4 innerEdgeColor = mix(fillColor, strokeColor, pct);
  vec4 color = fillColor;
  color = mix(color, innerEdgeColor, step(innerEdgeDist, distance));
  color = mix(color, strokeColor, step(strokeDist, distance));
  color = mix(color, edgeColor, step(edgeDist, distance));
  return color;
}

float sdfGrid(vec2 p, QuadParams sp, out float axes, out float major, out float minor) {
  float axisWidth = 0.03 * 0.5;
  float majorWidth = 0.02 * 0.5;
  float minorWidth = 0.01 * 0.5;
  float mjdist = 0.1;
  float mndist = mjdist * 0.5;
  float xMid = abs(p.y);
  float yMid = abs(p.x);
  float xAxis = xMid - axisWidth * 0.5;
  float xMajor = abs(fract(xMid / mjdist)) * mjdist - majorWidth;
  float xMinor = abs(fract(xMid / mndist)) * mndist - minorWidth;
  float yAxis = yMid - axisWidth * 0.5;
  float yMajor = abs(fract(yMid / mjdist)) * mjdist - majorWidth;
  float yMinor = abs(fract(yMid / mndist)) * mndist - minorWidth;
  axes = min(xMid - axisWidth, yMid - axisWidth);
  major = sdfUnion(xMajor, yMajor);
  major = sdfDiff(major, axes);
  minor = sdfUnion(xMinor, yMinor);
  minor = sdfDiff(minor, axes, major);
  return sdfUnion(axes, major, minor);
}

float sdfGrid2(vec2 p, QuadParams sp, out float axes, out float major, out float minor) {
  float axisWidth = 0.03 * 0.5;
  float majorWidth = 0.02 * 0.5;
  float minorWidth = 0.01 * 0.5;
  float mjw = majorWidth;
  float mnw = minorWidth;
  float mjdist = 0.1;
  float mndist = mjdist * 0.5;
  float xMid = abs(p.y);
  float yMid = abs(p.x);
  float major1 = abs(fract(min(xMid - mjw, yMid - mjw) / mjdist)) * mjdist - mjw;
  float major2 = abs(fract(max(xMid - mjw, yMid - mjw) / mjdist)) * mjdist - mjw;
  float minor1 = abs(fract(min(xMid - mnw, yMid - mnw) / mndist)) * mndist - mnw;
  float minor2 = abs(fract(max(xMid - mnw, yMid - mnw) / mndist)) * mndist - mnw;
  axes = min(xMid - axisWidth, yMid - axisWidth);
  major = sdfUnion(major1, major2);
  major = sdfDiff(major, axes);
  minor = sdfUnion(minor1, minor2);
  minor = sdfDiff(minor, axes, major);
  return sdfUnion(axes, major, minor);
}

float sdfLines(vec2 p, QuadParams sp) {
  vec2 p1 = vec2(0.0, 0.0);
  vec2 p2 = vec2(0.5, 0.0);
  float angle = fract(time * 2.0 * 0.04) * TWO_PI;
  vec2 rot = vec2(cos(angle), sin(angle));
  p2 = rotate(p2, rot);
  vec4 temp = vec4(p1, p2);
  // p1 = temp.zw; p2 = temp.xy;
  vec2 norm = normalize(perpRight(p2 - p1));
  float radius = 0.25;
  vec2 c1 = norm * radius;
  float l1;
  // l1 = planePointSlope(p, p1, p2);
  // l1 = sdfPlaneStandard(p, p1, p2);
  l1 = sdfPlane(p, p1, p2);
  l1 = sdfPlaneNorm(p, p1, p2);
  // l1 = sdfPlaneDot(p, p1, p2);
  // l1 = sdfPlaneDotNorm(p, p1, p2);
  float l2 = abs(sdfPlaneNorm(p, c1, p2));
  return sdfUnion(l1, l2, sdfCircle(p, c1, radius));
}

float sdfLerpX(vec2 p, float d1, float d2, float x1, float x2) {
  float w = x2 - x1;
  float t = p.x / w;
  t = t * t * t;
  t = 0.7;
  return mix(d1, d2, t);
}

float sdfTemp(vec2 p, QuadParams sp, out float shape1, out float shape2) {
  float height = sp.strokeWidth * 0.5;
  vec2 centerRight = vec2(0.5, 0.0);
  vec2 p1 = vec2(-0.25, -0.25);
  vec2 p2 = vec2(0.25, 0.25);
  vec2 p3 = vec2(0.4, 0.0);
  p3 = centerRight + vec2(-0.365, 0.0);
  vec2 c1 = (p1 + p2) * 0.5;
  vec2 c2 = vec2(0.05, 0.0);
  // c2 = centerRight;
  float r1 = height * 5.5;
  float s1 = sdfRect(p, p1, p2);
  float circle = sdfCircle(p, c2, r1);
  float l1 = centerRight.x - 0.35 - p.x;
  float l2 = sdfPlaneNorm(p, p3, vec2(c2.x,   height * 0.005));
  float l3 = -sdfPlaneNorm(p, p3, vec2(c2.x, -height * 0.005));
  float s2 = sdfIntersect(l1, l2, l3);
  float bodyLine = abs(p.y) - height;
  // bodyLine = sdfIntersect(bodyLine, -l1);
  float head = sdfLerpX(p, circle, s2, c2.x, centerRight.x);
  float headRegion;
  float tc;
  // tc = sdfTripleCircle(p, centerRight, height * 8.0, headRegion);
  float radius = height * 8.0;
  tc = sdfTripleCircle2(p, centerRight, radius, radius * 1.5, 0.95, headRegion);
  bodyLine = sdfDiff(bodyLine, headRegion);
  shape1 = bodyLine;
  shape2 = tc;
  // shape1 = 10.0;
  return sdfUnion(shape1, shape2);
  return tc;
  return sdfLerpX(p, circle, s2, c2.x, centerRight.x);
  return s2;
  return sdfLerpX(p, s1, circle, c2.x, c1.x);
  return sdfLerpX(p, s1, circle, c1.x, c2.x);
  return sdfUnion(s1, circle);
}

float easeInQuad(float t) { return t * t; }
float easeInCubic(float t) { return t * t * t; }
float easeInQuartic(float t) { return t * t * t * t; }
float easeOutQuad(float t) { t = 1.0 - t; return 1.0 - (t * t); }
float easeOutCubic(float t) { t = 1.0 - t; return 1.0 - (t * t * t); }
float easeOutQuartic(float t) { t = 1.0 - t; return 1.0 - (t * t * t * t); }

float easeInBack(float t) {
  const float s = 1.70158;
  return t * t * ((s + 1.0) * t - s);
}

float easeInElastic(float t) {
    return t == 0.0 ? 0.0
      : t == 1.0 ? 1.0
      : (0.04 - 0.04 / t) * sin(25.0 * t) + 1.0;
}

float sdfDistToLerpSegment(vec2 p, vec2 a, vec2 b, float dist, float t, float tx, float ty) {
  if (t <= 0.0) return dist;
  if (t >= 1.0) return dist;

  vec2 normal = perp(b - a);
  normal = normalize(normal);
  a = vec2(mix(a.x, b.x, tx), mix(a.y, b.y, ty));
  float d = dot(normal, a);
  return dot(normal, p) - d;
}

float calcLerpOffset(vec2 a, vec2 b, float t, float tx, float ty) {
  float len = length(b - a);
  vec2 dir = vec2(1.0, 1.0);
  vec2 normal = perpRight(dir);
  normal = normalize(normal);
  vec2 cd = dir * len;
  vec2 p = dir * t;
  vec2 pp = vec2(mix(0.0, cd.x, tx), mix(0.0, cd.y, ty));
  vec2 ofs = pp - p;
  float result = dot(ofs, normal);
  return result;
}

float sdfDistToLerpSegmentA(vec2 p, vec2 a, vec2 b, float dist, float t, float tx, float ty) {
  if (t <= 0.0) return dist;
  if (t >= 1.0) return dist;

  vec2 normal = perp(b - a);
  normal = normalize(normal);
  float offset = calcLerpOffset(a, b, t, tx, ty);
  a = a + (b - a) * t;
  a = a + normal * offset;

  float d = dot(normal, a);
  return dot(normal, p) - d;
}

float sdfVector3(vec2 p, QuadParams sp, out float body, out float head) {
  float height = sp.strokeWidth * 0.5;
  vec2 m = vec2(sp.topRight.x, 0.0);
  vec2 p1 = vec2(sp.topRight.x - height * 12.0,  height * 13.0);
  vec2 p2 = vec2(sp.topRight.x - height * 12.0, -height * 13.0);
  float t;
  float l1 = signedDistToSegment(p, p1, m, t);
  l1 = sdfDistToLerpSegment(p, p1, m, l1, t, t, easeOutCubic(t));
  float l2 = signedDistToSegment(p, m, p2, t);
  l2 = sdfDistToLerpSegment(p, m, p2, l2, t, t, easeInCubic(t));
  float l3 = signedDistToSegment(p, p1, p2, t);
  l3 = sdfDistToLerpSegmentA(p, p2, p1, l3, t, easeInQuad(t), t);
  body = abs(p.y) - height;
  head = sdfIntersect(l1, l2, l3);
  body = sdfDiff(body, (sp.topRight.x + p1.x) * 0.5 - p.x);
  return sdfUnion(body, head);
}

// TODO: Fix.
float sdfBezierSegment(vec2 p, vec2 a, vec2 b, vec2 c) {
  float t;
  float dist = signedDistToSegment(p, a, b, t);

  float t1 = 1.0 - t;
  vec2 pp = t1 * t1 * a + 2.0 * t1 * t * c + t * t * b;

  vec2 normal = perp(b - a);
  normal = normalize(normal);
  float d = dot(pp, normal);
  float result = (dot(p, normal) - d);
  // float result = (dot(p, normal) - d) / dot(normal, normal);
  result = mix(result, dist, step(t, 0.0));
  result = mix(result, dist, step(1.0, t));
  return result;
}

float sdfDistToLerpSegmentB(vec2 p, vec2 a, vec2 b, float dist, float t, float tx) {
  vec2 ab = b - a;
  vec2 normal = perp(ab);
  vec2 mid = (a + b) * 0.5;
  vec2 e = a + ab * t;
  vec2 pp;
  // t = tx;

  if (t < 0.5) {
    vec2 c = mid + normal;
    t = t * 2.0;
    float t1 = 1.0 - t;
    pp = t1 * t1 * a + 2.0 * t1 * t * c + t * t * b;
  } else {
    vec2 c = mid + -normal;
    t = (1.0 - t) * 2.0;
    float t1 = 1.0 - t;
    pp = t1 * t1 * a + 2.0 * t1 * t * c + t * t * b;
  }

  normal = normalize(normal);
  float d = dot(pp, normal);
  float result = (dot(p, normal) - d);
  // float result = (dot(p, normal) - d) / dot(normal, normal);
  result = mix(result, dist, step(t, 0.0));
  result = mix(result, dist, step(1.0, t));
  return result;
}

float sdfBezierSegment(vec2 p, QuadParams sp) {
  float height = sp.strokeWidth * 0.5;
  vec2 m = vec2(sp.topRight.x, 0.0);
  vec2 p1 = vec2(0.0,  0.0);
  vec2 p2 = vec2(0.0, -0.4);
  vec2 p3 = vec2(0.25, (p1.y + p2.y) * 0.01);
  p3 = vec2(0.3, 0.01);
  // p3 = perp(p2 - p1) * 0.5;
  float angle = fract(time * 2.0 * 0.04) * TWO_PI;
  vec2 rot = vec2(cos(angle), sin(angle));
  // p2 = rotate(p2, rot);
  // p3 = rotate(p3, rot);
  float t;
  float l1 = signedDistToSegment(p, p1, m, t);
  l1 = sdfDistToLerpSegment(p, p1, m, l1, t, t, easeOutCubic(t));
  float l2 = signedDistToSegment(p, m, p2, t);
  l2 = sdfDistToLerpSegment(p, m, p2, l2, t, t, easeInCubic(t));
  float l3 = sdfBezierSegment(p, p2, p1, p3);
  l3 = signedDistToSegment(p, p2, p1, t);
  l3 = sdfDistToLerpSegmentB(p, p2, p1, l3, t, easeInQuad(t));
  // l3 = sdfDistToLerpSegmentA(p, p2, p1, l3, t, smoothstep(0.0, 1.0, t), t);
  // l3 = sdfDistToLerpSegmentA(p, p2, p1, l3, t, t, smoothstep(0.0, 1.0, t));
  float bodyLine = abs(p.y) - height;
  float tip = sdfIntersect(l1, l2, l3);
  bodyLine = sdfDiff(bodyLine, (sp.topRight.x + p1.x) * 0.5 - p.x);
  return l3;
  float head = tip;
  return sdfUnion(bodyLine, head);
}

void main() {
  QuadParams sp = sdfToLocal1(v_params);
  vec2 p = sdfPointToLocal1(gl_FragCoord.xy, sp);

  float body;
  float head;
  float vec = sdfVector(p, sp, body, head);
  vec = sdfVector2(p, sp, body, head);
  vec = sdfVector3(p, sp, body, head);

  vec4 color;
  float antialias = 1.0;
  vec4 fillColor = mix(sp.strokeColor, sp.fillColor, step(head, body));
  fillColor = mix(fillColor, sp.fillColor, step(head, 0.0));
  color = fill(p, vec, fillColor, antialias);
  // color = border(p, dist, sp.fillColor, sp.strokeColor, 0.01);

  float axes;
  float major;
  float minor;
  float dist = sdfGrid(p, sp, axes, major, minor);
  // dist = sdfGrid2(p, sp, axes, major, minor);
  fillColor = sp.fillColor;
  fillColor = transparent;
  fillColor = mix(fillColor, sp.fillColor, float(axes <= 0.0));
  fillColor = mix(fillColor, sp.strokeColor, float(major <= 0.0));
  fillColor = mix(fillColor, vec4(0.1, 0.1, 0.1, 1.0), float(minor <= 0.0));
  // color = fill(p, dist, fillColor, 1.0);
  // color = fill(p, dist, sp.fillColor, 1.0);

  dist = sdfLines(p, sp);
  // color = fill(p, dist, sp.fillColor, 1.0);
  // color = border(p, dist, sp.fillColor, sp.strokeColor, sp.strokeWidth);

  float s1;
  float s2;
  dist = sdfTemp(p, sp, s1, s2);
  float intersect = sdfIntersect(s1, s2);
  fillColor = mix(sp.strokeColor, sp.fillColor, step(s2, s1));
  fillColor = mix(fillColor, sp.fillColor, step(intersect, 0.0));
  // color = fill(p, dist, fillColor, 1.0);

  dist = sdfBezierSegment(p, sp);
  // color = fill(p, dist, sp.strokeColor, 1.0);

  glFragColor = color;
}""")
  ]
  |> List.iter addFragment
