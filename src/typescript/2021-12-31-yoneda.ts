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

export const URI = "Yoneda"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: Yoneda<E, A>
  }
}

export type Yoneda<F, A> = <R>(
  run: (a: A) => R
) => HKT<F, R>

export const map =
  <A, B>(f: (a: A) => B) =>
  <F>(fa: Yoneda<F, A>): Yoneda<F, B> =>
  run =>
    fa(flow(f, run))

const _map: Functor2<URI>["map"] = (fa, f) =>
  pipe(fa, map(f))

// ----------------------

function makeYoneda<F extends URIS3>(
  F: Functor3<F>
): <R, E, A>(fa: Kind3<F, R, E, A>) => Yoneda<F, A>
function makeYoneda<F extends URIS2>(
  F: Functor2<F>
): <E, A>(fa: Kind2<F, E, A>) => Yoneda<F, A>
function makeYoneda<F extends URIS>(
  F: Functor1<F>
): <A>(fa: Kind<F, A>) => Yoneda<F, A>
function makeYoneda<F>(
  F: Functor<F>
): <A>(fa: HKT<F, A>) => Yoneda<F, A> {
  return fa => run => F.map(fa, run)
}

function fromYoneda<F, A>(ya: Yoneda<F, A>): HKT<F, A> {
  return ya(identity)
}

// ---------------------

const foo: Yoneda<RA.URI, string> = makeYoneda(RA.Functor)(
  "foo".split("")
)

console.log(foo(identity))

console.log(foo(Str.toUpperCase))
