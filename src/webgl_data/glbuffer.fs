namespace Wil.Webgl.Data

open Fable.Core
open Wil.Js
open Wil.Webgl.Types
open Wil.Webgl.Core

type GlBuffer(gl: GL) =
  let mutable isBuffered = false
  let mutable dirtyOffset = System.Int32.MaxValue
  let mutable dirtyEndOffset = -1
  let mutable target = GlBufferTarget.ARRAY_BUFFER
  let mutable usage = GlBufferUsage.STATIC_DRAW
  let mutable factory = float32ArrayFactory
  let mutable data: JS.TypedArray = factory.Create(0)
  let mutable buffer = getEmptyBuffer gl

  member val BufferKind = target
  member val Usage = usage
  member _.Data with get() = data
  member val AutoClean = true with get, set

  member _.Init(bufferTarget, bufferUsage, arrayFactory) =
    target <- bufferTarget
    usage <- bufferUsage
    factory <- arrayFactory
    buffer <- gl.createBuffer()

  member _.Delete() =
    let empty = getEmptyBuffer gl

    if buffer <> empty then
      gl.deleteBuffer(buffer)

  member _.Clean(buffered) =
    dirtyOffset <- System.Int32.MaxValue
    dirtyEndOffset <- -1
    isBuffered <- buffered

  member _.DirtyRange(startOffset, endOffset) =
    dirtyOffset <- min startOffset dirtyOffset
    dirtyEndOffset <- max endOffset dirtyEndOffset
    dirtyOffset <- max dirtyOffset 0
    dirtyEndOffset <- min dirtyEndOffset (data.length - 1)

  member this.SetLength(length) =
    if length <> data.length then
      let length = max length 0
      data <- factory.Create(length)
      isBuffered <- false
      this.DirtyRange(0, length - 1)

  member _.Bind() = bindBuffer gl target buffer
  member _.BindBase(location) = bindBufferBase gl target location buffer

  member this.SetValuesRange<'a>(values: 'a [], startOffset, endOffset) =
    this.DirtyRange(startOffset, endOffset)
    let dataArray = data :?> JS.TypedArray<'a>

    for i in [startOffset .. endOffset] do
      dataArray.[i] <- values.[i]

  member this.SetValuesOffset<'a>(values: 'a [], startOffset) =
    this.DirtyRange(startOffset, startOffset + values.Length - 1)
    (data :?> JS.TypedArray<'a>).set(values, startOffset) |> ignore

  member this.SetValues<'a>(values: 'a [], startOffset, endOffset) =
    if data.length <> values.Length then
      data <- factory.Create(values)
      isBuffered <- false
    else
      (data :?> JS.TypedArray<'a>).set(values) |> ignore
    
    this.DirtyRange(startOffset, endOffset)

  member this.SetValues<'a>(values: 'a []) = this.SetValues(values, 0, values.Length - 1)

  member this.Update() =
    if dirtyEndOffset >= 0 then
      if isBuffered then
        let dirtyLength = dirtyEndOffset - dirtyOffset + 1
        let bytesPerIndex = data.byteLength / data.length
        let startOffset = dirtyOffset * bytesPerIndex
        // let d = JS.Constructors.Float32Array.Create(data.buffer)
        // printfn $"{d}"
        bufferSubData gl target startOffset data dirtyOffset dirtyLength
      else
        // let d = JS.Constructors.Float32Array.Create(data.buffer)
        // printfn $"{d}"
        isBuffered <- this.AutoClean
        bufferData gl target data usage

    if this.AutoClean then this.Clean(true)
