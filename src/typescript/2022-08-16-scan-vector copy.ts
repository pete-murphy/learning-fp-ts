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
  not,
  Eq,
  N
} from "./lib/fp-ts-imports"
// import * as I from "./lib/interval/Interval"
import * as Ex from "./lib/interval/Extended"
import * as dateFns from "date-fns/fp"
import {
  makeMatch,
  makeMatchP
} from "ts-adt/MakeADT"
import * as V from "@simspace/collections/Vector"
import { Ordering } from "fp-ts/Ordering"
import { Group } from "fp-ts/lib/Group"

// const V_spanLeft = V.reduce()

const match = makeMatch("_tag")
const matchP = makeMatchP("_tag")

///////////// Partition / spanLeft helpers

// Assumes working with an ordered container
const spanLeftTripartitionIndex = <A>(
  as: ReadonlyArray<A>,
  compare: (a: A) => Ordering
): readonly [number, number] => {
  const l = as.length
  let i = 0
  for (; i < l; i++) {
    if (!(compare(as[i]) === -1)) {
      break
    }
  }
  let j = i
  for (; j < l; j++) {
    if (!(compare(as[j]) === 0)) {
      break
    }
  }
  return [i, j - i]
}

interface SpannedTripartioned<A> {
  readonly lt: ReadonlyArray<A>
  readonly eq: ReadonlyArray<A>
  readonly gt: ReadonlyArray<A>
}

const spanLeftTripartition =
  <A>(compare: (a: A) => Ordering) =>
  (
    as: ReadonlyArray<A>
  ): SpannedTripartioned<A> => {
    const [i, j] = spanLeftTripartitionIndex(
      as,
      compare
    )
    const [lt, rest] = RA.splitAt(i)(as)
    const [eq, gt] = RA.splitAt(j)(rest)
    return { lt, eq, gt }
  }

//////////////////// Free Group

export const pos = <A>(pos: A): Pos<A> => ({
  _tag: "Pos" as const,
  pos
})

export const neg = <A>(neg: A): Neg<A> => ({
  _tag: "Neg" as const,
  neg
})

type Pos<A> = {
  readonly _tag: "Pos"
  readonly pos: A
}

type Neg<A> = {
  readonly _tag: "Neg"
  readonly neg: A
}

type Signed<A> = Pos<A> | Neg<A>

const isPos = <A>(
  signed: Signed<A>
): signed is Pos<A> => signed._tag === "Pos"
const isNeg = <A>(
  signed: Signed<A>
): signed is Neg<A> => signed._tag === "Neg"

type FreeGroup<A> = ReadonlyArray<Signed<A>>

const canonical =
  <A>(Eq: Eq.Eq<A>) =>
  (xs: FreeGroup<A>): FreeGroup<A> => {
    let ys: Array<Signed<A>> = []
    for (const x of xs) {
      if (
        ys.length > 0 &&
        isNeg(ys[0]) &&
        isPos(x)
      ) {
        Eq.equals(x.pos, ys[0].neg)
          ? ys.shift()
          : ys.push(x)
      } else if (
        ys.length > 0 &&
        isPos(ys[0]) &&
        isNeg(x)
      ) {
        Eq.equals(x.neg, ys[0].pos)
          ? ys.shift()
          : ys.push(x)
      } else ys.push(x)
    }
    return ys
  }

const swap: <A>(signed: Signed<A>) => Signed<A> =
  match({
    Neg: ({ neg }) => pos(neg),
    Pos: ({ pos }) => neg(pos)
  })

const group = <A>(
  Eq: Eq.Eq<A>
): Group<FreeGroup<A>> => {
  const { empty, concat } =
    RA.getMonoid<Signed<A>>()
  return {
    concat: flow(concat, canonical(Eq)),
    empty: empty,
    inverse: RA.map(swap)
  }
}

///////////////////////////////////////////////////////////////////////

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

const flip: (_: YDelta) => YDelta = d => ({
  x: d.x,
  y0: d.y1,
  y1: d.y0
})

const res = (
  clamp: (_: Ex.Extended<Date>) => Date
) =>
  pipe(
    rows,
    St.traverseArray<
      Row,
      ReadonlyArray<YDelta>,
      Row & Path
    >(row => deltas => {
      const { start: start_, end: end_ } =
        row.interval
      const [start, end] = [
        clamp(Ex.finite(start_)),
        clamp(end_)
      ]
      const btwn: (_: YDelta) => boolean = flow(
        d => d.x,
        between(start, end)
      )

      const {
        lt: before,
        eq: matchingStart,
        gt: rest
      } = pipe(
        deltas,
        spanLeftTripartition(({ x }) =>
          Dt.Ord.compare(x, start)
        )
      )
      const {
        lt: during,
        eq: matchingEnd,
        gt: after
      } = pipe(
        rest,
        spanLeftTripartition(({ x }) =>
          Dt.Ord.compare(x, end)
        )
      )
      // const { init: before, rest } = RA.spanLeft(
      //   not(btwn)
      // )(deltas)
      // const { init: while_, rest: after } = pipe(
      //   rest,
      //   RA.spanLeft(btwn)
      // )

      const sum_start_y0s = pipe(
        matchingStart,
        RA.foldMap(N.MonoidSum)(({ y0 }) => y0)
      )
      const start_y0 = pipe(
        RA.head(during),
        O.match(
          () => sum_start_y0s,
          d => d.y0
        )
      )
      const sum_end_y1s = pipe(
        matchingEnd,
        RA.foldMap(N.MonoidSum)(({ y0 }) => y0)
      )
      const end_y1 = pipe(
        RA.last(during),
        O.match(
          () => sum_end_y1s,
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
          ...during.map(
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
              pipe(
                during,
                RA.map(flip),
                RA.reverse
              )
            )
          )
        },
        newDeltas
      ]
    }),
    St.evaluate<ReadonlyArray<YDelta>>([])
  )

res(
  clampFinite(
    dateFns.subDays(1)(now),
    dateFns.addDays(1)(now)
  )
) //?
