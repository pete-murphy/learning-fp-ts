import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as A from "fp-ts/lib/Array"
import * as T from "fp-ts/lib/Task"
import { pipe } from "fp-ts/lib/pipeable"

type DEFAULT_RTE = RTE.ReaderTaskEither<any, any, any>
type DEFAULT_RTES = ReadonlyArray<DEFAULT_RTE>

/**
 * Performs the type-level computation that combineRTE uses
 */
export type CombinedRtes<RTES extends DEFAULT_RTES> = RTE.ReaderTaskEither<
  CombinedRteEnv<RTES>,
  CombinedRteErr<RTES>,
  CombinedRteOutput<RTES>
>

/**
 * Aggregate many RTE environments into an intersection.
 */
export type CombinedRteEnv<
  RTES extends DEFAULT_RTES
> = unknown extends ToRteConsList<RTES>
  ? RteEnv<RTES[0]>
  : UnNest<Flatten<ToRteConsList<RTES>, unknown>>
// RTES = [RTE<A, B, C>, RTE<D, E, F>, RTE<F, G, H>]
// ToRteConsList = [A, [D, [F]]]
// Flatten = [[[A & D & F]]]
// UnNest = A & D & F

export type CombinedRteErr<RTES extends DEFAULT_RTES> = {
  [K in keyof RTES]: RteError<RTES[K]>
}[number]

export type CombinedRteOutput<RTES extends DEFAULT_RTES> = {
  [K in keyof RTES]: RteOutput<RTES[K]>
}

// Retrieve the environment from an RTE
// tslint:disable-next-line:no-any
export type RteEnv<A> = A extends RTE.ReaderTaskEither<infer R, any, any>
  ? R
  : never

// Retrieve the error type from an RTE
// tslint:disable-next-line:no-any
export type RteError<A> = A extends RTE.ReaderTaskEither<any, infer R, any>
  ? R
  : never

// Retrieve the output value from an RTE
// tslint:disable-next-line:no-any
export type RteOutput<A> = A extends RTE.ReaderTaskEither<any, any, infer R>
  ? R
  : never

// Creates a ConsList of RTE environment types
type ToRteConsList<A extends DEFAULT_RTES> = [] extends A
  ? unknown // tslint:disable-next-line:no-any
  : ((...a: A) => any) extends (t: infer T, ...ts: infer TS) => any
  ? TS extends DEFAULT_RTES
    ? [RteEnv<T>, ToRteConsList<TS>]
    : never
  : never

// Recursively traverses a ConsList, creating an intersection as it does.
type Flatten<A, S> = A extends [infer H]
  ? S & H
  : A extends [infer I, infer T]
  ? [Flatten<T, S & I>] // This tuple nesting is required to ensure that the type is lazily defined.
  : S

// Since Flatten produces an n-depth Tuple containing the union we want, we need to traverse
// that n-depth tuple and try to pull out our intersection
type UnNest<T, Fallback = unknown> = T extends ReadonlyArray<unknown>
  ? {
      [K in keyof T]: T[K] extends [infer TT]
        ? TT extends ReadonlyArray<unknown>
          ? UnNest<TT>
          : TT
        : T[K]
    }[number]
  : Fallback

export const unsafeCoerceToArray = <A>(
  readonlyArray: ReadonlyArray<A>
): Array<A> => readonlyArray as Array<A>

const rte: RTE.ReaderTaskEither<{}, Error, {}> = RTE.readerTaskEither.fromTask(
  T.delay(100)(T.of({}))
)

export function combineRTE<Rtes extends DEFAULT_RTES>(
  rtes: Rtes
): CombinedRtes<Rtes> {
  return (A.array.sequence(RTE.readerTaskEither)(
    unsafeCoerceToArray(rtes)
  ) as unknown) as CombinedRtes<Rtes>
}

console.time("combineRTE")
combineRTE([rte, rte, rte])({})().then(() => console.timeEnd("combineRTE"))
