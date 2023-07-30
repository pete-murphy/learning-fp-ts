// Is there anything I can do to get the type to narrow correctly here?

import { O, pipe } from "./lib/fp-ts-imports";

export interface SessionTypes {
  public: {};
}

// eslint-disable-next-line no-redeclare
export interface SessionTypes {
  // user: { userSpecificProperty: boolean };
}

type SessionValue = PublicSessionValue | UserSessionValue
type PublicSessionValue = { type: "public", ... } 
type UserSessionValue = { type: "user", ... } 

const isUser = (session: SessionValue): session is UserSessionValue 

{
  [type in keyof SessionTypes]: {
    type: type;
    properties: SessionTypes[type];
  };
}[keyof SessionTypes];

declare const useSession: () => SessionValue;

const isUser = (
  session: SessionValue,
): session is { type: "user"; properties: SessionTypes["user"] } =>
  session.type === "user";

const handleGet = () =>
  pipe(
    useSession(),
    O.fromPredicate(isUser),
    O.map(user => user.properties.userSpecificProperty),
  );

// const handleGet: () => O.Option<"public" | "user">
