import * as Mn from "fp-ts/Monoid"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RA from "fp-ts/ReadonlyArray"
import { identity, pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import * as T from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import * as Str from "fp-ts/string"
import * as Ap from "fp-ts/Apply"

type ProductTypeGroups = "ProductTypeGroups"
type Prices = "Prices"

declare const getProductTypeGroups: (
  id: number
) => TE.TaskEither<Error, ProductTypeGroups>
declare const fetchPrices: (
  id: number
) => TE.TaskEither<Error, Prices>

export const fetchEntities = (id: number) => {
  return pipe(
    TE.Do,
    TE.apS("r1", getProductTypeGroups(id)),
    TE.apS("r2", fetchPrices(id))
  )
}

// export const fetchEntities = (id: number) => {
//   Ap.sequenceT
//   return pipe(
//     TE.Do,
//     TE.apS("r1", getProductTypeGroups(id)),
//     TE.apS("r2", fetchPrices(id))
//   )
// }
