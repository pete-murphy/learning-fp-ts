export type Example1 = Record<"foo", number>
export type Example2 = { foo: number }
export type Example3 = Record<string, number>

export type IsRecord<A> = A extends Record<infer K, infer V>
  ? string extends K
    ? A[string] extends V
      ? A
      : never
    : never
  : never
// type IsRecord<A> = A extends Record<string, any> ? A : never
//   // ? string extends K
//   //   ? A[string] extends V
//   //     ? A
//   //     : never
//   //   : never
//   // : never

export type Foo1 = IsRecord<Example1>
export type Foo2 = IsRecord<Example2>
export type Foo3 = IsRecord<Example3>

const x: Example1 = {}
// const y: Example2 = {}
