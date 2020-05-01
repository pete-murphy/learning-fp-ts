type FooBarBaz = {
  foo: number
  bar: string
  baz: boolean
}

const pick1 = <K extends PropertyKey>(ks: Array<K>) => <
  A extends Record<K, unknown>
>(
  obj: A
): Pick<A, K> =>
  Object.assign(
    {},
    ...ks.map((k) => (k in obj ? { [k]: obj[k] } : {}))
  )

const pick2 = <
  A extends Record<PropertyKey, unknown>,
  K extends keyof A
>(
  ks: Array<K>
) => (obj: A): Pick<A, K> =>
  Object.assign(
    {},
    ...ks.map((k) => (k in obj ? { [k]: obj[k] } : {}))
  )

const pick3 = <T>() => <K extends keyof T>(ks: K[]) => (
  x: T
): Pick<T, K> => {
  // I don't believe there's any reasonable way to model this sort of
  // transformation in the type system without an assertion - at least here
  // it's in a single reused place
  const o = {} as Pick<T, K>
  for (const k of ks) {
    o[k] = x[k]
  }
  return o
}

const fooBarBazExample = {
  foo: 1,
  bar: "",
  baz: true,
}

pick1(["foo", "bar"])(fooBarBazExample) //?
pick2(["foo", "bar"])(fooBarBazExample) //?
pick3<FooBarBaz>()(["foo", "bar"])(fooBarBazExample) //?
