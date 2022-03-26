import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import { pipe } from "fp-ts/function"
import * as Sg from "fp-ts/Semigroup"
import * as N from "fp-ts/number"

const retryAmount = (retryCount: number) =>
  Math.ceil(Math.min(0.5 * retryCount ** 2, 30)) * 1_000

const retries = RNEA.range(0, 9)

const retryAmounts = pipe(
  retries,
  RNEA.map(retryAmount),
  RNEA.map(x => x / 1_000)
)

retryAmounts

const totalRetryAmount = pipe(
  retryAmounts,
  RNEA.concatAll(N.SemigroupSum)
)

totalRetryAmount / 60 //?
