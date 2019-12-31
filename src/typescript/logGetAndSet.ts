const array = [
  4,
  1,
  5,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
  3,
  4,
  0,
]

Object.defineProperty(array, "2", {
  get() {
    console.log("get 5")
    return 5
  },
  set(v) {
    console.log("set 5", v)
  },
})

Object.defineProperty(array, "0", {
  get() {
    console.log("get 4")
    return 4
  },
  set(v) {
    console.log("set 4", v)
  },
})

Object.defineProperty(array, "1", {
  get() {
    console.log("get 1")
    return 1
  },
  set(v) {
    console.log("set 1", v)
  },
})

array.sort()
