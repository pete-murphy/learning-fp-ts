import { pipe } from "fp-ts/lib/function"
import * as Sg from "fp-ts/Semigroup"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RA from "fp-ts/ReadonlyArray"

type B = {}
const pairs: ReadonlyArray<[string, B]> = [
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
