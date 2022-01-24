import { constant, flow, pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import * as ReadonlyArray from "fp-ts/ReadonlyArray"
import * as Task from "fp-ts/Task"
import * as TaskEither from "fp-ts/TaskEither"
import * as T from "monocle-ts/Traversal"
import * as Opt from "monocle-ts/Optional"
import * as Pr from "monocle-ts/Prism"
import { Eq, N, RA } from "./ssstuff/fp-ts-imports"

const one = O.some([1, 2])
const other = O.some([2, 3])

const Monoid = O.getMonoid(RA.getMonoid<number>())
// const Monoid = O.getMonoid(
//   RA.getUnionSemigroup<number>(N.Eq)
// )

console.log(Monoid.concat(one, O.none))
console.log(Monoid.concat(one, other))
console.log(Monoid.concat(O.none, other))
console.log(Monoid.concat(O.none, O.none))

// const result = pipe(
//   [one, other],
//   concatOptionArrays,
// );
