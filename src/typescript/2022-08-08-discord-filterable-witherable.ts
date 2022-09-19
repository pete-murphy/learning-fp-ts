import {
  either as E,
  these as Th,
  task as T,
  taskEither as TE,
  readonlyArray as RA
} from "fp-ts"
import { flow, pipe, tuple } from "fp-ts/function"
import { Str } from "./lib/fp-ts-imports"

const validateNum: (
  num: number
) => TE.TaskEither<string, number> =
  TE.fromPredicate(
    n => n % 2 === 0,
    n => `${n} must be even`
  )

pipe(
  [1, 2, 3],
  TE.traverseArray(validateNum)
)().then(console.log)

pipe(
  [1, 2, 3],
  RA.wilt(T.ApplicativePar)(validateNum)
)().then(console.log)

// pipe(
//   [1, 2, 3],
//   T.traverseArray(validateNum),
//   T.map(RA.)
// )().then(console.log)
// // pipe([1, 2, 3], E.getWitherable(Str.Monoid).partitionMap  (validateNum))().then(console.log) //?

// const validateNum: (
//   num: number
// ) => TE.TaskEither<string, number> = flow(
//   TE.fromPredicate(
//     n => n % 2 === 0,
//     n => `${n} must be even\n`
//   ),
//   TE.chain(
//     TE.fromPredicate(
//       n => n < 10,
//       n => `${n} must be less than 10\n`
//     )
//   )
// )
