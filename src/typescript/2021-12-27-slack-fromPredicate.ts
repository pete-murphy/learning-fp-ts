import { Applicative } from "fp-ts/Applicative"
import { HKT } from "fp-ts/HKT"
import * as RA from "fp-ts/ReadonlyArray"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import { pipe } from "fp-ts/function"
import * as T from "monocle-ts/Traversal"
import * as O from "fp-ts/Option"
import { Refinement } from "fp-ts/lib/Refinement"
import { Predicate } from "fp-ts/lib/Predicate"

const ex1 = pipe([""], O.fromPredicate(RA.isNonEmpty))

const ex2 = O.fromPredicate(RA.isNonEmpty)([""])

export declare function fromPredicate<A, B extends A>(
  refinement: Refinement<A, B>
): (a: A) => O.Option<B>
export declare function fromPredicate<A>(
  predicate: Predicate<A>
): <B extends A>(b: B) => O.Option<B>
export declare function fromPredicate<A>(
  predicate: Predicate<A>
): (a: A) => O.Option<A>

type Hmm<A, B> = B extends A ? "Yep" : "No"

type ReadonlyArrayExtendsArray = Hmm<
  Array<number>,
  ReadonlyArray<number>
>

// type Y<A> = Hmm<
//   Array<A>,
//   RNEA.ReadonlyNonEmptyArray<A>
// >
