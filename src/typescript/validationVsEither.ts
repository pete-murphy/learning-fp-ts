import {
  Either,
  left,
  right,
  map,
  getValidation,
  mapLeft,
} from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/pipeable"
import { getSemigroup, NonEmptyArray } from "fp-ts/lib/NonEmptyArray"
import { sequenceT } from "fp-ts/lib/Apply"

type ValidationError = string

const minLength = (s: string): Either<ValidationError, string> =>
  s.length >= 6 ? right(s) : left("at least 6 characters")

const oneCapital = (s: string): Either<ValidationError, string> =>
  /[A-Z]/g.test(s) ? right(s) : left("at least one capital letter")

const oneNumber = (s: string): Either<ValidationError, string> =>
  /[0-9]/g.test(s) ? right(s) : left("at least one number")

const applicativeValidation = getValidation(getSemigroup<ValidationError>())

const lift = <E, A>(
  check: (a: A) => Either<E, A>
): ((a: A) => Either<NonEmptyArray<E>, A>) => a =>
  pipe(
    check(a),
    mapLeft(a => [a])
  )

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)

const validatePassword = (
  s: string
): Either<NonEmptyArray<ValidationError>, string> =>
  pipe(
    sequenceT(getValidation(getSemigroup<string>()))(
      minLengthV(s),
      oneCapitalV(s),
      oneNumberV(s)
    ),
    map(() => s)
  )
