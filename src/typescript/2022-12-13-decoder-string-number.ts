import { pipe } from "fp-ts/function";
import * as Str from "fp-ts/string";
import { NonEmptyString } from "io-ts-types";
import * as D from "io-ts/Decoder";
import * as G from "io-ts/Guard";
import { N } from "./lib/fp-ts-imports";

const StringNumberDecoder = pipe(
  D.string,
  D.map(str => (str.trim() === "" ? NaN : +str)),
  D.compose(D.number),
);

StringNumberDecoder.decode("9"); //-> right(9)
StringNumberDecoder.decode("13e-2"); //-> right(0.13)
StringNumberDecoder.decode(" "); //-> left(..)
StringNumberDecoder.decode("asdf"); //-> left(..)
