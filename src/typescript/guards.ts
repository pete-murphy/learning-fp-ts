enum Trend {
  Up = "up",
  Down = "down",
  Flat = "flat"
}

// type Trend = "up" | "down" | "flat";

// nested ternary way
const getTrendFromScoreDifference = (scoreDifference: number): Trend =>
  scoreDifference > 0
    ? Trend.Up
    : scoreDifference < 0
    ? Trend.Down
    : Trend.Flat;

// weird logic gate way (not actually convinced this works)
// const getTrendFromScoreDifference = (scoreDifference): Trend =>
//   (scoreDifference > 0 && "up") ||
//   (scoreDifference < 0 && "down") ||
//   (scoreDifference === 0 && "flat");

// if statement way
// const getTrendFromScoreDifference = (scoreDifference): Trend => {
//   if (scoreDifference > 0) return "up";
//   if (scoreDifference < 0) return "down";
//   if (scoreDifference === 0) return "flat";
// };
