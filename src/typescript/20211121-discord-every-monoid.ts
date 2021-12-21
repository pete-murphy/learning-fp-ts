import * as A from "fp-ts/Array"
import * as RA from "fp-ts/ReadonlyArray"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as E from "fp-ts/Either"
import { constTrue, flow, pipe, tuple } from "fp-ts/function"
import * as t from "io-ts"
import * as Mn from "fp-ts/Monoid"
import * as Eq from "fp-ts/Eq"
import * as St from "fp-ts/State"

// const getEqualMonoid = <A>(Eq: Eq.Eq<A>) =>

const xs = [1, 1, 1, 0]

// RA.zipWith(xs, RA.dropLeft(1)(xs),  )

const allEqual = <A>(Eq: Eq.Eq<A>): ((as: ReadonlyArray<A>) => boolean) =>
  RA.match(
    constTrue,
    RNEA.matchLeft((head, tail) =>
      pipe(
        tail,
        RA.every(a => Eq.equals(a, head))
      )
    )
  )

interface Monoid<A> {
  readonly concat: (x: A, y: A) => A
  readonly empty: A
}
