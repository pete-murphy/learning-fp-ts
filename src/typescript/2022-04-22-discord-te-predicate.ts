import * as te from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

declare const prismaClient: {
  user: {
    count: (_: {}) => Promise<number>
  }
}
type EmailAlreadyInUseError = "EmailAlreadyInUseError"
type FetchFailed = "FetchFailed"
type Err = FetchFailed | EmailAlreadyInUseError

const checkEmail = (
  email: string
): te.TaskEither<Err, string> =>
  pipe(
    te.tryCatch(
      () => prismaClient.user.count({ where: { email } }),
      () => "FetchFailed" as const
    ),
    te.chainW(count =>
      count === 0
        ? te.right(email)
        : te.left("EmailAlreadyInUseError" as const)
    )
  )

// te.fromPredicate<
//   EmailAlreadyInUseError,
//   string
// >(
//   email =>
//     pipe(
//       () =>
//         prismaClient.user.count({
//           where: {
//             email
//           }
//         }),
//       t.map(count => count === 0)
//     ),
//   getEmailAlreadyInUseError
// )
