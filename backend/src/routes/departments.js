import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';
import { createAuditLog } from '../utils/helpers.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { services: true, staff: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const department = await prisma.department.findUnique({
      where: { slug: req.params.slug },
      include: {
        services: { where: { isActive: true } },
        faqs: true,
        announcements: { orderBy: { createdAt: 'desc' }, take: 5 },
        documents: true,
        staff: {
          where: { role: { in: ['STAFF', 'DEPT_MANAGER'] } },
          select: { id: true, fullName: true, email: true, phone: true, avatar: true },
        },
        _count: { select: { services: true, tickets: true } },
      },
    });
    if (!department) return res.status(404).json({ message: 'Không tìm thấy phòng ban' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, requireRoles('ADMIN'), async (req, res) => {
  try {
    const dept = await prisma.department.create({ data: req.body });
    await createAuditLog(req.user.id, 'CREATE', 'Department', dept.id);
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, requireRoles('ADMIN'), async (req, res) => {
  try {
    const dept = await prisma.department.update({ where: { id: req.params.id }, data: req.body });
    await createAuditLog(req.user.id, 'UPDATE', 'Department', dept.id);
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, requireRoles('ADMIN'), async (req, res) => {
  try {
    await prisma.department.update({ where: { id: req.params.id }, data: { isActive: false } });
    await createAuditLog(req.user.id, 'DELETE', 'Department', req.params.id);
    res.json({ message: 'Đã khóa phòng ban' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
