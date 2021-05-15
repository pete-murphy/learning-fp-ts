// import * as RD from '@devexperts/remote-data-ts'
// import * as Eq from 'fp-ts/Eq'
// import * as RTE from 'fp-ts/ReaderTaskEither'
// import * as O from 'fp-ts/Option'
// import { debounce, } from 'lodash/fp'
// import { pipe } from 'fp-ts/function'

// type T = { foo: number}
// type E = Error
// type A = {}
// const saveData: RD.RemoteData<E, T> = RD.initial
// const setSaveData = (rd: RD.RemoteData<E, T>) => {}
// const data: T = {foo: 9}

// const eq: Eq.Eq<T> = Eq.getStructEq({foo: Eq.eqNumber})

// const update: (data: T) => RTE.ReaderTaskEither<A, E, T> = data => RTE.of(data)

// const updateData = debounce(100, (nextData: T) => {
// pipe(
//   saveData,
//   RD.alt<E, T>(() => RD.success(data)),
//   RD.toOption,
//   O.chain(O.fromPredicate(d => !eq.equals(d, nextData))),
//   O.fold(() => {}, d => {
//     setSaveData(RD.pending)
//     return pipe(
//       update(d),
//       RTE.fold(
//         e =>
//           RTE.fromIO(() => {
//             setSaveData(RD.failure(e))
//           }),
//         d =>
//           RTE.fromIO(() => {
//             setSaveData(RD.success(d))
//           }),
//       ),
//       RTE.runP(commonEnvs),
//     )
//   }),
// )
// })
