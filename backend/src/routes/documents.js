import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { departmentId, category } = req.query;
    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (category) where.category = category;

    const documents = await prisma.document.findMany({
      where,
      include: { department: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const doc = await prisma.document.create({ data: req.body });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
