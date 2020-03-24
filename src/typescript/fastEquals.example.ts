import { some } from "fp-ts/lib/Option"
import { deepEqual } from "fast-equals"

const foo1 = { a: 1 }
const foo2 = some({ a: 1 })

console.log(deepEqual(foo1, foo2))

const safeDeepEqual = <A>(a: A, b: A) => deepEqual(a, b)

console.log(safeDeepEqual(foo1, foo2))
