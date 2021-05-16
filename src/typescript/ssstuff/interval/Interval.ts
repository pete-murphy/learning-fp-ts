import * as O from "fp-ts/Option"
import * as Dt from "fp-ts/Date"
import * as N from "fp-ts/Number"
import * as Ord from "fp-ts/Ord"
import * as RM from "fp-ts/ReadonlyMap"
import * as RA from "fp-ts/ReadonlyArray"
import * as RTup from "fp-ts/ReadonlyTuple"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as St from "fp-ts/State"
import * as Lt from "fp-ts/Lattice"
import { JoinSemilattice } from "fp-ts/JoinSemilattice"
import { MeetSemilattice } from "fp-ts/MeetSemilattice"
import { Lattice } from "fp-ts/Lattice"
import * as Sg from "fp-ts/Semigroup"
import * as Show from "fp-ts/Show"
import * as Rg from "fp-ts/Ring"
import * as Srg from "fp-ts/Semiring"
import * as At from "monocle-ts/At"
import * as T from "monocle-ts/Traversal"
// import * as At from "monocle-ts/At"
import { pipe, tuple } from "fp-ts/lib/function"
import { Functor1 } from "fp-ts/lib/Functor"
import { match } from "../matchers"

import * as Ex from "./Extended"

const matchOnTag = match.on("_tag")

export const URI = "Interval"

export type URI = typeof URI

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: Interval<A>
  }
}

/**
 * A partial translation of `data-interval`
 * (https://hackage.haskell.org/package/data-interval-2.1.0)
 */
export type Interval<A> =
  | Between<A>
  | GreaterThan<A>
  | LessThan<A>
  | Infinite
  | Empty

export interface Between<A> {
  readonly _tag: "Between"
  readonly lower: A
  readonly upper: A
}

export interface GreaterThan<A> {
  readonly _tag: "GreaterThan"
  readonly lower: A
}

export interface LessThan<A> {
  readonly _tag: "LessThan"
  readonly upper: A
}

export interface Infinite {
  readonly _tag: "Infinite"
}

export interface Empty {
  readonly _tag: "Empty"
}

export const between = <A>(lower: A, upper: A): Between<A> => ({
  _tag: "Between",
  lower,
  upper,
})

export const greaterThan = <A>(lower: A): GreaterThan<A> => ({
  _tag: "GreaterThan",
  lower,
})

export const lessThan = <A>(upper: A): LessThan<A> => ({
  _tag: "LessThan",
  upper,
})

export const infinite: Infinite = {
  _tag: "Infinite",
}

export const empty: Empty = {
  _tag: "Empty",
}

export const singleton = <A>(a: A) => between(a, a)

// @TODO - Pete Murphy 2021-05-14 - NOT TESTED
export const interval =
  <A>(ordA: Ord.Ord<A>) =>
  (lower: Ex.Extended<A>, upper: Ex.Extended<A>): Interval<A> =>
    pipe(
      lower,
      matchOnTag({
        NegInf: () =>
          pipe(
            upper,
            matchOnTag({
              NegInf: () => empty,
              Finite: upper_ => lessThan(upper_.value),
              PosInf: () => infinite,
            })
          ),
        Finite: lower_ =>
          pipe(
            upper,
            matchOnTag({
              NegInf: () => empty,
              Finite: upper_ =>
                Ord.lt(ordA)(lower_.value, upper_.value)
                  ? between(lower_.value, upper_.value)
                  : empty,
              PosInf: () => greaterThan(lower_.value),
            })
          ),
        PosInf: () => empty,
      })
    )

export const isEmpty = <A>(interval: Interval<A>): interval is Empty =>
  interval._tag === "Empty"

export const isConnected =
  <A>(ordA: Ord.Ord<A>) =>
  (i1: Interval<A>, i2: Interval<A>): boolean => {
    if (isEmpty(i1) || isEmpty(i2)) {
      return true
    }
    return !isEmpty(intersection(ordA)(i1, i2))
  }

export const hull =
  <A>(ordA: Ord.Ord<A>) =>
  (i1: Interval<A>, i2: Interval<A>): Interval<A> => {
    if (isEmpty(i1)) {
      return i2
    }
    if (isEmpty(i2)) {
      return i1
    }
    const minLB = Ord.min(Ex.getOrd(ordA))(lowerBound(i1), lowerBound(i2))
    const maxUB = Ord.max(Ex.getOrd(ordA))(upperBound(i1), upperBound(i2))

    return interval(ordA)(minLB, maxUB)
  }

export const getShowInterval = <A>({
  show,
}: Show.Show<A>): Show.Show<Interval<A>> => ({
  show: match.on("_tag")({
    Between: ({ lower, upper }) => `between(${show(lower)}, ${show(upper)})`,
    GreaterThan: ({ lower }) => `greaterThn(${show(lower)})`,
    LessThan: ({ upper }) => `lessThan(${show(upper)})`,
    Infinite: () => `infinite`,
    Empty: () => `empty`,
  }),
})

export const map: <A, B>(f: (a: A) => B) => (fa: Interval<A>) => Interval<B> =
  f =>
    match.on("_tag")({
      Between: ({ lower, upper }) => between(f(lower), f(upper)),
      GreaterThan: ({ lower }) => greaterThan(f(lower)),
      LessThan: ({ upper }) => greaterThan(f(upper)),
      Infinite: () => infinite,
      Empty: () => empty,
    })

const _map: Functor1<URI>["map"] = (fa, f) => pipe(fa, map(f))

export const Functor: Functor1<URI> = {
  URI,
  map: _map,
}

export const getJoinSemilattice = <A>(
  ordA: Ord.Ord<A>
): JoinSemilattice<Interval<A>> => {
  const min = Ord.min(ordA)
  const max = Ord.max(ordA)
  return {
    join: (x, y) =>
      pipe(
        x,
        match.on("_tag")({
          Between: x_ =>
            pipe(
              y,
              match.on("_tag")({
                Between: y_ =>
                  between(min(x_.lower, y_.lower), max(x_.upper, y_.upper)),
                GreaterThan: y_ => greaterThan(min(x_.lower, y_.lower)),
                LessThan: y_ => lessThan(max(x_.upper, y_.upper)),
                Infinite: () => infinite,
                Empty: () => x_,
              })
            ),
          GreaterThan: x_ =>
            pipe(
              y,
              match.on("_tag")({
                Between: y_ => greaterThan(min(x_.lower, y_.lower)),
                GreaterThan: y_ => greaterThan(min(x_.lower, y_.lower)),
                LessThan: () => infinite,
                Infinite: () => infinite,
                Empty: () => x_,
              })
            ),
          LessThan: x_ =>
            pipe(
              y,
              match.on("_tag")({
                Between: y_ => lessThan(max(x_.upper, y_.upper)),
                GreaterThan: () => infinite,
                LessThan: y_ => lessThan(max(x_.upper, y_.upper)),
                Infinite: () => infinite,
                Empty: () => x_,
              })
            ),
          Infinite: () => infinite,
          Empty: () => y,
        })
      ),
  }
}

export const getMeetSemilattice = <A>(
  ordA: Ord.Ord<A>
): MeetSemilattice<Interval<A>> => {
  const min = Ord.min(ordA)
  const max = Ord.max(ordA)
  const gt = Ord.gt(ordA)
  const lt = Ord.lt(ordA)
  return {
    meet: (x, y) =>
      pipe(
        x,
        match.on("_tag")({
          Between: x_ =>
            pipe(
              y,
              match.on("_tag")({
                Between: y_ => {
                  const lower = max(x_.lower, y_.lower)
                  const upper = min(x_.upper, y_.upper)
                  return gt(lower, upper) ? empty : between(lower, upper)
                },
                GreaterThan: y_ => {
                  const lower = max(x_.lower, y_.lower)
                  return gt(lower, x_.upper) ? empty : between(lower, x_.upper)
                },
                LessThan: y_ => {
                  const upper = min(x_.upper, y_.upper)
                  return lt(upper, x_.lower) ? empty : between(x_.lower, upper)
                },
                Infinite: () => x_,
                Empty: () => empty,
              })
            ),
          GreaterThan: x_ =>
            pipe(
              y,
              match.on("_tag")({
                Between: y_ => {
                  const lower = max(x_.lower, y_.lower)
                  return gt(lower, y_.upper) ? empty : between(lower, y_.upper)
                },
                GreaterThan: y_ => greaterThan(max(x_.lower, y_.lower)),
                LessThan: y_ =>
                  gt(x_.lower, y_.upper) ? empty : between(x_.lower, y_.upper),
                Infinite: () => x_,
                Empty: () => empty,
              })
            ),
          LessThan: x_ =>
            pipe(
              y,
              match.on("_tag")({
                Between: y_ => {
                  const upper = min(x_.upper, y_.upper)
                  return lt(upper, y_.lower) ? empty : between(y_.lower, upper)
                },
                GreaterThan: y_ =>
                  gt(y_.lower, x_.upper) ? empty : between(y_.lower, x_.upper),
                LessThan: y_ => lessThan(min(x_.upper, y_.upper)),
                Infinite: () => x_,
                Empty: () => empty,
              })
            ),
          Infinite: () => y,
          Empty: () => empty,
        })
      ),
  }
}

export const getLattice = <A>(ordA: Ord.Ord<A>): Lattice<Interval<A>> => ({
  join: getJoinSemilattice(ordA).join,
  meet: getMeetSemilattice(ordA).meet,
})

export const lowerBound: <A>(interval: Interval<A>) => Ex.Extended<A> = pipe(
  match.on("_tag")({
    Between: ({ lower }) => Ex.finite(lower),
    GreaterThan: ({ lower }) => Ex.finite(lower),
    LessThan: () => Ex.negInf,
    Infinite: () => Ex.negInf,
    Empty: () => Ex.posInf,
  })
)

export const upperBound: <A>(interval: Interval<A>) => Ex.Extended<A> = pipe(
  match.on("_tag")({
    Between: ({ upper }) => Ex.finite(upper),
    GreaterThan: () => Ex.posInf,
    LessThan: ({ upper }) => Ex.finite(upper),
    Infinite: () => Ex.posInf,
    Empty: () => Ex.negInf,
  })
)

export const intersection =
  <A>(ordA: Ord.Ord<A>) =>
  (i1: Interval<A>, i2: Interval<A>): Interval<A> => {
    const exOrd = Ex.getOrd(ordA)
    const maxLB = Ord.max(exOrd)(lowerBound(i1), lowerBound(i2))
    const minUB = Ord.min(exOrd)(upperBound(i1), upperBound(i2))
    return interval(ordA)(maxLB, minUB)
  }

export const member =
  <A>(ordA: Ord.Ord<A>) =>
  (a: A) =>
  (i: Interval<A>): boolean =>
    Ord.between(Ex.getOrd(ordA))(lowerBound(i), upperBound(i))(Ex.finite(a)) &&
    !Ex.getOrd(ordA).equals(Ex.finite(a), lowerBound(i)) &&
    !Ex.getOrd(ordA).equals(Ex.finite(a), upperBound(i))

/**
 * @internal
 */
export const upTo = <A>(interval: Interval<A>): Interval<A> =>
  pipe(
    lowerBound(interval),
    matchOnTag({
      NegInf: () => empty,
      Finite: ({ value }) => lessThan(value),
      PosInf: () => infinite,
    })
  )

/**
 * @internal
 */
export const downTo = <A>(interval: Interval<A>): Interval<A> =>
  pipe(
    upperBound(interval),
    matchOnTag({
      NegInf: () => infinite,
      Finite: ({ value }) => greaterThan(value),
      PosInf: () => empty,
    })
  )
