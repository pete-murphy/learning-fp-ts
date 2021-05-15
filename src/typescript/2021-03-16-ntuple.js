// const [Person, fstName, lstName, age, country] = nTuple(4); // defined a 4-Tuple
// const Mao = Person("Mao")("Zedong")(42)("China");
// Mao(fstName) === "Mao"
// Mao(lstName) === "Zedong"
// Mao(age)     === 42
// Mao(country) === "China"

// const nTuple = length => {
//   const args = []
//   const fns = Array.from({ length }, (_, i) => () => args[i])
//   const mk = (arg, n = length) => {
//     args.push(arg)
//     return n == 1 ? f => f() : arg => mk(arg, n - 1)
//   }
//   return [mk, ...fns]
// }
// const nTuple = length => {
//   const args = Array.from({length})
//   const fns = Array.from({ length }, (_, i) => () => args[i])
//   let callCount = 0
//   const mk = (arg, n = length) => {
//     callCount += 1
//     callCount
//     args[length - n] = arg
//     n -= 1
//     n
//     return n === 0 ? f => f() : arg => mk(arg, n)
//   }
//   return [mk, ...fns]
// }
// const pair = x => y => f => f(x)(y)
// const fst = x => _ => x
// const snd = _ => y => y
// const pairString = pair("Hello")("World") //?
// pairString(fst) === "Hello" //?
// pairString(snd) === "World" //?

// const mao = pair("Mao")("Zedong")
// mao(fst) //?
// mao(snd) //?

const nTuple = n => {
  const fns = Array.from(
    { length: n },
    (_, i) =>
      function fn(x, m = 1, j = 0) {
        return m === n ? x : y => fn(i === j + 1 ? y : x, m + 1, j + 1)
      }
  )
  const mk = (x, m = n - 1, xs = []) =>
    !m ? fn => xs.reduceRight((f, y) => f(y), fn)(x) : y => mk(y, m - 1, [x, ...xs])
  return [mk, ...fns]
}

// const uncurry = (n, fn, xs) => {
//   const next = acc => xs => xs.reduce((x,y) => x(y), acc);
//   return next(fn) (xs.slice(0, n));
// }

/**
if called with 3
fstName :: x -> _ -> _ -> x
sndName :: _ -> x -> _ -> x
if called with 2
fstName :: x -> _ -> x
sndName :: _ -> x -> x
 */
// // const [Person, fstName, lstName, age] = nTuple(3) // defined a 4-Tuple
// // const Mao = Person("Mao")("Zedong")(42)
// // Mao(fstName) //?
// // Mao(lstName) //?
// // Mao(age) //?

// const [Person, fstName, lstName] = nTuple(2)
// const Mao = Person("Mao")("Zedong")
// const Peter = Person("Peter")("Pan")

// Mao(fstName) //?
// Mao(lstName) //?
// Peter(fstName) //?
// fstName()      === "Mao" // ahaaa, look at that !!!

const [Pair, fst, snd] = nTuple(2)
const ExamplePair = Pair("x")(2)
ExamplePair(fst) === "x" 
ExamplePair(snd) === 2

const [Person, fstName, lstName, age, country] = nTuple(4) // defined a 4-Tuple
const Mao = Person("Mao")("Zedong")(42)("China")
Mao(age) //?
Mao(fstName) === "Mao"
Mao(lstName) === "Zedong"
Mao(age) === 42
Mao(country) === "China"

const 