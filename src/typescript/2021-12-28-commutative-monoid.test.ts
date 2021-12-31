import * as fc from "fast-check"
import {
  B,
  N,
  O,
  RA,
  RS,
  Sg,
} from "./ssstuff/fp-ts-imports"

const commutativity = <A, B>(
  arbA: fc.Arbitrary<A>,
  f: (a1: A, a2: A) => B
) =>
  fc.assert(
    fc.property(arbA, arbA, (n, m) => {
      const a = f(n, m)
      const b = f(m, n)
      expect(a).toEqual(b)
    })
  )

describe("Commutative monoids", () => {
  test("N.MonoidSum", () => {
    commutativity(fc.float(), N.MonoidSum.concat)
  })

  test("N.MonoidProduct", () => {
    commutativity(fc.float(), N.MonoidProduct.concat)
  })

  test("B.MonoidAll", () => {
    commutativity(fc.boolean(), B.MonoidAll.concat)
  })

  test("B.MonoidAny", () => {
    commutativity(fc.boolean(), B.MonoidAny.concat)
  })

  test("RS.getUnionMonoid(..)", () => {
    commutativity(
      fc.set(fc.boolean()).map(RS.fromReadonlyArray(B.Ord)),
      RS.getUnionMonoid(B.Ord).concat
    )
  })

  test("O.getMonoid(RS.getIntersectionSemigroup(..))", () => {
    commutativity(
      fc
        .set(fc.boolean())
        .map(RS.fromReadonlyArray(B.Ord))
        .map(O.some),
      O.getMonoid(RS.getIntersectionSemigroup(B.Ord)).concat
    )
  })

  test("O.getMonoid(Sg.max(..))", () => {
    commutativity(
      fc.frequency(
        {
          arbitrary: fc.constant<O.Option<number>>(O.none),
          weight: 1,
        },
        {
          arbitrary: fc.float().map(O.some),
          weight: 5,
        }
      ),
      O.getMonoid(Sg.max(N.Ord)).concat
    )
  })

  test("O.getMonoid(Sg.min(..))", () => {
    commutativity(
      fc.frequency(
        {
          arbitrary: fc.constant<O.Option<number>>(O.none),
          weight: 1,
        },
        {
          arbitrary: fc.float().map(O.some),
          weight: 5,
        }
      ),
      O.getMonoid(Sg.min(N.Ord)).concat
    )
  })
})
