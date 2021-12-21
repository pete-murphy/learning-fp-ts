import {
  Applicative,
  Applicative1,
  Applicative2,
  Applicative2C,
  Applicative3,
  Applicative3C,
  Applicative4,
} from "fp-ts/lib/Applicative"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from "fp-ts/lib/HKT"
import { Ord } from "fp-ts/lib/Ord"

export * from "fp-ts/lib/Either"

// /**
//  * type guard for Either
//  */
// export const isEither = (x: unknown): x is E.Either<unknown, unknown> => {
//   if (!isNil(x)) {
//     const x_ = x as {
//       left?: unknown
//       right?: unknown
//       _tag?: unknown
//     }
//     return (
//       !isNil(x_.right) ||
//       (!isNil(x_.left) &&
//         ((!isNil(x_._tag) && x_._tag === 'Left') || x_._tag === 'Right'))
//     )
//   }
//   return false
// }

/**
 * Derives an `Ord` instance for `Either<A, B>` given an `Ord<A>` and an
 * `Ord<B>`.
 */
export const getOrd = <A, B>(
  ordA: Ord<A>,
  ordB: Ord<B>
): Ord<E.Either<A, B>> => ({
  equals: (x, y) =>
    E.isLeft(x) && E.isLeft(y)
      ? ordA.equals(x.left, y.left)
      : E.isRight(x) && E.isRight(y)
      ? ordB.equals(x.right, y.right)
      : false,
  compare: (x, y) =>
    E.isLeft(x) && E.isLeft(y)
      ? ordA.compare(x.left, y.left)
      : E.isRight(x) && E.isRight(y)
      ? ordB.compare(x.right, y.right)
      : E.isLeft(x) && E.isRight(y)
      ? -1
      : 1,
})

/**
 * Variant of sequence operating on `left` and `right`
 */
export function bisequence<F extends URIS4>(
  F: Applicative4<F>
): <FS, FR, FE, E, A>(
  ma: E.Either<Kind4<F, FS, FR, FE, E>, Kind4<F, FS, FR, FE, A>>
) => Kind4<F, FS, FR, FE, E.Either<E, A>>
export function bisequence<F extends URIS3>(
  F: Applicative3<F>
): <FR, FE, E, A>(
  ma: E.Either<Kind3<F, FR, FE, E>, Kind3<F, FR, FE, A>>
) => Kind3<F, FR, FE, E.Either<E, A>>
export function bisequence<F extends URIS3, FE>(
  F: Applicative3C<F, FE>
): <FR, E, A>(
  ma: E.Either<Kind3<F, FR, FE, E>, Kind3<F, FR, FE, A>>
) => Kind3<F, FR, FE, E.Either<E, A>>
export function bisequence<F extends URIS2>(
  F: Applicative2<F>
): <FE, E, A>(
  ma: E.Either<Kind2<F, FE, E>, Kind2<F, FE, A>>
) => Kind2<F, FE, E.Either<E, A>>
export function bisequence<F extends URIS2, FE>(
  F: Applicative2C<F, FE>
): <E, A>(
  ma: E.Either<Kind2<F, FE, E>, Kind2<F, FE, A>>
) => Kind2<F, FE, E.Either<E, A>>
export function bisequence<F extends URIS>(
  F: Applicative1<F>
): <E, A>(ma: E.Either<Kind<F, E>, Kind<F, A>>) => Kind<F, E.Either<E, A>>
export function bisequence<F>(F: Applicative<F>) {
  return <E, A>(ma: E.Either<HKT<F, E>, HKT<F, A>>): HKT<F, E.Either<E, A>> =>
    pipe(
      ma,
      E.fold(
        left => F.map<E, E.Either<E, A>>(left, E.left),
        right => F.map<A, E.Either<E, A>>(right, E.right)
      )
    )
}

pipe(E.left(E.right(1)), bisequence(E.Applicative)) //?
