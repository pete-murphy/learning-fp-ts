import { array, record } from "fp-ts"
import { pipe } from "fp-ts/lib/pipeable"
import { sequenceS } from "fp-ts/lib/Apply"

pipe(
  [1, 2, 3],
  array.map((x) => x + 1),
  array.chain((x) => [x, x * 10])
)
