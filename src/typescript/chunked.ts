function chunked<T>(
  length: number
): (array: ReadonlyArray<T>) => ReadonlyArray<ReadonlyArray<T>> {
  return array => {
    let result: Array<ReadonlyArray<T>> = []
    for (let i = 0; i < array.length; i += length) {
      result.push(array.slice(i, i + length))
    }
    return result
  }
}
