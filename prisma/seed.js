const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const hash = await bcrypt.hash("zee431###", 12);

  await prisma.adminUser.upsert({
    where: { email: "zee@projekts.pk" },
    update: { passwordHash: hash },
    create: { email: "zee@projekts.pk", passwordHash: hash },
  });

  console.log("Admin seeded: zee@projekts.pk");
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
