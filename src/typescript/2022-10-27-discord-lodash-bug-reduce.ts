import { map, reduce } from "lodash/fp";

const stuff = [
  [1, 2],
  [3, 4]
];
const r = map(
  reduce((acc: number[], n: number) => {
    acc;
    acc.push(n);
    return acc;
  }, [])
)(stuff);

stuff.map(xs =>
  xs.reduce((acc: number[], n: number) => {
    acc;
    acc.push(n);
    return acc;
  }, [])
);

// const r1 = flatten(r);
r; //?

const f = reduce((acc: number[], x: number) => {
  acc.push(x);
  return acc;
}, []);
const f_ = (xs: number[]) =>
  xs.reduce((acc: number[], x: number) => {
    acc.push(x);
    return acc;
  }, []);
// [[1], [1]].map(f); //?
// map(f)(stuff) //?
stuff.map(f); //?
stuff.map(f_); //?

const f__ = (xs: number[]) =>
  arrayReduce(
    xs,
    (acc: number[], x: number) => {
      acc.push(x);
      return acc;
    },
    [],
    undefined
  );

stuff.map(f__); //?

function arrayReduce(
  array: string | any[] | null,
  iteratee: (arg0: any, arg1: any, arg2: number, arg3: any) => any,
  accumulator: any,
  initAccum: any
) {
  let index = -1;
  const length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array![++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array![index], index, array);
  }
  return accumulator;
}
