import { O, pipe, Str } from "./lib/fp-ts-imports"

const o1 = O.some("foo")
const o2 = O.some("foo")

const concat = (
  o1: O.Option<string>,
  o2: O.Option<string>
) =>
  pipe(
    o1,
    O.match(
      // onNone o1
      () =>
        pipe(
          o2,
          O.match(
            // onNone o2
            () => O.none,
            // onSome o2
            a2 => O.some(a2)
          )
        ),
      // onSome o1
      s1 =>
        pipe(
          o2,
          O.match(
            // onNone o2
            () => O.some(s1),
            // onSome o2
            s2 =>
              O.some(Str.Monoid.concat(s1, s2))
          )
        )
    )
  )

// f_(O.some("foo"), O.some("bar")) //?
// f_(O.none, O.some("bar")) //?
// f_(O.some("foo"), O.none) //?
// f_(O.none, O.none) //?

// import {
//   option as O,
//   applicative as Apl,
//   string as Str
// } from "fp-ts"
// import { pipe } from "fp-ts/function"

// pipe(
//   O.some("foo"),
//   O.alt(() => O.some("bar"))
// )

// const M = Apl.getApplicativeMonoid(O.Applicative)(
//   Str.Monoid
// )
// M.concat(O.some("foo"), O.some("bar"))

// M.concat(O.none, O.some("bar")) //?
