import * as RA from "fp-ts/ReadonlyArray"
import { Apply1, sequenceT } from "fp-ts/Apply"
import { identity } from "lodash"
import { flow, pipe } from "fp-ts/lib/function"

const ApplyZippy: Apply1<RA.URI> = {
  ...RA.Apply,
  ap: (fab, fa) => RA.zipWith(fab, fa, (ab, a) => ab(a)),
}

const example = sequenceT(ApplyZippy)([1, 2, 3], [4, 5, 6], [7, 8, 9])

console.log(example)
//-> [ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ] ]

// //* The law of identity
// //  `∀x. pure id <*> x = x`
// console.log(ApplyZippy.ap(RA.of(identity), [1]))
// //* The law of composition
// //  `∀u v w. pure (.) <*> u <*> v <*> w = u <*> (v <*> w)`
// console.log(pipe(RA.of(flow), x => ApplyZippy.ap(x, RA.of((x: number) => x + 1)))
// //* The law of homomorphism
// //  `∀f x. pure f <*> pure x = pure (f x)`
// //* The law of interchange
// //  `∀u y. u <*> pure y = pure ($ y) <*> u`
