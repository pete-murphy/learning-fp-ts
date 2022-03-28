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
export const URI = "Interval_"

/**
 * @category instances
 */
export type URI = typeof URI

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: Interval_<A>
  }
}

export type Interval_<A> = readonly [A, A]
// extends Nt.Newtype<{ readonly Interval: unique symbol }, > {}

// export const Functor:

export const map: <A, B>(
  f: (a: A) => B
) => (fa: Interval_<A>) => Interval_<B> = f => fa =>
  pipe(fa, ([a1, a2]) => tuple(f(a1), f(a2)))

const _map: Functor1<URI>["map"] = (fa, f) => pipe(fa, map(f))

export const Functor: Functor1<URI> = {
  URI,
  map: _map,
}

export const lesser = <A>(ordA: Ord.Ord<A>) => ([a1, a2]: Interval_<A>): A =>
  Ord.min(ordA)(a1, a2)

export const greater = <A>(ordA: Ord.Ord<A>) => ([a1, a2]: Interval_<A>): A =>
  Ord.max(ordA)(a1, a2)

const ordered = <A>(ordA: Ord.Ord<A>) => ([
  a1,
  a2,
]: Interval_<A>): Interval_<A> => (Ord.leq(ordA)(a1, a2) ? [a1, a2] : [a2, a1])

export const getLattice = <A>(
  ordA: Ord.Ord<A>
): Lt.Lattice<O.Option<Interval_<A>>> => ({
  join: (x, y) => {
    const [x1, x2] = ordered(ordA)(x)
    const [y1, y2] = ordered(ordA)(y)
    return [Ord.min(ordA)(x1, y1), Ord.max(ordA)(x2, y2)]
  },
  meet: (x, y) => {
    const [x1, x2] = ordered(ordA)(x)
    const [y1, y2] = ordered(ordA)(y)
    return [Ord.max(ordA)(x1, y1), Ord.min(ordA)(x2, y2)]
  },
})

// const lesser = <A>(ordA: Ord.Ord<A>) => (interval: Interval<A>): A =>
//   pipe(Nt.iso<Interval<A>>().unwrap(interval), ([a1, a2]) =>
//     Ord.min(ordA)(a1, a2)
//   )

// const greater = <A>(ordA: Ord.Ord<A>) => (interval: Interval<A>): A =>
//   pipe(Nt.iso<Interval<A>>().unwrap(interval), ([a1, a2]) =>
//     Ord.max(ordA)(a1, a2)
//   )

// Not a valid ring
const getRing_UNLAWFUL = <A>(
  ordA: Ord.Ord<A>,
  ringA: Rg.Ring<A>
): Rg.Ring<Interval<A>> => {
  const { wrap, unwrap } = Nt.iso<Interval<A>>()
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

// export const getBoundedLattice = <A>(): BoundedLattice<Interval<A>> => ({
//   zero: wrap
//   join,
//   one
// })

export const getOrd = <A>(ordA: Ord.Ord<A>): Ord.Ord<Interval<A>> =>
  pipe(Ord.tuple(ordA, ordA), Ord.contramap(fromInterval))

// Should be in Ring module?
// export const abs = <A>(ordA: Ord.Ord<A>, ringA: Rg.Ring<A>) => (a: A): A =>
//   Ord.geq(ordA)(a, ringA.zero) ? a : Rg.negate(ringA)(a)

const absInterval = <A>(ordA: Ord.Ord<A>, ringA: Rg.Ring<A>) => (
  interval: Interval<A>
): Interval<A> => {
  const [a1, a2] = fromInterval(interval)
  const ring = getRing_UNLAWFUL(ordA, ringA)
  return Ord.geq(ordA)(a1, ringA.zero)
    ? interval
    : Ord.leq(ordA)(a2, ringA.zero)
    ? Rg.negate(ring)(interval)
    : unsafeToInterval([ringA.zero, Ord.max(ordA)(Rg.negate(ringA)(a1), a2)])
}

export const mignitude = <A>(ordA: Ord.Ord<A>, ringA: Rg.Ring<A>) => (
  interval: Interval<A>
): A => pipe(interval, absInterval(ordA, ringA), lesser)

const mignitude_ = mignitude(N.Ord, N.Field)
mignitude_(unsafeToInterval([1, 20])) //?
mignitude_(unsafeToInterval([-20, 10])) //?
mignitude_(unsafeToInterval([5, 5])) //?

// lesser(toInterval(N.Ord)(-20, 10)) //?

/**
 * Hausdorff distance between intervals
 */
export const distance = <A>(ordA: Ord.Ord<A>, ringA: Rg.Ring<A>) => (
  interval1: Interval<A>,
  interval2: Interval<A>
): A =>
  mignitude(
    ordA,
    ringA
  )(getRing_UNLAWFUL(ordA, ringA).sub(interval1, interval2))

const x = unsafeToInterval([-10, 20])
const y = unsafeToInterval([20, 80])
distance(N.Ord, N.Field)(x, y) //?

const R_ = getRing_UNLAWFUL(N.Ord, N.Field)
R_.add(R_.one, R_.zero) //?
R_.add(R_.zero, R_.one) //?
R_.add(R_.zero, R_.zero) //?

R_.mul(R_.zero, R_.zero) //?
R_.mul(R_.one, R_.one) //?

R_.sub(x, x) //?
