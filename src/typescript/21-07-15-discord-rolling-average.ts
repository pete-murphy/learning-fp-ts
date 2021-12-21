import {
  either as E,
  option as O,
  readonlyNonEmptyArray as RNEA,
} from "fp-ts/lib"
import { pipe } from "fp-ts/lib/function"
import { NotEnoughDataError, NotPositiveIntegerError } from "../errors"
import { isPositiveInteger } from "../utils/number"
import { amean } from "./amean"

export const sma = (
  values: readonly number[],
  period = 20
): E.Either<Error, readonly number[]> =>
  pipe(
    period,
    E.fromPredicate(
      isPositiveInteger,
      () => new NotPositiveIntegerError("period")
    ),
    E.chain(
      E.fromPredicate(
        p => values.length >= p,
        p => new NotEnoughDataError("sma", p, p)
      )
    ),
    E.map(p =>
      values.reduce((reduced, _value, index, array) => {
        // // want this to go into pipe
        // const pointer = index + 1

        // // this too
        // if (pointer < p) {
        //   return reduced
        // }

        return pipe(
          // ... Do something to get an Option containing the pointer
          O.chain(pointer =>
            RNEA.fromReadonlyArray(array.slice(pointer - p, pointer))
          ),
          O.map(a => [...reduced, amean(a)]),
          O.getOrElse(() => reduced)
        )
      }, <readonly number[]>[])
    )
  )
