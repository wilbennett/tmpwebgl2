import { shuffleInPlace } from "./arrayex.js";
import { comparePrimitives, max, randomNext } from "../.fable/fable-library.3.0.0/Util.js";
import { append, initialize } from "../.fable/fable-library.3.0.0/Array.js";
import { Vec3_op_DivisionAssignment_47807EB4, Vec3__Clone, Vec2_op_DivisionAssignment_47807E55, Vec2__Clone, Vec3_op_Multiply_Z18D588CE, Vec3_op_Multiply_Z24FF85E0, Vec2_op_Multiply_47807E55, Vec2_op_Multiply_Z24FF8540, Vec3__Floor_Z49505F06, Vec3_Create_8ED0A5D, Vec3__Fract_Z49505F06, Vec2__Floor_Z49505F25, Vec2_Create_7B00E9A0, Vec2__Fract_Z49505F25, Vec4_Create_Z16DF143 } from "./vectors.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";
import { defaultArg } from "../.fable/fable-library.3.0.0/Option.js";

export const PerlinShared_defaultPerms = new Uint8Array([151, 137, 91, 90, 160, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180]);

export function PerlinShared_createPerm(seed) {
    if (seed === 0) {
        return PerlinShared_defaultPerms;
    }
    else {
        const rand = {};
        return shuffleInPlace((arg00) => randomNext(0, arg00), initialize(256, (i) => (i & 0xFF), Uint8Array));
    }
}

export class PerlinNoise {
    constructor() {
        this.perms = append(PerlinShared_defaultPerms, PerlinShared_defaultPerms, Uint8Array);
        const frequency = Vec4_Create_Z16DF143(0.01);
        this["Octaves@"] = 4;
        this["Frequency@"] = Vec4_Create_Z16DF143(0.01);
        this["Amplitude@"] = 10;
        this["Lacunarity@"] = 2;
        this["Gain@"] = 0.5;
    }
}

export function PerlinNoise$reflection() {
    return class_type("Wil.Core.PerlinNoise", void 0, PerlinNoise);
}

export function PerlinNoise_$ctor() {
    return new PerlinNoise();
}

export function PerlinNoise__get_Octaves(__) {
    return __["Octaves@"];
}

export function PerlinNoise__set_Octaves_Z524259A4(__, v) {
    __["Octaves@"] = v;
}

export function PerlinNoise__get_Frequency(__) {
    return __["Frequency@"];
}

export function PerlinNoise__set_Frequency_Z3D47FC58(__, v) {
    __["Frequency@"] = v;
}

export function PerlinNoise__get_Amplitude(__) {
    return __["Amplitude@"];
}

export function PerlinNoise__set_Amplitude_Z16DF143(__, v) {
    __["Amplitude@"] = v;
}

export function PerlinNoise__get_Lacunarity(__) {
    return __["Lacunarity@"];
}

export function PerlinNoise__set_Lacunarity_Z16DF143(__, v) {
    __["Lacunarity@"] = v;
}

export function PerlinNoise__get_Gain(__) {
    return __["Gain@"];
}

export function PerlinNoise__set_Gain_Z16DF143(__, v) {
    __["Gain@"] = v;
}

export function PerlinNoise__Noise_5E38073B(_, p) {
    let p0;
    const x = p;
    p0 = (x - Math.floor(x));
    const p1 = p0 - 1;
    const idx = (~(~Math.floor(p))) | 0;
    const v0 = PerlinNoise__perm1_Z524259A4(_, idx);
    const v1 = PerlinNoise__perm1_Z524259A4(_, idx + 1);
    const fx = PerlinNoise__fade_Z16DF143(_, p0);
    const t = fx;
    return (PerlinNoise__grad1(_, v0, p0) * (1 - t)) + (PerlinNoise__grad1(_, v1, p1) * t);
}

export function PerlinNoise__Noise_Z3D47FC52(_, p) {
    const p0 = Vec2__Fract_Z49505F25(p);
    let p1;
    const v = p0;
    p1 = Vec2_Create_7B00E9A0(v.values[0] + -1, v.values[1] + 0);
    let p2;
    const v_1 = p0;
    p2 = Vec2_Create_7B00E9A0(v_1.values[0] + 0, v_1.values[1] + -1);
    let p3;
    const v_2 = p0;
    p3 = Vec2_Create_7B00E9A0(v_2.values[0] + -1, v_2.values[1] + -1);
    const id = Vec2__Floor_Z49505F25(p);
    const v0 = PerlinNoise__perm2(_, ~(~id.values[0]), ~(~id.values[1]));
    const v1 = PerlinNoise__perm2(_, (~(~id.values[0])) + 1, ~(~id.values[1]));
    const v2 = PerlinNoise__perm2(_, ~(~id.values[0]), (~(~id.values[1])) + 1);
    const v3 = PerlinNoise__perm2(_, (~(~id.values[0])) + 1, (~(~id.values[1])) + 1);
    const fx = PerlinNoise__fade_Z16DF143(_, p0.values[0]);
    const fy = PerlinNoise__fade_Z16DF143(_, p0.values[1]);
    let a_1;
    const t_2 = fx;
    a_1 = ((PerlinNoise__grad2(_, v0, p0) * (1 - t_2)) + (PerlinNoise__grad2(_, v1, p1) * t_2));
    let b_2;
    const t_3 = fx;
    b_2 = ((PerlinNoise__grad2(_, v2, p2) * (1 - t_3)) + (PerlinNoise__grad2(_, v3, p3) * t_3));
    const t_4 = fy;
    return (a_1 * (1 - t_4)) + (b_2 * t_4);
}

export function PerlinNoise__Noise_Z3D47FC51(_, p) {
    const p0 = Vec3__Fract_Z49505F06(p);
    let p1;
    const v = p0;
    p1 = Vec3_Create_8ED0A5D(v.values[0] + -1, v.values[1] + 0, v.values[2] + 0);
    let p2;
    const v_1 = p0;
    p2 = Vec3_Create_8ED0A5D(v_1.values[0] + 0, v_1.values[1] + -1, v_1.values[2] + 0);
    let p3;
    const v_2 = p0;
    p3 = Vec3_Create_8ED0A5D(v_2.values[0] + -1, v_2.values[1] + -1, v_2.values[2] + 0);
    let p4;
    const v_3 = p0;
    p4 = Vec3_Create_8ED0A5D(v_3.values[0] + 0, v_3.values[1] + 0, v_3.values[2] + -1);
    let p5;
    const v_4 = p0;
    p5 = Vec3_Create_8ED0A5D(v_4.values[0] + -1, v_4.values[1] + 0, v_4.values[2] + -1);
    let p6;
    const v_5 = p0;
    p6 = Vec3_Create_8ED0A5D(v_5.values[0] + 0, v_5.values[1] + -1, v_5.values[2] + -1);
    let p7;
    const v_6 = p0;
    p7 = Vec3_Create_8ED0A5D(v_6.values[0] + -1, v_6.values[1] + -1, v_6.values[2] + -1);
    const id = Vec3__Floor_Z49505F06(p);
    const v0 = PerlinNoise__perm3(_, ~(~id.values[0]), ~(~id.values[1]), ~(~id.values[2]));
    const v1 = PerlinNoise__perm3(_, (~(~id.values[0])) + 1, ~(~id.values[1]), ~(~id.values[2]));
    const v2 = PerlinNoise__perm3(_, ~(~id.values[0]), (~(~id.values[1])) + 1, ~(~id.values[2]));
    const v3 = PerlinNoise__perm3(_, (~(~id.values[0])) + 1, (~(~id.values[1])) + 1, ~(~id.values[2]));
    const v4 = PerlinNoise__perm3(_, ~(~id.values[0]), ~(~id.values[1]), (~(~id.values[2])) + 1);
    const v5 = PerlinNoise__perm3(_, (~(~id.values[0])) + 1, ~(~id.values[1]), (~(~id.values[2])) + 1);
    const v6 = PerlinNoise__perm3(_, ~(~id.values[0]), (~(~id.values[1])) + 1, (~(~id.values[2])) + 1);
    const v7 = PerlinNoise__perm3(_, (~(~id.values[0])) + 1, (~(~id.values[1])) + 1, (~(~id.values[2])) + 1);
    const fx = PerlinNoise__fade_Z16DF143(_, p0.values[0]);
    const fy = PerlinNoise__fade_Z16DF143(_, p0.values[1]);
    const fz = PerlinNoise__fade_Z16DF143(_, p0.values[2]);
    let a1;
    const t_3 = fx;
    a1 = ((PerlinNoise__grad3(_, v0, p0) * (1 - t_3)) + (PerlinNoise__grad3(_, v1, p1) * t_3));
    let b1;
    const t_4 = fx;
    b1 = ((PerlinNoise__grad3(_, v2, p2) * (1 - t_4)) + (PerlinNoise__grad3(_, v3, p3) * t_4));
    let a2;
    const t_5 = fx;
    a2 = ((PerlinNoise__grad3(_, v4, p4) * (1 - t_5)) + (PerlinNoise__grad3(_, v5, p5) * t_5));
    let b2;
    const t_6 = fx;
    b2 = ((PerlinNoise__grad3(_, v6, p6) * (1 - t_6)) + (PerlinNoise__grad3(_, v7, p7) * t_6));
    let c1;
    const t_7 = fy;
    c1 = ((a1 * (1 - t_7)) + (b1 * t_7));
    let c2;
    const t_8 = fy;
    c2 = ((a2 * (1 - t_8)) + (b2 * t_8));
    const t_9 = fz;
    return (c1 * (1 - t_9)) + (c2 * t_9);
}

export function PerlinNoise__Fbm_38B00632(this$, p, octaves, frequency, amplitude, lacunarity, gain) {
    let freq = defaultArg(frequency, PerlinNoise__get_Frequency(this$).values[0]);
    let amp = defaultArg(amplitude, PerlinNoise__get_Amplitude(this$));
    let lac = defaultArg(lacunarity, PerlinNoise__get_Lacunarity(this$));
    let gain_1 = defaultArg(gain, PerlinNoise__get_Gain(this$));
    let result = 0;
    const oct = max(comparePrimitives, defaultArg(octaves, PerlinNoise__get_Octaves(this$)), 1) | 0;
    for (let i = 0; i <= (oct - 1); i++) {
        result = (result + (PerlinNoise__Noise_5E38073B(this$, p * freq) * amp));
        freq = (freq * lac);
        amp = (amp * gain_1);
    }
    return result;
}

export function PerlinNoise__Fbm_Z202B522C(this$, p, octaves, frequency, amplitude, lacunarity, gain) {
    let _;
    let freq = defaultArg(frequency, (_ = PerlinNoise__get_Frequency(this$), Vec2_Create_7B00E9A0(_.v.contents.values[0], _.v.contents.values[1])));
    let amp = defaultArg(amplitude, PerlinNoise__get_Amplitude(this$));
    let lac = defaultArg(lacunarity, PerlinNoise__get_Lacunarity(this$));
    let gain_1 = defaultArg(gain, PerlinNoise__get_Gain(this$));
    let result = 0;
    const oct = max(comparePrimitives, defaultArg(octaves, PerlinNoise__get_Octaves(this$)), 1) | 0;
    for (let i = 0; i <= (oct - 1); i++) {
        result = (result + (PerlinNoise__Noise_Z3D47FC52(this$, Vec2_op_Multiply_Z24FF8540(p, freq)) * amp));
        freq = Vec2_op_Multiply_47807E55(freq, lac);
        amp = (amp * gain_1);
    }
    return result;
}

export function PerlinNoise__Fbm_Z1F5DA94C(this$, p, octaves, frequency, amplitude, lacunarity, gain) {
    let _;
    let freq = defaultArg(frequency, (_ = PerlinNoise__get_Frequency(this$), Vec3_Create_8ED0A5D(_.v.contents.values[0], _.v.contents.values[1], _.v.contents.values[2])));
    let amp = defaultArg(amplitude, PerlinNoise__get_Amplitude(this$));
    let lac = defaultArg(lacunarity, PerlinNoise__get_Lacunarity(this$));
    let gain_1 = defaultArg(gain, PerlinNoise__get_Gain(this$));
    let result = 0;
    const oct = max(comparePrimitives, defaultArg(octaves, PerlinNoise__get_Octaves(this$)), 1) | 0;
    for (let i = 0; i <= (oct - 1); i++) {
        result = (result + (PerlinNoise__Noise_Z3D47FC51(this$, Vec3_op_Multiply_Z24FF85E0(p, freq)) * amp));
        freq = Vec3_op_Multiply_Z18D588CE(freq, lac);
        amp = (amp * gain_1);
    }
    return result;
}

export function PerlinNoise__Turbulence_Z18D5882D(this$, pos, pixelSize) {
    let t = 0;
    let scale = 1;
    const p = Vec2__Clone(pos);
    while (scale > pixelSize) {
        Vec2_op_DivisionAssignment_47807E55(p, scale);
        t = (t + (Math.abs(PerlinNoise__Noise_Z3D47FC52(this$, p)) * scale));
        scale = (scale * 0.5);
    }
    return t;
}

export function PerlinNoise__Turbulence_Z18D588CE(this$, pos, pixelSize) {
    let t = 0;
    let scale = 1;
    const p = Vec3__Clone(pos);
    while (scale > pixelSize) {
        Vec3_op_DivisionAssignment_47807EB4(p, scale);
        t = (t + (Math.abs(PerlinNoise__Noise_Z3D47FC51(this$, p)) * scale));
        scale = (scale * 0.5);
    }
    return t;
}

function PerlinNoise__fade_Z16DF143(this$, t) {
    return ((t * t) * t) * ((t * ((t * 6) - 15)) + 10);
}

function PerlinNoise__perm1_Z524259A4(this$, idx) {
    return this$.perms[idx];
}

function PerlinNoise__perm2(this$, x, y) {
    return PerlinNoise__perm1_Z524259A4(this$, y + (~(~PerlinNoise__perm1_Z524259A4(this$, x))));
}

function PerlinNoise__perm3(this$, x, y, z) {
    return PerlinNoise__perm1_Z524259A4(this$, z + (~(~PerlinNoise__perm1_Z524259A4(this$, y + (~(~PerlinNoise__perm1_Z524259A4(this$, x)))))));
}

function PerlinNoise__grad1(this$, hash, p) {
    if ((hash & 1) === 0) {
        return -p;
    }
    else {
        return p;
    }
}

function PerlinNoise__grad2(this$, hash, p) {
    const matchValue = hash & 3;
    switch (matchValue) {
        case 0: {
            return p.values[0] + p.values[1];
        }
        case 1: {
            return (-p.values[0]) + p.values[1];
        }
        case 2: {
            return p.values[0] - p.values[1];
        }
        case 3: {
            return (-p.values[0]) - p.values[1];
        }
        default: {
            throw (new Error("Can\u0027t happen!"));
        }
    }
}

function PerlinNoise__grad3(this$, hash, p) {
    const matchValue = hash & 15;
    switch (matchValue) {
        case 0: {
            return p.values[0] + p.values[1];
        }
        case 1: {
            return (-p.values[0]) + p.values[1];
        }
        case 2: {
            return p.values[0] - p.values[1];
        }
        case 3: {
            return (-p.values[0]) - p.values[1];
        }
        case 4: {
            return p.values[0] + p.values[2];
        }
        case 5: {
            return (-p.values[0]) + p.values[2];
        }
        case 6: {
            return p.values[0] - p.values[2];
        }
        case 7: {
            return (-p.values[0]) - p.values[2];
        }
        case 8: {
            return p.values[1] + p.values[2];
        }
        case 9: {
            return (-p.values[1]) + p.values[2];
        }
        case 10: {
            return p.values[1] - p.values[2];
        }
        case 11: {
            return (-p.values[1]) - p.values[2];
        }
        case 12: {
            return p.values[0] + p.values[1];
        }
        case 13: {
            return (-p.values[0]) + p.values[1];
        }
        case 14: {
            return (-p.values[1]) + p.values[2];
        }
        case 15: {
            return (-p.values[1]) - p.values[2];
        }
        default: {
            throw (new Error("Can\u0027t happen!"));
        }
    }
}

function PerlinNoise__grad4(this$, hash, p) {
    const matchValue = hash & 31;
    switch (matchValue) {
        case 0: {
            return (p.values[0] + p.values[1]) + p.values[3];
        }
        case 1: {
            return ((-p.values[0]) + p.values[1]) + p.values[3];
        }
        case 2: {
            return (p.values[0] + (-p.values[1])) + p.values[3];
        }
        case 3: {
            return ((-p.values[0]) + (-p.values[1])) + p.values[3];
        }
        case 4: {
            return (p.values[0] + p.values[2]) + p.values[3];
        }
        case 5: {
            return ((-p.values[0]) + p.values[2]) + p.values[3];
        }
        case 6: {
            return (p.values[0] + (-p.values[2])) + p.values[3];
        }
        case 7: {
            return ((-p.values[0]) + (-p.values[2])) + p.values[3];
        }
        case 8: {
            return (p.values[1] + p.values[2]) + p.values[3];
        }
        case 9: {
            return ((-p.values[1]) + p.values[2]) + p.values[3];
        }
        case 10: {
            return (p.values[1] + (-p.values[2])) + p.values[3];
        }
        case 11: {
            return ((-p.values[1]) + (-p.values[2])) + p.values[3];
        }
        case 12: {
            return (p.values[0] + p.values[1]) + (-p.values[3]);
        }
        case 13: {
            return ((-p.values[0]) + p.values[1]) + (-p.values[3]);
        }
        case 14: {
            return (p.values[0] + (-p.values[1])) + (-p.values[3]);
        }
        case 15: {
            return ((-p.values[0]) + (-p.values[1])) + (-p.values[3]);
        }
        case 16: {
            return (p.values[0] + p.values[2]) + (-p.values[3]);
        }
        case 17: {
            return ((-p.values[0]) + p.values[2]) + (-p.values[3]);
        }
        case 18: {
            return (p.values[0] + (-p.values[2])) + (-p.values[3]);
        }
        case 19: {
            return ((-p.values[0]) + (-p.values[2])) + (-p.values[3]);
        }
        case 20: {
            return (p.values[1] + p.values[2]) + (-p.values[3]);
        }
        case 21: {
            return ((-p.values[1]) + p.values[2]) + (-p.values[3]);
        }
        case 22: {
            return (p.values[1] + (-p.values[2])) + (-p.values[3]);
        }
        case 23: {
            return ((-p.values[1]) + (-p.values[2])) + (-p.values[3]);
        }
        case 24: {
            return (p.values[0] + p.values[1]) + p.values[2];
        }
        case 25: {
            return ((-p.values[0]) + p.values[1]) + p.values[2];
        }
        case 26: {
            return (p.values[0] + (-p.values[1])) + (-p.values[2]);
        }
        case 27: {
            return ((-p.values[0]) + (-p.values[1])) + (-p.values[2]);
        }
        case 28: {
            return (p.values[0] + p.values[1]) + (-p.values[2]);
        }
        case 29: {
            return ((-p.values[0]) + p.values[1]) + (-p.values[2]);
        }
        case 30: {
            return (p.values[0] + (-p.values[1])) + p.values[2];
        }
        case 31: {
            return ((-p.values[0]) + (-p.values[1])) + p.values[2];
        }
        default: {
            throw (new Error("Can\u0027t happen!"));
        }
    }
}

const Noise__noise = PerlinNoise_$ctor();

export function Noise_getOctaves() {
    return PerlinNoise__get_Octaves(Noise__noise);
}

export function Noise_setOctaves(x, unitVar1) {
    PerlinNoise__set_Octaves_Z524259A4(Noise__noise, x);
}

export function Noise_getFrequency() {
    return PerlinNoise__get_Frequency(Noise__noise);
}

export function Noise_setFrequency(x, unitVar1) {
    PerlinNoise__set_Frequency_Z3D47FC58(Noise__noise, x);
}

export function Noise_getAmplitude() {
    return PerlinNoise__get_Amplitude(Noise__noise);
}

export function Noise_setAmplitude(x, unitVar1) {
    PerlinNoise__set_Amplitude_Z16DF143(Noise__noise, x);
}

export function Noise_getLacunarity() {
    return PerlinNoise__get_Lacunarity(Noise__noise);
}

export function Noise_setLacunarity(x, unitVar1) {
    PerlinNoise__set_Lacunarity_Z16DF143(Noise__noise, x);
}

export function Noise_getGain() {
    return PerlinNoise__get_Gain(Noise__noise);
}

export function Noise_setGain(x, unitVar1) {
    PerlinNoise__set_Gain_Z16DF143(Noise__noise, x);
}

export function Noise_noise1(p) {
    return PerlinNoise__Noise_5E38073B(Noise__noise, p);
}

export function Noise_noise2(p) {
    return PerlinNoise__Noise_Z3D47FC52(Noise__noise, p);
}

export function Noise_noise3(p) {
    return PerlinNoise__Noise_Z3D47FC51(Noise__noise, p);
}

export function Noise_fbm1(p) {
    return PerlinNoise__Fbm_38B00632(Noise__noise, p);
}

export function Noise_fbm2(p) {
    return PerlinNoise__Fbm_Z202B522C(Noise__noise, p);
}

export function Noise_fbm3(p) {
    return PerlinNoise__Fbm_Z1F5DA94C(Noise__noise, p);
}

export function Noise_turbulence2(p, pixelSize) {
    return PerlinNoise__Turbulence_Z18D5882D(Noise__noise, p, pixelSize);
}

export function Noise_turbulence3(p, pixelSize) {
    return PerlinNoise__Turbulence_Z18D588CE(Noise__noise, p, pixelSize);
}

