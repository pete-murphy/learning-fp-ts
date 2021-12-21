import * as L from "./foldl"
import * as RA from "fp-ts/ReadonlyArray"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as T from "fp-ts/Tree"
import { identity, pipe } from "fp-ts/function"
import assert from "assert"

const sum: L.Fold<number, number> = run =>
  run({
    step: (x, y) => x + y,
    init: 0,
    done: identity,
  })

const length: L.Fold<number, number> = run =>
  run({
    step: (n, _) => n + 1,
    init: 0,
    done: identity,
  })

const average: L.Fold<number, number> = pipe(
  L.Do,
  L.apS("sum", L.sum),
  L.apS("length", L.length),
  L.map(({ sum, length }) => sum / length)
)

assert.deepStrictEqual(
  pipe(
    RNEA.range(1, 20),
    pipe(average, L.fold(RA.Foldable))
  ),
  10.5
)

assert.deepStrictEqual(
  pipe(
    RNEA.range(1, 20),
    pipe(average, L.take(3), L.fold(RA.Foldable))
  ),
  2
)

assert.deepStrictEqual(
  pipe(
    RNEA.range(1, 20),
    pipe(
      average,
      L.take(3),
      L.prefilter(x => x % 2 === 0),
      L.fold(RA.Foldable)
    )
  ),
  4
)

assert.deepStrictEqual(
  pipe(
    RNEA.range(1, 20),
    pipe(
      average,
      L.prefilter(x => x % 2 === 0),
      L.take(3),
      L.fold(RA.Foldable)
    )
  ),
  2
)

//-> 6.5

// const xs = pipe(
//   RNEA.range(1, 20),
//   pipe(average, L.fold(RA.Foldable))
// )
// console.log(xs)

// const ys = pipe(
//   RNEA.range(1, 20),
//   pipe(average, L.take(3), L.fold(RA.Foldable))
// )
// console.log(ys)

// const zs = pipe(
//   RNEA.range(1, 20),
//   pipe(
//     average,
//     L.take(3),
//     L.prefilter(x => x % 2 === 0),
//     L.fold(RA.Foldable)
//   )
// )
// console.log(zs)

// const zs_ = pipe(
//   RNEA.range(1, 20),
//   pipe(
//     average,
//     L.prefilter(x => x % 2 === 0),
//     L.take(3),
//     L.fold(RA.Foldable)
//   )
// )
// console.log(zs_)

pipe(
  T.make(1, [T.make(2), T.make(3), T.make(20)]),
  pipe(average, L.fold(T.Foldable))
)
//-> 6.5

const sumLazy: L.Fold<() => number, number> = run =>
  run({
    step: (x, y) => x + y(),
    init: 0,
    done: identity,
  })

pipe(
  [
    () => 1,
    () => 2,
    () => {
      throw Error("Ooops")
    },
  ],
  pipe(sumLazy, L.take(2), L.fold(RA.Foldable))
)
//-> 3

const largeArray = RNEA.range(0, 500)

console.time("The entire array")
console.log(
  pipe(largeArray, pipe(average, L.fold(RA.Traversable)))
)
console.timeEnd("The entire array")
//-> 500000
//-> The entire array: 175.586ms

console.time("Just the first two")
console.log(
  pipe(
    largeArray,
    pipe(average, L.take(2), L.fold(RA.Traversable))
  )
)
console.timeEnd("Just the first two")
//-> 0.5
//-> Just the first two: 7.486ms
