import { lookup } from "fp-ts/lib/Array"

const rec = { 1: "a", 2: "b" }

// Doesn't work
lookup(1, rec) //?
