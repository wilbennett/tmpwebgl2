module Array

let inline of1 a = [| a |]
let inline of2 a b = [| a; b |]
let inline of3 a b c = [| a; b; c |]
let inline of4 a b c d = [| a; b; c; d |]
let inline of5 a b c d e = [| a; b; c; d; e |]

let private swapIndexPairs fRand lst =
  seq
    {
      for i in (Array.length lst - 1) .. -1 .. 1 do
        yield (i, fRand (i + 1))
    }

let private swapIndexMap index (fromIndex, toIndex) =
  if index = fromIndex then toIndex
  elif index = toIndex then fromIndex
  else index

let private swap indexPair lst =
  Array.permute (fun index -> swapIndexMap index indexPair) lst

let shuffleInPlace fRand (lst: 'a []) =
  let swap pair =
    let temp = lst.[fst pair]
    lst.[fst pair] <- lst.[snd pair]
    lst.[snd pair] <- temp

  swapIndexPairs fRand lst |> Seq.iter swap
  lst
