import { strong as S, reader as R } from "fp-ts"
import { pipe, tuple, flow } from "fp-ts/function"

flow(
  R.Strong.first,
  R.Strong.second,
  R.Strong.first
)((x: number) => x + 1)([[1, [2, "bar"]], "foo"]) //?

pipe(
  (x: number) => x + 1,
  R.Strong.first,
  R.Strong.second,
  R.Strong.first
)([[1, [2, "bar"]], "foo"]) //?
