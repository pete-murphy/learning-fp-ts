import { O, pipe, TE } from "./lib/fp-ts-imports"

type TypeOfRight<X> = X extends TE.TaskEither<
  unknown,
  infer A
>
  ? A
  : never
declare const x: () => TE.TaskEither<Error, string>
declare const y: TypeOfRight<ReturnType<typeof x>>

declare const someValue: O.Option<number>

const spy =
  (msg: string) =>
  <A>(a: A): A => {
    console.log(msg, a)
    return a
  }

pipe(
  someValue,
  spy("someValue")
  // ...
)

export {}
