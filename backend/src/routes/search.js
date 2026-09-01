import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

function matchesQuery(text, q) {
  return String(text || '').toLowerCase().includes(q);
}

router.get('/', async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json({ services: [], departments: [], faqs: [], announcements: [], posts: [] });

    const needle = q.toLowerCase();

    const [services, departments, faqs, announcements, posts] = await Promise.all([
      prisma.service.findMany({
        where: { isActive: true },
        include: { department: { select: { name: true, slug: true } } },
      }),
      prisma.department.findMany({ where: { isActive: true }, take: 50 }),
      prisma.fAQ.findMany({ include: { department: { select: { name: true } } } }),
      prisma.announcement.findMany({ take: 50 }),
      prisma.post.findMany({ take: 50 }),
    ]);

    res.json({
      services: services.filter((s) => {
        const keywords = Array.isArray(s.keywords) ? s.keywords.join(' ') : '';
        return matchesQuery(`${s.name} ${s.description} ${keywords}`, needle);
      }).slice(0, 10),
      departments: departments.filter((d) => matchesQuery(`${d.name} ${d.description}`, needle)).slice(0, 10),
      faqs: faqs.filter((f) => matchesQuery(`${f.question} ${f.answer}`, needle)).slice(0, 10),
      announcements: announcements.filter((a) => matchesQuery(`${a.title} ${a.content}`, needle)).slice(0, 10),
      posts: posts.filter((p) => matchesQuery(`${p.title} ${p.content}`, needle)).slice(0, 5),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/guide', async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ message: 'Vui lòng nhập từ khóa' });

    const needle = q.toLowerCase();
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: { department: true },
    });

    const serviceResult = services.find((service) => {
      const keywords = Array.isArray(service.keywords) ? service.keywords.join(' ') : '';
      return matchesQuery(`${service.name} ${service.description} ${keywords}`, needle);
    });

    if (!serviceResult) {
      return res.json({
        found: false,
        message: 'Không tìm thấy dịch vụ phù hợp. Vui lòng thử từ khóa khác hoặc liên hệ phòng CTSV.',
      });
    }

    res.json({
      found: true,
      service: {
        id: serviceResult.id,
        name: serviceResult.name,
        slug: serviceResult.slug,
        description: serviceResult.description,
        requiredDocs: Array.isArray(serviceResult.requiredDocs) ? serviceResult.requiredDocs : [],
        steps: Array.isArray(serviceResult.steps) ? serviceResult.steps : [],
        processingTime: serviceResult.processingTime,
        submissionType: serviceResult.submissionType,
        department: serviceResult.department,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
