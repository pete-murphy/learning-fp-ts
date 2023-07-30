// I want to create an Eq  for some Thing with an optional property.  Is it possible to do that? This is what I have tried so far:
// type Thing = { a: string; b?: string };

// const eqThing = Eq.struct<Thing>({
//   a: S.Eq,
//   b: S.Eq // Type 'Eq<string>' is not assignable to type 'Eq<string | undefined>'.
// });

// eqThing.equals({ a: "a", b: "b" }, { a: "a" }); // false

import { eq as Eq } from "fp-ts";

type Thing = { a: string; b?: string };

type OrUndefined<A> = A extends undefined ? never : A | undefined;
const getOrUndefinedEq = <A>(EqA: Eq.Eq<A>): Eq.Eq<OrUndefined<A>> => ({
  equals: (x, y) =>
    x === undefined ? y === undefined : y !== undefined && EqA.equals(x, y),
});
