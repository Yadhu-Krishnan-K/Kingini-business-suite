// import { prisma } from "../src/client";

// async function main() {
//   const existingUser = await prisma.user.findUnique({
//     where: {
//       email: "admin@kingini.com",
//     },
//   });

//   if (existingUser) {
//     console.log("Admin user already exists.");
//     return;
//   }

//   await prisma.user.create({
//     data: {
//       id: crypto.randomUUID(),
//       email: "admin@kingini.com",
//     },
//   });

//   console.log("Admin user created successfully.");
// }

// main()
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
import { prisma } from "../src/client";
import bcrypt from "bcrypt";

async function main() {
  const password = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@kingini.com",
    },
    update: {
      role: "ADMIN",
    },
    create: {
      email: "admin@kingini.com",
      firstName: "Kingini",
      lastName: "Admin",
      password,
      role: "ADMIN",
    },
  });

  const category = await prisma.category.upsert({
    where: {
      slug: "mens-shirts",
    },
    update: {},
    create: {
      name: "Men's Shirts",
      slug: "mens-shirts",
    },
  });

  const product = await prisma.product.upsert({
    where: {
      slug: "classic-cotton-shirt",
    },
    update: {},
    create: {
      categoryId: category.id,
      name: "Classic Cotton Shirt",
      slug: "classic-cotton-shirt",
      description: "A classic cotton shirt for everyday wear.",
      brand: "Kingini",
      isPublished: true,
    },
  });

  console.log("Seed completed successfully.");
  console.log({
    adminId: admin.id,
    adminEmail: admin.email,
    categoryId: category.id,
    productId: product.id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });