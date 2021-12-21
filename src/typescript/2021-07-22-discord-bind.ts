import { apply as AP, either as E } from "fp-ts/lib"
import { pipe } from "fp-ts/lib/function"

declare function foo(
  v: readonly number[],
  p: number,
  factor: number
): readonly number[]

const validateValues = (
  values: readonly number[]
): E.Either<Error, readonly number[]> =>
  values.every(v => Number.isFinite(v))
    ? E.right(values)
    : E.left(new Error("Values contain infinit number(s)."))

const validatePeriod = (period: number): E.Either<Error, number> =>
  Number.isInteger(period) && period > 0
    ? E.right(period)
    : E.left(new Error("Period must be positive Integer"))

const validateFactor = (factor: number): E.Either<Error, number> =>
  Number.isFinite(factor)
    ? E.right(factor)
    : E.left(new Error("Factor must be finit."))

export const example = (
  values: readonly number[],
  period = 20,
  factor = 1
): E.Either<Error, readonly number[]> =>
  pipe(
    E.Do,
    E.apS("vals", validateValues(values)),
    E.apS("p", validatePeriod(period)),
    E.apS("f", validateFactor(factor)),
    E.map(({ vals, p, f }) => {
      const valuesModified = vals.map(v => v * (1 / f))
      return foo(valuesModified, p, f)
    })
  )
