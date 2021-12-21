import * as A from "fp-ts/Array"
import * as RA from "fp-ts/ReadonlyArray"
import * as E from "fp-ts/Either"
import { flow, pipe, tuple } from "fp-ts/function"
import * as t from "io-ts"

type ValidationError = {}
declare const schema: {
  validate: (
    data: Record<string, unknown>
  ) => E.Either<ValidationError[], Record<string, unknown>>
}

flow(
  A.map(data => schema.validate(data as Record<string, unknown>)),
  A.array.sequence(E.either)
)

flow(
  A.map(data => schema.validate(data as Record<string, unknown>)),
  A.Traversable.sequence(E.either)
)

flow(
  A.map(data => schema.validate(data as Record<string, unknown>)),
  A.sequence(E.Applicative)
)

E.traverseArray(data => schema.validate(data as Record<string, unknown>))
