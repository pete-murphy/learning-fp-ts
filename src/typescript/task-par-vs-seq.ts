import * as T from "fp-ts/Task"
import * as Ap from "fp-ts/Apply"

const examplePar = Ap.sequenceT(T.ApplicativePar)(
  T.delay(500)(T.of(1)),
  T.delay(500)(T.of(2)),
  T.delay(500)(T.of(3))
)().then(console.log)

const exampleSeq = Ap.sequenceT(T.ApplicativeSeq)(
  T.delay(500)(T.of(1)),
  T.delay(500)(T.of(2)),
  T.delay(500)(T.of(3))
)().then(console.log)

