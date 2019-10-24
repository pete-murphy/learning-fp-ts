import { eq, eqString, Eq } from "fp-ts/lib/Eq";

export const uniqBy = <A>(equalityPredicate: (x: A, y: A) => boolean) => (
  xs: Array<A>
): Array<A> =>
  xs.reduce(
    (acc: Array<A>, x) => [...acc.filter(a => !equalityPredicate(a, x)), x],
    []
  );

export const on = <B, C>(f: (x: B, y: B) => C) => <A>(g: (x: A) => B) => (
  x: A,
  y: A
): C => f(g(x), g(y));

type Foo = {
  id: number;
  foo: number;
};
