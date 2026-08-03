const prisma = require('../config/database');
const crypto = require('crypto');

const inMemorySubmissions = new Map();

class Submission {
  static async create({ formId, data }) {
    const id = crypto.randomUUID();
    const newSubmission = {
      id,
      formId,
      data,
      createdAt: new Date()
    };

    try {
      if (prisma && prisma.submission) {
        return await prisma.submission.create({
          data: {
            id,
            formId,
            data: JSON.stringify(data)
          }
        });
      }
    } catch (err) {
      console.warn('[Submission Model] Prisma create fallback:', err.message);
    }

    inMemorySubmissions.set(id, newSubmission);
    return newSubmission;
  }

  static async findByFormId(formId) {
    try {
      if (prisma && prisma.submission) {
        const list = await prisma.submission.findMany({
          where: { formId },
          orderBy: { createdAt: 'desc' }
        });
        if (list && list.length > 0) {
          return list.map(s => ({
            ...s,
            data: typeof s.data === 'string' ? JSON.parse(s.data) : s.data
          }));
        }
      }
    } catch (err) {
      console.warn('[Submission Model] Prisma findByFormId fallback:', err.message);
    }

    const results = [];
    for (const sub of inMemorySubmissions.values()) {
      if (sub.formId === formId) {
        results.push(sub);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async findByFormIds(formIds = []) {
    if (!formIds.length) return [];
    try {
      if (prisma && prisma.submission) {
        const list = await prisma.submission.findMany({
          where: { formId: { in: formIds } },
          orderBy: { createdAt: 'desc' },
          include: { form: { select: { name: true } } }
        });
        if (list && list.length > 0) {
          return list.map(s => ({
            ...s,
            formName: s.form ? s.form.name : 'Unknown Form',
            data: typeof s.data === 'string' ? JSON.parse(s.data) : s.data
          }));
        }
      }
    } catch (err) {
      console.warn('[Submission Model] Prisma findByFormIds fallback:', err.message);
    }

    const results = [];
    for (const sub of inMemorySubmissions.values()) {
      if (formIds.includes(sub.formId)) {
        results.push(sub);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async countByFormIds(formIds = []) {
    if (!formIds.length) return 0;
    try {
      if (prisma && prisma.submission) {
        return await prisma.submission.count({
          where: { formId: { in: formIds } }
        });
      }
    } catch (err) {
      console.warn('[Submission Model] Prisma countByFormIds fallback:', err.message);
    }

    let count = 0;
    for (const sub of inMemorySubmissions.values()) {
      if (formIds.includes(sub.formId)) {
        count++;
      }
    }
    return count;
  }
}

module.exports = Submission;
