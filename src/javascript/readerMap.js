import * as R from "ramda"

const mapNot = f => R.compose(R.not, f)
const includes = match => str => str.includes(match)
const includesFoo = includes("Foo")
const notIncludesFoo = mapNot(includesFoo)

includesFoo("abc") //?
notIncludesFoo("abc") //?

// const notEvenLength = mapNot(evenLength)

// notEvenLength("ab") //?
