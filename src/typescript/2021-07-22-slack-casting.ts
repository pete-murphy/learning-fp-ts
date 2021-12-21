import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"
import * as Ap from "fp-ts/Apply"
import * as R from "fp-ts/Record"

type Failure = string

type Client = { disconnect: () => TE.TaskEither<Failure, void> }

type Module = () => TE.TaskEither<Failure, Client>

export const run =
  <A, K extends string, M extends Record<K, Module>>(
    f: (clients: Record<K, Client>) => TE.TaskEither<Failure, A>,
    keys: K[]
  ) =>
  (modules: M) =>
    TE.bracket(
      pipe(
        keys.reduce<Record<K, TE.TaskEither<Failure, Client>>>(
          (r, k) => ((r[k] = modules[k]()), r),
          {} as Record<K, TE.TaskEither<Failure, Client>>
        ),
        R.sequence(TE.ApplicativePar)
        // FIXME: Without this cast, the `f` in the `use` slot will
        // complain about `disconnect` not being in `{}`
        // a => a as TE.TaskEither<Failure, Record<K, Client>>
      ),
      f,
      clients =>
        pipe(
          keys.reduce<TE.TaskEither<Failure, void>[]>(
            (r, k) => (r.push(clients[k].disconnect()), r),
            []
          ),
          TE.sequenceArray,
          TE.map(() => undefined)
        )
    )

// Tests

declare function fFoo(context: { foo: Client }): TE.TaskEither<Failure, number>

declare function fBar(context: { bar: Client }): TE.TaskEither<Failure, string>

declare function fFooBar(context: {
  foo: Client
  bar: Client
}): TE.TaskEither<Failure, string[]>

declare const modules: Record<"foo" | "bar", Module>

// Correct: fFoo requires 'foo'
export const r1 = run(fFoo, ["foo"])(modules)

// Correctly fails: 'bar' is missing
export const r2 = run(fBar, ["foo"])(modules)

// Correct: excess 'foo' is ignored
export const r3 = run(fBar, ["foo", "bar"])(modules)

// Correct: fFooBar requires both 'foo' and 'bar'
export const r4 = run(fFooBar, ["foo", "bar"])(modules)
