import 'server-only'
import { prisma } from '@/lib/db'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(process.env.AUTH_JWT_SECRET || 'dev-secret-change-me')

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  
  // Use bcrypt.compare instead of plain text comparison
  const isValidPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isValidPassword) return null
  
  return { id: user.id, email: user.email, role: user.role }
}

export async function createSessionToken(payload: { id: number; email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifySessionToken(token?: string) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as any
  } catch {
    return null
  }
}
