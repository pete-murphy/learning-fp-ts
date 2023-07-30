import { pipe } from "fp-ts/function";
import {
  taskEither as TE,
  readonlyArray as RA,
  option as O,
} from "fp-ts";

declare const askIfExists: (
  a: string,
) => TE.TaskEither<unknown, boolean>;
declare const things: ReadonlyArray<string>;

declare const r: ReadonlyArray<O.Option<string>>;

const filterIfExists = (things: ReadonlyArray<string>) =>
  pipe(things, RA.filterE(TE.ApplicativeSeq)(askIfExists));
pipe(
  r,
  RA.compact,
  filterIfExists,
  TE.map(e => e),
);
