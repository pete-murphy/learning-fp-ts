import * as fs from "fs"
import * as path from "path"
// type GetLast<T extends `x.y`> = `y`

type GetLast<Str extends string> =
  Str extends `${string}.${infer Rest}`
    ? GetLast<Rest>
    : Str

type t3 = GetLast<"a.b.c">

type GetLast2<Str extends string> =
  Str extends `${string}.${infer R1}.${infer R2}`
    ? GetLast2<`${R1}.${R2}`>
    : Str

type t4 = GetLast2<"a.b.c">
type t5 = GetLast2<"a.b.c.def">

// fs.existsSync()

type AtLeastOne<
  A,
  Row = { [Key in keyof A]: Pick<A, Key> }
> = Partial<A> & Row[keyof Row]

// type AtLeastOneTrue<
//   A extends object,
//   K = keyof A
// > = {} extends A ? never : K[0]

type KeysOf<A extends object> = keyof A

interface Foo {
  a: boolean
  b: boolean
  c: boolean
}

type X = KeysOf<Foo>
