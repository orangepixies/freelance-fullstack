import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const email = 'admin@example.com'
  const plain = process.env.SEED_ADMIN_PASSWORD || 'AdminPass123!'
  const passwordHash = await bcrypt.hash(plain, 10)

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'ADMIN' },
    create: { email, passwordHash, role: 'ADMIN' },
  })

  console.log(`Seeded admin: ${email} / ${plain}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); process.exit(1) })
