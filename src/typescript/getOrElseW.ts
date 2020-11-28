import { getOrElseW, getOrElse, Option } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

declare const ex: Option<Array<number>>

const foo = pipe(
  ex,
  getOrElse(() => [])
)

const bar = pipe(
  ex,
  getOrElseW(() => [])
)
