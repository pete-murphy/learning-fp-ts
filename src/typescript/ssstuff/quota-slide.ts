import { useState } from "react"
import { constTrue, constVoid } from "fp-ts/function"
import * as MUI from "@material-ui/core"
import {
  B,
  Eq,
  flow,
  Id,
  N,
  O,
  Ord,
  pipe,
  RA,
  RNEA,
  Str,
} from "./fp-ts-imports"

import { useMemoEq } from "./hooks/useMemoEq"

type SliderProps = MUI.SliderProps

const isArray: <A>(val: A | Array<A>) => val is Array<A> = Array.isArray as <A>(
  val: A | Array<A>
) => val is Array<A>

const checkBounds: (
  // What does it mean to have a lower/upper bound of `O.none`? Isn't the Slider always bounded?
  lowerBound: O.Option<number>,
  upperBound: O.Option<number>
) => (newValue: number) => boolean = (lowerBound, upperBound) => newValue =>
  pipe(
    O.Do,
    O.apS("lowerBound", lowerBound),
    O.apS("upperBound", upperBound),
    O.fold(
      constTrue,
      ({ lowerBound, upperBound }) =>
        lowerBound < newValue && upperBound > newValue
    )
  )
// {
//   const lowerBoundMet = O.isNone(lowerBound) || lowerBound.value < newValue
//   const upperBoundMet = O.isNone(upperBound) || upperBound.value > newValue
//   return lowerBoundMet && upperBoundMet
// }

const thumbsFromSections: (sections: SliderSections) => SliderThumbs =
  sections =>
    pipe(
      sections,
      RNEA.unprepend,
      ([head, tail]) =>
        pipe(
          tail,
          RA.scanLeft(
            head.percentage,
            (acc, { percentage }) => acc + percentage
          )
        ),
      RNEA.init
    )

const exSections: SliderSections = pipe(
  [
    {
      color: "bar",
      id: "bar",
      label: "bar",
      percentage: 5,
    },
    {
      color: "foo",
      id: "foo",
      label: "foo",
      percentage: 5,
    },
    {
      color: "baz",
      id: "baz",
      label: "baz",
      percentage: 5,
    },
  ],
  RA.prepend({
    color: "asdf",
    id: "asdf",
    label: "asdf",
    percentage: 10,
  })
)

// const getCumulativePercentage: (
//   index: number
// ) => (sections: SliderSections) => number = index =>
//   flow(
//     RA.takeLeft(index + 1),
//     RA.foldMap(N.MonoidSum)(({ percentage }) => percentage)
//   )

thumbsFromSections(exSections) //?

/**
 * Position is relative percentage
 * across the rail, color is the
 * white-space to the left of the
 * thumb
 */
interface SliderSection {
  color: string
  id: string
  label: string
  percentage: number
}

const eqSliderSection: Eq.Eq<SliderSection> = Eq.struct({
  color: Str.Eq,
  id: Str.Eq,
  label: Str.Eq,
  percentage: N.Eq,
})

/**
 * RNEA: an area of the slider
 */
interface SliderSections extends RNEA.ReadonlyNonEmptyArray<SliderSection> {}

/**
 * RA: A node on the slider
 */
interface SliderThumbs extends ReadonlyArray<number> {}

export const useQuotaSlider = (
  sections: SliderSections,
  setSections: (sections: SliderSections) => void
): SliderProps => {
  const thumbs = useMemoEq(
    () => thumbsFromSections(sections),
    [sections],
    RA.getEq(RNEA.getEq(eqSliderSection))
  )

  const updateSections = (thumbIndex: number, newThumbPosition: number) =>
    pipe(
      O.Do,
      O.apS("sectionBeforeThumb", RA.lookup(thumbIndex)(sections)),
      O.apS("sectionAfterThumb", RA.lookup(thumbIndex + 1)(sections)),
      O.chain(({ sectionBeforeThumb, sectionAfterThumb }) =>
        pipe(
          sections,
          RA.scanLeft(),

          // getCumulativePercentage(thumbIndex)(sections) - newThumbPosition,
          sectionDelta =>
            pipe(
              sections,
              /* thumbIndex is guaranteed to exist in sections due to construction */
              RNEA.updateAt(thumbIndex, {
                ...sectionBeforeThumb,
                percentage: sectionBeforeThumb.percentage + sectionDelta,
              }),
              O.chain(
                /* thumbIndex + 1 is guaranteed to exist in sections due to construction */
                RNEA.updateAt(thumbIndex + 1, {
                  ...sectionAfterThumb,
                  percentage: sectionAfterThumb.percentage - sectionDelta,
                })
              )
            )
        )
      ),
      O.fold(constVoid, setSections)
    )

  // const onChange = (
  //   _: { target: { value: unknown } },
  //   newThumbs: number | Array<number>,
  //   thumbIndex: number
  // ) =>
  //   pipe(
  //     newThumbs,
  //     O.fromPredicate(isArray),
  //     O.chain(x => RA.lookup(thumbIndex)(x)),
  //     O.filter(
  //       checkBounds(
  //         RA.lookup(thumbIndex - 1)(thumbs),
  //         RA.lookup(thumbIndex + 1)(thumbs)
  //       )
  //     ),
  //     O.fold(constVoid, activeThumbPosition =>
  //       updateSections(thumbIndex, activeThumbPosition)
  //     )
  //   )

  const onChange = (
    _: { target: { value: unknown } },
    newThumbs_: number | Array<number>,
    thumbIndex: number
  ) =>
    pipe(
      O.Do,
      O.apS(
        "newThumbs",
        pipe(
          O.fromPredicate(isArray)(newThumbs_),
          O.chain(RNEA.fromReadonlyArray)
        )
      ),
      O.bind("focusThumb", ({ newThumbs }) => RA.lookup(thumbIndex)(newThumbs)),
      O.bind("leftThumb", ({ newThumbs }) =>
        RA.lookup(thumbIndex - 1)(newThumbs)
      ),
      O.bind("rightThumb", ({ newThumbs }) =>
        RA.lookup(thumbIndex + 1)(newThumbs)
      ),
      O.filter(({ focusThumb, leftThumb, rightThumb }) =>
        Ord.between(N.Ord)(leftThumb, rightThumb)(focusThumb)
      ),
      O.fold(constVoid, ({ newThumbs }) => setSections(newThumbs))
    )

  return {}
}
