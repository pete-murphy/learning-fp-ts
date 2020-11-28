import { ReadonlyRecord } from "fp-ts/lib/ReadonlyRecord"
import { ReadonlyNonEmptyArray } from "fp-ts/lib/ReadonlyNonEmptyArray"
import { reader } from "fp-ts/lib/Reader"
import { sequenceS } from "fp-ts/lib/Apply"
import { constant } from "fp-ts/lib/function"

type Foo = {
  foo: number
}

const example: (
  x: ReadonlyRecord<string, ReadonlyNonEmptyArray<number>>
) => Foo = sequenceS(reader)({
  foo: constant(9),
})
