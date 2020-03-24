import {
  getObjectSemigroup,
  getStructSemigroup,
  Semigroup,
} from "fp-ts/lib/Semigroup"
import { deepEqual } from "fast-equals"
import {
  getStructMonoid,
  monoidString,
} from "fp-ts/lib/Monoid"
import * as R from "fp-ts/lib/Record"
import * as O from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

type T = {
  numbers: { [id: string]: string }
  colors: { [id: string]: string }
  furniture?: string
}
const first: T = {
  numbers: { first: "first" },
  colors: { red: "blue" },
  // furniture: "chair",
}
const second: T = {
  numbers: { second: "second" },
  colors: { red: "red" },
}
const expected: T = {
  numbers: { first: "first", second: "second" },
  colors: { red: "red" },
  furniture: "chair",
}
const output = getObjectSemigroup<T>().concat(
  first,
  second
)

const getObjectMergeSemigroup = <T>(): Semigroup<{
  [key: string]: T
}> => ({
  concat: (x, y) => Object.assign({}, x, y),
})

const output_ = getStructSemigroup<T>({
  numbers: getObjectSemigroup(),
  colors: getObjectSemigroup(),
  furniture: {
    concat: (x?: string, y?: string) =>
      pipe(
        O.fromNullable(x),
        O.alt(() => O.fromNullable(y)),
        O.toUndefined
      ),
  },
}).concat(first, second)

output_
expected

// console.assert(
//   deepEqual(output, expected),
//   `${JSON.stringify(
//     output,
//     null,
//     2
//   )} not ${JSON.stringify(expected, null, 2)}`
// ) //?

console.assert(
  deepEqual(output_, expected),
  `${JSON.stringify(
    output_,
    null,
    2
  )} not ${JSON.stringify(expected, null, 2)}`
) //?
