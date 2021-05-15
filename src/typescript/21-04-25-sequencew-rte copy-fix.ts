import * as RTE from "fp-ts/lib/ReaderTaskEither"
import * as TE from "fp-ts/lib/TaskEither"

type DEFAULT_RTE = RTE.ReaderTaskEither<any, any, any>
type DEFAULT_RTES = ReadonlyArray<DEFAULT_RTE>

/**
 * Performs the type-level computation that combineRTE uses
 */
export type CombinedRtes<RTES extends DEFAULT_RTES> = RTE.ReaderTaskEither<
  CombinedRteEnv<RTES>,
  // Ignoring error & success types
  any,
  any
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

// Retrieve the environment from an RTE
// tslint:disable-next-line:no-any
export type RteEnv<A> = A extends RTE.ReaderTaskEither<infer R, any, any>
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

export function sequenceW<Rtes extends DEFAULT_RTES>(
  rtes: Rtes
): CombinedRtes<Rtes> {
  return (RTE.sequenceArray(rtes) as unknown) as CombinedRtes<Rtes>
}

// const rte1: RTE.ReaderTaskEither<Foo, never, {}> = (_: { foo: string }) =>
//   TE.right({})
// const rte2: RTE.ReaderTaskEither<Bar, never, {}> = (_: { bar: string }) =>
//   TE.right({})
// const rte3: RTE.ReaderTaskEither<Baz, never, {}> = (_: { baz: string }) =>
//   TE.right({})

type Foo = { foo: string }
type Bar = { bar: string }
type Baz = { baz: string }

declare const rte1: RTE.ReaderTaskEither<Foo, any, any>
declare const rte2: RTE.ReaderTaskEither<Bar, any, any>
declare const rte3: RTE.ReaderTaskEither<Baz, any, any>

const x = sequenceW([rte1, rte2, rte3])
x({ foo: "asdf" }) // Should be type error
