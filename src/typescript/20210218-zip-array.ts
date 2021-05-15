// Looks like sequenceT(A.Applicative) does a cartesian product - is there
// anything more like a lodash's variadic zip?

import * as RA from "fp-ts/ReadonlyArray"
import { Apply1, sequenceT } from "fp-ts/Apply"
import { identity } from "lodash"
import { flow, pipe } from "fp-ts/lib/function"

export const ApplyZippy: Apply1<RA.URI> = {
  ...RA.readonlyArray,
  ap: (fab, fa) => RA.zipWith(fab, fa, (ab, a) => ab(a)),
}

const example = sequenceT(ApplyZippy)([1, 2, 3], [4, 5, 6], [7, 8, 9])

console.log(example)
//-> [ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ] ]

// //* The law of identity
// //  `∀x. pure id <*> x = x`
console.log(ApplyZippy.ap(RA.of(identity), [1]))
//* The law of composition
//  `∀u v w. pure (.) <*> u <*> v <*> w = u <*> (v <*> w)`
const u = [identity, identity]
const v = [identity, identity]
const w = [1, 1]
console.log(
  pipe(
    sequenceT(ApplyZippy)(RA.of(flow), u, v, w),
    RA.map(([_flow, f, g, x]) => pipe(x, _flow(f, g)))
  )
) //-> [1]
console.log(pipe(ApplyZippy.ap(v, w), fa => ApplyZippy.ap(u, fa))) //-> [1,1]
/** Compare to RA */
console.log(
  pipe(
    sequenceT(RA.Applicative)(RA.of(flow), u, v, w),
    RA.map(([_flow, f, g, x]) => pipe(x, _flow(f, g)))
  )
) //->  [ 1, 1, 1, 1, 1, 1, 1, 1 ]
console.log(pipe(RA.Applicative.ap(v, w), fa => RA.Applicative.ap(u, fa))) //->  [ 1, 1, 1, 1, 1, 1, 1, 1 ]
// //* The law of homomorphism
// //  `∀f x. pure f <*> pure x = pure (f x)`
// //* The law of interchange
// //  `∀u y. u <*> pure y = pure ($ y) <*> u`
