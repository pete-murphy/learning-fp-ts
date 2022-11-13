import {
  readonlyNonEmptyArray as RNEA,
  readonlyArray as RA,
  task as T,
  taskEither as TE,
  console as Console,
  stateReaderTaskEither as SRTE,
  state as St
} from "fp-ts";
import { pipe } from "fp-ts/function";
import * as Q from "@simspace/collections/Queue";

pipe(RNEA.range(1, 10), SRTE.traverseArray());
