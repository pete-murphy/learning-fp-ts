import * as IO from "fp-ts/IO"
import * as DateFns from "date-fns/fp"
import * as Dt from "fp-ts/Date"
import * as N from "fp-ts/number"
import { flow, pipe } from "fp-ts/function"

const padStart =
  (maxLength: number, fillString = " ") =>
  (str: string) =>
    str.padStart(maxLength, fillString)

const getPaddedMonth: IO.IO<string> = pipe(
  Dt.create,
  IO.map(
    flow(
      DateFns.getMonth,
      n => n + 1,
      N.Show.show,
      padStart(2, "0")
    )
  )
)
