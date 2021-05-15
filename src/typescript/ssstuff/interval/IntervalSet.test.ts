import * as fc from "fast-check"
import * as N from "fp-ts/number"
import * as RM from "fp-ts/ReadonlyMap"
import { tuple, pipe, constVoid } from "fp-ts/function"
import * as O from "fp-ts/Option"
import * as Ord from "fp-ts/Ord"
import * as RA from "fp-ts/ReadonlyArray"
import { match } from "../matchers"
import * as Ex from "./Extended"
import * as I from "./Interval"
import * as IM from "./IntervalMap"

import * as _ from "./IntervalSet"

const mk = _.fromReadonlyArray(N.Ord)

const arbitraryIntervalNum: fc.Arbitrary<I.Interval<number>> = fc
  .tuple(fc.integer(), fc.integer())
  .filter(([n, m]) => n <= m)
  .chain(([n, m]) =>
    fc.constantFrom<I.Interval<number>>(
      I.between(n, m),
      I.greaterThan(n),
      I.lessThan(n),
      I.infinite,
      I.empty
    )
  )

const arbitraryIntervalSetNum: fc.Arbitrary<_.IntervalSet<number>> = fc
  .array(arbitraryIntervalNum)
  .map(_.fromReadonlyArray(N.Ord))

describe("deleteAt", () => {
  const deleteAt = _.deleteAt(N.Ord)
  test("deleting from empty set returns empty set", () => {
    fc.assert(
      fc.property(arbitraryIntervalNum, i => {
        const actual = deleteAt(i)(RM.empty)
        expect(actual).toEqual(RM.empty)
      })
    )
  })

  test("deleting empty interval returns original set", () => {
    fc.assert(
      fc.property(arbitraryIntervalSetNum, s => {
        const actual = deleteAt(I.empty)(s)
        expect(actual).toEqual(s)
      })
    )
  })

  test("deleting is commutative", () => {
    fc.assert(
      fc.property(
        arbitraryIntervalSetNum,
        arbitraryIntervalNum,
        arbitraryIntervalNum,
        (s, i1, i2) => {
          const i1AfterI2 = deleteAt(i1)(deleteAt(i2)(s))
          const i2AfterI1 = deleteAt(i2)(deleteAt(i1)(s))
          expect(i1AfterI2).toEqual(i2AfterI1)
        }
      )
    )
  })
})
