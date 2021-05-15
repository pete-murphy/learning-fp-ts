import { array } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option"
import { record } from "fp-ts/lib/Record"
import * as L from "monocle-ts/lib/Lens"
import * as T from "monocle-ts/lib/Traversal"
import * as Opt from "monocle-ts/lib/Optional"
import * as At from "monocle-ts/lib/At"
import * as RA from "fp-ts/lib/ReadonlyArray"
import * as St from "fp-ts/lib/State"

interface Data_ {
  readonly items: Array<{
    readonly foo: Record<
      string,
      {
        nested: O.Option<
          Array<{
            readonly baz: string
          }>
        >
      }
    >
  }>
}

// const y: T.Traversal<Data, string>
const y = pipe(
  L.id<Data_>(),
  L.prop("items"),
  L.traverse(array),
  T.prop("foo"),
  T.traverse(record),
  T.prop("nested"),
  T.some,
  T.index(2),
  T.prop("baz")
)

// const z = pipe(T.fromTraversable(St.state)<{ foo: string }>(), T.prop("foo"))

type Foo = Record<string, Record<string, Data>>

type Data = {
  foo: number
}

const f = pipe(
  L.id<Foo>(),
  L.key("a"),
  Opt.key("b"),
  // Opt.atKey("b"),
  // Opt.modifyOption(x => ({ foo: x.foo + 1 }))
  // Opt.modify(x => ({ foo: x.foo + 1 }))
  Opt.modify(() => ({ foo: 1 }))
)

JSON.stringify(f({ a: { b: { foo: 3 } } })) //?
JSON.stringify(f({ a1: { b: { foo: 3 } } })) //?

// Before
// const x = Lens.fromProp<Data>()('items')
//   .composeTraversal(fromTraversable(array)())
//   .composeLens(Lens.fromProp<Item>()('foo'))
//   .composeTraversal(fromTraversable(record)())
//   .composeOptional(Optional.fromOptionProp<Value>()('nested'))
//   .composeOptional(indexArray<NestedValue>().index(2))
//   .composeLens(Lens.fromProp<NestedValue>()('baz'))
