import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, departmentId, search } = req.query;
    const where = {};
    if (category) where.category = category;
    if (departmentId) where.departmentId = departmentId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, fullName: true, avatar: true } },
        department: { select: { name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, fullName: true, avatar: true } },
        department: true,
        comments: {
          include: { author: { select: { id: true, fullName: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!post) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, requireRoles('STUDENT'), upload.array('attachments', 3), async (req, res) => {
  try {
    const { title, content, category, departmentId } = req.body;
    const attachments = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const post = await prisma.post.create({
      data: { title, content, category, departmentId, authorId: req.user.id, attachments },
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const comment = await prisma.comment.create({
      data: { postId: req.params.id, authorId: req.user.id, content: req.body.content },
      include: { author: { select: { id: true, fullName: true, avatar: true } } },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const post = await prisma.post.update({
      where: { id: req.params.id },
      data: { likes: { increment: 1 } },
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
