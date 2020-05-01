import { getOrElse, some, option } from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

pipe(
  some([1, 2, 3]),
  getOrElse(() => [])
)
