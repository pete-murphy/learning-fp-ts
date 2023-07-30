const a = { foo: 1, bar: "asdf" };
const b = { foo: 1, bar: "asdf" };

a === b; //-> returns "false"

import { eq as Eq, number as N, string as Str } from "fp-ts";

const myEq = Eq.struct({ foo: N.Eq, bar: Str.Eq });
myEq.equals(a, b); //-> returns "true"

// import { compose, curry, some } from "lodash/fp";

// export const reduce = <T, U>(
//   f: (acc: U, x: T) => U,
//   initialAcc: U,
// ): ((arr: T[]) => U) => {
//   return (arr: T[]): U => {
//     return arr.reduce(f, initialAcc);
//   };
// };

// export const pipe = <X>(...args: ((x: X) => X)[]): ((input: X) => X) => {
//   return (input: X) => {
//     return reduce((acc, f: (a: X) => X) => {
//       return f(acc)
//     }, input)(args)
//   }
// }

// const foo = <A>(f: (a:A) => string) => (a: A): string => f(a)

// foo((bool: boolean) => bool.toString())(9)

// // pipe(
// //   filter((x) => {
// //     return x.active === true
// //   }),
// // )(markets)

// // export const pipe = <I, A, B>(...args: ((a: A) => B)[]) => {
// //   return (input: I) => {
// //     return reduce((acc, f: (a: A) => B) => {
// //       return f(acc); // <-- Error here
// //     }, input)(args);
// //   };
// // };

// // export const pipe = <A>(...args: ((a: A) => A)[]) => {
// //   return (input: A) => {
// //     return reduce((acc, f: (a: A) => A) => {
// //       return f(acc);
// //     }, input)(args);
// //   };
// // };

// // export const intersectionWith =
// //   <T, U>(comparator: (x: T, y: U) => boolean) =>
// //   (xs: T[]) =>
// //   (ys: U[]) => {
// //     return filter(flipCurried(compose(curry(comparator), some))(ys))(xs);
// //   };
