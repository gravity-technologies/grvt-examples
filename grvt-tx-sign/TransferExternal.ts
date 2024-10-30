import { SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util'
import { TypedDataEncoder, verifyTypedData } from 'ethers'
import { ECurrency, TDG } from 'grvt'
import { Signature } from './signature'
import { Transfer, domain } from './types'

export default async function main() {
  // fill in your private key
  const PRIVATE_KEY = 'b66df1531a4675a43bec48b5e6947c55f4b954fe220424846bc3592e30b1c57e'
  const privateKeyHex = `0x${PRIVATE_KEY}`

  console.log('===== START: TransferExternal =====')
  // define the message/payload
  const nonce = 720948655
  const payload = {
    ...Transfer,
    message: {
      fromAccount: '0x922a4874196806460fc63b5bcbff45f94c87f76f', // your funding account wallet address
      fromSubAccount: '0',
      toAccount: '0x6a3434fce60ff567f60d80fb98f2f981e9b081fd', // transfer wallet address from address book
      toSubAccount: '0',
      tokenCurrency: '3', // ECurrencyInt.USDT
      numTokens: '1000000', // 1 USDT
      expiration: Date.now() + 86400000 + '000000', // 1 day from now in nanoseconds
      nonce: String(nonce)
    },
  }

  console.log('------------------')

  const messageHash = TypedDataUtils.eip712Hash(payload as any, SignTypedDataVersion.V4)

  console.log('messageHash:', Array.from(messageHash, (byte: number) => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join(''))

  // sign the payload
  const signature = Signature.sign(privateKeyHex, payload)
  // console.log('signature:', signature)

  // decode the signature
  const decoded = Signature.decode(signature)
  console.log('decoded:', decoded)
  console.log('------------------')

  console.log('ethersHash', TypedDataEncoder.hash(domain, { Transfer: Transfer.types.Transfer }, payload.message))

  // Verify signature
  const recoveredAddr = verifyTypedData(
    domain,
    { Transfer: Transfer.types.Transfer },
    {
      ...payload.message,
      nonce,
    },
    decoded
  )

  // Signer wallet address
  console.log(`🔑 Recovered Address: ${recoveredAddr}`)
  console.log('===== END: TransferExternal =====')

  /**
   * Sample code to send External Transfer request
   */
  console.log('===== START: TransferExternal API =====')
  const TdgApis = new TDG({ host: 'https://trades.dev.gravitymarkets.io' })
  const transferApiPayload = {
    from_account_id: BigInt(payload.message.fromAccount),
    from_sub_account_id: BigInt(payload.message.fromSubAccount),
    to_account_id: BigInt(payload.message.toAccount),
    to_sub_account_id: BigInt(payload.message.toSubAccount),
    currency: ECurrency.USDT,
    num_tokens: '1',
    signature: {
      ...decoded,
      r: BigInt(decoded.r),
      s: BigInt(decoded.s),
      expiration: BigInt(payload.message.expiration),
      nonce
    }
  }
  const response = await TdgApis.transfer(transferApiPayload, {
    headers: {
      cookie: `gravity=YOUR_GRVT_COOKIE;`
    }
  })
  console.log('Transfer response:', response)
  console.log('===== END: TransferExternal API =====')
}