export const STATUS_LABELS = {
  SUBMITTED: { label: 'Đã gửi', class: 'badge-info' },
  RECEIVED: { label: 'Đã tiếp nhận', class: 'badge-info' },
  PROCESSING: { label: 'Đang xử lý', class: 'badge-warning' },
  NEED_SUPPLEMENT: { label: 'Chờ bổ sung', class: 'badge-warning' },
  APPROVED: { label: 'Đã duyệt', class: 'badge-success' },
  REJECTED: { label: 'Từ chối', class: 'badge-danger' },
  COMPLETED: { label: 'Hoàn thành', class: 'badge-success' },
};

export const TICKET_STATUS = {
  OPEN: { label: 'Mới', class: 'badge-info' },
  IN_PROGRESS: { label: 'Đang xử lý', class: 'badge-warning' },
  WAITING: { label: 'Chờ phản hồi', class: 'badge-warning' },
  RESOLVED: { label: 'Đã giải quyết', class: 'badge-success' },
  CLOSED: { label: 'Đã đóng', class: 'badge-neutral' },
};

export const CATEGORIES = {
  HOC_VU: 'Học vụ',
  CONG_TAC_SINH_VIEN: 'Công tác sinh viên',
  TAI_CHINH: 'Tài chính',
  THU_VIEN: 'Thư viện',
  CNTT: 'CNTT',
  CO_SO_VAT_CHAT: 'Cơ sở vật chất',
  KHAC: 'Khác',
};

export const ROLE_LABELS = {
  STUDENT: 'Sinh viên',
  STAFF: 'Nhân viên',
  DEPT_MANAGER: 'Quản lý phòng ban',
  ADMIN: 'Quản trị viên',
};

export const STAFF_ROLES = ['STAFF', 'DEPT_MANAGER', 'ADMIN'];
export const ROLE_OPTIONS = Object.entries(ROLE_LABELS);

export const ROLE_DESCRIPTIONS = {
  STUDENT: 'Tra cứu dịch vụ, nộp hồ sơ và theo dõi kết quả.',
  STAFF: 'Tiếp nhận, xử lý hồ sơ và phản hồi sinh viên.',
  DEPT_MANAGER: 'Điều phối yêu cầu, nhân sự và báo cáo phòng ban.',
  ADMIN: 'Quản trị người dùng, phòng ban, dịch vụ và cấu hình hệ thống.',
};

export function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
