import { Functor1 } from "fp-ts/lib/Functor"
import { Comonad1 } from "./Comonad"

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    readonly Identity: Identity<A>
  }
}

export const URI = "Identity"

export type URI = typeof URI

export type Identity<A> = A

export const identity: Functor1<URI> & Comonad1<URI> = {
  URI,
  map: (fa, f) => f(fa),
  extend: (wa, f) => f(wa),
  extract: wa => wa,
}
