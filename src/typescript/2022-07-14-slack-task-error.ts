import { either, task, taskEither } from "fp-ts"
import { pipe } from "fp-ts/lib/function"
import { Response } from "node-fetch"

/** Construct an error from the response body */
const makeError =
  (res: Response): task.Task<Error> =>
  async () =>
    new Error(await res.text())

/** Check if the response status is OK, and construct an Error if not */
declare const fetchResponse: taskEither.TaskEither<
  Error,
  Response
>
const x: taskEither.TaskEither<Error, Response> = pipe(
  fetchResponse,
  taskEither.matchE(
    taskEither.throwError, // "Re-throw" existing error
    res =>
      res.ok
        ? taskEither.of(res)
        : pipe(res, makeError, task.map(either.throwError))
  )
)
