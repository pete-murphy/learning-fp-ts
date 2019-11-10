import { getMonoid, array } from "fp-ts/lib/Array";
import { left, right, getWitherable, either, Either } from "fp-ts/lib/Either";

enum ValidationError {
  InvalidEmail = "InvalidEmail",
  InvalidPhone = "InvalidPhone"
}

// Not robust validation
const validatePhone = (
  phoneNumber: string
): Either<ValidationError, Array<string>> =>
  phoneNumber.length > 5
    ? left(ValidationError.InvalidPhone)
    : right([phoneNumber]);
const validateEmail = (
  emailAddress: string
): Either<ValidationError, Array<string>> =>
  emailAddress.includes("@")
    ? left(ValidationError.InvalidPhone)
    : right([emailAddress]);

const W = getWitherable(getMonoid<ValidationError>());

const badPhone = "123";
const badEmail = "emailatemail.com";

const invalidExample = {};

either.sequence(array)([
  validatePhone("123121231233"),
  validateEmail("asdf@sdf")
]); //?
