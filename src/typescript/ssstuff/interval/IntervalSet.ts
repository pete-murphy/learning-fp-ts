import { B, RM, Ord, O, pipe, Sg, RA, tuple, N, RNEA } from "../fp-ts-imports"
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

    I.lowerBound(i) //?
    I.upperBound(i) //?

    const [smaller, m1, xs] = RM.splitLookupLE(exOrd)(I.lowerBound(i))(s)
    const [_, m2, larger] = RM.splitLookupLE(exOrd)(I.upperBound(i))(xs)
    const intersection = I.intersection(ordA)

    return readonlyArrayUnions(ordA)([
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
    return RM.readonlyArrayUnions(ordEx)([
      smaller,
      fromReadonlyArray(ordA)([
        i,
        ...O.toReadonlyArray(m1),
        ...O.toReadonlyArray(m2),
      ]),
      larger,
    ])
  }

// union :: Ord r => IntervalSet r -> IntervalSet r -> IntervalSet r
// union is1@(IntervalSet m1) is2@(IntervalSet m2) =
//   if Map.size m1 >= Map.size m2
//   then foldl' (\is i -> insert i is) is1 (toList is2)
//   else foldl' (\is i -> insert i is) is2 (toList is1)
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

export const readonlyArrayUnions: <A>(
  ordA: Ord.Ord<A>
) => (intervalSets: ReadonlyArray<IntervalSet<A>>) => IntervalSet<A> = ordA =>
  RA.reduce(RM.empty, union(ordA))

const actual: IntervalSet<number> = insert(N.Ord)(I.between(1, 4))(
  fromReadonlyArray(N.Ord)([I.between(0, 3), I.between(1, 2)])
)
actual
// // const expected = fromReadonlyArray(N.Ord)([
// //   I.between(0, 1),
// //   // I.between(0, 3),
// //   I.between(1, 1),
// // ])

// /**
//  * delete (1 <=..< 4) (fromList [0 <=..< 3, 1 <=..< 2])
//  *
//  *
//  */

// // const actual: IntervalSet<number> = deleteAt(N.Ord)(I.between(2, 19))(
// //   fromReadonlyArray(N.Ord)([I.between(1, 5), I.between(0, 8)])
// // )
