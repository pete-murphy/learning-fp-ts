import * as E from "fp-ts/Either"
import * as RE from "fp-ts/ReaderEither"
import { pipe } from "fp-ts/lib/function"
import { iso, Newtype } from "newtype-ts"

const isMinLength: (
  len: number
) => (str: string) => E.Either<string, string> = len =>
  E.fromPredicate(
    str => str.length >= len,
    () => "must be larger."
  )

const isMaxLength: (
  len: number
) => (str: string) => E.Either<string, string> = len =>
  E.fromPredicate(
    str => str.length <= len,
    () => "has to be shorter."
  )

interface Username
  extends Newtype<{ readonly Username: unique symbol }, string> {}

const validateUsername: (str: string) => E.Either<string, Username> = pipe(
  isMinLength(5),
  RE.apSecond(isMaxLength(9)),
  RE.map(iso<Username>().wrap)
)

console.log(validateUsername("hey"))
console.log(validateUsername("example"))
console.log(validateUsername("exampletoolarge"))
