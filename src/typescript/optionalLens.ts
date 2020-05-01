import { Optional, Lens } from "monocle-ts"
import {
  fromNullable,
  chain,
  map,
  mapNullable,
} from "fp-ts/lib/Option"
import { pipe } from "fp-ts/lib/pipeable"

type Foo = {
  bar?: {
    baz: string
    quux: string
    quuz: string
  }
}

const getBazOption = Optional.fromNullableProp<Foo>()(
  "bar"
).composeLens(
  Lens.fromProp<{
    baz: string
    quux: string
    quuz: string
  }>()("baz")
).getOption

const getBazOption_ = (foo: Foo) =>
  pipe(
    fromNullable(foo.bar),
    map((bar) => bar.baz)
  )

// const getBazOption__ = (foo: Foo) =>
//    fromNullable(foo.bar) |> map(bar => bar.baz)
// pipe(
//   fromNullable(foo.bar),
//   map(bar => bar.baz)
// );

const bazLens_ = Optional.fromNullableProp<Foo>()("bar")

const foo1: Foo = {}

const foo2: Foo = {
  bar: {
    baz: "baz",
    quux: "quux",
    quuz: "quuz",
  },
}

getBazOption(foo1) //?
getBazOption_(foo1) //?
getBazOption(foo2) //?
getBazOption_(foo2) //?
