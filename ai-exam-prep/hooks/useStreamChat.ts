// SOLID: Single Responsibility — custom hook to exclusively manage raw text stream read loop and chat state.
import { useState } from 'react'
import { logger } from '@/lib/logger'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function useStreamChat(endpoint: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const append = async (
    message: Omit<Message, 'id'>,
    extraBody?: Record<string, any>
  ) => {
    setIsLoading(true)
    setError(null)

    // Add user message optimistically
    const userMessage: Message = { ...message, id: Date.now().toString() }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
          ...extraBody,
        }),
      })

      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('Response body has no reader')

      const decoder = new TextDecoder()
      let assistantContent = ''

      // Create empty assistant message stub
      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      // Parse raw stream chunks (handles newlines inside tokens natively)
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantContent += chunk
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: assistantContent } : msg
          )
        )
      }
    } catch (err) {
      logger.error('Stream read error', err)
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    isLoading,
    error,
    append,
  }
}
