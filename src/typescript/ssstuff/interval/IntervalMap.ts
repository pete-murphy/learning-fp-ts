import { Ord, RA, RM, O, pipe, tuple, N } from "../fp-ts-imports"
import * as Ex from "./Extended"
import * as I from "./Interval"
import * as IS from "./IntervalSet"
import { not } from "fp-ts/lib/function"

export type IntervalMap<R, A> = ReadonlyMap<
  Ex.Extended<R>,
  readonly [I.Interval<R>, A]
>

export const infinite = <A>(a: A) =>
  RM.singleton(I.lowerBound(I.infinite), tuple(I.infinite, a))

export const singleton =
  <K>(ordA: Ord.Ord<K>) =>
  <A>(i: I.Interval<K>, a: A): IntervalMap<K, A> =>
    I.isEmpty_(ordA)(i) ? RM.empty : RM.singleton(I.lowerBound(i), [i, a])

// -- | Insert with a function, combining new value and old value.
// -- @'insertWith' f key value mp@ will insert the pair (interval, value) into @mp@.
// -- If the interval overlaps with existing entries, the value for the entry is replace
// -- with @(f new_value old_value)@.
// insertWith :: Ord k => (a -> a -> a) -> Interval k -> a -> IntervalMap k a -> IntervalMap k a
// insertWith _ i _ m | Interval.null i = m
// insertWith f i a m = alter g i m
//   where
//     g Nothing = Just a
//     g (Just a') = Just $ f a a'

export const upsertAtWith =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(interval: I.Interval<K>, a: A, f: (x: A, y: A) => A) =>
  (original: IntervalMap<K, A>): IntervalMap<K, A> =>
    I.isEmpty_(ordK)(interval)
      ? original
      : pipe(
          original,
          alterAt(ordK)(
            interval,
            O.fold(
              () => O.some(a),
              a_ => O.some(f(a, a_))
            )
          )
        )

// -- | The expression (@'alter' f i map@) alters the value @x@ at @i@, or absence thereof.
// -- 'alter' can be used to insert, delete, or update a value in a 'IntervalMap'.
// alter :: Ord k => (Maybe a -> Maybe a) -> Interval k -> IntervalMap k a -> IntervalMap k a
// alter _ i m | Interval.null i = m
// alter f i m =
//   case split i m of
//     (IntervalMap m1, IntervalMap m2, IntervalMap m3) ->
//       let m2' = Map.mapMaybe (\(j,a) -> (\b -> (j,b)) <$> f (Just a)) m2
//           js = IntervalSet.singleton i `IntervalSet.difference` keysSet (IntervalMap m2)
//           IntervalMap m2'' =
//             case f Nothing of
//               Nothing -> empty
//               Just a -> fromList [(j,a) | j <- IntervalSet.toList js]
//       in IntervalMap $ Map.unions [m1, m2', m2'', m3]

export const keysSet =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(m: IntervalMap<K, A>): IS.IntervalSet<K> =>
    pipe(
      m,
      RM.collect(Ex.getOrd(ordK))((_k, [i, _a]) => i),
      IS.fromReadonlyArray(ordK)
    )

export const upsertAt =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(i: I.Interval<K>, a: A) =>
  (m: IntervalMap<K, A>): IntervalMap<K, A> => {
    if (I.isEmpty_(ordK)(i)) {
      return m
    }

    const [m1, _, m2] = split(ordK)(i)(m)
    const ordExK = Ex.getOrd(ordK)

    return RM.union(ordExK)(
      m1,
      pipe(
        m2,
        RM.upsertAt(ordExK)<readonly [I.Interval<K>, A]>(
          I.lowerBound(i),
          tuple(i, a)
        )
      )
    )
  }

export const fromReadonlyArray =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(ias: ReadonlyArray<readonly [I.Interval<K>, A]>): IntervalMap<K, A> =>
    pipe(
      ias,
      RA.reduce(RM.empty, (m: IntervalMap<K, A>, [i, a]) =>
        upsertAt(ordK)(i, a)(m)
      )
    )

export const split =
  <K>(ordK: Ord.Ord<K>) =>
  (i: I.Interval<K>) =>
  <A>(
    m: IntervalMap<K, A>
  ): readonly [IntervalMap<K, A>, IntervalMap<K, A>, IntervalMap<K, A>] => {
    const ordExK = Ex.getOrd(ordK)
    const isEmpty = I.isEmpty_(ordK)
    const unionsRA = RM.unions(ordExK, RA.Foldable)

    const [smaller, m1, xs] = RM.splitLookupLE(ordExK)(I.lowerBound(i))(m)
    const [middle, m2, larger] = RM.splitLookupLE(ordExK)(I.upperBound(i))(xs)
    const ms = RA.compact([m1, m2])

    const x: IntervalMap<K, A> = pipe(
      m1,
      O.fold(
        () => RM.empty,
        ([j, b]) => {
          const k = I.intersection(ordK)(I.upTo(i), j)
          return isEmpty(k)
            ? smaller
            : RM.upsertAt(Ex.getOrd(ordK))<readonly [I.Interval<K>, A]>(
                I.lowerBound(k),
                tuple(k, b)
              )(smaller)
        }
      )
    )

    const y: IntervalMap<K, A> = pipe(
      ms,
      RA.chain(([j, b]) => {
        const k = I.intersection(ordK)(i, j)
        return isEmpty(k) ? [] : [RM.singleton(I.lowerBound(k), tuple(k, b))]
      }),
      RA.prepend(middle),
      unionsRA
    )

    const z: IntervalMap<K, A> = pipe(
      ms,
      RA.chain(([j, b]) => {
        const k = I.intersection(ordK)(I.downTo(i), j)
        return isEmpty(k) ? [] : [RM.singleton(I.lowerBound(k), tuple(k, b))]
      }),
      RA.prepend(larger),
      unionsRA
    )

    return tuple(x, y, z)
  }

export const lookup =
  <K>(ordK: Ord.Ord<K>) =>
  (k: K) =>
  <A>(m: IntervalMap<K, A>): O.Option<A> =>
    pipe(
      RM.lookupLE(Ex.getOrd(ordK))(Ex.finite(k))(m),
      O.filterMap(([i, x]) => (I.elem(ordK)(k)(i) ? O.some(x) : O.none))
    )

export const alterAt =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(interval: I.Interval<K>, f: (x: O.Option<A>) => O.Option<A>) =>
  (original: IntervalMap<K, A>): IntervalMap<K, A> => {
    if (I.isEmpty_(ordK)(interval)) {
      return original
    }

    const [m1, m2, m3] = split(ordK)(interval)(original)

    const m2_: IntervalMap<K, A> = pipe(
      m2,
      RM.filterMap(([j, a]) =>
        pipe(
          f(O.some(a)),
          O.map(b => tuple(j, b))
        )
      )
    )

    const js = IS.difference(ordK)(
      IS.singleton(ordK)(interval),
      keysSet(ordK)(m2)
    )

    const m2__ = pipe(
      f(O.none),
      O.fold(
        () => RM.empty,
        a =>
          pipe(
            js,
            RM.collect(Ex.getOrd(ordK))((_, x) => x),
            RA.map(j => tuple(j, a)),
            fromReadonlyArray(ordK)
          )
      )
    )

    return RM.unions(Ex.getOrd(ordK), RA.Foldable)([m1, m2_, m2__, m3])
  }
