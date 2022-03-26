import { Kind, URIS } from "fp-ts/HKT"
import * as Id from "fp-ts/Identity"
import { identity } from "fp-ts/function"

export type TypeEquals<A, B> = {
  <F extends URIS>(fa: Kind<F, A>): Kind<F, B>
}

export const coerce =
  <A, B>(proof: TypeEquals<A, B>) =>
  (a: A): B =>
    proof<Id.URI>(a)

export const id = <A>(): TypeEquals<A, A> => identity
