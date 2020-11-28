import { Alt2C } from "fp-ts/lib/Alt"
import {
  Applicative1,
  Applicative2C,
  getApplicativeComposition,
} from "fp-ts/lib/Applicative"
import { Bifunctor2 } from "fp-ts/lib/Bifunctor"
import { ChainRec2C } from "fp-ts/lib/ChainRec"
import * as Ei from "fp-ts/lib/Either"
import { Extend2 } from "fp-ts/lib/Extend"
import { Foldable2 } from "fp-ts/lib/Foldable"
import { Monad2C } from "fp-ts/lib/Monad"
import { MonadThrow2C } from "fp-ts/lib/MonadThrow"
import { readonlyArray } from "fp-ts/lib/ReadonlyArray"
import { Semiring } from "fp-ts/lib/Semiring"
import { Traversable2 } from "fp-ts/lib/Traversable"

export type FreeSemiring<A> = ReadonlyArray<ReadonlyArray<A>>

export const URI = "FreeSemiring"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    FreeSemiring: FreeSemiring<A>
  }
}

export const getSemiring = <A>(): Semiring<FreeSemiring<A>> => ({
  add: (xss: FreeSemiring<A>, yss: FreeSemiring<A>): FreeSemiring<A> =>
    xss.concat(yss),
  zero: [],
  mul: (xss: FreeSemiring<A>, yss: FreeSemiring<A>): FreeSemiring<A> =>
    xss.flatMap(xs => yss.map(ys => xs.concat(ys))),
  one: [[]],
})

export const { ap, map, of } = getApplicativeComposition(
  readonlyArray,
  readonlyArray
)

export const freeSemiring: Applicative1<URI> = {
  URI,
  ap,
  map,
  of,
}

export function getSemiringValidation<E = never>(
  SR: Semiring<E>
): Monad2C<Ei.URI, E> &
  Foldable2<Ei.URI> &
  Traversable2<Ei.URI> &
  Bifunctor2<Ei.URI> &
  Alt2C<Ei.URI, E> &
  Extend2<Ei.URI> &
  ChainRec2C<Ei.URI, E> &
  MonadThrow2C<Ei.URI, E> {
  const applicativeValidation = getApplicativeSemiringValidation(SR)
  const altValidation = getAltSemiringValidation(SR)
  return {
    _E: undefined as any,
    ...Ei.either,
    ap: applicativeValidation.ap,
    alt: altValidation.alt,
  }
}

export function getApplicativeSemiringValidation<E>(
  SR: Semiring<E>
): Applicative2C<Ei.URI, E> {
  return {
    URI: Ei.URI,
    _E: undefined as any,
    map: Ei.either.map,
    ap: (fab, fa) =>
      Ei.isLeft(fab)
        ? Ei.isLeft(fa)
          ? Ei.left(SR.mul(fab.left, fa.left))
          : fab
        : Ei.isLeft(fa)
        ? fa
        : Ei.right(fab.right(fa.right)),
    of: Ei.of,
  }
}

export function getAltSemiringValidation<E>(SE: Semiring<E>): Alt2C<Ei.URI, E> {
  return {
    URI: Ei.URI,
    _E: undefined as any,
    map: Ei.either.map,
    alt: (me, that) => {
      if (Ei.isRight(me)) {
        return me
      }
      const ea = that()
      return Ei.isLeft(ea) ? Ei.left(SE.add(me.left, ea.left)) : ea
    },
  }
}
