const roMap: ReadonlyMap<string, string> = new Map([])

const coerceToMap = <K, V>(
  m: ReadonlyMap<K, V>
): Map<K, V> => new Map(m)
