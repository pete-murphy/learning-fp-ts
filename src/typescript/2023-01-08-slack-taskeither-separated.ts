import { separated as Sep, taskEither as TE, readonlyArray as RA } from "fp-ts";
import { pipe } from "fp-ts/function";

const evenTE = (n: number): TE.TaskEither<Error, number> =>
  n % 2 === 0 ? TE.of(n) : TE.of(n);

// pipe(
//   [1,2,3],
//   RA.wilt(TE.ApplicativePar)(n => n % 2 === 0 ? TE.of(1))
// )

const x: [3] = [3];
x.pop();

// import { matchSI } from "@simspace/matchers";
// import { E } from "./lib/fp-ts-imports";

// type Method = "OP" | "OP-ML" | "OP-G";

// // const displayMethod: (method: Method) => string = matchSI({
// //   OP: () => "op",
// //   'OP': () => "op",
// // });

// // E.toError

// // const methodLookup: Record<Method, string> = {
// //   "OP": "op",
// //   "OP-ML": "op-ml",
// //   "OP-G": "op-g",
// // }
