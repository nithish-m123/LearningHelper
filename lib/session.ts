import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

const SESSION_COOKIE = 'exam-prep-session'
const TTL_SECONDS = 60 * 60 * 24 // 24 hours

export async function getSessionId(): Promise<string | null> {
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null
}

export async function getOrCreateSessionId(): Promise<string> {
  const existing = await getSessionId()
  if (existing) return existing

  const id = randomUUID()
  // Next 15 requires awaiting cookies()
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, id, {
    httpOnly: true, // Secure: JavaScript cannot access it
    sameSite: 'lax',
    maxAge: TTL_SECONDS,
  })
  return id
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
