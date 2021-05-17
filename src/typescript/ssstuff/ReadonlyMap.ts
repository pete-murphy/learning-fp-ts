export * from "fp-ts/lib/ReadonlyMap"

import * as Eq from "fp-ts/lib/Eq"
import { Foldable, Foldable1, Foldable2, Foldable2C } from "fp-ts/lib/Foldable"
import { pipe } from "fp-ts/lib/function"
import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/lib/HKT"
import * as O from "fp-ts/lib/Option"
import * as Ord from "fp-ts/lib/Ord"
import * as RM from "fp-ts/lib/ReadonlyMap"

/**
 * Retrieves the maximal (key,value) pair of the map, and the map stripped of
 * that element, or `O.none` if passed an empty map.
 */
export const maxViewWithKey =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(
    m: ReadonlyMap<K, A>
  ): O.Option<readonly [readonly [K, A], ReadonlyMap<K, A>]> => {
    const gt = Ord.gt(ordK)
    let max: null | [K, A] = null
    const m_ = new Map<K, A>()

    m.forEach((a, k) => {
      if (max === null) {
        max = [k, a]
      } else if (gt(k, max[0])) {
        m_.set(max[0], max[1])
        max = [k, a]
      } else {
        m_.set(k, a)
      }
    })
    return max === null ? O.none : O.some([max, m_])
  }

/**
 * Retrieves the minimal (key,value) pair of the map, and the map stripped of
 * that element, or `O.none` if passed an empty map.
 */
export const minViewWithKey =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(
    m: ReadonlyMap<K, A>
  ): O.Option<readonly [readonly [K, A], ReadonlyMap<K, A>]> => {
    const lt = Ord.lt(ordK)
    let min: null | [K, A] = null
    const m_ = new Map<K, A>()

    m.forEach((a, k) => {
      if (min === null) {
        min = [k, a]
      } else if (lt(k, min[0])) {
        m_.set(min[0], min[1])
        min = [k, a]
      } else {
        m_.set(k, a)
      }
    })
    return min === null ? O.none : O.some([min, m_])
  }

/**
 * Retrieves the value associated with maximal key of the map, and the map
 * stripped of that element, or `O.none` if passed an empty map.
 */
export const maxView =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(m: ReadonlyMap<K, A>): O.Option<readonly [A, ReadonlyMap<K, A>]> =>
    pipe(
      m,
      maxViewWithKey(ordK),
      O.map(([[_, x], m]) => [x, m])
    )

/**
 * Retrieves the value associated with minimal key of the map, and the map
 * stripped of that element, or `O.none` if passed an empty map.
 */
export const minView =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(m: ReadonlyMap<K, A>): O.Option<readonly [A, ReadonlyMap<K, A>]> =>
    pipe(
      m,
      minViewWithKey(ordK),
      O.map(([[_, x], m]) => [x, m])
    )

/**
 * The expression (`splitLookup(ordK)(k)(map)`) splits a map just like `split`
 * but also returns `lookup(ordK)(k)(map)`.
 */
export const splitLookup =
  <K>(ordK: Ord.Ord<K>) =>
  (k: K) =>
  <A>(
    m: ReadonlyMap<K, A>
  ): readonly [ReadonlyMap<K, A>, O.Option<A>, ReadonlyMap<K, A>] => {
    const lt = Ord.lt(ordK)
    const gt = Ord.gt(ordK)

    const m1 = new Map<K, A>()
    let o: O.Option<A> = O.none
    const m2 = new Map<K, A>()

    m.forEach((a, k_) => {
      if (lt(k_, k)) {
        m1.set(k_, a)
      } else if (gt(k_, k)) {
        m2.set(k_, a)
      } else {
        o = O.some(a)
      }
    })

    return [m1, o, m2]
  }

/**
 * The expression (`alterAt(eqK)(k, f)(map)`) alters the value `x` at `k`, or absence thereof. `alterAt` can be used to insert, delete, or update a value in a `ReadonlyMap`.
 *
 * @example
 * const lookupAfterAlter = pipe(anyMap, alterAt(eqK)(k, f), lookup(eqK)(k))
 * const alterAfterLookup = pipe(anyMap, lookup(eqK)(k), f)
 * expect(lookupAfterAlter).toEqual(alterAfterLookup)
 */
export const alterAt =
  <K>(eqK: Eq.Eq<K>) =>
  <A>(k: K, f: (a: O.Option<A>) => O.Option<A>) =>
  (m: ReadonlyMap<K, A>): ReadonlyMap<K, A> =>
    pipe(
      m,
      RM.lookup(eqK)(k),
      f,
      O.fold(
        () => RM.deleteAt(eqK)(k)(m),
        a => RM.upsertAt(eqK)(k, a)(m)
      )
    )

/**
 * The union of a `Foldable` of maps.
 *
 * **NOTE:** `unions` is left-biased—i.e., duplicate keys in subsequent maps
 * when traversing the `Foldable` from left-to-right will be ignored.
 */
export function unions<F extends URIS2, K>(
  eqK: Eq.Eq<K>,
  F: Foldable2<F>
): <E, A>(fa: Kind2<F, E, ReadonlyMap<K, A>>) => ReadonlyMap<K, A>
export function unions<F extends URIS2, E, K>(
  eqK: Eq.Eq<K>,
  F: Foldable2C<F, E>
): <A>(fa: Kind2<F, E, ReadonlyMap<K, A>>) => ReadonlyMap<K, A>
export function unions<F extends URIS, K>(
  eqK: Eq.Eq<K>,
  F: Foldable1<F>
): <A>(fa: Kind<F, ReadonlyMap<K, A>>) => ReadonlyMap<K, A>
export function unions<F, K>(
  eqK: Eq.Eq<K>,
  F: Foldable<F>
): <A>(fa: HKT<F, ReadonlyMap<K, A>>) => ReadonlyMap<K, A> {
  return <A>(fa: HKT<F, ReadonlyMap<K, A>>) =>
    F.reduce<ReadonlyMap<K, A>, ReadonlyMap<K, A>>(fa, RM.empty, union(eqK))
}

/**
 * The expression (`union(eqK)(m1, m2)`) takes the left-biased union of `m1` and
 * `m2`. It prefers `m1` when duplicate keys are encountered.
 *
 * @example
 * expect(
 *   union(N.Eq)(
 *     new Map([
 *       [5, 'a'],
 *       [3, 'b'],
 *     ]),
 *     new Map([
 *       [5, 'A'],
 *       [7, 'C'],
 *     ]),
 *   ),
 * ).toEqual(
 *   new Map([
 *     [3, 'b'],
 *     [5, 'a'],
 *     [7, 'C'],
 *   ]),
 * )
 */
export const union =
  <K>(eqK: Eq.Eq<K>) =>
  <A>(m1: ReadonlyMap<K, A>, m2: ReadonlyMap<K, A>): ReadonlyMap<K, A> => {
    const m_: Map<K, A> = new Map(m1)
    const keys = Array.from(m1.keys())

    m2.forEach((a, k) => {
      if (!keys.some(k_ => eqK.equals(k, k_))) {
        m_.set(k, a)
      }
    })

    return m_
  }

/**
 * Find largest key smaller or equal to the given one and return the
 * corresponding (key, value) pair.
 */
export const lookupLE =
  <K>(ordK: Ord.Ord<K>) =>
  (k: K) =>
  <A>(m: ReadonlyMap<K, A>): O.Option<A> => {
    const lookupResult = RM.lookup(ordK)(k)(m)
    if (O.isSome(lookupResult)) {
      return lookupResult
    }

    let foundA: null | [K, A] = null

    const leq = Ord.leq(ordK)
    const between = Ord.between(ordK)

    m.forEach((a, k_) => {
      if (
        (foundA === null && leq(k_, k)) ||
        (foundA !== null && between(foundA[0], k)(k_))
      ) {
        foundA = [k_, a]
      }
    })

    return foundA === null ? O.none : O.some(foundA[1])
  }

/**
 * @internal
 *
 * Pete Murphy 2021-05-16 - Marking this as "internal", it seems to just be
 * useful for `IntervalMap`/`IntervalSet` operations.
 */
export const splitLookupLE =
  <K>(ordK: Ord.Ord<K>) =>
  (k: K) =>
  <A>(
    m: ReadonlyMap<K, A>
  ): readonly [ReadonlyMap<K, A>, O.Option<A>, ReadonlyMap<K, A>] => {
    const [smaller, x, larger] = splitLookup(ordK)(k)(m)
    return O.isSome(x)
      ? [smaller, x, larger]
      : pipe(
          maxView(ordK)(smaller),
          O.fold(
            () => [smaller, O.none, larger],
            ([v, smaller_]) => [smaller_, O.some(v), larger]
          )
        )
  }
