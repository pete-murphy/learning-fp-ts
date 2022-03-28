import {
  IO,
  pipe,
  Tree,
  Com,
  N,
  identity
} from "./lib/fp-ts-imports"
import { taskEither, readonlyRecord } from "fp-ts"
import { TaskEither } from "fp-ts/TaskEither"
import { ReadonlyRecord } from "fp-ts/ReadonlyRecord"

// interface HasA {
//   a: string
// }
// interface HasB {
//   b: string
// }

// // type Ex<T extends HasA>

// // interface NotHasB {
// //   b: never
// // }

// const addB = <T extends HasA>(
//   hasA: TaskEither<never, Exclude<"b", T>> //TaskEither<never, T & HasB>
// ): TaskEither<never, T & HasB> =>
//   //  = hasA =>
//   pipe(
//     hasA,
//     // taskEither.Do,
//     taskEither.bind("b", () =>
//       taskEither.right("why doesn't this work?")
//     )
//   )

interface HasA {
  a: string
}

type LacksB<T> = "b" extends keyof T ? never : T

type zz = LacksB<{ b: 0 }>
type zz012 = LacksB<{ a: 0 }>

interface HasB {
  b: string
}

type ZZZ = Exclude<"b", keyof HasB>
type Zdf = keyof HasA

// const addB: <T extends HasA>(hasA: TaskEither<never, T>) => TaskEither<never, T & HasB> = (
// 	hasA
// ) =>
// const addB = (hasA: TaskEither<never, {readonly a: string}>) =>

const addB = (hasA: TaskEither<never, HasA>) =>
  pipe(
    hasA,
    taskEither.bind("b", () =>
      taskEither.right("why doesn't this work?")
    )
  )
