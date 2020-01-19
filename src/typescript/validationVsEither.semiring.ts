import { Either, left, right, map, mapLeft } from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"
import {
  getSemiring,
  Free,
  getSemiringValidation,
  of as pure,
} from "./freeSemiring"
import { constant } from "fp-ts/lib/function"

type ValidationError = string
type Validator = (s: string) => Either<ValidationError, string>

const validEmailRegex: Validator = s =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    s
  )
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

const validPhoneV = lift(validPhoneRegex)
const validEmailV = lift(validEmailRegex)

const { alt } = getSemiringValidation(getSemiring<string>())

const validateContact = (s: string): Either<Free<ValidationError>, string> =>
  alt(validEmailV(s), () => validPhoneV(s))

validateContact("pete@simspace.com") //?
validateContact("772-719-5555") //?
validateContact("foo") //?
