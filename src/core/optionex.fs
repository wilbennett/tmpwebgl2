module Option

let call f opt =
  match opt with
  | Some x -> f x
  | None -> ()

let run f opt =
  match opt with
  | Some x -> f x
  | None -> ()

let runWhenNone f opt =
  match opt with
  | Some _ -> ()
  | None -> f ()

let execute f opt =
  match opt with
  | Some x -> Some <| f x
  | None -> None

let executeDefault def f opt =
  match opt with
  | Some x -> f x
  | None -> def

let calcDef f opt =
  match opt with
  | Some x -> x
  | None -> f ()
