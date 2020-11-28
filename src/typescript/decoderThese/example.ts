import * as DTh from "./DecoderThese"

const fo = DTh.literal("foo").decode("foo") //?

DTh.fromArray(DTh.literal("foo")).decode([]) //?

console.log(fo)
