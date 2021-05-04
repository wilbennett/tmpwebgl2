import { some, value } from "../.fable/fable-library.3.0.0/Option.js";

export function call(f, opt) {
    if (opt == null) {
    }
    else {
        const x = value(opt);
        f(x);
    }
}

export function run(f, opt) {
    if (opt == null) {
    }
    else {
        const x = value(opt);
        f(x);
    }
}

export function runWhenNone(f, opt) {
    if (opt == null) {
        f();
    }
}

export function execute(f, opt) {
    if (opt == null) {
        return void 0;
    }
    else {
        const x = value(opt);
        return some(f(x));
    }
}

export function executeDefault(def, f, opt) {
    if (opt == null) {
        return def;
    }
    else {
        const x = value(opt);
        return f(x);
    }
}

export function calcDef(f, opt) {
    if (opt == null) {
        return f();
    }
    else {
        const x = value(opt);
        return x;
    }
}

