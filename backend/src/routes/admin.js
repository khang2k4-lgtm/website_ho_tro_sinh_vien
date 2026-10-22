import { Router } from 'express';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { authMiddleware, requireRoles, userSelect } from '../middleware/auth.js';
import { createAuditLog } from '../utils/helpers.js';

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
    if (role === 'ADMIN') return res.json([]);
    const where = { role: { not: 'ADMIN' } };
    if (role) where.role = role;
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
    const normalizedName = typeof fullName === 'string' ? fullName.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const allowedRoles = ['STUDENT', 'STAFF', 'DEPT_MANAGER'];
    if (!normalizedName || !normalizedEmail || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: 'Vui lòng nhập họ tên, email và mật khẩu tối thiểu 6 ký tự' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Vai trò tài khoản không hợp lệ' });
    }

    let normalizedDepartmentId;
    if (role === 'STAFF' || role === 'DEPT_MANAGER') {
      if (typeof departmentId !== 'string' || !departmentId) {
        return res.status(400).json({ message: 'Vui lòng chọn phòng ban cho tài khoản nhân viên' });
      }
      const department = await prisma.department.findFirst({
        where: { id: departmentId, isActive: true },
        select: { id: true },
      });
      if (!department) {
        return res.status(400).json({ message: 'Phòng ban không tồn tại hoặc đã ngừng hoạt động' });
      }
      normalizedDepartmentId = department.id;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        fullName: normalizedName,
        role,
        ...(normalizedDepartmentId ? { departmentId: normalizedDepartmentId } : {}),
        ...(role === 'STUDENT' && typeof studentId === 'string' && studentId.trim()
          ? { studentId: studentId.trim() }
          : {}),
      },
      select: userSelect,
    });
    await createAuditLog(req.user.id, 'USER_CREATE', 'User', user.id, `Tạo tài khoản ${user.fullName} (${user.role})`);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: 'Email hoặc mã số sinh viên đã được sử dụng' });
    }
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
    const changes = [];
    if (role !== undefined) changes.push(`vai trò ${role}`);
    if (isActive !== undefined) changes.push(isActive ? 'mở khóa tài khoản' : 'khóa tài khoản');
    await createAuditLog(
      req.user.id,
      'USER_UPDATE',
      'User',
      user.id,
      `Cập nhật ${user.fullName}${changes.length ? `: ${changes.join(', ')}` : ''}`
    );
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
