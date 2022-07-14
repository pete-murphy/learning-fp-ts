// import { T } from "./lib/fp-ts-imports";
import * as T from 'fp-ts/Task'
import * as E from 'fp-ts/Either'
import * as CR from 'fp-ts/ChainRec'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as Fld from 'fp-ts/Foldable'

// type takeLeftWhileT = <A>(as: A[], fn: (a: A) => T.Task<boolean>) => A[]
const takeLeftWhileT = <A>(fn: (_:A) => T.Task<boolean>) => 
  // (as: ReadonlyArray<A>): T.Task<ReadonlyArray<A>> => Fld.reduceM(T.Monad, RA.Foldable)([] as ReadonlyArray<A>, )

  

// CR.tailRec(as, as_ => pipe(as_, RA.matchLeft(() => E.left(as_), (head,tail) =>  fn(head) ? E.))
 

// )