import * as RA from "fp-ts/ReadonlyArray"
import * as RR from "fp-ts/ReadonlyRecord"
import * as Sg from "fp-ts/Semigroup"
import * as Str from "fp-ts/string"
import { flow, pipe, tuple } from "fp-ts/function"
import * as t from "io-ts"

type M = RR.ReadonlyRecord<string, string>
type Colors1 = RR.ReadonlyRecord<string, string | M>
type Colors2 = RR.ReadonlyRecord<string, string>

const colors1: Colors1 = {
  black: "#000",
  white: "#fff",
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
}

const colors1ToColors2: (colors1: Colors1) => Colors2 = RR.foldMapWithIndex(
  Str.Ord
)(RR.getMonoid(Sg.first<string>()))((k, v) =>
  t.string.is(v)
    ? RR.singleton(k, v)
    : RR.fromFoldable(
        Sg.first<string>(),
        RA.Foldable
      )(
        pipe(
          v,
          RR.collect(Str.Ord)((k_, v_) => [Str.Semigroup.concat(k, k_), v_])
        )
      )
)

const colors1ToColors2_: (colors1: Colors1) => Colors2 = flow(
  RR.collect(Str.Ord)((k, v) =>
    t.string.is(v)
      ? [tuple(k, v)]
      : pipe(
          v,
          RR.collect(Str.Ord)((k_, v_) =>
            tuple(Str.Semigroup.concat(k, k_), v_)
          )
        )
  ),
  RA.flatten,
  RR.fromFoldable(Sg.first<string>(), RA.Foldable)
)

console.log(colors1ToColors2(colors1))
console.log(colors1ToColors2_(colors1))

export {}
// function f(input: Colors1): Colors2 {
//   let output: Colors2 = {}
//   for (let [k, v] of Object.entries(input)) {
//     if (typeof v === "string") {
//       output[k] = v
//     } else {
//       for (let [l, v] of Object.entries(input[k])) {
//         output[`${k}${l}`] = v
//       }
//     }
//   }
//   return output
// }

// type M = {
//   [key: string]: string
// }
// type Colors1 = {
//   [key: string]: string | M
// }
// type Colors2 = {
//   [key: string]: string
// }

RA.uniq(Str.Eq)([])
