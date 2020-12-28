type Ord<A> = (x: A) => (y: A) => -1 | 0 | 1

const sortByImpl = function <A>() {
  function mergeFromTo(
    compare: Ord<A>,
    fromOrdering: (x: number) => number,
    xs1: A[],
    xs2: A[],
    from: number,
    to: number
  ) {
    var mid
    var i
    var j
    var k
    var x
    var y
    var c

    mid = from + ((to - from) >> 1)
    if (mid - from > 1) mergeFromTo(compare, fromOrdering, xs2, xs1, from, mid)
    if (to - mid > 1) mergeFromTo(compare, fromOrdering, xs2, xs1, mid, to)

    i = from
    j = mid
    k = from
    while (i < mid && j < to) {
      x = xs2[i]
      y = xs2[j]
      c = fromOrdering(compare(x)(y))
      if (c > 0) {
        xs1[k++] = y
        ++j
      } else if (c === 0) {
        xs1[k++] = x
        xs1[k++] = y
        ++i
        ++j
      } else {
        xs1[k++] = x
        ++i
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++]
    }
    while (j < to) {
      xs1[k++] = xs2[j++]
    }
  }

  return function (compare: Ord<A>) {
    return function (fromOrdering: (x: number) => number) {
      return function (xs: A[]) {
        var out

        if (xs.length < 2) return xs

        out = xs.slice(0)
        mergeFromTo(compare, fromOrdering, out, xs.slice(0), 0, xs.length)

        return out
      }
    }
  }
}

type Pair = { x: number; y: number }

const ordPairByX: Ord<Pair> = a => b => (a.x > b.x ? 1 : a.x < b.x ? -1 : 0)

const ps1: Pair[] = [1, 2, 3, 4].map(y => ({ x: 0, y }))
const ps2: Pair[] = [1, 2, 3, 4, 5, 6, 7].map(y => ({ x: 0, y }))

sortByImpl<Pair>()(ordPairByX)(x => x)(ps1).map(({ y }) => y) //?
sortByImpl<Pair>()(ordPairByX)(x => x)(ps2).map(({ y }) => y) //?
