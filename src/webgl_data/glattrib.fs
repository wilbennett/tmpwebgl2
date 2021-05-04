module GlAttrib

open Wil.Webgl.Types
open Wil.Webgl.Core
open Wil.Webgl.Data

let delete (data: GlAttributeData) =
  data.Buffer.Delete()

let setValues (values: obj) (data: GlAttributeData) =
  match data.Link with
  | Some _ -> ()
  | None ->
      match data.Kind with
      | Single _ -> GlSingleAttribute._setValues values data
      | Interleave _ -> GlInterleaveAttribute._setValues values data
      | InterleaveChild -> ()

let setValue index (value: obj) (data: GlAttributeData) =
  match data.Link with
  | Some _ -> ()
  | None ->
      match data.Kind with
      | Single _ -> GlSingleAttribute._setValue index value data
      | Interleave _ -> GlInterleaveAttribute._setValue index value data
      | InterleaveChild -> ()
