// export declare const f: <C extends "primary" | "secondary">(params: {
//   color: string;
//   colorName: C;
// }) => {
//   [`${C}1`]: string;
//   [`${C}2`]: string;
//   [`${C}3`]: string;
// };

export declare const f: <C extends "primary" | "secondary">(params: {
  color: string;
  colorName: C;
}) => Record<`${C}${1 | 2 | 3}`, string>;

// f<"primary">({})['']
