// [T] or [T, T, [T], T, T] or [[[[T],T],T],T]

import * as Id from "fp-ts/Identity"
import { pipe } from "fp-ts/lib/pipeable"

const x = pipe(
  1,
  Id.map(n => n + 1)
)
x //?
