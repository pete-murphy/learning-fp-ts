import posts from "./posts.json"
import * as RR from "fp-ts/ReadonlyRecord"
import { pipe, tuple } from "fp-ts/function"
import * as RA from "fp-ts/ReadonlyArray"
import * as Sg from "fp-ts/Semigroup"
import * as N from "fp-ts/number"

type Post = typeof posts[number]

// Reduce approach
posts.reduce(
  (acc, curr) => ({ ...acc, [curr.id]: curr }),
  {}
)

// Reduce approach
posts.reduce<Record<string, Post>>((acc, curr) => {
  acc[curr.id] = curr
  return acc
}, {})

// Object.fromEntries approach
Object.fromEntries(posts.map(post => [post.id, post]))

// RR.fromFoldable
pipe(
  posts,
  RA.map(post => tuple(N.Show.show(post.id), post)),
  RR.fromFoldable(Sg.first<Post>(), RA.Foldable)
)

// RR.fromFoldableMap
RR.fromFoldableMap(Sg.first<Post>(), RA.Foldable)(
  posts,
  post => [N.Show.show(post.id), post]
)
