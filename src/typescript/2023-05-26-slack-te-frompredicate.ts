import { taskEither as TE, either as E } from "fp-ts";
import { flow, pipe } from "fp-ts/function";

declare const op1: (n: number) => number;
declare const op2: (n: number) => number;
declare const op3: (n: number) => number;
declare const opN: (n: number) => E.Either<Err, number>;

type Err = {
  tag: "NotPrime";
  value: number;
};
declare const someNumber: number;
declare const isPrime: (n: number) => boolean;
declare const altNumber: number;

pipe(
  someNumber,
  TE.fromPredicate(isPrime, value => ({
    tag: "NotPrime" as const,
    value,
  })),
  TE.alt(() => TE.of(altNumber)),
  TE.chainEitherKW(flow(op1, op2, op3, opN)),
);
