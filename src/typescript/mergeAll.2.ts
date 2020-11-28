type ExtractT<T extends Promise<any>> = T extends Promise<infer A> ? A : never

type ExtractTArr<T extends Promise<any>[]> = {
  [K in keyof T]: T[K] extends Promise<any> ? ExtractT<T[K]> : never
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V }
  ? V
  : never

type ExtractUnion<T extends Promise<any>[]> = UnionToIntersection<
  TupleTypes<ExtractTArr<T>>
>

type MergeAll = <T extends Promise<any>[]>(ps: T) => Promise<ExtractUnion<T>>

export const mergeAll: MergeAll = async ps => {
  const pieces = await Promise.all(ps)
  return Object.assign({}, ...pieces)
}

type Foo = {
  a: number
  b: string
  c: {}
}

const promises = [
  Promise.resolve({ a: 1 }),
  Promise.resolve({ b: "xyz" }),
  Promise.resolve({ c: {} }),
]

const a: Promise<Foo> = mergeAll(promises)
// a //?
