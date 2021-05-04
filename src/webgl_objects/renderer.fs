namespace Wil.Webgl

open Wil.Webgl.Data

type GlRenderer() =
  member _.Grid2D(scene, size, ?layer, ?name, ?linkTo, ?parallaxCam, ?parallaxDistance) =
    Grid2D(scene.Canvas.Params, scene, size, ?layer = layer, ?name = name, ?linkTo = linkTo, ?parallaxCam = parallaxCam, ?parallaxDistance = parallaxDistance)

  member _.Vector2D(scene, vector, ?layer, ?name, ?linkTo, ?parallaxCam, ?parallaxDistance) =
    VectorObject2D(scene.Canvas.Params, scene, vector, ?layer = layer, ?name = name, ?linkTo = linkTo, ?parallaxCam = parallaxCam, ?parallaxDistance = parallaxDistance)

  member _.Line2D(scene, p1, p2, ?layer, ?name, ?linkTo, ?parallaxCam, ?parallaxDistance) =
    LineObjects2D(scene.Canvas.Params, scene, p1, p2, ?layer = layer, ?name = name, ?linkTo = linkTo, ?parallaxCam = parallaxCam, ?parallaxDistance = parallaxDistance)
  
  member _.LinePath2D(scene, points, ?layer, ?name, ?linkTo, ?parallaxCam, ?parallaxDistance) =
    LinePathObject2D(scene.Canvas.Params, scene, points, ?layer = layer, ?name = name, ?linkTo = linkTo, ?parallaxCam = parallaxCam, ?parallaxDistance = parallaxDistance)

  member _.PerlinNoise1DObject2D(scene, size, ?seed, ?layer, ?name, ?linkTo, ?parallaxCam, ?parallaxDistance) =
    PerlinNoise1DObject2D(scene.Canvas.Params, scene, size, ?seed = seed, ?layer = layer, ?name = name, ?linkTo = linkTo, ?parallaxCam = parallaxCam, ?parallaxDistance = parallaxDistance)

  member _.PerlinNoise2DObject2D(scene, size, ?seed, ?layer, ?name, ?linkTo, ?parallaxCam, ?parallaxDistance) =
    PerlinNoise2DObject2D(scene.Canvas.Params, scene, size, ?seed = seed, ?layer = layer, ?name = name, ?linkTo = linkTo, ?parallaxCam = parallaxCam, ?parallaxDistance = parallaxDistance)
