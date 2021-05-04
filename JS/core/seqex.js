import { singleton, delay } from "../.fable/fable-library.3.0.0/Seq.js";

export function of1(x) {
    return delay(() => singleton(x));
}

