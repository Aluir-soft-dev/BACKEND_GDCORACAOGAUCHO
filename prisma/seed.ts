import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@coracaogaucho.com";
  const password = "Admin@123456";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin inicial já existe.");
    return;
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: "Administrador",
      email,
      role: UserRole.ADMIN,
      emailVerified: true,
      isActive: true,
    },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      providerId: "credential",
      accountId: email,
      password: hash,
    },
  });

  console.log("Admin criado com sucesso:", email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });