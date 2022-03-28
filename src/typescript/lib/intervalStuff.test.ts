import * as fc from "fast-check"
import * as laws from "fp-ts-laws"
import * as N from "fp-ts/Number"

import * as _ from "./intervalStuff"

// const arbitraryFreeSemiring: <A>(
//   arb: fc.Arbitrary<A>,
// ) => fc.Arbitrary<FS.FreeSemiring<A>> = arb =>
//   fc.set(fc.array(arb)).map(xs => new Set(xs))

// describe("Interval Ring", () => {
//   it("should be a lawful Ring", () => {
//     laws.ring(
//       _.getRing(N.Ord, N.Field),
//       _.getOrd(N.Ord),
//       fc
//         .tuple(fc.integer(0, 20), fc.integer(0, 20))
//         .map(([n1, n2]) => _.toInterval(N.Ord)(n1, n2))
//     )
//   })
// })

// describe("Interval Semiing", () => {
//   it("should be a lawful Ring", () => {
//     laws.ring(
//       _.getRing(N.Ord, N.Field),
//       _.getOrd(N.Ord),
//       fc
//         .tuple(fc.integer(0, 20), fc.integer(0, 20))
//         .map(([n1, n2]) => _.toInterval(N.Ord)(n1, n2))
//     )
//   })
// })
