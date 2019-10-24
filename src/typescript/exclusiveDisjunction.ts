import { union, difference, intersection } from "fp-ts/lib/Array";
import { eqString, eqNumber, Eq } from "fp-ts/lib/Eq";
import { sequenceT, sequenceS } from "fp-ts/lib/Apply";
import { reader, Reader, ask, ap } from "fp-ts/lib/Reader";
import { option, some } from "fp-ts/lib/Option";

// const xor = (xs: Array<string>, ys: Array<string>) =>
//   difference(eqString)(union(eqString)(xs, ys), intersection(eqString)(xs, ys));

export const xor = <A>(E: Eq<A>) => (xs: Array<A>, ys: Array<A>) => [
  ...difference(E)(xs, ys),
  ...difference(E)(ys, xs)
];

export const xor0 = <A>(E: Eq<A>) => (xs: Array<A>, ys: Array<A>) =>
  difference(E)(union(E)(xs, ys), intersection(E)(xs, ys));

// export const xor1 = <A>(E: Eq<A>) => (xs: Array<A>, ys: Array<A>) =>
//   sequenceT(reader)(union(E), intersection(E));

sequenceT(option)(some(1), some(2)); //?

sequenceT(reader)((x: number) => x + 1, (x: number) => x + 2)(2);
// sequenceT<Reader<number>>(reader)(
//   (x: number) => x + 1,
//   (x: number) => x + 2
// )(2);

const foo: Reader<number, (n: number) => number> = reader.of(
  (n: number) => n + 1
);

const baz = ap(foo(9))(_n => foo)(4)(2); //?

// difference(E)(union(E)(xs, ys), intersection(E)(xs, ys));

// xor(["a", "b", "c"], ["b"]); //?
// xor(["a", "b", "c"], ["c", "d"]); //?
// xor(["a", "b"], ["c", "d"]); //?

difference(eqString)(["a", "b"], ["d"]); //?

// const ys = [1]
// const xs = [4]

// union(eqNumber)(difference(eqNumber)(xs, ys), difference(eqNumber)(ys, xs)) //?

// ;([...difference(eqNumber)(xs, ys), ...difference(eqNumber)(ys, xs)]) //?

const numXor = xor(eqNumber);
numXor(numXor([1, 2], [1]), [1]); //?
numXor([1, 2], numXor([1], [1])); //?

const mod = (x: number, y: number) => x - y * Math.floor(x / y);

mod(-52323, -51); //?

// const mod_ = (x:number, y:number) => x - y * Math.floor(x / y)
// mod_()
