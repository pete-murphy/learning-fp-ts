import { E, pipe, RA, Sg, T, TE } from "./fp-ts-imports";
import * as Alt from "fp-ts/Alt";
import * as Alternative from "fp-ts/Alternative";
import { identity } from "fp-ts/lib/function";

const tes: ReadonlyArray<TE.TaskEither<number, string>> = [
  TE.right("foo"),
  TE.left(0),
  TE.right("bar"),
  TE.left(1),
];

T.sequenceArray(tes)().then(console.log); //?
TE.sequenceArray(tes)().then(console.log); //?
const A1 = TE.getApplicativeTaskValidation(
  T.ApplyPar,
  RA.getSemigroup<number>(),
);
pipe(tes, RA.traverse(A1)(TE.mapLeft(RA.of)))(); //?

const A2 = TE.getAltTaskValidation(
  RA.getSemigroup<number>(),
);
pipe(
  tes,
  RA.map(TE.mapLeft(RA.of)),
  Alt.altAll(A2)(TE.left([])),
)(); //?
// pipe(tes, RA.foldMap(Alternative.getAlternativeMonoid(A2)(Sg.first))(TE.mapLeft(RA.of)))() //?

pipe(tes, T.sequenceArray, T.map(E.sequenceArray));

const rejectFooP = Promise.reject("foo");
const resolveBarP = Promise.resolve("bar");
Promise.allSettled([rejectFooP, resolveBarP]); //?

const rejectFooT = TE.tryCatch(() => rejectFooP, identity);
const resolveBarT = TE.tryCatch(
  () => resolveBarP,
  identity,
);
T.sequenceArray([rejectFooT, resolveBarT])(); //?
