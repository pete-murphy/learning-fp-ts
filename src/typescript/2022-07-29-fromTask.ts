import { task, taskEither } from "fp-ts"

const x = taskEither.fromTask<number, string>(task.of(0))
