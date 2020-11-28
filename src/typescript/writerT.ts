import * as W from "fp-ts/lib/Writer"
import { getWriterM, WriterT1 } from "fp-ts/lib/WriterT"
import * as T from "fp-ts/lib/Task"
import { pipe, pipeable } from "fp-ts/lib/pipeable"
import { getMonoid } from "fp-ts/lib/Array"

const { apSecond, map } = pipeable(W.getMonad(getMonoid<string>()))

const WT = getWriterM(T.task)
const WTM = WT.getMonad(getMonoid<string>())

// const apSecond = <A>(ma: WriterT1<T.URI, Array<string>, A>) => <B>(mb: WriterT1<T.URI, Array<string>, B>): WriterT1<T.URI, Array<string>, B> =>
//   WTM.ap(WTM.map(ma, _ => x => x), mb)
// const map = <A,B>(f: (a: A) => B) => (fa: WriterT1<T.URI, Array<string>, A>): WriterT1<T.URI, Array<string>, B> => WTM.map(fa, f)

const program: WriterT1<T.URI, Array<string>, number> = pipe(
  WTM.of(100),
  apSecond(WT.tell(["start"])),
  map(x => x * 2),
  apSecond(WT.tell(["double"]))
)

program()() //?

// program :: WriterT [String] IO Int
// program =
//   pure 100
//     & (>>) (tell ["start"])
//     & fmap (* 2)
//     & (>>) (tell ["double"])
