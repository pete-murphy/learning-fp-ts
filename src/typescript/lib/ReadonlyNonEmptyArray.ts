import { pipe } from "fp-ts/function"
import { PipeableTraverse1 } from "fp-ts/lib/Traversable"
import {
  Applicative as ApplicativeHKT,
  Applicative1
} from "fp-ts/lib/Applicative"
import { Apply as ApplyHKT, Apply1 } from "fp-ts/lib/Apply"

import * as O from "fp-ts/Option"
import * as RA from "fp-ts/ReadonlyArray"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import { HKT, Kind, URIS } from "fp-ts/lib/HKT"

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

// export function traverseNonEmpty<M extends URIS3, F extends URIS>(
//   M: Applicative3<M>,
//   F: Foldable1<F>
// ): <R, E, A>(
//   fa: Kind<F, Kind3<M, R, E, A>>
// ) => Kind3<M, R, E, void>
// export function traverseNonEmpty<M extends URIS2, F extends URIS>(
//   M: Applicative2<M>,
//   F: Foldable1<F>
// ): <E, A>(fa: Kind<F, Kind2<M, E, A>>) => Kind2<M, E, void>
// export function traverseNonEmpty<
//   M extends URIS2,
//   F extends URIS,
//   E
// >(
//   M: Applicative2C<M, E>,
//   F: Foldable1<F>
// ): <A>(fa: Kind<F, Kind2<M, E, A>>) => Kind2<M, E, void>
// export function traverseNonEmpty<M extends URIS, F extends URIS>(
//   M: Applicative1<M>,
//   F: Foldable1<F>
// ): <A>(fa: Kind<F, Kind<M, A>>) => Kind<M, void>
// export function traverseNonEmpty<M, F>(
//   M: Applicative<M>,
//   F: Foldable<F>
// ): <A>(fa: HKT<F, HKT<M, A>>) => HKT<M, void>
// export function traverseNonEmpty<M, F>(
//   M: Applicative<M>,
//   F: Foldable<F>
// ): <A>(fa: HKT<F, HKT<M, A>>) => HKT<M, void> {
//   return fa => traverse_(M, F)(fa, identity)
// }

// export const traverse1:
export const traverseNonEmpty = <F extends URIS>(
  F: Apply1<F>
): (<A, B>(
  f: (a: A) => HKT<F, B>
) => (
  as: RNEA.ReadonlyNonEmptyArray<A>
) => Kind<F, RNEA.ReadonlyNonEmptyArray<B>>) => {
  const traverseWithIndexF = RNEA.traverseWithIndex(
    F as Applicative1<F>
  )
  return f => traverseWithIndexF((_, a) => f(a) as any)
}
