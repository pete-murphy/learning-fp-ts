import * as St from "fp-ts/State"
import type { State } from "fp-ts/State"
import { pipe } from "fp-ts/lib/function"

import * as SRTE from "fp-ts/StateReaderTaskEither"
import type { StateReaderTaskEither } from "fp-ts/StateReaderTaskEither"

type FooBar = State<number, string>
const fooBar: FooBar = s => (s % 5 === 0 ? ["foo", s + 1] : ["bar", s + 1])
const execute =
  <S>(s: S) =>
  <A>(ma: State<S, A>): S =>
    ma(s)[1]
const evaluate =
  <S>(s: S) =>
  <A>(ma: State<S, A>): A =>
    ma(s)[0]
const get: <S>() => State<S, S> = () => s => [s, s]
console.log(evaluate(5)(fooBar)) // "foo"
console.log(execute(3)(fooBar)) // 4
console.log(get()(1)) // [1, 1]
