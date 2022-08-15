import { pipe } from "fp-ts/function"
import { Functor2 } from "fp-ts/lib/Functor"
import * as St from "fp-ts/State"
import * as StT from "fp-ts/StateT"
import * as T from "fp-ts/Task"

export interface StateTask<S, A> {
  (s: S): T.Task<[A, S]>
}

export const URI = "StateTask"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind2<E, A> {
    readonly [URI]: StateTask<E, A>
  }
}

/**
 * @category Functor
 */
export const map: <A, B>(
  f: (a: A) => B
) => <R>(fa: StateTask<R, A>) => StateTask<R, B> = StT.map(T.Functor)

export const chain: <A, S, B>(
  f: (a: A) => StateTask<S, B>
) => (ma: StateTask<S, A>) => StateTask<S, B> = StT.chain(T.Monad)

const f: StateTask<string, string> = pipe(
  StT.fromState(T.Pointed)(St.get<string>()),
  chain(
    filename => _ =>
      pipe(
        T.Do,
        T.apS("contents", () => fs.promises.readFile(filename, "utf8")),
        T.map(({ contents }) => [filename, contents])
      )
  )
)

// export const URI = "StateTask"

// export type URI = typeof URI

// declare module "fp-ts/lib/HKT" {
//   interface URItoKind2<E, A> {
//     readonly [URI]: StateTask<E, A>
//   }
// }

// export const map: <A, B>(
//   f: (a: A) => B
// ) => <S>(fa: StateTask<S, A>) => StateTask<S, B> = StT.map(T.Functor)
// const StateTask: Monad2<URI> = {
//   URI,
//   map: (fa, f) => pipe(fa, map(f)),
//   ap: (fab, fa) => pipe(fab, StT.ap(T.Chain)(fa)),
//   of: StT.of(T.Pointed),
//   chain: (fa, f) => pipe(fa, StT.chain(T.Chain)(f)),
// }

// const apS = Ap.apS(StateTask)
// const bind = Ch.bind(StateTask)

// bind(
//   "x",
//   ({ filename }) =>
//     _ =>
//       pipe(
//         T.Do,
//         T.apS("contents", () => fs.promises.readFile(filename, "utf8")),
//         T.map(({ contents }) => [filename, contents])
//       )
// )

// pipe(

// )

// const stateTask: Monad2<URI> = {
//   URI,
//   ap: (fab, fa) => pipe(fab, StT.ap(E.Chain)(fa)),
//   chain: (fa, f) => pipe(fa, StT.chain(E.Chain)(f)),
//   of: StT.of(E.Pointed)
// }

// const f: StateTask<string, string> = pipe(
//   Do,
//   apS("contents", () => f => )
// )

// filename => () => pipe(
//   T.Do,

//   () => fs.promises.readFile(filename, "utf-8"),

// ]

// const f_: T.Task<St.State<string, string>> = pipe(
//   T.Do,
//   T.apS("contents", () => fs.promises.readFile())
// )

// [filename => [
//   () => fs.promises.readFile(filename, "utf-8"),
//   "s",
// ]
