import { Option, fold, some, getOrElse, option, none } from "fp-ts/lib/Option"
import React from "react"
import { lookup } from "fp-ts/lib/Record"
import { Functor } from "fp-ts/lib/Functor"
import { left, Either, right, either } from "fp-ts/lib/Either"
import { sequenceS } from "fp-ts/lib/Apply"
import { traverse_ } from "fp-ts/lib/Foldable"
import { io } from "fp-ts/lib/IO"
import { identity } from "fp-ts/lib/function"
import fetch from "node-fetch"
import { task } from "fp-ts/lib/Task"
import { array } from "fp-ts/lib/Array"

const nums = [1, 2, 3, 4, 5]

// Function that tells me if something is in an array
nums.includes(3) //?
nums.includes(6) //?

// These return True | False
// includes : (Array<A>, A) => boolean
const arrayIncludes = (arr: Array<A>, value: A): boolean => arr.includes(value)

// includes : (Set<A>, A) => boolean
const setIncludes = (set: Set<A>, value: A): boolean => set.has(value)

// // These return Some(Value) | None
// // lookup : (Record<K, V>, K) => Option<V>
// const recordLookup = <K, V>(record: Record<K, V>, key: K): Option<V> =>

const recordLookup = <K extends string | symbol | number, V>(
  record: Record<K, V>,
  key: K
): V | undefined => record[key]

const recordLookupOption = <K extends string, V>(
  record: Record<K, V>,
  key: K
): Option<V> => lookup(key, record)

const r: Record<string, string> = {
  a: "apple",
  b: "banana",
}

console.log(recordLookup(r, "c"))
console.log(recordLookupOption(r, "c"))
console.log(recordLookupOption(r, "b"))

// * Use JSX examples (conditional rendering)
// * Different ways of "getting values out of" an Option/Either/RemoteData
// *
const Foo = () => <h1>{recordLookup(r, "c")}</h1>
const Bar = () =>
  fold(
    () => <p>Not found</p>,
    (str: string) => <h1>{str}</h1>
  )(recordLookupOption(r, "b"))
const Baz = () => (
  <h1>{getOrElse(() => "Not found")(recordLookupOption(r, "b"))}</h1>
)

//

r
some("Foo") //?

type Person = { id: number; name: string; city: string }

const nameById: Record<string, string> = {
  "1": "Alice",
  "2": "Bob",
  "3": "Carol",
  "4": "Dave",
}

const cityById: Record<string, string> = {
  "1": "Boston",
  "2": "Chicago",
  "3": "Miami",
}

// const Bar = () => <h1>{fold recordLookupOption(r, "c")}</h1>

// const Array: Functor<Array<A>> = {
//   map:
// }

// ADTs (Algebraic Data Types)
// Option, RemoteData, Either, (IO)
// computations that might fail

// Type classes
// Eq, Ord, Semigroup, Monoid

// Booleans:     False | True
// Options:      False | True(A)
// .              null | A
// Eithers:   False(B) | True(A)
// RemoteData: Initial | Pending | False(B)  | True(A)

const recordLookupEither = <K extends string, V>(
  record: Record<K, V>,
  key: K
): Either<string, V> => {
  const result = record[key]
  if (result !== undefined) {
    return right(result)
  }
  return left(`Failed to find key: ${key}`)
}

const personFromId = (id: string): Either<string, Person> => {
  const name = nameById[id] ? right(nameById[id]) : left("failed to find name")
  const city = recordLookupEither(cityById, id)
  return sequenceS(either)({
    id: right(Number(id)),
    name,
    city,
  })
}

personFromId("0") //?

let state = ""

traverse_(io, option)(none, io.of(console.log))() //?
const f = traverse_(io, option)(
  some("http://www.google.com/"),
  (str: string) => () =>
    fetch(str).then(rs => rs.text())
      .catch(s => {
        s
      })
      .then(foo => {
        console.log(foo) //?
        foo !== undefined && state = foo;
        return foo
      })
)
// f() //?
f
state

let log = ""
const append = (s: string) => () => (log += s)
traverse_(io, array)(["a", "b", "c"], append)()
log
