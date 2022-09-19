import { strong as S, reader as R } from "fp-ts"
import { pipe, tuple } from "fp-ts/function"

pipe(
  "foo",
  S.fanOut(R.Strong, R.Category)(
    str => str.toUpperCase().concat("bar"),
    str => str.length
  )
) //-> [ "FOObar", 3 ]

pipe(
  tuple("foo", 1),
  S.split(R.Strong, R.Category)(
    str => str.concat("bar"),
    n => n + 100
  )
) //-> [ "foobar", 101 ]
