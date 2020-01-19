import { or, or_, and, and_ } from "./or"
import { array } from "fp-ts/lib/Array"

const N = 1e7
const mkArr = (b: boolean) => new Array(N).fill(b)

const ts = mkArr(true)
const fs = mkArr(false)

console.group("**** or, ts")

console.time("ts.some(x => x)")
ts.some(x => x)
console.timeEnd("ts.some(x => x)")

console.time("or(array)(ts)")
or(array)(ts)
console.timeEnd("or(array)(ts)")

console.time("or_(array)(ts)")
or_(array)(ts)
console.timeEnd("or_(array)(ts)")

console.groupEnd()

console.group("**** or, fs")

console.time("fs.some(x => x)")
fs.some(x => x)
console.timeEnd("fs.some(x => x)")

console.time("or(array)(fs)")
or(array)(fs)
console.timeEnd("or(array)(fs)")

console.time("or_(array)(fs)")
or_(array)(fs)
console.timeEnd("or_(array)(fs)")

console.groupEnd()

console.group("**** and, fs")

console.time("fs.every(x => x)")
fs.every(x => x)
console.timeEnd("fs.every(x => x)")

console.time("and(array)(fs)")
and(array)(fs)
console.timeEnd("and(array)(fs)")

console.time("and_(array)(fs)")
and_(array)(fs)
console.timeEnd("and_(array)(fs)")

console.groupEnd()

console.group("**** and, ts")

console.time("ts.every(x => x)")
ts.every(x => x)
console.timeEnd("ts.every(x => x)")

console.time("and(array)(ts)")
and(array)(ts)
console.timeEnd("and(array)(ts)")

console.time("and_(array)(ts)")
and_(array)(ts)
console.timeEnd("and_(array)(ts)")

console.groupEnd()
