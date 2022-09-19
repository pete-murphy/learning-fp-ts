import { Eq, pipe, Str } from "./lib/fp-ts-imports"

const EqFunction = pipe(
  Str.Eq,
  Eq.contramap((f: Function) => f.toString())
)

const identity = <A>(x: A) => x

EqFunction.equals(identity, <A>(x: A) => x) //?
