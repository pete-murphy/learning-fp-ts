type Foo_X = ["A", number] | ["B", boolean]

type AsInterface<T> = T extends [infer K, infer V]
  ? K extends string
    ? { [key in K]: V }
    : never
  : never

type Bar_X = AsInterface<Foo_X>

type AsInterface_<T> = T extends [infer K, infer V]
  ? K extends string
    ? { [key in K]: V }
    : never
  : never
