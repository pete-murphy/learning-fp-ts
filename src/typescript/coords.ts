function createCoord_(radius: number) {
  let hexMap = []
  let r1: number, r2: number
  for (let q = -radius; q <= radius; q++) {
    r1 = Math.max(-radius, -q - radius)
    r2 = Math.min(radius, -q + radius)

    for (let r = r1; r <= r2; r++) {
      hexMap.push({
        q: q,
        r: r,
        s: -q - r,
      })
    }
  }
  return hexMap
}

const range = (from: number, to: number) =>
  Array(to + 1 - from)
    .fill(0)
    .map((_, i) => from + i)

const createCoord = (radius: number) =>
  range(-radius, radius).flatMap(q =>
    range(Math.max(-radius, -q - radius), Math.min(radius, -q + radius)).map(
      r => ({
        q,
        r,
        s: -q - r,
      })
    )
  )

export { createCoord, createCoord_ }
