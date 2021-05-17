import {
  B,
  RM,
  Ord,
  O,
  pipe,
  Sg,
  RA,
  tuple,
  N,
  RNEA,
  Eq,
} from "../fp-ts-imports"
import * as I from "./Interval"
import * as Ex from "./Extended"
import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/lib/HKT"
import { Foldable, Foldable1, Foldable2, Foldable2C } from "fp-ts/lib/Foldable"

export type IntervalSet<A> = ReadonlyMap<Ex.Extended<A>, I.Interval<A>>

export const singleton = <A>(interval: I.Interval<A>): IntervalSet<A> =>
  I.isEmpty(interval)
    ? RM.empty
    : RM.singleton(I.lowerBound(interval), interval)

export const infinite = singleton(I.infinite)

export const empty = RM.empty

export const difference =
  <A>(ordA: Ord.Ord<A>) =>
  (s1: IntervalSet<A>, s2: IntervalSet<A>): IntervalSet<A> =>
    pipe(
      RM.toReadonlyArray(Ex.getOrd(ordA))(s2),
      RA.reduce(s1, (s, [_, i]) => deleteAt(ordA)(i)(s))
    )

export const deleteAt =
  <A>(ordA: Ord.Ord<A>) =>
  (i: I.Interval<A>) =>
  (s: IntervalSet<A>): IntervalSet<A> => {
    if (I.isEmpty(i)) {
      return s
    }

    const exOrd = Ex.getOrd(ordA)

    I.lowerBound(i) //?
    I.upperBound(i) //?

    const [smaller, m1, xs] = RM.splitLookupLE(exOrd)(I.lowerBound(i))(s)
    const [_, m2, larger] = RM.splitLookupLE(exOrd)(I.upperBound(i))(xs)
    const intersection = I.intersection(ordA)

    return unions(
      ordA,
      RA.Foldable
    )([
      smaller,
      pipe(
        m1,
        O.fold(
          () => RM.empty,
          j =>
            pipe(
              [I.upTo(i), I.downTo(i)],
              RA.chain(i_ => {
                const k = intersection(i_, j)
                return I.isEmpty(k) ? [] : [tuple(I.lowerBound(k), k)]
              }),
              RM.fromFoldable(exOrd, Sg.first<I.Interval<A>>(), RA.Foldable)
            )
        )
      ),
      pipe(
        m2,
        O.chain(j => {
          const j_ = intersection(I.downTo(i), j)
          return I.isEmpty(j_) ? O.none : O.some(tuple(I.lowerBound(j_), j_))
        }),
        O.fold(
          () => RM.empty,
          ([k, a]) => RM.singleton(k, a)
        )
      ),
      larger,
    ])
  }

export const fromReadonlyArray = <A>(ordA: Ord.Ord<A>) => {
  const g = (
    x: I.Interval<A>,
    zs: ReadonlyArray<I.Interval<A>>
  ): ReadonlyArray<I.Interval<A>> => {
    const zs_ = RNEA.fromReadonlyArray(zs)
    if (O.isNone(zs_)) {
      return !I.isEmpty(x) ? [x] : []
    }
    const [y, ys] = RNEA.unprepend(zs_.value)

    return I.isEmpty(x)
      ? g(y, ys)
      : I.isConnected(ordA)(x, y)
      ? g(I.hull(ordA)(x, y), ys)
      : [x, ...g(y, ys)]
  }

  return (intervals: ReadonlyArray<I.Interval<A>>): IntervalSet<A> =>
    pipe(
      intervals,
      RA.sort(
        pipe(
          Ex.getOrd(ordA),
          Ord.contramap((i: I.Interval<A>) => I.lowerBound(i))
        )
      ),
      RA.reduceRight([], g),
      RA.map(i => tuple(I.lowerBound(i), i)),
      RM.fromFoldable(Ex.getOrd(ordA), Sg.first<I.Interval<A>>(), RA.Foldable)
    )
}

// insert :: Ord r => Interval r -> IntervalSet r -> IntervalSet r
// insert i is | Interval.null i = is
// insert i (IntervalSet is) = IntervalSet $
//   case splitLookupLE (Interval.lowerBound i) is of
//     (smaller, m1, xs) ->
//       case splitLookupLE (Interval.upperBound i) xs of
//         (_, m2, larger) ->
//           Map.unions
//           [ smaller
//           , case fromList $ i : maybeToList m1 ++ maybeToList m2 of
//               IntervalSet m -> m
//           , larger
//           ]
export const insert =
  <A>(ordA: Ord.Ord<A>) =>
  (i: I.Interval<A>) =>
  (s: IntervalSet<A>): IntervalSet<A> => {
    if (I.isEmpty(i)) {
      return s
    }
    const ordEx = Ex.getOrd(ordA)
    const [smaller, m1, xs] = RM.splitLookupLE(ordEx)(I.lowerBound(i))(s)
    const [_, m2, larger] = RM.splitLookupLE(ordEx)(I.upperBound(i))(xs)
    return RM.unions(
      ordEx,
      RA.Foldable
    )([
      smaller,
      fromReadonlyArray(ordA)([
        i,
        ...O.toReadonlyArray(m1),
        ...O.toReadonlyArray(m2),
      ]),
      larger,
    ])
  }

export const union =
  <A>(ordA: Ord.Ord<A>) =>
  (s1: IntervalSet<A>, s2: IntervalSet<A>) =>
    RM.size(s1) >= RM.size(s2)
      ? pipe(
          s2,
          RM.toReadonlyArray(Ex.getOrd(ordA)),
          RA.reduce(s1, (s, [_, i]) => insert(ordA)(i)(s))
        )
      : pipe(
          s1,
          RM.toReadonlyArray(Ex.getOrd(ordA)),
          RA.reduce(s2, (s, [_, i]) => insert(ordA)(i)(s))
        )

export function unions<F extends URIS2, A>(
  ordA: Ord.Ord<A>,
  F: Foldable2<F>
): <E>(fa: Kind2<F, E, IntervalSet<A>>) => IntervalSet<A>
export function unions<F extends URIS2, E, A>(
  ordA: Ord.Ord<A>,
  F: Foldable2C<F, E>
): (fa: Kind2<F, E, IntervalSet<A>>) => IntervalSet<A>
export function unions<F extends URIS, A>(
  ordA: Ord.Ord<A>,
  F: Foldable1<F>
): (fa: Kind<F, IntervalSet<A>>) => IntervalSet<A>
export function unions<F, A>(
  ordA: Ord.Ord<A>,
  F: Foldable<F>
): (fa: HKT<F, IntervalSet<A>>) => IntervalSet<A> {
  return (fa: HKT<F, IntervalSet<A>>) =>
    F.reduce<IntervalSet<A>, IntervalSet<A>>(fa, RM.empty, union(ordA))
}
