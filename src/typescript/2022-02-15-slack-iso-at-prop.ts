import { flip, flow } from "fp-ts/lib/function"
import { Iso } from "monocle-ts"
import {
  pipe,
  RA,
  Str,
  RTE,
  Re,
  RT,
  TE,
  T,
  constant
} from "./lib/fp-ts-imports"

interface Foo {
  name: string
  bar: [string, string]
}

const unTupleIso = new Iso<
  [string, string],
  { a: string; b: string }
>(
  ([a, b]) => ({ a, b }),
  ({ a, b }) => [a, b]
)

// How can I construct this?
type Target = Iso<
  Foo,
  { name: string; date: { a: string; b: string } }
>

type Changed<
  ObjectType,
  PickedKey extends keyof ObjectType,
  ItemType
> = {
  [Property in keyof ObjectType]: Property extends PickedKey
    ? ItemType
    : ObjectType[Property]
}
function isoAtProp<T>() {
  return function <K extends keyof T, O>(
    k: K,
    iso: Iso<T[K], O>
  ) {
    type B = Changed<T, K, O>
    return new Iso(
      // assertions required because TS infers {[K]: O} as {[string]: O}
      (a: T) => ({ ...a, [k]: iso.get(a[k]) } as B),
      (a: B) =>
        ({ ...a, [k]: iso.reverseGet(a[k] as O) } as T)
    )
  }
}

const targetIso = isoAtProp<Foo>()("bar", unTupleIso)

const result = targetIso.unwrap({
  name: "john",
  bar: ["first", "second"]
})
const string = result.bar.a //?

result //?
