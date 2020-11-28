import React, { FC } from "react"
import { Contravariant1 } from "fp-ts/lib/Contravariant"
import { Semigroup } from "fp-ts/lib/Semigroup"
import { flow } from "fp-ts/lib/function"

// Registering HKT
export const URI = "FC"

export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    readonly FC: FC<A>
  }
}

// Defining Instances
export const Contravariant: Contravariant1<URI> = {
  URI,
  contramap: (fc, f) => flow(f, fc),
}

export const getSemigroup = <A>(): Semigroup<FC<A>> => ({
  concat: (fc1: FC<A>, fc2: FC<A>): FC<A> => (props: A) =>
    React.createElement(React.Fragment, {}, [fc1(props), fc2(props)]),
})
