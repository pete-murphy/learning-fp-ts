import * as tr from "@simspace/trout/index";
import { E, pipe, RA, RNEA } from "./lib/fp-ts-imports";
import * as P from "fp-ts/pipeable";
import * as Alt from "fp-ts/Alt";
import * as Alte from "fp-ts/Alternative";
import { match } from "@simspace/matchers";

const Root = pipe(
  tr.RootPath,
  tr.path("users"),
  tr.queryParam("page", tr.numberRC),
  tr.queryParamOp("pageSize", tr.numberRC),
);

const UserDetails = pipe(Root, tr.param("userId", tr.stringRC));

const UserPreferences = pipe(UserDetails, tr.path("preferences"));

const AltV = E.getAltValidation(RNEA.getSemigroup<tr.RouteDecodeFailure>());
// const AltV = E.(RNEA.getSemigroup<tr.RouteDecodeFailure>())
const E_alt = P.alt(AltV);

const decode = (routeString: string) =>
  pipe(
    routeString,
    tr.decodeUrl(UserPreferences),
    E.map(() => "UserPreferences"),
    E.mapLeft(RNEA.of),
    E_alt(() =>
      pipe(
        routeString,
        tr.decodeUrl(UserDetails),
        E.map(() => "UserDetails"),
        E.mapLeft(RNEA.of),
      ),
    ),
    E_alt(() =>
      pipe(
        routeString,
        tr.decodeUrl(Root),
        E.map(() => "Root"),
        E.mapLeft(RNEA.of),
      ),
    ),
  );

// console.log(JSON.stringify(decode("/users/asdf/29922929"), null, 2));

const decode_ = (routeString: string) =>
  pipe(
    [
      ["UserPreferences", UserPreferences] as const,
      ["UserDetails", UserDetails] as const,
      ["Root", Root] as const,
    ],
    RNEA.map(([tag, route]) =>
      pipe(
        routeString,
        tr.decodeUrl(route),
        E.map(result => ({ tag, ...result })),
        E.mapLeft(RNEA.of),
      ),
    ),
    RNEA.matchLeft((head, tail) => Alt.altAll(AltV)(head)(tail)),
    x => x,
    E.map(
      match({
        Root: () => ({}),
        UserDetails: x => ({}),
        UserPreferences: x => ({}),
      }),
    ),
  );

// const decode_ =
//   Alt.altAll(AltV)(
