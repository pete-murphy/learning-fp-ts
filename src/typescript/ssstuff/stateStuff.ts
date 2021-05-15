import * as O from "fp-ts/Option"
import * as Dt from "fp-ts/Date"
import * as N from "fp-ts/Number"
import * as Ord from "fp-ts/Ord"
import * as RM from "fp-ts/ReadonlyMap"
import * as RA from "fp-ts/ReadonlyArray"
import * as RTup from "fp-ts/ReadonlyTuple"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as St from "fp-ts/State"
import * as Sg from "fp-ts/Semigroup"
import * as At from "monocle-ts/At"
import * as T from "monocle-ts/Traversal"
// import * as At from "monocle-ts/At"
import { flow, pipe, tuple } from "fp-ts/lib/function"
import { Apply1, getApplySemigroup } from "fp-ts/lib/Apply"
import { Separated } from "fp-ts/lib/Separated"

type Timespan = {
  readonly start: Date
  readonly end: O.Option<Date>
}

// Normally, `O.getOrd` says that `O.none` is *less than* `O.some(x)` for any
// given `x`. In the case of timespan end date, we want to say `O.none` (no
// specified end date) is *greater than* `O.some(d)` for any given `d: Date`, so
// we use `Ord.reverse` *twice* to invert the normal behavior on just the
// `Option` layer.
const ordTimespanEnd: Ord.Ord<O.Option<Date>> = Ord.reverse(
  O.getOrd(Ord.reverse(Dt.Ord))
)

// ordTimespanEnd.compare(O.none, O.some(new Date("2021-06-05 8:00"))) //?
// ordTimespanEnd.compare(O.some(new Date("2021-06-05 8:00")), O.some(new Date("2021-06-04 8:00"))) //?
// ordTimespanEnd.compare(O.some(new Date("2021-06-03 8:00")), O.some(new Date("2021-06-04 8:00"))) //?

const ordTimespan: Ord.Ord<Timespan> = pipe(
  Ord.tuple(Dt.Ord, ordTimespanEnd),
  Ord.contramap(span => tuple(span.start, span.end))
)

const ordReservationChartRow: Ord.Ord<ReservationChartRow> = pipe(
  ordTimespan,
  Ord.contramap(row => row.span)
)

export type ReservationChartRow = {
  /**
   * Unique key for the row
   */
  readonly key: string
  readonly name: string
  // readonly type: ReservationChartRowType
  readonly span: Timespan
  readonly cpuReserved: number
  readonly ramReserved: number

  // readonly highlighted: boolean
  // readonly tooltipContent: ReactNode
}

export type ReservationChartProps = {
  readonly rows: ReadonlyArray<ReservationChartRow>
  readonly start: Date
  readonly end: Date
}

const TEMP_DATA: ReservationChartProps = {
  rows: [
    {
      key: "1",
      name: "My Event",
      span: {
        start: new Date("2021-06-04 3:00"),
        end: O.some(new Date("2021-06-30 8:00")),
      },
      cpuReserved: 3000,
      ramReserved: 12,
    },
    {
      key: "2",
      name: "My Other Event",
      span: {
        start: new Date("2021-06-05 8:00"),
        end: O.some(new Date("2021-06-09 12:00")),
      },
      cpuReserved: 2300,
      ramReserved: 10,
    },
    {
      key: "3",
      name: "Range 1",
      span: {
        start: new Date("2021-06-08 18:00"),
        end: O.some(new Date("2021-06-25 2:00")),
      },
      cpuReserved: 1200,
      ramReserved: 8,
    },
    {
      key: "4",
      name: "My Event",
      span: {
        start: new Date("2021-06-15 10:00"),
        end: O.some(new Date("2021-06-25 18:00")),
      },
      cpuReserved: 2200,
      ramReserved: 16,
    },
    {
      key: "5",
      name: "My Other Event",
      span: {
        start: new Date("2021-06-21 9:00"),
        end: O.some(new Date("2021-06-25 8:00")),
      },
      cpuReserved: 1000,
      ramReserved: 4,
    },
    {
      key: "6",
      name: "Range 1",
      span: {
        start: new Date("2021-06-02 8:00"),
        end: O.some(new Date("2021-06-05 8:00")),
      },
      cpuReserved: 1000,
      ramReserved: 4,
    },
    {
      key: "7",
      name: "Some Range",
      span: {
        start: new Date("2021-06-06 8:00"),
        end: O.some(new Date("2021-06-15 8:00")),
      },
      cpuReserved: 1200,
      ramReserved: 8,
    },
    {
      key: "8",
      name: "Another Other Range",
      span: {
        start: new Date("2021-06-25 8:00"),
        end: O.some(new Date("2021-06-27 18:00")),
      },
      cpuReserved: 1200,
      ramReserved: 8,
    },
  ],
  start: new Date("2021-06-01 0:00-0400"),
  end: new Date("2021-07-01 0:00-0400"),
}

const sortedRows = pipe(TEMP_DATA.rows, RA.sort(ordReservationChartRow))
const sortedKeys = pipe(
  sortedRows,
  RA.map(row => row.key)
)

const allDates_ = pipe(
  sortedRows,
  RA.chain(row => [O.some(row.span.start), row.span.end])
)

const x_ = pipe(
  allDates_,
  RA.map(d =>
    tuple(
      d,
      sortedRows.map(row =>
        Ord.between(ordTimespanEnd)(O.some(row.span.start), row.span.end)(d)
          ? row.cpuReserved
          : 0
      )
    )
  ),
  RA.sort(Ord.contramap(RTup.fst)(ordTimespanEnd))
)

console.log(x_.map(RTup.snd))

/////////////////
const ApplyZippy: Apply1<RA.URI> = {
  ...RA.Apply,
  ap: (fab, fa) => RA.zipWith(fab, fa, (ab, a) => ab(a)),
}

type K_ = O.Option<Date>
type Ks_ = ReadonlyArray<K_>
type S_ = ReadonlyMap<K_, ReadonlyArray<number>>
// const ord_ =  Ord.between(ordTimespanEnd)(O.some(row.span.start), row.span.end)
const Mon_ = RM.getMonoid(
  ordTimespanEnd,
  getApplySemigroup(ApplyZippy)(N.SemigroupSum)
)

const foo_ = pipe(
  sortedRows,
  St.traverseArrayWithIndex((ix, row) =>
    pipe(
      St.gets<S_, Ks_>(
        flow(
          RM.keys(ordTimespanEnd),
          RA.filter(
            Ord.between(ordTimespanEnd)(O.some(row.span.start), row.span.end)
          )
        )
      ),
      St.chain(existingKeys =>
        St.modify<S_>(m =>
          Mon_.concat(
            m,
            pipe(
              [...existingKeys, O.some(row.span.start), row.span.end],
              RA.map(d =>
                tuple(
                  d,
                  RA.range(0, sortedRows.length).map((_, j) =>
                    j >= ix ? row.cpuReserved : 0
                  )
                )
              ),
              RM.fromFoldable(
                ordTimespanEnd,
                Sg.first<ReadonlyArray<number>>(),
                RA.Foldable
              )
            )
          )
        )
      )
    )
  ),
  St.execute<ReadonlyMap<O.Option<Date>, ReadonlyArray<number>>>(RM.empty)
)

foo_
const goo_ = RM.toUnfoldable(ordTimespanEnd, RA.Unfoldable)(foo_)
goo_

// foo_(RM.empty) //?

// pipe(
//   T.id<ReadonlyArray<[O.Option<Date>, ReadonlyArray<number>]>>(),
//   T.traverse(RA.Traversable),
//   T.modify(([d, ns]) => )
// )
