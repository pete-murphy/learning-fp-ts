import * as fc from "fast-check"
import * as N from "fp-ts/Number"

import * as Ex from "./Extended"
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
  // it("")
})

describe("upperBound", () => {})

describe("intersection", () => {
  const intersection = _.intersection(N.Ord)
  const member = _.member(N.Ord)

  test("if an interval i contains x, the intersection of i and singleton x is singleton x", () => {
    fc.assert(
      fc.property(fc.integer(), arbitraryIntervalNum, (n, i) => {
        fc.pre(member(n)(i))

        const b = _.singleton(n)
        expect(intersection(b, i)).toEqual(b)
      })
    )
  })

  test("two distinct singletons have no intersection", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (n, m) => {
        fc.pre(n !== m)

        expect(intersection(_.singleton(n), _.singleton(m))).toEqual(_.empty)
      })
    )
  })

  test("intersection is commutative", () => {
    fc.assert(
      fc.property(arbitraryIntervalNum, arbitraryIntervalNum, (a, b) => {
        const ab = intersection(a, b)
        const ba = intersection(b, a)

        expect(ab).toEqual(ba)
      })
    )
  })

  test("intersection is associative", () => {
    fc.assert(
      fc.property(
        arbitraryIntervalNum,
        arbitraryIntervalNum,
        arbitraryIntervalNum,
        (a, b, c) => {
          const left = intersection(a, intersection(b, c))
          const right = intersection(intersection(a, b), c)

          expect(left).toEqual(right)
        }
      )
    )
  })
})

describe("interval", () => {
  const interval = _.interval(N.Ord)
  const intersection = _.intersection(N.Ord)
  test("two disjoint intervals have no intersection", () => {
    const a = interval(Ex.finite(10), Ex.posInf)
    const b = interval(Ex.negInf, Ex.finite(0))

    const actual = intersection(a, b)
    const expected = _.empty

    expect(actual).toEqual(expected)
  })

  test("intersection of an interval with a subinterval is the subinterval", () => {
    const a = interval(Ex.finite(10), Ex.posInf)
    const b = interval(Ex.finite(10), Ex.finite(20))

    const actual = intersection(a, b)
    const expected = b

    expect(actual).toEqual(expected)
  })
})
