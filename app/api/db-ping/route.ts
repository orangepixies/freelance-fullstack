// app/api/db-ping/route.ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (e) {
    console.error('DB ping failed', e)
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 })
  }
}
