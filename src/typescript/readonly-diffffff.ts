interface A<T> {
  readonly a: Array<T>
}
interface B<T> {
  b: ReadonlyArray<T>
}

const a_ok = (a: A<{}>) => a.a.pop()
const a_err = (a: A<{}>) => (a.a = ["foo"]) // Error
const b_ok = (b: B<{}>) => (b.b = ["foo"])
const b_err = (b: B<{}>) => b.b.pop() // Error
