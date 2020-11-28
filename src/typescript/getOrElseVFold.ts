import * as O from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

const opt = O.some(0)

const a: Array<number> = pipe(
  opt,
  O.map(x => [x]),
  O.getOrElse(() => [])
)

const b: Array<number> = pipe(
  opt,
  O.fold(
    () => [],
    x => [x]
  )
)
