const pairs: Array<[string, Array<number>]> = [
  ["foo", [1, 2, 3]],
  ["bar", [4, 5, 6]],
]

pairs.flatMap(([str, nums]) => [str, ...nums]) //?
