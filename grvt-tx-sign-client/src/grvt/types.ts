/**
 * @see https://github.com/gravity-technologies/exchange-contract/blob/7804e90e913e451ba093cd5de652dad92f9dc2c3/message/type.ts
 */

function keyMirror(originObj: Record<string, number | string>) {
  return Object.entries(originObj).reduce((obj, [key, value]) => {
    obj[key] = key
    return obj
  }, {} as Record<string, string>)
}

export const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' }
]

export const EIP712DomainWithoutContract = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' }
]

export const domain = {
  name: 'GRVT Exchange',
  version: '0', // testnet
  chainId: 1
}

export const domainWithoutContract = {
  name: 'GRVT Mainnet',
  version: domain.version,
  chainId: domain.chainId
}

export const PrimaryType = keyMirror({
  // Account
  CreateAccount: 0,
  SetAccountSignerPermissions: 0,
  AddAccountSigner: 0,
  AddTransferSubAccount: 0,
  AddWithdrawalAddress: 0,
  CreateSubAccount: 0,
  RemoveAccountSigner: 0,
  RemoveTransferSubAccount: 0,
  RemoveWithdrawalAddress: 0,
  SetAccountMultiSigThreshold: 0,

  // SubAccount
  AddSubAccountSigner: 0,
  RemoveSubAccountSigner: 0,
  SetSubAccountMarginType: 0,
  SetSubAccountSignerPermissions: 0,

  // Wallet Recovery
  AddRecoveryAddress: 0,
  RemoveRecoveryAddress: 0,
  RecoverAddress: 0,

  // Session Key
  AddSessionKey: 0,

  // Transfer
  Deposit: 0,
  Transfer: 0,
  Withdrawal: 0,

  // Trade
  Order: 0,

  // ZKSyncMystreyBoxDefiTask
  ZKSyncMysteryBoxDefiTask: 0
})

// -------------- Account --------------
export const CreateAccount = {
  primaryType: PrimaryType.CreateAccount,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.CreateAccount]: [
      { name: 'accountID', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const SetAccountMultiSigThreshold = {
  primaryType: PrimaryType.SetAccountMultiSigThreshold,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.SetAccountMultiSigThreshold]: [
      { name: 'accountID', type: 'address' },
      { name: 'multiSigThreshold', type: 'uint8' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const AddAccountSigner = {
  primaryType: PrimaryType.AddAccountSigner,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.AddAccountSigner]: [
      { name: 'accountID', type: 'address' },
      { name: 'signer', type: 'address' },
      { name: 'permissions', type: 'uint64' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const SetAccountSignerPermissions = {
  primaryType: PrimaryType.SetAccountSignerPermissions,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.SetAccountSignerPermissions]: [
      { name: 'accountID', type: 'address' },
      { name: 'signer', type: 'address' },
      { name: 'permissions', type: 'uint64' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const RemoveAccountSigner = {
  primaryType: PrimaryType.RemoveAccountSigner,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.RemoveAccountSigner]: [
      { name: 'accountID', type: 'address' },
      { name: 'signer', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const AddWithdrawalAddress = {
  primaryType: PrimaryType.AddWithdrawalAddress,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.AddWithdrawalAddress]: [
      { name: 'accountID', type: 'address' },
      { name: 'withdrawalAddress', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const RemoveWithdrawalAddress = {
  primaryType: PrimaryType.RemoveWithdrawalAddress,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.RemoveWithdrawalAddress]: [
      { name: 'accountID', type: 'address' },
      { name: 'withdrawalAddress', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const AddTransferSubAccount = {
  primaryType: PrimaryType.AddTransferSubAccount,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.AddTransferSubAccount]: [
      { name: 'accountID', type: 'address' },
      { name: 'transferSubAccount', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const RemoveTransferSubAccount = {
  primaryType: PrimaryType.RemoveTransferSubAccount,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.RemoveTransferSubAccount]: [
      { name: 'accountID', type: 'address' },
      { name: 'transferSubAccount', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

// -------------- SubAccount --------------
export const CreateSubAccount = {
  primaryType: PrimaryType.CreateSubAccount,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.CreateSubAccount]: [
      { name: 'accountID', type: 'address' },
      { name: 'subAccountID', type: 'uint64' },
      { name: 'quoteCurrency', type: 'uint8' },
      { name: 'marginType', type: 'uint8' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const SetSubAccountMarginType = {
  primaryType: PrimaryType.SetSubAccountMarginType,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.SetSubAccountMarginType]: [
      { name: 'subAccountID', type: 'uint64' },
      { name: 'marginType', type: 'uint8' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const AddSubAccountSigner = {
  primaryType: PrimaryType.AddSubAccountSigner,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.AddSubAccountSigner]: [
      { name: 'subAccountID', type: 'uint64' },
      { name: 'signer', type: 'address' },
      { name: 'permissions', type: 'uint64' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}
export const SetSubAccountSignerPermissions = {
  primaryType: PrimaryType.SetSubAccountSignerPermissions,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.SetSubAccountSignerPermissions]: [
      { name: 'subAccountID', type: 'uint64' },
      { name: 'signer', type: 'address' },
      { name: 'permissions', type: 'uint64' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const RemoveSubAccountSigner = {
  primaryType: PrimaryType.RemoveSubAccountSigner,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.RemoveSubAccountSigner]: [
      { name: 'subAccountID', type: 'uint64' },
      { name: 'signer', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

// Wallet Recovery
export const AddRecoveryAddress = {
  primaryType: PrimaryType.AddRecoveryAddress,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.AddRecoveryAddress]: [
      { name: 'accountID', type: 'address' },
      { name: 'recoverySigner', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const RemoveRecoveryAddress = {
  primaryType: PrimaryType.RemoveRecoveryAddress,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.RemoveRecoveryAddress]: [
      { name: 'accountID', type: 'address' },
      { name: 'recoverySigner', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const RecoverAddress = {
  primaryType: PrimaryType.RecoverAddress,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.RecoverAddress]: [
      { name: 'accountID', type: 'address' },
      { name: 'oldSigner', type: 'address' },
      { name: 'newSigner', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

// -------------- Session Keys --------------
export const AddSessionKey = {
  primaryType: PrimaryType.AddSessionKey,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.AddSessionKey]: [
      { name: 'sessionKey', type: 'address' },
      { name: 'keyExpiry', type: 'int64' }
    ]
  }
}

// -------------- Transfer --------------
export const Deposit = {
  primaryType: PrimaryType.Deposit,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.Deposit]: [
      { name: 'fromEthAddress', type: 'address' },
      { name: 'toAccount', type: 'address' },
      { name: 'tokenCurrency', type: 'uint8' },
      { name: 'numTokens', type: 'uint64' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}
export const Withdrawal = {
  primaryType: PrimaryType.Withdrawal,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.Withdrawal]: [
      { name: 'fromAccount', type: 'address' },
      { name: 'toEthAddress', type: 'address' },
      { name: 'tokenCurrency', type: 'uint8' },
      { name: 'numTokens', type: 'uint64' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}
export const Transfer = {
  primaryType: PrimaryType.Transfer,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.Transfer]: [
      { name: 'fromAccount', type: 'address' },
      { name: 'fromSubAccount', type: 'uint64' },
      { name: 'toAccount', type: 'address' },
      { name: 'toSubAccount', type: 'uint64' },
      { name: 'tokenCurrency', type: 'uint8' },
      { name: 'numTokens', type: 'uint64' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

export const Order = {
  primaryType: PrimaryType.Order,
  domain,
  types: {
    EIP712Domain,
    [PrimaryType.Order]: [
      { name: 'subAccountID', type: 'uint64' },
      { name: 'isMarket', type: 'bool' },
      { name: 'timeInForce', type: 'uint8' },
      { name: 'takerFeePercentageCap', type: 'uint32' },
      { name: 'makerFeePercentageCap', type: 'uint32' },
      { name: 'postOnly', type: 'bool' },
      { name: 'reduceOnly', type: 'bool' },
      { name: 'legs', type: 'OrderLeg[]' },
      { name: 'nonce', type: 'uint32' }
    ],
    OrderLeg: [
      { name: 'assetID', type: 'uint256' },
      { name: 'contractSize', type: 'uint64' },
      { name: 'limitPrice', type: 'uint64' },
      { name: 'ocoLimitPrice', type: 'uint64' },
      { name: 'isBuyingContract', type: 'bool' }
    ]
  }
}

export const ZKSyncMysteryBoxDefiTask = {
  primaryType: PrimaryType.ZKSyncMysteryBoxDefiTask,
  domain: domainWithoutContract,
  types: {
    EIP712Domain: EIP712DomainWithoutContract,
    [PrimaryType.ZKSyncMysteryBoxDefiTask]: [
      { name: 'signer', type: 'address' },
      { name: 'message', type: 'string' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}
