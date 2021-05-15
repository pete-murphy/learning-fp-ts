import { RM, Ord, O, pipe, Sg, RA, tuple } from "../fp-ts-imports"
import * as I from "./Interval"
import * as Ex from "./Extended"

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

    const [smaller, m1, xs] = RM.splitLookupLE(exOrd)(I.lowerBound(i))(s)
    const [_, m2, larger] = RM.splitLookupLE(exOrd)(I.upperBound(i))(xs)

    return RM.readonlyArrayUnions(exOrd)([
      smaller,
      pipe(
        m1,
        O.fold(
          () => RM.empty,
          j =>
            pipe(
              [I.upTo(i), I.downTo(i)],
              RA.filterMap(i_ => {
                const k = I.intersection(ordA)(i_, j)
                return I.isEmpty(k) ? O.none : O.some(tuple(I.lowerBound(k), k))
              }),
              RM.fromFoldable(exOrd, Sg.first<I.Interval<A>>(), RA.Foldable)
            )
        )
      ),
      pipe(
        m2,
        O.filterMap(j => {
          const j_ = I.intersection(ordA)(I.downTo(i), j)
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

export const fromReadonlyArray =
  <A>(ordA: Ord.Ord<A>) =>
  (intervals: ReadonlyArray<I.Interval<A>>): IntervalSet<A> =>
    pipe(
      intervals,
      RA.map(i => tuple(I.lowerBound(i), i)),
      RM.fromFoldable(Ex.getOrd(ordA), Sg.first<I.Interval<A>>(), RA.Foldable)
    )
