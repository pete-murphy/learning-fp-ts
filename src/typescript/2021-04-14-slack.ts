import { pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"

// Foo = (a + 1) * (a + 1) * (a + 1)

declare type Foo = {
  a: O.Option<string>
  b: O.Option<string>
  c: O.Option<string>
}

declare function mkFoo(): Foo

pipe(mkFoo(), options => {
  if (O.isSome(options.a) && O.isNone(options.b) && O.isNone(options.c)) {
    // a
  }
  if (O.isSome(options.a) && O.isSome(options.b) && O.isNone(options.c)) {
    // a & b
  }
  // etc
})

type ThreeBool = `${true | false}, ${true | false}, ${true | false}`

pipe({a: O.some(1), b: O.none, c: O.some(9)}, {a, b, c} => {
  switch (
    `${O.isSome(options.a)}, ${O.isSome(options.b)}, ${O.isSome(
      options.c
    )}` as ThreeBool
  ) {
    case `true, true, true`:
      return options.a.value

    default:
      break
  }
  // if (O.isSome(options.a) && O.isNone(options.b) && O.isNone(options.c)) {
  //   // a
  // }
  // if (O.isSome(options.a) && O.isSome(options.b) && O.isNone(options.c)) {
  //   // a & b
  // }
  // // etc
})

// // Bar = (a + 1)^3
// declare type Bar = (x: "a" | "b" | "c") => O.Option<string>
// declare function mkBar(): Bar

// pipe(mkBar(), options => {
//   if (O.isSome(options("a")) && O.isNone(options.b) && O.isNone(options.c)) {
//     // a
//   }
//   if (O.isSome(options.a) && O.isSome(options.b) && O.isNone(options.c)) {
//     // a & b
//   }
//   // etc
// })
