import * as A from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import * as S from "fp-ts/lib/string"
import { NEA, O } from "./ssstuff/fp-ts-imports"

// Take a list of strings and convert elements to upper case
// for all but the first element. The first element should be
// prepended back into the result. The last step should combine
// all the strings into a single string with an empty string separator.

const letters: NEA.NonEmptyArray<string> = ["a", "b", "c"]
const join = (s: string[]): string => s.join("")

pipe(
  letters,
  A.matchLeftW(
    () => [],
    (head, tail) =>
      A.prepend(head)(pipe(tail, A.map(S.toUpperCase)))
  ),
  join
)

pipe(
  letters,
  NEA.matchLeft((head, tail) =>
    A.prepend(head)(pipe(tail, A.map(S.toUpperCase)))
  ),
  join
)

pipe(
  letters,
  A.mapWithIndex((i, char) =>
    i === 0 ? char : S.toUpperCase(char)
  ),
  join
)
