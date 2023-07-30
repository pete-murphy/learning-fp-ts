import { constVoid } from "fp-ts/lib/function";
import { E, O, pipe } from "./lib/fp-ts-imports";

// E.match(
//   (err) => pipe(C.info(err)(), () => O.none),
//   () => O.some(),
// ),
declare const x: E.Either<Error, unknown>;
let z = pipe(
  x,
  E.bimap(error => console.info(error), constVoid),
  O.fromEither,
);
