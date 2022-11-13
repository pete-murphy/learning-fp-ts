import {
  readonlyNonEmptyArray as RNEA,
  readonlyArray as RA,
  task as T,
  taskEither as TE,
  console as Console,
  stateReaderTaskEither as SRTE,
  state as St,
  option as O
} from "fp-ts";
import { pipe } from "fp-ts/function";
import * as Q from "@simspace/collections/Queue";

pipe(
  [
    () => 1,
    () => 2,
    () => {
      throw Error("oops");
    }
  ],
  O.traverseArray(n => (n() > 1 ? O.none : O.some(n())))
); //?

pipe(
  [
    () => 1,
    () => 2,
    () => {
      throw Error("😬");
    }
  ],
  O.traverseArray(n => (n() > 1 ? O.none : O.some(n())))
); //?
