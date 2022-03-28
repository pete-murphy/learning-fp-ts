import {
  O,
  pipe,
  RA,
  RNEA,
  TE,
  Mon
} from "./lib/fp-ts-imports"

type User = {}
declare const userGroup1: ReadonlyArray<User>
declare const userGroup2: ReadonlyArray<User>
declare const writeToDb: (
  users: ReadonlyArray<User>
) => TE.TaskEither<Error, {}>
declare const removeFromDb: (
  users: ReadonlyArray<User>
) => TE.TaskEither<Error, {}>

const tasks_ = []
userGroup1.length && tasks_.push(writeToDb(userGroup1))
userGroup2.length && tasks_.push(removeFromDb(userGroup2))
RA.sequence(TE.ApplicativeSeq)(tasks_)()

const tasks = pipe(
  [
    O.map(writeToDb)(RNEA.fromReadonlyArray(userGroup1)),
    O.map(removeFromDb)(RNEA.fromReadonlyArray(userGroup2))
  ],
  RA.compact
)

pipe(Mon.guard)
