import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import * as OT from "fp-ts/OptionT"
import * as Th from "fp-ts/These"

// declare const fooOption: O.Option<string>

// pipe(
//   fooOption,
//   x => O.isSome(x) && x.value
// )

//  OT.getOptionM(Th.getMonad(Sg.getFirst))

declare const a: boolean
declare const b: boolean
declare const c: boolean
declare const x: number

pipe(
  x,
  O.fromPredicate<unknown, number>(_ => a),
  O.alt(() => O.fromPredicate<number, number>(_ => b)),
  O.alt(() => O.fromPredicate<unknown, unknown>(_ => c)),
  O.fold(
    () => false,
    () => true
  )
)
