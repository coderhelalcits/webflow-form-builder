const prisma = require('../config/database');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// In-memory fallback store when DB is offline during dev/testing
const inMemoryUsers = new Map();

// Seed default demo user
(async () => {
  try {
    const demoPasswordHash = await bcrypt.hash('password123', 10);
    const demoUser = {
      id: 'demo_user_id',
      name: 'Demo Admin',
      email: 'admin@flowform.com',
      password: demoPasswordHash,
      webflowSiteId: 'site_saas_landing',
      createdAt: new Date()
    };
    inMemoryUsers.set(demoUser.id, demoUser);
  } catch (err) {}
})();

class User {
  static async create({ name, email, password, webflowSiteId = null }) {
    const id = crypto.randomUUID();
    const newUser = { id, name, email, password, webflowSiteId, createdAt: new Date() };

    try {
      if (prisma && prisma.user) {
        return await prisma.user.create({
          data: { id, name, email, password, webflowSiteId }
        });
      }
    } catch (err) {
      console.warn('[User Model] Prisma query failed, using in-memory store fallback:', err.message);
    }

    inMemoryUsers.set(id, newUser);
    return newUser;
  }

  static async findByEmail(email) {
    try {
      if (prisma && prisma.user) {
        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (dbUser) return dbUser;
      }
    } catch (err) {
      console.warn('[User Model] Prisma findByEmail fallback:', err.message);
    }

    for (const user of inMemoryUsers.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  static async findById(id) {
    try {
      if (prisma && prisma.user) {
        const dbUser = await prisma.user.findUnique({ where: { id } });
        if (dbUser) return dbUser;
      }
    } catch (err) {
      console.warn('[User Model] Prisma findById fallback:', err.message);
    }

    return inMemoryUsers.get(id) || null;
  }

  static async updateWebflowSite(id, webflowSiteId) {
    try {
      if (prisma && prisma.user) {
        return await prisma.user.update({
          where: { id },
          data: { webflowSiteId }
        });
      }
    } catch (err) {
      console.warn('[User Model] Prisma updateWebflowSite fallback:', err.message);
    }

    const user = inMemoryUsers.get(id);
    if (user) {
      user.webflowSiteId = webflowSiteId;
      inMemoryUsers.set(id, user);
    }
    return user;
  }
}

module.exports = User;
