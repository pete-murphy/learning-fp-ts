import * as Mn from "fp-ts/Monoid"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RA from "fp-ts/ReadonlyArray"
import * as A from "fp-ts/Array"
import { identity, pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import * as T from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import * as Str from "fp-ts/string"
import * as Ap from "fp-ts/Apply"
import { N, NEA, RNEA } from "./lib/fp-ts-imports"

type Actionable = {
  action?: string
}
type Aggregate = {
  allowed: number
  blocked: number
}

const emptyAggregate: Aggregate = {
  allowed: 0,
  blocked: 0
}

const list: Actionable[] = [
  { action: "block" },
  {},
  { action: "block" },
  {},
  { action: "allow" }
]

const extractAction = (a: Actionable) => a.action
const stringToAggregator = (str: string): Aggregate => {
  return {
    allowed: str === "allow" ? 1 : 0,
    blocked: str === "block" ? 1 : 0
  }
}
const sumAggregates =
  (a: Aggregate) =>
  (b: Aggregate): Aggregate => {
    return {
      allowed: a.allowed + b.allowed,
      blocked: a.blocked + b.blocked
    }
  }

const totals: O.Option<Aggregate> = pipe(
  list,
  A.map(extractAction),
  A.filterMap(O.fromNullable),
  NEA.fromArray,
  O.map(
    NEA.foldMap(
      Mn.struct({
        allowed: N.MonoidSum,
        blocked: N.MonoidSum
      })
    )(stringToAggregator)
  )
)

const totals_: O.Option<Aggregate> = pipe(
  [{}, {}],
  A.map(extractAction),
  A.filterMap(O.fromNullable),
  A.map(stringToAggregator),
  O.fromPredicate(A.isNonEmpty),
  O.map(
    A.reduce(emptyAggregate, (a, b) => sumAggregates(a)(b))
  )
)
console.log(totals) //?
console.log(totals_) //?

// pipe(O.none, O.ap(O.some(1)))
// pipe(O.some(f), O.ap(O.none))
// pipe(O.none, O.ap(O.some(3)))
