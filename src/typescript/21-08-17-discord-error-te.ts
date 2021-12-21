import * as TE from "fp-ts/TaskEither"

type PostgrestError = {
  readonly message: string
  readonly details: string
  readonly hint: string
}

export const queryToTE = <T>({
  data,
  error,
}: {
  readonly data: T | null
  readonly error: PostgrestError | null
}): TE.TaskEither<string, T> =>
  error
    ? TE.left(`${error.message} - ${error.details} - ${error.hint}`)
    : TE.right(data!)

export const storageQueryToTE = <T>({
  data,
  error,
}: {
  readonly data: T | null
  readonly error: Error | null
}): TE.TaskEither<string, T> =>
  error
    ? TE.left(`${error.name} - ${error.message} - ${error.stack}`)
    : TE.right(data!)
