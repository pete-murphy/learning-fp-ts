import * as RA from "fp-ts/lib/ReadonlyArray"
import { pipe } from "fp-ts/lib/function"

type ExtractRouteParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer Start}:${infer Param}/${infer Rest}`
  ? { [k in Param | keyof ExtractRouteParams<Rest>]: string }
  : T extends `${infer Start}:${infer Param}`
  ? { [k in Param]: string }
  : {}

type RouteDefinition<T extends string> = {
  definition: T
  make: (params: ExtractRouteParams<T>) => string
}

const routeHelper = <T extends string>(path: T): RouteDefinition<T> => ({
  definition: path,
  make: params =>
    pipe(
      params,
      Object.entries,
      RA.reduce(path as string, (prevPath, [k, v]) =>
        prevPath.replace(`:${k}`, v)
      )
    ),
})

const fooRoute = routeHelper("foo/:bar/:baz")
fooRoute.definition
console.log(fooRoute.make({ bar: "bar546", baz: "baz" }))
