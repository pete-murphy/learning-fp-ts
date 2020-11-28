const isEven = x => x % 2 === 0

const f = x => (isEven(x) ? 0 : 1)
const g = x => x * 2
// const set = new Set([1,2,3])

;[1, 2, 3].map(f) //?
;[1, 0, 1].map(g) //?
;[1, 2, 3].map(x => g(f(x))) //?
