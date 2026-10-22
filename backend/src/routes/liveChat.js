import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authMiddleware, requireRoles } from '../middleware/auth.js';
import { generateCode } from '../utils/helpers.js';

const router = Router();
const staffRoles = ['STAFF', 'DEPT_MANAGER', 'ADMIN'];

function conversationInclude() {
  return {
    student: {
      select: {
        id: true,
        fullName: true,
        studentId: true,
        className: true,
        phone: true,
        email: true,
      },
    },
    assignedTo: {
      select: { id: true, fullName: true, role: true },
    },
    department: { select: { id: true, name: true } },
    messages: {
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        sender: { select: { id: true, fullName: true, role: true } },
      },
    },
  };
}

function serializeConversation(conversation) {
  return {
    ...conversation,
    messages: conversation.messages.reverse(),
  };
}

async function notifyStaff(tx, { title, message, link, departmentId }) {
  const recipients = await tx.user.findMany({
    where: {
      role: { in: staffRoles },
      isActive: true,
      ...(departmentId ? { departmentId } : {}),
    },
    select: { id: true },
  });
  if (!recipients.length) return;
  await tx.notification.createMany({
    data: recipients.map(({ id }) => ({
      userId: id,
      title,
      message,
      type: 'TICKET',
      link,
    })),
  });
}

router.get('/staff', authMiddleware, requireRoles(...staffRoles), async (_req, res) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: { in: ['STAFF', 'DEPT_MANAGER'] }, isActive: true },
      select: {
        id: true,
        fullName: true,
        role: true,
        department: { select: { id: true, name: true } },
      },
      orderBy: { fullName: 'asc' },
    });
    res.json(staff);
  } catch (err) {
    console.error('Live chat staff list error:', err);
    res.status(500).json({ message: 'Không thể tải danh sách cán bộ trực.' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!['STUDENT', ...staffRoles].includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền xem hội thoại.' });
    }
    const conversations = await prisma.chatConversation.findMany({
      where: req.user.role === 'STUDENT' ? { studentId: req.user.id } : undefined,
      include: conversationInclude(),
      orderBy: { updatedAt: 'desc' },
    });
    res.json(conversations.map(serializeConversation));
  } catch (err) {
    console.error('Live chat list error:', err);
    res.status(500).json({ message: 'Không thể tải danh sách hội thoại.' });
  }
});

router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const conversation = await prisma.chatConversation.findUnique({
      where: { id: req.params.id },
      select: { studentId: true },
    });
    if (!conversation) return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện.' });
    if (req.user.role === 'STUDENT' && conversation.studentId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập cuộc trò chuyện này.' });
    }
    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        isRead: false,
        link: { contains: `conversation=${req.params.id}` },
      },
      data: { isRead: true },
    });
    res.json({ message: 'Đã đánh dấu thông báo chat là đã đọc.' });
  } catch (err) {
    console.error('Live chat mark-read error:', err);
    res.status(500).json({ message: 'Không thể cập nhật trạng thái thông báo.' });
  }
});

router.post('/', authMiddleware, requireRoles('STUDENT'), async (req, res) => {
  const topic = typeof req.body.topic === 'string' ? req.body.topic.trim() : '';
  const content = typeof req.body.content === 'string' ? req.body.content.trim() : '';
  const departmentId = typeof req.body.departmentId === 'string' ? req.body.departmentId : null;
  if (!topic || topic.length > 160 || !content || content.length > 4000) {
    return res.status(400).json({ message: 'Vui lòng nhập chủ đề (tối đa 160 ký tự) và nội dung chat (tối đa 4.000 ký tự).' });
  }

  try {
    if (departmentId) {
      const department = await prisma.department.findUnique({ where: { id: departmentId }, select: { id: true } });
      if (!department) return res.status(400).json({ message: 'Phòng ban đã chọn không hợp lệ.' });
    }
    const conversation = await prisma.$transaction(async (tx) => {
      const created = await tx.chatConversation.create({
        data: {
          code: generateCode('CHAT'),
          topic,
          studentId: req.user.id,
          departmentId,
        },
      });
      await tx.chatMessage.create({
        data: { conversationId: created.id, senderId: req.user.id, content },
      });
      await notifyStaff(tx, {
        title: 'Sinh viên cần hỗ trợ qua chat',
        message: `${topic}: ${content.slice(0, 100)}`,
        link: `/dashboard/chat-sinh-vien/truc-tiep?conversation=${created.id}`,
        departmentId,
      });
      return tx.chatConversation.findUnique({
        where: { id: created.id },
        include: conversationInclude(),
      });
    });
    res.status(201).json(serializeConversation(conversation));
  } catch (err) {
    console.error('Live chat create error:', err);
    res.status(500).json({ message: 'Không thể tạo cuộc trò chuyện lúc này.' });
  }
});

router.post('/:id/messages', authMiddleware, async (req, res) => {
  const content = typeof req.body.content === 'string' ? req.body.content.trim() : '';
  if (!content || content.length > 4000) {
    return res.status(400).json({ message: 'Tin nhắn không được để trống và tối đa 4.000 ký tự.' });
  }

  try {
    const conversation = await prisma.chatConversation.findUnique({
      where: { id: req.params.id },
      include: { student: { select: { id: true } }, assignedTo: { select: { id: true } } },
    });
    if (!conversation) return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện.' });
    const isStaff = staffRoles.includes(req.user.role);
    if (!isStaff && (req.user.role !== 'STUDENT' || conversation.studentId !== req.user.id)) {
      return res.status(403).json({ message: 'Bạn không có quyền gửi tin nhắn trong cuộc trò chuyện này.' });
    }
    if (conversation.status === 'completed') {
      return res.status(409).json({ message: 'Cuộc trò chuyện đã kết thúc.' });
    }

    const recipientIds = isStaff
      ? [conversation.studentId]
      : conversation.assignedTo?.id
        ? [conversation.assignedTo.id]
        : (await prisma.user.findMany({
          where: {
            role: { in: staffRoles },
            isActive: true,
            ...(conversation.departmentId ? { departmentId: conversation.departmentId } : {}),
          },
          select: { id: true },
        })).map(({ id }) => id);

    const message = await prisma.$transaction(async (tx) => {
      const created = await tx.chatMessage.create({
        data: { conversationId: conversation.id, senderId: req.user.id, content },
        include: { sender: { select: { id: true, fullName: true, role: true } } },
      });
      await tx.chatConversation.update({
        where: { id: conversation.id },
        data: { status: isStaff ? 'active' : 'waiting' },
      });
      if (recipientIds.length) {
        await tx.notification.createMany({
          data: [...new Set(recipientIds)].map((userId) => ({
            userId,
            title: 'Tin nhắn chat mới',
            message: content.slice(0, 100),
            type: 'TICKET',
            link: isStaff
              ? `/chat-truc-tiep?conversation=${conversation.id}`
              : `/dashboard/chat-sinh-vien/truc-tiep?conversation=${conversation.id}`,
          })),
        });
      }
      return created;
    });
    res.status(201).json(message);
  } catch (err) {
    console.error('Live chat message error:', err);
    res.status(500).json({ message: 'Không thể gửi tin nhắn lúc này.' });
  }
});

router.patch('/:id/transfer', authMiddleware, requireRoles(...staffRoles), async (req, res) => {
  const { assignedToId, departmentId } = req.body;
  const handoverNote = typeof req.body.handoverNote === 'string' ? req.body.handoverNote.trim() : '';
  if (typeof assignedToId !== 'string' || !assignedToId.trim()) {
    return res.status(400).json({ message: 'Vui lòng chọn cán bộ nhận bàn giao.' });
  }
  if (handoverNote.length > 2000) {
    return res.status(400).json({ message: 'Ghi chú bàn giao không được vượt quá 2.000 ký tự.' });
  }
  try {
    const conversation = await prisma.chatConversation.findUnique({ where: { id: req.params.id } });
    if (!conversation) return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện.' });
    if (conversation.status === 'completed') {
      return res.status(409).json({ message: 'Không thể bàn giao một cuộc trò chuyện đã kết thúc.' });
    }
    if (assignedToId) {
      const assignee = await prisma.user.findFirst({
        where: { id: assignedToId, role: { in: ['STAFF', 'DEPT_MANAGER'] }, isActive: true },
        select: { id: true },
      });
      if (!assignee) return res.status(400).json({ message: 'Cán bộ nhận bàn giao không hợp lệ.' });
    }
    if (departmentId) {
      const department = await prisma.department.findUnique({ where: { id: departmentId }, select: { id: true } });
      if (!department) return res.status(400).json({ message: 'Phòng ban nhận bàn giao không hợp lệ.' });
    }
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.chatConversation.update({
        where: { id: conversation.id },
        data: {
          assignedToId,
          departmentId: departmentId || conversation.departmentId,
          handoverNote: handoverNote || null,
          status: 'transferred',
        },
      });
      await tx.notification.createMany({
        data: [
          {
            userId: conversation.studentId,
            title: 'Phiên chat đã được chuyển',
            message: 'Cán bộ đã chuyển cuộc trò chuyện tới chuyên viên phụ trách.',
            type: 'TICKET',
            link: `/chat-truc-tiep?conversation=${conversation.id}`,
          },
          {
            userId: assignedToId,
            title: 'Bạn được giao một phiên chat',
            message: `${handoverNote ? `${handoverNote.slice(0, 80)} · ` : ''}Mã phiên ${conversation.code}`,
            type: 'TICKET',
            link: `/dashboard/chat-sinh-vien/truc-tiep?conversation=${conversation.id}`,
          },
        ],
      });
      return tx.chatConversation.findUnique({ where: { id: result.id }, include: conversationInclude() });
    });
    res.json(serializeConversation(updated));
  } catch (err) {
    console.error('Live chat transfer error:', err);
    res.status(500).json({ message: 'Không thể bàn giao cuộc trò chuyện lúc này.' });
  }
});

router.patch('/:id/close', authMiddleware, requireRoles(...staffRoles), async (req, res) => {
  try {
    const conversation = await prisma.chatConversation.findUnique({ where: { id: req.params.id } });
    if (!conversation) return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện.' });
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.chatConversation.update({
        where: { id: conversation.id },
        data: { status: 'completed' },
      });
      await tx.notification.create({
        data: {
          userId: conversation.studentId,
          title: 'Cuộc trò chuyện đã kết thúc',
          message: 'Phiên hỗ trợ chat của bạn đã được cán bộ kết thúc.',
          type: 'TICKET',
          link: `/chat-truc-tiep?conversation=${conversation.id}`,
        },
      });
      return result;
    });
    res.json(updated);
  } catch (err) {
    console.error('Live chat close error:', err);
    res.status(500).json({ message: 'Không thể kết thúc cuộc trò chuyện lúc này.' });
  }
});

export default router;
