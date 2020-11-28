import { Option, none, option, some, alt } from "fp-ts/lib/Option"
import { sequenceT, sequenceS } from "fp-ts/lib/Apply"
import { lookup } from "fp-ts/lib/Record"

const n: Option<number> = none
const s: Option<string> = none

// Doesn't type check
const foo: Option<Array<string>> = sequenceT(option)(n, s)

type Key<A> = string

type Dog = "Dog"
type Cat = "Cat"

const dogTable: Record<Key<Dog>, string> = {
  a: "Affenpischer",
  b: "Basenji",
  c: "Cairn",
}

const catKey: Key<Cat> = "a"
const dogKey: Key<Dog> = "a"

lookup(dogKey, dogTable)
lookup(catKey, dogTable)
