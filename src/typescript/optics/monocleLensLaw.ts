import { Lens } from "monocle-ts"

interface FromPathBad {
  foo: {
    [key: string]: {
      [key: string]: number
    }
  }
}

const example: FromPathBad = {
  foo: {
    bar: {
      baz: 9,
    },
  },
}

const l = Lens.fromPath<FromPathBad>()(["foo", "oops", "wat"])

l.set(l.get(example))(example)
