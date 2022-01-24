import { flow, identity, pipe } from "fp-ts/lib/function"
import {
  Functor,
  Functor1,
  Functor2,
  Functor3,
} from "fp-ts/lib/Functor"
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  URIS,
  URIS2,
  URIS3,
} from "fp-ts/lib/HKT"

import * as RA from "fp-ts/lib/ReadonlyArray"
import * as Str from "fp-ts/lib/string"

export const URI = "Cont"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    readonly [URI]: Cont<A>
  }
}

export type Cont<A> = <R>(run: (a: A) => R) => R

export const map =
  <A, B>(f: (a: A) => B) =>
  (fa: Cont<A>): Cont<B> =>
  run =>
    fa(flow(f, run))

const _map: Functor1<URI>["map"] = (fa, f) =>
  pipe(fa, map(f))

const foo: Cont<string> = run => run("foo")

console.log(foo(identity))

console.log(foo(Str.toUpperCase))
