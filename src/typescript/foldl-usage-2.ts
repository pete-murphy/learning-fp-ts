import * as L from "./foldl"
import * as RA from "fp-ts/ReadonlyArray"
import { pipe } from "fp-ts/function"

// The Applicative instance for Fold lets us combine Folds
// and operate over the result
const average: L.Fold<number, number> = pipe(
  L.Do,
  L.apS("sum", L.sum),
  L.apS("length", L.length),
  L.map(({ sum, length }) => sum / length)
)

const isEven = (n: number) => n % 2 === 0

L.fold(RA.Foldable)(
  pipe(
    // Reading this pipeline *backwards*:
    average, // - filter even numbers  [2, 40, 50, 20]
    L.take(2), // - take the first two   [2, 40]
    L.prefilter(isEven) // - get the average      42 / 2
  ), //                        = 21
  [1, 2, 3, 40, 50, 20]
)
