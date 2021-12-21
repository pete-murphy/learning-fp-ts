import * as _ from "./2021-09-18-danm-unit"
import * as fc from "fast-check"
import * as N from "fp-ts/lib/number"
import * as Mn from "fp-ts/lib/Monoid"
import * as Endo from "fp-ts/lib/Endomorphism"

// const arbByteUnitMultiple: fc.Arbitrary<_.ByteUnitMultiple> = fc.constantFrom(_.mb, )

const div = (n: number) => N.Field.div(n, 1000)
const mul = (n: number) => N.Field.mul(n, 1000)
const M = Endo.getMonoid<number>()
const balancedArray: fc.Arbitrary<Array<(n: number) => number>> = fc
  .array(fc.boolean())
  .map(xs => xs.concat(xs.map(x => !x)).map(x => (x ? div : mul)))

describe("unit conversions", () => {
  describe("property tests", () => {
    test("safe to divide / multiply by 1000", () => {
      fc.assert(
        fc.property(balancedArray, fc.float(), (fs, n) => {
          const out = Mn.concatAll(M)(fs)(n)
          expect(out).toBe(n)
        }),
        { numRuns: 1000 }
      )
    })
    xtest("mbToGb then gbToMb should be round trip", () => {
      fc.assert(
        fc.property(fc.float(), n => {
          const x: _.UnitAmount = { quantity: n, tag: "gb" }

          expect(_.pbToGb(_.gbToPb(x))).toEqual(x)
        }),
        { numRuns: 500_000 }
      )
    })
  })
})
