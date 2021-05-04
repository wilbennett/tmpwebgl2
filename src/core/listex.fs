module List

let call f lst =
  match lst with
  | [] -> ()
  | x -> f x

let execute f defaultValue lst =
  match lst with
  | [] -> defaultValue
  | x -> f x

let of1 a = [ a ]
let of2 a b = [ a; b ]
let of3 a b c = [ a; b; c ]
let of4 a b c d = [ a; b; c; d ]
let of5 a b c d e = [ a; b; c; d; e ]
