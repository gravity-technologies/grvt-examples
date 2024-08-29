import { signTypedData, SignTypedDataVersion } from '@metamask/eth-sig-util'
import { TSignTypes } from './types'


/**
 * Signature utility
 */
export class Signature {
  static sign(privateKey: string, data: TSignTypes & { message: any }) {
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