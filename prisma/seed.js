/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient, Level } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Seed credentials are driven by env vars to avoid shipping known defaults in production.
// In production, you MUST set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_CLIENT_EMAIL
// and SEED_CLIENT_PASSWORD explicitly to prevent creating users with public credentials.
const adminEmailEnv = process.env.SEED_ADMIN_EMAIL;
const adminPasswordEnv = process.env.SEED_ADMIN_PASSWORD;
const clientEmailEnv = process.env.SEED_CLIENT_EMAIL;
const clientPasswordEnv = process.env.SEED_CLIENT_PASSWORD;

const adminEmail = adminEmailEnv || 'admin@studio-elan.fr';
const adminPasswordPlain = adminPasswordEnv || 'admin123';
const clientEmail = clientEmailEnv || 'client@example.com';
const clientPasswordPlain = clientPasswordEnv || 'client123';

async function main() {
  if (process.env.NODE_ENV === 'production') {
    const missingSeedEnvVars = [];
    if (!adminEmailEnv) missingSeedEnvVars.push('SEED_ADMIN_EMAIL');
    if (!adminPasswordEnv) missingSeedEnvVars.push('SEED_ADMIN_PASSWORD');
    if (!clientEmailEnv) missingSeedEnvVars.push('SEED_CLIENT_EMAIL');
    if (!clientPasswordEnv) missingSeedEnvVars.push('SEED_CLIENT_PASSWORD');

    if (missingSeedEnvVars.length > 0) {
      throw new Error(
        `Refusing to run prisma/seed.js in production because the following env vars are missing: ${missingSeedEnvVars.join(
          ', ',
        )}. In production you must set explicit SEED_* values instead of relying on the default admin/client credentials.`,
      );
    }
  }

  // Create admin user
  const adminPassword = await bcrypt.hash(adminPasswordPlain, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create client user for e2e
  const clientPassword = await bcrypt.hash(clientPasswordPlain, 10);
  await prisma.user.upsert({
    where: { email: clientEmail },
    update: {},
    create: {
      email: clientEmail,
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