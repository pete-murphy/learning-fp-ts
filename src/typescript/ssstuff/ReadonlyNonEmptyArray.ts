import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import * as RA from "fp-ts/ReadonlyArray"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"

export * from "fp-ts/ReadonlyNonEmptyArray"

const flooredDivision = (x: number, y: number) =>
  x - y * Math.floor(x / y)

const xs = RNEA.range(-5, 5)

console.log(xs.map(x => flooredDivision(x, 3)))
console.log(xs.map(x => x % 3))

/**
 * Like {@link RNEA.lookup} but indexing "wraps around" in the case that the
 * index is out of bounds (and so is guaranteed to return an `A` from a
 * `ReadonlyNonEmptyArray<A>`)
 *
 * @example
 * const xs: RNEA.ReadonlyNonEmptyArray<string> = ['foo', 'bar', 'baz']
 *
 * lookupMod(1)(xs)  //-> 'bar'
 * lookupMod(5)(xs)  //-> 'baz'
 * lookupMod(-3)(xs) //-> 'foo'
 */
export const lookupMod =
  (i: number) =>
  <A>(xs: RNEA.ReadonlyNonEmptyArray<A>): A =>
    pipe(
      xs,
      RA.lookup(flooredDivision(i, xs.length)),
      O.getOrElse(() => RNEA.head(xs))
    )
