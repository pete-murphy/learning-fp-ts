type Add = "Add"
type Mul = "Mul"
type Sub = "Sub"
type Div = "Div"

type Neg = "Neg"
type Id = "Id"

type BinaryOp = {
  type: "BinaryOp"
  left: Expr
  right: Expr
  operator: Add | Mul | Sub | Div
}

type UnaryOp = {
  type: "UnaryOp"
  inner: Expr
  operator: Neg | Id
}

type Lit = {
  type: "Lit"
  value: number
}

type Expr = BinaryOp | UnaryOp | Lit

/**
 * Same as in Haskell:
 *
 * data Expr =
 *   Add Expr Expr
 *   Mul Expr Expr
 *   Sub Expr Expr
 *   Div Expr Expr
 *   Neg Expr
 *   Id Expr
 *   Lit Integer
 */

const evaluate = (expr: Expr): number => {
  // Like pattern matching on a constructor
  switch (expr.type) {
    case "Lit":
      return expr.value
    case "UnaryOp":
      return (
        (expr.operator === "Id" ? 1 : -1) *
        evaluate(expr.inner)
      )
    case "BinaryOp":
      return ((x: number, y: number) => {
        switch (expr.operator) {
          case "Add":
            return x + y
          case "Mul":
            return x * y
          case "Sub":
            return x - y
          case "Div":
            return x / y
        }
      })(
        evaluate(expr.left),
        evaluate(expr.right)
      )
  }
}

/**
 * In Haskell:
 *
 * evaluate :: Expr -> Integer
 * evaluate (Lit n)   = n
 * evaluate (Add n m) = (evaluate n) + (evaluate m)
 * evaluate (Sub n m) = (evaluate n) - (evaluate m)
 * evaluate (Mul n m) = (evaluate n) * (evaluate m)
 * evaluate (Div n m) = (evaluate n) `div` (evaluate m)
 * evaluate (Id n)    = evaluate n
 * evaluate (Neg n)   = -(evaluate n)
 */
