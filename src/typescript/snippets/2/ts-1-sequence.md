```typescript
const personFromId = (id: number): Option<Person> =>
  sequenceS(option)({
    id: some(id),
    name: Record.lookup(id, nameById),
    city: Record.lookup(id, cityById),
  })
```
