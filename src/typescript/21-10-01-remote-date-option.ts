// import { O, pipe, RD } from "./ssstuff/fp-ts-imports"

// const someOption: O.Option<number> = O.none

// type AppError =
//   | {
//       readonly tag: "FooNotFound"
//     }
//   | {
//       readonly tag: "FailedToFetch"
//     }

// const fooNotFound: AppError = {
//   tag: "FooNotFound",
// }

// const failedToFetch: AppError = {
//   tag: "FailedToFetch",
// }

// pipe(
//   RD.Do,
//   RD.apS("bar", RD.pending),
//   RD.apSW(
//     "foo",
//     RD.fromOption(someOption, () => fooNotFound)
//   ),
// ) //?
