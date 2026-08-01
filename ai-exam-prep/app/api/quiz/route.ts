// SOLID: Single Responsibility — handles parsing of study material chunks and uses Groq to generate structured MCQ JSON.
import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import { getOrCreateSessionId } from '@/lib/session'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getOrCreateSessionId()

    // Read request body, default query limits to 5 questions
    let count = 5
    let documentName: string | null = null

    try {
      const body = await req.json()
      if (body.count) count = Math.min(Math.max(parseInt(body.count), 3), 10)
      if (body.documentName) documentName = body.documentName
    } catch {
      // Body parsing optional, default values remain
    }

    logger.info('Generating quiz', { sessionId, count, documentName })

    // Step 1: Query Supabase for document chunks belonging to this session
    let queryBuilder = supabase
      .from('document_chunks')
      .select('content, document_name')
      .eq('session_id', sessionId)
      .order('chunk_index', { ascending: true })

    if (documentName) {
      queryBuilder = queryBuilder.eq('document_name', documentName)
    }

    const { data: chunks, error: dbError } = await queryBuilder.limit(20)

    if (dbError) {
      logger.error('Supabase query failed during quiz generation', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // Step 2: Validate if content exists
    if (!chunks || chunks.length === 0) {
      logger.warn('Quiz requested but no document chunks found', { sessionId })
      return NextResponse.json(
        { error: 'Please upload study materials first before starting an exam.' },
        { status: 400 }
      )
    }

    // Assemble text context for Groq
    const studyContext = chunks
      .map((c) => `[Source: ${c.document_name}]:\n${c.content}`)
      .join('\n\n---\n\n')

    // Step 3: Call Groq to generate structured JSON MCQs
    const prompt = `You are an expert university professor. Generate a high-quality MCQ quiz of exactly ${count} questions based strictly on the provided study materials.

Guidelines:
- Each question must have exactly 4 options.
- Focus on testing actual understanding, not trivia.
- Avoid vague options like "All of the above" or "None of the above".
- The correct index must map accurately to the list of options (0 = first option, 1 = second, etc.).
- The explanation must clarify why the correct option is right and the other options are wrong based on the context.

Study materials:
---
${studyContext}
---

Provide your output ONLY in the following strict JSON schema:
{
  "questions": [
    {
      "question": "Clear, specific question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of the answer"
    }
  ]
}`

    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a quiz gen helper. You speak only in JSON conforming to the requested schema.',
        },
        { role: 'user', content: prompt },
      ],
    })

    const rawResponse = chatCompletion.choices[0]?.message?.content
    if (!rawResponse) {
      throw new Error('Groq returned an empty response')
    }

    // Step 4: Parse & return validated structured data
    const parsedData = JSON.parse(rawResponse)
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error('Groq did not return a valid list of questions')
    }

    logger.info('Quiz successfully generated', {
      sessionId,
      count: parsedData.questions.length
    })

    return NextResponse.json(parsedData)
  } catch (err: unknown) {
    logger.error('Quiz generation failed', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
