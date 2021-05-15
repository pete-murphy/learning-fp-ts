import { sequenceS } from "fp-ts/lib/Apply"
import * as O from "fp-ts/lib/Option"

const foo: Record<string, O.Option<number>> = {}
sequenceS(O.option)(foo)
