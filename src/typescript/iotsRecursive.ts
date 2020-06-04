import * as t from "io-ts"
interface Type1 {
  title: string
  categories: Type2
}
interface Type2 {
  title: string
  featured: Type1
}
const Type1: t.Type<Type1> = t.recursion("Type1", () =>
  t.type({ title: t.string, categories: Type2 })
)
const Type2: t.Type<Type2> = t.recursion("Type2", () =>
  t.type({ title: t.string, featured: Type1 })
)
const t1: Type1 = { title: "t1", categories: t2 }
const t2: Type2 = { title: "t2", featured: t1 }

t1.categories = [t2]

console.log(Type1.decode(t1)) // StackOverflow
console.log(Type2.decode(t2)) // StackOverflow
