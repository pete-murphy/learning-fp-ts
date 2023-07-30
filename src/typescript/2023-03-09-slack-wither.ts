import {
  readonlyArray as RA,
  option as O,
  taskEither as TE,
} from "fp-ts";
import { pipe } from "fp-ts/function";
import fs from "fs/promises";

const fileExists = (
  path: string,
): TE.TaskEither<unknown, boolean> =>
  pipe(
    TE.tryCatch(
      () => fs.stat(path),
      err => err,
    ),
    TE.map(stats => stats.isFile()),
  );

pipe(
  ["foo.txt", "bar.zip", "baz.ts"],
  RA.wither(TE.ApplicativePar)(fileName =>
    pipe(
      fileExists(fileName),
      TE.map(exists =>
        exists ? O.some(fileName) : O.none,
      ),
    ),
  ),
);
