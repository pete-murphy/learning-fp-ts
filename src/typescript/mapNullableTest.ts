import { some, mapNullable, Option, fromNullable } from "fp-ts/lib/Option";

type P = {
  externalId?: {
    report?: boolean;
  };
};

const foo: P = {
  externalId: {
    report: false
  }
};

const displayRoleRequirements = fromNullable(foo.externalId);
// .getOrElse(false);
