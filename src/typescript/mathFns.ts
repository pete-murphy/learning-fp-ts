const fns: Pick<typeof Math, "abs" | "cos" | "sin"> = {
  abs: n => Math.abs(n),
  cos: n => Math.cos(n),
  sin: n => Math.sin(n),
}

fns.abs(9)
