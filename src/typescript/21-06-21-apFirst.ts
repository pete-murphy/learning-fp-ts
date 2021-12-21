import { pipe } from "fp-ts/function"
import * as RTE from "fp-ts/ReaderTaskEither"

pipe(RTE.of(2), RTE.apFirst(RTE.fromIO(() => console.log("Hello"))))({})() //?

pipe(RTE.of(1), RTE.apSecond(RTE.of(2)))({})() //?

pipe(RTE.left("Oops"), RTE.apFirst(RTE.of(1))) //?
