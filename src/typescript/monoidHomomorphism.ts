import { HKT } from "fp-ts/lib/HKT"
import { Functor } from "fp-ts/lib/Functor"

const map: <F, A, B>(
  F: Functor<F>,
  fa: HKT<F, A>,
  f: (a: A) => B
) => HKT<F, B> = (F, fa, f) => F.map(fa, f)
