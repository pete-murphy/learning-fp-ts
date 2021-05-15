import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider"
import * as N from "fp-ts/number"
import * as O from "fp-ts/Option"
import * as Ord from "fp-ts/Ord"
import * as RA from "fp-ts/ReadonlyArray"
import * as RNEA from "fp-ts/ReadonlyNonEmptyArray"
import * as G from "io-ts/Guard"
import * as I from "monocle-ts/Iso"
import { pipe, constVoid } from "fp-ts/function"
import { interpolateRgb } from "d3-interpolate"

import "./styles.css"

const WIDTH = 600
const useStyles = makeStyles({
  root: {
    marginTop: 100,
    width: WIDTH,
  },
})

interface SliderSection {
  readonly color: string
  readonly id: string
  readonly label: string
  readonly percentage: number
}

type Percentages = ReadonlyArray<number>
type Thumbs = RNEA.ReadonlyNonEmptyArray<number>

// Can always recover thumbs from percentages and vice versa
const isoPercentagesThumbs: I.Iso<Percentages, Thumbs> = I.iso(
  RA.scanLeft(0, N.Field.add),
  ns => RA.zipWith(RNEA.tail(ns), ns, N.Field.sub)
)

type SliderSections = RNEA.ReadonlyNonEmptyArray<SliderSection>

function RangeSlider(props: {
  sections: SliderSections
  setSections: (f: (sections: SliderSections) => SliderSections) => void
}) {
  const classes = useStyles()

  const onChange = (
    _: Event,
    value: number | Array<number>,
    thumbIndex: number
  ) =>
    pipe(
      value,
      O.fromPredicate(G.array<number>(G.number).is),
      O.chain(RNEA.fromReadonlyArray),
      O.filter(thumbs => Ord.between(N.Ord)(1, thumbs.length - 2)(thumbIndex)),
      O.map(isoPercentagesThumbs.reverseGet),
      O.chain(RNEA.fromReadonlyArray),
      O.fold(constVoid, newPercentages =>
        props.setSections(sections =>
          RNEA.zipWith(newPercentages, sections, (percentage, section) => ({
            ...section,
            percentage,
          }))
        )
      )
    )

  const localValue = pipe(
    props.sections,
    RNEA.map(s => s.percentage),
    isoPercentagesThumbs.get,
    RA.toArray
  )

  return (
    <div className={classes.root}>
      <Slider
        value={localValue}
        onChange={onChange}
        disableSwap={true}
        valueLabelDisplay="off"
        aria-labelledby="range-slider"
      />
      <ul
        style={{
          margin: 0,
          marginTop: -18,
          padding: 0,
          display: "flex",
          width: WIDTH,
        }}
      >
        {props.sections.map(section => (
          <div
            key={section.id}
            style={{
              background: section.color,
              width: `${section.percentage}%`,
              paddingBlock: "0.5rem",
              overflow: "visible",
            }}
          >
            <Typography>{section.label}</Typography>
            <Typography>{section.percentage}%</Typography>
          </div>
        ))}
      </ul>
    </div>
  )
}

const interpolateColor = interpolateRgb("tomato", "papayawhip")

const initialState = pipe(
  [
    {
      id: "foo",
      label: "Foo",
      percentage: 20,
    },
    {
      id: "bar",
      label: "Bar",
      percentage: 40,
    },
    {
      id: "baz",
      label: "Baz",
      percentage: 25,
    },
    {
      id: "quux",
      label: "Quux",
      percentage: 15,
    },
  ],
  RNEA.mapWithIndex(
    (i, x): SliderSection => ({
      ...x,
      color: interpolateColor(i / 3),
    })
  )
)

export default function App() {
  const [sections, setSections] = React.useState<SliderSections>(initialState)
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <main
        style={{
          display: "flex",
          placeContent: "center",
        }}
      >
        <RangeSlider sections={sections} setSections={setSections} />
      </main>
    </div>
  )
}
