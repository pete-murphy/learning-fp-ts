import * as Ord from "fp-ts/Ord"
import { JoinSemilattice } from "fp-ts/JoinSemilattice"
import { MeetSemilattice } from "fp-ts/MeetSemilattice"
import { Lattice } from "fp-ts/Lattice"
import * as Show from "fp-ts/Show"
import { pipe } from "fp-ts/lib/function"
import { Functor1 } from "fp-ts/lib/Functor"
import { match } from "../matchers.ignore"

import * as Ex from "./Extended"

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
 *
 * The implementation is simplified to only consider closed-open intervals. This
 * entails that there is no valid singleton interval (`between(1, 1)`, for
 * example, would be invalid) because that would require the single point be
 * both open _and_ closed.
 */
export type Interval<A> =
  /**
   * The closed-open interval between two values of type `A`
   */
  | Between<A>
  /**
   * The interval greater than _or equal to_ a value of type `A`
   */
  | GreaterThan<A>
  /**
   * The interval _strictly_ less than a value of type `A`
   */
  | LessThan<A>
  /**
   * The infinite interval
   */
  | Infinite
  /**
   * The empty interval
   */
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

// -------------------------------------------------------------------------------------
// Constructors
// -------------------------------------------------------------------------------------

/**
 * Constructs an interval _strictly_ between two values of type `A`
 *
 * **NOTE:** It is possible to construct invalid intervals using this
 * constructor directly (i.e., if `lower >= upper`). See also `interval`, which
 * produces intervals that are correct-by-construction.
 *
 * @param lower Lower bound of interval
 * @param upper Upper bound of interval
 */
export const between = <A>(
  lower: A,
  upper: A
): Between<A> => ({
  _tag: "Between",
  lower,
  upper,
})

/**
 * Constructs an interval that is greater than _or equal to_ the value passed in
 *
 * @param lower Lower bound of interval
 */
export const greaterThan = <A>(
  lower: A
): GreaterThan<A> => ({
  _tag: "GreaterThan",
  lower,
})

/**
 * Constructs an interval that is _strictly_ less than the value passed in
 *
 * @param upper Upper bound of interval
 */
export const lessThan = <A>(upper: A): LessThan<A> => ({
  _tag: "LessThan",
  upper,
})

/**
 * The infinite interval
 */
export const infinite: Infinite = {
  _tag: "Infinite",
}

/**
 * The empty interval
 */
export const empty: Empty = {
  _tag: "Empty",
}

/**
 * Produces correct-by-construction intervals on some type `A`, given an `Ord`
 * instance as well as an upper and lower bound of type `Extended<A>` (which
 * extends `A` to include two additional values indicating negative and positive
 * infinity). Passing a lower bound that is greater than _or equal to_ the upper
 * bound will produce the empty interval.
 *
 * @param ordA `Ord` instance for the interval type `A`.
 */
export const interval =
  <A>(ordA: Ord.Ord<A>) =>
  (
    lower: Ex.Extended<A>,
    upper: Ex.Extended<A>
  ): Interval<A> =>
    pipe(
      lower,
      match.on("_tag")({
        NegInf: () =>
          pipe(
            upper,
            match.on("_tag")({
              NegInf: () => empty,
              Finite: upper_ => lessThan(upper_.value),
              PosInf: () => infinite,
            })
          ),
        Finite: lower_ =>
          pipe(
            upper,
            match.on("_tag")({
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

/**
 * Test whether an interval is empty. Because we are defining intervals as
 * closed-open, we say that an interval is empty if it matches either the
 * `empty` constructor, or if its lower bound is greater-than-or-equal to its
 * upper bound.
 */
export const isEmpty_ =
  <A>(ordA: Ord.Ord<A>) =>
  (interval: Interval<A>): boolean =>
    interval._tag === "Empty" ||
    Ord.geq(Ex.getOrd(ordA))(
      lowerBound(interval),
      upperBound(interval)
    )

export const getShowInterval = <A>({
  show,
}: Show.Show<A>): Show.Show<Interval<A>> => ({
  show: match.on("_tag")({
    Between: ({ lower, upper }) =>
      `between(${show(lower)}, ${show(upper)})`,
    GreaterThan: ({ lower }) =>
      `greaterThan(${show(lower)})`,
    LessThan: ({ upper }) => `lessThan(${show(upper)})`,
    Infinite: () => `infinite`,
    Empty: () => `empty`,
  }),
})

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
                  between(
                    min(x_.lower, y_.lower),
                    max(x_.upper, y_.upper)
                  ),
                GreaterThan: y_ =>
                  greaterThan(min(x_.lower, y_.lower)),
                LessThan: y_ =>
                  lessThan(max(x_.upper, y_.upper)),
                Infinite: () => infinite,
                Empty: () => x_,
              })
            ),
          GreaterThan: x_ =>
            pipe(
              y,
              match.on("_tag")({
                Between: y_ =>
                  greaterThan(min(x_.lower, y_.lower)),
                GreaterThan: y_ =>
                  greaterThan(min(x_.lower, y_.lower)),
                LessThan: () => infinite,
                Infinite: () => infinite,
                Empty: () => x_,
              })
            ),
          LessThan: x_ =>
            pipe(
              y,
              match.on("_tag")({
                Between: y_ =>
                  lessThan(max(x_.upper, y_.upper)),
                GreaterThan: () => infinite,
                LessThan: y_ =>
                  lessThan(max(x_.upper, y_.upper)),
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
                  return gt(lower, upper)
                    ? empty
                    : between(lower, upper)
                },
                GreaterThan: y_ => {
                  const lower = max(x_.lower, y_.lower)
                  return gt(lower, x_.upper)
                    ? empty
                    : between(lower, x_.upper)
                },
                LessThan: y_ => {
                  const upper = min(x_.upper, y_.upper)
                  return lt(upper, x_.lower)
                    ? empty
                    : between(x_.lower, upper)
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
                  return gt(lower, y_.upper)
                    ? empty
                    : between(lower, y_.upper)
                },
                GreaterThan: y_ =>
                  greaterThan(max(x_.lower, y_.lower)),
                LessThan: y_ =>
                  gt(x_.lower, y_.upper)
                    ? empty
                    : between(x_.lower, y_.upper),
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
                  return lt(upper, y_.lower)
                    ? empty
                    : between(y_.lower, upper)
                },
                GreaterThan: y_ =>
                  gt(y_.lower, x_.upper)
                    ? empty
                    : between(y_.lower, x_.upper),
                LessThan: y_ =>
                  lessThan(min(x_.upper, y_.upper)),
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

export const getLattice = <A>(
  ordA: Ord.Ord<A>
): Lattice<Interval<A>> => ({
  join: getJoinSemilattice(ordA).join,
  meet: getMeetSemilattice(ordA).meet,
})

/**
 * Calculate the lower bound of an interval.
 */
export const lowerBound: <A>(
  interval: Interval<A>
) => Ex.Extended<A> = pipe(
  match.on("_tag")({
    Between: ({ lower }) => Ex.finite(lower),
    GreaterThan: ({ lower }) => Ex.finite(lower),
    LessThan: () => Ex.negInf,
    Infinite: () => Ex.negInf,
    Empty: () => Ex.posInf,
  })
)

/**
 * Calculate the upper bound of an interval.
 */
export const upperBound: <A>(
  interval: Interval<A>
) => Ex.Extended<A> = pipe(
  match.on("_tag")({
    Between: ({ upper }) => Ex.finite(upper),
    GreaterThan: () => Ex.posInf,
    LessThan: ({ upper }) => Ex.finite(upper),
    Infinite: () => Ex.posInf,
    Empty: () => Ex.negInf,
  })
)

/**
 * Determines whether two intervals overlap (if their intersection is
 * non-empty).
 */
export const isConnected =
  <A>(ordA: Ord.Ord<A>) =>
  (i1: Interval<A>, i2: Interval<A>): boolean => {
    if (isEmpty_(ordA)(i1) || isEmpty_(ordA)(i2)) {
      return true
    }
    const [i1lb, i1ub] = [lowerBound(i1), upperBound(i1)]
    const [i2lb, i2ub] = [lowerBound(i2), upperBound(i2)]
    const eq = Ex.getOrd(ordA).equals
    return (
      !isEmpty_(ordA)(intersection(ordA)(i1, i2)) ||
      eq(i1ub, i2lb) ||
      eq(i2ub, i1lb)
    )
  }

/**
 * The convex hull of two intervals, i.e., the smallest interval that
 * encompasses all of both intervals.
 */
export const hull =
  <A>(ordA: Ord.Ord<A>) =>
  (i1: Interval<A>, i2: Interval<A>): Interval<A> => {
    if (isEmpty_(ordA)(i1)) {
      return i2
    }
    if (isEmpty_(ordA)(i2)) {
      return i1
    }
    const exOrd = Ex.getOrd(ordA)
    const minLB = Ord.min(exOrd)(
      lowerBound(i1),
      lowerBound(i2)
    )
    const maxUB = Ord.max(exOrd)(
      upperBound(i1),
      upperBound(i2)
    )

    return interval(ordA)(minLB, maxUB)
  }

/**
 * Calculate the intersection of two intervals.
 */
export const intersection =
  <A>(ordA: Ord.Ord<A>) =>
  (i1: Interval<A>, i2: Interval<A>): Interval<A> => {
    if (isEmpty_(ordA)(i1) || isEmpty_(ordA)(i2)) {
      return empty
    }
    const exOrd = Ex.getOrd(ordA)
    const maxLB = Ord.max(exOrd)(
      lowerBound(i1),
      lowerBound(i2)
    )
    const minUB = Ord.min(exOrd)(
      upperBound(i1),
      upperBound(i2)
    )

    return interval(ordA)(maxLB, minUB)
  }

/**
 * Test whether or not a value is a member of a interval.
 *
 * **NOTE:** Membership is determined by _strict_ less-than or greater-than
 * comparisons, so the lower and/or upper bounds are not considered members of
 * an interval.
 */
export const elem =
  <A>(ordA: Ord.Ord<A>) =>
  (a: A) =>
  (i: Interval<A>): boolean =>
    Ord.geq(Ex.getOrd(ordA))(Ex.finite(a), lowerBound(i)) &&
    Ord.lt(Ex.getOrd(ordA))(Ex.finite(a), upperBound(i))

/**
 * @internal
 */
export const upTo = <A>(
  interval: Interval<A>
): Interval<A> =>
  pipe(
    lowerBound(interval),
    match.on("_tag")({
      NegInf: () => empty,
      Finite: ({ value }) => lessThan(value),
      PosInf: () => infinite,
    })
  )

/**
 * @internal
 */
export const downTo = <A>(
  interval: Interval<A>
): Interval<A> =>
  pipe(
    upperBound(interval),
    match.on("_tag")({
      NegInf: () => infinite,
      Finite: ({ value }) => greaterThan(value),
      PosInf: () => empty,
    })
  )
