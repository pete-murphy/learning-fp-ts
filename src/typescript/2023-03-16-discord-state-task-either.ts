import {
  state as St,
  stateT as StT,
  taskEither as TE,
  apply as Ap,
} from "fp-ts";

const liftToStateTE =
  <S, E, A>(
    st: St.State<S, TE.TaskEither<E, A>>,
  ): StT.StateT2<TE.URI, S, E, A> =>
  s => {
    const [te, s_] = st(s);
    return Ap.sequenceT(TE.ApplyPar)(te, TE.of(s_));
  };

import { identity, pipe } from "fp-ts/function";

declare const x: <S, E, A>() => St.State<
  S,
  TE.TaskEither<E, St.State<S, TE.TaskEither<E, A>>>
>;

const flattened = pipe(
  x<number, Error, string>(),
  liftToStateTE,
  StT.map(TE.Functor)(liftToStateTE),
  StT.chain(TE.Monad)(identity),
);

// const x: St.State<
//   S,
//   TE.TaskEither<E, St.State<S, TE.TaskEither<E, A>>>
// > = n => [TE.of(m => [TE.of("sdf"), m * 3]), n + 100];

// StT.getStateM(TE.Monad).chain(x, identity)(10)(); //?
