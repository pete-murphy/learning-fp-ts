import { pipe, O } from "./lib/fp-ts-imports"

declare const val: undefined | number | string
declare const notUndefined: <A>(a: A | undefined) => a is A
declare const isString: (x: unknown) => x is string

const x = pipe(
  val,
  O.fromPredicate(notUndefined),
  O.filter(isString)
)
