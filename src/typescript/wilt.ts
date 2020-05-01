import { array } from "fp-ts/lib/Array"
import * as I from "fp-ts/lib/Identity"
import { right, left } from "fp-ts/lib/Either"

const p = (n: number) => n > 2

const wiltIdentity = array.wilt(I.identity)
const f = (n: number) =>
  I.identity.of(p(n) ? right(n + 1) : left(n - 1))

wiltIdentity([], f), I.identity.of({ left: [], right: [] }) //?
wiltIdentity([1, 3], f),
  I.identity.of({ left: [0], right: [4] }) //?
