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
  STAFF_CARE: 'Chăm sóc SV',
  DEPT_MANAGER: 'Quản lý phòng',
  ADMIN: 'Admin',
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
