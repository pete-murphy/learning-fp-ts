import { Applicative2 } from "fp-ts/lib/Applicative"
import { Apply2 } from "fp-ts/lib/Apply"
import { Foldable, Foldable1 } from "fp-ts/lib/Foldable"
import { flow, identity, pipe, Predicate, tuple } from "fp-ts/lib/function"
import { Functor1, Functor2 } from "fp-ts/lib/Functor"
import { HKT, Kind, URIS } from "fp-ts/lib/HKT"
import * as Ap from "fp-ts/lib/Apply"
import { Profunctor2 } from "fp-ts/lib/Profunctor"

export const URI = "Fold"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: Fold<E, A>
  }
}

type Fold_<X, E, A> = {
  readonly step: (x: X, e: E) => X
  readonly init: X
  readonly done: (x: X) => A
}

export type Fold<E, A> = <R>(run: <X>(_: Fold_<X, E, A>) => R) => R

export const map =
  <A, B>(f: (a: A) => B) =>
  <E>(fa: Fold<E, A>): Fold<E, B> =>
  run =>
    fa(a => run({ step: a.step, init: a.init, done: flow(a.done, f) }))

const _map: Functor2<URI>["map"] = (fa, f) => pipe(fa, map(f))

export const Functor: Functor2<URI> = {
  URI,
  map: _map,
}

const _ap =
  <E = never, A = never, B = never>(
    fab: Fold<E, (a: A) => B>,
    fa: Fold<E, A>
  ): Fold<E, B> =>
  run =>
    fab(({ step: stepL, init: initL, done: doneL }) =>
      fa(({ step: stepR, init: initR, done: doneR }) => {
        const step = ([xL, xR]: [typeof initL, typeof initR], a: E) =>
          tuple(stepL(xL, a), stepR(xR, a))
        const init = tuple(initL, initR)
        const done = ([xL, xR]: [typeof initL, typeof initR]) =>
          doneL(xL)(doneR(xR))
        return run({
          step,
          init,
          done,
        })
      })
    )

export const Apply: Apply2<URI> = {
  URI,
  map: _map,
  ap: _ap,
}

export const of =
  <E = never, A = never>(a: A): Fold<E, A> =>
  run =>
    run<undefined>({
      step: (_, _e) => undefined,
      init: undefined,
      done: _ => a,
    })

export const Applicative: Applicative2<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
}

export const premap =
  <A, B>(f: (a: A) => B) =>
  <R>(fld: Fold<B, R>): Fold<A, R> =>
  run =>
    fld(b =>
      run({
        step: (x, y) => b.step(x, f(y)),
        init: b.init,
        done: b.done,
      })
    )

export const prefilter =
  <A>(pred: Predicate<A>) =>
  <R>(fld: Fold<A, R>): Fold<A, R> =>
  run =>
    fld(a =>
      run({
        step: (x, y) => (pred(y) ? a.step(x, y) : x),
        init: a.init,
        done: a.done,
      })
    )

const _promap = <E, A, D, B>(
  fea: Fold<E, A>,
  f: (d: D) => E,
  g: (a: A) => B
): Fold<D, B> => pipe(_map(fea, g), premap(f))

export const Profunctor: Profunctor2<URI> = {
  URI,
  map: _map,
  promap: _promap,
}

export const take =
  (n: number) =>
  <E, A>(fea: Fold<E, A>): Fold<E, A> =>
  run =>
    fea(ea =>
      run({
        step: (acc: { length: number; x: typeof ea.init }, e: E) =>
          acc.length < n
            ? { length: acc.length + 1, x: ea.step(acc.x as any, e) }
            : acc,
        init: { length: 0, x: ea.init },
        done: ({ x }) => ea.done(x as typeof ea.init),
      })
    )

/***************************************************************/

export function fold<M, F extends URIS>(
  F: Foldable1<F>
): <E, A>(f: Fold<E, A>) => (fa: Kind<F, E>) => A
export function fold<M, F>(
  F: Foldable<F>
): <E, A>(f: Fold<E, A>) => (fa: HKT<F, E>) => A {
  return f => fa => f(x => x.done(F.reduce(fa, x.init, x.step)))
}

export const apS = Ap.apS(Apply)

export const Do: Fold<any, {}> = of({})

/***************************************************************/

export const sum: Fold<number, number> = run =>
  run({
    step: (x, y) => x + y,
    init: 0,
    done: identity,
  })

export const length: Fold<number, number> = run =>
  run({
    step: (n, _) => n + 1,
    init: 0,
    done: identity,
  })
