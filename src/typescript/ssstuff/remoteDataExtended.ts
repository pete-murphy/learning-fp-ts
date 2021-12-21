type Initial = { _tag: "initial" }
type Pending = { _tag: "pending" }
type Failure<E> = { _tag: "failure"; failure: E }
type Empty = { _tag: "empty" }
type Success<A> = { _tag: "success"; success: A }

// (2 + e) * (1 + a)
// = ((2 + e) * 1) + ((2 + e) * a)
// = 2 + e + 2a + ea
// = 1 + 1 + e + a + a + ea
// WriterT (OptionT Option e) (Option a)
type RemoteDataExt<E, A> = {
  nonSuccessState: Initial | Pending | Failure<E>
  successState: Empty | Success<A>
}
