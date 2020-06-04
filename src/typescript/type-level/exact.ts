type Exact<A extends object, B extends A> = A &
  Record<Exclude<keyof B, keyof A>, never>
type _A = { a: string }
// Could use this type for A instead of Exact helper
// if you know other properties that you want to exclude
// type A = { a: string, b?: never }

// Function signatures seem equivalent...
function _f<T extends Exact<_A, T>>(a: T): void {}
function g(a: A): void {}

// ...and type safety seems equivalent...
_f({ a: "a", b: "b" })
g({ a: "a", b: "b" })

// ...but if we try to call them with `foo: {a: string; b: string}`...
const foo = { a: "a", b: "b" }

// ...only `f` throws a type error.
_f(foo)
g(foo)

// This was unexpected.
