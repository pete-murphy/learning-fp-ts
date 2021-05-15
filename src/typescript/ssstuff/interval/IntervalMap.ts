import { match } from "../matchers"
import { Ord, RA, RM, O, pipe, tuple, N } from "../fp-ts-imports"
import * as Ex from "./Extended"
import * as I from "./Interval"

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

export const alter =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(f: (x: O.Option<A>) => O.Option<A>) =>
  (interval: I.Interval<K>) =>
  (original: IntervalMap<K, A>): IntervalMap<K, A> =>
    I.isEmpty(interval) ? original : original

export const splitLookupLE =
  <K>(ordK: Ord.Ord<K>) =>
  (k: K) =>
  <A>(
    m: ReadonlyMap<K, A>
  ): readonly [ReadonlyMap<K, A>, O.Option<A>, ReadonlyMap<K, A>] => {
    const [smaller, x, larger] = RM.splitLookup(ordK)(k)(m)
    return O.isSome(x)
      ? [smaller, x, larger]
      : pipe(
          RM.maxView(ordK)(smaller),
          O.fold(
            () => [smaller, O.none, larger],
            ([a, smaller_]) => [smaller_, O.some(a), larger]
          )
        )
  }

export const upTo = <A>(interval: I.Interval<A>): I.Interval<A> =>
  pipe(
    I.lowerBound(interval),
    matchOnTag({
      NegInf: () => I.empty,
      Finite: ({ value }) => I.lessThan(value),
      PosInf: () => I.infinite,
    })
  )

export const downTo = <A>(interval: I.Interval<A>): I.Interval<A> =>
  pipe(
    I.upperBound(interval),
    matchOnTag({
      NegInf: () => I.infinite,
      Finite: ({ value }) => I.greaterThan(value),
      PosInf: () => I.empty,
    })
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
    const [smaller, m1, xs] = splitLookupLE(ordExK)(I.lowerBound(i))(m)
    const [middle, m2, larger] = splitLookupLE(ordExK)(I.upperBound(i))(xs)

    const x: IntervalMap<K, A> = pipe(
      m1,
      O.fold(
        () => RM.empty,
        ([j, b]) => {
          const k = I.intersection(ordK)(upTo(i), j)
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
      RA.filter(([j, _b]) => !I.isEmpty(I.intersection(ordK)(i, j))),
      RA.map(([j, b]) => {
        const k = I.intersection(ordK)(i, j)
        return RM.singleton(I.lowerBound(k), tuple(k, b))
      }),
      RA.prepend(middle),
      RM.readonlyArrayUnions(ordExK)
    )

    const z: IntervalMap<K, A> = pipe(
      ms,
      RA.filter(([j, _b]) => !I.isEmpty(I.intersection(ordK)(downTo(i), j))),
      RA.map(([j, b]) => {
        const k = I.intersection(ordK)(downTo(i), j)
        return RM.singleton(I.lowerBound(k), tuple(k, b))
      }),
      RA.prepend(larger),
      RM.readonlyArrayUnions(ordExK)
    )

    return tuple(x, y, z)
  }
