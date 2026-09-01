import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { departmentId, search } = req.query;
    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (search) {
      where.OR = [
        { question: { contains: search } },
        { answer: { contains: search } },
      ];
    }
    const faqs = await prisma.fAQ.findMany({
      where,
      include: { department: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, requireRoles('STAFF', 'DEPT_MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const faq = await prisma.fAQ.create({ data: req.body });
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
