import { E, Mn, O, RA, Sg, Th } from "./ssstuff/fp-ts-imports"
import * as F from "fp-ts/function"
import * as t from "io-ts"
// import { formatValidationErrors } from "io-ts-reporters"
import * as PR from "io-ts/PathReporter"

const lift = <E, B, A = unknown>(
  check: (a: A) => E.Either<E, B>
): ((a: A) => Th.These<ReadonlyArray<E>, O.Option<B>>) =>
  F.flow(
    check,
    E.foldW(e => Th.both(RA.of(e), O.none), F.flow(O.some, Th.right))
  )

const userV = t.type({ name: t.string })
type User = t.TypeOf<typeof userV>

const liftedDecoder = lift(userV.decode)

const users = [
  { name: "validUserName" },
  { name: 9 },
  { name: "anotherValidName" },
  { notName: "" },
]

const result: Th.These<ReadonlyArray<t.Errors>, ReadonlyArray<User>> = F.pipe(
  users,
  RA.wither(Th.getApplicative(RA.getSemigroup<t.Errors>()))(liftedDecoder)
  // Th.mapLeft(RA.map(formatValidationErrors))
) //?

const result_ = F.pipe(
  users,
  RA.wither(Th.getApplicative(RA.getSemigroup<t.Errors>()))(liftedDecoder),
  Th.mapLeft(RA.chain(PR.failure))
) //?
