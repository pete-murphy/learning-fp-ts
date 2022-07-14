import * as L from "monocle-ts/Lens"
import * as Op from "monocle-ts/Optional"
import Optional = Op.Optional
import Option = O.Option
import * as O from "fp-ts/Option"
import { flip, flow, pipe } from "fp-ts/function"
import * as At from "monocle-ts/At"

type ROA<A> = readonly A[]
type ROR<A> = Readonly<Record<string, A>>

/** MODEL **/
export type Store = {
  entities: {
    items: ROR<Item>
    groups: ROR<Group>
  }
}

export type Item = {
  id: string
  groups: ROA<Group["id"]>
}

export type Group = {
  id: string
  items: ROA<Item["id"]>
}

/** HELPERS **/
const getOption =
  <S, A>(optional: Optional<S, A>) =>
  (s: S): Option<A> =>
    optional.getOption(s)

const setOptional =
  <S, A>(optional: Optional<S, A>) =>
  (a: A) =>
  (s: S): S =>
    optional.set(a)(s)

/** OPTICS **/
type GetEntity<A> = (id: string) => (s: Store) => Option<A>
type SetEntity<A> = (
  id: string
) => (a: A) => (s: Store) => Store

const entitiesLens = pipe(L.id<Store>(), L.prop("entities"))
const itemsLens = pipe(entitiesLens, L.prop("items"))
const groupsLens = pipe(entitiesLens, L.prop("groups"))

const itemLens = (id: string) => pipe(itemsLens, L.key(id))
const itemLensAt = flow(
  At.atReadonlyRecord<Item>().at,
  lens => pipe(itemsLens, L.composeLens(lens))
)
const getItemAt: GetEntity<Item> = flow(
  itemLensAt,
  _ => _.get
)
const setItemAt = flow(itemLensAt, _ => _.set)

const groupLens = (id: string) =>
  pipe(groupsLens, L.key(id))

export const getItem: GetEntity<Item> = flow(
  itemLens,
  getOption
)

// export const getItemAt: GetEntity<Item> = id => itemLensAt.at(id).get

export const setItem: SetEntity<Item> = flow(
  itemLens,
  setOptional
)

export const getGroup: GetEntity<Group> = flow(
  groupLens,
  getOption
)
export const setGroup: SetEntity<Group> = flow(
  groupLens,
  setOptional
)
