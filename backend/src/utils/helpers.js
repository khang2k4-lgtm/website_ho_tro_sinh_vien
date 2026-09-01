import prisma from '../lib/prisma.js';

export async function createAuditLog(userId, action, entityType, entityId, details) {
  try {
    await prisma.auditLog.create({
      data: { userId, action, entityType, entityId, details },
    });
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

export async function createNotification(userId, title, message, type = 'SYSTEM', link) {
  try {
    await prisma.notification.create({
      data: { userId, title, message, type, link },
    });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
}

export function generateCode(prefix) {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}${year}${rand}`;
}
