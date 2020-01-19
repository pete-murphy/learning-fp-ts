import { or, or_, and, and_ } from "./or"
import {
  failure,
  initial,
  pending,
  remoteData,
  success,
} from "@devexperts/remote-data-ts"
import { option, none, some } from "fp-ts/lib/Option"
import { array } from "fp-ts/lib/Array"

or(remoteData)(initial) //?
or(remoteData)(pending) //?
or(remoteData)(failure("Oops!")) //?
or(remoteData)(failure(true)) //?
or(remoteData)(success(false)) //?
or(remoteData)(success(true)) //?

or(option)(none) //?
or(option)(some(false)) //?
or(option)(some(true)) //?

or(array)([false, false, false]) //?
or(array)([true, false, false]) //?
or(array)([]) //?
or(array)([true]) //?

or_(remoteData)(initial) //?
or_(remoteData)(pending) //?
or_(remoteData)(failure("Oops!")) //?
or_(remoteData)(failure(true)) //?
or_(remoteData)(success(false)) //?
or_(remoteData)(success(true)) //?

or_(option)(none) //?
or_(option)(some(false)) //?
or_(option)(some(true)) //?

or_(array)([false, false, false]) //?
or_(array)([true, false, false]) //?
or_(array)([]) //?
or_(array)([true]) //?

and(remoteData)(initial) //?
and(remoteData)(pending) //?
and(remoteData)(failure("Oops!")) //?
and(remoteData)(failure(true)) //?
and(remoteData)(success(false)) //?
and(remoteData)(success(true)) //?

and(option)(none) //?
and(option)(some(false)) //?
and(option)(some(true)) //?

and(array)([false, false, false]) //?
and(array)([true, false, false]) //?
and(array)([]) //?
and(array)([true]) //?

and_(remoteData)(initial) //?
and_(remoteData)(pending) //?
and_(remoteData)(failure("Oops!")) //?
and_(remoteData)(failure(true)) //?
and_(remoteData)(success(false)) //?
and_(remoteData)(success(true)) //?

and_(option)(none) //?
and_(option)(some(false)) //?
and_(option)(some(true)) //?

and_(array)([false, false, false]) //?
and_(array)([true, false, false]) //?
and_(array)([]) //?
and_(array)([true]) //?
