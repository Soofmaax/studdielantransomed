/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient, Level } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@studio-elan.fr' },
    update: {},
    create: {
      email: 'admin@studio-elan.fr',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create client user for e2e
  const clientPassword = await bcrypt.hash('client123', 10);
  await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Client Test',
      password: clientPassword,
      role: 'CLIENT',
    },
  });

  // Create courses
  await prisma.course.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Yoga Vinyasa',
        description: 'Un style dynamique qui synchronise le mouvement avec la respiration.',
        price: 25,
        duration: 60,
        level: Level.ALL_LEVELS,
        capacity: 15,
      },
      {
        title: 'Yoga Doux',
        description: 'Une pratique douce et accessible, parfaite pour les débutants.',
        price: 22,
        duration: 60,
        level: Level.BEGINNER,
        capacity: 12,
      },
      {
        title: 'Méditation',
        description: 'Séances guidées pour apaiser l\'esprit et développer la pleine conscience.',
        price: 18,
        duration: 45,
        level: Level.ALL_LEVELS,
        capacity: 20,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });