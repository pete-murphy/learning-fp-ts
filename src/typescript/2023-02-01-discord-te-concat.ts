import {
  semigroup as Sg,
  apply as Ap,
  taskEither as TE,
  boolean as B,
  readonlyNonEmptyArray as RNEA,
  either as E,
  task as T,
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

// const errorMonoid: M.Monoid<Error> = {
//   concat: (_e1, e2) => e2,
//   empty: new Error('empty')
// }

// const valueMonoid: M.Monoid<boolean> = {
//   concat: (v1, v2) => v1 || v2,
//   empty: false
// }

// const run = (tasks: TE.TaskEither<Error, boolean>[]) => {
//   const Applicative = TE.getApplicativeTaskValidation(T.ApplicativePar, errorMonoid)
//   return pipe(tasks, A.sequence(Applicative), TE.map(M.concatAll(valueMonoid)))
// }

// const E_getAltSemigroup = <E, A>(
//   sgE: Sg.Semigroup<E>,
//   sgA: Sg.Semigroup<A>,
// ): Sg.Semigroup<E.Either<E, A>> => {
//   // const sg = E.getApplySemigroup(sgA);
//   const sg = Ap.getApplySemigroup(E.Apply)(sgA)
//   const alt = pipeable.alt(E.getAltValidation(sgE))
//   return {
//     concat: (x, y) =>
//       pipe(
//         sg.concat(x, y),
//         alt(() => x),
//       ),
//   };
// };

const E_getAltSemigroup = <E, A>(
  sgE: Sg.Semigroup<E>,
  sgA: Sg.Semigroup<A>,
): Sg.Semigroup<E.Either<E, A>> => ({
  concat: (x, y) =>
    x._tag === "Left" && y._tag === "Left"
      ? E.left(sgE.concat(x.left, y.left))
      : x._tag === "Right" && y._tag === "Right"
      ? E.right(sgA.concat(x.right, y.right))
      : E.alt(() => y)(x),
});

const valueSemigroup: Sg.Semigroup<boolean> = B.SemigroupAny;
const errorSemigroup: Sg.Semigroup<Error> = {
  concat: (x, y) => Error(x.message + y.message),
};
const eitherSemigroup = E_getAltSemigroup(errorSemigroup, valueSemigroup);

const taskEitherSemigroup = Ap.getApplySemigroup(T.ApplyPar)(eitherSemigroup);

const r1 = TE.right(false);
const r2 = TE.right(true);
const l1 = TE.left(Error("💩"));
const l2 = TE.left(Error("❌"));

pipe([r1, r2], RNEA.concatAll(taskEitherSemigroup))().then(console.log);
pipe([r1, l2], RNEA.concatAll(taskEitherSemigroup))().then(console.log);
pipe([l1, r2], RNEA.concatAll(taskEitherSemigroup))().then(console.log);
pipe([l1, l2], RNEA.concatAll(taskEitherSemigroup))().then(console.log);

// const getTESemigroup = <E, A>(sgE: Sg.Semigroup<E>, sgA: Sg.Semigroup<A>): Sg.Semigroup<TE.TaskEither<E, A>> => ({
//   concat: (x, y) =>
// })

// pipe([l1, l2], Alt.altAll(TE.Alt)(TE.right(false)))().then(console.log);
// pipe([l1, l2], RNEA.traverse(TE.ApplicativePar)(x => x))().then(console.log);

const el1 = E.left(Error("💩"));
const el2 = E.left(Error("❌"));
const er1 = E.right(false);
const er2 = E.right(true);

// const ZZZ = Ap.getApplySemigroup(E.Apply)(valueSemigroup);
// ZZZ.concat(el1, el2); //?

// const Z_alt = pipeable.alt(E.getAltValidation(errorSemigroup));
// pipe(
//   el1,
//   Z_alt(() => el2),
// );
// pipe(
//   er1,
//   Z_alt(() => el2),
// ); //?
// pipe(
//   er1,
//   Z_alt(() => er2),
// ); //?

// const Zsg = getESemigroup(errorSemigroup, valueSemigroup);
// Zsg.concat(el1, el2); //?
// Zsg.concat(er1, el2); //?
// Zsg.concat(er1, er2); //?
// Zsg.concat(el1, er2); //?

// // E.getCompactable()
// const LLL = Ap.getApplySemigroup(T.ApplyPar)(
//   getESemigroup(errorSemigroup, valueSemigroup),
// );

// pipe(
//   el1,
//   E.alt(() => el2)
// ) //?
// const E_alt = pipeable.alt(E.getAltValidation(errorSemigroup))
// pipe(
//   el1,
//   E_alt(() => el2)
// )

// pipe(
//   er1,
//   E_alt(() => el2)
// ) //?

// pipe(
//   er1,
//   E_alt(() => er2)
// ) //?
