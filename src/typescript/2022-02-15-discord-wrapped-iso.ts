import * as I from "monocle-ts/Iso"

interface Wrap<T> {
  item: T
}
const wrappedIso = <T>() =>
  I.iso<Wrap<T>, T>(
    ({ item }) => item,
    item => ({ item })
  )

interface Person {
  id: string
  name: string
  age: number
}

interface WrappedPerson {
  id: string
  name: Wrap<string>
  age: Wrap<number>
}

const struct = <A, B>(isos: {
  [K in keyof A]: I.Iso<
    A[K],
    K extends keyof B ? B[K] : never
  >
}): I.Iso<
  { readonly [K in keyof A]: A[K] },
  {
    readonly [K in keyof A]: K extends keyof B
      ? B[K]
      : never
  }
> =>
  I.iso(
    x => {
      const y: Partial<{
        [K in keyof A]: K extends keyof B ? B[K] : never
      }> = {}
      for (const key in isos) {
        y[key] = isos[key].get(x[key])
      }
      return y as {
        readonly [K in keyof A]: K extends keyof B
          ? B[K]
          : never
      }
    },
    x => {
      const y: Partial<{ [K in keyof A]: A[K] }> = {}
      for (const key in isos) {
        y[key] = isos[key].reverseGet(x[key])
      }
      return y as { readonly [K in keyof A]: A[K] }
    }
  )

const personIso = struct<Person, WrappedPerson>({
  id: I.id<string>(),
  age: I.reverse(wrappedIso()),
  name: I.reverse(wrappedIso())
})

console.log(
  personIso.get({
    age: 88,
    id: "foo",
    name: "Alice"
  })
) //?
