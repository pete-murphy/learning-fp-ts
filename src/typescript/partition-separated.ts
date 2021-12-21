import { O, pipe, RA } from "./ssstuff/fp-ts-imports"
import * as Sep from "fp-ts/Separated"

type X = {
  key: O.Option<string>
  value: number
}

declare const xs: ReadonlyArray<X>

const isNoneKey = (x: X): x is { key: O.None; value: number } => O.isNone(x.key)
const isSomeKey = (x: X): x is { key: O.Some<string>; value: number } =>
  O.isSome(x.key)

pipe(
  xs,
  RA.partition(isSomeKey),
  Sep.mapLeft(RA.filter(isNoneKey))
  // ({left, right}) =>
)
