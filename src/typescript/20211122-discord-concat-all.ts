import * as Mn from "fp-ts/Monoid"
import * as N from "fp-ts/number"

const sum = Mn.concatAll(N.MonoidSum)

sum([1, 2, 3]) //?
sum([]) //?

// export const sumWithoutStartWith = (input: number[]) =>
//   pipe(
//     input,
//     head,
//     match(
//       () => 0,
//       (h) =>
//         pipe(
//           input,
//           tail,
//           match(
//             () => h,
//             (t) => sum(h)(t)
//           )
//         )
//     )
//   );
