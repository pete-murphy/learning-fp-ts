import {
  Either,
  fromPredicate,
  map,
  left,
  chain,
  getValidation,
  mapLeft,
} from "fp-ts/lib/Either"
import { pipe, pipeable } from "fp-ts/lib/pipeable"
import { Iso } from "monocle-ts"
import { sequenceT, sequenceS } from "fp-ts/lib/Apply"
import { reader } from "fp-ts/lib/Reader"
import { Newtype, iso } from "newtype-ts"
import * as NEA from "fp-ts/lib/ReadonlyNonEmptyArray"
import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray"
import { traverse_ } from "fp-ts/lib/Foldable"
import { identity } from "fp-ts/lib/function"

const { getSemigroup, readonlyNonEmptyArray } = NEA

export type FormValidationState = Either<
  ReadonlyNonEmptyArray<ValidationError>,
  ValidatedForm
>

export enum ValidationError {
  TooShort = "TooShort",
  TooLong = "TooLong",
  NoSpecialChar = "NoSpecialChar",
  InvalidEmail = "InvalidEmail",
  EmptyField = "EmptyField",
}

export type ValidatedForm = {
  email: Email
  password: Password
}

export interface Email
  extends Newtype<
    { readonly Email: unique symbol },
    string
  > {}
export interface Password
  extends Newtype<
    { readonly Password: unique symbol },
    string
  > {}

export const isoEmail = iso<Email>()
export const isoPassword = iso<Password>()

const validateLength = ({
  min,
  max,
}: {
  min: number
  max: number
}) => (str: string): Either<ValidationError, string> =>
  pipe(
    str,
    fromPredicate(
      (str) => str.length > 0,
      () => ValidationError.EmptyField
    ),
    chain(
      fromPredicate(
        (str) => str.length >= min,
        () => ValidationError.TooShort
      )
    ),
    chain(
      // Not sure why I need to include this annotation
      fromPredicate<ValidationError, string>(
        (str) => str.length <= max,
        () => ValidationError.TooLong
      )
    )
  )

const V = getValidation(getSemigroup<ValidationError>())

const passwordValidators = sequenceT(reader)(
  validateLength({ min: 4, max: 24 }),
  fromPredicate(
    (str: string) => specialCharsRegExp.test(str),
    () => ValidationError.NoSpecialChar
  )
)

const specialCharsRegExp: RegExp = /[!@#$%^&*)(+=._-]/g

const validatePassword = (str: string) =>
  pipe(
    passwordValidators(str),
    NEA.map(mapLeft(readonlyNonEmptyArray.of)),
    // @TODO: Write `sequence_`
    (vs) =>
      traverse_(V, readonlyNonEmptyArray)(vs, identity),
    chain(() => V.of(str))
  )

validatePassword("hello!") //?

const emailValidators = sequenceT(reader)(
  validateLength({ min: 6, max: 30 }),
  fromPredicate(
    (str: string) => str.includes("@"),
    () => ValidationError.InvalidEmail
  )
)

const validateEmail = (str: string) =>
  pipe(
    emailValidators(str),
    NEA.map(mapLeft(readonlyNonEmptyArray.of)),
    (vs) =>
      traverse_(V, readonlyNonEmptyArray)(vs, identity),
    chain(() => V.of(str))
  )
