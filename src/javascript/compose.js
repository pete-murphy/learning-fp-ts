const օ = Symbol()

Function.prototype[օ] = function (f) {
  return (x) => this(f(x))
}

const length = (xs) => xs.length

const even = (x) => x % 2 === 0

const not = (x) => !x

console.log(not[օ](even)[օ](length)([1, 2, 3]))
