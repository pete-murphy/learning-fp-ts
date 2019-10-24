import { fromNullable, fold } from "fp-ts/lib/Option";

type ThingOrUndefined = { thing: boolean } | undefined;

const foo: ThingOrUndefined = { thing: true };

const optFoo = fromNullable(foo);

fold(() => null, ({ thing }) => thing)(optFoo);
