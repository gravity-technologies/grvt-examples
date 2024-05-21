import * as ContractTypes from './types'

export type TContractTypes = Readonly<typeof ContractTypes>
export type TContractTypesUnion = TContractTypes[keyof TContractTypes]
export interface ISignature {
  r: `0x${string}`
  s: `0x${string}`
  v: number
}
