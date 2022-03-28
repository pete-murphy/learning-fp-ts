import { pipe, tuple } from "fp-ts/function"
import * as RA from "fp-ts/ReadonlyArray"
import { Ap } from "./lib/fp-ts-imports"

pipe(
  RA.Do,
  RA.apS("x", [1, 2, 3]),
  RA.apS("y", ["a", "b", "c"]),
  RA.map(({ x, y }) => tuple(x, y))
)
//-> [ [ 1, 'a' ],
//     [ 1, 'b' ],
//     [ 1, 'c' ],
//     [ 2, 'a' ],
//     [ 2, 'b' ],
//     [ 2, 'c' ],
//     [ 3, 'a' ],
//     [ 3, 'b' ],
//     [ 3, 'c' ] ]

RA.comprehension(
  [
    [1, 2, 3],
    ["a", "b", "c"]
  ],
  tuple
)
//-> [ [ 1, 'a' ],
//     [ 1, 'b' ],
//     [ 1, 'c' ],
//     [ 2, 'a' ],
//     [ 2, 'b' ],
//     [ 2, 'c' ],
//     [ 3, 'a' ],
//     [ 3, 'b' ],
//     [ 3, 'c' ] ]

Ap.sequenceT(RA.Apply)([1, 2, 3], ["a", "b", "c"]) //?
