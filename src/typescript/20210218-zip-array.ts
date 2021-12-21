// Looks like sequenceT(A.Applicative) does a cartesian product - is there
// anything more like a lodash's variadic zip?

import * as RA from "fp-ts/ReadonlyArray"
import * as Ap from "fp-ts/Apply"
import * as Fld from "fp-ts/Foldable"
import * as Sg from "fp-ts/Semigroup"
import { identity } from "lodash"
import { flow, pipe } from "fp-ts/lib/function"

const ZipApply: Ap.Apply1<RA.URI> = {
  URI: RA.URI,
  map: RA.Functor.map,
  ap: (fab, fa) => RA.zipWith(fab, fa, (f, a) => f(a)),
}
// ap: (fab, fa) => RA.zipWith(fab, fa, (ab, a) => ab(a)),

const example = Ap.sequenceT(ZipApply)([1, 2, 3], [4, 5, 6], [7, 8, 9])

console.log(example)
//-> [ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ] ]

// pipe(
//   RA.Do,

// )
pipe(
  // Fld.foldMap

  Ap.getApplySemigroup(ZipApply)(RA.getSemigroup<number>()).concat(
    [[1, 2, 3], [4]],
    [[4, 5, 6], [5]]
  )
) //?

// //* The law of identity
// //  `∀x. pure id <*> x = x`
console.log(ZipApply.ap(RA.of(identity), [1]))
//* The law of composition
//  `∀u v w. pure (.) <*> u <*> v <*> w = u <*> (v <*> w)`
const u = [identity, identity]
const v = [identity, identity]
const w = [1, 1]
console.log(
  pipe(
    Ap.sequenceT(ZipApply)(RA.of(flow), u, v, w),
    RA.map(([_flow, f, g, x]) => pipe(x, _flow(f, g)))
  )
) //-> [1]
console.log(pipe(ZipApply.ap(v, w), fa => ZipApply.ap(u, fa))) //-> [1,1]
/** Compare to RA */
console.log(
  pipe(
    Ap.sequenceT(RA.Applicative)(RA.of(flow), u, v, w),
    RA.map(([_flow, f, g, x]) => pipe(x, _flow(f, g)))
  )
) //->  [ 1, 1, 1, 1, 1, 1, 1, 1 ]
console.log(pipe(RA.Applicative.ap(v, w), fa => RA.Applicative.ap(u, fa))) //->  [ 1, 1, 1, 1, 1, 1, 1, 1 ]
// //* The law of homomorphism
// //  `∀f x. pure f <*> pure x = pure (f x)`
// //* The law of interchange
// //  `∀u y. u <*> pure y = pure ($ y) <*> u`
