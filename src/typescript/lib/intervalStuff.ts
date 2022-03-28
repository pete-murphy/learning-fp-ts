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
import * as Sg from "fp-ts/Semigroup"
import * as Rg from "fp-ts/Ring"
import * as Srg from "fp-ts/Semiring"
import * as At from "monocle-ts/At"
import * as T from "monocle-ts/Traversal"
// import * as At from "monocle-ts/At"
import { flow, pipe, tuple } from "fp-ts/lib/function"
import { Apply1, getApplySemigroup } from "fp-ts/lib/Apply"
import { Separated } from "fp-ts/lib/Separated"
import * as Nt from "newtype-ts"
import { BoundedLattice } from "fp-ts/lib/BoundedLattice"
import { Functor1 } from "fp-ts/lib/Functor"

/**
 * @category instances
 */
export const URI = "UNUSED_Interval"

/**
 * @category instances
 */
export type URI = typeof URI

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: UNUSED_Interval<A>
  }
}

export interface UNUSED_Interval<A>
  extends Nt.Newtype<
    { readonly UNUSED_Interval: unique symbol },
    readonly [A, A]
  > {}

// export const Functor:

export const toUNUSED_Interval = <A>(ordA: Ord.Ord<A>) => (
  as: readonly [A, A]
): O.Option<UNUSED_Interval<A>> =>
  Nt.prism<UNUSED_Interval<A>>(([x1, x2]) => Ord.leq(ordA)(x1, x2)).getOption(
    as
  )

// const unsafeToUNUSED_Interval = <A>(
//   a1: A,
//   a2: A
// ): UNUSED_Interval<A> =>
//   Nt.iso<UNUSED_Interval<A>>().wrap([a1, a2])
const unsafeToUNUSED_Interval = <A>(as: readonly [A, A]): UNUSED_Interval<A> =>
  Nt.iso<UNUSED_Interval<A>>().wrap(as)

export const fromUNUSED_Interval = <A>(
  UNUSED_Interval: UNUSED_Interval<A>
): readonly [A, A] => Nt.iso<UNUSED_Interval<A>>().unwrap(UNUSED_Interval)

export const map: <A, B>(
  f: (a: A) => B
) => (fa: UNUSED_Interval<A>) => UNUSED_Interval<B> = f => fa =>
  pipe(
    fa,
    fromUNUSED_Interval,
    ([a1, a2]) => tuple(f(a1), f(a2)),
    unsafeToUNUSED_Interval
  )

const _map: Functor1<URI>["map"] = (fa, f) => pipe(fa, map(f))

export const Functor: Functor1<URI> = {
  URI,
  map: _map,
}

export const lesser = <A>(UNUSED_Interval: UNUSED_Interval<A>): A =>
  fromUNUSED_Interval(UNUSED_Interval)[0]

export const greater = <A>(UNUSED_Interval: UNUSED_Interval<A>): A =>
  fromUNUSED_Interval(UNUSED_Interval)[1]

export const getLattice = <A>(ordA: Ord.Ord<A>): Lt.Lattice<URI> => ({
  join: (x, y) => {
    lesser
  },
})

// const lesser = <A>(ordA: Ord.Ord<A>) => (UNUSED_Interval: UNUSED_Interval<A>): A =>
//   pipe(Nt.iso<UNUSED_Interval<A>>().unwrap(UNUSED_Interval), ([a1, a2]) =>
//     Ord.min(ordA)(a1, a2)
//   )

// const greater = <A>(ordA: Ord.Ord<A>) => (UNUSED_Interval: UNUSED_Interval<A>): A =>
//   pipe(Nt.iso<UNUSED_Interval<A>>().unwrap(UNUSED_Interval), ([a1, a2]) =>
//     Ord.max(ordA)(a1, a2)
//   )

// Not a valid ring
const getRing_UNLAWFUL = <A>(
  ordA: Ord.Ord<A>,
  ringA: Rg.Ring<A>
): Rg.Ring<UNUSED_Interval<A>> => {
  const { wrap, unwrap } = Nt.iso<UNUSED_Interval<A>>()
  const { add, mul, sub, one, zero } = ringA
  return {
    add: (x, y) => {
      const [x1, x2] = unwrap(x)
      const [y1, y2] = unwrap(y)
      return wrap([add(x1, y1), add(x2, y2)])
    },
    sub: (x, y) => {
      const [x1, x2] = unwrap(x)
      const [y1, y2] = unwrap(y)
      return wrap([sub(x1, y2), sub(x2, y1)])
    },
    mul: (x, y) => {
      const [x1, x2] = unwrap(x)
      const [y1, y2] = unwrap(y)
      const min = Ord.min(ordA)
      const max = Ord.max(ordA)
      const a1 = min(
        mul(x1, y1),
        min(mul(x1, y2), min(mul(x2, y1), mul(x2, y2)))
      )
      const a2 = max(
        mul(x1, y1),
        max(mul(x1, y2), max(mul(x2, y1), mul(x2, y2)))
      )
      return wrap([a1, a2])
    },
    one: wrap([one, one]),
    zero: wrap([zero, zero]),
  }
}

// export const getBoundedLattice = <A>(): BoundedLattice<UNUSED_Interval<A>> => ({
//   zero: wrap
//   join,
//   one
// })

export const getOrd = <A>(ordA: Ord.Ord<A>): Ord.Ord<UNUSED_Interval<A>> =>
  pipe(Ord.tuple(ordA, ordA), Ord.contramap(fromUNUSED_Interval))

// Should be in Ring module?
// export const abs = <A>(ordA: Ord.Ord<A>, ringA: Rg.Ring<A>) => (a: A): A =>
//   Ord.geq(ordA)(a, ringA.zero) ? a : Rg.negate(ringA)(a)

const absUNUSED_Interval = <A>(ordA: Ord.Ord<A>, ringA: Rg.Ring<A>) => (
  UNUSED_Interval: UNUSED_Interval<A>
): UNUSED_Interval<A> => {
  const [a1, a2] = fromUNUSED_Interval(UNUSED_Interval)
  const ring = getRing_UNLAWFUL(ordA, ringA)
  return Ord.geq(ordA)(a1, ringA.zero)
    ? UNUSED_Interval
    : Ord.leq(ordA)(a2, ringA.zero)
    ? Rg.negate(ring)(UNUSED_Interval)
    : unsafeToUNUSED_Interval([
        ringA.zero,
        Ord.max(ordA)(Rg.negate(ringA)(a1), a2),
      ])
}

export const mignitude = <A>(ordA: Ord.Ord<A>, ringA: Rg.Ring<A>) => (
  UNUSED_Interval: UNUSED_Interval<A>
): A => pipe(UNUSED_Interval, absUNUSED_Interval(ordA, ringA), lesser)

const mignitude_ = mignitude(N.Ord, N.Field)
mignitude_(unsafeToUNUSED_Interval([1, 20])) //?
mignitude_(unsafeToUNUSED_Interval([-20, 10])) //?
mignitude_(unsafeToUNUSED_Interval([5, 5])) //?

// lesser(toUNUSED_Interval(N.Ord)(-20, 10)) //?

/**
 * Hausdorff distance between UNUSED_Intervals
 */
export const distance = <A>(ordA: Ord.Ord<A>, ringA: Rg.Ring<A>) => (
  UNUSED_Interval1: UNUSED_Interval<A>,
  UNUSED_Interval2: UNUSED_Interval<A>
): A =>
  mignitude(
    ordA,
    ringA
  )(getRing_UNLAWFUL(ordA, ringA).sub(UNUSED_Interval1, UNUSED_Interval2))

const x = unsafeToUNUSED_Interval([-10, 20])
const y = unsafeToUNUSED_Interval([20, 80])
distance(N.Ord, N.Field)(x, y) //?

const R_ = getRing_UNLAWFUL(N.Ord, N.Field)
R_.add(R_.one, R_.zero) //?
R_.add(R_.zero, R_.one) //?
R_.add(R_.zero, R_.zero) //?

R_.mul(R_.zero, R_.zero) //?
R_.mul(R_.one, R_.one) //?

R_.sub(x, x) //?
