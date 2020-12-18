import { pipe } from "fp-ts/lib/function"
import { maybe, nothing } from "./FunctorMaybe"

const expr = pipe(nothing, x => maybe.map(x, n => n + 1)) //?

// const ex2 = pipe(
//   O.none,
//   O.map((n) => n + 1)
// ) //?
