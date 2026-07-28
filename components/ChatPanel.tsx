'use client'

import { useState } from 'react'
import { useStreamChat } from '../hooks/useStreamChat'
import MarkdownRenderer from './renderers/MarkdownRenderer'

// ponytail: custom useStreamChat natively processes SSE text chunks without third-party frameworks.
// SOLID: Single Responsibility - handle chat UI only.
interface ChatPanelProps {
  documentName: string | null
}

export default function ChatPanel({ documentName }: ChatPanelProps) {
  const [localInput, setLocalInput] = useState('')

  // ponytail: useStreamChat replaces ai-sdk with native SSE reading loop.
  const { messages, isLoading, append } = useStreamChat('/api/chat')

  // Programmatic dispatcher instead of form submit interceptors
  // SOLID: Single Responsibility (explicit form handler)
  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!localInput.trim() || isLoading) return

    append({ role: 'user', content: localInput.trim() }, { documentName })
    setLocalInput('')
  }

  return (
    <div className="flex flex-col h-[600px] bg-surface border border-border rounded-xl overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-muted h-full flex flex-col items-center justify-center">
             <p className="text-muted">Start a conversation to query your study materials.</p>
          </div>
        )}

        {messages.map((m: any) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              m.role === 'user'
                ? 'bg-clarity text-[#0F172A] font-medium rounded-tr-sm'
                : 'bg-[#0F172A] border border-border text-foreground rounded-tl-sm'
            }`}>
              {m.role === 'user' ? (
                m.content
              ) : (
                <div className="text-sm whitespace-pre-wrap">
                  <MarkdownRenderer content={m.content} />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#0F172A] border border-border rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
              <div className="animate-spin h-4 w-4 border-2 border-clarity border-t-transparent rounded-full"></div>
              <span className="text-muted text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-surface border-t border-border">
        <form onSubmit={handleCustomSend} className="relative flex items-center">
          <input
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about a concept..."
            className="w-full bg-[#0F172A] border border-border rounded-full pl-4 pr-12 py-3 text-foreground focus:outline-none focus:border-clarity"
          />
          <button
            type="submit"
            disabled={isLoading || !localInput.trim()}
            className="absolute right-2 p-2 bg-clarity text-[#0F172A] rounded-full disabled:opacity-50"
          >
             <svg className="w-4 h-4" transform="rotate(90)" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
