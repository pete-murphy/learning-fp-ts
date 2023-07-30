// Manav Chawla 5:20 PM Hi everyone, is there something like
//   TaskEither.traverseArray but for records? Something like TE.traverseRecord?
//   I know i can Record.mapWithIndex + Record.sequence(TE.ApplicativePar) but
//   was trying to use Traversable to create such a composition for records..

import {
  readonlyRecord as RR,
  ord as Ord,
  taskEither as TE,
} from "fp-ts";
import { pipe } from "fp-ts/function";

declare const record: Record<string, number>;
declare const fn: (
  n: number,
) => TE.TaskEither<string, string>;

pipe(record, RR.traverse(TE.ApplicativePar)(fn));
