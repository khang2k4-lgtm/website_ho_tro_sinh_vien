import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  Mail,
  MessageSquareText,
  Phone,
  Search,
  Send,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './ReminderListPage.css';

const INITIAL_REMINDERS = [
  { id: 'rem-2088', code: 'HS-2088', student: 'Trần Văn Bảo', studentId: '21190042', className: 'DH21KHM01', email: 'bao.tv21190042@humg.edu.vn', phone: '0912345681', service: 'Cấp lại thẻ sinh viên', request: 'Bổ sung file scan CCCD mặt sau', reason: 'Tệp gửi trước đó bị mờ, mất góc.', waitingHours: 48, lastReminder: '20/10/2026', reminderCount: 1, needsReminder: true },
  { id: 'rem-2075', code: 'HS-2075', student: 'Nguyễn Thị Ánh', studentId: '20190112', className: 'DH20KT01', email: 'anh.nt20190112@humg.edu.vn', phone: '0987654321', service: 'Xác nhận tạm trú', request: 'Bổ sung giấy xác nhận tạm trú bản gốc', reason: 'Bản xác nhận cần có dấu đỏ của địa phương.', waitingHours: 76, lastReminder: '18/10/2026', reminderCount: 2, needsReminder: true },
  { id: 'rem-2090', code: 'HS-2090', student: 'Lê Hoàng Long', studentId: '22190015', className: 'DH22KHM02', email: 'long.lh22190015@humg.edu.vn', phone: '0901234567', service: 'Cấp giấy xác nhận sinh viên', request: 'Cập nhật ảnh 3x4 đúng chuẩn', reason: 'Ảnh cần phông nền trắng, chụp rõ mặt.', waitingHours: 12, lastReminder: '', reminderCount: 0, needsReminder: true },
  { id: 'rem-2069', code: 'HS-2069', student: 'Phạm Thu Hà', studentId: '21190108', className: 'DH21KT02', email: 'ha.pt21190108@humg.edu.vn', phone: '0934567890', service: 'Hỗ trợ học bổng', request: 'Bổ sung bảng điểm học kỳ gần nhất', reason: 'Chưa có xác nhận của phòng Đào tạo.', waitingHours: 31, lastReminder: '21/10/2026', reminderCount: 1 },
  { id: 'rem-2063', code: 'HS-2063', student: 'Đỗ Minh Quân', studentId: '20190086', className: 'DH20DC01', email: 'quan.dm20190086@humg.edu.vn', phone: '0918765432', service: 'Miễn giảm học phí', request: 'Bổ sung giấy chứng nhận hộ nghèo', reason: 'Giấy chứng nhận đã hết hạn.', waitingHours: 94, lastReminder: '17/10/2026', reminderCount: 2, needsReminder: true },
  { id: 'rem-2101', code: 'HS-2101', student: 'Vũ Ngọc Mai', studentId: '23190027', className: 'DH23KHM01', email: 'mai.vn23190027@humg.edu.vn', phone: '0971234560', service: 'Xác nhận sinh viên', request: 'Điền đủ thông tin người nhận giấy', reason: 'Thiếu địa chỉ và số điện thoại liên hệ.', waitingHours: 8, lastReminder: '', reminderCount: 0 },
  { id: 'rem-2058', code: 'HS-2058', student: 'Bùi Đức Anh', studentId: '21190076', className: 'DH21DC02', email: 'anh.bd21190076@humg.edu.vn', phone: '0962345671', service: 'Cấp lại thẻ sinh viên', request: 'Bổ sung biên lai nộp lệ phí', reason: 'Chưa nhận được minh chứng thanh toán.', waitingHours: 53, lastReminder: '20/10/2026', reminderCount: 1, needsReminder: true },
  { id: 'rem-2047', code: 'HS-2047', student: 'Hoàng Thị Lan', studentId: '20190145', className: 'DH20KT03', email: 'lan.ht20190145@humg.edu.vn', phone: '0943456789', service: 'Xác nhận vay vốn', request: 'Bổ sung xác nhận của địa phương', reason: 'Thiếu chữ ký xác nhận của UBND phường.', waitingHours: 69, lastReminder: '18/10/2026', reminderCount: 2, needsReminder: true },
  { id: 'rem-2104', code: 'HS-2104', student: 'Nguyễn Hữu Khang', studentId: '22190109', className: 'DH22KT01', email: 'khang.nh22190109@humg.edu.vn', phone: '0917123456', service: 'Bảo lưu kết quả học tập', request: 'Bổ sung đơn xin bảo lưu có chữ ký', reason: 'Đơn tải lên chưa có chữ ký sinh viên.', waitingHours: 27, lastReminder: '21/10/2026', reminderCount: 1 },
  { id: 'rem-2111', code: 'HS-2111', student: 'Vũ Thị Hà', studentId: '23190031', className: 'DH23KT02', email: 'ha.vt23190031@humg.edu.vn', phone: '0981122334', service: 'Cấp lại thẻ sinh viên', request: 'Bổ sung ảnh chân dung mới', reason: 'Ảnh cũ không đúng kích thước yêu cầu.', waitingHours: 19, lastReminder: '21/10/2026', reminderCount: 1 },
  { id: 'rem-2120', code: 'HS-2120', student: 'Lê Văn Toàn', studentId: '20190054', className: 'DH20KHM01', email: 'toan.lv20190054@humg.edu.vn', phone: '0909988776', service: 'Đăng ký học phần', request: 'Xác nhận lại danh sách học phần', reason: 'Có học phần bị trùng lịch học.', waitingHours: 105, lastReminder: '16/10/2026', reminderCount: 3, needsReminder: true },
  { id: 'rem-2130', code: 'HS-2130', student: 'Trần Minh Thu', studentId: '22190073', className: 'DH22KT03', email: 'thu.tm22190073@humg.edu.vn', phone: '0931122445', service: 'Học bổng khuyến khích học tập', request: 'Bổ sung chứng nhận hoạt động ngoại khóa', reason: 'Tài liệu đính kèm chưa có xác nhận của đơn vị.', waitingHours: 40, lastReminder: '20/10/2026', reminderCount: 1 },
  { id: 'rem-2134', code: 'HS-2134', student: 'Đặng Quốc Huy', studentId: '21190023', className: 'DH21DC01', email: 'huy.dq21190023@humg.edu.vn', phone: '0905566778', service: 'Xác nhận sinh viên', request: 'Cập nhật số căn cước công dân', reason: 'Thông tin kê khai không khớp dữ liệu hồ sơ.', waitingHours: 68, lastReminder: '19/10/2026', reminderCount: 2 },
  { id: 'rem-2138', code: 'HS-2138', student: 'Mai Khánh Linh', studentId: '23190064', className: 'DH23KHM02', email: 'linh.mk23190064@humg.edu.vn', phone: '0977788990', service: 'Hỗ trợ vay vốn', request: 'Bổ sung bản sao sổ hộ khẩu', reason: 'Thiếu trang thông tin chủ hộ.', waitingHours: 16, lastReminder: '', reminderCount: 0, needsReminder: true },
];

const INITIAL_NOTE = 'Thân gửi sinh viên {{name}} (MSSV: {{studentId}}), Phòng Công tác Chính trị - Sinh viên thông báo hồ sơ #{{code}} của bạn cần bổ sung: "{{request}}". {{reason}} Vui lòng truy cập HUMG Portal và cập nhật hồ sơ sớm. Xin cảm ơn.';

function getReminderStatus(record) {
  if (record.waitingHours >= 72) return { label: 'Quá 72 giờ', className: 'urgent' };
  if (record.reminderCount === 0) return { label: 'Mới yêu cầu', className: 'new' };
  return { label: 'Cần nhắc', className: 'pending' };
}

function formatWaiting(hours) {
  if (hours < 24) return `${hours} giờ`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours ? `${days} ngày ${remainingHours} giờ` : `${days} ngày`;
}

function makeMessage(record, template = 'standard') {
  const note = record
    ? INITIAL_NOTE
      .replaceAll('{{name}}', record.student)
      .replaceAll('{{studentId}}', record.studentId)
      .replaceAll('{{code}}', record.code)
      .replaceAll('{{request}}', record.request)
      .replaceAll('{{reason}}', record.reason)
    : INITIAL_NOTE;
  if (template === 'urgent') return `${note} Đây là hồ sơ quá hạn, mong bạn ưu tiên cập nhật trong hôm nay.`;
  if (template === 'followup') return `${note} Đây là lời nhắc tiếp theo về hồ sơ đang chờ bổ sung của bạn.`;
  return note;
}

export default function ReminderListPage() {
  const [records, setRecords] = useState(INITIAL_REMINDERS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [waitingFilter, setWaitingFilter] = useState('ALL');
  const [attemptFilter, setAttemptFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);
  const [modal, setModal] = useState(null);
  const [channels, setChannels] = useState({ app: true, email: true, sms: false });
  const [template, setTemplate] = useState('standard');
  const [message, setMessage] = useState('');
  const [noteText, setNoteText] = useState('');
  const [toast, setToast] = useState('');

  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi');
    return records.filter((record) => {
      const matchesQuery = !normalizedQuery
        || `${record.code} ${record.studentId} ${record.student} ${record.className}`.toLocaleLowerCase('vi').includes(normalizedQuery);
      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'OVERDUE' && record.waitingHours >= 72)
        || (statusFilter === 'NEW' && record.reminderCount === 0)
        || (statusFilter === 'REMIND' && record.reminderCount > 0 && record.waitingHours < 72);
      const matchesWaiting = waitingFilter === 'ALL'
        || (waitingFilter === 'UNDER24' && record.waitingHours < 24)
        || (waitingFilter === '24TO72' && record.waitingHours >= 24 && record.waitingHours < 72)
        || (waitingFilter === 'OVER72' && record.waitingHours >= 72);
      const matchesAttempts = attemptFilter === 'ALL'
        || (attemptFilter === 'NONE' && record.reminderCount === 0)
        || (attemptFilter === 'ONCE' && record.reminderCount === 1)
        || (attemptFilter === 'TWOPLUS' && record.reminderCount >= 2);
      return matchesQuery && matchesStatus && matchesWaiting && matchesAttempts;
    });
  }, [attemptFilter, query, records, statusFilter, waitingFilter]);

  const selectedRecords = records.filter((record) => selectedIds.includes(record.id));
  const pendingReminders = records.filter((record) => record.needsReminder);

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3500);
  };

  const openReminder = (targets, selectedChannels = { app: true, email: true, sms: false }) => {
    const targetRecords = typeof targets === 'string'
      ? records.filter((record) => record.id === targets)
      : targets;
    if (!targetRecords.length) return;
    const first = targetRecords[0];
    setModal({ type: 'reminder', ids: targetRecords.map((record) => record.id), title: first.code });
    setChannels(selectedChannels);
    setTemplate(first.reminderCount === 0 ? 'first' : 'followup');
    setMessage(makeMessage(targetRecords.length === 1 ? first : null, first.reminderCount === 0 ? 'first' : 'followup'));
  };

  const sendReminder = () => {
    const enabledChannels = Object.values(channels).some(Boolean);
    if (!enabledChannels) {
      showToast('Chọn ít nhất một kênh gửi thông báo.');
      return;
    }
    const targetIds = new Set(modal.ids);
    const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    setRecords((current) => current.map((record) => (
      targetIds.has(record.id)
        ? { ...record, reminderCount: record.reminderCount + 1, lastReminder: today, needsReminder: false }
        : record
    )));
    setSelectedIds((current) => current.filter((id) => !targetIds.has(id)));
    setModal(null);
    showToast(`Đã mô phỏng gửi nhắc ${targetIds.size} hồ sơ. Không gửi email/SMS thật.`);
  };

  const openNote = (targets) => {
    const targetRecords = typeof targets === 'string'
      ? records.filter((record) => record.id === targets)
      : targets;
    if (!targetRecords.length) return;
    setModal({ type: 'note', ids: targetRecords.map((record) => record.id) });
    setNoteText('');
  };

  const saveNote = () => {
    if (!noteText.trim()) return;
    setRecords((current) => current.map((record) => (
      modal.ids.includes(record.id) ? { ...record, internalNote: noteText.trim() } : record
    )));
    setModal(null);
    showToast(`Đã lưu ghi chú cho ${modal.ids.length} hồ sơ.`);
  };

  const exportList = () => {
    const rows = [
      ['Mã hồ sơ', 'Sinh viên', 'MSSV', 'Lớp', 'Dịch vụ', 'Nội dung cần bổ sung', 'Thời gian chờ', 'Nhắc cuối', 'Số lần nhắc', 'Trạng thái'],
      ...filteredRecords.map((record) => [
        record.code,
        record.student,
        record.studentId,
        record.className,
        record.service,
        `${record.request} - ${record.reason}`,
        formatWaiting(record.waitingHours),
        record.lastReminder || 'Chưa gửi',
        record.reminderCount,
        getReminderStatus(record).label,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'danh-sach-ho-so-can-nhac.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleAll = () => {
    const visibleIds = filteredRecords.map((record) => record.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) => allVisibleSelected
      ? current.filter((id) => !visibleIds.includes(id))
      : [...new Set([...current, ...visibleIds])]);
  };

  return (
    <main className="dashboard-page reminder-page">
      <header className="reminder-page-header">
        <div className="reminder-heading">
          <Link className="reminder-back-link" to="/dashboard/ho-so-cho-sv-bo-sung">
            <ArrowLeft size={16} /> Quay lại Hồ sơ chờ bổ sung
          </Link>
          <span className="dashboard-kicker">QUẢN LÝ HỒ SƠ &amp; THỦ TỤC / HỒ SƠ CHỜ SV BỔ SUNG</span>
          <h1 className="page-title">Danh sách hồ sơ cần nhắc sinh viên</h1>
          <p className="page-subtitle">Theo dõi thời gian chờ bổ sung giấy tờ, gửi đôn đốc và xử lý các hồ sơ quá hạn.</p>
        </div>
        <div className="reminder-header-actions">
          <label className="reminder-search">
            <Search size={17} />
            <input
              aria-label="Tìm mã hồ sơ, MSSV hoặc tên sinh viên"
              placeholder="Tìm mã HS, MSSV, tên SV..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <button type="button" className="btn btn-outline" onClick={exportList}><Download size={16} /> Xuất danh sách</button>
          <button type="button" className="btn btn-primary" onClick={() => openReminder(pendingReminders)}>
            <Bell size={16} /> Nhắc tất cả cần gửi ({pendingReminders.length})
          </button>
        </div>
      </header>

      <section className="reminder-stats" aria-label="Thống kê hồ sơ bổ sung">
        <article className="reminder-stat-card">
          <span className="reminder-stat-icon waiting"><Clock3 size={19} /></span>
          <div><span>Chờ SV bổ sung</span><strong>14 <small>hồ sơ</small></strong></div>
        </article>
        <article className="reminder-stat-card">
          <span className="reminder-stat-icon sent"><Bell size={19} /></span>
          <div><span>Đã gửi nhắc (24h)</span><strong>8 <small>hồ sơ</small></strong></div>
        </article>
        <article className="reminder-stat-card">
          <span className="reminder-stat-icon overdue"><Clock3 size={19} /></span>
          <div><span>Quá 72h chưa sửa</span><strong>3 <small>khẩn cấp</small></strong></div>
        </article>
        <article className="reminder-stat-card">
          <span className="reminder-stat-icon completed"><CheckCircle2 size={19} /></span>
          <div><span>Đã bổ sung hoàn tất</span><strong>7 <small>hồ sơ</small></strong></div>
        </article>
      </section>

      <section className="reminder-list-panel">
        <div className="reminder-filter-row">
          <label>
            <span>Trạng thái</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">Tất cả</option>
              <option value="NEW">Mới yêu cầu</option>
              <option value="REMIND">Cần nhắc</option>
              <option value="OVERDUE">Quá 72 giờ</option>
            </select>
          </label>
          <label>
            <span>Thời gian chờ</span>
            <select value={waitingFilter} onChange={(event) => setWaitingFilter(event.target.value)}>
              <option value="ALL">Tất cả</option>
              <option value="UNDER24">Dưới 24 giờ</option>
              <option value="24TO72">24–72 giờ</option>
              <option value="OVER72">Trên 72 giờ</option>
            </select>
          </label>
          <label>
            <span>Lần gửi nhắc</span>
            <select value={attemptFilter} onChange={(event) => setAttemptFilter(event.target.value)}>
              <option value="ALL">Tất cả</option>
              <option value="NONE">Chưa nhắc</option>
              <option value="ONCE">1 lần</option>
              <option value="TWOPLUS">Từ 2 lần</option>
            </select>
          </label>
        </div>

        <div className="reminder-batch-row">
          <label className="reminder-select-all">
            <input
              type="checkbox"
              checked={filteredRecords.length > 0 && filteredRecords.every((record) => selectedIds.includes(record.id))}
              onChange={toggleAll}
            />
            Chọn tất cả ({filteredRecords.length})
          </label>
          <span className="reminder-selected-count">{selectedIds.length ? `Đã chọn ${selectedIds.length} hồ sơ` : 'Chọn hồ sơ để thao tác hàng loạt'}</span>
          <div className="reminder-batch-actions">
            <button type="button" className="btn btn-outline btn-sm" disabled={!selectedRecords.length} onClick={() => openReminder(selectedRecords, { app: false, email: true, sms: false })}>
              <Mail size={15} /> Gửi Email đôn đốc
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={!selectedRecords.length}
              onClick={() => openReminder(selectedRecords, { app: false, email: false, sms: true })}
            >
              <Phone size={15} /> Gửi SMS
            </button>
            <button type="button" className="btn btn-outline btn-sm" disabled={!selectedRecords.length} onClick={() => openNote(selectedRecords)}>
              <FileText size={15} /> Ghi chú
            </button>
          </div>
        </div>

        <div className="reminder-table-wrap">
          <table className="reminder-table">
            <thead>
              <tr>
                <th aria-label="Chọn hồ sơ" />
                <th>Mã hồ sơ</th>
                <th>Sinh viên &amp; lớp</th>
                <th>Nội dung yêu cầu bổ sung</th>
                <th>Thời gian chờ</th>
                <th>Nhắc cuối</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const status = getReminderStatus(record);
                return (
                  <tr key={record.id} className={status.className === 'urgent' ? 'is-overdue' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Chọn hồ sơ ${record.code}`}
                        checked={selectedIds.includes(record.id)}
                        onChange={() => setSelectedIds((current) => current.includes(record.id)
                          ? current.filter((id) => id !== record.id)
                          : [...current, record.id])}
                      />
                    </td>
                    <td><strong className="reminder-code">{record.code}</strong><small>{record.service}</small></td>
                    <td><strong>{record.student}</strong><small>MSSV: {record.studentId} · {record.className}</small></td>
                    <td><strong>{record.request}</strong><small>{record.reason}</small>{record.internalNote && <small className="reminder-internal-note">Ghi chú: {record.internalNote}</small>}</td>
                    <td><strong className={record.waitingHours >= 72 ? 'reminder-time-danger' : ''}>{formatWaiting(record.waitingHours)}</strong>{record.waitingHours >= 72 && <small className="reminder-overdue-caption">Cần xử lý gấp</small>}</td>
                    <td>{record.lastReminder ? <><strong>{record.lastReminder}</strong><small>Lần {record.reminderCount}</small></> : <span className="reminder-never-sent">Chưa gửi</span>}</td>
                    <td><span className={`reminder-status ${status.className}`}><i />{status.label}</span></td>
                    <td>
                      <div className="reminder-row-actions">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => openReminder(record.id)}>
                          <Bell size={14} /> {status.className === 'urgent' ? 'Nhắc gấp' : 'Gửi nhắc'}
                        </button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal({ type: 'detail', ids: [record.id] })}>
                          <Eye size={14} /> Chi tiết
                        </button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => openNote(record.id)}>
                          <FileText size={14} /> Ghi chú
                        </button>
                        {status.className === 'urgent' && (
                          <button type="button" className="btn btn-outline btn-sm" onClick={() => showToast(`Liên hệ ${record.student}: ${record.phone}`)}>
                            <Phone size={14} /> Liên hệ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr><td className="reminder-empty" colSpan="8">Không tìm thấy hồ sơ phù hợp với bộ lọc.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="reminder-table-footer">Đang hiển thị {filteredRecords.length} trên {records.length} hồ sơ chờ bổ sung.</div>
      </section>

      {toast && <div className="reminder-toast" role="status"><Check size={17} />{toast}</div>}

      {modal && (
        <div className="reminder-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <section className="reminder-modal" role="dialog" aria-modal="true" aria-labelledby="reminder-modal-title">
            <header className="reminder-modal-header">
              <div>
                <span className="dashboard-kicker">{modal.type === 'reminder' ? 'ĐÔN ĐỐC HỒ SƠ BỔ SUNG' : modal.type === 'note' ? 'GHI CHÚ NỘI BỘ' : 'CHI TIẾT HỒ SƠ'}</span>
                <h2 id="reminder-modal-title">
                  {modal.type === 'reminder'
                    ? `Gửi nhắc ${modal.ids.length > 1 ? `${modal.ids.length} sinh viên` : `hồ sơ #${modal.title}`}`
                    : modal.type === 'note'
                      ? `Ghi chú ${modal.ids.length > 1 ? `${modal.ids.length} hồ sơ` : `hồ sơ #${records.find((record) => record.id === modal.ids[0])?.code}`}`
                      : `Hồ sơ #${records.find((record) => record.id === modal.ids[0])?.code}`}
                </h2>
              </div>
              <button type="button" className="reminder-modal-close" aria-label="Đóng" onClick={() => setModal(null)}><X size={19} /></button>
            </header>

            {modal.type === 'reminder' ? (
              <div className="reminder-modal-body">
                <div className="reminder-simulation-note"><MessageSquareText size={16} /> Đây là thao tác mô phỏng trên dữ liệu mẫu; không gửi thông báo thật.</div>
                <fieldset className="reminder-channel-group">
                  <legend>Kênh gửi thông báo</legend>
                  {[
                    ['app', 'Thông báo HUMG Portal'],
                    ['email', 'Email sinh viên'],
                    ['sms', 'Tin nhắn SMS'],
                  ].map(([key, label]) => (
                    <label key={key}>
                      <input type="checkbox" checked={channels[key]} onChange={(event) => setChannels((current) => ({ ...current, [key]: event.target.checked }))} />
                      {label}
                    </label>
                  ))}
                </fieldset>
                <label className="reminder-modal-field">
                  <span>Mẫu tin nhắn</span>
                  <select
                    value={template}
                    onChange={(event) => {
                      setTemplate(event.target.value);
                      const record = records.find((item) => item.id === modal.ids[0]);
                      setMessage(makeMessage(modal.ids.length === 1 ? record : null, event.target.value));
                    }}
                  >
                    <option value="first">Mẫu 1: Nhắc bổ sung lần đầu</option>
                    <option value="followup">Mẫu 2: Nhắc bổ sung tiếp theo</option>
                    <option value="urgent">Mẫu 3: Đôn đốc hồ sơ quá hạn</option>
                  </select>
                </label>
                <label className="reminder-modal-field">
                  <span>Nội dung gửi sinh viên</span>
                  <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={6} />
                </label>
                <p className="reminder-modal-footnote">Với thao tác hàng loạt, các nội dung trong dấu ngoặc nhọn sẽ được thay bằng dữ liệu tương ứng của từng sinh viên. Mọi thao tác hiện chỉ mô phỏng trên dữ liệu mẫu.</p>
              </div>
            ) : modal.type === 'note' ? (
              <div className="reminder-modal-body">
                <p className="reminder-modal-description">Ghi chú chỉ hiển thị trong danh sách quản lý nội bộ.</p>
                <label className="reminder-modal-field">
                  <span>Nội dung ghi chú</span>
                  <textarea value={noteText} onChange={(event) => setNoteText(event.target.value)} rows={5} placeholder="Nhập ghi chú cần lưu..." autoFocus />
                </label>
              </div>
            ) : (() => {
              const record = records.find((item) => item.id === modal.ids[0]);
              if (!record) return null;
              const status = getReminderStatus(record);
              return (
                <div className="reminder-modal-body reminder-detail-body">
                  <dl>
                    <div><dt>Sinh viên</dt><dd>{record.student} · MSSV {record.studentId} · {record.className}</dd></div>
                    <div><dt>Liên hệ</dt><dd>{record.email} · {record.phone}</dd></div>
                    <div><dt>Dịch vụ</dt><dd>{record.service}</dd></div>
                    <div><dt>Cần bổ sung</dt><dd>{record.request}. {record.reason}</dd></div>
                    <div><dt>Thời gian chờ</dt><dd>{formatWaiting(record.waitingHours)} · {status.label}</dd></div>
                    <div><dt>Nhắc cuối</dt><dd>{record.lastReminder || 'Chưa gửi'} · {record.reminderCount} lần</dd></div>
                    {record.internalNote && <div><dt>Ghi chú nội bộ</dt><dd>{record.internalNote}</dd></div>}
                  </dl>
                </div>
              );
            })()}

            <footer className="reminder-modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Hủy bỏ</button>
              {modal.type === 'reminder' ? (
                <button type="button" className="btn btn-primary" onClick={sendReminder}><Send size={16} /> Gửi thông báo ngay</button>
              ) : modal.type === 'note' ? (
                <button type="button" className="btn btn-primary" disabled={!noteText.trim()} onClick={saveNote}><CheckCircle2 size={16} /> Lưu ghi chú</button>
              ) : (
                <>
                  <button type="button" className="btn btn-outline" onClick={() => openNote(modal.ids[0])}><FileText size={16} /> Ghi chú</button>
                  <button type="button" className="btn btn-primary" onClick={() => openReminder(modal.ids[0])}><Bell size={16} /> Gửi nhắc</button>
                </>
              )}
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
