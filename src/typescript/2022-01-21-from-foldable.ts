import { flip, flow, pipe } from "fp-ts/lib/function"
import * as Sg from "fp-ts/Semigroup"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RA from "fp-ts/ReadonlyArray"
import * as Fld from "fp-ts/lib/Foldable"
import { Mn, Re, Str } from "./lib/fp-ts-imports"

type B = {}
const pairs: ReadonlyArray<[string, number]> = [
  ["a", 1],
  ["c", 2],
  ["a", 2],
  ["b", 3]
]

RR.fromFoldableMap(RA.getSemigroup<B>(), RA.Foldable)(
  pairs,
  ([key, b]) => [key, [b]]
)

pipe(pairs, RR.fromFoldable(Sg.first<B>(), RA.Foldable))

const xs = [1, 2, 4]

// const F: Fld.Foldable<{}> = {
//   foldMap: Fld.foldMap(RR.Foldable, RA.Foldable),
//   reduce: Fld.foldMap(RR.Foldable, RA.Foldable),
//   reduceRight: Fld.foldMap(RR.Foldable, RA.Foldable)
// }

// RR.fromFoldableMap(RA.getSemigroup<number>(), {
//   foldMap: Fld.foldMap(RR.Foldable, RA.Foldable),
//   reduce: Fld.reduce(RR.Foldable, RA.Foldable),
//   reduceRight: Fld.reduceRight(RR.Foldable, RA.Foldable),
//   URI: undefined
// })(
//   { x: ["a1", "a2", "b2"], y: ["b1", "a4"] }
//   , x => ["a", []]
// ) //?
// f: (a: string[]) => readonly [string, readonly number[]]
// RR.fromFoldableMap(
//   RA.getSemigroup<number>(),
//   Fld.getFoldableComposition(RR.Foldable, RA.Foldable)
// )({
//   x: ["a1", "a2", "b2"],
//   y: ["b1", "a4"]
// },
//   x => [x[0], [+x[1]]]
// ) //-> { a: [ 1, 2, 4 ], b: [ 2, 1 ] }

//?
// f: (a: string[]) => readonly [string, readonly number[]]

// const foldMap_ = <M>(M: Mn.Monoid<M>) =>
//   flow(RA.foldMap(M), RR.foldMap(Str.Ord)(M))

const M = RR.getMonoid(RA.getSemigroup<number>())

pipe(
  {
    x: ["a1", "a2", "b2"],
    y: ["b1", "a4"]
  },
  RR.foldMap(Str.Ord)(M)(
    // RR.fromFoldableMap()
    RA.foldMap(M)(str => ({
      [str[0]]: [+str[1]]
    }))
  )
) //?
