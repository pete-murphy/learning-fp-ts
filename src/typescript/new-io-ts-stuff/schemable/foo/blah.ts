import { InferR } from "@matechs/effect/lib/freeEnv"
import * as Rec from "fp-ts/lib/ReadonlyRecord"
import * as Rdr from "fp-ts/lib/Reader"
import * as D from "io-ts/Decoder"
import * as Eq from "io-ts/Eq"
import * as G from "io-ts/Guard"
import * as S from "io-ts/Schema"
import * as Sc from "io-ts/Schemable"
import * as TD from "io-ts/TaskDecoder"

import Reader = Rdr.Reader

export const Person = S.make(S =>
  S.type({
    name: S.string,
    age: S.number,
  })
)

export const ValueSchemable: Sc.Schemable2C<Rdr.URI, never> = {
  string: (x: string) => x,
  number: (x: number) => x,
  // type: <A>(x: {[K in keyof A]: Reader<{[K in keyof A]: A[K]}, never>}) => Rec.,
}
