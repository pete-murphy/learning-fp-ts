import { Profunctor } from "fp-ts/lib/Profunctor"

type Arrow<A, B> = (a: A) => B

// Not sure how to do
const getProfunctorArrow: Profunctor<Arrow> = {
  promap: <C, D>(f: Arrow<A, B>, g: (b: B) => D, h: (c: C) => A) => (c_: C) =>
    g(f(h(c_))),
}
