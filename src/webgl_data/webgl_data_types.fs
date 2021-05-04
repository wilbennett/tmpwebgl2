namespace Wil.Webgl.DataTypes

open Browser.Types
open Fable.Core
open Wil.Browser.Types
open Wil.Webgl.Types

[<StringEnum>]
type GlPowerPreference =
| Default
| [<CompiledName("high-performance")>] HighPerformance
| [<CompiledName("low-power")>] LowPower

type GlContextAttribute =
| Alpha of bool
| Desynchronized of bool
| Antialias of bool
| Depth of bool
| FailIfMajorPerformanceCaveat of bool
| PowerPreference of GlPowerPreference
| PremultipliedAlpha of bool
| PreserveDrawingBuffer of bool
| Stencil of bool

type GlPixelStorage =
| PACK_ALIGNMENT of GlPixelAlign
| UNPACK_ALIGNMENT of GlPixelAlign
| UNPACK_FLIP_Y_WEBGL
| UNPACK_PREMULTIPLY_ALPHA_WEBGL
| UNPACK_COLORSPACE_CONVERSION_WEBGL of GlPixelConversion
| PACK_ROW_LENGTH of int
| PACK_SKIP_PIXELS of int
| PACK_SKIP_ROWS of int
| UNPACK_ROW_LENGTH of int
| UNPACK_IMAGE_HEIGHT of int
| UNPACK_SKIP_PIXELS of int
| UNPACK_SKIP_ROWS of int
| UNPACK_SKIP_IMAGES of int

type GlTexturePixels =
| PixelData of JS.TypedArray
| PixelImageData of ImageData
| PixelHtmlImage of HTMLImageElement
| PixelCanvas of HTMLCanvasElement
| PixelVideo of HTMLVideoElement
| PixelBitmap of ImageBitmap
