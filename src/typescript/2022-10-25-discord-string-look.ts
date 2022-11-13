import { O, pipe, RA } from "./lib/fp-ts-imports";

type LookForString = () => O.Option<string>;

const lookForFirstString = (...args: LookForString[]): O.Option<string> =>
  pipe(
    args,
    RA.findFirstMap(look => look())
  );
