import { array } from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/function"
import { Lens, fromTraversable } from "monocle-ts"
import * as L from "monocle-ts/lib/Lens"
import * as T from "monocle-ts/lib/Traversal"
import { RA } from "./ssstuff/fp-ts-imports"

type MyChildType = { prop?: string }
type MyType = { myChildType: MyChildType[] }
type MyParentType = { myType: MyType }

const updateProp = (newProp?: string) =>
  pipe(
    L.id<MyParentType>(),
    L.prop("myType"),
    L.prop("myChildType"),
    L.traverse(array),
    T.prop("prop"),
    T.set(newProp)
  )

const _parentLens = Lens.fromProp<MyParentType>()("myType")
const _childrenLens = Lens.fromProp<MyType>()("myChildType")
const childrenTraverse = fromTraversable(array)<MyChildType>()
// const _childProp = Lens.fromNullableProp<MyChildType>()("prop", "")
const _childProp = Lens.fromProp<MyChildType>()("prop")

const updateProp_ = _parentLens
  .composeLens(_childrenLens)
  .composeTraversal(fromTraversable(array)<MyChildType>())
  .composeLens(_childProp)

const example: MyParentType = {
  myType: {
    myChildType: [{ prop: undefined }, { prop: "bar" }],
  },
}

updateProp("foo")(example)
//-> { myType: { myChildType: [ { prop: 'foo' }, { prop: 'foo' } ] } }

updateProp_.set("foo")(example) //?

type Foo = {
  bar: string
  baz: ReadonlyArray<string>
}

pipe(
  L.id<Foo>(),
  L.prop("baz"),
).set(["c"])

const addC = (foo: Foo): Foo => ({
  ...foo,
  baz: [...foo.baz, "c"],
})

pipe(
  L.id<Foo>(),
  L.prop("baz"),
  L.modify(xs => [...xs, "c"])
)
