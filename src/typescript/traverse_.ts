import { traverse_ } from "fp-ts/lib/Foldable"
import { io } from "fp-ts/lib/IO"
import { either, left, right } from "fp-ts/lib/Either"
import { array } from "fp-ts/lib/Array"
import { option, some } from "fp-ts/lib/Option"

traverse_(io, either)(left<string, string>("fooo"), str =>
  io.of(console.log(str))
)() //?
traverse_(io, either)(right<string, string>("fooo"), str =>
  io.of(console.log(str))
)() //?
traverse_(io, option)(some("fooo"), str => io.of(console.log(str)))() //?
traverse_(io, array)([1, 2, 3], str => io.of(console.log(str)))() //?
