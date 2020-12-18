import fs from "fs"
import * as St from "fp-ts/lib/State"
import State = St.State
import * as A from "fp-ts/lib/Array"
import { pipe } from "fp-ts/lib/pipeable"
import { sequenceS, sequenceT } from "fp-ts/lib/Apply"
import { fold, monoidSum } from "fp-ts/lib/Monoid"

interface Node {
  children: readonly Node[]
  metadata: readonly number[]
}

const allMetadata: (node: Node) => number[] = node => [
  ...node.metadata,
  ...node.children.flatMap(allMetadata),
]

const getInt: State<number[], number> = pipe(
  St.get<number[]>(),
  St.chain(([first, ...rest]) =>
    pipe(
      St.of<number[], number>(first),
      St.chainFirst(() => St.put(rest))
    )
  )
)

const getNode: State<number[], Node> = pipe(
  sequenceT(St.state)(getInt, getInt),
  St.chain(
    ([n, m]): State<number[], Node> =>
      sequenceS(St.state)({
        children: St.sequenceArray(A.replicate(n, getNode)),
        metadata: St.sequenceArray(A.replicate(m, getInt)),
      })
  )
)

const words = (str: string) => str.split(/\s/)

const main = () =>
  pipe(
    fs.readFileSync("input", "utf8"),
    words,
    A.map(Number),
    ns => St.evaluate(ns)(getNode),
    allMetadata,
    fold(monoidSum),
    console.log
  )

main()
