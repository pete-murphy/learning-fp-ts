import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as Reader from "fp-ts/Reader"
import * as RE from "fp-ts/ReaderEither"

declare const e: E.Either<number, string>
declare const r1: Reader.Reader<{ foo: number }, number>
declare const r2: Reader.Reader<{ bar: number }, number>

const r3 = pipe(
  e,
  RE.fromEither,
  RE.matchEW(
    () => r1,
    () => r2
  )
)

r3({ foo: 1, bar: 2 })

const r4 = pipe(
  r3,
  Reader.map(x => x)
)
