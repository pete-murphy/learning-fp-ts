import * as fc from "fast-check"
import * as N from "fp-ts/Number"

import * as _ from "./Interval"

const arbitraryIntervalNum: fc.Arbitrary<_.Interval<number>> = fc
  .tuple(fc.integer(), fc.integer())
  .filter(([n, m]) => n <= m)
  .chain(([n, m]) =>
    fc.constantFrom<_.Interval<number>>(
      _.between(n, m),
      _.greaterThan(n),
      _.lessThan(n),
      _.infinite,
      _.empty
    )
  )

const { join, meet } = _.getLattice(N.Ord)

describe("Interval join semilattice", () => {
  /**
   * JoinSemilattice laws
   * --------------------
   * Associativity of join: forall a b c, join a (join b c) == join (join a b) c
   * Commutativity of join: forall a b, join a b == join b a
   * Idempotency of join: forall a, join a a == a
   */

  it("join should be associative", () => {
    fc.assert(
      fc.property(
        arbitraryIntervalNum,
        arbitraryIntervalNum,
        arbitraryIntervalNum,
        (x, y, z) => expect(join(x, join(y, z))).toEqual(join(join(x, y), z))
      )
    )
  })

  it("join should be commutative", () => {
    fc.assert(
      fc.property(arbitraryIntervalNum, arbitraryIntervalNum, (x, y) =>
        expect(join(x, y)).toEqual(join(y, x))
      )
    )
  })

  it("join should be idempotent", () => {
    fc.assert(
      fc.property(arbitraryIntervalNum, x => expect(join(x, x)).toEqual(x))
    )
  })
})

describe("Interval meet semilattice", () => {
  /**
   * MeetSemilattice laws
   * --------------------
   * Associativity of meet: forall a b c, meet a (meet b c) == meet (meet a b) c
   * Commutativity of meet: forall a b, meet a b == meet b a
   * Idempotency of meet: forall a, meet a a == a
   */

  it("meet should be associative", () => {
    fc.assert(
      fc.property(
        arbitraryIntervalNum,
        arbitraryIntervalNum,
        arbitraryIntervalNum,
        (x, y, z) => expect(meet(x, meet(y, z))).toEqual(meet(meet(x, y), z))
      )
    )
  })

  it("meet should be commutative", () => {
    fc.assert(
      fc.property(arbitraryIntervalNum, arbitraryIntervalNum, (x, y) =>
        expect(meet(x, y)).toEqual(meet(y, x))
      )
    )
  })

  it("meet should be idempotent", () => {
    fc.assert(
      fc.property(arbitraryIntervalNum, x => expect(meet(x, x)).toEqual(x))
    )
  })
})

describe("lowerBound", () => {
  it("")
})

describe("upperBound", () => {})

describe("intersection", () => {})
