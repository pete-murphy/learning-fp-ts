import { Semigroup, semigroupSum, semigroupProduct } from "fp-ts/lib/Semigroup"
import { getMonoid } from "fp-ts/lib/Option"
import { Eq, eqString } from "fp-ts/lib/Eq"
import { fold } from "fp-ts/lib/Semigroup"

import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray"

// Easy:
// implement sum, which combines values in a nonempty array (without taking an initial value)
function sum<A>(S: Semigroup<A>): (n: NonEmptyArray<A>) => A {
  return n => {
    return n.slice(1).reduce(S.concat, n[0])
  }
}

console.log(10, sum(semigroupSum)([1, 2, 3, 4]))
console.log(24, sum(semigroupProduct)([1, 2, 3, 4]))

type MyMap<K, V> = { key: K; value: V }[]

// Hard:
// Implement a Semigroup for MyMap, where the values are concatenated, if their keys are equal
// in terms of the Eq instance provided
function getSemigroup<K, V>(
  kE: Eq<K>,
  vS: Semigroup<V>
): Semigroup<MyMap<K, V>> {
  return {
    concat: (mapA, mapB) => {
      // Implicit assumption that for any given MyMap value, the keys are unique
      const mA = new Map(mapA.map(({ key, value }) => [key, value]))
      const mAKeys = Array.from(mA.keys())
      const acc = new Map(mA)
      for (const { key, value } of mapB) {
        const k = mAKeys.find(k_ => kE.equals(k_, key))
        k ? acc.set(k, vS.concat(mA.get(k)!, value)) : acc.set(key, value)
      }
      return Array.from(acc.entries()).map(([key, value]) => ({ key, value }))
    },
  }
}

type UserLogins = { key: string; value: number }

const myMapSemigroup = getSemigroup(eqString, semigroupSum)

const tuesdayLoginCounts: UserLogins[] = [
  {
    key: "Bob",
    value: 10,
  },
  {
    key: "Susan",
    value: 15,
  },
  {
    key: "Alice",
    value: 20,
  },
  {
    key: "Mark",
    value: 23,
  },
  {
    key: "Chad",
    value: 23,
  },
]

const wednesdayLoginCounts: UserLogins[] = [
  {
    key: "Bob",
    value: 2,
  },
  {
    key: "Susan",
    value: 5,
  },
  {
    key: "Mark",
    value: 3,
  },
]

console.log(
  fold(myMapSemigroup)([], [tuesdayLoginCounts, wednesdayLoginCounts])
)
