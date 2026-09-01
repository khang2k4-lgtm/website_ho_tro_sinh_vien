import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { departmentId, search, tag } = req.query;
    const where = {};
    if (departmentId) where.departmentId = departmentId;

    const announcements = await prisma.announcement.findMany({
      where,
      include: { department: { select: { name: true, slug: true } } },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    const filteredAnnouncements = announcements.filter((announcement) => {
      const matchesTag = !tag || (Array.isArray(announcement.tags) && announcement.tags.includes(String(tag)));
      const haystack = `${announcement.title} ${announcement.content}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(String(search).toLowerCase());
      return matchesTag && matchesSearch;
    });

    res.json(filteredAnnouncements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: req.params.id },
      include: { department: true },
    });
    if (!announcement) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, requireRoles('STAFF', 'DEPT_MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const announcement = await prisma.announcement.create({
      data: { ...req.body, authorId: req.user.id },
    });
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/save', authMiddleware, async (req, res) => {
  try {
    const saved = await prisma.savedAnnouncement.upsert({
      where: { userId_announcementId: { userId: req.user.id, announcementId: req.params.id } },
      create: { userId: req.user.id, announcementId: req.params.id },
      update: {},
    });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
