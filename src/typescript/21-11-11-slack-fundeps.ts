// class Pairing f g | f -> g, g -> f where
// pair :: (a -> b -> c) -> f a -> g b -> c

import { Comonad1 } from "fp-ts/lib/Comonad"
import { flow, identity } from "fp-ts/lib/function"
import { Kind, URIS } from "fp-ts/lib/HKT"
import * as O from "fp-ts/lib/Option"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Pred from "fp-ts/lib/Predicate"
import * as Str from "fp-ts/lib/string"

// move :: (Comonad w, Pairing m w) => w a -> m b -> w a
// move space movement = pair (\_ newSpace -> newSpace) movement (duplicate space)

export interface Pairing1<F extends URIS, G extends URIS> {
  // readonly URI: F;
  // readonly URI2: G;
  readonly pair: <A, B, C>(
    f: (a: A, b: B) => C,
    fa: Kind<F, A>,
    gb: Kind<G, B>
  ) => C
}

function move<W extends URIS, M extends URIS, A, B>(
  space: Kind<W, A>,
  movement: Kind<M, B>,
  comonad: Comonad1<W>,
  pairing: Pairing1<M, W>
): Kind<W, A> {
  return pairing.pair(
    (_a, newSpace) => newSpace,
    movement,
    comonad.extend(space, identity)
  )
}

// class Stream stream element where
//   uncons :: stream -> Maybe { head :: element, tail :: stream }

// instance streamArray :: Stream (Array a) a where
//   uncons = Array.uncons

// instance streamString :: Stream String Char where
//   uncons = String.uncons
// export interface Stream<S, E> {
//   readonly uncons: (
//     stream: S
//   ) => O.Option<{ readonly head: E; readonly tail: S }>
// }

// const getStreamArray = <A>(): Stream<ReadonlyArray<A>, A> => ({
//   uncons: flow(
//     RNEA.fromReadonlyArray,
//     O.map(s => ({ head: RNEA.head(s), tail: RNEA.tail(s) }))
//   ),
// })

// const streamString: Stream<string, string> = {
//   uncons: flow(
//     O.fromPredicate(Pred.not(Str.isEmpty)),
//     O.map(s => ({ head: s.slice(0, 1), tail: s.slice(1) }))
//   ),
// }
