import { pipe, RD } from "./ssstuff/fp-ts-imports"

const x1 = pipe(
  RD.Do,
  RD.apS("bar", RD.failure("foo")),
  RD.apSW("foo", RD.initial)
) //?

console.log(x1)
