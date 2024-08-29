/**
 * EIP-712 Typed Data
 */
export const domain = {
  name: 'GRVT Exchange',
  version: '0', // testnet
  chainId: 1
}

export const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' }
]

export const CreateAccount = {
  primaryType: 'CreateAccount',
  domain,
  types: {
    EIP712Domain,
    CreateAccount: [
      { name: 'accountID', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ],
  }
}

export const Transfer = {
  primaryType: 'Transfer',
  domain,
  types: {
    EIP712Domain,
    Transfer: [
      { name: 'fromAccount', type: 'address' },
      { name: 'fromSubAccount', type: 'uint64' },
      { name: 'toAccount', type: 'address' },
      { name: 'toSubAccount', type: 'uint64' },
      { name: 'tokenCurrency', type: 'uint8' },
      { name: 'numTokens', type: 'uint64' },
      { name: 'nonce', type: 'uint32' },
      { name: 'expiration', type: 'int64' }
    ]
  }
}

export type TSignTypes = typeof CreateAccount | typeof Transfer
