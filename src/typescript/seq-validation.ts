import * as RA from "fp-ts/ReadonlyArray"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/lib/function"
import Either = E.Either

type L = string
type T = number

const input: readonly Either<L, T>[] = [
  E.left("1"),
  E.left("2"),
  E.left("3"),
  E.right(0),
]

const output1: Either<readonly L[], readonly T[]> = pipe(
  input,
  RA.traverse(E.getApplicativeValidation(RA.getMonoid<L>()))(E.mapLeft(RA.of))
)

const output2: Either<L, readonly T[]> = E.sequenceArray(input)
