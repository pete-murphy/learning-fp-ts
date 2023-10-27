// heya folks trying to implement a specification pattern and i know im
// overthinking it....havn't done FP for a minute and trying to get my head back
// in the game...the output currently returns Either<E, T[]> but how can i get
// this to short circuit at the first Error and prevent further computations?

import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

export type Specification<T> = (
  item: T,
) => E.Either<Error, T>;

export function satisfiesAll<T>(
  ...specs: Specification<T>[]
) {
  return (item: T) =>
    pipe(
      specs,
      E.traverseArray(spec => spec(item)),
    );
}
