import { array, record } from "fp-ts"

enum A {
  Foo = "Foo",
  Bar = "Bar",
}

type B = { prop: A; baz: string }
type C = Record<A, B[]>

const f = (bs: B[]): C =>
  record.fromFoldableMap(array.getMonoid<B>(), array.array)(bs, (b) => [
    b.prop,
    [b],
  ])

f([
  { prop: A.Foo, baz: "foo1" },
  { prop: A.Foo, baz: "foo2" },
  { prop: A.Foo, baz: "foo3" },
  { prop: A.Bar, baz: "bar1" },
  { prop: A.Bar, baz: "bar2" },
  { prop: A.Bar, baz: "bar3" },
])

/*
{ Foo: 
  [ { prop: 'Foo', baz: 'foo1' },
    { prop: 'Foo', baz: 'foo2' },
    { prop: 'Foo', baz: 'foo3' } ],
 Bar: 
  [ { prop: 'Bar', baz: 'bar1' },
    { prop: 'Bar', baz: 'bar2' },
    { prop: 'Bar', baz: 'bar3' } ] }
*/
