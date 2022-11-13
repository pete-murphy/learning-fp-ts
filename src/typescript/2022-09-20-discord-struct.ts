import { readonlyRecord as RR, struct as S } from "fp-ts";
import { pipe } from "fp-ts/function";

type ExampleRecord = RR.ReadonlyRecord<"foo" | "bar" | "baz", number>;
type ExampleStruct = {
  foo: number;
  bar: boolean;
  baz?: string;
};

declare const exampleRecord: ExampleRecord;
declare const exampleStruct: ExampleStruct;

const z = pipe(
  exampleRecord,
  RR.mapWithIndex((key, n) => key.length + n)
);

pipe(exampleStruct, S.evolve());
