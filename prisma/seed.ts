import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash("password", 10);

  const imageUrl = await faker.image.avatar();

  const adminUser = await prisma.user.create({
    data: {
      email: "test@test.com",
      imageUrl,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.tweet.create({
    data: {
      body: faker.commerce.productDescription(),
      userId: adminUser.id,
    },
  });

  Array.from({ length: 10 }).map(async (_, i) => {
    const email = await faker.internet.email();
    const imageUrl = await faker.image.avatar();

    // cleanup the existing database
    await prisma.user.delete({ where: { email } }).catch(() => {
      // no worries if it doesn't exist yet
    });
    const hashedPassword = await bcrypt.hash("password", 10);

    const user = await prisma.user.create({
      data: {
        email,
        imageUrl,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    });

    await prisma.tweet.create({
      data: {
        body: faker.commerce.productDescription(),
        userId: user.id,
      },
    });

    await prisma.tweet.create({
      data: {
        body: faker.commerce.productDescription(),
        userId: user.id,
      },
    });

    await prisma.follows.create({
      data: {
        followingId: user.id,
        followerId: adminUser.id,
      },
    });
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
