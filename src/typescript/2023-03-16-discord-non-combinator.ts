import * as I from "./monocle-with-non/Iso";
import * as Op from "monocle-ts/Optional";
import * as L from "monocle-ts/Lens";
import * as T from "monocle-ts/Traversal";

import {
  number as N,
  record as R,
  option as O,
  readonlyArray as RA,
  array as A,
} from "fp-ts";
import { pipe } from "fp-ts/function";

const foo = {
  bar: [1, 2, 3, 4],
};

pipe(
  T.id<typeof foo>(),
  T.prop("bar"),
  T.traverse(A.Traversable),
  T.modify(n => n * 2),
)(foo); //-> { bar: [ 2, 4, 6, 8 ] }
