import * as TE from "fp-ts/TaskEither"
import * as RTE from "fp-ts/ReaderTaskEither"
import * as F from "fp-ts/function"

type Collection<A> = {
  findOne: ({ _id }: { _id: ObjectId }) => Promise<A>
}
type Poll = string
type ObjectId = string

export const get = (
  coll: Collection<Poll>
): ((pollId: ObjectId) => TE.TaskEither<string, Poll>) =>
  F.flow(
    TE.tryCatchK(
      (pollId: ObjectId) => coll.findOne({ _id: pollId }),
      err => `Could not get poll: ${err}`
    ),
    TE.filterOrElse(
      (poll): poll is Poll => poll != null,
      () => "Poll not found"
    )
  )

export const getRTE = (pollId: ObjectId) =>
  F.pipe(
    RTE.ask<Collection<Poll>>(),
    RTE.chain(({ findOne }) =>
      TE.tryCatchK(
        () => findOne({ _id: pollId }),
        err => `Could not get poll: ${err}`
      )
    ),
    RTE.filterOrElse(
      (poll): poll is Poll => poll != null,
      () => "Poll not found"
    )
  )

const getManyRTE: (
  pollIds: ReadonlyArray<ObjectId>
) => RTE.ReaderTaskEither<
  Collection<Poll>,
  string,
  ReadonlyArray<Poll>
> = RTE.traverseArray(getRTE)

// getManyRTE(pollIds)()
