import { flow } from "fp-ts/lib/function"
import * as O from "fp-ts/lib/Option"
import * as E from "fp-ts/lib/Either"
import Option = O.Option
import Either = E.Either

// const safeProp = <P extends string>(path: P) => <
//   O extends Record<string, unknown>
// >(
//   obj: O
// ): Option<O[P]> => O.fromNullable(obj[path])
const prop = <O extends Record<string, unknown | null>, P extends keyof O>(
  path: P
) => (obj: O): O[P] => obj[path]

// Placeholder types
type HttpRequest = {
  params: {
    id: number
  }
}
type User = number
type DomainError = string

export const getUser_: (req: HttpRequest) => Either<DomainError, User> = flow(
  prop("params"),
  // O.chain(safeProp("id")),
  // ...,
  E.fromOption(() => "Domain error")
)

getUser_({
  params: {
    id: 1,
  },
})

safeProp("params")({})

// export const getUser: (req: HttpRequest) => Either<DomainError, User> = flow(
//   safeProp("params"),
//   O.chain(safeProp("id")),
//   // ...,
//   E.fromOption(() => "Domain error")
// )) //?

// getUser({
//   params: {
//     id: 1
//   }
// })
