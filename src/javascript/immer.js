import produce from "immer"

const mkObject = depth =>
  depth === 0
    ? "foo"
    : {
        foo: mkObject(depth - 1),
        bar: mkObject(depth - 1),
        baz: mkObject(depth - 1),
      }

const examplePrevState = mkObject(5)

console.time("manual")
const nextStateManual = { ...examplePrevState }
nextStateManual.foo.foo.foo.foo.foo = 5
console.log(nextStateManual)
console.timeEnd("manual")

console.time("immer")
const nextStateImmer = produce(examplePrevState, draftState => {
  draftState.foo.foo.foo.foo.foo = 5
})
console.log(nextStateImmer.foo.foo.foo.foo)
console.timeEnd("immer")

JSON.stringify(nextStateManual) == JSON.stringify(nextStateImmer) //?
