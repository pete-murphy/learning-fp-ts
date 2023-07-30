// type ParsePhoneNumber = (phoneNumber: string) => { prefix: string, number: string, country: string }

// ...and I want to lift this function to some type for example :

// type User {
//   phoneNumber: string
// }
// type UserParsed {
//   phoneNumber: { prefix: string, number: string, country: string }
// }

// -> I would love to use a Lens from monocle-ts and use modify however I can't because the types doesn't match.

// -> I could also use Iso or io-ts but it's annoying having to describe two transformations if I need only one. I could maybe use io-ts/Encoder for that?

// -> I gave spectacles-ts a try but I have "Type instantiation is excessively deep and possibly infinite." and the syntax looks a bit weird to me.

import * as Optic from "@fp-ts/optic";

type PhoneNumber = string;
type PhoneNumberParsed = { prefix: string; number: string; country: string };
type User = { phoneNumber: PhoneNumber };
type UserParsed = { phoneNumber: PhoneNumberParsed };

const _phoneNumber = Optic.lens<
  User,
  UserParsed,
  PhoneNumber,
  PhoneNumberParsed
>(
  user => user.phoneNumber,
  phoneNumber => user => ({ ...user, phoneNumber }),
);

declare const user: User;
declare const parsePhoneNumber: (phoneNumber: PhoneNumber) => PhoneNumberParsed;

Optic.modify(_phoneNumber)(parsePhoneNumber)(user);
