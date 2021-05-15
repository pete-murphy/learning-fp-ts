import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"
import * as t from "io-ts"
import * as A from "fp-ts/Array"

const foos: E.Either<t.Errors, number>[] = [E.right(5), E.right(6)]
pipe(
  foos,
  E.sequenceArray,
  E.fold(console.log, x => x)
)

pipe(
  O.Do,
  O.bind("foo", () => O.some("foo")),
  O.bind("bar", ({ foo }) => O.some(`${foo} and bar`))
)
