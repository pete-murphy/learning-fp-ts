import { map } from "fp-ts/lib/Array";
import { identity } from "fp-ts/lib/function";
import { negate } from "fp-ts/lib/Ring";
import { invert } from "fp-ts/lib/Ordering";

const arr = [true, false, false, false, true];

// map(booleanA)(arr); //?
