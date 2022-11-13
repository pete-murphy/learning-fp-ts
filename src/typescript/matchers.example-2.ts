import { pipe } from "fp-ts/function";
import { match } from "@simspace/matchers";

type Tagged = { readonly tag: "foo" } | { readonly tag: "bar" };
declare const tagged: Tagged;
declare const f: (_: { example: void }) => void;

const x = pipe(
  tagged,
  // match.w({
  //   bar: () => ({

  //   })
  // }),
  f
);
