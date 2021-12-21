import * as A from "fp-ts/Array"
import * as RA from "fp-ts/ReadonlyArray"
import * as E from "fp-ts/Either"
import { flow, pipe, tuple } from "fp-ts/function"
import * as t from "io-ts"
import * as TE from "fp-ts/TaskEither"
import * as T from "fp-ts/Task"

declare const loader: {
  load: (x: {
    client: {}
    currentJob: {}
    jobScheduler: {}
  }) => TE.TaskEither<Error, {}>
}

declare const this_: {
  client: {}
  logger: { info: (s: string, s0: Error) => void }
  updateJob: (x: {}, s: string, s0: string) => () => void
  schedule: (x: {}) => () => void
}
declare const job: {
  name: string
}
enum JobState {
  FAILED = "failed",
  COMPLETED = "completed",
}

pipe(
  loader.load({
    client: this_.client,
    currentJob: job,
    jobScheduler: this_,
  }),
  T.chainFirstIOK(
    E.match(
      e => () => {
        // do something on error
      },
      r => () => {
        // do something on success
      }
    )
  ),
  TE.map(nextJob => {
    if (nextJob) {
      this_.schedule(nextJob)
    }
  })
)
