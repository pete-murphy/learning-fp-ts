import { URIS, Kind, HKT, Kind2, URIS2, HKT2, HKT3 } from "fp-ts/lib/HKT"
import {
  Foldable1,
  Foldable,
  Foldable2,
  FoldableComposition,
  FoldableComposition11,
  FoldableComposition12,
  FoldableComposition21,
  FoldableComposition22,
} from "fp-ts/lib/Foldable"
import { monoidAny, monoidAll } from "fp-ts/lib/Monoid"
import { identity, Predicate } from "fp-ts/lib/function"

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
          throw b
        } else {
          return acc
        }
      })
    } catch (_) {
      return true
    }
    return false
  }
}

export function and<F extends URIS2, G extends URIS2>(
  F: FoldableComposition22<F, G>
): <E, A>(fa: HKT3<FoldableComposition22<F, G>, E, A, boolean>) => boolean
export function and<F extends URIS2, G extends URIS>(
  F: FoldableComposition21<F, G>
): <E>(fa: HKT2<FoldableComposition21<F, G>, E, boolean>) => boolean
export function and<F extends URIS, G extends URIS2>(
  F: FoldableComposition12<F, G>
): <E>(fa: HKT2<FoldableComposition12<F, G>, E, boolean>) => boolean
export function and<F extends URIS, G extends URIS>(
  F: FoldableComposition11<F, G>
): (fa: HKT<FoldableComposition11<F, G>, boolean>) => boolean

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

// export function any<F extends URIS2>(
//   F: Foldable2<F>
// ): <E>(fa: Kind2<F, E, boolean>) => boolean
// export function any<F extends URIS>(
//   F: Foldable1<F>
// ): (fa: Kind<F, boolean>) => boolean

export function any<F>(
  F: Foldable<F>
): <A>(pred: Predicate<A>, fa: HKT<F, A>) => boolean {
  return (pred, fa) => F.foldMap(monoidAny)(fa, pred)
}

// export function any_<F extends URIS2>(
//   F: Foldable2<F>
// ): <E>(fa: Kind2<F, E, boolean>) => boolean
// ): <A>(pred: Predicate<A>, fa: HKT<F, A>) => boolean
// export function any_<F extends URIS>(
//   F: Foldable1<F>
// ): <A>(pred: Predicate<A>, fa: HKT<F, A>) => boolean

export function any_<F extends URIS2>(
  F: Foldable<F>
): <E, A>(pred: Predicate<A>, fa: Kind2<F, E, A>) => boolean

export function any_<F extends URIS>(
  F: Foldable<F>
): <A>(pred: Predicate<A>, fa: Kind<F, A>) => boolean

export function any_<F>(
  F: Foldable<F>
): <A>(pred: Predicate<A>, fa: HKT<F, A>) => boolean {
  return (pred, fa) => {
    try {
      F.reduce(fa, false, (_, b) => {
        if (pred(b)) {
          throw ""
        } else {
          return false
        }
      })
    } catch (_) {
      return true
    }
    return false
  }
}
