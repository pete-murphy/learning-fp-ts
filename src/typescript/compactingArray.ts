import { Option, none, some } from "fp-ts/lib/Option";
import { compact, flatten } from "fp-ts/lib/Array";

const xs: Array<Option<number | Array<number>>> = [
  some(0),
  none,
  some([1, 2]),
  some(3),
  none
];

compact(xs).flat();
