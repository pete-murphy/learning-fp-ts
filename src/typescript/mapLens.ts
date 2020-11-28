import { Lens, Iso } from "monocle-ts"

enum Thing {
  One = "one",
  Two = "two",
}

type Data = {
  thing: Thing
}

const mkDataLens = Lens.fromProp<Data>()

const thingLens = mkDataLens("thing")

const thingLens_ = thingLens.composeIso(
  new Iso(
    (t): string => (t === Thing.One ? "One" : "Two"),
    (s: string) => (s === "One" ? Thing.One : Thing.Two)
  )
)

thingLens.get({ thing: Thing.One }) //?
thingLens_.get({ thing: Thing.One }) //?

thingLens_.set("One")({ thing: Thing.One }) //?
// thingLens_.set("sadf")({thing: Thing.One}) //?
