import { Option, none, option, some, alt } from "fp-ts/lib/Option";
import { sequenceT, sequenceS } from "fp-ts/lib/Apply";

const n: Option<number> = none;
const s: Option<string> = none;

// Doesn't type check
const foo: Option<Array<string>> = sequenceT(option)(n, s);
