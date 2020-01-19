import { Either, left, right, map, mapLeft } from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"
import {
  getSemiring,
  Free,
  getSemiringValidation,
  of as pure,
  alt,
} from "./freeSemiring"
import { sequenceT } from "fp-ts/lib/Apply"

type ValidationError = string
type Validator = (s: string) => Either<ValidationError, string>

const minLength: Validator = s =>
  s.length >= 6 ? right(s) : left("at least 6 characters")

const oneCapital: Validator = s =>
  /[A-Z]/g.test(s) ? right(s) : left("at least one capital letter")

const oneNumber: Validator = s =>
  /[0-9]/g.test(s) ? right(s) : left("at least one number")

const validEmailRegex: Validator = s =>
  /^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$/.test(s)
    ? right(s)
    : left("not a valid email")

const validPhoneRegex: Validator = s =>
  /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(
    s
  )
    ? right(s)
    : left("not a valid phone number")

const lift = <E, A>(
  check: (a: A) => Either<E, A>
): ((a: A) => Either<Free<E>, A>) => a => pipe(check(a), mapLeft(pure))

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)
const validPhoneV = lift(validPhoneRegex)
const validEmailV = lift(validEmailRegex)

// const validatePassword = (s: string): Either<Free<ValidationError>, string> =>
//   pipe(
//     sequenceT(getSemiringValidation(getSemiring<string>()))(
//       minLengthV(s),
//       oneCapitalV(s),
//       oneNumberV(s)
//     ),
//     map(() => s)
//   )

// validatePassword("foo") //?

const validateContact = (s: string): Either<Free<ValidationError>, string> =>
  pipe(
    sequenceT(getSemiringValidation(getSemiring<string>()))(
      validEmailV(s),
      validPhoneV(s)
    ),
    map(() => s)
  )

validateContact("asdfasdf") //?
