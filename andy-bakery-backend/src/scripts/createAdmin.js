const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.create({
    data: { email: 'admin@andybakery.com', password: hashed }
  })
  console.log('Admin created:', admin.email)
}

main().catch(console.error).finally(() => prisma.$disconnect())
