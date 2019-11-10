import { pipe } from "fp-ts/lib/pipeable";
import { flow } from "fp-ts/lib/function";
import { reader } from "fp-ts/lib/Reader";

const mul = (x: number) => (y: number) => x * y;
const add = (x: number) => (y: number) => x + y;

// These are all the same(?)
const foo: (a: number) => number = a => add(1)(mul(2)(a));
const bar: (a: number) => number = x =>
  pipe(
    x,
    mul(2),
    add(1)
  );
const baz: (a: number) => number = flow(
  mul(2),
  add(10)
);
const quux: (a: number) => number = reader.compose(
  add(10),
  mul(2)
);

foo(3); //?
bar(3); //?
baz(3); //?
quux(3); //?

// reader.compose(
//   x => x + 1,
//   x => x * 2
// )(3); //?

// flow();
