import {
  Applicative,
  Applicative1,
  Applicative2,
  Applicative2C,
  Applicative3,
} from "fp-ts/lib/Applicative"
import {
  Foldable,
  Foldable1,
  traverse_,
} from "fp-ts/lib/Foldable"
import { identity } from "fp-ts/lib/function"
import {
  HKT,
  Kind,
  Kind2,
  Kind3,
  URIS,
  URIS2,
  URIS3,
} from "fp-ts/lib/HKT"

export function sequence_<M extends URIS3, F extends URIS>(
  M: Applicative3<M>,
  F: Foldable1<F>
): <R, E, A>(
  fa: Kind<F, Kind3<M, R, E, A>>
) => Kind3<M, R, E, void>
export function sequence_<M extends URIS2, F extends URIS>(
  M: Applicative2<M>,
  F: Foldable1<F>
): <E, A>(fa: Kind<F, Kind2<M, E, A>>) => Kind2<M, E, void>
export function sequence_<
  M extends URIS2,
  F extends URIS,
  E
>(
  M: Applicative2C<M, E>,
  F: Foldable1<F>
): <A>(fa: Kind<F, Kind2<M, E, A>>) => Kind2<M, E, void>
export function sequence_<M extends URIS, F extends URIS>(
  M: Applicative1<M>,
  F: Foldable1<F>
): <A>(fa: Kind<F, Kind<M, A>>) => Kind<M, void>
export function sequence_<M, F>(
  M: Applicative<M>,
  F: Foldable<F>
): <A>(fa: HKT<F, HKT<M, A>>) => HKT<M, void> {
  return fa => traverse_(M, F)(fa, identity)
}
