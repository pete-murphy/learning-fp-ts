import { pipe } from "fp-ts/lib/function"
import { Kind, URIS } from "fp-ts/lib/HKT"

export interface Functor<F extends URIS> {
  readonly URI: F
  // the "Kind" notation here is important because HKT needs to resolve ?? reasons unknown ??
  readonly map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>
}

// Examples - Maybe functor
const URI = "Maybe"
type URI = typeof URI

// FP-TS secret sauce
declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: Maybe<A>
  }
}

// Type constructors
interface Nothing {
  readonly _tag: "Nothing"
}

interface Just<A> {
  readonly _tag: "Just"
  readonly a: A
}

type Maybe<A> = Nothing | Just<A>

// Data constructors
export const nothing: Maybe<never> = { _tag: "Nothing" }

export const just = <A>(a: A): Maybe<A> => ({ _tag: "Just", a })

// Convenience
const isNothing = <A>(ma: Maybe<A>): ma is Nothing =>
  ma._tag === "Nothing"

// @map for Maybe
const map: <A, B>(fa: Maybe<A>, f: (a: A) => B) => Maybe<B> = (
  fa,
  f
) => (isNothing(fa) ? fa : just(f(fa.a)))

export const maybe: Functor<URI> = {
  URI,
  map,
}

// const ex2 = pipe(
//   O.none,
//   O.map((n) => n + 1)
// ) //?
