import * as fc from "fast-check"
import * as laws from "fp-ts-laws"
import { monoidSum, monoidString } from "fp-ts/lib/Monoid"

import {
  getEitherMonoid,
  monoidSpace,
  monoidJSX,
} from "./monoidExercises"
import {
  getEq,
  Either,
  left,
  right,
} from "fp-ts/lib/Either"
import { eqNumber, eqString } from "fp-ts/lib/Eq"

describe.skip("getEitherMonoid", () => {
  const M = getEitherMonoid<number, string>(monoidString)
  const A: fc.Arbitrary<Either<number, string>> = fc.oneof(
    fc.float().map(left),
    fc.string().map(right)
  )
  const E = getEq(eqNumber, eqString)

  test("associativity", () => {
    fc.assert(
      fc.property(A, A, A, (e1, e2, e3) =>
        E.equals(
          M.concat(e1, M.concat(e2, e3)),
          M.concat(M.concat(e1, e2), e3)
        )
      )
    )
  })

  test("left identity", () => {
    fc.assert(
      fc.property(A, (e) =>
        E.equals(M.concat(e, M.empty), e)
      )
    )
  })

  test("right identity", () => {
    fc.assert(
      fc.property(A, (e) =>
        E.equals(M.concat(M.empty, e), e)
      )
    )
  })
})

describe("monoidSpace", () => {
  const M = monoidSpace
  const A = fc.string()
  const E = eqString

  test("associativity", () => {
    fc.assert(
      fc.property(A, A, A, (x, y, z) =>
        E.equals(
          M.concat(x, M.concat(y, z)),
          M.concat(M.concat(x, y), z)
        )
      )
    )
  })

  test("left identity", () => {
    fc.assert(
      fc.property(A, (e) =>
        E.equals(M.concat(e, M.empty), e)
      )
    )
  })

  test("right identity", () => {
    fc.assert(
      fc.property(A, (e) =>
        E.equals(M.concat(M.empty, e), e)
      )
    )
  })
})
