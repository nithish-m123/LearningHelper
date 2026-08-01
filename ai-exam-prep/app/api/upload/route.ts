import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { embedText } from '@/lib/gemini'
import { chunkMarkdown } from '@/lib/chunk'
import { logger } from '@/lib/logger'
import { getOrCreateSessionId } from '@/lib/session'

export const maxDuration = 60 // Vercel hobby allows up to 60s

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getOrCreateSessionId()
    logger.info('Upload started', { sessionId })
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      logger.warn('No file provided in request')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
    ]
    if (!allowedTypes.includes(file.type)) {
      logger.warn('Invalid file type uploaded', { type: file.type })
      return NextResponse.json({ error: 'Only PDF and PPT/PPTX files are supported' }, { status: 400 })
    }

    logger.info('Sending file to LlamaParse', { filename: file.name, size: file.size })
    // ── Step 1: Send file to LlamaParse cloud ────────────────────────────────
    const llamaForm = new FormData()
    llamaForm.append('file', file)
    llamaForm.append('language', 'en')

    const parseRes = await fetch('https://api.cloud.llamaindex.ai/api/parsing/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.LLAMA_CLOUD_API_KEY}` },
      body: llamaForm,
    })

    if (!parseRes.ok) {
      const err = await parseRes.text()
      logger.error('LlamaParse upload failed', err)
      return NextResponse.json({ error: `LlamaParse failed: ${err}` }, { status: 500 })
    }

    const { id: jobId } = await parseRes.json()
    logger.info('LlamaParse job created', { jobId })

    // ── Step 2: Poll for result (LlamaParse is async) ────────────────────────
    let markdown = ''
    for (let attempt = 0; attempt < 24; attempt++) {
      await new Promise(r => setTimeout(r, 5000)) // wait 5s between polls
      logger.info('Polling LlamaParse', { attempt })

      const resultRes = await fetch(
        `https://api.cloud.llamaindex.ai/api/parsing/job/${jobId}/result/markdown`,
        { headers: { Authorization: `Bearer ${process.env.LLAMA_CLOUD_API_KEY}` } }
      )

      if (resultRes.ok) {
        const data = await resultRes.json()
        markdown = data.markdown ?? ''
        break
      } else if (resultRes.status !== 404) {
         // 404 means pending, anything else is a real error during polling
         const errData = await resultRes.text()
         logger.error('LlamaParse polling error', errData)
      }
    }

    if (!markdown) {
      logger.error('LlamaParse timed out extracting text')
      return NextResponse.json({ error: 'LlamaParse timed out extracting text' }, { status: 500 })
    }

    logger.info('Text extracted, chunking markdown', { length: markdown.length })
    // ── Step 3: Chunk the markdown text ─────────────────────────────────────
    const chunks = chunkMarkdown(markdown)

    logger.info('Embedding chunks', { chunkCount: chunks.length })
    // ── Step 4: Embed each chunk via Transformers.js ────
    const rows = await Promise.all(
      chunks.map(async (content, chunk_index) => {
        const embedding = await embedText(content)
        return {
          session_id: sessionId, // ponytail: tag with session ID for isolation
          document_name: file.name,
          chunk_index,
          content,
          embedding: JSON.stringify(embedding), // 384-dim from all-MiniLM-L6-v2
        }
      })
    )

    logger.info('Storing to Supabase', { rows: rows.length })
    // ── Step 5: Store in Supabase pgvector ──────────────────────────────────
    const { error: dbError } = await supabase.from('document_chunks').insert(rows)
    if (dbError) {
      logger.error('Supabase insert failed', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    logger.info('Upload complete', { filename: file.name, chunks: chunks.length })
    return NextResponse.json({
      success: true,
      document: file.name,
      chunks: chunks.length,
    })
  } catch (err: unknown) {
    logger.error('Unhandled error in upload route', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
