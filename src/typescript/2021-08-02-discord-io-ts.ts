import { pipe } from "fp-ts/lib/function"
import * as t from "io-ts"

// type Foo = {
//   foo: number
//   bar: string
//   baz?: boolean
//   quux?: number
// }

const foo = pipe(
  t.intersection([
    t.type({
      foo: t.number,
      bar: t.string,
    }),
    t.partial({
      baz: t.boolean,
      quuz: t.number,
    }),
  ])
)

type Foo = t.TypeOf<typeof foo>
