import { prisma } from "../src/client";

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: "admin@kingini.com",
    },
  });

  if (existingUser) {
    console.log("Admin user already exists.");
    return;
  }

  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email: "admin@kingini.com",
    },
  });

  console.log("Admin user created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });