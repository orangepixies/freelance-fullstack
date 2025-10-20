import 'server-only'
import { jwtVerify } from 'jose'

function getJwtSecret() {
  const raw = process.env.AUTH_JWT_SECRET || 'dev-secret-please-change-this-to-32+chars!!!'
  return new TextEncoder().encode(raw)
}

export async function getUserFromCookie(token?: string) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return {
      id: payload.sub && !Number.isNaN(Number(payload.sub)) ? Number(payload.sub) : undefined,
      email: String(payload.email || ''),
      role: String(payload.role || 'USER'),
    }
  } catch {
    return null
  }
}
