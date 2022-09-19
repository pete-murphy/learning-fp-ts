// javascript program to find maximum cash
// flow among a set of persons
// Number of persons (or vertices in the graph)
var N = 11

// A utility function that returns
// index of minimum value in arr
function getMin(arr) {
  var minInd = 0
  for (i = 1; i < N; i++)
    if (arr[i] < arr[minInd]) minInd = i
  return minInd
}

// A utility function that returns
// index of maximum value in arr
function getMax(arr) {
  var maxInd = 0
  for (i = 1; i < N; i++)
    if (arr[i] > arr[maxInd]) maxInd = i
  return maxInd
}

// A utility function to return minimum of 2 values
function minOf2(x, y) {
  return x < y ? x : y
}

// amount[p] indicates the net amount
// to be credited/debited to/from person 'p'
// If amount[p] is positive, then
// i'th person will amount[i]
// If amount[p] is negative, then
// i'th person will give -amount[i]
function minCashFlowRec(amount) {
  // Find the indexes of minimum and
  // maximum values in amount
  // amount[mxCredit] indicates the maximum amount
  // to be given (or credited) to any person .
  // And amount[mxDebit] indicates the maximum amount
  // to be taken(or debited) from any person.
  // So if there is a positive value in amount,
  // then there must be a negative value
  var mxCredit = getMax(amount),
    mxDebit = getMin(amount)

  // If both amounts are 0, then
  // all amounts are settled
  if (
    amount[mxCredit] == 0 &&
    amount[mxDebit] == 0
  )
    return

  // Find the minimum of two amounts
  var min = minOf2(
    -amount[mxDebit],
    amount[mxCredit]
  )
  amount[mxCredit] -= min
  amount[mxDebit] += min

  // If minimum is the maximum amount to be
  console.log(
    "Person " +
      mxDebit +
      " pays " +
      min +
      " to " +
      "Person " +
      mxCredit
  )

  // Recur for the amount array.
  // Note that it is guaranteed that
  // the recursion would terminate
  // as either amount[mxCredit]  or
  // amount[mxDebit] becomes 0
  minCashFlowRec(amount)
}

// Given a set of persons as graph
// where graph[i][j] indicates
// the amount that person i needs to
// pay person j, this function
// finds and prints the minimum
// cash flow to settle all debts.
function minCashFlow(graph) {
  // Create an array amount,
  // initialize all value in it as 0.
  var amount = Array.from(
    { length: N },
    (_, i) => 0
  )

  // Calculate the net amount to
  // be paid to person 'p', and
  // stores it in amount[p]. The
  // value of amount[p] can be
  // calculated by subtracting
  // debts of 'p' from credits of 'p'
  for (p = 0; p < N; p++)
    for (i = 0; i < N; i++)
      amount[p] += graph[i][p] - graph[p][i]

  minCashFlowRec(amount)
}

// Driver code
// graph[i][j] indicates the amount
// that person i needs to pay person j
const graph = [
  // [0, 1000, 2000],
  // [0, 0, 5000],
  // [0, 0, 0]
  [
    0, 446, 287.8333333, 446, 409.3333333,
    418.7155556, 297.3333333, 297.3333333,
    297.3333333, 258.94, 143.1111111
  ],
  [
    -446, 0, -158.1666667, 0, -36.66666667,
    -27.28444444, 0, 0, 0, -38.39333333,
    -5.555555556
  ],
  [
    -287.8333333, 158.1666667, 0, 158.1666667,
    121.5, 130.8822222, 145.2777778, 145.2777778,
    145.2777778, 106.8844444, 7.333333333
  ],
  [
    -446, 0, -158.1666667, 0, -36.66666667,
    -27.28444444, 0, 0, 0, -38.39333333,
    -5.555555556
  ],
  [
    -409.3333333, 36.66666667, -121.5,
    36.66666667, 0, 9.382222222, 24.44444444,
    24.44444444, 24.44444444, -13.94888889,
    6.666666667
  ],
  [
    -418.7155556, 27.28444444, -130.8822222,
    27.28444444, -9.382222222, 0, 18.18962963,
    18.18962963, 18.18962963, -20.2037037,
    3.539259259
  ],
  [
    -297.3333333, 0, -145.2777778, 0,
    -24.44444444, -18.18962963, 0, 0, 0,
    -33.59555556, -3.703703704
  ],
  [
    -297.3333333, 0, -145.2777778, 0,
    -24.44444444, -18.18962963, 0, 0, 0,
    -33.59555556, -3.703703704
  ],
  [
    -297.3333333, 0, -145.2777778, 0,
    -24.44444444, -18.18962963, 0, 0, 0,
    -33.59555556, -3.703703704
  ],
  [
    -258.94, 38.39333333, -106.8844444,
    38.39333333, 13.94888889, 20.2037037,
    33.59555556, 33.59555556, 33.59555556, 0,
    1.094074074
  ],
  [
    -143.1111111, 5.555555556, -7.333333333,
    5.555555556, -6.666666667, -3.539259259,
    3.703703704, 3.703703704, 3.703703704,
    -1.094074074, 0
  ]
].map(xs => xs.map(x => Math.max(x, 0)))

graph //?

// Print the solution
minCashFlow(graph)
