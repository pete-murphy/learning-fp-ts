// If I want to decode a JSON array that has 2 separate schemas A and B into an
// Either<A, B>, is there an easy way to go about doing this? Currently I'm
// putting together a function that does some ugly mapping and folding to
// acheive this.

import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import { either as E } from "fp-ts";

export const SponsoredBill = t.type({
  number: t.string,
});

export type ISponsoredBill = t.TypeOf<typeof SponsoredBill>;

export const Amendment = t.type({
  amendmentNumber: t.string,
});

export type IAmendment = t.TypeOf<typeof Amendment>;

export type IActivity = E.Either<
  ISponsoredBill,
  IAmendment
>;

export const decodeArrayEitherAB = (
  json: unknown,
): t.Validation<ReadonlyArray<IActivity>> =>
  pipe(
    json,
    t.array(t.unknown).decode,
    E.chainW(
      E.traverseArray(jsonItem =>
        pipe(
          jsonItem,
          // If an array item successfully decodes as A, tag as Left
          SponsoredBill.decode,
          E.map(E.left),
          // otherwise attempt to decode as B
          E.altW(() =>
            pipe(
              jsonItem,
              Amendment.decode,
              // and tag as Right if it succeeds
              E.map(E.right),
            ),
          ),
        ),
      ),
    ),
  );

//   pipe(
//     DecoderA,
//
//     D.map(E.left),
//
//     D.alt(() =>
//       pipe(
//         DecoderB,
//
//         D.map((b: IAmendment) => E.right<A, B>(b)),
//       ),
//     ),
//   ),
// );

// // pipe();
