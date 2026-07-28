// SOLID: Single Responsibility — orchestrates RAG retrieval and returns an SSE stream.
// All stream conversion is delegated to lib/stream-adapter.
import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { supabase } from '@/lib/supabase'
import { embedText } from '@/lib/gemini'
import { searchInternet } from '@/lib/search'
import { logger } from '@/lib/logger'
import { getOrCreateSessionId } from '@/lib/session'
import { toReadableStream } from '@/lib/stream-adapter'

type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// ponytail: Groq SDK instance — singleton per serverless invocation; no factory needed.
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getOrCreateSessionId()
    const { messages, documentName } = await req.json()

    const lastMessage = messages[messages.length - 1] as Message
    const query = lastMessage?.content

    if (!query) {
      logger.warn('Empty query received')
      return NextResponse.json({ error: 'Query required' }, { status: 400 })
    }

    logger.info('Processing stream request', { sessionId, queryLength: query.length })

    // Step 1: Embed query via Xenova (local 384-dim)
    const queryEmbedding = await embedText(query)

    // Step 2: Supabase pgvector search
    const { data: matchedChunks, error: dbError } = await supabase.rpc('match_chunks', {
      query_embedding: queryEmbedding,
      session_id_param: sessionId,
      match_threshold: 0.2,
      match_count: 5,
    })

    if (dbError) {
      logger.error('Supabase query failed', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // Step 3: Gather context (local chunks or internet fallback)
    let contextText = ''
    let isInternetFallback = false

    if (!matchedChunks || matchedChunks.length === 0) {
      logger.info('No local chunks — trying internet fallback', { query })
      const internetText = await searchInternet(query)
      if (!internetText) {
        return NextResponse.json({ error: 'Context not found' }, { status: 404 })
      }
      contextText = internetText
      isInternetFallback = true
    } else {
      contextText = matchedChunks
        .filter((chunk: any) => !documentName || chunk.document_name === documentName)
        .map((chunk: any) => `[Source: ${chunk.document_name}]:\n${chunk.content}`)
        .join('\n\n---\n\n')
    }

    logger.info('Context assembled', { isInternetFallback, chunkCount: matchedChunks?.length ?? 0 })

    // Step 4: Build system prompt
    const systemPrompt = `You are an educational AI assistant for college exams.
Strict source material provided below:
---
${contextText}
---
${isInternetFallback ? 'Note: Based on Internet search.' : ''}

INSTRUCTIONS: LaTeX math in $$...$$. Mermaid diagrams in \`\`\`mermaid blocks. Professional, structured markdown.`

    // Step 5: Stream from Groq via groq-sdk (no ai-sdk dependency)
    const groqStream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    })

    logger.info('Groq stream opened — piping to raw text response')

    // Step 6: Return native text/plain response via stream-adapter
    return new Response(toReadableStream(groqStream), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err: unknown) {
    logger.error('Stream request failed', err)
    return NextResponse.json({ error: 'Streaming error' }, { status: 500 })
  }
}
