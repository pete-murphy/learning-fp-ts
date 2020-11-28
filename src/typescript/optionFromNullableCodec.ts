import { optionFromNullable } from "io-ts-types"
import * as t from "io-ts"
import { none, some } from "fp-ts/lib/Option"

const nullableStringCodec = optionFromNullable(t.string)

nullableStringCodec.decode("hello") //?
nullableStringCodec.decode(some("hello")) //?

nullableStringCodec.encode(some("hello")) //?
nullableStringCodec.encode(none) //?
