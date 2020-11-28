import { none, option, some } from "fp-ts/lib/Option"
import { asumT } from "./Alt"

const foo = asumT(option)(none, none, some(3), some("asdf"), none)
