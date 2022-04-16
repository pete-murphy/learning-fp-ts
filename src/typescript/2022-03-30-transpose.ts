import { Apply1 } from "fp-ts/lib/Apply"
import {
  Ap,
  Mn,
  N,
  pipe,
  RA,
  RR as R,
  RNEA,
  O,
  flow,
  RR
} from "./lib/fp-ts-imports"

const input: RNEA.ReadonlyNonEmptyArray<
  ReadonlyArray<number>
> = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7]
]

const ZipApply: Apply1<RA.URI> = {
  URI: RA.URI,
  map: RA.Functor.map,
  ap: (fab, fa) => RA.zipWith(fab, fa, (f, a) => f(a))
}

Ap.sequenceT(ZipApply)(input[0], ...input.slice(1)) //?

// import * as Mn from 'fp-ts/Monoid'
// import * as N from 'fp-ts/number'
// import * as RA from "fp-ts/ReadonlyArray"

// const ns = [1, 2, 3]

// pipe(ns, RA.reduce(0, (a, b) => a + b))

R.getMonoid(N.SemigroupSum).concat({ a: 1 }, { a: 2 }) //?
R.getMonoid(N.SemigroupSum).concat({ a: 1 }, { b: 2 }) //?

Mn.concatAll(R.getMonoid(N.SemigroupSum))([])

type Input = O.Option<{
  a: O.Option<string>
  b: O.Option<string>
}>
type Output = O.Option<{ a: string; b: string }>

const f: (_: Input) => Output = O.chain(({ a, b }) =>
  pipe(O.Do, O.apS("a", a), O.apS("b", b))
)

const f_: (_: Input) => Output = O.chain(
  Ap.sequenceS(O.Apply)
)

// const f__: (_: Input) => Output = O.traverse(O.Applicative)
