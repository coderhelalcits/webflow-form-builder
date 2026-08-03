const prisma = require('../config/database');
const crypto = require('crypto');

const inMemoryForms = new Map();

class Form {
  static async create({ userId, name, fields = [], settings = {} }) {
    const id = crypto.randomUUID();
    const defaultSettings = {
      submitButtonText: 'Submit',
      successMessage: 'Thank you! Your submission has been received.',
      notificationEmail: '',
      ...settings
    };

    const newForm = {
      id,
      userId,
      name,
      fields,
      settings: defaultSettings,
      createdAt: new Date()
    };

    try {
      if (prisma && prisma.form) {
        return await prisma.form.create({
          data: {
            id,
            userId,
            name,
            fields: JSON.stringify(fields),
            settings: JSON.stringify(defaultSettings)
          }
        });
      }
    } catch (err) {
      console.warn('[Form Model] Prisma create fallback:', err.message);
    }

    inMemoryForms.set(id, newForm);
    return newForm;
  }

  static async findByUserId(userId) {
    try {
      if (prisma && prisma.form) {
        const forms = await prisma.form.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' }
        });
        if (forms && forms.length > 0) {
          return forms.map(f => ({
            ...f,
            fields: typeof f.fields === 'string' ? JSON.parse(f.fields) : f.fields,
            settings: typeof f.settings === 'string' ? JSON.parse(f.settings) : f.settings
          }));
        }
      }
    } catch (err) {
      console.warn('[Form Model] Prisma findByUserId fallback:', err.message);
    }

    const results = [];
    for (const form of inMemoryForms.values()) {
      if (form.userId === userId) {
        results.push(form);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async findById(id) {
    try {
      if (prisma && prisma.form) {
        const f = await prisma.form.findUnique({ where: { id } });
        if (f) {
          return {
            ...f,
            fields: typeof f.fields === 'string' ? JSON.parse(f.fields) : f.fields,
            settings: typeof f.settings === 'string' ? JSON.parse(f.settings) : f.settings
          };
        }
      }
    } catch (err) {
      console.warn('[Form Model] Prisma findById fallback:', err.message);
    }

    return inMemoryForms.get(id) || null;
  }

  static async update(id, userId, { name, fields, settings }) {
    try {
      if (prisma && prisma.form) {
        const existing = await prisma.form.findFirst({ where: { id, userId } });
        if (existing) {
          const updated = await prisma.form.update({
            where: { id },
            data: {
              ...(name && { name }),
              ...(fields && { fields: JSON.stringify(fields) }),
              ...(settings && { settings: JSON.stringify(settings) })
            }
          });
          return {
            ...updated,
            fields: typeof updated.fields === 'string' ? JSON.parse(updated.fields) : updated.fields,
            settings: typeof updated.settings === 'string' ? JSON.parse(updated.settings) : updated.settings
          };
        }
      }
    } catch (err) {
      console.warn('[Form Model] Prisma update fallback:', err.message);
    }

    const form = inMemoryForms.get(id);
    if (!form || form.userId !== userId) return null;

    if (name !== undefined) form.name = name;
    if (fields !== undefined) form.fields = fields;
    if (settings !== undefined) form.settings = settings;

    inMemoryForms.set(id, form);
    return form;
  }

  static async delete(id, userId) {
    try {
      if (prisma && prisma.form) {
        const existing = await prisma.form.findFirst({ where: { id, userId } });
        if (existing) {
          await prisma.form.delete({ where: { id } });
          return true;
        }
      }
    } catch (err) {
      console.warn('[Form Model] Prisma delete fallback:', err.message);
    }

    const form = inMemoryForms.get(id);
    if (form && form.userId === userId) {
      inMemoryForms.delete(id);
      return true;
    }
    return false;
  }
}

module.exports = Form;
