type X = {}
type Y = Record<string, never>

const fooBarX: X = {foo: 9}
const fooBarY: Y = {foo: 9}
const fooBarY2: Y = {}