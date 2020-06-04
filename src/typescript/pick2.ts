export type FooBarBaz = {
  foo: number
  bar: string
  baz: boolean
}

const pickA = <K extends PropertyKey>(ks: Array<K>) => <
  A extends Record<K, unknown>
>(
  obj: A
): Pick<A, K> =>
  Object.assign({}, ...ks.map(k => (k in obj ? { [k]: obj[k] } : {})))

const pickB = <A>() => <K extends keyof A>(ks: K[]) => (obj: A): Pick<A, K> =>
  Object.assign({}, ...ks.map(k => (k in obj ? { [k]: obj[k] } : {})))

const fooBarBazExample = {
  foo: 1,
  bar: "",
  baz: true,
}

// Valid uses
const ex1a = pickA(["foo", "bar"])(fooBarBazExample) //?
const ex1b = pickB<FooBarBaz>()(["foo", "bar"])(fooBarBazExample) //?

// Invalid
const ex2a = pickA(["foo", "goo"])(fooBarBazExample) //?
const ex2b = pickB<FooBarBaz>()(["foo", "goo"])(fooBarBazExample) //?
