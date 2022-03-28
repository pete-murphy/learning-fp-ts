import {
  Ap,
  Mn,
  pipe,
  RA,
  Re,
  Sg
} from "./lib/fp-ts-imports"
import * as Endo from "fp-ts/Endomorphism"

const addOne = (n: number) => n + 1
const addTwo = (n: number) => n + 2
const capitalise = (str: string) => str.toLocaleUpperCase()

// pipe(
//   [1, 2, "foo"],
//   applyOver([addOne, addTwo, capitalise]) // Looking for this applyOver
// )
// // [2, 4, "Foo"]

// Ap.sequenceT(Re.Apply)(addOne, addTwo, capitalise)
// Ap.sequenceT()(addOne, addTwo, capitalise)

type FnFrom<
  As extends ReadonlyArray<unknown>,
  Bs extends ReadonlyArray<unknown>
> = Readonly<{
  [K in keyof As]: (
    a: As[K]
  ) => K extends keyof Bs ? Bs[K] : never
}>

// const applyOver = <
//   As extends ReadonlyArray<unknown>,
//   K extends keyof As,
//   Fns extends ReadonlyArray<unknown>
// >(
//   fs: Fns extends FnFrom<As, infer Bs> ? Bs : never
// ): ((
//   as: As
// ) => Fns extends FnFrom<As, infer Bs>
//   ? K extends keyof Bs
//     ? Bs[K]
//     : never
//   : never) => {
//   return as => {
//     const ret: Fns extends FnFrom<As, infer Bs>
//       ? K extends keyof Bs
//         ? Bs[K]
//         : never
//       : never = []
//     for (
//       let i = 0;
//       i < Math.min(as.length, fs.length);
//       i++
//     ) {
//       ret.push(fs[i](as[i]))
//     }
//     return ret
//   }
// }

// pipe(
//   [1, true, "foo"],
//   applyOver([
//     x => x + 1,
//     b => !b,
//     str => str.toLocaleUpperCase()
//   ])
// ) //?

// type ExtractValues<
//   T extends ReadonlyArray<ReadonlyArray<unknown>>
// > = Readonly<{
//   [K in keyof T]: T[K] extends ReadonlyArray<infer S>
//     ? S
//     : never
// }>
// export const zipV = <
//   As extends ReadonlyArray<ReadonlyArray<unknown>>
// >(
//   ...as: As
// ): ReadonlyArray<ExtractValues<As>> => {
//   // using a mutable temp array; return type will make it "immutable" outside
//   const res: Array<ExtractValues<As>> = []
//   const l =
//     as.length === 0 ? 0 : Math.min(...as.map(a => a.length))
//   for (let i = 0; i < l; i++) {
//     res[i] = pipe(
//       as,
//       RA.map(a => a[i])
//     ) as ExtractValues<As>
//   }
//   return res
// }

function applyOver<A0, B0>(f0: (_: A0) => B0) {}
