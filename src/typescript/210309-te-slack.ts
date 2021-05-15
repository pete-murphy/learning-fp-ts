import { pipe } from "fp-ts/lib/function"
import * as TE from "fp-ts/TaskEither"
import TaskEither = TE.TaskEither

// const func1:  TE.TaskEither<
//   Error,
//   number
// > = TE.of(9)
// const func2: (boundVariables: {
//   a: number
// }) => TE.TaskEither<Error, number> = ({ a }) =>
//   TE.of(a + 100)
// const func3: (boundVariables: {
//   a: number
//   b: number
// }) => TE.TaskEither<Error, number> = ({ a, b }) =>
//   TE.of(a + b)

// pipe(
//   TE.Do,
//   TE.bind("a", () => func1),
//   TE.bind("b", func2),
//   TE.chain(func3)
// )

type PoolClient = {}

declare const func1: (
  str: string
) => TaskEither<Error, any[]>
declare const func2: () => TaskEither<
  Error,
  PoolClient
>
declare const func3: (boundVariables: {
  a: any[]
  b: PoolClient
}) => TaskEither<Error, string>

pipe(
  TE.Do,
  TE.bind("a", () => func1("string")),
  TE.bind("b", func2),
  TE.chain(func3)
)
