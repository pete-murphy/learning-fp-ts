import * as O from "fp-ts/lib/Option"
import * as RA from "fp-ts/lib/ReadonlyArray"
import { pipe } from "fp-ts/lib/function"
import { RNEA } from "./lib/fp-ts-imports"

declare function isString(x: unknown): x is string
declare const foo: unknown

export function fromGuard<A>(
  guard: (x: unknown) => x is A
) {
  return (x: unknown): O.Option<A> =>
    guard(x) ? O.some(x) : O.none
}

const baz = pipe(
  [""] as ReadonlyArray<string>,
  O.fromPredicate(RA.isNonEmpty)
)

// const bax = pipe([""], fromGuard(RA.isNonEmpty))

const bar = pipe(foo, O.fromPredicate(isString))

const xs: Array<string> = []
const ys: ReadonlyArray<string> = []

pipe(xs, RNEA.fromReadonlyArray)
pipe(ys, RNEA.fromReadonlyArray)
