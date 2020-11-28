import { some } from "fp-ts/lib/Option"
import { atRecord } from "monocle-ts/lib/At"

type Example = {
  foo: {
    bar: {
      baz: number
    }
  }
}

const atExample = atRecord<Example>().at("foo")
const atFoo = atRecord<Example["foo"]>().at("bar")
const atBar = atRecord<Example["foo"]["bar"]>().at("baz")

// at.set(some("foo"))({}) //?
