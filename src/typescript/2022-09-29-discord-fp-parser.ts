// How do I convert this string to this object?

// // Have:
// "Bunch of text\nBegin Foo\n    Some text 1\n    Some text 2\nEnd Foo\nBegin Foo\n    Some text 3\n    Some text 4\nEnd Foo\nMore text"

// // Want:
// {
//     stuff: ["Bunch of text", "More text"],
//     foo: [
//         ["Some text 1", "Some text 2"],
//         ["Some text 3", "Some text 4"]
//     ]
// }

import { apply } from "fp-ts";
import { flow, pipe } from "fp-ts/function";
import * as PC from "parser-ts/char";
import { run } from "parser-ts/code-frame";
import * as PS from "parser-ts/string";
import * as P from "parser-ts/Parser";

const P_Do: P.Parser<string, {}> = P.of({});
const P_apS = apply.apS(P.Applicative);

type GradedPoints = {
  points: number;
  correct: boolean;
};

const inputText =
  "Bunch of text\nBegin Foo\n    Some text 1\n    Some text 2\nEnd Foo\nBegin Foo\n    Some text 3\n    Some text 4\nEnd Foo\nMore text";

const beginFooP: P.Parser<string, {}> = PS.string("Begin Foo\n");
const endFooP: P.Parser<string, {}> = PS.string("End Foo\n");
const linesP: P.Parser<string, string[][]> = P.sepBy(
  PS.string("\n"),
  pipe(
    PS.spaces,
    P.chain(_ => P.takeUntil(x => x === "\n"))
  )
);
const fooSectionP = P.between(beginFooP, endFooP)(linesP);

// const fooSectionP = pipe(
//   PS.string("Begin Foo\n"),
//   P.chain(_ => P.many(lineP)),
//   P.chainFirst(_ => PS.string("End Foo\n"))
// );

const fooP = pipe(
  P_Do,
  P_apS("preamble", P.many(linesP)),
  P_apS("foo", P.many(fooSectionP)),
  P_apS("postamble", P.many(linesP)),
  P.map(({ preamble, foo, postamble }) => ({
    stuff: [...preamble, ...postamble],
    foo
  }))
);

// pipe(fooP, PS.run(inputText)) //?
run(fooP, inputText); //?

// run(fooP, )
