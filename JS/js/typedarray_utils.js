import { ofArray } from "../.fable/fable-library.3.0.0/List.js";
import { class_type } from "../.fable/fable-library.3.0.0/Reflection.js";

export function bufferView(data) {
    return data;
}

export function bufferView2(data) {
    return data;
}

export function bufferView3(data) {
    return data;
}

export function toArrayBufferViewFloat32(arr) {
    return new Float32Array(arr);
}

export function toArrayBufferViewUint16(arr) {
    return new Uint16Array(arr);
}

export function int8Array(arr) {
    return new Int8Array(arr);
}

export function uint8Array(arr) {
    return new Uint8Array(arr);
}

export function int32Array(arr) {
    return new Int32Array(arr);
}

export function uint32Array(arr) {
    return new Uint32Array(arr);
}

export function float32Array(arr) {
    return new Float32Array(arr);
}

export const emptyInt8Array = int8Array(0);

export const emptyUint8Array = uint8Array(0);

export const emptyInt32Array = int32Array(0);

export const emptyFloat32Array = float32Array(0);

export const isLittleEndian = (int32Array(int8Array(ofArray([1, 0, 0, 0])))[0]) === 1;

export function writeFloat32View(view, ofs, value) {
    view.setFloat32(ofs, value, isLittleEndian);
    return 4;
}

export function writeInt8View(view, ofs, value) {
    view.setInt8(ofs, (value + 0x80 & 0xFF) - 0x80);
    return 1;
}

export function writeUint8View(view, ofs, value) {
    view.setUint8(ofs, value & 0xFF);
    return 1;
}

export function writeInt16View(view, ofs, value) {
    view.setInt16(ofs, (value + 0x8000 & 0xFFFF) - 0x8000, isLittleEndian);
    return 2;
}

export function writeUint16View(view, ofs, value) {
    view.setUint16(ofs, value & 0xFFFF, isLittleEndian);
    return 2;
}

export function writeInt32View(view, ofs, value) {
    view.setInt32(ofs, value, isLittleEndian);
    return 4;
}

export class Int8ArrayFactory {
    constructor() {
    }
    Create(size) {
        return new Int8Array(size);
    }
    Create(typedArray) {
        return new Int8Array(typedArray);
    }
    Create(data) {
        return new Int8Array(data);
    }
    Create(buffer, offset, length) {
        return new Int8Array(buffer, offset, length);
    }
}

export function Int8ArrayFactory$reflection() {
    return class_type("Wil.Js.TypedArrayUtils.Int8ArrayFactory", void 0, Int8ArrayFactory);
}

export function Int8ArrayFactory_$ctor() {
    return new Int8ArrayFactory();
}

export const int8ArrayFactory = Int8ArrayFactory_$ctor();

export const uint8ArrayFactory = {
    Create(size) {
        return new Uint8Array(size);
    },
    Create(typedArray) {
        return new Uint8Array(typedArray);
    },
    Create(data) {
        return new Uint8Array(data);
    },
    Create(buffer, offset, length) {
        return new Uint8Array(buffer, offset, length);
    },
};

export const int16ArrayFactory = {
    Create(size) {
        return new Int16Array(size);
    },
    Create(typedArray) {
        return new Int16Array(typedArray);
    },
    Create(data) {
        return new Int16Array(data);
    },
    Create(buffer, offset, length) {
        return new Int16Array(buffer, offset, length);
    },
};

export const uint16ArrayFactory = {
    Create(size) {
        return new Uint16Array(size);
    },
    Create(typedArray) {
        return new Uint16Array(typedArray);
    },
    Create(data) {
        return new Uint16Array(data);
    },
    Create(buffer, offset, length) {
        return new Uint16Array(buffer, offset, length);
    },
};

export const int32ArrayFactory = {
    Create(size) {
        return new Int32Array(size);
    },
    Create(typedArray) {
        return new Int32Array(typedArray);
    },
    Create(data) {
        return new Int32Array(data);
    },
    Create(buffer, offset, length) {
        return new Int32Array(buffer, offset, length);
    },
};

export const uint32ArrayFactory = {
    Create(size) {
        return new Uint32Array(size);
    },
    Create(typedArray) {
        return new Uint32Array(typedArray);
    },
    Create(data) {
        return new Uint32Array(data);
    },
    Create(buffer, offset, length) {
        return new Uint32Array(buffer, offset, length);
    },
};

export const float32ArrayFactory = {
    Create(size) {
        return new Float32Array(size);
    },
    Create(typedArray) {
        return new Float32Array(typedArray);
    },
    Create(data) {
        return new Float32Array(data);
    },
    Create(buffer, offset, length) {
        return new Float32Array(buffer, offset, length);
    },
};

