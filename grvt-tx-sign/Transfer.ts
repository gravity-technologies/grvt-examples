import { SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util'
import { TypedDataEncoder, verifyTypedData } from 'ethers'
import { Signature } from './signature'
import { Transfer, domain } from './types'

export default function main() {
  // fill in your private key
  const PRIVATE_KEY = 'b66df1531a4675a43bec48b5e6947c55f4b954fe220424846bc3592e30b1c57e'
  const privateKeyHex = `0x${PRIVATE_KEY}`

  console.log('===== START: Transfer =====')
  // define the message/payload
  const nonce = 720948655
  const payload = {
    ...Transfer,
    message: {
      fromAccount: '0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1',
      fromSubAccount: '0',
      toAccount: '0x0c1f4c8ee7acd9ea19b91bbb343cbaf6efd58ce1',
      toSubAccount: '3966913711362638',
      tokenCurrency: '3',
      numTokens: '100000000000',
      expiration: '1724995625438000000',
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
  console.log('===== END: Transfer =====')
}