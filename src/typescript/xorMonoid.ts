import * as S from "fp-ts/lib/Set"
import { Eq } from "fp-ts/lib/Eq"
import { Monoid } from "fp-ts/lib/Monoid"

const getXorMonoid = <A>(E: Eq<A>): Monoid<Set<A>> => ({
  empty: S.empty,
  concat: (as: Set<A>, bs: Set<A>) =>
    S.difference(E)(
      S.union(E)(as, bs),
      S.intersection(E)(as, bs)
    ),
})
