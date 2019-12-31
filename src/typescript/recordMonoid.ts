import * as R from "fp-ts/lib/Record"
import { getLastSemigroup } from "fp-ts/lib/Semigroup"

// R.getMonoid(getLastSemigroup<string>()).concat(
//   { a: "a", b: "b" },
//   { a: "2", c: "dddddd" }
// ) //?

const foo = () => "foo " + bar
foo() //?
const bar = "bar"
