import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10)

export function createChunkDecoder() {
    const decoder = new TextDecoder('utf-8')
    return function (chunk: Uint8Array | undefined): string {
        if (!chunk) return ''
        return decoder.decode(chunk, { stream: true })
    }
}
