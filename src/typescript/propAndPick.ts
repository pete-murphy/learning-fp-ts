export const prop = <
  A extends Record<string, unknown>,
  K extends keyof A
>(
  k: K
) => (obj: A): A[K] => obj[k]

export const prop_ = <K extends PropertyKey>(key: K) => <
  A extends Record<K, any>
>(
  obj: A
): A[K] => obj[key]

const getFoo = prop("foo")
const getFoo_ = prop_("foo")

export const notQuitePick = <K extends PropertyKey>(
  ks: Array<K>
) => <A extends Record<K, unknown>>(obj: A): Array<A[K]> =>
  ks.map((k) => obj[k])

export const pick = <K extends PropertyKey>(
  ks: Array<K>
) => <A extends Record<K, unknown>>(obj: A): Pick<A, K> =>
  Object.assign({}, ...ks.map((k) => ({ [k]: obj[k] })))

export const pick_ = <
  A extends Record<PropertyKey, unknown>,
  K extends keyof A
>(
  ks: Array<K>
) => (obj: A): Pick<A, K> =>
  Object.assign({}, ...ks.map((k) => ({ [k]: obj[k] })))

pick(["foo", "bar"])({ foo: 1, ba: 12, baz: 12 }) //?

pick_(["foo", "bar"])({ foo: 1, ba: 12, baz: 12 }) //?
