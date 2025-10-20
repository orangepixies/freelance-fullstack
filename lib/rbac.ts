// lib/rbac.ts
import type { Role } from '@prisma/client'

export function canRead(role?: Role) {
  // semua role yang login boleh READ
  return !!role
}

export function canWrite(role?: Role) {
  // hanya ADMIN & LECTURER yang boleh CREATE/UPDATE/DELETE
  return role === 'ADMIN' || role === 'LECTURER'
}
