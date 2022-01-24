import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"

// --------------------------------------
// Some things you can't do with `reduce`
// --------------------------------------

// Can't generate data: there's no `f` I can
// put here that will produce a non-empty array

// const emptyArray: ReadonlyArray<number> = []

// const f = (acc: ReadonlyArray<number>, x: number) => [
//   1, 2, 3, 4
// ]
// emptyArray.reduce<ReadonlyArray<number>>(f, [])

// Can't short-circuit: `reduce` will always
// visit all elements of input array

const smallArray = RNEA.range(0, 10)
const largeArray = RNEA.range(0, 10_000_000)

console.time("Small array reduce")
console.log(
  smallArray.reduce((acc, x) => x > 5 || acc, false)
)
console.timeEnd("Small array reduce")

console.time("Large array reduce")
console.log(
  largeArray.reduce((acc, x) => x > 5 || acc, false)
)
console.timeEnd("Large array reduce")

// [
//   () => 1,
//   () => 2,
//   () => {
//     throw Error;
//   }
// ].reduce((acc, x) => x() > 1 || acc, false);

// [
//   () => 1,
//   () => 2,
//   () => {
//     throw Error;
//   }
// ].reduce((acc, x) => acc || x() > 1, false);
