import * as queryString from "query-string"

const res = queryString.parseUrl("/example?&foo=bar")
console.log(res)
