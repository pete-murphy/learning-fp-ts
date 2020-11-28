import { Const } from "fp-ts/lib/Const"

type USD = Const<number, "USD">
type EUR = Const<number, "USD">

const x: USD = 9
const y: EUR = 10
