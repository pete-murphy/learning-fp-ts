import {
  E,
  identity,
  Mn,
  pipe,
  RA,
  O,
  RE,
  RNEA,
  Sg,
  Str,
  St,
  tuple
} from "./lib/fp-ts-imports"
import * as Endo from "fp-ts/Endomorphism"

RA.unfold([1, 1], ([n, m]) =>
  n > Number.MAX_SAFE_INTEGER
    ? O.none
    : O.some([n, [m, n + m]])
).length //?

// pipe(
//   RA.replicate<St.State<[bigint, bigint], bigint>>(
//     100,
//     ([n, m]: [bigint, bigint]) => [n, [m, n + m]]
//   ),
//   St.sequenceArray,
//   St.evaluate(tuple(1n, 1n))
// ) //?

const nTimes = <A>(n: number, f: (a: A) => A) =>
  pipe(
    RA.replicate(n, f),
    Mn.concatAll(Endo.getMonoid<A>())
  )

const increment = (n: number) => n + 1

nTimes(10, increment)(1) //?
