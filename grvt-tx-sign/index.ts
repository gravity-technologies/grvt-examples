import { SignTypedDataVersion, TypedDataUtils, signTypedData } from '@metamask/eth-sig-util'

/**
 * EIP-712 Typed Data
 */
const domain = {
  name: 'GRVT Exchange',
  version: '0', // testnet
  chainId: 1
}
const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' }
]
const CreateAccount = {
  primaryType: 'CreateAccount',
  domain,
  types: {
    EIP712Domain,
    CreateAccount: [
      { name: 'accountID', type: 'address' },
      { name: 'nonce', type: 'uint32' }
    ]
  }
}

/**
 * Signature utility
 */
class Signature {
  static sign(privateKey: string, data: typeof CreateAccount & { message: any }) {
    return signTypedData({
      version: SignTypedDataVersion.V4,
      privateKey: Buffer.from(privateKey.substring(2), 'hex'),
      data: data as any,
    })
  }

  static decode(signature: ReturnType<typeof Signature.sign>) {
    const bytes: number[] = []
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
}

// fill in your private key
const PRIVATE_KEY = '81c6cf2eb85594757bf357cb29389d0cf06a23d5480ecf97a5057d73456fb48e'
const privateKeyHex = `0x${PRIVATE_KEY}`

// define the message/payload
const nonce = 720948655
const signPayload = {
  ...CreateAccount,
  message: {
    accountID: '0x5E4c35548e7057274057388bcf10aff5E3AddC09',
    nonce: String(nonce)
  }
}

console.log('------------------')
console.log('message', signPayload)
console.log('------------------')

const messageHash = TypedDataUtils.eip712Hash(signPayload as any, SignTypedDataVersion.V4)

console.log('------------------')
console.log('messageHash:', messageHash)
console.log('messageHashAsString:', Array.from(messageHash, (byte: number) => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join(''))
console.log('------------------')

// sign the payload
const signature = Signature.sign(privateKeyHex, signPayload)
console.log('signature:', signature)
console.log('------------------')

// decode the signature
const decoded = Signature.decode(signature)
console.log('decoded:', decoded)
console.log('------------------')
