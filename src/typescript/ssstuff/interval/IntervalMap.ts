import { match } from "../matchers"
import { Ord, RA, RM, O, pipe, tuple, N } from "../fp-ts-imports"
import * as Ex from "./Extended"
import * as I from "./Interval"
import * as IS from "./IntervalSet"
import { not } from "fp-ts/lib/function"

const matchOnTag = match.on("_tag")

export type IntervalMap<R, A> = ReadonlyMap<
  Ex.Extended<R>,
  readonly [I.Interval<R>, A]
>

export const infinite = <A>(a: A) =>
  RM.singleton(I.lowerBound(I.infinite), tuple(I.infinite, a))

export const singleton = <K, A>(i: I.Interval<K>, a: A): IntervalMap<K, A> =>
  I.isEmpty(i) ? RM.empty : RM.singleton(I.lowerBound(i), [i, a])

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

export const insertWith =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(f: (x: A, y: A) => A) =>
  (interval: I.Interval<K>, a: A) =>
  (original: IntervalMap<K, A>): IntervalMap<K, A> =>
    I.isEmpty(interval) ? original : original

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

export const insert =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(i: I.Interval<K>, a: A) =>
  (m: IntervalMap<K, A>): IntervalMap<K, A> => {
    if (I.isEmpty(i)) {
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
        insert(ordK)(i, a)(m)
      )
    )

export const split =
  <K>(ordK: Ord.Ord<K>) =>
  (i: I.Interval<K>) =>
  <A>(
    m: IntervalMap<K, A>
  ): readonly [IntervalMap<K, A>, IntervalMap<K, A>, IntervalMap<K, A>] => {
    const ordExK = Ex.getOrd(ordK)
    const [smaller, m1, xs] = RM.splitLookupLE(ordExK)(I.lowerBound(i))(m)
    const [middle, m2, larger] = RM.splitLookupLE(ordExK)(I.upperBound(i))(xs)

    const x: IntervalMap<K, A> = pipe(
      m1,
      O.fold(
        () => RM.empty,
        ([j, b]) => {
          const k = I.intersection(ordK)(I.upTo(i), j)
          return I.isEmpty(k)
            ? smaller
            : RM.upsertAt(Ex.getOrd(ordK))<readonly [I.Interval<K>, A]>(
                I.lowerBound(k),
                tuple(k, b)
              )(smaller)
        }
      )
    )

    const ms: ReadonlyArray<readonly [I.Interval<K>, A]> = [
      ...O.toReadonlyArray(m1),
      ...O.toReadonlyArray(m2),
    ]

    const y: IntervalMap<K, A> = pipe(
      ms,
      RA.chain(([j, b]) => {
        const k = I.intersection(ordK)(i, j)
        return I.isEmpty(k) ? [] : [RM.singleton(I.lowerBound(k), tuple(k, b))]
      }),
      RA.prepend(middle),
      RM.readonlyArrayUnions(ordExK)
    )

    const z: IntervalMap<K, A> = pipe(
      ms,
      RA.chain(([j, b]) => {
        const k = I.intersection(ordK)(I.downTo(i), j)
        return I.isEmpty(k) ? [] : [RM.singleton(I.lowerBound(k), tuple(k, b))]
      }),
      RA.prepend(larger),
      RM.readonlyArrayUnions(ordExK)
    )

    return tuple(x, y, z)
  }

export const lookup =
  <K>(ordK: Ord.Ord<K>) =>
  (k: K) =>
  <A>(m: IntervalMap<K, A>): O.Option<A> =>
    pipe(
      RM.lookupLE(Ex.getOrd(ordK))(Ex.finite(k))(m),
      O.filterMap(([i, x]) => (I.member(ordK)(k)(i) ? O.some(x) : O.none))
    )

export const alter =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(f: (x: O.Option<A>) => O.Option<A>) =>
  (interval: I.Interval<K>) =>
  (original: IntervalMap<K, A>): IntervalMap<K, A> => {
    if (I.isEmpty(interval)) {
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

    const js = IS.difference(ordK)(IS.singleton(interval), keysSet(ordK)(m2))

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

    return RM.readonlyArrayUnions(Ex.getOrd(ordK))([m1, m2_, m2__, m3])
    // return RM.readonlyArrayUnions(Ex.getOrd(ordK))([m1, m2_, m2__])
  }

const xs: IntervalMap<number, string> = new Map([
  [Ex.finite(2), [I.between(2, 10), "a"]],
])

const zz = alter(N.Ord)(() => O.some("foo"))(I.between(2, 10))(xs)
zz //?
