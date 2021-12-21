import {
  pipe,
  Re,
  RTup as Tuple,
  Str as S,
  Strong,
  tuple,
} from "./ssstuff/fp-ts-imports"

pipe(
  [1, "a"],
  Tuple.bimap(S.size, (x: number) => x * 2)
)

const double = (x: number) => x * 2

pipe(tuple(1, "a"), Strong.split(Re.Strong, Re.Category)(double, S.size)) //?
