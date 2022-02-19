const delayedValue =
  (milliseconds: number) =>
  <A>(a: A): Promise<A> =>
    new Promise(resolve =>
      setTimeout(() => resolve(a), milliseconds)
    )

const program1 = async () => {
  const fooPromise = delayedValue(1000)("foo")
  const barPromise = delayedValue(1000)("bar")
  const foo = await fooPromise
  const bar = await barPromise
  return foo + bar
}

const program2 = async () => {
  const fooPromise = delayedValue(1000)("foo")
  const foo = await fooPromise
  const barPromise = delayedValue(1000)("bar")
  const bar = await barPromise
  return foo + bar
}

const program3 = () => {
  const fooPromise = delayedValue(1000)("foo")
  const barPromise = delayedValue(1000)("bar")

  return fooPromise.then(foo =>
    barPromise.then(bar => foo + bar)
  )
}

console.time("program1")
program1().then(_ => console.timeEnd("program1"))

console.time("program2")
program2().then(_ => console.timeEnd("program2"))

console.time("program3")
program3().then(_ => console.timeEnd("program3"))
