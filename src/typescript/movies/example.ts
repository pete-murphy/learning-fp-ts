import {
  console as Console,
  date as Dt,
  either as E,
  eq as Eq,
  json as J,
  ord as Ord,
  readonlyArray as RA,
  readonlyNonEmptyArray as RNEA,
  readonlyRecord as RR,
  readonlyTuple as RTup,
  string as Str,
  task as T,
  taskEither as TE,
  taskOption as TO,
} from "fp-ts";
import * as D from "io-ts/Decoder";
import { DateFromISOString } from "io-ts-types";
import { flow, identity, pipe } from "fp-ts/function";
import fs from "fs/promises";

type Effect<A> = TE.TaskEither<unknown, A>;

const readFile = (path: string): Effect<string> =>
  TE.tryCatch(() => fs.readFile(path, "utf-8"), identity);

type Movie = {
  readonly year: number;
  readonly director: string;
  readonly country: string;
  readonly id: string;
  readonly title: string;
  readonly modified: Date;
  readonly created: Date;
  readonly thumbnailURL: string;
  readonly detailsURL: string;
};

const DecoderDate = pipe(
  D.string,
  D.parse(str => {
    const date = new Date(str);
    return date.getTime() !== undefined
      ? E.of(date)
      : D.failure(str, "DateString");
  }),
);

const DecoderMovie: D.Decoder<unknown, Movie> = D.type({
  country: D.string,
  created: DecoderDate,
  modified: DecoderDate,
  director: D.string,
  id: D.string,
  title: D.string,
  detailsURL: D.string,
  year: D.number,
  thumbnailURL: D.string,
});

// const process = (movies: ReadonlyArray<Movie>) => {
//   const titles = new Set(movies.map(m => m.title))

//   for (const title of titles) {
//     const matchingMovies =
//   }
// }

pipe(
  readFile("./movies.json"),
  TE.chainEitherKW(J.parse),
  TE.chainEitherKW(flow(D.array(DecoderMovie).decode, E.mapLeft(D.draw))),
  TE.map(RNEA.groupBy(movie => movie.title)),
  TE.map(RR.filter(xs => xs.length > 1)),
  TE.map(RR.toEntries),
  TE.map(
    RA.sort<readonly [string, unknown]>(pipe(Str.Ord, Ord.contramap(RTup.fst))),
  ),
  TE.map(RR.fromEntries),
  TE.map(
    RR.map(
      flow(
        RA.sort<Movie>(
          pipe(
            Dt.Ord,
            Ord.reverse,
            Ord.contramap(movie => movie.modified),
          ),
        ),
        RA.uniq(
          pipe(
            Str.Eq,
            Eq.contramap(movie => movie.detailsURL),
          ),
        ),
      ),
    ),
  ),
  TE.match(console.error, console.log),
)();
