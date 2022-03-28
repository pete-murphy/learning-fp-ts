import { Ap, pipe, RA, TE } from "./lib/fp-ts-imports"

declare const [a, b, c]: ReadonlyArray<
  TE.TaskEither<Error, number>
>

TE.sequenceSeqArray([a, b, c])()

RA.sequence(TE.ApplicativeSeq)([a, b, c])()

Ap.sequenceT(TE.ApplySeq)(a, b, c)()

Ap.sequenceS(TE.ApplySeq)({ a, b, c })()

const apSSeq = Ap.apS(TE.ApplySeq)
pipe(
  TE.Do,
  apSSeq("a", a),
  apSSeq("b", b),
  apSSeq("c", c)
)()
