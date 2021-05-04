namespace Wil.Webgl.Data

open System
open Wil.Core.Utils

module GlCommon =
  let splitName (name: string) =
    let pair = name.Split('.')
    (pair.[0], pair.[1])

  let getScene name (data: GlCanvasData) =
    match data.Scenes |> Array.tryFind (fun u -> u.Name = name) with
    | Some scene -> scene
    | None -> raise (exn $"Scene '{name}' not found")

  let allObjects (data: GlCanvasData) =
    let sceneObjects (data: GlSceneData) =
      data.Layers |> Seq.collect (fun l -> l.Objects)
      
    data.Scenes |> Seq.collect sceneObjects

  let getAttributeData (attribute: GlRootAttribute) =
    match attribute with
    | SingleAttribute a
    | InterleaveAttribute a -> a

  let getUbo name (data: GlObjData) =
    match data.Ubos |> List.tryFind (fun u -> u.Name = name) with
    | Some ubo -> ubo
    | None -> raise (exn $"Ubo '{name}' not found")

  let tryGetUbo name (data: GlObjData) =
    data.Ubos |> List.tryFind (fun u -> u.Name = name)

  let allUniforms (data: GlObjData) =
    data.Ubos
    |> Seq.collect (fun ubo -> ubo.Uniforms)
    |> Seq.append data.Uniforms

  let allAttributes (data: GlObjData) =
    let rec getAttributes data =
      seq {
        yield data
        yield! data.ChildAttributes |> Seq.collect getAttributes
      }
 
    data.Attributes |> Seq.collect (getAttributeData >> getAttributes)

  let getUniform name (data: GlObjData) =
    match data |> allUniforms |> Seq.tryFind (fun u -> u.Name = name) with
    | Some uniform -> uniform
    | None -> raise (exn $"Uniform '{name}' not found")

  let tryGetUniform name (data: GlObjData) =
    data |> allUniforms |> Seq.tryFind (fun u -> u.Name = name)

  let getAttribute name (data: GlObjData) =
    match data |> allAttributes |> Seq.tryFind (fun u -> u.Name = name) with
    | Some attribute -> attribute
    | None -> raise (exn $"Attribute '{name}' not found")

  let tryGetAttribute name (data: GlObjData) =
    data |> allAttributes |> Seq.tryFind (fun u -> u.Name = name)

  let getTexture name (data: GlObjData) =
    match data.Textures |> List.tryFind (fun u -> u.Name = name) with
    | Some texture -> texture
    | None -> raise (exn $"Texture '{name}' not found")

  let tryGetTexture name (data: GlObjData) =
    data.Textures |> List.tryFind (fun u -> u.Name = name)

  let objects (data: GlSceneData) =
    seq { yield! data.Layers |> Seq.rev |> Seq.collect (fun l -> l.Objects) }

  let getCamera name (data: GlSceneData) =
    match data.Cameras |> List.tryFind (fun o -> o.Name = name) with
    | Some camera -> camera
    | None -> throw $"Camera '{name}' not found"

  let tryGetCamera name (data: GlSceneData) =
    data.Cameras |> List.tryFind (fun u -> u.Name = name)

  let getObject name (data: GlSceneData) =
    match data |> objects |> Seq.tryFind (fun o -> o.Name = name) with
    | Some object -> object
    | None -> throw $"Object '{name}' not found"

  let tryGetObject name (data: GlSceneData) =
    data |> objects |> Seq.tryFind (fun u -> u.Name = name)

  let dirtyScene (data: GlSceneData) =
    data.IsDirty <- true
    data.Canvas.IsDirty <- true

  let dirtyObject (data: GlObjData) =
    data.IsDirty <- true
    dirtyScene data.Scene

  let dirtyModel (data: GlObjData) =
    data.IsModelDirty <- true
    dirtyObject data

  let dirtyParallax (data: GlObjData) =
    match data.ParallaxCamera with
    | None -> ()
    | Some _ ->
        data.IsParallaxDirty <- true
        dirtyObject data

  let objectRecalcNeeded (data: GlObjData) =
    data.RecalcNeeded <- true
    dirtyObject data

  let nextUboBufferIndex (data: GlObjData) =
    let rec loop i (ubos: GlUboData list) =
      match ubos with
      | [] -> i
      | h::t -> if i < h.Location then i else loop (i + 1) t
    loop 0 (data.Ubos |> List.sortBy (fun u -> u.Location))

  let nextTextureIndex (data: GlObjData) =
    let rec loop i (ubos: GlTextureData list) =
      match ubos with
      | [] -> i
      | h::t -> if i < h.Index then i else loop (i + 1) t
    loop 0 (data.Textures |> List.sortBy (fun u -> u.Index))

  let addScene (creator: GlSceneFactory) (data: GlCanvasData) =
    let sceneData = creator [] data
    data.Scenes <- Array.append data.Scenes [| sceneData |]
    sceneData

  let removeScene (scene: GlSceneData) (data: GlCanvasData) =
    data.Scenes <- data.Scenes |> Array.filter (fun o -> not <| Object.ReferenceEquals(o, scene))
    data.IsDirty <- true
    data

  let addCamera (creator: GlCameraFactory) (data: GlSceneData) =
    let camData = creator [] data
    data.Cameras <- data.Cameras @ [camData]
    dirtyScene data
    camData

  let removeCamera (cam: GlObjData) (data: GlSceneData) =
    data.Cameras <- data.Cameras |> List.filter (fun o -> not <| Object.ReferenceEquals(o, cam))
    dirtyScene data
    data

  let addObject (creator: GlObjectFactory) (data: GlSceneData) =
    let objData = creator [] data
    let layer = data.Layers.[objData.Layer]
    layer.Objects <- layer.Objects @ [objData]
    dirtyScene data
    objData

  let removeObject (globj: GlObjData) (data: GlSceneData) =
    let layer = data.Layers.[globj.Layer]
    layer.Objects <- layer.Objects |> List.filter (fun o -> not <| Object.ReferenceEquals(o, globj))
    dirtyScene data
    data

  let addUbo (creator: GlUboFactory) (data: GlObjData) =
    let uboData = creator [] data
    data.Ubos <- data.Ubos @ [uboData]
    dirtyObject data
    uboData

  let addUniform (creator: GlUniformFactory) (data: GlObjData) =
    let uniformData = creator [] data
    data.Uniforms <- data.Uniforms @ [uniformData]
    dirtyObject data
    uniformData

  let addAttribute (creator: GlRootAttributeFactory) (data: GlObjData) =
    let attributeData = creator [] data
    data.Attributes <- data.Attributes @ [attributeData]
    dirtyObject data
    attributeData

  let addTexture (creator: GlTextureFactory) (data: GlObjData) =
    let textureData = creator [] data
    data.Textures <- data.Textures @ [textureData]
    dirtyObject data
    textureData

  let addUboUniform (creator: GlUboUniformFactory) (data: GlUboData) =
    let uniformData = creator [] data data.ParentObject
    data.Uniforms <- uniformData :: data.Uniforms
    uniformData

  let objectDebugName (globj: GlObjData) =
    if not <| String.IsNullOrWhiteSpace(globj.Name)
    then globj.Name
    elif globj.Parent.IsNone
    then "shared"
    else ""

