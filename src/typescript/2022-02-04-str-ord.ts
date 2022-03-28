import { Ord, pipe, RS, Str } from "./lib/fp-ts-imports"

type X = "a" | "b" | "c"
declare const mySet: ReadonlySet<X>

const x = pipe(
  mySet,
  RS.toReadonlyArray(Ord.fromCompare<X>(Str.Ord.compare))
)

const x_ = pipe(mySet, RS.toReadonlyArray(Ord.trivial))
