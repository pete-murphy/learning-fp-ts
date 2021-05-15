export * from "fp-ts/ReadonlyMap"

import * as RM from "fp-ts/lib/ReadonlyMap"
import * as Ord from "fp-ts/lib/Ord"
import * as Fld from "fp-ts/lib/Foldable"
import * as O from "fp-ts/lib/Option"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as N from "fp-ts/lib/number"
import { pipe } from "fp-ts/lib/function"
import * as Eq from "fp-ts/lib/Eq"

export const maxViewWithKey =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(
    m: ReadonlyMap<K, A>
  ): O.Option<readonly [readonly [K, A], ReadonlyMap<K, A>]> => {
    const gt = Ord.gt(ordK)
    let max: null | [K, A] = null
    let m_: Map<K, A> = new Map()

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

export const minViewWithKey =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(
    m: ReadonlyMap<K, A>
  ): O.Option<readonly [readonly [K, A], ReadonlyMap<K, A>]> => {
    const lt = Ord.lt(ordK)
    let min: null | [K, A] = null
    let m_: Map<K, A> = new Map()

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

export const maxView =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(m: ReadonlyMap<K, A>): O.Option<readonly [A, ReadonlyMap<K, A>]> =>
    pipe(
      m,
      maxViewWithKey(ordK),
      O.map(([[_, x], m]) => [x, m])
    )

export const minView =
  <K>(ordK: Ord.Ord<K>) =>
  <A>(m: ReadonlyMap<K, A>): O.Option<readonly [A, ReadonlyMap<K, A>]> =>
    pipe(
      m,
      minViewWithKey(ordK),
      O.map(([[_, x], m]) => [x, m])
    )

export const splitLookup =
  <K>(ordK: Ord.Ord<K>) =>
  (k: K) =>
  <A>(
    m: ReadonlyMap<K, A>
  ): readonly [ReadonlyMap<K, A>, O.Option<A>, ReadonlyMap<K, A>] => {
    const lt = Ord.lt(ordK)
    const gt = Ord.gt(ordK)

    let m1: Map<K, A> = new Map()
    let o: O.Option<A> = O.none
    let m2: Map<K, A> = new Map()

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

export const alter =
  <K>(eqK: Eq.Eq<K>) =>
  <A>(f: (x: O.Option<A>) => O.Option<A>) =>
  (k: K) =>
  (m: ReadonlyMap<K, A>): ReadonlyMap<K, A> => {
    const m_: Map<K, A> = new Map()
    let foundA: O.Option<A> = O.none

    m.forEach((a, k_) => {
      if (eqK.equals(k, k_)) {
        foundA = O.some(a)
      } else {
        m_.set(k_, a)
      }
    })

    pipe(
      f(foundA),
      O.fold(
        () => {},
        a_ => {
          m_.set(k, a_)
        }
      )
    )

    return m_
  }

// @TODO - Pete Murphy 2021-05-14 - Fixing the Foldable instance to Array, this
// could be generalized though
export const readonlyArrayUnions =
  <K>(eqK: Eq.Eq<K>) =>
  <A>(ms: ReadonlyArray<ReadonlyMap<K, A>>): ReadonlyMap<K, A> => {
    const m_: Map<K, A> = new Map()

    ms.forEach(m => {
      m.forEach((a, k) => {
        if (!Array.from(m_.keys()).some(k_ => eqK.equals(k, k_))) {
          m_.set(k, a)
        }
      })
    })

    return m_
  }

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