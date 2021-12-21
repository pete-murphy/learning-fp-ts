const data_raw = [
  {
    name: "RS_foldMap: 10 elements",
    ops: 1390387,
    margin: 0.76,
    percentSlower: 95.13,
  },
  {
    name: "RS_foldMap: 31 elements",
    ops: 370871,
    margin: 0.59,
    percentSlower: 98.7,
  },
  {
    name: "RS_foldMap: 100 elements",
    ops: 76249,
    margin: 0.27,
    percentSlower: 99.73,
  },
  {
    name: "RS_foldMap: 316 elements",
    ops: 14836,
    margin: 1.21,
    percentSlower: 99.95,
  },
  {
    name: "RS_foldMap: 1000 elements",
    ops: 3735,
    margin: 1.13,
    percentSlower: 99.99,
  },
  {
    name: "foldMapCommutative: 10 elements",
    ops: 28524331,
    margin: 1.05,
    percentSlower: 0,
  },
  {
    name: "foldMapCommutative: 31 elements",
    ops: 10206847,
    margin: 0.98,
    percentSlower: 64.22,
  },
  {
    name: "foldMapCommutative: 100 elements",
    ops: 3365256,
    margin: 0.51,
    percentSlower: 88.2,
  },
  {
    name: "foldMapCommutative: 316 elements",
    ops: 1148368,
    margin: 0.4,
    percentSlower: 95.97,
  },
  {
    name: "foldMapCommutative: 1000 elements",
    ops: 429146,
    margin: 0.29,
    percentSlower: 98.5,
  },
]

const margined = (marginPct, number) => {
  const d = (marginPct / 100) * number
  return [number - d / 2, number, number + d / 2]
}
const getDataByKey = key => {
  const filtered = data_raw.filter(d => d.name.startsWith(key))
  return filtered.map(d => {
    const [value0, value, value1] = margined(d.margin, 1 / d.ops)
    const size = +d.name.replace(/\w+: (\d+)( elements)/, "$1")
    return {
      size,
      value,
      value0,
      value1,
    }
  })
}

// getDataByKey("foldMapCommutative") //?
