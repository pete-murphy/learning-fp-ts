import * as SRTE from "fp-ts/StateReaderTaskEither"
import * as RTE from "fp-ts/ReaderTaskEither"
import * as TE from "fp-ts/TaskEither"
import * as Eq from "fp-ts/Eq"
import * as RA from "fp-ts/ReadonlyArray"
import * as O from "fp-ts/Option"
import * as N from "fp-ts/number"
import * as E from "fp-ts/Either"
import * as fs from "fs/promises"
import { pipe } from "fp-ts/function"
import * as Store from "fp-ts/Store"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"

pipe([1, 2, 3, 4], RA.extend(RA.takeLeft(2))) //?
