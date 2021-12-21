import * as fc from "fast-check"
import * as laws from "fp-ts-laws"
import * as N from "fp-ts/Number"
import { Eq, Str } from "./fp-ts-imports"

import * as _ from "./stringGroup"

const arbPNString: fc.Arbitrary<_.PNString> = fc
  // .constantFrom("positive" as const, "negative" as const)
  .constantFrom(_.positive, _.negative)
  .chain(k => fc.string().map(k))

describe("group laws", () => {
  const G = _.groupPNString
  test("associativity", () => {
    fc.assert(
      fc.property(arbPNString, arbPNString, arbPNString, (x, y, z) => {
        const left = G.concat(G.concat(x, y), z)
        const right = G.concat(x, G.concat(y, z))
        expect(left).toEqual(right)
      }),
      {
        numRuns: 1000,
      }
    )
  })
})
