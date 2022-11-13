import argon2 from "argon2";
import { E, TE, pipe, T, O, RA, flow } from "./lib/fp-ts-imports";
import * as TO from "fp-ts/TaskOption";

const Party = {
  find: (params: { where: { email: string } }): Promise<NT.Party[]> =>
    Promise.resolve([
      { passwordHash: "beefcake", id: "1", email: "", name: "" },
    ]),
};

namespace NT {
  export type Party = {
    passwordHash: string | null;
    id: string;
    email: string;
    name: string;
  };
}

async function verifyPassword_(
  password: string,
  party: NT.Party,
): Promise<E.Either<Error, NT.Party>> {
  const passwordMatch = await argon2.verify(party.passwordHash ?? "", password);
  return E.fromPredicate(
    () => passwordMatch,
    reason => new Error(String(reason)),
  )(party);
}

const verifyPassword =
  (password: string) =>
  (party: NT.Party): TO.TaskOption<NT.Party> =>
    pipe(
      () => argon2.verify(party.passwordHash ?? "", password),
      T.map(passwordMatch => (passwordMatch ? O.some(party) : O.none)),
    );

const findParty = (email: string): TO.TaskOption<NT.Party> =>
  pipe(() => Party.find({ where: { email: "" } }), T.map(RA.head));

declare const email: string;
declare const password: string;
declare const createJWT: (party: NT.Party) => E.Either<Error, string>;

const result = pipe(
  TE.Do,
  TE.apS(
    "party",
    pipe(
      findParty(email),
      TE.fromTaskOption(() => ({ tag: "FailedToFindParty" as const })),
    ),
  ),
  TE.bindW("verifiedParty", ({ party }) =>
    pipe(
      verifyPassword(password)(party),
      TE.fromTaskOption(() => ({ tag: "FailedToVerifyParty" as const })),
    ),
  ),
  TE.bindW("token", ({ verifiedParty }) =>
    pipe(
      createJWT(verifiedParty),
      TE.fromEither,
      TE.mapLeft(error => ({ tag: "FailedToCreateJWT" as const, error })),
    ),
  ),
  TE.map(({ verifiedParty, token }) => ({ party: verifiedParty, token })),
);

const result_ = pipe(
  TO.Do,
  TO.apS("_party", findParty(email)),
  TO.bind("verifiedParty", ({ _party }) => verifyPassword(password)(_party)),
  TO.bind("token", ({ verifiedParty }) =>
    TO.fromEither(createJWT(verifiedParty)),
  ),
  TO.match(
    () => ({}),
    ({ verifiedParty, token }) => ({ party: verifiedParty, token }),
  ),
);

// {
//   const passwordMatch = await
//   return E.fromPredicate(
//     () => passwordMatch,
//     reason => new Error(String(reason))
//   )(party);
// }
