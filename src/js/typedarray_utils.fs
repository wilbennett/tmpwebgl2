namespace Wil.Js
  [<AutoOpen>]
  module TypedArrayUtils =
    open Fable.Core

    let bufferView (data: JS.TypedArray) =
      data :?> JS.ArrayBufferView

    let bufferView2 (data: JS.TypedArray) =
      U2.Case1 (data :?> JS.ArrayBufferView)

    let bufferView3 (data: JS.TypedArray) =
      U3.Case2 (data :?> JS.ArrayBufferView)

    let toArrayBufferViewFloat32 (arr: obj) =
      JS.Constructors.Float32Array.Create(arr) :?> JS.ArrayBufferView

    let toArrayBufferViewUint16 (arr: obj) =
      JS.Constructors.Uint16Array.Create(arr) :?> JS.ArrayBufferView

    let int8Array (arr: obj) = JS.Constructors.Int8Array.Create(arr)
    let uint8Array (arr: obj) = JS.Constructors.Uint8Array.Create(arr)
    let int32Array (arr: obj) = JS.Constructors.Int32Array.Create(arr)
    let uint32Array (arr: obj) = JS.Constructors.Uint32Array.Create(arr)
    let float32Array (arr: obj) = JS.Constructors.Float32Array.Create(arr)

    let emptyInt8Array = int8Array 0
    let emptyUint8Array = uint8Array 0
    let emptyInt32Array = int32Array 0
    let emptyFloat32Array = float32Array 0

    let isLittleEndian = (int32Array(int8Array [1; 0; 0; 0])).[0] = 1

    let writeFloat32View (view: JS.DataView) ofs (value: obj) = view.setFloat32(ofs, float32 (unbox value), isLittleEndian); 4
    let writeInt8View (view: JS.DataView) ofs (value: obj) = view.setInt8(ofs, sbyte (unbox value)); 1
    let writeUint8View (view: JS.DataView) ofs (value: obj) = view.setUint8(ofs, byte (unbox value)); 1
    let writeInt16View (view: JS.DataView) ofs (value: obj) = view.setInt16(ofs, int16 (unbox value), isLittleEndian); 2
    let writeUint16View (view: JS.DataView) ofs (value: obj) = view.setUint16(ofs, uint16 (unbox value), isLittleEndian); 2
    let writeInt32View (view: JS.DataView) ofs (value: obj) = view.setInt32(ofs, int32 (unbox value), isLittleEndian); 4

    type ITypedArrayFactory =
      abstract Create: size: int -> JS.TypedArray
      abstract Create: typedArray: JS.TypedArray -> JS.TypedArray
      abstract Create: buffer: JS.ArrayBuffer * ?offset:int * ?length:int -> JS.TypedArray
      abstract Create: data:obj -> JS.TypedArray

    type Int8ArrayFactory() =
      interface ITypedArrayFactory with
        member _.Create(size: int) = JS.Constructors.Int8Array.Create(size) :> JS.TypedArray
        member _.Create(typedArray: JS.TypedArray) = JS.Constructors.Int8Array.Create(typedArray) :> JS.TypedArray
        member _.Create(data: obj) = JS.Constructors.Int8Array.Create(data) :> JS.TypedArray

        member _.Create(buffer: JS.ArrayBuffer, ?offset: int, ?length: int) =
          JS.Constructors.Int8Array.Create(buffer, ?offset = offset, ?length = length) :> JS.TypedArray

    let int8ArrayFactory = Int8ArrayFactory() :> ITypedArrayFactory

    let uint8ArrayFactory = {
      new ITypedArrayFactory with
        member _.Create(size: int) = JS.Constructors.Uint8Array.Create(size) :> JS.TypedArray
        member _.Create(typedArray: JS.TypedArray) = JS.Constructors.Uint8Array.Create(typedArray) :> JS.TypedArray
        member _.Create(data: obj) = JS.Constructors.Uint8Array.Create(data) :> JS.TypedArray

        member _.Create(buffer: JS.ArrayBuffer, ?offset: int, ?length: int) =
          JS.Constructors.Uint8Array.Create(buffer, ?offset = offset, ?length = length) :> JS.TypedArray
    }
    let int16ArrayFactory = {
      new ITypedArrayFactory with
        member _.Create(size: int) = JS.Constructors.Int16Array.Create(size) :> JS.TypedArray
        member _.Create(typedArray: JS.TypedArray) = JS.Constructors.Int16Array.Create(typedArray) :> JS.TypedArray
        member _.Create(data: obj) = JS.Constructors.Int16Array.Create(data) :> JS.TypedArray

        member _.Create(buffer: JS.ArrayBuffer, ?offset: int, ?length: int) =
          JS.Constructors.Int16Array.Create(buffer, ?offset = offset, ?length = length) :> JS.TypedArray
    }
    let uint16ArrayFactory = {
      new ITypedArrayFactory with
        member _.Create(size: int) = JS.Constructors.Uint16Array.Create(size) :> JS.TypedArray
        member _.Create(typedArray: JS.TypedArray) = JS.Constructors.Uint16Array.Create(typedArray) :> JS.TypedArray
        member _.Create(data: obj) = JS.Constructors.Uint16Array.Create(data) :> JS.TypedArray

        member _.Create(buffer: JS.ArrayBuffer, ?offset: int, ?length: int) =
          JS.Constructors.Uint16Array.Create(buffer, ?offset = offset, ?length = length) :> JS.TypedArray
    }
    let int32ArrayFactory = {
      new ITypedArrayFactory with
        member _.Create(size: int) = JS.Constructors.Int32Array.Create(size) :> JS.TypedArray
        member _.Create(typedArray: JS.TypedArray) = JS.Constructors.Int32Array.Create(typedArray) :> JS.TypedArray
        member _.Create(data: obj) = JS.Constructors.Int32Array.Create(data) :> JS.TypedArray

        member _.Create(buffer: JS.ArrayBuffer, ?offset: int, ?length: int) =
          JS.Constructors.Int32Array.Create(buffer, ?offset = offset, ?length = length) :> JS.TypedArray
    }
    let uint32ArrayFactory = {
      new ITypedArrayFactory with
        member _.Create(size: int) = JS.Constructors.Uint32Array.Create(size) :> JS.TypedArray
        member _.Create(typedArray: JS.TypedArray) = JS.Constructors.Uint32Array.Create(typedArray) :> JS.TypedArray
        member _.Create(data: obj) = JS.Constructors.Uint32Array.Create(data) :> JS.TypedArray

        member _.Create(buffer: JS.ArrayBuffer, ?offset: int, ?length: int) =
          JS.Constructors.Uint32Array.Create(buffer, ?offset = offset, ?length = length) :> JS.TypedArray
    }
    let float32ArrayFactory = {
      new ITypedArrayFactory with
        member _.Create(size: int) = JS.Constructors.Float32Array.Create(size) :> JS.TypedArray
        member _.Create(typedArray: JS.TypedArray) = JS.Constructors.Float32Array.Create(typedArray) :> JS.TypedArray
        member _.Create(data: obj) = JS.Constructors.Float32Array.Create(data) :> JS.TypedArray

        member _.Create(buffer: JS.ArrayBuffer, ?offset: int, ?length: int) =
          JS.Constructors.Float32Array.Create(buffer, ?offset = offset, ?length = length) :> JS.TypedArray
    }
