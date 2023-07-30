import { pipe } from "fp-ts/function";
import {
  readonlyArray as A,
  either as E,
  semigroup as Sg,
  ord as Ord,
  number as N,
} from "fp-ts";

declare const props: {
  toArray(): ReadonlyArray<
    [unknown, { property: { schema: string }; value: string }]
  >;
};
declare const safeParse: (
  schema: string,
) => (value: string) => E.Either<Error, unknown>;

const Applicative1 = E.getApplicativeValidation(A.getSemigroup<Error>());
const result1 = pipe(
  props.toArray(),
  A.traverse(Applicative1)(([_, v]) => {
    const { property, value } = v;
    return pipe(value, safeParse(property.schema), E.mapLeft(A.of));
  }),
);

// This will not short-circuit, instead it will give the last error resulting
// from parsing the `props` array
const Applicative2 = E.getApplicativeValidation(Sg.last<Error>());
const result2 = pipe(
  props.toArray(),
  A.traverse(Applicative2)(([_, v]) => {
    const { property, value } = v;
    return pipe(value, safeParse(property.schema));
  }),
);

// Could also imagine having a weight or score associated with each error
// according to its relevance, and wanting to only show the most relevant error
declare const getErrorWeight: (e: Error) => number;
const Applicative3 = E.getApplicativeValidation(
  Sg.max<Error>(Ord.contramap(getErrorWeight)(N.Ord)),
);
const result3 = pipe(
  props.toArray(),
  A.traverse(Applicative3)(([_, v]) => {
    const { property, value } = v;
    return pipe(value, safeParse(property.schema));
  }),
);
