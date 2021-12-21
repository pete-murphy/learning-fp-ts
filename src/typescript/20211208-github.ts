import { constant, flow, pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/Option"
import * as ReadonlyArray from "fp-ts/ReadonlyArray"
import * as Task from "fp-ts/Task"
import * as TaskEither from "fp-ts/TaskEither"
import * as T from "monocle-ts/Traversal"
import * as Opt from "monocle-ts/Optional"
import * as Pr from "monocle-ts/Prism"

type UserPreferences = {}
declare const getUserPreferences: (
  user: string
) => TaskEither.TaskEither<Error, UserPreferences>
const validAndInvalidUserIds: ReadonlyArray<string> = []

const result = pipe(
  validAndInvalidUserIds,
  // notice how in the following line we use Task instead of TaskEither
  // ReadonlyArray.traverse(Task.ApplicativeSeq)(getUserPreferences), // this gives a Task<Either[]>
  ReadonlyArray.wither(Task.ApplicativeSeq)(
    flow(getUserPreferences, Task.map(O.fromEither))
  )
  // next two lines allow to get all values from Eithers that are Right
  // Task.map(ReadonlyArray.separate),
  // Task.map(({ right }) => right)
)
// result is Task<UserPreferences[]>
