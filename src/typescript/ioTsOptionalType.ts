import * as t from "io-ts"

const myTypeCodec: t.Type<{ foo: string; bar?: string }> = t.intersection([
  t.type({
    foo: t.string,
  }),
  t.partial({
    bar: t.string,
  }),
])

// Any way of making this a type error?
const myTypeCodec_: t.Type<{
  foo: string
  bar?: string
  baz?: string
}> = t.intersection([
  t.type({
    foo: t.string,
  }),
  t.partial({
    bar: t.string,
  }),
])

const one: t.Branded<number, t.IntBrand> = 1 as t.Branded<number, t.IntBrand>

console.log(one)
