import { O, pipe } from "./lib/fp-ts-imports";

const trace =
  (msg: string) =>
  <A>(a: A) => {
    console.log(msg, a);
    return a;
  };

declare const someOption: O.Option<number>;
pipe(
  someOption,
  trace("here"),
  O.map(n => n + 1),
  trace("after adding 1")
);
