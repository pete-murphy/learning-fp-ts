import { Functor2 } from "fp-ts/lib/Functor"
import { Comonad2 } from "./Comonad"
import { pipeable } from "fp-ts/lib/pipeable"
import { flow } from "fp-ts/lib/function"

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly Store_: Store_<E, A>
  }
}

export const URI = "Store_"

export type URI = typeof URI

export type Store_<E, A> = [E, (e: E) => A]

export const store: Functor2<URI> & Comonad2<URI> = {
  URI,
  map: ([e, f], g) => [e, flow(f, g)],
  extend: ([e, f], g) => [e, ê => g([ê, f])],
  extract: ([e, f]) => f(e),
}

export const { extend } = pipeable(store)
