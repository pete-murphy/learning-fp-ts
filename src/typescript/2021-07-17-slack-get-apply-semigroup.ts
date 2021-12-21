// import { Ap, pipe, RA, TE } from "./ssstuff/fp-ts-imports"

import * as Ap from "fp-ts/Apply"
import * as RA from "fp-ts/ReadonlyArray"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

type Computation = TE.TaskEither<Error, number>

const log = (msg: string) => TE.fromIO<Error, void>(() => console.log(msg))

const firstTask: Computation = pipe(
  log("firstTask ran"),
  TE.apSecond(TE.right(1))
)
const secondTask: Computation = pipe(
  log("secondTask ran"),
  TE.apSecond(TE.right(2))
)
const thirdTask: Computation = pipe(
  log("thirdTask ran"),
  TE.apSecond(TE.left(Error("3")))
)
const fourthTask: Computation = pipe(
  log("fourthTask ran"),
  TE.apSecond(TE.right(4))
)

TE.sequenceSeqArray([firstTask, secondTask, thirdTask, fourthTask])

RA.sequence(TE.ApplicativeSeq)([firstTask, secondTask, thirdTask, fourthTask])()

Ap.sequenceT(TE.ApplicativeSeq)(firstTask, secondTask, thirdTask, fourthTask)()

Ap.sequenceS(TE.ApplicativeSeq)({
  firstTask,
  secondTask,
  thirdTask,
  fourthTask,
})()


TE.sequenceSeqArray([firstTask, secondTask, thirdTask, fourthTask])();

RA.sequence(TE.ApplicativeSeq)([
  firstTask,
  secondTask,
  thirdTask,
  fourthTask
])();

Ap.sequenceT(TE.ApplicativeSeq)(a, b, c, d)
Ap.sequenceS(TE.ApplicativeSeq)({a, b, c, d})
TE.sequenceSeqArray([a, b, c, d])
TE.sequenceSeqArray([a, b, c, d])

Ap.sequenceS(TE.ApplicativeSeq)({
  firstTask,
  secondTask,
  thirdTask,
  fourthTask
})();

// Ap.sequenceS(TE.ApplicativePar)({ firstTask, secondTask, thirdTask })()
