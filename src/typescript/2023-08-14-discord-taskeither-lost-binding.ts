// Hello, I'm studying fp-ts for something like 2 weeks before presenting it to
// the team for a new project. I ran into a case where I feel I could have some
// better way of doing things, like in this simple example :

// type User = {name: string, adress: Option<Address>}
// type UserAddress = {id: string}
// type Address = {streetName: string}

// const getUserInfo = pipe(
//     TE.Do,
//     TE.bind('user', () => getUserById("1")),
//     TE.bind('userAddress', ({user}) =>
//         O.match(
//             () => TE.left(new Error('user has no address filled')),
//             (adress: Address) => getUserAddress(user.address.id)
//         )(user.address),
//     ),
//     TE.map(({user, userAddress}) => {
//         return {
//             userProfile: {
//                 name: user.name,
//                 addressId: toNullable(user.address)!.id, // ugly, is there a better way ?
//                 street: userAddress.streetName,
//             }
//           }
//     })
// );

// here user.address is an Option but the case where it's none is handled in the
// process but yet it will bother me inside my whole pipe(..)

import { option as O, taskEither as TE } from "fp-ts";
import { pipe } from "fp-ts/function";

type User = { name: string; address: O.Option<Address> };
type Address = { id: string };
type UserAddress = { streetName: string };

declare const getUserById: (
  id: string,
) => TE.TaskEither<Error, User>;
declare const getUserAddress: (
  id: string,
) => TE.TaskEither<Error, UserAddress>;

const getUserInfo = pipe(
  TE.Do,
  TE.apS("user", getUserById("1")),
  TE.bind("address", ({ user }) =>
    TE.fromOption(
      () => new Error("user has no address filled"),
    )(user.address),
  ),
  TE.bind("userAddress", ({ address }) =>
    getUserAddress(address.id),
  ),
  TE.map(({ user, address, userAddress }) => {
    return {
      userProfile: {
        name: user.name,
        addressId: address.id,
        street: userAddress.streetName,
      },
    };
  }),
);
