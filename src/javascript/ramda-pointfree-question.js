import {
  useWith,
  identity,
  flip,
  filter,
  pipe,
  includes,
  prop,
  converge,
  equals,
} from "ramda"

/* data */

const widgets = [{ id: 1 }, { id: 2 }, { id: 3 }]
const widgetsIds = [1, 2]

/* normal solution */
const getWidgetsByIds = passedWidgets => ids =>
  passedWidgets.filter(({ id }) =>
    ids.includes(id)
  )

/* point free solution */
const flippedFilter = flip(filter)
const flippedIncludes = flip(includes)
const flipConverge = flip(converge)

const makeFilterFunc = pipe(
  flippedIncludes,
  flipConverge([prop("id")])
)
const getWidgetsByIdsPointFree = useWith(
  flippedFilter,
  [identity, makeFilterFunc]
)

const result = getWidgetsByIds(widgets)(
  widgetsIds
)
const pointFreeResult = getWidgetsByIdsPointFree(
  widgets
)(widgetsIds)
const areEqual = equals(pointFreeResult, result)

pointFreeResult



console.log(areEqual) // true
