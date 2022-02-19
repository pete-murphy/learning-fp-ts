import * as Mn from "fp-ts/Monoid"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RA from "fp-ts/ReadonlyArray"
import { identity, pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import * as Str from "fp-ts/string"

import * as T from "monocle-ts/Traversal"

// Stub types
type Object3D = string
type MutableRefObject<A> = { ref: A }

type Foo = {
  meshRefs: {
    [houseId: string]: {
      [moduleId: string]: {
        [elementName: string]: ReadonlyArray<
          MutableRefObject<Object3D>
        >
      }
    }
  }
}

type RefInfo = {
  houseId: string
  moduleId: string
  elementName: string
  refObject: MutableRefObject<Object3D>
}

const refA: RefInfo = {
  houseId: "foo",
  moduleId: "bar",
  elementName: "baz",
  refObject: { ref: "refA" }
}

const refB: RefInfo = {
  houseId: "foo",
  moduleId: "bar",
  elementName: "baz",
  refObject: { ref: "refB" }
}

const refInfoToFoo = (refInfo: RefInfo): Foo => ({
  meshRefs: {
    [refInfo.houseId]: {
      [refInfo.moduleId]: {
        [refInfo.elementName]: [refInfo.refObject]
      }
    }
  }
})

const monoidFoo: Mn.Monoid<Foo> = Mn.struct({
  meshRefs: RR.getMonoid(
    RR.getMonoid(
      RR.getMonoid(
        RA.getMonoid<MutableRefObject<Object3D>>()
      )
    )
  )
})

const foo1: Foo = monoidFoo.empty
// { meshRefs: {} }
console.log("foo1", foo1)

const foo2 = monoidFoo.concat(foo1, refInfoToFoo(refA))
// { meshRefs: { foo: { bar: { baz: [ { ref: 'refA' } ] } } } }
console.log("foo2", foo2)

const foo3 = monoidFoo.concat(foo2, refInfoToFoo(refB))
// { meshRefs: { foo: { bar: { baz: [ { ref: 'refA' }, { ref: 'refB' } ] } } } }
console.log("foo3", foo3)

const allRefsWithHouseId = (houseId: string) =>
  pipe(
    T.id<Foo>(),
    T.prop("meshRefs"),
    T.key(houseId),
    T.traverse(RR.getTraversable(Str.Ord)),
    T.traverse(RR.getTraversable(Str.Ord)),
    T.fold(RA.getMonoid<MutableRefObject<Object3D>>())
  )

console.log("Using monocle-ts")
console.log(allRefsWithHouseId("foo")(foo3))
console.log(allRefsWithHouseId("non-existent-key")(foo3))

const M = RA.getMonoid<MutableRefObject<Object3D>>()
const allRefsWithHouseId_ =
  (houseId: string) => (foo: Foo) =>
    pipe(
      foo.meshRefs,
      RR.lookup(houseId),
      O.foldMap(M)(
        RR.foldMap(Str.Ord)(M)(
          RR.foldMap(Str.Ord)(M)(identity)
        )
      )
    )

console.log("Using fp-ts")
console.log(allRefsWithHouseId_("foo")(foo3))
console.log(allRefsWithHouseId_("non-existent-key")(foo3))
