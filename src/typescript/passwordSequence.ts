import { sequenceT } from "fp-ts/lib/Apply";
import { array, map as mapArray } from "fp-ts/lib/Array";
import { nonEmptyArray, fromArray } from "fp-ts/lib/NonEmptyArray";
import { option } from "fp-ts/lib/Option";
import { flow } from "fp-ts/lib/function";
import { monoidString, fold } from "fp-ts/lib/Monoid";

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
sequenceArr(...(variations as { 0: string } & any)).map(vs =>
  ((vs as unknown) as Array<string>).join("")
); //?

const variationsNEA = fromArray(variations);
// Wat
option.map(variationsNEA, flow(nonEmptyArray.sequence(array))); //?

// This 👍
array
  .sequence(array)(variations)
  .map(vs => vs.join("")); //?

// or
flow(
  array.sequence(array),
  (xss: Array<Array<string>>) =>
    xss.map(xs => array.reduce(xs, monoidString.empty, monoidString.concat))
)(variations); //?

// or
flow(
  array.sequence(array),
  (xs: Array<Array<string>>) => array.map(xs, fold(monoidString))
)(variations); //?

// or
flow(
  array.sequence(array),
  mapArray(fold(monoidString))
)(variations); //?
