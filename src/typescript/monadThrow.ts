import { Do } from "fp-ts-contrib/lib/Do";
import {
  either,
  fromOption,
  left,
  toError
  // throwError
} from "fp-ts/lib/Either";
import { none } from "fp-ts/lib/Option";

const foo = toError(Do(either)
  .bindL("message", () => fromOption(() => "something went wrong")(none))
  .return(either.throwError));

foo; //?
