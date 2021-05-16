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

import * as _ from "./IntervalMap"

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

const arbitraryIntervalMapNumString: fc.Arbitrary<
  _.IntervalMap<number, string>
> = fc
  .array(
    arbitraryIntervalNum.chain(interval =>
      fc.string().map(str => tuple(interval, str))
    )
  )
  .map(mk)

const matchOnTag = match.on("_tag")

/**
 * A helper for picking a number that is *stric
 */
const pickup = (interval: I.Interval<number>): O.Option<number> =>
  pipe(tuple(I.lowerBound(interval), I.upperBound(interval)), ([l, u]) =>
    pipe(
      l,
      matchOnTag({
        NegInf: () =>
          pipe(
            u,
            matchOnTag({
              NegInf: () => O.none,
              // Finite: ({ value }) => O.some(value - 1),
              Finite: ({ value }) => O.some(value - 1),
              PosInf: () => O.some(0),
            })
          ),
        Finite: x =>
          pipe(
            u,
            matchOnTag({
              NegInf: () => O.none,
              Finite: y =>
                // x.value > y.value ? O.none : O.some((x.value + y.value) / 2),
                x.value >= y.value ? O.none : O.some((x.value + y.value) / 2),
              PosInf: () => O.some(x.value + 1),
              // PosInf: () => O.some(x.value),
            })
          ),
        PosInf: () => O.none,
      })
    )
  )

describe("pickup", () => {
  const memberNumInterval = I.member(N.Ord)
  test("picked-up num is always member of original interval", () => {
    fc.assert(
      fc.property(arbitraryIntervalNum, i => {
        pipe(
          pickup(i),
          O.fold(constVoid, n => {
            expect(memberNumInterval(n)(i)).toBe(true)
          })
        )
      }),
      { numRuns: 1000 }
    )
  })
})

describe("alter", () => {
  test('alter (const Nothing) (between 0 10) (fromList [between 0 10, "A"]) == fromList []', () => {
    const m = mk([[I.between(0, 10), "A"]])
    const actual = _.alter(N.Ord)((): O.Option<string> => O.none)(
      I.between(0, 10)
    )(m)
    const expected = RM.empty

    expect(actual).toEqual(expected)
  })

  test("Looking up after altering with f at key is same as applying f after lookup at k", () => {
    const lookup = _.lookup(N.Ord)
    const alter = _.alter(N.Ord)
    fc.assert(
      fc.property(
        arbitraryIntervalMapNumString,
        arbitraryIntervalNum,
        (m, i) => {
          pipe(
            pickup(i),
            O.fold(constVoid, k => {
              const f = O.map(x => `${x}-foo`)
              const lookupAfter = lookup(k)(alter(f)(i)(m))
              const applyAfter = f(lookup(k)(m))
              expect(lookupAfter).toEqual(applyAfter)
            })
          )
        }
      ),
      {
        // numRuns: 500_000,
      }
    )
  })
})

describe("split", () => {
  test("case 1", () => {
    const m: _.IntervalMap<number, string> = mk([
      [I.between(2, 10), "A"],
      [I.between(10, 20), "B"],
      [I.between(20, 30), "C"],
    ])

    const smaller: _.IntervalMap<number, string> = mk([[I.between(2, 5), "A"]])
    const middle: _.IntervalMap<number, string> = mk([[I.between(5, 9), "A"]])
    const larger: _.IntervalMap<number, string> = mk([
      [I.between(9, 10), "A"],
      [I.between(10, 20), "B"],
      [I.between(20, 30), "C"],
    ])

    const actual = _.split(N.Ord)(I.between(5, 9))(m)

    expect(actual[0]).toEqual(smaller)
    expect(actual[1]).toEqual(middle)
    expect(actual[2]).toEqual(larger)
  })

  test("case 2", () => {
    const m: _.IntervalMap<number, string> = mk([
      [I.between(2, 10), "A"],
      [I.between(10, 20), "B"],
      [I.between(20, 30), "C"],
    ])

    const actual = _.split(N.Ord)(I.between(0, 1))(m)

    expect(actual[0]).toEqual(RM.empty)
    expect(actual[1]).toEqual(RM.empty)
    expect(actual[2]).toEqual(m)
  })

  test("case 3", () => {
    const m: _.IntervalMap<number, string> = mk([
      [I.between(2, 10), "A"],
      [I.between(10, 20), "B"],
      [I.between(20, 30), "C"],
    ])

    const actual = _.split(N.Ord)(I.between(40, 50))(m)

    expect(actual[0]).toEqual(m)
    expect(actual[1]).toEqual(RM.empty)
    expect(actual[2]).toEqual(RM.empty)
  })

  test("keys in the triplet increase left-to-right", () => {
    const coerce: (n: Ex.Extended<number>) => number = match.on("_tag")({
      NegInf: () => -Infinity,
      Finite: ({ value }) => value,
      PosInf: () => Infinity,
    })

    fc.assert(
      fc.property(
        arbitraryIntervalMapNumString,
        arbitraryIntervalNum,
        (m, i) => {
          const [small, middle, large] = _.split(N.Ord)(i)(m)

          const keys = RM.keys(Ex.getOrd(N.Ord))

          const smallKeys = keys(small)
          const middleKeys = keys(middle)
          const largeKeys = keys(large)

          pipe(
            O.Do,
            O.apS("maxFromSmall", RA.last(smallKeys)),
            O.apS("minFromMiddle", RA.head(middleKeys)),
            O.fold(constVoid, ({ maxFromSmall, minFromMiddle }) =>
              expect(coerce(maxFromSmall)).toBeLessThanOrEqual(
                coerce(minFromMiddle)
              )
            )
          )

          pipe(
            O.Do,
            O.apS("maxFromMiddle", RA.last(middleKeys)),
            O.apS("minFromLarge", RA.head(largeKeys)),
            O.fold(constVoid, ({ maxFromMiddle, minFromLarge }) =>
              expect(coerce(maxFromMiddle)).toBeLessThanOrEqual(
                coerce(minFromLarge)
              )
            )
          )
        }
      )
    )
  })
})

describe("insert", () => {
  const insert = _.insert(N.Ord)

  test("insert into empty map is same as singleton", () => {
    fc.assert(
      fc.property(arbitraryIntervalNum, fc.string(), (k, str) => {
        const actual = insert(k, str)(RM.empty)
        const expected = _.singleton(k, str)
        expect(actual).toEqual(expected)
      })
    )
  })

  test("insert infinite returns infinite", () => {
    fc.assert(
      fc.property(arbitraryIntervalMapNumString, fc.string(), (m, str) => {
        const actual = insert(I.infinite, str)(m)
        const expected = _.infinite(str)
        expect(actual).toEqual(expected)
      })
    )
  })
})
