import queryString from 'query-string'

const a = {
  a: 1,
  b: 2,
}

const arr = {
  arr: [1, 23, 4, 5, 23, 34, 23].map(String)
}

console.log(arr.arr)
console.log(queryString.stringify(a, { arrayFormat: 'bracket' }))
console.log(queryString.stringify(arr, { arrayFormat: 'bracket' }))

