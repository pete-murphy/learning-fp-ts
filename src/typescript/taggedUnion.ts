import { uniq } from "fp-ts/lib/Array"
import { eqString, eqNumber } from "fp-ts/lib/Eq"

type Maybe<T> =
  | {
      _tag: "Just"
      value: T
    }
  | {
      _tag: "Nothing"
    }

type Foo = { _tag: "Nothing" }

const x_ = { _tag: "Nothing" }

type Quux<T> = Maybe<T> | Foo

// type Foo = "barA" | "barB" | "barC"

// type Bar_ = "barA" | "baz"

// type FooBar_ = Foo | Bar_

type State<T> = {
  isLoading: boolean
  error: Error | null
  value: undefined | T
}

uniq(eqNumber)([1, 2, 3, 2, 9, 0, 1]) //?

!!" " //?
