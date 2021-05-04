namespace Wil.Browser.Types

[<AutoOpen>]
module BrowserExtensions =
  open Browser.Types
  open Fable.Core

  type ListenerOptions = {
    capture: bool option
    once: bool option
    passive: bool option
  }

  type ClientRect with
    [<Emit("$0.x{{=$1}}")>]
    member _.x with get(): float = jsNative and set(value): unit = jsNative
    [<Emit("$0.y{{=$1}}")>]
    member _.y with get(): float = jsNative and set(value): unit = jsNative

  // TODO: Need proper implementation or figure out where this is located.
  type [<AllowNullLiteral>] ImageBitmap =
      abstract Close: unit -> unit

  type Window with
    [<Emit("$0.addEventListener($1...)")>]
    member _.addEventListener(listenerType: string, listener: Event -> unit, opts: ListenerOptions): unit = jsNative

  type HTMLCanvasElement with
    [<Emit("$0.getContext(\"webgl2\", $1)")>]
    member __.getWebgl2Context(attributes: obj): WebGLRenderingContext = jsNative
