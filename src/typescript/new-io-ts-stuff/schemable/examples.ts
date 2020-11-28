import { optionFromNullable } from "io-ts-types"
import { iso, Newtype } from "newtype-ts"

import * as t from "io-ts"
import { none, some } from "fp-ts/lib/Option"

// import {
//   AppSchema,
//   GuardSchemable,
//   interpreter,
//   createSchema,
//   EqSchemable, DecoderSchemable
// } from "./exports"

// interface USD extends Newtype<{ readonly USD: unique symbol }, number> {}

// const FooSchema: AppSchema<{ money: USD }> = createSchema(s =>
//   s.type({
//     money: s.newtype(s.number, iso<USD>()),
//   })
// )

// const guardFoo = interpreter(GuardSchemable)(FooSchema)

// const eqFoo = interpreter(EqSchemable)(FooSchema)

// const goo = { money: 20 }
// const gooUSD = { money: iso<USD>().wrap(29) }

const foo = optionFromNullable(t.string)

foo.decode(null) //?
foo.is(none) //?
foo.is(some("asdf")) //?
