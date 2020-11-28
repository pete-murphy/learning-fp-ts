import { Functor2 } from "fp-ts/lib/Functor"
import { Comonad2 } from "./Comonad"
import { pipeable } from "fp-ts/lib/pipeable"

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly Pair: Pair<E, A>
  }
}

export const URI = "Pair"

export type URI = typeof URI

export type Pair<E, A> = [E, A]

export const pair: Functor2<URI> & Comonad2<URI> = {
  URI,
  map: ([e, a], f) => [e, f(a)],
  extend: ([e, a], f) => [e, f([e, a])],
  extract: ([_e, a]) => a,
}

export const { extend } = pipeable(pair)
