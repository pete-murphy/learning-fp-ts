import { E, pipe, IOE } from "./ssstuff/fp-ts-imports"

type NotAuthenticated = {}
type User = {
  readonly name: string
}
type A = {
  readonly A: string
}

// updateA :: a -> Either Error a
const updateA = (a: A): E.Either<Error, A> => E.right(a) // not doing anything for now

declare const user: User
// authenticate :: Token -> Either NotAuthenticated User
const authenticate = (token: string): E.Either<NotAuthenticated, User> =>
  E.right(user)

// withAuthenticated :: (User -> z) -> Token -> Either NotAuthenticated z
const withAuthenticated =
  <Z>(f: (u: User) => Z) =>
  (token: string): E.Either<NotAuthenticated, Z> =>
    pipe(authenticate(token), E.map(f))

// updateOnlyIfAuthenticated :: Token -> Either NotAuthenticated (a -> Either Error a)
const updateOnlyIfAuthenticated = withAuthenticated(() => updateA)

pipe(updateOnlyIfAuthenticated("mytoken"), apMA("updatethis"))

// log :: User -> a -> void
const log =
  (user: User) =>
  (a: A): void =>
    console.log(`${a} was modified by ${user.name}`)

function apMA(
  arg0: string
): (a: E.Either<NotAuthenticated, (a: A) => E.Either<Error, A>>) => unknown {
  throw new Error("Function not implemented.")
}

declare const a: A

pipe(
  IOE.Do,
  IOE.apS("authenticatedUser", IOE.fromEither(authenticate("someToken"))),
  IOE.apSW("updatedA", IOE.fromEither(updateA(a))),
  IOE.chainFirstW(({ authenticatedUser, updatedA }) =>
    IOE.fromIO(() => log(authenticatedUser)(updatedA))
  ),
  IOE.map(
    ({ authenticatedUser, updatedA }) => {} //
  )
)
