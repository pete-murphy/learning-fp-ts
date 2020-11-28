import { pipe } from "fp-ts/lib/pipeable"

export type ADTMember<ADT, Key extends string, Type extends string> = Extract<
  ADT,
  { [k in Key]: Type }
>

type Matchers<Key extends string, ADT extends { [k in Key]: string }, Out> = {
  [D in ADT[Key]]: (v: ADTMember<ADT, Key, D>) => Out
}

export const matchOn = <K extends string>(key: K) => <
  ADT extends { [k in K]: string },
  Z
>(
  matchObj: Matchers<K, ADT, Z>
) => (v: ADT) => matchObj[v[key]](v as ADTMember<ADT, K, typeof v[K]>)

export const matchOnI = <K extends string>(key: K) => <
  ADT extends { [k in K]: string }
>(
  v: ADT
) => <Z>(matchObj: Matchers<K, ADT, Z>) =>
  matchObj[v[key]](v as ADTMember<ADT, K, typeof v[K]>)

/**
 * Pattern matcher for matching over tagged unions whose discriminant value is "tag"
 * @example 
 * ```ts
 * export type TicketDetail =
  | {
      tag: 'tracking'
    }
  | {
      tag: 'info'
      contents: TicketInfoRequest
    }
  | {
      tag: 'change'
      contents: TicketChangeRequest
    }

    declare const detail: TicketDetail 
    pipe(detail, 
        match({
            tracking: () => "I'm super tracked!", 
            info: i => i.contents.status,
            change: c => c.contents.justification
    }))
 * ```
 */
export const match = matchOn("tag")

/**
 * Like {@link match} but inverted argument order
 * @example 
 * ```ts
 * export type TicketDetail =
  | {
      tag: 'tracking'
    }
  | {
      tag: 'info'
      contents: TicketInfoRequest
    }
  | {
      tag: 'change'
      contents: TicketChangeRequest
    }

    declare const detail: TicketDetail 
    matchI(detail)({
        tracking: () => "I'm super tracked!", 
        info: i => i.contents.status,
        change: c => c.contents.justification
    })
 * ```
 */
export const matchI = matchOnI("tag")
