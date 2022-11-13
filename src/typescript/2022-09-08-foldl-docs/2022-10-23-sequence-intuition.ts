import {
  readonlyArray as RA,
  number as N,
  option as O,
  readonlyRecord as RR,
  readonlyTuple as RT,
  task as T
} from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import * as L from "fp-ts-foldl";

const someDictionary: Record<string, number> = {
  foo: 1,
  bar: 2,
  baz: 3
};

const sumWithLabel = RT.sequence(L.Applicative)([L.sum, "sum"]);
pipe([1, 2, 3], L.foldArray(sumWithLabel)); //?
