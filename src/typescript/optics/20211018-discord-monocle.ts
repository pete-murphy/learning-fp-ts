import * as TO from "fp-ts/TaskOption"
import * as O from "fp-ts/Option"
import * as RA from "fp-ts/ReadonlyArray"
import * as T from "fp-ts/Task"
import * as Tr from "monocle-ts/lib/Traversal"
import * as Pr from "monocle-ts/lib/Prism"
import * as Op from "monocle-ts/lib/Optional"
import { pipe } from "fp-ts/function"

type APIKey = string
type TaskID = string
type ClickupTask = {}

declare const api: {
  task: {
    getWithSub: (
      apiKey: APIKey,
      taskID: TaskID
    ) => Promise<ClickupTask | undefined>
  }
}
declare const apiKey: APIKey | undefined
declare const taskID: TaskID

/**
I have this from fp-ts 

const teamReview = pipe(
      task?.subtask,
      fromNullable,
      chain(findFirst(element => element.name == "Team review 2")),
      map(task => new Date(task.due_date))
    )

and I was wondering if I could make the chain(findFirst(element => element.name == "Team review 2")) nicer? 
 */

// type TaskType =
//   | {
//       subtask: ReadonlyArray<{
//         name: string
//         due_date: string
//       }>
//     }
//   | undefined
// declare const task: TaskType

const teamReview = pipe(
  task?.subtask,
  O.fromNullable,
  O.chain(RA.findFirst(element => element.name == "Team review 2")),
  O.map(task => new Date(task.due_date))
)

const dueDateTraversal = pipe(
  Tr.id<TaskType>(),
  Tr.fromNullable,
  Tr.prop("subtask"),
  Tr.findFirst(element => element.name == "Team review 2"),
  Tr.prop("due_date")
)

// const dueDatePrism = pipe(
//   Pr.id<TaskType>(),
//   Pr.fromNullable,
//   Pr.prop("subtask"),
//   Pr.findFirst(element => element.name == "Team review 2"),
//   // Pr.prop("due_date"),
// )

type TaskType =
  | {
      subtask: ReadonlyArray<{
        name: string
        due_date: string
      }>
    }
  | undefined
declare const task: TaskType

const dueDateOptional = pipe(
  Op.id<TaskType>(),
  Op.fromNullable,
  Op.prop("subtask"),
  Op.findFirst(element => element.name == "Team review 2"),
  Op.prop("due_date"),
  Op.modify()
)

pipe(
  task,
  dueDateOptional.getOption,
  O.map(date => new Date(date))
)
