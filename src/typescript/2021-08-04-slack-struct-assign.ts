import * as Struct from "fp-ts/struct"

type A = {
  a: `A${number}`
}
type B = {
  b: "B"
}

type Data = {
  a: A
  b: B
}
type Override = {
  [K in keyof Data]: Partial<Data[K]>
}

const overrides: Override = { a: {}, b: {} }
const data: Data = { a: { a: "A1" }, b: { b: "B" } }

const S = Struct.getAssignSemigroup<Data>()
S.concat(data, overrides)
