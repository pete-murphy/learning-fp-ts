import { readonlyTuple as RTup } from "fp-ts"
import { pipe } from "fp-ts/function"

pipe(
  [1, "foo"] as const,
  RTup.mapFst(n => n + 1),
  RTup.mapSnd(str => str.length)
) //?
