import { O, pipe, TE } from "./lib/fp-ts-imports";

type Err = "Err";
const Failure = {
  unauthorized: (msg: string) => (): Err => "Err",
};

export function refreshTokensFnBuilder(
  api: AuthenticationApi,
  sessionDecoder: IDecoder<Session>,
  tokensDecoder: IDecoder<AuthTokens>,
  storageClient: IStorageClient,
) {
  return () => {
    return pipe(
      // fetch active session from storage (if any)
      storageClient.get("ER_SESSION", sessionDecoder),
      TE.fromOption(() => Failure.unauthorized("No active session found.")()),

      // add session to context for use later
      TE.bindTo("session"),

      // add tokens to context for use later
      TE.bind("tokens", ctx =>
        pipe(
          TE.tryCatch(
            () =>
              // in-house api
              api.refreshSession("false", {
                refreshToken: ctx.session.tokens.refreshToken,
                username: ctx.session.user.email,
              }),
            Failure.fromAxios(
              "An error occured when attempting to refresh the current session",
            ),
          ),
          TE.map(response => response.data),

          // convert unknown data to strongly typed parsed data using zod
          TE.chainEitherK(tokensDecoder.decode),
        ),
      ),

      // use context to merge old session and new tokens together
      TE.chainIOEitherK(({ session, tokens }) =>
        IOE.fromEither(
          storageClient.save("ER_SESSION", { ...session, tokens }),
        ),
      ),
    );
  };
}
