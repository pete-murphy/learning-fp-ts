const board1 = [
  ["x", "o", "x"],
  ["x", "o", "x"],
  ["o", "x", "o"],
]

const board2 = [
  ["x", "x", "x"],
  ["x", "o", "x"],
  ["o", "x", "o"],
]

const board3 = [
  ["o", "o", "x"],
  ["x", "o", "x"],
  ["o", "x", "o"],
]
const board4 = [
  ["x", "o", "x"],
  ["o", "x", "o"],
  ["x", "o", "o"],
]

const transpose = (xss, [xs] = xss) =>
  xs.map((_, i) => xss.map(ys => ys[i]))

const findWinner = board => {
  const [[a1, , b1], [, c], [b2, , a2]] = board
  const diagonals = [
    [a1, c, a2],
    [b1, c, b2],
  ]
  const isFull = ([x, y, z]) => x === y && y === z
  return [
    ...board,
    ...transpose(board),
    ...diagonals,
  ].find(isFull)
}

findWinner(board1) //?
findWinner(board2) //?
findWinner(board3) //?
findWinner(board4) //?
