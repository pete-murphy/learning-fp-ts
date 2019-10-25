import { sequenceT } from "fp-ts/lib/Apply";
import { array } from "fp-ts/lib/Array";
import { nonEmptyArray, fromArray } from "fp-ts/lib/NonEmptyArray";
import { map, some } from "fp-ts/lib/Option";

const sequenceArr = sequenceT(array);
const sequenceNEA = sequenceT(nonEmptyArray);

// https://blog.ploeh.dk/2018/10/15/an-applicative-password-list/
const variations: Array<Array<string>> = [
  ["P", "p"], // Did I capitalize the first letter?
  ["a", "4"], // Second letter could be either of these
  ["ssw"], // I'm sure about 'ssw'
  ["o", "0"], // Either of these
  ["rd"], // No variants here
  ["", "!"] // Maybe ends in exclamation
];

// Show me all the possible combinations

// This works but doesn't type check
sequenceArr(...variations).map(v => v.join("")); //?

const variationsNEA = fromArray(variations);
// Wat
map(sequenceNEA)(variationsNEA); //?

// This 👍
array
  .sequence(array)(variations)
  .map(v => v.join("")); //?
