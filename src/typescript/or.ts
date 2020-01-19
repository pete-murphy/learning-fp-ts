import { URIS, Kind, HKT, Kind2, URIS2 } from "fp-ts/lib/HKT"
import { Foldable1, Foldable, Foldable2 } from "fp-ts/lib/Foldable"
import { monoidAny, monoidAll } from "fp-ts/lib/Monoid"
import { identity } from "fp-ts/lib/function"

export function or<F extends URIS2>(
  F: Foldable2<F>
): <E>(fa: Kind2<F, E, boolean>) => boolean
export function or<F extends URIS>(
  F: Foldable1<F>
): (fa: Kind<F, boolean>) => boolean
export function or<F>(F: Foldable<F>): (fa: HKT<F, boolean>) => boolean {
  return fa => F.foldMap(monoidAny)(fa, identity)
}

export function or_<F extends URIS2>(
  F: Foldable2<F>
): <E>(fa: Kind2<F, E, boolean>) => boolean
export function or_<F extends URIS>(
  F: Foldable1<F>
): (fa: Kind<F, boolean>) => boolean
export function or_<F>(F: Foldable<F>): (fa: HKT<F, boolean>) => boolean {
  return fa => {
    try {
      F.reduce(fa, false, (acc, b) => {
        if (b) {
          throw ""
        } else {
          return acc
        }
      })
    } catch (_error) {
      return true
    }
    return false
  }
}

export function and<F extends URIS2>(
  F: Foldable2<F>
): <E>(fa: Kind2<F, E, boolean>) => boolean
export function and<F extends URIS>(
  F: Foldable1<F>
): (fa: Kind<F, boolean>) => boolean
export function and<F>(F: Foldable<F>): (fa: HKT<F, boolean>) => boolean {
  return fa => F.foldMap(monoidAll)(fa, identity)
}

export function and_<F extends URIS2>(
  F: Foldable2<F>
): <E>(fa: Kind2<F, E, boolean>) => boolean
export function and_<F extends URIS>(
  F: Foldable1<F>
): (fa: Kind<F, boolean>) => boolean
export function and_<F>(F: Foldable<F>): (fa: HKT<F, boolean>) => boolean {
  return fa => {
    try {
      F.reduce(fa, true, (acc, b) => {
        if (!b) {
          throw ""
        } else {
          return acc
        }
      })
    } catch (_error) {
      return false
    }
    return true
  }
}
