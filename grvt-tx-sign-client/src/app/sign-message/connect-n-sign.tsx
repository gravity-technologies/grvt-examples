'use client'

import { ISignature } from "@/grvt"
import { CreateAccount, domain } from "@/grvt/types"
import { SignTypedDataVersion, TypedDataUtils, signTypedData } from "@metamask/eth-sig-util"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Connector, useAccount, useBalance, useConnect, useDisconnect, useSignTypedData } from "wagmi"

/**
 * START: Utility functions
 */

// Debug: verify signature
const signVerify = (payload: Parameters<typeof useSignTypedData>[0]) => {
  return signTypedData({
    privateKey: '[METAMASK_PRIVATE_KEY]' as any, // fill your private key here
    data: payload as any,
    version: SignTypedDataVersion.V4
  })
}

const decode = (signature: string): ISignature => {
  const bytes = []
  for (let i = 0; i < signature.length; i += 2) {
    const parseByte = parseInt(signature.substr(i, 2), 16)
    if (!Number.isNaN(parseByte)) {
      bytes.push(parseByte)
    }
  }
  const r = Array.from(
    bytes.slice(0, 32),
    (byte: number) => ('0' + (byte & 0xFF).toString(16)).slice(-2)
  ).join('')
  const s = Array.from(
    bytes.slice(32, 64),
    (byte: number) => ('0' + (byte & 0xFF).toString(16)).slice(-2)
  ).join('')
  return {
    r: `0x${r}`,
    s: `0x${s}`,
    v: bytes.slice(-1)[0]
  }
}

/**
 * END: Utility functions
 */

const nonce = 720948655

export const ConnectAndSign = () => {
  const { connectAsync, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()
  const account = useAccount()
  const { data, isLoading: isBalanceLoading } = useBalance({ address: account.address })

  const [pendingConnector, setPendingConnector] = useState<Connector | undefined>()
  const [loading, setLoading] = useState(false)
  const connect = useCallback((connector: Connector) => {
    setLoading(true)
    setPendingConnector(connector)
    connectAsync({ connector, chainId: domain.chainId })
      .then()
      .finally(() => {
        setLoading(false)
        setPendingConnector(undefined)
      })
  }, [connectAsync])

  const { data: signature, variables, isSuccess, isError, reset, signTypedDataAsync } = useSignTypedData()
  const signPayload = useMemo(() => ({
    ...CreateAccount,
    message: {
      accountID: '0x5E4c35548e7057274057388bcf10aff5E3AddC09',
      nonce: String(nonce)
    }
  } as any), [account.address])

  const onSign = useCallback(() => {
    setLoading(true)
    signTypedDataAsync(signPayload)
      .catch((error) => console.log('connect-n-sign.tsx:75', { error }))
      .finally(() => setLoading(false))
  }, [signPayload, signTypedDataAsync])

  // debug
  useEffect(() => {
    if (signature) {
      const messageHash = TypedDataUtils.eip712Hash(variables as any, SignTypedDataVersion.V4)
      console.log('Signed', {
        payload: variables,
        messageHash,
        messageHashAsString: Array.from(
          messageHash,
          (byte: number) => ('0' + (byte & 0xFF).toString(16)).slice(-2)
        ).join(''),
        signature,
        decoded: decode(signature)
      })

      // const verifySignature = signVerify(variables as any)
      // console.log('Verify', {
      //   signature,
      //   verifySignature,
      //   isEqual: verifySignature === signature
      // })
    }
  }, [signature, variables])

  useEffect(() => {
    console.clear()
  }, [])

  return (
    <main className="fx-column gap-4 p-4">
      {account.isConnected
        ? (
          <div className="fx fx-column gap-2">
            <div>{account.connector?.name}</div>
            <div>{account.chain?.name}</div>
            <div>{account.address}</div>
            <div>{data?.formatted} {data?.symbol}</div>
            <button
              disabled={loading}
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </div>
        )
        : connectors.map((connector) => (
          <button
            key={connector.uid}
            disabled={loading}
            onClick={() => connect(connector)}
          >
            {connector.name}
            {loading && connector.id === pendingConnector?.id && ' (connecting)'}
          </button>
        ))}

      {error && <div>{error.message}</div>}

      {account.isConnected && (
        <div className="fx-column gap-2">
          <h1>The message</h1>
          <pre>{JSON.stringify(signPayload, null, 2)}</pre>
          <button
            disabled={loading}
            onClick={onSign}
          >Sign Message</button>
          <h1>Open Devtools Console to get more details.</h1>
        </div>
      )}
    </main>
  )
}
