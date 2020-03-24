import * as t from "io-ts"

const Foo = t.type({
  foo: t.number,
  bar: t.string,
  x: t.never,
})

Foo.validate({ foo: 1, bar: "" }, []) //?
Foo.validate({ foo: 1, bar: "", x: 1 }, []) //?

const ExactFoo = t.exact(Foo)

ExactFoo.validate({ foo: 1, bar: "", x: 1 }, []) //?
