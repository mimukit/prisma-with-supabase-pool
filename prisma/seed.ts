import { prisma } from "../src/server/db";

async function main() {
  for (let i = 0; i < 10000; i++) {
    const name = `Example ${i}`;
    await prisma.example.create({
      data: {
        name,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
