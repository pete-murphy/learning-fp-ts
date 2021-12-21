import { Big } from "big.js"
import {
  option as O,
  readonlyArray as RA,
  readonlyNonEmptyArray as RNEA,
} from "fp-ts/lib"
import { pipe } from "fp-ts/lib/function"

declare const previous: (values: readonly Big[]) => Big
declare const amean: (values: RNEA.ReadonlyNonEmptyArray<Big>) => Big

export const dmaC = (
  values: readonly Big[],
  period: number,
  factor: Big
): readonly Big[] => {
  const firstPart = values.slice(
    0,
    period
  ) as unknown as RNEA.ReadonlyNonEmptyArray<Big>

  return pipe(
    values,
    RA.reduceWithIndex(<readonly Big[]>[], (index, reduced, value) => {
      const prev = previous(reduced)
      return [
        ...reduced,
        reduced.length === 0
          ? amean(firstPart)
          : value.sub(prev).mul(factor).add(prev),
      ]
    })
  )
}
