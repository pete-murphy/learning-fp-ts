import { flow, pipe } from "fp-ts/function";
import * as C from "parser-ts/char";
import * as CF from "parser-ts/code-frame";
import * as S from "parser-ts/string";
import * as P from "parser-ts/Parser";
import { Ap, E } from "./lib/fp-ts-imports";

const P_Do: P.Parser<any, {}> = P.succeed({});
const P_apS = Ap.apS(P.parser);

type Host =
  | { tag: "localhost" }
  | { tag: "ipv4"; value: [number, number, number, number] };

const octetP = P.expected(
  pipe(
    S.int,
    P.filter(n => n >= 0 && n <= 255),
  ),
  "valid octet (integer between 0 and 255)",
);

const ipv4P = pipe(
  P_Do,
  P_apS("octet1", octetP),
  P.apFirst(S.string(".")),
  P_apS("octet2", octetP),
  P.apFirst(S.string(".")),
  P_apS("octet3", octetP),
  P.apFirst(S.string(".")),
  P_apS("octet4", octetP),
  P.map(
    (_): Host => ({
      tag: "ipv4",
      value: [_.octet1, _.octet2, _.octet3, _.octet4],
    }),
  ),
);

const localhostP = pipe(
  S.string("localhost"),
  P.map((_): Host => ({ tag: "localhost" })),
);

const hostP = pipe(
  ipv4P,
  P.alt(() => localhostP),
);

pipe(CF.run(ipv4P, "0.0.0.300"), E.match(console.error, console.log)); //?

pipe(CF.run(ipv4P, "localhost"), E.match(console.error, console.log)); //?

pipe(CF.run(ipv4P, "0.0.0.0"), E.match(console.error, console.log)); //?

// const hostSchema = S.union(S.literal("localhost"), ipv4Schema);
// S.decodeOrThrow(hostSchema)("0.0.0.0"); //?
// S.decodeOrThrow(hostSchema)("localhost"); //?
