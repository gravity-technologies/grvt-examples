import { SignTypedDataVersion, TypedDataUtils, signTypedData } from '@metamask/eth-sig-util'
import { TypedDataEncoder, verifyTypedData } from 'ethers'

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


const CreateAccountType = [
  { name: 'accountID', type: 'address' },
  { name: 'nonce', type: 'uint32' }
]

const CreateAccount = {
  primaryType: 'CreateAccount',
  domain,
  types: {
    EIP712Domain,
    CreateAccount: CreateAccountType,
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
const PRIVATE_KEY = 'b66df1531a4675a43bec48b5e6947c55f4b954fe220424846bc3592e30b1c57e'
const privateKeyHex = `0x${PRIVATE_KEY}`

// define the message/payload
const nonce = 720948655
const payload = {
  accountID: '0x5E4c35548e7057274057388bcf10aff5E3AddC09',
  nonce: String(nonce)
}
const signPayload = {
  ...CreateAccount,
  message: payload,
}

console.log('message', signPayload)
console.log('------------------')

const messageHash = TypedDataUtils.eip712Hash(signPayload as any, SignTypedDataVersion.V4)

console.log('messageHash:', Array.from(messageHash, (byte: number) => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join(''))

// sign the payload
const signature = Signature.sign(privateKeyHex, signPayload)
// console.log('signature:', signature)

// decode the signature
const decoded = Signature.decode(signature)
console.log('decoded:', decoded)
console.log('------------------')

console.log("ethersHash", TypedDataEncoder.hash(domain, {CreateAccount: CreateAccountType}, payload))

// Verify signature
const recoveredAddr = verifyTypedData(
  domain,
  {
    CreateAccount: [
      {
        name: 'accountID',
        type: 'address',
      },
      {
        name: 'nonce',
        type: 'uint32',
      },
    ],
  },
  {
    accountID: '0x5e4c35548e7057274057388bcf10aff5e3addc09',
    nonce: 720948655,
  },
  {
    r: '0x2b0ba74e55467fb79de80da5d114e3821d5689b3afd36017bf5083fbecd7e142',
    s: '0x6e2273dc1e0d06dd5f0787586161978c119ce547b3229fe010c33d5ff0b2d98b',
    v: 28,
  }
)

console.log(`🔑 Recovered Address: ${recoveredAddr}`)
