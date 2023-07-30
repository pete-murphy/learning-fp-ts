import {
  semigroup as Sg,
  alt as Alt,
  apply as Ap,
  taskEither as TE,
  boolean as B,
  readonlyArray as RA,
  readonlyNonEmptyArray as RNEA,
  either as E,
  task as T,
  pipeable,
} from "fp-ts";
import { pipe } from "fp-ts/function";

/*
Hey all :wave:
I'm trying to combine multiple TaskEither in the following way:
if at least one is right, return it's value
if more than one are right, use provided valueMonoid to concat them
if all are left, sequence using errorMonoid
if array of TaskEither contains both left and right instances, disregard left results and concat all right results
So far, I have something like this:
const errorMonoid: M.Monoid<Error> = {
  concat: (_e1, e2) => e2,
  empty: new Error('empty')
}

const valueMonoid: M.Monoid<boolean> = {
  concat: (v1, v2) => v1 || v2,
  empty: false
}

const run = (tasks: TE.TaskEither<Error, boolean>[]) => {
  const Applicative = TE.getApplicativeTaskValidation(T.ApplicativePar, errorMonoid)
  return pipe(tasks, A.sequence(Applicative), TE.map(M.concatAll(valueMonoid)))
}
This works when all tasks are right or when all are left , but fails in this example
  const result = await run([TE.left(new Error()), TE.right(true)])()
  assert.deepStrictEqual(result, E.right(true)) // fails!
Is there an elegant way to achieve this?
Thanks!
*/

const errorMonoid: M.Monoid<Error> = {
  concat: (_e1, e2) => e2,
  empty: new Error("empty"),
};

E.getWitherable();
