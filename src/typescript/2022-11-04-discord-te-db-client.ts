import { E, pipe, T, TE } from "./lib/fp-ts-imports";

type Client = "Client";

function getClient(): TE.TaskEither<never, Client> {
  throw new Error("Function not implemented.");
}
function getGrantee(client: Client): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}
function getScopes(client: Client): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}
function getGrantors(client: Client): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}
function getPermissions(
  client: Client,
  grantee: unknown,
  grantors: unknown
): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}
function updateAudit(
  client: Client,
  username: any,
  scope: unknown,
  permissions: unknown,
  updateType: any
): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}

function submitDelegations(
  appConfig: any,
  request: any
): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}

function commit(client: unknown): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}

function cleanup(client: Client): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}

function doSomethingWith(result: {
  readonly grantee: unknown;
  readonly grantors: unknown;
  readonly permissions: unknown;
  readonly scope: unknown;
}): TE.TaskEither<never, unknown> {
  throw new Error("Function not implemented.");
}
const username = "";
const updateType = "";
const appConfig = "";
const request = "";

const z = pipe(
  getClient(),
  TE.chain(client =>
    pipe(
      TE.Do,
      TE.bind("grantee", () => getGrantee(client)),
      TE.bind("grantors", () => getGrantors(client)),
      TE.bind("permissions", ({ grantee, grantors }) =>
        getPermissions(client, grantee, grantors)
      ),
      TE.bind("scope", () => getScopes(client)),
      TE.chainFirst(({ scope, permissions }) =>
        updateAudit(client, username, scope, permissions, updateType)
      ),
      TE.chainFirst(() => submitDelegations(appConfig, request)),
      TE.matchEW(
        () => cleanup(client),
        result => doSomethingWith(result)
      )
    )
  )
);
