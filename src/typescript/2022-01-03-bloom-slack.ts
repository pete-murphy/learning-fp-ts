interface Node {
  path: string[]
  distance: number
  visited: Set<string>
}

for (let start of itinerary) {
  const stack: Node[] = [
    { path: [start.id], distance: 0, visited: new Set() },
  ]
  while (stack.length > 0) {
    const cur: Node = stack.pop()
    cur.visited.add(cur.path[cur.path.length - 1])
  }
}
