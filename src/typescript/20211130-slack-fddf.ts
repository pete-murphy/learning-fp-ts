import * as TE from "fp-ts/TaskEither"

type A = {
  a: number
  b: number
  c: number
}

type B = {
  c: number
}

type ErrorA = {
  errorA: string
}

type ErrorB = {
  errorB: string
}

// Example A object = {a: 123, b: 456, c: 0}

// Example B object = {c: 789}

// I wanted to create newObject: TaskEither<ErrorA, A>

// and If everything goes well, expecting value should be {a: 123, b: 456, c: 789 }
