import { Functor2 } from "fp-ts/lib/Functor"
import { Comonad2 } from "./Comonad"
import { pipeable } from "fp-ts/lib/pipeable"
import { flow } from "fp-ts/lib/function"

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly Störe: Störe<E, A>
  }
}

export const URI = "Störe"

export type URI = typeof URI

export type Störe<E, A> = {
  state: E
  render: (e: E) => A
}

export const store: Functor2<URI> & Comonad2<URI> = {
  URI,
  map: ({ state, render }, fn) => ({ state, render: flow(render, fn) }),
  extend: ({ state, render }, fn) => ({
    state,
    render: newState => fn({ state: newState, render }),
  }),
  extract: ({ state, render }) => render(state),
}

export const { extend } = pipeable(store)
