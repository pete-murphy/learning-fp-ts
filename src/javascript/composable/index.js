import * as Array from "fp-ts/lib/Array"

const composable = {
  get: function (target, prop) {
    if (prop in target) {
      return target[prop]
    } else {
      const entity = eval(prop)
      if (typeof entity === "function" && typeof target === "function") {
        return new Proxy((...args) => target(entity(...args)), composable)
      }
    }
  },
}

const id = new Proxy(x => x, composable)

function double(x) {
  return x * 2
} // It works with arrow functions
const addThree = x => x + 3

const f = id.Array.filter(x => x > 20).Array.map(double)

f([2]) //?
