import * as PCF from "parser-ts/code-frame"
import * as PS from "parser-ts/string"
import { pipe } from "fp-ts/function"
import * as Ap from "fp-ts/Apply"
import * as P from "parser-ts/Parser"

// type Parsers<T extends readonly unknown[]> = {
//   readonly [K in keyof T]: P.Parser<string, T[K]>
// }

const parseBoolean: P.Parser<string, boolean> = pipe(
  PS.string("true"),
  P.map(_ => true),
  P.alt(() =>
    pipe(
      PS.string("false"),
      P.map(_ => false)
    )
  )
)

// const parsersExample: Parsers<[boolean, string, number]> = [
//   parseBoolean,
//   PS.string(","),
//   PS.float
// ]

// const joinedParsers = Ap.sequenceT(P.Applicative)(
//   ...parsersExample
// )

const P_Do: P.Parser<string, {}> = P.of({})
const P_apS = Ap.apS(P.Applicative)

type GradedPoints = {
  points: number
  correct: boolean
}

const correctP: P.Parser<string, boolean> = pipe(
  PS.string("correct"),
  P.map(_ => true),
  P.alt(() =>
    pipe(
      PS.string("incorrect"),
      P.map(_ => false)
    )
  )
)

const gradedPointsP: P.Parser<string, GradedPoints> = pipe(
  P_Do,
  P.apFirst(PS.string("(")), // ignore the opening parenthesis
  P_apS("correct", correctP), // parse the 'correct' type
  P.apFirst(PS.string(",")), // ignore the comma
  P_apS("points", PS.float), // parse the float as as 'points'
  P.apFirst(PS.string(")")), // ignore the closing parenthesis
  P.apFirst(P.eof()) // assert end of input
)

PCF.run(gradedPointsP, "(incorrect,0.14999)")
//-> right({ correct: false, points: 0.14999 }) : Either<string, GradedPoints>

// left('> 1 | 99,true\n \
//     \     | ^ Expected: "true", "false"')

// left('> 1 | true\n \
//      \    |     ^ Expected: ","')
