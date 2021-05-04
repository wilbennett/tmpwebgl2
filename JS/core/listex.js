import { ofArray, singleton } from "../.fable/fable-library.3.0.0/List.js";

export function call(f, lst) {
    if (lst.tail == null) {
    }
    else {
        const x = lst;
        f(x);
    }
}

export function execute(f, defaultValue, lst) {
    if (lst.tail == null) {
        return defaultValue;
    }
    else {
        const x = lst;
        return f(x);
    }
}

export function of1(a) {
    return singleton(a);
}

export function of2(a, b) {
    return ofArray([a, b]);
}

export function of3(a, b, c) {
    return ofArray([a, b, c]);
}

export function of4(a, b, c, d) {
    return ofArray([a, b, c, d]);
}

export function of5(a, b, c, d, e) {
    return ofArray([a, b, c, d, e]);
}

