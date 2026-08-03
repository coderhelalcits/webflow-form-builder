const { PrismaClient } = require('@prisma/client');
const env = require('./env');

let prisma;

try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL
      }
    }
  });
} catch (error) {
  console.warn('PrismaClient init warning:', error.message);
}

module.exports = prisma;
