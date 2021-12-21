// import {
//   Eq,
//   flow,
//   N,
//   Show,
//   Str,
// } from '@simspace/monorail/sharedHelpers/fp-ts-imports'

import { match } from "./matchers"
import { Eq, flow, N, pipe, Show, Str } from "./ssstuff/fp-ts-imports"

// import { match, matchSI } from '@simspace/monorail/sharedHelpers/matchers'

// import { ResourceType } from 'src/admin/resourceQuotas/domain/ResourceType'
// import { UnitM } from 'src/common/api/quota'

// Generated type:
// type UnitM = 'cores' | 'megabytes' | 'licenses'

export type Unit = VCPU | License | Megabyte

type VCPU = { readonly tag: "vcpu" }
type License = { readonly tag: "license" }

type Kilobyte = { tag: "kb" }
type Megabyte = { tag: "mb" }
type Gigabyte = { tag: "gb" }
type Terabyte = { tag: "tb" }
type Petabyte = { tag: "pb" }

export type ByteUnit = Kilobyte | Megabyte | Gigabyte | Terabyte | Petabyte

type KilobyteValue = Kilobyte & { value: number }
type MegabyteValue = Megabyte & { value: number }
type GigabyteValue = Gigabyte & { value: number }
type TerabyteValue = Terabyte & { value: number }
type PetabyteValue = Petabyte & { value: number }
type VCPUValue = VCPU & { value: number }
type LicenseValue = License & { value: number }

export type UnitValue =
  | KilobyteValue
  | MegabyteValue
  | GigabyteValue
  | TerabyteValue
  | PetabyteValue
  | VCPUValue
  | LicenseValue

const ONE_THOUSAND = 1000
const ONE_MILLION = 1_000_000
const ONE_BILLION = 1_000_000_000

// Constructors

export const license: License = { tag: "license" as const }
export const vcpu: Unit = { tag: "vcpu" as const }
export const kb: ByteUnit = { tag: "kb" as const }
export const mb: ByteUnit & Unit = { tag: "mb" as const } // Note: MB inhabits multiple types
export const gb: ByteUnit = { tag: "gb" as const }
export const tb: ByteUnit = { tag: "tb" as const }
export const pb: ByteUnit = { tag: "pb" as const }

// export const fromUnitM = matchSI<UnitM, Unit>({
//   cores: () => vcpu,
//   licenses: () => license,
//   megabytes: () => mb,
// })

// Unit Conversions (Endofunctors?)

const div = N.Field.div // equivalent to `/`
const mul = N.Field.mul // equivalent to `*`

export const kbToMb = ({ value }: KilobyteValue): MegabyteValue => ({
  value: div(value, ONE_THOUSAND),
  ...mb,
})
export const mbToKb = ({ value }: MegabyteValue): KilobyteValue => ({
  value: mul(value, ONE_THOUSAND),
  ...kb,
})
export const mbToGb = ({ value }: MegabyteValue): GigabyteValue => ({
  value: div(value, ONE_THOUSAND),
  ...gb,
})
export const mbToTb = ({ value }: MegabyteValue): TerabyteValue => ({
  value: div(value, ONE_MILLION),
  ...tb,
})
export const mbToPb = ({ value }: MegabyteValue): PetabyteValue => ({
  value: div(value, ONE_BILLION),
  ...pb,
})
export const gbToMb = ({ value }: GigabyteValue): MegabyteValue => ({
  value: mul(value, ONE_THOUSAND),
  ...mb,
})
export const tbToMb = ({ value }: TerabyteValue): MegabyteValue => ({
  value: mul(value, ONE_MILLION),
  ...mb,
})
export const pbToTb = ({ value }: PetabyteValue): TerabyteValue => ({
  value: mul(value, ONE_THOUSAND),
  ...tb,
})

export const kbToGb = flow(kbToMb, mbToGb)
export const kbToTb = flow(kbToMb, mbToTb)
export const kbToPb = flow(kbToMb, mbToPb)
export const gbToKb = flow(gbToMb, mbToKb)
export const gbToTb = flow(gbToMb, mbToTb)
export const gbToPb = flow(gbToMb, mbToPb)
export const tbToKb = flow(tbToMb, mbToKb)
export const tbToGb = flow(tbToMb, mbToGb)
export const tbToPb = flow(tbToMb, mbToPb)
export const pbToKb = flow(pbToTb, tbToKb)
export const pbToMb = flow(pbToTb, tbToMb)
export const pbToGb = flow(pbToTb, tbToGb)

// /**
//  * We can't actually construct a Unit from a Resource, this will be addressed
//  * in ticket https://ticket.simspace.com/browse/PS-21697
//  *
//  * @unsafe don't use this!
//  * @deprecated
//  */
// export const fromResourceType: (rt: ResourceType) => Unit = match({
//   cpu: () => vcpu,
//   ram: () => mb,
//   other: () => licenseCount,
// })

const x: KilobyteValue = { tag: "kb", value: 123 }
pipe(x, kbToPb, pbToKb, kbToPb, pbToKb) //?

const y: KilobyteValue = { tag: "kb", value: 129.0000009999999999 }
pipe(y, kbToTb, tbToKb) //?
