import * as Arr from "fp-ts/lib/Array"
import { flow, pipe, tuple } from "fp-ts/lib/function"
import * as T from "monocle-ts/lib/Traversal"
import { Applicative } from "fp-ts/lib/Applicative"
import { HKT } from "fp-ts/lib/HKT"

const keyValued: T.Traversal<
  Record<string, any>,
  { key: string; value: any }
> = {
  modifyF: <F>(F: Applicative<F>) => (
    f: (record: {
      key: string
      value: any
    }) => HKT<F, { key: string; value: any }>
  ) =>
    flow(
      Object.entries,
      Arr.map(([key, value]) => ({ key, value })),
      Arr.traverse(F)(f),
      fa =>
        F.map(
          fa,
          flow(
            Arr.map(({ key, value }) => tuple(key, value)),
            Object.fromEntries
          )
        )
    ),
}

const example = {
  foo1: "foo1",
  foo2: true,
  bar1: "hello",
  bar2: () => {},
}

console.log(
  pipe(
    // keyValued,
    // T.filter(({ key }) => key.startsWith("foo")),
    // T.modify(({ key, value }) => ({ key: key.toLocaleUpperCase(), value })),
    keyValued,
    T.getAll
  )(example)
)
