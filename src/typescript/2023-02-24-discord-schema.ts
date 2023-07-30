// What is the best way to get an Either from a TaskEither? I have a pipe of TaskEithers, and at the end I want to get the Either and write it to the console. I know I could call the TaskEither, and await the promise, but it doesn't feel very elegant

import * as S from "@fp-ts/schema";
import { parseNumber } from "@fp-ts/schema/data/String";
import { pipe } from "fp-ts/function";

const NumberFromString = pipe(S.string, parseNumber);

const portSchema = pipe(
  S.number,
  S.int(),
  S.greaterThanOrEqualTo(0),
  S.lessThan(2 ** 16),
);
const port = S.decodeOrThrow(portSchema)(65535);

const octetSchema = pipe(
  S.number,
  S.int(),
  S.greaterThanOrEqualTo(0),
  S.lessThanOrEqualTo(255),
);

// This produces the following Error: Unsupported template literal span Refinement
const ipv4Schema_ = S.templateLiteral(
  S.number,
  S.literal("."),
  S.number,
  S.literal("."),
  S.number,
  S.literal("."),
  S.number,
);
const ipv4Schema = pipe(
  ipv4Schema_,
  S.pattern(/(([01]?[0-9][0-9]?|2[0-4][0-9]|25[0-5])\.){3}/),
);

const hostSchema = S.union(S.literal("localhost"), ipv4Schema);
S.decodeOrThrow(hostSchema)("0.0.0.0"); //?
S.decodeOrThrow(hostSchema)("localhost"); //?
