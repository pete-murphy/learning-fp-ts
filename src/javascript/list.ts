import { Eq, eqString, getStructEq } from "fp-ts/lib/Eq"
import { getEq } from "fp-ts/lib/ReadonlyArray"

interface HierNodeEntity {
  value: string
  children: ReadonlyArray<HierNodeEntity>
}

// const getEqHierNodeEntity = (): Eq<HierNodeEntity> =>
//   getStructEq({
//     value: eqString,
//     children: getEq(getEqHierNodeEntity()),
//   })

// const eqHierNodeEntity = getEqHierNodeEntity()

const ex1: HierNodeEntity = {
  value: "foo",
  children: [],
}
const ex2: HierNodeEntity = {
  value: "bar",
  children: [ex1],
}
const ex3: HierNodeEntity = {
  value: "bar",
  children: [ex1],
}

eqHierNodeEntity.equals(ex2, ex3) //?

// const Nil = Symbol("Nil")
// type List<A> = {
//   head: () => A
//   tail: () => List<A>
// } | typeof Nil

// const range = (start: number, end: number): List<number> => start === end ?
//   {
//     head: () => start,
//     tail: () => Nil
//   } :
