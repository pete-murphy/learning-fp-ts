import * as C from "fp-ts/Const"
import { pipe, tuple } from "fp-ts/function"
import * as RA from "fp-ts/ReadonlyArray"
import * as N from "fp-ts/number"
import * as Apl from "fp-ts/Applicative"
import * as Ap from "fp-ts/Apply"
import * as St from "fp-ts/State"
import * as O from "fp-ts/Option"
import * as E from "fp-ts/Either"

// const getApplicative = <A>() => C.getApplicative(RA.getMonoid<A>())
// const Applicative = C.getApplicative(RA.getMonoid())

const Apply = Apl.getApplicativeComposition(O.Applicative, St.Applicative)

const reassembleBody =
  <A>(): St.State<ReadonlyArray<A>, O.Option<A>> =>
  (xs: ReadonlyArray<A>) =>
    tuple(RA.head(xs), RA.dropLeft(1)(xs))

const reassemble = RA.traverse({ ...Apply, URI: "DF" })(reassembleBody)

// const x: C.Const<number, ReadonlyArray<number>> = pipe(
//   [1, 2, 3],
//   RA.traverse(Applicative)(C.make)
// ) //?

const contentsBody = <A, B>(x: A): C.Const<ReadonlyArray<A>, B> => C.make([x])

const contents = RA.traverse(getApplicative())(contentsBody)
// RA.traverse(Applicative)(contentsBody)
//?

export {}
