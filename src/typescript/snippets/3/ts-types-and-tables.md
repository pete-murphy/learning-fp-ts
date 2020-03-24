```typescript
enum City {
  BOS = "BOS",
  CHI = "CHI",
  MIA = "MIA",
}

const nameAndCityIdByNameId: Record<number, { name: string; cityId: City }> = {
  1: { name: "Alice", cityId: City.BOS },
  2: { name: "Bob", cityId: City.MIA },
  3: { name: "Carol", cityId: City.CHI },
  4: { name: "Dave", cityId: City.BOS },
}

const cityNameById: Record<City, string> = {
  [City.BOS]: "Boston",
  [City.CHI]: "Chicago",
  [City.MIA]: "Miami",
}
```
