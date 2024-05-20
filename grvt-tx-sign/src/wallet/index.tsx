import dynamic from 'next/dynamic'

export * from './utils'

export const WagmiProvider = dynamic(
  () => import('./wagmi-provider').then(module => module.WagmiProvider),
  { ssr: false }
)

// export const WalletExample = dynamic(
//   () => import('./wallet-example').then(module => module.WalletExample),
//   { ssr: false }
// )
