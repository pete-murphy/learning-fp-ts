import { isString } from "../lib/typeGuards"

type FooBar = "foo" | "bar"

// const isFooBar = (x: unknown): x is FooBar =>
//   isString(x) && ['foo', 'bar'].includes(x)

const isFooBar = (x: unknown): x is FooBar =>
  x === "foo" || x === "bar"

// const isFooBar = (x: unknown): x is FooBar => {
//   const fooBarArray: Array<FooBar> = ["foo", "bar"]
//   return isString(x) && fooBarArray.includes(x)
// }
