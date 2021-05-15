import { pipe } from "fp-ts/lib/function"
import * as D from "io-ts/Decoder"
import * as S from "io-ts/Schema"
import * as E from "fp-ts/Either"

const ExampleS = S.make(s =>
  s.type({
    tier1asset: s.boolean,
    tier2asset: s.boolean,
    tier3asset: s.boolean,
    tier4asset: s.boolean,
  })
)

pipe(
  {
    tier1Asset: true,
    tier2Asset: false,
    tier3Asset: true,
    tier4Asset: false,
  },
  S.interpreter(D.Schemable)(ExampleS).decode,
  E.mapLeft(D.draw),
  E.fold(console.log, console.log)
)
