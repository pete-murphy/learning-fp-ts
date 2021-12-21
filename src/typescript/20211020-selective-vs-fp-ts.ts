import { flow, pipe } from "fp-ts/lib/function"
import { Lens, fromTraversable } from "monocle-ts"
import * as L from "monocle-ts/lib/Lens"
import * as T from "monocle-ts/lib/Traversal"
import * as Ap from "fp-ts/lib/Apply"
import * as E from "fp-ts/lib/Either"
import * as RNEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import * as Nt from "newtype-ts"
import * as S from "fp-ts/lib/String"
import Newtype = Nt.Newtype
import Either = E.Either
import { NonEmptyString } from "io-ts-types"
import { match } from "./matchers"

interface Password
  extends Newtype<{ readonly Password: unique symbol }, string> {}
const mkPassword = Nt.iso<Password>().wrap
type EmptyPassword = {
  readonly tag: "emptyPassword"
}
type ShortPassword = {
  readonly tag: "shortPassword"
}
type NoDigitPassword = {
  readonly tag: "noDigitPassword"
}
const emptyPassword: PasswordValidationError = {
  tag: "emptyPassword" as const,
}
const shortPassword: PasswordValidationError = {
  tag: "shortPassword" as const,
}
const noDigitPassword: PasswordValidationError = {
  tag: "noDigitPassword" as const,
}
// data PasswordValidationError
//     = EmptyPassword
//     | ShortPassword
//     | NoDigitPassword
//     deriving stock (Show)
type PasswordValidationError = EmptyPassword | ShortPassword | NoDigitPassword
// type PasswordValidation = Validation (NonEmpty PasswordValidationError) Password
type PasswordValidation = Either<
  RNEA.ReadonlyNonEmptyArray<PasswordValidationError>,
  Password
>

const showErr: (err: PasswordValidationError) => string = match({
  emptyPassword: () => "EmptyPassword",
  noDigitPassword: () => "NoDigitPassword",
  shortPassword: () => "ShortPassword",
})

const logShow: (_: PasswordValidation) => void = E.match(
  flow(RNEA.map(showErr), x => console.error("Failure: ", x)),
  x => console.log("Success: ", x)
)

// validateEmptyPassword :: String -> PasswordValidation
const validateEmptyPassword = (password: string): PasswordValidation =>
  pipe(
    password,
    E.fromPredicate(NonEmptyString.is, () => RNEA.of(emptyPassword)),
    E.map(mkPassword)
  )

// validateShortPassword :: String -> PasswordValidation
const validateShortPassword = (password: string): PasswordValidation =>
  pipe(
    password,
    E.fromPredicate(
      str => str.length > 8,
      () => RNEA.of(shortPassword)
    ),
    E.map(mkPassword)
  )

// validatePasswordDigit :: String -> PasswordValidation
const validatePasswordDigit = (password: string): PasswordValidation =>
  pipe(
    password,
    E.fromPredicate(
      str => /\d/.test(str),
      () => RNEA.of(noDigitPassword)
    ),
    E.map(mkPassword)
  )

const V_Applicative = E.getApplicativeValidation(
  RNEA.getSemigroup<PasswordValidationError>()
)

// validatePassword :: String -> PasswordValidation
// validatePassword password = ifS
//     (checkEmptyPassword password)
//     (failure EmptyPassword)
//     (validateShortPassword password *> validatePasswordDigit password)
const validatePassword = (password: string): PasswordValidation =>
  pipe(
    validateEmptyPassword(password),
    E.apSecond(
      pipe(
        validateShortPassword(password),
        V.apSecond(validatePasswordDigit(password))
      )
    )
  )

const ifS = <E, A>(
  v1: Either<E, boolean>,
  v2: Either<E, A>,
  v3: Either<E, A>
): Either<E, A> =>
  pipe(
    v1,
    E.chain(b => (b ? v2 : v3))
  )

const V = { apSecond: Ap.apSecond(V_Applicative), ifS }

const checkEmptyPassword = flow(NonEmptyString.is, E.of)

// validatePassword :: String -> PasswordValidation
// validatePassword password = ifS
//     (checkEmptyPassword password)
//     (failure EmptyPassword)
//     (validateShortPassword password *> validatePasswordDigit password)
const validatePassword_ = (password: string): PasswordValidation =>
  V.ifS(
    checkEmptyPassword(password),
    E.left([emptyPassword]),
    pipe(
      validateShortPassword(password),
      V.apSecond(validatePasswordDigit(password))
    )
  )

logShow(validatePassword(""))

logShow(validatePassword("abc"))

logShow(validatePassword("abc123"))

logShow(validatePassword("security567"))
