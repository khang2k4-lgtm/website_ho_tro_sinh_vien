import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createAuditLog, createNotification, generateCode } from '../utils/helpers.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (req.user.role === 'STUDENT') {
      where.studentId = req.user.id;
    } else if (['STAFF', 'DEPT_MANAGER', 'ADMIN'].includes(req.user.role)) {
      // Tất cả vai trò xử lý đều phải thấy toàn bộ đơn đang được nộp trong hệ thống
      // để sinh viên gửi đơn xong sẽ xuất hiện ngay ở nhân viên, quản lý phòng ban và admin.
      // Không lọc theo departmentId nữa để tránh bỏ sót hồ sơ ở các bộ phận khác.
    }

    if (status) where.status = status;

    const applications = await prisma.application.findMany({
      where,
      include: {
        service: { select: { id: true, name: true, slug: true } },
        student: { select: { id: true, fullName: true, studentId: true, email: true } },
        assignedTo: { select: { id: true, fullName: true } },
        statusHistory: {
          include: { changedBy: { select: { fullName: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: req.params.id },
      include: {
        service: { include: { department: true } },
        student: { select: { id: true, fullName: true, studentId: true, email: true, phone: true, faculty: true, className: true } },
        assignedTo: { select: { id: true, fullName: true } },
        statusHistory: {
          include: { changedBy: { select: { fullName: true } } },
          orderBy: { createdAt: 'asc' },
        },
        rating: true,
      },
    });
    if (!application) return res.status(404).json({ message: 'Không tìm thấy hồ sơ' });

    if (req.user.role === 'STUDENT' && application.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Không có quyền' });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function optionalUpload(req, res, next) {
  if (req.is('multipart/form-data')) return upload.array('attachments', 5)(req, res, next);
  next();
}

router.post('/', authMiddleware, requireRoles('STUDENT'), optionalUpload, async (req, res) => {
  try {
    const { serviceId, formData, note } = req.body;
    const attachments = req.files?.map((f) => `/uploads/${f.filename}`) || [];
    const parsedForm = typeof formData === 'string' ? JSON.parse(formData) : formData;

    const application = await prisma.application.create({
      data: {
        code: generateCode('HD'),
        studentId: req.user.id,
        serviceId,
        formData: parsedForm,
        attachments,
        note,
        statusHistory: {
          create: {
            status: 'SUBMITTED',
            note: 'Sinh viên gửi hồ sơ',
            changedById: req.user.id,
          },
        },
      },
      include: { service: true },
    });

    await createAuditLog(req.user.id, 'SUBMIT', 'Application', application.id, application.code);
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', authMiddleware, requireRoles('STAFF', 'DEPT_MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const { status, note, rejectReason } = req.body;
    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status,
        note,
        rejectReason,
        assignedToId: req.user.id,
        statusHistory: {
          create: { status, note, changedById: req.user.id },
        },
      },
      include: { student: true, service: true },
    });

    const statusMessages = {
      RECEIVED: 'Hồ sơ của bạn đã được tiếp nhận',
      PROCESSING: 'Hồ sơ đang được xử lý',
      NEED_SUPPLEMENT: 'Bạn cần bổ sung hồ sơ',
      APPROVED: 'Hồ sơ đã được duyệt',
      REJECTED: 'Hồ sơ bị từ chối',
      COMPLETED: 'Hồ sơ đã hoàn thành',
    };

    await createNotification(
      application.studentId,
      'Cập nhật hồ sơ',
      statusMessages[status] || `Trạng thái: ${status}`,
      'APPLICATION',
      `/ho-so/${application.id}`
    );

    await createAuditLog(req.user.id, 'UPDATE_STATUS', 'Application', application.id, status);
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
