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
  .filter(([n, m]) => n < m)
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
  .map(mk)

describe("deleteAt", () => {
  const deleteAt = _.deleteAt(N.Ord)

  describe("unit tests", () => {
    test("case 1", () => {
      const actual = deleteAt(I.between(1, 2))(mk([I.between(0, 3)]))
      const expected = mk([I.between(0, 1), I.between(2, 3)])

      expect(actual).toEqual(expected)
    })

    test("case 2", () => {
      const actual = deleteAt(I.between(1, 3))(mk([I.between(0, 3)]))
      const expected = mk([I.between(0, 1)])

      expect(actual).toEqual(expected)
    })

    test("case 3", () => {
      const actual = deleteAt(I.between(1, 4))(
        _.fromReadonlyArray(N.Ord)([I.between(0, 3)])
      )
      const expected = _.fromReadonlyArray(N.Ord)([I.between(0, 1)])

      expect(actual).toEqual(expected)
    })

    test("case 4", () => {
      const actual = deleteAt(I.between(1, 4))(
        _.fromReadonlyArray(N.Ord)([I.between(0, 3), I.between(1, 2)])
      )
      const expected = _.fromReadonlyArray(N.Ord)([I.between(0, 1)])

      expect(actual).toEqual(expected)
    })

    test("case 5", () => {
      const original = _.fromReadonlyArray(N.Ord)([
        I.between(0, 3),
        I.between(1, 2),
      ])
      const actual = deleteAt(I.between(5, 6))(original)
      const expected = original

      expect(actual).toEqual(expected)
    })
  })

  describe("property tests", () => {
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

    test("commutativity", () => {
      fc.assert(
        fc.property(
          arbitraryIntervalSetNum,
          arbitraryIntervalNum,
          arbitraryIntervalNum,
          (s, i1, i2) => {
            const i1i2 = deleteAt(i1)(deleteAt(i2)(s))
            const i2i1 = deleteAt(i2)(deleteAt(i1)(s))

            expect(i1i2).toEqual(i2i1)
          }
        )
      )
    })
  })
})

describe("insert", () => {
  describe("property tests", () => {
    const insert = _.insert(N.Ord)

    test("commutativity", () => {
      fc.assert(
        fc.property(
          arbitraryIntervalSetNum,
          arbitraryIntervalNum,
          arbitraryIntervalNum,
          (s, i1, i2) => {
            const i1i2 = insert(i1)(insert(i2)(s))
            const i2i1 = insert(i2)(insert(i1)(s))

            expect(i1i2).toEqual(i2i1)
          }
        )
      )
    })
  })
})

describe("union", () => {
  describe("property tests", () => {
    const union = _.union(N.Ord)

    test("commutativity", () => {
      fc.assert(
        fc.property(
          arbitraryIntervalSetNum,
          arbitraryIntervalSetNum,
          (a, b) => {
            const ab = union(a, b)
            const ba = union(b, a)

            expect(ab).toEqual(ba)
          }
        )
      )
    })

    test("associativity", () => {
      fc.assert(
        fc.property(
          arbitraryIntervalSetNum,
          arbitraryIntervalSetNum,
          arbitraryIntervalSetNum,
          (a, b, c) => {
            const left = union(a, union(b, c))
            const right = union(union(a, b), c)

            expect(left).toEqual(right)
          }
        )
      )
    })

    test("left identity of empty set", () => {
      fc.assert(
        fc.property(arbitraryIntervalSetNum, a => {
          expect(union(_.empty, a)).toEqual(a)
        })
      )
    })

    test("right identity of empty set", () => {
      fc.assert(
        fc.property(arbitraryIntervalSetNum, a => {
          expect(union(a, _.empty)).toEqual(a)
        })
      )
    })
  })
})

describe("unions", () => {
  describe("property tests", () => {
    const unions = _.unions(N.Ord, RA.Foldable)

    test("on singleton list returns element from list", () => {
      fc.assert(
        fc.property(arbitraryIntervalSetNum, a => {
          const actual = unions([a])

          expect(actual).toEqual(a)
        })
      )
    })
  })
})

describe("fromReadonlyArray", () => {
  describe("unit tests", () => {
    const fromReadonlyArray = _.fromReadonlyArray(N.Ord)
    const singleton = _.singleton(N.Ord)
    const union = _.union(N.Ord)

    test("on empty array returns empty interval", () => {
      const actual = fromReadonlyArray([])
      const expected = _.empty

      expect(actual).toEqual(expected)
    })

    test("on adjacent intervals returns union", () => {
      const actual = fromReadonlyArray([I.between(0, 1), I.between(1, 2)])
      const expected = singleton(I.between(0, 2))

      expect(actual).toEqual(expected)
    })

    test("on overlapping intervals returns union", () => {
      const actual = fromReadonlyArray([I.between(0, 2), I.between(1, 3)])
      const expected = singleton(I.between(0, 3))

      expect(actual).toEqual(expected)
    })

    test("on disjoint intervals", () => {
      const a = I.between(0, 1)
      const b = I.between(2, 3)
      const actual = fromReadonlyArray([a, b])
      const expected = union(singleton(a), singleton(b))

      expect(actual).toEqual(expected)
    })
  })

  describe("property tests", () => {
    const fromReadonlyArray = _.fromReadonlyArray(N.Ord)
    const singleton = _.singleton(N.Ord)
    const unions = _.unions(N.Ord, RA.Foldable)

    test("same as unions of singletons", () => {
      fc.assert(
        fc.property(fc.array(arbitraryIntervalNum), is => {
          const actual = fromReadonlyArray(is)
          const expected = unions(is.map(singleton))

          expect(actual).toEqual(expected)
        })
      )
    })
  })
})
