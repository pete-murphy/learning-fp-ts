import { Eq, Str } from "./lib/fp-ts-imports"

export type Example = {
  key: string
  foo: string
  bar: number
  baz: boolean
}

const eqExampleByKey: Eq.Eq<Example> = Eq.struct({
  key: Str.Eq
})

const foo: Example = {
  key: "sadf",
  foo: "",
  bar: 1,
  baz: true
}
