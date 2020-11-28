const someObject: { [key: string]: string } = {}

const addKey = <A>(name: string, value: A) => (
  obj: Record<string, A>
): Record<string, A> => {
  return Object.assign({}, obj, { name: value })
}

const foo_ = addKey("city", "Shreveport")(someObject)
addKey("state", "Louisiana")(someObject)
