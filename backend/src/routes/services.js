import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';
import { createAuditLog } from '../utils/helpers.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, departmentId, search } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;
    if (departmentId) where.departmentId = departmentId;

    const services = await prisma.service.findMany({
      where,
      include: {
        department: { select: { id: true, name: true, slug: true } },
        _count: { select: { applications: true, ratings: true } },
      },
      orderBy: { name: 'asc' },
    });

    const filteredServices = services.filter((service) => {
      const keywordList = Array.isArray(service.keywords) ? service.keywords.map((item) => String(item).toLowerCase()) : [];
      const haystack = `${service.name} ${service.description ?? ''} ${keywordList.join(' ')}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(String(search).toLowerCase());
      return matchesSearch;
    });

    res.json(filteredServices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug },
      include: {
        department: true,
        documents: true,
        ratings: {
          include: { user: { select: { fullName: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
    if (!service) return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });

    const avgRating = await prisma.rating.aggregate({
      where: { serviceId: service.id },
      _avg: { score: true },
    });

    res.json({ ...service, avgRating: avgRating._avg.score || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, requireRoles('ADMIN', 'DEPT_MANAGER'), async (req, res) => {
  try {
    const service = await prisma.service.create({ data: req.body });
    await createAuditLog(req.user.id, 'CREATE', 'Service', service.id);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, requireRoles('ADMIN', 'DEPT_MANAGER'), async (req, res) => {
  try {
    const service = await prisma.service.update({ where: { id: req.params.id }, data: req.body });
    await createAuditLog(req.user.id, 'UPDATE', 'Service', service.id);
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, requireRoles('ADMIN'), async (req, res) => {
  try {
    await prisma.service.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Đã ẩn dịch vụ' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
