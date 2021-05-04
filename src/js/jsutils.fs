namespace Wil.Js

module Debug =
  open System
  open Fable.Core

  let mutable enabled = false
  let mutable collapsible = true
  let mutable logCollapsed = true
  let mutable indent = ""
  
  let inline enable() = enabled <- true
  let inline disable() = enabled <- false
  let inline setCollapsible value = collapsible <- value
  let inline setLogCollapsed value = logCollapsed <- value

  let inline jsLog msg = JS.console.log(msg)
  let inline jsGroup msg = JS.console.group(msg)
  let inline jsGroupEnd () = jsLog "groupEnd"; JS.console.groupEnd()

#if DEBUG_LOG
  let inline pushIndent() =
    if not collapsible then
      indent <- indent + "  "
  
  let inline popIndent() =
    if collapsible
    then JS.console.groupEnd()
    else indent <- indent.Substring(2)

  let inline log msg =
    if enabled then
      printfn $"{indent}{msg}"

  let inline logIndent msg =
    if enabled then
      if collapsible then
        if logCollapsed then JS.console.groupCollapsed(msg) else JS.console.group(msg)
      else
        log msg
        pushIndent()

  let inline loga (msgs: string list) = String.Join($"\n{indent}", msgs) |> log
#else
  [<Emit("")>]
  let inline pushIndent() = ()
  [<Emit("")>]
  let inline popIndent() = ()
  [<Emit("")>]
  let inline log _ = ()
  [<Emit("")>]
  let inline logIndent _ = ()
  [<Emit("")>]
  let inline loga _ = ()
#endif
