type NonNull<T> = T extends null | undefined ? never : T

type EmailAddress = string | string[] | null | undefined

type NonNullEmailAddress = NonNull<EmailAddress>

const foo0 = (str: NonNull<string>): string => str.toUpperCase()

declare const bar0: string | undefined

//
type StringOrNumber<T extends string | number> = T extends string
  ? string
  : number

// foo0(bar0)

type Bar = {
  a: string
}
type Baz = {
  b: number
}

// This would also work for overloading fn
// function fn(a: string): Bar
// function fn(a: number): Baz
// function fn(a: string): Bar | Baz {

function fn<T extends string | number>(a: T): T extends string ? Bar : Baz
function fn<T extends string | number>(a: T): Bar | Baz {
  switch (typeof a) {
    case "string":
      return {
        a,
      }
    case "number":
      return {
        b: a,
      }
  }
}
// This is not exhaustive:
// if (typeof a === "string") {
//   return {
//     a,
//   }
// } else if (typeof a === "number") {
//   return {
//     b: a,
//   }
// }

const x = fn("")
const y = fn(0)

const quux: { bar: number } & { [key in string]: unknown } = {
  foo: "asdf",
  bar: 123,
}
