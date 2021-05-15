import * as A from "fp-ts/Apply"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import * as S from "fp-ts/string"

// fail-fast (default)
pipe(
  E.Do,
  E.bind("yo", () => E.right(5)),
  E.apS("authIsConfirmed", E.left("a")),
  E.apS("foo", E.left("b")),
  console.log
) // => left('a')

const apS = A.apS(E.getApplicativeValidation(S.Semigroup))

// accumulates
pipe(
  E.Do,
  E.bind("yo", () => E.right(5)),
  apS("authIsConfirmed", E.left("a")),
  apS("foo", E.left("b")),
  console.log
) // => left('ab')
