import { pipe } from "fp-ts/function";
import { reader as R } from "fp-ts";

function getXFromIndex(i: number): number {
  return (i + 1) / 19;
}

function getYFromIndex(i: number): number {
  return (i % 19) + 1;
}

const getPairFromIndex = pipe(
  R.Do,
  R.apSW("x", getXFromIndex),
  R.apSW("y", getYFromIndex),
  R.map(({ x, y }) => [x, y]),
);

console.log(getPairFromIndex(1)); //?

const fromIndex: (fns: ((a: number) => number)[]) => (i: number) => readonly number[] = R.sequenceArray;

const result = R.sequenceArray([getXFromIndex, getYFromIndex])(1);
console.log(result); //?

// const fromIndex_: (fns: ((a: number) => number)[]) => (i: number) => readonly number[] = R.sequenceArray;

// function fromIndex_(
//   fns: ((a: number) => number)[],
// ): (i: number) => readonly number[] {
//   return;
// }
