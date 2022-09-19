import { Ordering } from "fp-ts/Ordering"
import * as RA from "fp-ts/ReadonlyArray"
import * as N from "fp-ts/number"
import { pipe } from "fp-ts/function"

// Assumes working with an ordered container
const spanLeftTripartitionIndex = <A>(
  as: ReadonlyArray<A>,
  compare: (a: A) => Ordering
): readonly [number, number] => {
  const l = as.length
  let i = 0
  for (; i < l; i++) {
    if (!(compare(as[i]) === -1)) {
      break
    }
  }
  let j = i
  for (; j < l; j++) {
    if (!(compare(as[j]) === 0)) {
      break
    }
  }
  return [i, j - i]
}

interface SpannedTripartioned<A> {
  readonly lt: ReadonlyArray<A>
  readonly eq: ReadonlyArray<A>
  readonly gt: ReadonlyArray<A>
}

const spanLeftTripartition =
  <A>(compare: (a: A) => Ordering) =>
  (
    as: ReadonlyArray<A>
  ): SpannedTripartioned<A> => {
    const [i, j] = spanLeftTripartitionIndex(
      as,
      compare
    )
    const [lt, rest] = RA.splitAt(i)(as)
    const [eq, gt] = RA.splitAt(j)(rest)
    return { lt, eq, gt }
  }

// RA.spanLeft()
// const spanLeftOrdering = <A>(
//   as: ReadonlyArray<A>,
//   compare: (a: A) => Ordering
// )

pipe(
  [1, 2, 3, 4, 5],
  spanLeftTripartition(n => N.Ord.compare(n, 2))
) //?
