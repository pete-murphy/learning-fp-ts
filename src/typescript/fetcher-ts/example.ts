import { Fetcher } from "fetcher-ts/lib/fetcher"
import * as io from "io-ts"

// This is main business model – basically, any interface serializable to JSON you can imagine
type User = { name: string }
// And this is a model for HTTP 422 response code – it contains some internal code plus correlation ID from logging system
type FourTwoTwo = { code: number; correlationId: string }

// Type of possible server responses. It should extend `Result<Code, T>` from `fetcher`:
type GetUserResult =
  | { code: 200; payload: User[] } // 200 OK – we got the result
  | { code: 400; payload: Error } // 400 Bad Request – we did something wrong
  | { code: 401; payload: [Error, string] } // 401 Unauthorized – we tried requesting a resource we don't have access to
  | { code: 422; payload: FourTwoTwo } // 422 Unprocessable entity – business logic error from some internal system

// `io-ts` validators for 200 and 422 responses.
// Please note that they are optional – if they are not passed to `.handle()`, the validation stage will be skipped.
const TUsers = io.array(io.type({ name: io.string }))
const TFourTwoTwo = io.type({ code: io.number, correlationId: io.string })

const fetchCall =
  // We create an instance of `Fetcher` class and parameterize it with our response type and final transformation result we want:
  new Fetcher<GetUserResult, string>("https://example.com")
    // In 200 handler we need to pass a function from `User[]` to `string`, as specified in `Fetcher` parameters:
    .handle(200, users => users.map(u => u.name).join(", "), TUsers)
    // In 400 handler we need to handle plain `Error`:
    .handle(400, err => err.message)
    // In 422 we need to deal with internal error code and correlation ID:
    .handle(
      422,
      ({ correlationId }) => correlationId,
      TFourTwoTwo,
      // For the sake of brewity I use non-null assertion here; in real code you should check for presence:
      async res => ({
        code: +res.headers.get("x-code")!,
        correlationId: res.headers.get("x-correlation-id")!,
      })
    )
    // In 401 handler we get as a response name of permission we lack:
    .handle(
      401,
      ([err, permission]) => `You lack ${permission}. Also, ${err.message}`
    )
    // We CANNOT specify explicit handlers for codes we didn't describe in the `GetUserResult` type:
    // .handle(500, () => `Argument of type '500' is not assignable to parameter of type 'never'`)
    // However, we can use `discardRest` to specify a "fallback" thunk which will be executed for any codes which are not explicitly handled:
    .discardRest(() => "42")
    // `Fetcher<T, A>` is a functor in `A`, i.e. could be transformed into `Fetcher<T, B>`:
    .map(s => s.length)
    // Finally, we can use `run` to get a `Promise<[Result, Option<io.Errors>]>`:
    .run()

// Here `n` will be a `number`, and `errors` will either be undefined, or an instance of `io.Errors`:
fetchCall.then(([n, errors]) => console.log(n, errors))
