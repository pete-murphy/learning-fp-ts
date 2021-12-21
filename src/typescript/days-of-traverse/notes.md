1. `traverse` signature
   - Usually considered "mapping with effects"
   - Compare signature of `fmap` vs `traverse`
1. First come across `traverse` via `sequence`
   - `sequence` signature and basic usage
   - `Array<Option<X>>` but want `Option<Array<X>>`
   - A lot like `Promise.all` but more general
1. `Promise.all` but more general
   - `Task` in `fp-ts`: both parallel and sequential
   - `Aff` in PureScript: both parallel and sequential
3. `traverse_` for when you want to ignore the result
   - In UI when you have an optional `onClick`
1. You'll notice that `traverse_` & `sequence_` only have a `Foldable` constraint which is more general than `Traversable` since it doesn't require a `Functor` instance, so we can use `traverse_` & `sequence_` for non-`Functor` things (like `Set`)
1. Decorate all the nested elements in a dictionary (a TypeScript `Record`) of arrays with their "absolute" index.
1. More State Applicative: Advent of Code day 8 (tfausak) 
1. Recursive traverse: get all the files & directories of a subdirectory (`getFilesRecursive`)
1. Validation vs Either
1. `sequence` for cartesian product (& password combinations)
1. `sequence` for matrix transposition
1. `sequence` when using `Reader` Applicative instance
1. There is no `Record` Applicative (link to typeclasses article on `Map`) but could there be a `Record` Apply instance?
   - `sequenceNonEmpty` (I'll have to revisit to make sure I got that one right)
1. Let's implement `traverseWithIndex` for `Tree` 
   - we can recover `mapWithIndex` by plugging in `Identity`
2. `traverse` composes
4. Look at signature of `modifyF`: Optics are just `traverse`
5. `worded` implementation in TS
6. `non` implementation in TS