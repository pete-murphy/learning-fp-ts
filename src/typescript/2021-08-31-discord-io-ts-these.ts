import * as t from "io-ts"
import * as Th from "fp-ts/These"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import * as RA from "fp-ts/ReadonlyArray"
import { constVoid, flow, pipe } from "fp-ts/function"
import { RD } from "./lib/fp-ts-imports"

const UserModel = t.type({
  name: t.string,
  email: t.string
})

type UserModel = t.TypeOf<typeof UserModel>

const validateUsers: (
  users: ReadonlyArray<UserModel>
) => ReadonlyArray<Th.These<Error, UserModel>> = RA.map(
  flow(
    UserModel.decode,
    E.mapLeft(_ => Error("Invalid user")),
    Th.FromEither.fromEither
  )
)

const validateUsers_: (
  users: ReadonlyArray<UserModel>
) => Th.These<
  ReadonlyArray<Error>,
  ReadonlyArray<UserModel>
> = Th.traverseReadonlyArrayWithIndex(
  RA.getSemigroup<Error>()
)((_, user) =>
  pipe(
    user,
    UserModel.decode,
    E.mapLeft(_ => [Error("Invalid user")]),
    Th.FromEither.fromEither
  )
)

// const responseBody = t.(...)

// How do I write a validator that yeilds the following type?
// type ResponseBody = {
//   users:
// }

// declare const someOption: O.Option<number>
// declare const setSomeState: (n: number) => void

// const noOpIO = () => void 0
// const flip =
//   <A, B, C>(f: (a: A) => (b: B) => C) =>
//   (b: B) =>
//   (a: A) =>
//     f(a)(b)

// const x = pipe(
//   someOption,
//   O.match(
//     () => noOpIO,
//     flip(() => setSomeState)
//   )
// )

// const b = () => pipe(
//  someOption,
//  O.map(setSomeState)
// )
