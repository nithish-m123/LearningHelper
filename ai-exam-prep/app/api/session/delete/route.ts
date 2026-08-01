import { NextResponse } from 'next/server'
import { getSessionId, clearSessionCookie } from '@/lib/session'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'

export async function POST() {
  try {
    const sessionId = await getSessionId()
    if (!sessionId) return NextResponse.json({ success: true, message: 'No active session' })
    
    logger.info('Deleting session', { sessionId })

    // Step 1: Delete all vectors owned securely by this session
    const { error: dbError } = await supabase
      .from('document_chunks')
      .delete()
      .eq('session_id', sessionId)
      
    if (dbError) throw dbError

    // Step 2: Clear cookie
    await clearSessionCookie()

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    logger.error('Session delete failed', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
