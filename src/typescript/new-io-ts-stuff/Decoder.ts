import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"
import { MonadThrow2C } from "fp-ts/lib/MonadThrow"
import * as D from "io-ts/lib/Decoder"
import * as K from "io-ts/lib/Kleisli"
import * as DE from "io-ts/lib/DecodeError"
import { Monad2C } from "fp-ts/lib/Monad"
import { URIS2 } from "fp-ts/lib/HKT"
import {
  AppSchema,
  createSchema,
  interpreter,
} from "./schemable-ignore/AppSchemable"
import { DecoderSchemable } from "./schemable-ignore/exports"

/**
 * @internal
 */
const SE = DE.getSemigroup<string>()

/**
 * @internal
 */
const ap = <A, B>(
  fab: E.Either<D.DecodeError, (a: A) => B>,
  fa: E.Either<D.DecodeError, A>
): E.Either<D.DecodeError, B> =>
  E.isLeft(fab)
    ? E.isLeft(fa)
      ? E.left(SE.concat(fab.left, fa.left))
      : fab
    : E.isLeft(fa)
    ? fa
    : E.right(fab.right(fa.right))

/**
 * @internal
 */
const M: MonadThrow2C<E.URI, D.DecodeError> = {
  URI: E.URI,
  _E: undefined as any,
  ap,
  map: (fa, f) => pipe(fa, E.map(f)),
  of: E.right,
  chain: (ma, f) => pipe(ma, E.chain(f)),
  throwError: E.left,
}

/**
 * @internal
 *
 * @NOTE - Pete Murphy 2020-12-17 - This could live in a `Kleisli` module, but
 * it's only used in this Decoder module. This is following the precedent set by
 * `io-ts/Decoder/map` which imports `K.map` from `io-ts/Kleisli` and calls it,
 * passing `M` as the `Functor` instance. `map` is exported from `Decoder` as a
 * "combinator" instead of a type class instance for `Functor` (maybe this is a
 * work-in-progress, or maybe :gcanti: only had need for a standalone `map`?).
 * In short, this `chain_` *could* be refactored into a `getMonad` function
 * exported from `Kleisli` and the `chain` function below *could* be fleshed out
 * with a full `Monad` instance, but for now `chain` is all we need.
 */
const chain_ =
  <M extends URIS2, E>(M: Monad2C<M, E>) =>
  <A, B, I>(f: (a: A) => K.Kleisli<M, I, E, B>) =>
  (ia: K.Kleisli<M, I, E, A>): K.Kleisli<M, I, E, B> => ({
    decode: i =>
      M.chain(ia.decode(i), (a: A) => f(a).decode(i)),
  })

export const chain = chain_(M)

/**
 * EXAMPLES!
 */

const FooSchema: AppSchema<{
  money: number
}> = createSchema(s =>
  s.type({
    money: s.number,
  })
)

const decoderFoo = interpreter(DecoderSchemable)(FooSchema)

// interface Decoder<I, A> extends K.Kleisli<E.URI, I, DecodeError, A> {}
// type Decoder<I, A> = K.Kleisli<E.URI          , I, DecodeError, A>
//                        Kleisli<M extends URIS2, I, E, A> = { decode: (i: I) => Kind2<M, E, A> }
// type Decoder<I, A> = { decode: (i: I) => <E.URI, DecodeError, A> }
