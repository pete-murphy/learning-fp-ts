import {
  taskEither as TE,
  either as E,
  readonlyArray as A,
  foldable as Fld,
} from "fp-ts";
import { pipe } from "fp-ts/function";

export const getAmountOut = TE.tryCatchK(
  async (fromAmount: bigint, lp: AeroDromeLP): Promise<bigint> => {
    const [, amount] = await getAmountsOut(
      fromAmount,
      lp.token0,
      lp.token1,
      false,
      abi.AERODROME_POOLFACTORY.address,
    );
    return amount;
  },
  E.toError,
);

const getRouteAmounts = (
  route: Route,
  fromAmount: bigint,
): TE.TaskEither<Error, bigint> =>
  pipe(route, Fld.reduceM(TE.Monad, A.Foldable)(fromAmount, getAmountOut));

// const getRouteAmounts = (
//   route: Route,
//   fromAmount: bigint,
// ) => {
//   return asyncReduce(getAmountOut, fromAmount)(route);
// };

// ----- Missing type defs
declare const getAmountsOut: (
  fromAmount: bigint,
  token0: string,
  token1: string,
  b: boolean,
  address: string,
) => Promise<[bigint, bigint]>;
declare const abi: {
  AERODROME_POOLFACTORY: {
    address: string;
  };
};
type AeroDromeLP = { token0: string; token1: string };
type Route = Array<AeroDromeLP>;
// -----
