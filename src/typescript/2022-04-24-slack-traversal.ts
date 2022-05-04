import * as R from "ramda"

import * as T from "monocle-ts/Traversal"
import { pipe } from "fp-ts/function"

// Hey! Monocle relative question.
// Can't figure it out, I need the community help on this one.
// I have an interface:
// interface FieldState<B> {
//   input: B;
//   pristine: B;
// }
// I have a product:
// FieldState<{ a?: { b?: number } }>
// I want to focus on b value and preserve wrapper:
// FieldState<{ a?: { b?: number } }> -> FieldState<number | undefined>
// From this optics I need methods like:
// get -- behaves as depicted in the previous code-block
// set -- behaves like this:
// Example 1:
// Object: FieldState<{}>
// Input: FieldState<4>
// Output: FieldState<{}>
// Example 2:
// Object: FieldState<{ a: {} }>
// Input: FieldState<4>
// Output: FieldState<{ a: { b: 4 } }>
// Example 3:
// Object: FieldState<{ a: { b: 1 } }>
// Input: FieldState<4>
// Output: FieldState<{ a: { b: 4 } }>
// Example 4:
// Object: FieldState<{}>
// Input: FieldState<undefined>
// Output: FieldState<{}>
// Example 5:
// Object: FieldState<{ a: {} }>
// Input: FieldState<undefined>
// Output: FieldState<{ a: {} }>
// Example 6:
// Object: FieldState<{ a: { b: 1 } }>
// Input: FieldState<undefined>
// Output: FieldState<{ a: { b: undefined } }>
// Also right output: FieldState<{ a: {} }>
// As I understand Traversal won't help me as it has no get method.
// The closes optics I find is Lens and Optional but I can't figure out how to temporarily unwrap value inside FieldState.
// Prism won't help me because FieldState isn't a sum type but generic product.
// Perhaps I should write my own combinators and compositions?

interface FieldState<B> {
  input: B
  pristine: B
}
// I have a product:
type Example = FieldState<{ a?: { b?: number } }>
// I want to focus on b value and preserve wrapper:
// FieldState<{ a?: { b?: number } }> -> FieldState<number | undefined>
// From this optics I need methods like:
// get -- behaves as depicted in the previous code-block
// set -- behaves like this:
// Example 1:
// Object: FieldState<{}>
// Input: FieldState<4>
// Output: FieldState<{}>
// Example 2:
// Object: FieldState<{ a: {} }>
// Input: FieldState<4>
// Output: FieldState<{ a: { b: 4 } }>
// Example 3:
// Object: FieldState<{ a: { b: 1 } }>
// Input: FieldState<4>
// Output: FieldState<{ a: { b: 4 } }>
// Example 4:
// Object: FieldState<{}>
// Input: FieldState<undefined>
// Output: FieldState<{}>
// Example 5:
// Object: FieldState<{ a: {} }>
// Input: FieldState<undefined>
// Output: FieldState<{ a: {} }>
// Example 6:
// Object: FieldState<{ a: { b: 1 } }>
// Input: FieldState<undefined>
// Output: FieldState<{ a: { b: undefined } }>
// Also right output: FieldState<{ a: {} }>
