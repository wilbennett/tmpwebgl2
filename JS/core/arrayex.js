import { iterate, rangeNumber, map, delay } from "../.fable/fable-library.3.0.0/Seq.js";
import { equals } from "../.fable/fable-library.3.0.0/Util.js";
import { permute } from "../.fable/fable-library.3.0.0/Array.js";

function swapIndexPairs(fRand, lst) {
    return delay(() => map((i) => [i, fRand(i + 1)], rangeNumber(lst.length - 1, -1, 1)));
}

function swapIndexMap(index, fromIndex, toIndex) {
    if (equals(index, fromIndex)) {
        return toIndex;
    }
    else if (equals(index, toIndex)) {
        return fromIndex;
    }
    else {
        return index;
    }
}

function swap(indexPair_0, indexPair_1, lst) {
    const indexPair = [indexPair_0, indexPair_1];
    return permute((index) => swapIndexMap(index, indexPair[0], indexPair[1]), lst);
}

export function shuffleInPlace(fRand, lst) {
    const swap_1 = (pair) => {
        const temp = lst[pair[0]];
        lst[pair[0]] = lst[pair[1]];
        lst[pair[1]] = temp;
    };
    iterate(swap_1, swapIndexPairs(fRand, lst));
    return lst;
}

