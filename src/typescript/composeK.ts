import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option"
import Option = O.Option

type A = "A"
type B = "B"
type C = "C"
type D = "D"

declare const f: (x: A) => Option<B>
declare const g: (x: B) => Option<C>
declare const h: (x: C) => Option<D>

// (f >=> g) >=> h
// \x -> f x >>= g >>= h
const foo1 = (x: A): Option<D> =>
  pipe(x, f, O.chain(g), O.chain(h))

// f >=> (g >=> h)
// \x -> f x >>= \y -> g y >>= h
const foo2 = (x: A): Option<D> =>
  pipe(x, f, O.chain(y => pipe(y, g, O.chain(h))))
