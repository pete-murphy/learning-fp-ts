import {
  Dt,
  O,
  Ord,
  pipe,
  flow,
  RA,
  RNEA,
  St,
  E,
  not
} from "./lib/fp-ts-imports"
// import * as I from "./lib/interval/Interval"
import * as Ex from "./lib/interval/Extended"
import * as dateFns from "date-fns/fp"
import {
  makeMatch,
  makeMatchP
} from "ts-adt/MakeADT"
import * as V from "@simspace/collections/Vector"

const match = makeMatch("_tag")
const matchP = makeMatchP("_tag")

type Interval = {
  readonly start: Date
  readonly end: Ex.Extended<Date>
}

type Row = {
  readonly interval: Interval
  readonly amount: number
  readonly key: string
  // readonly meta: Meta
}

type YDelta = {
  readonly x: Date
  readonly y0: number
  readonly y1: number
}

type Path = {
  // readonly start: Date
  readonly deltas: RNEA.ReadonlyNonEmptyArray<YDelta>
}

const now = new Date()

const rows: RNEA.ReadonlyNonEmptyArray<Row> = [
  {
    interval: {
      start: dateFns.subDays(2)(now),
      end: Ex.finite(dateFns.addDays(3)(now))
    },
    amount: 1_000,
    key: "foo"
  },
  {
    interval: {
      start: dateFns.subDays(1)(now),
      end: Ex.posInf
    },
    amount: 3_222,
    key: "bar"
  },
  {
    interval: {
      start: now,
      end: Ex.finite(dateFns.addDays(2)(now))
    },
    amount: 1_010,
    key: "baz"
  },
  {
    interval: {
      start: dateFns.addDays(1)(now),
      end: Ex.posInf
    },
    amount: 1_010,
    key: "quuz"
  }
]

// all I need to compute the next stacked area is the previous stacked area
// ....
// and only the points in the prev stacked area that intersect/overlap with current interval (otherwise 0)
// for each

const clamp = Ord.clamp(Dt.Ord)
// const between = Ord.between(Ex.getOrd(Dt.Ord))
const between = Ord.between(Dt.Ord)
const clampFinite = Ex.clampFinite(Dt.Ord)

// traverse :: (a -> s -> (s, b)) -> [a] -> s -> (s, [b])
// a ~ Row
// s ~ [YDelta]
// b ~ Row + Path

const clmp = clampFinite(
  dateFns.subDays(3)(now),
  dateFns.addDays(8)(now)
)

const flp: (_: YDelta) => YDelta = d => ({
  x: d.x,
  y0: d.y1,
  y1: d.y0
})

const res = pipe(
  rows,
  St.traverseArray<
    Row,
    ReadonlyArray<YDelta>,
    Row & Path
  >(row => deltas => {
    const { start: start_, end: end_ } =
      row.interval
    const [start, end] = [
      clmp(Ex.finite(start_)),
      clmp(end_)
    ]
    const btwn: (_: YDelta) => boolean = flow(
      d => d.x,
      between(start, end)
    )
    const { init: before, rest } = RA.spanLeft(
      not(btwn)
    )(deltas)
    const { init: while_, rest: after } = pipe(
      rest,
      RA.spanLeft(btwn)
    )

    const start_y0 = pipe(
      RA.head(while_),
      O.match(
        () => 0,
        d => d.y0
      )
    )
    const end_y1 = pipe(
      RA.last(while_),
      O.match(
        () => 0,
        d => d.y1
      )
    )
    const path_: Path = {
      deltas: [
        {
          x: start,
          y0: start_y0,
          y1: start_y0 + row.amount
        },
        ...while_.map(
          (d): YDelta => ({
            x: d.x,
            y0: d.y0 + row.amount,
            y1: d.y1 + row.amount
          })
        ),
        {
          x: end,
          y0: end_y1 + row.amount,
          y1: end_y1
        }
      ]
    }

    const newDeltas = [
      ...before,
      ...path_.deltas,
      ...after
    ]

    return [
      {
        ...row,
        deltas: pipe(
          path_.deltas,
          RNEA.concat(
            pipe(while_, RA.map(flp), RA.reverse)
          )
        )
      },
      newDeltas
    ]
  }),
  St.evaluate<ReadonlyArray<YDelta>>([])
)

res //?

// pipe(
//   rows,
//   RA.scanLeft({
//     xs: [] as ReadonlyArray<{ y0: number, y1: number, x: number }>
//   }
//     // {
//       // times: [] as ReadonlyArray<
//       //   I.Interval<Date>
//       // >,
//       // times: [] as ReadonlyArray<
//       //   | {
//       //       readonly _tag: "Start"
//       //       readonly contents: Date
//       //     }
//       //   | {
//       //       readonly _tag: "End"
//       //       readonly contents: Ex.Extended<Date>
//       //     }
//       // >,

//       // amount: []
//       // amount:
//       //   (_: Ex.Extended<Date>) =>
//       //   (prevAmount: number): number =>
//       //     0
//     // }
//     ,
//     (prevState, row) => ({

//       // times: prevState.concat(),
//       // amount:
//       //   date =>
//       //   // compare this date to the ones in `times`
//       //   n =>
//       //     n + 1
//     })
//   )
// )
