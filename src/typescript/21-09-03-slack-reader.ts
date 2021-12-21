import { Ap, pipe, RTE } from "./ssstuff/fp-ts-imports"

type C = string
type E = string
declare function f(): RTE.ReaderTaskEither<C, E, number>
declare function g(a: number): RTE.ReaderTaskEither<C, E, number>

const h = pipe(
  RTE.Do,
  RTE.apS("a", f()),
  RTE.apS("c", RTE.ask()),
  RTE.chain(({ a, c }) => g(a))
)

const h_ = pipe(
  Ap.sequenceT(RTE.ApplyPar)(f(), RTE.ask<C>()),
  RTE.chain(([a, c]) => g(a))
)
