type Reducer<A, B> = (acc: B, x: A) => B

const strUppercaseReducer: Reducer<string, Array<string>> = (acc, str) => {
  return [...acc, str.toLocaleUpperCase()]
}

const isLongEnoughReducer: Reducer<string, Array<string>> = (acc, str) => {
  if (str.length > 2) return [...acc, str]
  return acc
}

const isShortEnoughReducer: Reducer<string, Array<string>> = (acc, str) => {
  if (str.length < 10) return [...acc, str]
  return acc
}
