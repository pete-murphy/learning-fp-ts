type Foo1 = Array<number> | Array<string>

const f1 = (foo: Foo1) => foo.map(x => x)

// const isArrayOfNumbers = (
//   xs: Foo1
// ): xs is Array<number> =>
//   typeof xs[0] === "number"

// const f1 = (foo: Foo1) =>
//   isArrayOfNumbers(foo)
//     ? foo.map(x => x)
//     : foo.map(x => x)

type Foo2 = Array<number | string>

const f2 = (foo: Foo2) => foo.map(x => x)
