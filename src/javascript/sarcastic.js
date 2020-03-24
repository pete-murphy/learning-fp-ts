const str =
  "In this manner with letters switching from upper to lower even if there is a space."

const sarcastic = str =>
  [...str].reduce(
    ([bool, cs], c) => {
      const nextBool = c === " " ? bool : !bool
      return [
        nextBool,
        bool
          ? cs.concat(c.toLocaleUpperCase())
          : cs.concat(c.toLocaleLowerCase()),
      ]
    },
    [true, ""]
  )[1]

sarcastic(str) //?

// > How would I loop over and pick out the oldest vehicle?

const vehicles = [
  { Vehicle: "T11", Age: "12", Reliability: "Low", Location: "London" },
  { Vehicle: "M31", Age: "5", Reliability: "High", Location: "York" },
  { Vehicle: "B2", Age: "30", Reliability: "Medium", Location: "Paris" },
  { Vehicle: "B2", Age: "25", Reliability: "Low", Location: "London" },
  { Vehicle: "T100", Age: "18", Reliability: "High", Location: "York" },
  // Lots more...
]

vehicles.reduce((oldest, curr) => (+curr.Age > +oldest.Age ? curr : oldest)) //?
vehicles.sort((a, b) => b.Age - a.Age)[0] //?
