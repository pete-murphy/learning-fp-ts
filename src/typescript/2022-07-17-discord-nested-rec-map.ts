// Is there a way to map over values of nested records and keep the correct keys and values in type?
// Ie.

// const nested = {x: 1, y: {z: 2}}
// const mapped map(toString)(nested)
// console.log(mapped.x, mapped.y.z)

// type Nested = ReadonlyRecord<string, string> | ReadonlyRecord<string, Nested>

import { semigroup, struct } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import * as RR from "fp-ts/ReadonlyRecord"

interface NestedRecord<A> {
  readonly [key: string]: A | NestedRecord<A>
}

const mapNestedRecord =
  <A>(isA: (x: unknown) => x is A) =>
  <B, R extends NestedRecord<A>>(
    f: (a: A) => B
  ): ((nested: R) => R) =>
    RR.map(aOrNestedA =>
      isA(aOrNestedA)
        ? f(aOrNestedA)
        : mapNestedRecord(isA)(f)(aOrNestedA)
    ) as (nested: R) => R

// Example
const nestedRecord: NestedRecord<number> = {
  x: 1,
  y: { z: 2 }
}
const isNumber = (x: unknown): x is number =>
  typeof x === "number"

pipe(
  nestedRecord,
  mapNestedRecord(isNumber)(n => n.toString())
) //?

const nestedStruct: { x: number; y: { z: number } } = {
  x: 1,
  y: { z: 2 }
}

const mapped = pipe(
  nestedStruct,
  mapNestedRecord(isNumber)(n => n.toString())
)

mapped.y.z //

// semigroup.struct()
struct.getAssignSemigroup()

// const worded: T.Traversal<Nested<string>, string> = {
//   modifyF:
//     <F>(F: Applicative<F>) =>
//     (f: (str: string) => HKT<F, string>) =>
// }

// const nested = { x: 1, y: { z: 2 } }
