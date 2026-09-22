import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createAuditLog, createNotification, generateCode } from '../utils/helpers.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, category } = req.query;
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    if (req.user.role === 'STUDENT') {
      where.studentId = req.user.id;
    } else if (['STAFF', 'DEPT_MANAGER', 'ADMIN'].includes(req.user.role)) {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user?.departmentId) where.departmentId = user.departmentId;
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        student: { select: { id: true, fullName: true, studentId: true } },
        department: { select: { name: true } },
        assignedTo: { select: { fullName: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: req.params.id },
      include: {
        student: { select: { id: true, fullName: true, studentId: true, email: true } },
        department: true,
        assignedTo: { select: { fullName: true } },
        messages: {
          include: { sender: { select: { id: true, fullName: true, role: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
        rating: true,
      },
    });
    if (!ticket) return res.status(404).json({ message: 'Không tìm thấy ticket' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function optionalUpload(req, res, next) {
  if (req.is('multipart/form-data')) return upload.array('attachments', 5)(req, res, next);
  next();
}

router.post('/', authMiddleware, requireRoles('STUDENT'), optionalUpload, async (req, res) => {
  try {
    const { title, content, category, departmentId } = req.body;
    const attachments = req.files?.map((f) => `/uploads/${f.filename}`) || [];

    const ticket = await prisma.supportTicket.create({
      data: {
        code: generateCode('TK'),
        title,
        content,
        category,
        departmentId: departmentId || null,
        studentId: req.user.id,
        attachments,
      },
    });

    await createAuditLog(req.user.id, 'CREATE', 'Ticket', ticket.id, ticket.code);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', authMiddleware, requireRoles('STAFF', 'DEPT_MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const { status, assignedToId } = req.body;
    const ticket = await prisma.supportTicket.update({
      where: { id: req.params.id },
      data: { status, assignedToId: assignedToId || req.user.id },
      include: { student: true },
    });

    await createNotification(ticket.studentId, 'Cập nhật ticket', `Ticket ${ticket.code} - ${status}`, 'TICKET', `/ho-tro/${ticket.id}`);
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await prisma.ticketMessage.create({
      data: { ticketId: req.params.id, senderId: req.user.id, content },
      include: { sender: { select: { id: true, fullName: true, role: true, avatar: true } } },
    });

    const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id } });
    const notifyId = req.user.id === ticket.studentId ? ticket.assignedToId : ticket.studentId;
    if (notifyId) {
      await createNotification(notifyId, 'Tin nhắn mới', content.slice(0, 100), 'TICKET', `/ho-tro/${ticket.id}`);
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
