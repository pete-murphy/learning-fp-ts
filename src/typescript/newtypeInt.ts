import { Newtype, prism, iso } from "newtype-ts";
import { option } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
// import { negate } from "fp-ts/lib/Ring";

interface Integer
  extends Newtype<{ readonly Integer: unique symbol }, number> {}

const isInteger = (n: number) => Number.isInteger(n);

// prismInteger: Prism<number, Integer>
const prismInteger = prism<Integer>(isInteger);

// oi: Option<Integer>
const oi = prismInteger.getOption(2);

const f = (i: Integer) => console.log(i);

// f(2); // static error: Argument of type '2' is not assignable to parameter of type 'Integer'
option.map(oi, f); //?
// const optPosA = prismPositive.getOption(-2); //?

interface PositiveNumber
  extends Newtype<{ readonly PositiveNumber: unique symbol }, number> {}

const isPositive = (n: number) => n > 0;
const prismPositive = prism<PositiveNumber>(isPositive);

const isoPositive = iso<PositiveNumber>();

const pos2 = isoPositive.wrap(2);

const negate = (n: number) => -n;

isoPositive.modify(negate)(pos2); //?

// const optPos2 = prismPositive.getOption(2); //?
