import * as t from "io-ts"

const codec: t.Type<{ foo: string }> = t.type({
  foo: t.string
})

codec.decode({
  foo: "asdf",
  bar: 9
})
//?
