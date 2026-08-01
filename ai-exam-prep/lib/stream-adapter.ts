// SOLID: Single Responsibility — converts a Groq async stream into a native ReadableStream of text.
// The route owns the request/response. This module owns only the stream transformation.
import { logger } from '@/lib/logger'

/**
 * Wraps a Groq async iterator into a native Web ReadableStream.
 * Each chunk emits raw tokens.
 */
export function toReadableStream(
  groqStream: any
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of groqStream) {
          const token = chunk.choices[0]?.delta?.content ?? ''
          if (token) {
            // Raw text streaming formats tokens as they are
            controller.enqueue(encoder.encode(token))
          }
        }
        logger.info('Stream complete — all tokens flushed')
      } catch (err) {
        logger.error('Stream adapter error', err)
        controller.error(err)
      } finally {
        controller.close()
      }
    },
  })
}
