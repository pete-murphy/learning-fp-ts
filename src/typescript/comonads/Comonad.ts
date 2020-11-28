import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/lib/HKT"

export interface Comonad<W> {
  readonly extend: <A, B>(wa: HKT<W, A>, f: (wa: HKT<W, A>) => B) => HKT<W, B>
  readonly extract: <A>(wa: HKT<W, A>) => A
}

export interface Comonad1<W extends URIS> {
  readonly extend: <A, B>(
    wa: Kind<W, A>,
    f: (wa: Kind<W, A>) => B
  ) => Kind<W, B>
  readonly extract: <A>(wa: Kind<W, A>) => A
}

export interface Comonad2<W extends URIS2> {
  readonly extend: <E, A, B>(
    wa: Kind2<W, E, A>,
    f: (wa: Kind2<W, E, A>) => B
  ) => Kind2<W, E, B>
  readonly extract: <E, A>(wa: Kind2<W, E, A>) => A
}
