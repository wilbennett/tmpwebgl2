import { interpolate, join, printf, toText, substring } from "../.fable/fable-library.3.0.0/String.js";
import { toString } from "../.fable/fable-library.3.0.0/Types.js";
import { getEnumName } from "../.fable/fable-library.3.0.0/Reflection.js";
import { mapIndexed } from "../.fable/fable-library.3.0.0/Array.js";
import { split } from "../.fable/fable-library.3.0.0/RegExp.js";

export function isPowerOf2(x) {
    return (x & (x - 1)) === 0;
}

export function adjustOffset(offset, align) {
    return (~(~Math.ceil(offset / align))) * align;
}

export function boolToInt(b) {
    if (b) {
        return 1;
    }
    else {
        return 0;
    }
}

export const ONE_RADIAN = 180 / 3.141592653589793;

export const ONE_DEGREE = 3.141592653589793 / 180;

export const RAD_PER_DEG = ONE_DEGREE * 1;

export const DEG_PER_RAD = ONE_RADIAN * 1;

export function clipString(count, str) {
    if (str.length > count) {
        return substring(str, 0, count - 3) + "...";
    }
    else {
        return str;
    }
}

export function clipArray(count, arr) {
    return clipString(count, toText(printf("%A"))(arr));
}

export function clipObj(count, o) {
    let copyOfStruct;
    return clipString(count, (copyOfStruct = o, toString(copyOfStruct)));
}

export function enumName(enumType, value) {
    return getEnumName(enumType, value);
}

export function stringJoin(sep, str) {
    return join(sep, str);
}

export function addLineNumbers(txt) {
    return stringJoin("\r\n", mapIndexed((i, s) => toText(interpolate("%4i%P(): %P()", [i + 1, s])), split(txt, "\r?\n")));
}

