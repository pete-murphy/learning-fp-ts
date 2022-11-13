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

import { flow, pipe } from "fp-ts/function";

const trimLines = (str: string) => str.split("\n").map(str_ => str_.trim());

const inputText =
  "Bunch of text\nBegin Foo\n    Some text 1\n    Some text 2\nEnd Foo\nBegin Foo\n    Some text 3\n    Some text 4\nEnd Foo\nMore text";

type Result = { stuff: string[]; foo: string[][] };
const result = inputText
  .split("\n")
  .reduce<{ result: Result; inFooBlock: boolean }>(
    (acc, line) => {
      line = line.trim();
      if (line === "Begin Foo") {
        acc.result.foo.unshift([]);
        acc.inFooBlock = true;
        return acc;
      }
      if (line === "End Foo") {
        acc.inFooBlock = false;
        return acc;
      }
      if (acc.inFooBlock) {
        acc.result.foo[0].push(line);
      } else {
        acc.result.stuff.push(line);
      }
      return acc;
    },
    { result: { stuff: [], foo: [] }, inFooBlock: false }
  ).result;

result.foo.reverse();

result; //?
