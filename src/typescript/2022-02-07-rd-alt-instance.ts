import { pipe, RD } from "./ssstuff/fp-ts-imports"

const x0 = pipe(
  RD.initial,
  RD.alt(() => RD.success(5))
)

const x1 = pipe(
  RD.pending,
  RD.alt(() => RD.success(5))
)

const x2 = pipe(
  RD.failure("foo"),
  RD.alt<string, number>(() => RD.success(5))
)

console.log({ x0, x1, x2 })
