import * as SRTE from "fp-ts/StateReaderTaskEither"
import * as RTE from "fp-ts/ReaderTaskEither"
import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import * as fs from "fs/promises"
import { pipe } from "fp-ts/function"
import mkLogger from "pino"

// const createLogger = pipe(
//   TE.Do,

//   TE.tryCatch(mkLogger() ))
