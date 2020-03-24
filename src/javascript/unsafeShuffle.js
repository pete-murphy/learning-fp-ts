const shuffle = xs => {
  let ys = [...xs]
  const ln = ys.length
  for (const ix in ys) {
    ix
    const r = Math.floor(Math.random() * ln + ix)
    r
    ;[ys[r], ys[ix]] = [ys[ix], ys[r]]
  }
  return ys
}

const arr = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
]

shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
shuffle(arr) //?
