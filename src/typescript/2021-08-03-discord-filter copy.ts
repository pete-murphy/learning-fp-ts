import { identity, pipe, RA as A, Re } from "./ssstuff/fp-ts-imports"

declare const selectedCategories: ReadonlyArray<{ value: string }>
declare const selectedSubcategories: ReadonlyArray<{ value: string }>
declare const selectedStrains: ReadonlyArray<{ value: string }>
declare const selectedBrands: ReadonlyArray<{ value: string }>
declare const selectedVariants: ReadonlyArray<{ label: string }>

declare const searcher: {
  readonly search: (query: string) => ReadonlyArray<{
    category?: { id: number }
    subcategory?: { id: number }
    strain?: { id: number }
    brand?: { id: number }
    product_variants: ReadonlyArray<{ name: string }>
  }>
}

declare const query: string

const liftedOr = <R>(
  x: Re.Reader<R, boolean>,
  y: Re.Reader<R, boolean>
): Re.Reader<R, boolean> =>
  pipe(
    Re.Do,
    Re.apS("x", x),
    Re.apS("y", y),
    Re.map(({ x, y }) => x || y)
  )

const products = pipe(
  searcher.search(query),
  // selectedCategories.length > 0
  //   ? A.filter(({ category }) =>
  //       pipe(
  //         selectedCategories,
  //         A.exists(({ value }) => value === category?.id.toString())
  //       )
  //     )
  //   : A.filter(() => true),
  A.filter(({ category }) =>
    pipe(
      selectedCategories,
      liftedOr(
        A.isEmpty,
        A.exists(({ value }) => value === category?.id.toString())
      )
    )
  ),
  selectedSubcategories.length > 0
    ? A.filter(
        ({ subcategory }) =>
          !!selectedSubcategories.find(
            ({ value }) => value === subcategory?.id.toString()
          )
      )
    : identity,
  selectedStrains.length > 0
    ? A.filter(
        ({ strain }) =>
          !!selectedStrains.find(({ value }) => value === strain?.id.toString())
      )
    : identity,
  selectedBrands.length > 0
    ? A.filter(
        ({ brand }) =>
          !!selectedBrands.find(({ value }) => value === brand?.id.toString())
      )
    : identity,
  selectedVariants.length > 0
    ? A.filter(
        ({ product_variants }) =>
          !!product_variants.find(
            variant =>
              !!selectedVariants.find(({ label }) => variant.name === label)
          )
      )
    : identity
)
