/**
 * Select the member of a union type by matching on the the provided key, `K`,
 * and value, `V`. Returns `never` if no match occurs.
 */
export type OmitUnionMember<
  Tag extends PropertyKey,
  TagValue,
  U extends object
> = U extends {
  [P in Tag]: TagValue
} &
  infer A
  ? unknown extends A
    ? never
    : U
  : never

/**
 * A specialization of `SelectUnionMember`, matching on the `tag` field with
 * a given type-level string literal, `T`. Returns `never` if no match occurs.
 */
export type OmitUnionMemberByTag<
  T extends string,
  U extends object
> = OmitUnionMember<"tag", T, U>

type E__ = OmitUnionMemberByTag<"foo", Example>

type Example =
  | { tag: "foo"; contents: FooContents }
  | { tag: "bar"; contents: BarContents }
  | { tag: "baz"; contents: BazContents }

type FooContents = {}
type BarContents = {}
type BazContents = {}
