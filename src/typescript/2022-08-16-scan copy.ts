import {
  Dt,
  O,
  pipe,
  RA,
  RNEA,
  Ord
} from "./lib/fp-ts-imports"
// import * as I from "./lib/interval/Interval"
import * as Ex from "./lib/interval/Extended"
import * as dateFns from "date-fns/fp"
import {
  makeMatch,
  makeMatchP,
  makeMatchI
} from "ts-adt/MakeADT"
import * as T from "monocle-ts/Traversal"

const match = makeMatch("_tag")
const matchI = makeMatchI("_tag")
const matchP = makeMatchP("_tag")

type Interval = {
  readonly start: Date
  readonly end: Ex.Extended<Date>
}

type Row = {
  readonly interval: Interval
  readonly amount: number
}

const now = new Date()

const ExDateOrd = Ex.getOrd(Dt.Ord)

const rows: RNEA.ReadonlyNonEmptyArray<Row> = [
  {
    interval: {
      start: dateFns.subDays(2)(now),
      end: Ex.finite(dateFns.addDays(3)(now))
    },
    amount: 1_000
  },
  {
    interval: { start: now, end: Ex.posInf },
    amount: 3_222
  }
]

// all I need to compute the next stacked area is the previous stacked area
// ....
// and only the points in the prev stacked area that intersect/overlap with current interval (otherwise 0)
// for each

pipe(
  rows,
  RA.scanLeft(
    {
      // times: [] as ReadonlyArray<
      //   I.Interval<Date>
      // >,
      times: [] as ReadonlyArray<
        | {
            readonly _tag: "Start"
            readonly contents: Date
          }
        | {
            readonly _tag: "End"
            readonly contents: Ex.Extended<Date>
          }
      >,
      amount: []
      // amount:
      //   (_: Ex.Extended<Date>) =>
      //   (prevAmount: number): number =>
      //     0
    },
    (prevState, row) => ({
      times: pipe(
        prevState.times,
        RA.filter(
          match({
            Start: ({ contents }) =>
              Ord.between(ExDateOrd)(
                Ex.finite(row.interval.start),
                row.interval.end
              )(Ex.finite(contents)),
            End: ({ contents }) =>
              Ord.between(ExDateOrd)(
                Ex.finite(row.interval.start),
                row.interval.end
              )(contents)
          })
        ),
        RA.appendW({
          _tag: "Start" as const,
          contents: row.interval.start
        }),
        RA.appendW({
          _tag: "End" as const,
          contents: row.interval.end
        })
      ),
      amount:
        date =>
        // compare this date to the ones in `times`
        n =>
          n + 1
    })
  )
)
