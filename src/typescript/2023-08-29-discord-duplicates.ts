// Hi there,
// I am using fp-ts in a project and have come across a fairly simple usecase
// that I just can't get my head round.

// The code is as follows:

import {
  eq as Eq,
  readonlyArray as A,
  either as E,
} from "fp-ts";
import { pipe } from "fp-ts/function";

type CustomFieldValue = {
  fieldId: number;
  value: string;
};

type CustomField = {
  id: number;
  name: string;
  type: string;
  options: readonly string[];
};

type Expense = {
  id: number;
  customFields: readonly CustomFieldValue[];
};

type MismatchedHeaderCustomFieldsError = {
  readonly _tag: "MismatchedHeaderCustomFieldsError";
};
const buildMismatchedHeaderLevelCustomFieldsError =
  (): MismatchedHeaderCustomFieldsError => ({
    _tag: "MismatchedHeaderCustomFieldsError",
  });

const customFieldEq: Eq.Eq<CustomFieldValue> = {
  equals: (x, y) =>
    x.fieldId === y.fieldId && x.value === y.value,
};

const validateUniqueValues = (
  values: readonly CustomFieldValue[],
): E.Either<
  MismatchedHeaderCustomFieldsError,
  readonly CustomFieldValue[]
> => {
  const ids = new Set<number>();

  for (const value of values) {
    if (ids.has(value.fieldId)) {
      return E.left(
        buildMismatchedHeaderLevelCustomFieldsError(),
      );
    }
    ids.add(value.fieldId);
  }

  return E.right(values);
};

const validateHeaderCustomFields = (
  customFields: readonly CustomField[],
  expenses: readonly Expense[],
) =>
  pipe(
    expenses,
    A.map(x => x.customFields),
    A.chain(
      A.filter(isGroupLevelCustomField(customFields)),
    ),
    A.uniq(customFieldEq),
    validateUniqueValues,
  );

function isGroupLevelCustomField(
  customFields: readonly CustomField[],
): import("fp-ts/lib/Refinement").Refinement<
  CustomFieldValue,
  CustomFieldValue
> {
  throw new Error("Function not implemented.");
}
// Essentially it does the following:

// 1.) Extract custom fields from expenses
// 2.) Only keeps those that are relevant to a group
// 3.) Removes all the duplicate values
// 4.) Ensures there are no duplicates (on a different key)

// It works - it's fine...whatever,

// I just really dislike the validateUniqueValues function - I'm sure it could
// be done in a far nicer way but I'm hitting a blank.

// Any help would be much appreciated!
