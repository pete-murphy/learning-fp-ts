// I have an issue with the t.OutputOf and newtype'` - It doesn't seem to infer the primitive types. See example:

import * as t from "io-ts";
import * as E from "fp-ts/Either";
import * as Nt from "newtype-ts";
import * as tt from "io-ts-types";

interface FirstName
  extends Nt.Newtype<{ readonly Username: unique symbol }, tt.NonEmptyString> {}
const firstName = tt.fromNewtype<FirstName>(tt.NonEmptyString);

const Person = t.type({
  firstName: tt.mapOutput(tt.NonEmptyString, Nt.iso<FirstName>().wrap, ""),
  lastName: t.string
});

const toPerson = (
  data: t.OutputOf<typeof Person>
): E.Either<t.Errors, t.TypeOf<typeof Person>> => Person.decode(data);
// const toPerson = (data: t.OutputOf <typeof Person>): E.Either<t.Errors, t.TypeOf<typeof Person>> => Person.decode(data)

toPerson({
  /**
   * firstName error
   * Type 'string' is not assignable to type 'NonEmptyString'.
    Type 'string' is not assignable to type 'Brand<NonEmptyStringBrand>'.
   */
  firstName: "steve",
  lastName: "dave"
});
