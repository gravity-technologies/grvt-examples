'use client'

import { WagmiProvider } from "@/wallet"
import { ConnectAndSign } from "./connect-n-sign"

export default function _() {
  return (
    <WagmiProvider>
      <ConnectAndSign/>
    </WagmiProvider>
  )
}
