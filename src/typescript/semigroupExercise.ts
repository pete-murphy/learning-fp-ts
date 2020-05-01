import {
  Semigroup,
  semigroupSum,
  semigroupString,
  semigroupAll,
  getStructSemigroup,
  fold,
} from "fp-ts/lib/Semigroup"
import { Foldable1, Foldable2, Foldable } from "fp-ts/lib/Foldable"
import { URIS, Kind, URIS2, Kind2, HKT } from "fp-ts/lib/HKT"
import { option, some, none } from "fp-ts/lib/Option"
import { array, foldMap } from "fp-ts/lib/Array"
import { either, right, left } from "fp-ts/lib/Either"
import { increment, constant } from "fp-ts/lib/function"
import { Monoid, getStructMonoid, monoidSum } from "fp-ts/lib/Monoid"
import { pipe } from "fp-ts/lib/pipeable"

// Easy:
// Implement combineArray, which takes a semigroup for values of type A
// and reduces as into the initial value
const combineArray: <A>(S: Semigroup<A>) => (initial: A, as: A[]) => A = S => (
  initial,
  as
) => {
  let acc = initial
  for (const a of as) {
    acc = S.concat(acc, a)
  }
  return acc
}

console.log(11, combineArray(semigroupSum)(1, [1, 2, 3, 4])) // 11
console.log(
  "foobarbaz",
  combineArray(semigroupString)("", ["foo", "bar", "baz"])
) // 11
console.log(true, combineArray(semigroupAll)(true, [true, true, true])) // true
console.log(false, combineArray(semigroupAll)(true, [true, false, true])) // true

// Easy:
// implement avgFraction, a semigroup which combines averages:
type Fraction = { n: number; d: number }
const monoidFraction: Monoid<Fraction> = getStructMonoid({
  n: monoidSum,
  d: {
    empty: 0,
    concat: x => x + 1,
  },
})

const xs = [0, 2, 8, 10] // sum is 20, average is 20 / 4 = 5

const avg = (xs: Array<number>) =>
  pipe(
    xs,
    foldMap(monoidFraction)((n: number) => ({ n, d: monoidFraction.empty.d })),
    ({ n, d }) => n / d
  )

console.log(avg(xs))

// Medium: how could this abstraction be made more robust (avoiding the dubious initial value of {sum: 0, total: 0})?

// Hard:
// Implement combineFoldable, which is exactly like combineArray, except works
// for _any_ foldable, not just arrays!
function combineFoldable<A, F extends URIS2, E>(
  S: Semigroup<A>,
  F: Foldable2<F>
): (initial: A, as: Kind2<F, E, A>) => A
function combineFoldable<A, F extends URIS>(
  S: Semigroup<A>,
  F: Foldable1<F>
): (initial: A, as: Kind<F, A>) => A
function combineFoldable<A, F extends URIS>(
  S: Semigroup<A>,
  F: Foldable<F>
): (initial: A, as: HKT<F, A>) => A {
  return (initial, as) => F.reduce(as, initial, S.concat)
}

console.log(2, combineFoldable(semigroupSum, option)(1, some(1)))
console.log(1, combineFoldable(semigroupSum, option)(1, none))

console.log(2, combineFoldable(semigroupSum, either)(1, right(1)))
console.log(1, combineFoldable(semigroupSum, either)(1, left("foo")))

console.log(
  "foobarbaz",
  combineFoldable(semigroupString, array)("", ["foo", "bar", "baz"])
)

console.log(
  true,
  combineFoldable(semigroupAll, array)(true, [true, true, true])
) // true
console.log(
  false,
  combineFoldable(semigroupAll, array)(true, [true, false, true])
) // true
