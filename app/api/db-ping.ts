// pages/api/db-ping.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../lib/prisma'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ ok: true })
  } catch (e) {
    console.error('DB ping failed', e)
    res.status(500).json({ ok: false, error: String(e) })
  }
}
