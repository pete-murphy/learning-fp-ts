import { array } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import { Option } from "fp-ts/lib/Option"
import { record } from "fp-ts/lib/Record"
import * as L from "monocle-ts/lib/Lens"
import * as T from "monocle-ts/lib/Traversal"

interface Data {
  readonly items: Array<{
    readonly foo: Record<
      string,
      {
        nested: Option<
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
  L.id<Data>(),
  L.prop("items"),
  L.traverse(array),
  T.prop("foo"),
  T.traverse(record),
  T.prop("nested"),
  T.some,
  T.index(2),
  T.prop("baz")
)

// Before
// const x = Lens.fromProp<Data>()('items')
//   .composeTraversal(fromTraversable(array)())
//   .composeLens(Lens.fromProp<Item>()('foo'))
//   .composeTraversal(fromTraversable(record)())
//   .composeOptional(Optional.fromOptionProp<Value>()('nested'))
//   .composeOptional(indexArray<NestedValue>().index(2))
//   .composeLens(Lens.fromProp<NestedValue>()('baz'))
