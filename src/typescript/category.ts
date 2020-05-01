import { flow } from "fp-ts/lib/function"

const compose = <A, B, C>(g: (b: B) => C, f: (a: A) => B) =>
  flow(f, g)

const length = <A>(xs: Array<A>): number => xs.length
const even = (n: number): boolean => n % 2 === 0
const not = (b: boolean): boolean => !b

const comp1 = flow(length, even, not)

const comp2 = flow(flow(length, even), not)

const comp3 = flow(length, flow(even, not))

const arr = [1, 2, 3]

comp1(arr)
