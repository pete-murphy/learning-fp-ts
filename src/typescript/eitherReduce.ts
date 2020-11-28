import * as Either from "fp-ts/lib/Either"
import {
  contramap,
  getDualOrd,
  getTupleOrd,
  Ord,
  ordNumber,
} from "fp-ts/lib/Ord"
import { pipe } from "fp-ts/lib/pipeable"

pipe(
  Either.left(99),
  Either.reduce(1, (x, y) => x + y)
)

pipe(
  Either.right(99),
  Either.reduce(1, (x, y) => x + y)
)

type Foo = [string, number]

const ordFoo: Ord<Foo> = pipe(
  ordNumber,
  contramap(([_, x]) => x)
)
