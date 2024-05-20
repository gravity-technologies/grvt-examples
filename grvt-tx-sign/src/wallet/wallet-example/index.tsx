import { FC, useCallback, useState } from 'react'
import { finalize, from, takeUntil } from 'rxjs'
import { ignore } from 'src/constants'
import { useUnsubscribe } from 'src/hooks'
import { Connector, useAccountEffect, useBalance, useConnect } from 'wagmi'
import { useConnected } from '../hooks'

interface IProps {
  className?: string
  onConnect?: Exclude<Parameters<typeof useAccountEffect>[0], undefined>['onConnect']
}

export const WalletExample: FC<IProps> = (props) => {
  const unsubscribe$ = useUnsubscribe()
  const { connectAsync, connectors, error } = useConnect()
  const { account, address } = useConnected()
  const { data, isError, isLoading: isBalanceLoading } = useBalance({ address })
  console.log('index.tsx:37', { account, data, isError, isBalanceLoading })

  const [pendingConnector, setPendingConnector] = useState<Connector | undefined>()
  const [loading, setLoading] = useState(false)
  const connect = useCallback((connector: Connector) => {
    setLoading(true)
    setPendingConnector(connector)
    from(connectAsync({ connector }))
      .pipe(
        takeUntil(unsubscribe$),
        finalize(() => {
          setLoading(false)
          setPendingConnector(undefined)
        })
      )
      .subscribe(ignore)
  }, [connectAsync, unsubscribe$])

  return (
    <div className="fx-column gap-2 p-4 body-3">
      {account.isConnected
        ? (
          <div className="fx gap-4">
            <div>{account.connector?.name}</div>
            <div>{account.chain?.name}</div>
            <div>{account.address}</div>
            <div>{data?.formatted} {data?.symbol}</div>
            {account.connector?.id !== 'metaMask' && (
              <button onClick={() => account.connector?.disconnect()}>
                Disconnect
              </button>
            )}
          </div>
        )
        : connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect(connector)}
          >
            {connector.name}
            {loading && connector.id === pendingConnector?.id && ' (connecting)'}
          </button>
        ))}

      {error && <div>{error.message}</div>}
    </div>
  )
}
