import { sequenceS } from "fp-ts/lib/Apply";
import { option, some } from "fp-ts/lib/Option";

type Foo = {
  a: string;
};

sequenceS(option)({
  foo: some("foo"),
  bar: some("bar")
});
