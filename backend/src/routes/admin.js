import { Router } from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { authMiddleware, requireRoles, userSelect } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authMiddleware, requireRoles('ADMIN', 'DEPT_MANAGER', 'STAFF'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalStudents,
      totalStaff,
      totalDepartments,
      totalServices,
      todayApplications,
      processingApps,
      completedApps,
      openTickets,
      applicationsByStatus,
      ratingsByDept,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: { in: ['STAFF', 'DEPT_MANAGER'] } } }),
      prisma.department.count({ where: { isActive: true } }),
      prisma.service.count({ where: { isActive: true } }),
      prisma.application.count({ where: { createdAt: { gte: today } } }),
      prisma.application.count({ where: { status: { in: ['RECEIVED', 'PROCESSING', 'NEED_SUPPLEMENT'] } } }),
      prisma.application.count({ where: { status: 'COMPLETED' } }),
      prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.application.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.rating.findMany({
        include: { service: { include: { department: { select: { name: true } } } } },
      }),
    ]);

    const deptRatings = {};
    ratingsByDept.forEach((r) => {
      const name = r.service?.department?.name || 'Khác';
      if (!deptRatings[name]) deptRatings[name] = { total: 0, count: 0 };
      deptRatings[name].total += r.score;
      deptRatings[name].count += 1;
    });

    const ratingStats = Object.entries(deptRatings).map(([name, v]) => ({
      name,
      avg: +(v.total / v.count).toFixed(1),
      count: v.count,
    }));

    res.json({
      overview: {
        totalStudents,
        totalStaff,
        totalDepartments,
        totalServices,
        todayApplications,
        processingApps,
        completedApps,
        openTickets,
      },
      applicationsByStatus,
      ratingStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/users', authMiddleware, requireRoles('ADMIN'), async (req, res) => {
  try {
    const { role } = req.query;
    const where = role ? { role } : {};
    const users = await prisma.user.findMany({
      where,
      select: { ...userSelect, isActive: true, department: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/users', authMiddleware, requireRoles('ADMIN'), async (req, res) => {
  try {
    const { email, password, fullName, role, departmentId, studentId } = req.body;
    const hashed = await bcrypt.hash(password || '123456', 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, fullName, role, departmentId, studentId },
      select: userSelect,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/users/:id', authMiddleware, requireRoles('ADMIN'), async (req, res) => {
  try {
    const { isActive, role, departmentId } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive, role, departmentId },
      select: userSelect,
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/audit-logs', authMiddleware, requireRoles('ADMIN'), async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { fullName: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/reports', authMiddleware, requireRoles('ADMIN', 'DEPT_MANAGER'), async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        post: { select: { title: true } },
        reporter: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
