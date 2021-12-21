import * as TO from "fp-ts/TaskOption"
import * as O from "fp-ts/Option"
import * as T from "fp-ts/Task"
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

const f = async () => {
  const task = apiKey ? await api.task.getWithSub(apiKey, taskID) : undefined
}

const task: TO.TaskOption<ClickupTask> = pipe(
  apiKey,
  O.fromNullable,
  O.traverse(TO.ApplicativePar)(apiKey_ =>
    pipe(() => api.task.getWithSub(apiKey_, taskID), T.map(O.fromNullable))
  )
)
