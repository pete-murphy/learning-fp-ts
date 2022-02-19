import { flip, flow } from "fp-ts/lib/function"
import {
  pipe,
  RA,
  Str,
  RTE,
  Re,
  RT,
  TE,
  T,
  constant
} from "./ssstuff/fp-ts-imports"

// const words = ["a", "a", "A", "AA", "apple", "Apple"]

// const x0 = pipe(words, RA.sort(Str.Ord))
// const x1 = pipe(words, RA.sort(Str.Ord))

// console.log({ x0 })

pipe(
  RTE.of("asdf"),
  RT.chainFirstIOK(() => () => console.time("A")),
  Re.map(T.delay(1_000)),
  RT.chainFirstIOK(() => () => console.timeEnd("A"))
)({})()

pipe(
  RTE.of("asdf"),
  RT.chainFirstIOK(() => () => console.time("B")),
  RT.chain(flow(T.of, T.delay(1_000), RT.fromTask)),
  RT.chainFirstIOK(() => () => console.timeEnd("B"))
)({})()
