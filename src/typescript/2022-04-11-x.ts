import { Apply1 } from "fp-ts/lib/Apply"
import {
  Ap,
  Mn,
  N,
  pipe,
  RA,
  RR,
  RNEA,
  O,
  flow,
  TE
} from "./lib/fp-ts-imports"

pipe(
  [1, 2, 3],
  RA.chainFirst(x => {
    console.log(x)
    return [1]
  })
) //?
