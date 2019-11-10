import * as S from "fp-ts/lib/Set";
import { Eq } from "fp-ts/lib/Eq";

const getXorMonoid = <A>(E: Eq<A>) => ({
  empty: S.empty,
  concat: (as: Set<A>, bs: Set<A>) =>
    S.difference(E)(S.union(E)(as, bs), S.intersection(E)(as, bs))
});
