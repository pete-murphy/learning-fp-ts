import {
  date,
  option,
  function as f,
  monoid,
  semigroup,
  readonlyArray,
  readonlyRecord,
  readonlyNonEmptyArray,
  number
} from "fp-ts"
import { format } from "date-fns"

type StringTimestamp = string
type TipoDolencia = "hiccup" | "fever" | "constipation"

// Expected output types
export interface TimePeriod {
  start: Date
  end: Date
}

interface Stats {
  timePeriod: TimePeriod
  type: TipoDolencia
  total: number
  byDay: {
    [day: StringTimestamp]: number
  }
}

type StatsCollection = { [k in TipoDolencia]: Stats }

// // Which compiles down to to
// type StatsCollection = {
//     hiccup: Stats;
//     fever: Stats;
//     constipation: Stats;
// }

type EntityId = string
// Input types
type LogEntry = {
  id: EntityId
  type: TipoDolencia
  logType: "disease"
  timestamp: Date
  notes: string
  color:
    | "$purple"
    | "$pink"
    | "$gray"
    | "$amber"
    | "$indigo"
    | "$tomato"
    | "$cyan"
  parent: EntityId
}

const semigroupTimePeriod: semigroup.Semigroup<TimePeriod> =
  semigroup.struct({
    start: semigroup.min(date.Ord),
    end: semigroup.max(date.Ord)
  })
const semigroupStats: semigroup.Semigroup<Stats> =
  semigroup.struct({
    timePeriod: semigroupTimePeriod,
    type: semigroup.first<TipoDolencia>(),
    total: number.SemigroupSum,
    byDay: readonlyRecord.getMonoid(number.SemigroupSum)
  })

const logEntriesToStatsCollection: (
  entries: ReadonlyArray<LogEntry>
) => Partial<StatsCollection> = readonlyArray.foldMap(
  readonlyRecord.getMonoid(semigroupStats)
)(logEntry => ({
  [logEntry.type]: {
    timePeriod: {
      start: logEntry.timestamp,
      end: logEntry.timestamp
    },
    type: logEntry.type,
    total: 1,
    byDay: {
      [format(logEntry.timestamp, "MM-dd")]: 1
    }
  }
}))
