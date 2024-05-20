import { Address } from 'viem'
import { Connector } from 'wagmi'

export enum EWalletProvider {
  COINBASE = 'coinbase',
  DFNS = 'dfns',
  METAMASK = 'metamask',
  OTHER = 'other',
  RABBY = 'rabby'
}

export class WalletUtils {
  static getConnectorProvider(connector: Connector) {
    if (connector.name === 'MetaMask') {
      return EWalletProvider.METAMASK
    }
    if (connector.name === 'Rabby Wallet') {
      return EWalletProvider.RABBY
    }
    if (connector.id === 'coinbaseWalletSDK') {
      return EWalletProvider.COINBASE
    }
    if (connector.id === 'walletConnect') {
      return EWalletProvider.OTHER
    }
    return EWalletProvider.OTHER
  }

  static findConnectAddress(address: readonly [Address, ...Address[]], currentAddress?: string) {
    if (!currentAddress) {
      return address[0]
    }
    return address.find((addr) => addr === currentAddress) || address[0]
  }
}
