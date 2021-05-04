import { Record } from "../.fable/fable-library.3.0.0/Types.js";
import { record_type, option_type, bool_type } from "../.fable/fable-library.3.0.0/Reflection.js";

export class ListenerOptions extends Record {
    constructor(capture, once, passive) {
        super();
        this.capture = capture;
        this.once = once;
        this.passive = passive;
    }
}

export function ListenerOptions$reflection() {
    return record_type("Wil.Browser.Types.BrowserExtensions.ListenerOptions", [], ListenerOptions, () => [["capture", option_type(bool_type)], ["once", option_type(bool_type)], ["passive", option_type(bool_type)]]);
}

