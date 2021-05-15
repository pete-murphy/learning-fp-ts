import * as fc from "fast-check"
import * as N from "fp-ts/Number"
import { RM, Sg, RA, tuple, Ord, pipe } from "../fp-ts-imports"
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

  // test("keys in the triplets increase left-to-right", () => {
  //   fc.assert(
  //     fc.property(
  //       arbitraryIntervalMapNumString,
  //       arbitraryIntervalNum,
  //       (m, i) => {
  //         const [small, middle, large] = _.split(N.Ord)(i)(m)

  //         const keys = RM.keys(Ex.getOrd(N.Ord))

  //         const min = Ord.min(Ex.getOrd(N.Ord))
  //         const max = Ord.max(Ex.getOrd(N.Ord))

  //         const smallKeys = keys(small)
  //         const middleKeys = keys(middle)
  //         const largeKeys = keys(large)

  //         const last = <A>(xs: ReadonlyArray<A>) => xs[xs.length - 1]

  //         const coerceWithDefault = (
  //           n: Ex.Extended<number> | undefined,
  //           def: number
  //         ): number =>
  //           n
  //             ? pipe(
  //                 n,
  //                 match.on("_tag")({
  //                   NegInf: () => -Infinity,
  //                   Finite: ({ value }) => value,
  //                   PosInf: () => Infinity,
  //                 })
  //               )
  //             : def

  //         expect(
  //           coerceWithDefault(last(smallKeys), -Infinity)
  //         ).toBeLessThanOrEqual(coerceWithDefault(middleKeys[0], 0))
  //       }
  //     )
  //   )
  // })
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
