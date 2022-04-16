import * as Rx from "rxjs"
import { flow, pipe } from "fp-ts/function"
import * as OB from "fp-ts-rxjs/Observable"

const fa = Rx.from([1, 2, 3])
const fb = pipe(
  fa,
  OB.chain(a => Rx.from([a, a + 1]))
)

// fb.forEach(console.log)

// fb will emit 1, 2, 2, 3, 3, 4

const delayed = pipe(
  fa,

  OB.chain(flow(Rx.of, Rx.delay(10_000)))
)

delayed.forEach(console.log)
