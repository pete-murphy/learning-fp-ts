import { sequenceS } from "fp-ts/lib/Apply"
import { pipe } from "fp-ts/lib/function"
import * as T from "fp-ts/lib/Task"

const exDo = pipe(
  T.Do,
  T.apS("a", T.delay(1000)(T.of(1))),
  T.apS("b", T.delay(1000)(T.of(2))),
  T.apS("c", T.delay(1000)(T.of(3)))
)

const exPar = sequenceS(T.task)({
  a: T.delay(1000)(T.of(1)),
  b: T.delay(1000)(T.of(2)),
  c: T.delay(1000)(T.of(3)),
})
const exSeq = sequenceS(T.taskSeq)({
  a: T.delay(1000)(T.of(1)),
  b: T.delay(1000)(T.of(2)),
  c: T.delay(1000)(T.of(3)),
})

const main1 = () => {
  console.time("run exDo")
  exDo().then(() => {
    console.timeEnd("run exDo")
  })

  console.time("run exPar")
  exPar().then(() => {
    console.timeEnd("run exPar")
  })

  console.time("run exSeq")
  exSeq().then(() => {
    console.timeEnd("run exSeq")
  })
}

main1()
