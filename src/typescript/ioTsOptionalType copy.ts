import * as t from "io-ts"
import * as fp from "fp-ts"

type GeneratedApiType = {
  foo: number
  bar?: string
  baz?: string
}

const apiTypeCodec: t.Type<GeneratedApiType> = t.intersection([
  t.type({
    foo: t.Int,
  }),
  t.partial({
    bar: t.string,
  }),
])

type DomainType = t.TypeOf<typeof apiTypeCodec>

const apiResponse: unknown = {
  foo: 9,
  // baz: 912091029,
}

console.log(
  fp.pipeable.pipe(
    apiResponse,
    apiTypeCodec.decode,
    fp.either.map((x: DomainType) => (x.baz ? x.baz.toLocaleUpperCase() : "")) // Shouldn't be able to access baz here
  )
)
