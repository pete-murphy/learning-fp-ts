import { option as O, string as Str, readonlyArray as RA } from "fp-ts";
import { flow, identity } from "fp-ts/function";

// const dropFirstAndLast = flow(
//   Str.split(""),
//   RA.tail,
//   O.chain(RA.init),
//   O.foldMap(Str.Monoid)(RA.foldMap(Str.Monoid)(identity))
// );

const dropFirstAndLast = flow(
  Str.split(""),
  RA.dropLeft(1),
  RA.dropRight(1),
  RA.foldMap(Str.Monoid)(identity)
);

dropFirstAndLast("hello, world"); //?
