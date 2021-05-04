namespace Wil.Browser.Types

open Browser.Types
open Browser.Dom

[<AutoOpen>]
module Utils =
  let emptyImageData =
    let canvas = document.createElement("canvas") |> unbox<HTMLCanvasElement>
    let ctx = canvas.getContext_2d()
    ctx.createImageData(1.0, 1.0)

  let getClientRect(elem: HTMLElement) =
    // getBoundingClientRect includes the border while clientWidth and clientHeight do not.
    // Exclude borders from the result.
    let cw = elem.clientWidth
    let ch = elem.clientHeight
    let rect = elem.getBoundingClientRect()
    rect.x <- rect.x + (rect.width - cw) * 0.5
    rect.y <- rect.y + (rect.height - ch) * 0.5
    rect.width <- cw
    rect.height <- ch
    rect
