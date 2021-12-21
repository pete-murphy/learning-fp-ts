import { pipe } from "fp-ts/function"
import * as Ord from "fp-ts/Ord"
import * as Dt from "fp-ts/Date"
import * as t from "io-ts"
import * as tt from "io-ts-types"
import * as D from "io-ts/Decoder"

export const DateRange = t.type({
  from: tt.DateFromISOString,
  to: tt.DateFromISOString,
})

export type DateRange = t.TypeOf<typeof DateRange>

pipe(
  D.fromGuard(DateRange, "DateRange"),
  D.refine(
    (dateRange): dateRange is DateRange =>
      Ord.lt(Dt.Ord)(dateRange.from, dateRange.to),
    "Valid DateRange"
  )
)
