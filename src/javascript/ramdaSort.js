import * as R from "ramda"

const sortByProp = R.curry(function (field, direction = "ASC") {
  return R.sortWith([
    R.cond([
      [() => direction === "ASC", R.ascend(R.prop(field))],
      [() => direction === "DESC", R.descend(R.prop(field))],
    ]),
  ])
})

const sortByProp_ = R.curry(function (field, direction = "ASC") {
  return R.sortWith([
    { ASC: R.ascend, DESC: R.descend }[direction](R.prop(field)),
  ])
})

sortByProp("a")([{ a: 1 }, { a: 0 }, { a: 2 }]) //?
sortByProp_("a")([{ a: 1 }, { a: 0 }, { a: 2 }]) //?
