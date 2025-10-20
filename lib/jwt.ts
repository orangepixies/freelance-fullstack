import { SignJWT, jwtVerify } from 'jose'

const secretStr = process.env.AUTH_JWT_SECRET || ''
const secret = new TextEncoder().encode(secretStr)

export type SessionPayload = {
  sub: string
  role: 'ADMIN' | 'LECTURER' | 'STUDENT'
}

export async function signSession(payload: SessionPayload, exp: string = '7d') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret)
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as SessionPayload
  } catch {
    return null
  }
}
