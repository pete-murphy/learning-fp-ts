import {
  URIS,
  Kind,
  URIS2,
  Kind2,
  HKT,
} from "fp-ts/lib/HKT"
import {
  Monoid,
  monoidSum,
  monoidProduct,
  monoidString,
} from "fp-ts/lib/Monoid"
import {
  Foldable1,
  Foldable2,
  Foldable,
} from "fp-ts/lib/Foldable"

import { option, some, none } from "fp-ts/lib/Option"
import {
  Either,
  isRight,
  right,
  left,
  either,
  alt,
  isLeft,
} from "fp-ts/lib/Either"
import { array } from "fp-ts/lib/Array"
import { identity, flow } from "fp-ts/lib/function"
import { Fragment, ReactNode, createElement } from "react"

// Medium:
// Write a getEitherMonoid function which creates Monoid instances for Eithers
// what parameters would you need?
// (If you're stuck, look at the signature of getMonoid from fp-ts/lib/Either)
export function getEitherMonoid<L, A>(
  MA: Monoid<A>
): Monoid<Either<L, A>> {
  return {
    concat: (x, y) =>
      isRight(x) && isRight(y)
        ? right(MA.concat(x.right, y.right))
        : either.alt(x, () => y),
    // concat: (x, y) =>
    //   isLeft(x) ? x : isLeft(y) ? y : right(MA.concat(x.right, y.right)),
    empty: right(MA.empty),
  }
}

const M = getEitherMonoid<number, string>(monoidString)

M.concat(M.empty, left(0)) //?
M.concat(left(0), M.empty) //?

// Hard:
// implement sum, a function that takes a Monoid, and a Foldable, and "compresses" the values
// inside the foldable into a single value
export function sum<A, F extends URIS2, E>(
  M: Monoid<A>,
  F: Foldable2<F>
): (as: Kind2<F, E, A>) => A
export function sum<A, F extends URIS>(
  M: Monoid<A>,
  F: Foldable1<F>
): (as: Kind<F, A>) => A
export function sum<A, F extends URIS>(
  M: Monoid<A>,
  F: Foldable<F>
): (as: HKT<F, A>) => A {
  return (as) => F.foldMap(M)(as, identity)
  // return (as) => F.reduce(as, M.empty, M.concat)
}

sum(monoidSum, option)(some(1)) //? 1
sum(monoidSum, option)(none) //? 0
sum(monoidProduct, option)(none) //? 1
sum(monoidSum, array)([1, 2, 3, 4]) //? 10
sum(monoidSum, array)([]) //? 0
sum(monoidProduct, array)([]) //? 1

// export const monoidSpace: Monoid<string> = {
//   concat: (x, y) => (x + " " + y).trim(),
//   empty: "",
// }

// const [x, y, z] = ["!", " !", ""]
// monoidSpace.concat(monoidSpace.concat(x, y), z) //?
// monoidSpace.concat(x, monoidSpace.concat(y, z)) //?

export const monoidJSX: Monoid<ReactNode> = {
  concat: (x, y) =>
    createElement(Fragment, {
      children: [x, y],
    }),
  empty: Fragment,
}

export const monoidFunction: Monoid<<A>(x: A) => A> = {
  concat: flow,
  empty: identity,
}

// const getMonoidStruct = (r: Record<string, )
