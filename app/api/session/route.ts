import { NextResponse } from 'next/server'
import { getOrCreateSessionId } from '@/lib/session'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST() {
  try {
    const sessionId = await getOrCreateSessionId()
    
    // Log visitor analytics on new session load
    // ponytail: fire and forget with a short timeout to prevent hanging
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 3000)

    supabase.from('visitor_analytics').insert([{ session_id: sessionId }])
      .then(
        ({error}) => {
          clearTimeout(id)
          if (error) logger.warn('Failed to log visitor', error)
        },
        (err) => {
          clearTimeout(id)
          logger.warn('Visitor log request failed', err)
        }
      )

    return NextResponse.json({ sessionId })
  } catch (err: unknown) {
    logger.error('Session init failed', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
