type X = {
  readonly foo: Array<number>
  bar: ReadonlyArray<number>
}

declare const x: X

x.foo.push(9)
x.bar.push(9)

x.foo = []
x.bar = []

export {}