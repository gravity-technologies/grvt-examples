import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet } from '@wagmi/core/chains'
import { FC, ReactNode } from 'react'
import { http } from 'viem'
import { WagmiProvider as Provider, createConfig } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  },
  connectors: [
    // metaMask(),
    injected({ target: 'metaMask' }),
    coinbaseWallet({ appName: 'GRVT' }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '10000',
          '--wcm-overlay-background-image': 'rgba(0, 0, 0, 0.1)',
          '--wcm-overlay-backdrop-filter': 'blur(6px)'
        } as any
      }
    })
  ]
})

const queryClient = new QueryClient()

interface IProps {
  children: ReactNode
}

export const WagmiProvider: FC<IProps> = (props) => {
  return (
    <Provider reconnectOnMount config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </Provider>
  )
}
