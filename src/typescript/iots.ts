import * as t from "io-ts"
import { either, Either } from "fp-ts/lib/Either"
import { eqString } from "fp-ts/lib/Eq"
import {
  some,
  fold,
  none,
} from "fp-ts/lib/Option"

const string = new t.Type<
  string,
  string,
  unknown
>(
  "string",
  // (input: unknown): input is string => typeof input === "string",
  t.string.is,
  // `t.success` and `t.failure` are helpers used to build `Either` instances
  (input, context) =>
    typeof input === "string"
      ? t.success(input)
      : t.failure(input, context),
  // `A` and `O` are the same, so `encode` is just the identity function
  t.identity
)

string.decode(90) //?

const NumberFromString = new t.Type<
  number,
  string,
  unknown
>(
  "NumberFromString",
  t.number.is,
  (u, c) =>
    either.chain(t.string.validate(u, c), s => {
      const n = +s
      return isNaN(n)
        ? t.failure(
            u,
            c,
            "cannot parse to a number"
          )
        : t.success(n)
    }),
  String
)

NumberFromString.decode("99") //?

enum Foo {
  Bar = "fooBar",
  Baz = "fooBaz",
}

const fooCodec = t.union([
  t.literal(Foo.Bar),
  t.literal(Foo.Baz),
])

fooCodec.decode("fio") //?
fooCodec.decode("fooBar") //?
fooCodec.decode("fooBaz") //?
fooCodec.decode(Foo.Bar) //?

// const fooCodec = new t.Type<Foo, string, unknown>(
//   "fooCodec",
//   t.union([
//     t.literal(Foo.Bar),
//     t.literal(Foo.Baz),
//   ]).is,
//   (u, c) =>
//     either.chain(t.string.validate(u, c), s =>
//       fold<Foo, Either<t.Errors, Foo>>(
//         () =>
//           t.failure(u, c, "cannot parse to Foo"),
//         // (foo: Foo) => t.success(foo)
//         t.success
//       )(
//         eqString.equals(s, "bar")
//           ? some<Foo>(Foo.Bar)
//           : eqString.equals(s, "baz")
//           ? some<Foo>(Foo.Baz)
//           : none
//       )
//     ),
//   (f: Foo) =>
//     eqString.equals(f, Foo.Bar) ? "bar" : "baz"
// )

fooCodec.decode("fio") //?
fooCodec.decode("fooBar") //?
fooCodec.decode("bar") //?
fooCodec.decode("baz") //?
