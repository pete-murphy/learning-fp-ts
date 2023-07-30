import { pipe } from "fp-ts/function";
import {
  readonlyArray as A,
  either as E,
  semigroup as Sg,
  readonlyNonEmptyArray as NEA,
  ord as Ord,
  number as N,
} from "fp-ts";

declare class ConfigurationProperties {
  merge(other: ConfigurationProperties): ConfigurationProperties;
}
declare const props0: ConfigurationProperties;
declare const props1: ConfigurationProperties;
declare const props2: ConfigurationProperties;

const S: Sg.Semigroup<ConfigurationProperties> = {
  concat: (x, y) => x.merge(y),
};

const result = NEA.concatAll(S)([props0, props1, props2]);

// export const merge =
//     (props: ConfigurationProperties) => (other: ConfigurationProperties) =>
//         props.merge(other);
