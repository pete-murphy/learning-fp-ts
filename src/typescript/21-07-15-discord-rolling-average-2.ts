import { E, flow, pipe, RA, RNEA } from "./ssstuff/fp-ts-imports"

const isPositiveInteger = (n: number) => n > 0 && Number.isInteger(n)

const amean = (values: RNEA.ReadonlyNonEmptyArray<number>): number =>
  values.reduce((reduced, value) => reduced + value, 0) / values.length

export const sma = (
  values: readonly number[],
  period = 20
): E.Either<Error, readonly number[]> =>
  pipe(
    period,
    E.fromPredicate(isPositiveInteger, p =>
      Error(`Expected positive integer but got ${p}`)
    ),
    E.chain(
      E.fromPredicate(
        p => values.length >= p,
        () => Error(`Not enough data`)
      )
    ),
    E.chain(p =>
      pipe(
        values,
        RA.duplicate,
        E.traverseArray(
          flow(
            RA.takeLeft(p),
            RNEA.fromReadonlyArray,
            E.fromOption(() => Error(`Unexpected empty array`)),
            E.map(amean)
          )
        )
      )
    )
  )
