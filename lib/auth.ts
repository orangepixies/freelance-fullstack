import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

type UserLike = { id?: number; email: string; role?: string }

function getJwtSecret() {
  const raw = process.env.AUTH_JWT_SECRET || 'dev-secret-please-change-this-to-32+chars!!!'
  return new TextEncoder().encode(raw)
}

export async function verifyCredentials(email: string, password: string): Promise<UserLike | null> {
  const e = email.trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email: e } })
  if (!user) return null
  const ok = await bcrypt.compare(password, user.passwordHash)
  return ok ? { id: user.id, email: user.email, role: user.role as string } : null
}

export async function createSessionCookie(user: UserLike) {
  const token = await new SignJWT({ email: user.email, role: user.role ?? 'USER' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id ?? user.email))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret())

  const oneWeek = 60 * 60 * 24 * 7
  return {
    name: 'session',
    value: token,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', // aman di dev http
      path: '/',
      maxAge: oneWeek,
    } as const,
  }
}

export async function getUserFromCookie(token?: string): Promise<UserLike | null> {
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
