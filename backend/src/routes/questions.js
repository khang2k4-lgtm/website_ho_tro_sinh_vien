import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';
import { createNotification } from '../utils/helpers.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { search, resolved } = req.query;
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    if (resolved !== undefined) where.isResolved = resolved === 'true';

    const questions = await prisma.question.findMany({
      where,
      include: {
        author: { select: { id: true, fullName: true, avatar: true } },
        _count: { select: { answers: true, votes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const question = await prisma.question.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, fullName: true, avatar: true } },
        answers: {
          include: { author: { select: { id: true, fullName: true, role: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
        _count: { select: { votes: true } },
      },
    });
    if (!question) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, requireRoles('STUDENT'), async (req, res) => {
  try {
    const question = await prisma.question.create({
      data: { ...req.body, authorId: req.user.id },
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/answers', authMiddleware, requireRoles('STAFF', 'DEPT_MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const answer = await prisma.answer.create({
      data: { questionId: req.params.id, authorId: req.user.id, content: req.body.content },
      include: { author: { select: { id: true, fullName: true, role: true } } },
    });

    const question = await prisma.question.findUnique({ where: { id: req.params.id } });
    await createNotification(question.authorId, 'Câu hỏi được trả lời', req.body.content.slice(0, 100), 'QUESTION', `/hoi-dap/${question.id}`);

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    await prisma.questionVote.upsert({
      where: { questionId_userId: { questionId: req.params.id, userId: req.user.id } },
      create: { questionId: req.params.id, userId: req.user.id },
      update: {},
    });
    res.json({ message: 'Đã vote' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
