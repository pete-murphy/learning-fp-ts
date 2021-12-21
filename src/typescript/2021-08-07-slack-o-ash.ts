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
  RE.foldW(
    () => r1,
    () => r2
  )
)

const r3_n = pipe(
  e,
  E.map(() => r1),
  E.getOrElseW(() => r2)
)

const r3_ = pipe(
  e,
  E.foldW(
    () => r1,
    () => r2
  )
)

// ✅
// r3({ foo: 1, bar: 2 });

const r4 = pipe(
  r3,
  /*
  ❌
  Argument of type '<R>(fa: Reader<R, number>) => Reader<R, number>' is not assignable to parameter of type '(a: Reader<{ foo: number; }, number> | Reader<{ bar: number; }, number>) => Reader<{ foo: number; }, number>'.
      Types of parameters 'fa' and 'a' are incompatible.
          Type 'Reader<{ foo: number; }, number> | Reader<{ bar: number; }, number>' is not assignable to type 'Reader<{ foo: number; }, number>'.
              Type 'Reader<{ bar: number; }, number>' is not assignable to type 'Reader<{ foo: number; }, number>'.
                  Property 'bar' is missing in type '{ foo: number; }' but required in type '{ bar: number; }'.
  */
  Reader.map(x => x)
)
