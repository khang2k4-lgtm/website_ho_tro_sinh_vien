import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  KeyRound,
  LockKeyhole,
  MoreHorizontal,
  Pause,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Smartphone,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './AccountDelegationPage.css';

const INITIAL_DELEGATIONS = [
  { code: 'UQ-102', recipient: 'Phạm Thu Hà', title: 'Chuyên viên CTSV', unit: 'Phòng Công tác Chính trị - Sinh viên', scopes: ['Duyệt giấy xác nhận sinh viên', 'Thẩm định hồ sơ học bổng'], start: '2026-10-20', end: '2026-10-30', status: 'active', reason: 'Đi công tác phối hợp xét học bổng.' },
  { code: 'UQ-098', recipient: 'Nguyễn Văn A', title: 'Quầy số 1 - Một cửa', unit: 'Bộ phận Một cửa', scopes: ['Duyệt đơn xin hoãn học', 'Ký xác nhận bảng điểm'], start: '2026-10-15', end: '2026-10-25', status: 'active', reason: 'Hỗ trợ xử lý hồ sơ trong thời gian cao điểm.' },
  { code: 'UQ-085', recipient: 'Đỗ Mai Linh', title: 'Chuyên viên', unit: 'Phòng Đào tạo Đại học', scopes: ['Tiếp nhận & kiểm tra tệp', 'Phân luồng hồ sơ'], start: '2026-09-01', end: '2026-09-15', status: 'expired', reason: 'Ủy quyền xử lý hồ sơ đầu năm học.' },
];

const INITIAL_REMINDERS = [
  { id: 'rem-1', title: 'Hồ sơ mới cần tiếp nhận', detail: 'Thông báo khi có hồ sơ mới thuộc đơn vị.', channel: 'Email', enabled: true },
  { id: 'rem-2', title: 'Hồ sơ quá hạn', detail: 'Nhắc cán bộ khi hồ sơ sắp quá hạn SLA.', channel: 'Email + SMS', enabled: true },
  { id: 'rem-3', title: 'Lịch trực quầy', detail: 'Nhắc lịch trực trước ca làm việc 30 phút.', channel: 'Ứng dụng', enabled: true },
  { id: 'rem-4', title: 'Báo cáo KPI định kỳ', detail: 'Nhắc tổng hợp KPI vào cuối tháng.', channel: 'Email', enabled: false },
];

const STAFF_OPTIONS = [
  { name: 'Phạm Thu Hà', role: 'Chuyên viên CTSV', unit: 'Phòng Công tác Chính trị - Sinh viên' },
  { name: 'Nguyễn Văn A', role: 'Cán bộ Một cửa', unit: 'Bộ phận Một cửa' },
  { name: 'Đỗ Mai Linh', role: 'Chuyên viên đào tạo', unit: 'Phòng Đào tạo Đại học' },
  { name: 'Trần Quốc Tuấn', role: 'Cán bộ học vụ', unit: 'Phòng Đào tạo Đại học' },
  { name: 'Lê Minh Tâm', role: 'Cán bộ tiếp nhận', unit: 'Bộ phận Một cửa' },
];

const SCOPE_OPTIONS = [
  'Duyệt & thẩm định hồ sơ',
  'Ký số CA thay mặt (cần mã PIN xác nhận)',
  'Trả kết quả sinh viên',
];

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getDelegationStatus(delegation) {
  if (delegation.status === 'paused') return { label: 'Đang tạm dừng', className: 'paused' };
  if (delegation.status === 'expired' || delegation.end < '2026-10-22') return { label: 'Hết hạn', className: 'expired' };
  return { label: 'Đang hiệu lực', className: 'active' };
}

function downloadBackup(delegations, reminders) {
  const backup = {
    exportedAt: new Date().toISOString(),
    note: 'Dữ liệu cài đặt mẫu, chỉ dùng minh họa.',
    delegations,
    reminders,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sao-luu-thiet-lap-ca-nhan.json';
  link.click();
  URL.revokeObjectURL(url);
}

export default function AccountDelegationPage() {
  const [delegations, setDelegations] = useState(INITIAL_DELEGATIONS);
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [recipientFilter, setRecipientFilter] = useState('ALL');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [frequency, setFrequency] = useState('2');
  const [delegationForm, setDelegationForm] = useState({
    recipient: '',
    start: '2026-10-22',
    end: '2026-11-05',
    scopes: [SCOPE_OPTIONS[0], SCOPE_OPTIONS[1]],
    reason: '',
  });
  const [editingDelegation, setEditingDelegation] = useState(null);

  const filteredDelegations = useMemo(() => delegations.filter((delegation) => {
    const status = getDelegationStatus(delegation);
    const matchesStatus = statusFilter === 'ALL'
      || (statusFilter === 'ACTIVE' && status.className === 'active')
      || (statusFilter === 'EXPIRED' && status.className === 'expired')
      || (statusFilter === 'PAUSED' && status.className === 'paused');
    const matchesScope = scopeFilter === 'ALL' || delegation.scopes.some((scope) => scope.toLocaleLowerCase('vi').includes(scopeFilter.toLocaleLowerCase('vi')));
    const matchesRecipient = recipientFilter === 'ALL' || delegation.recipient === recipientFilter;
    return matchesStatus && matchesScope && matchesRecipient;
  }), [delegations, recipientFilter, scopeFilter, statusFilter]);

  const activeCount = delegations.filter((delegation) => getDelegationStatus(delegation).className === 'active').length;
  const enabledReminders = reminders.filter((reminder) => reminder.enabled).length;
  const delegationScopes = [...new Set([...SCOPE_OPTIONS, ...delegations.flatMap((delegation) => delegation.scopes)])];

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3500);
  };

  const openNewDelegation = () => {
    setEditingDelegation(null);
    setDelegationForm({
      recipient: '',
      start: '2026-10-22',
      end: '2026-11-05',
      scopes: [SCOPE_OPTIONS[0], SCOPE_OPTIONS[1]],
      reason: '',
    });
    setModal('delegation');
  };

  const openEditDelegation = (delegation) => {
    setEditingDelegation(delegation);
    setDelegationForm({
      recipient: delegation.recipient,
      start: delegation.start,
      end: delegation.end,
      scopes: delegation.scopes,
      reason: delegation.reason,
    });
    setModal('delegation');
  };

  const handleDelegationSubmit = (event) => {
    event.preventDefault();
    if (!delegationForm.recipient || !delegationForm.scopes.length) return;
    const staff = STAFF_OPTIONS.find((item) => item.name === delegationForm.recipient);
    if (!staff) return;

    if (editingDelegation) {
      setDelegations((current) => current.map((item) => item.code === editingDelegation.code
        ? { ...item, ...staff, start: delegationForm.start, end: delegationForm.end, scopes: delegationForm.scopes, reason: delegationForm.reason, status: 'active' }
        : item));
      showToast(`Đã cập nhật bản mô phỏng ${editingDelegation.code}.`);
    } else {
      const code = `UQ-${String(Math.max(...delegations.map((item) => Number(item.code.split('-')[1]))) + 1).padStart(3, '0')}`;
      setDelegations((current) => [{
        code,
        ...staff,
        start: delegationForm.start,
        end: delegationForm.end,
        scopes: delegationForm.scopes,
        status: 'active',
        reason: delegationForm.reason,
      }, ...current]);
      showToast(`Đã tạo bản mô phỏng ${code}; chưa cấp quyền thật.`);
    }
    setModal(null);
  };

  const toggleDelegation = (delegation) => {
    const status = getDelegationStatus(delegation);
    if (status.className === 'expired') {
      setDelegations((current) => current.map((item) => item.code === delegation.code ? { ...item, end: '2026-11-05', status: 'active' } : item));
      showToast(`Đã gia hạn mô phỏng ${delegation.code} đến 05/11/2026.`);
      return;
    }
    setDelegations((current) => current.map((item) => item.code === delegation.code
      ? { ...item, status: item.status === 'paused' ? 'active' : 'paused' }
      : item));
    showToast(`${delegation.status === 'paused' ? 'Đã bật lại' : 'Đã tạm dừng'} bản mô phỏng ${delegation.code}.`);
  };

  const removeDelegation = (delegation) => {
    setDelegations((current) => current.filter((item) => item.code !== delegation.code));
    showToast(`Đã xóa ${delegation.code} khỏi danh sách mô phỏng.`);
  };

  const saveNotificationSettings = () => showToast('Đã lưu cấu hình nhắc việc trên giao diện mẫu.');

  const handleReminderToggle = (id) => {
    setReminders((current) => current.map((reminder) => reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder));
  };

  const focusReminderSettings = () => document.getElementById('reminder-settings')?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <main className="dashboard-page account-delegation-page">
      <header className="account-settings-header">
        <div>
          <Link className="account-settings-back" to="/dashboard"><ArrowLeft size={16} /> Quay lại Dashboard</Link>
          <span className="dashboard-kicker">QUẢN LÝ PHÒNG BAN / CÀI ĐẶT TÀI KHOẢN</span>
          <h1 className="page-title">Thiết lập cá nhân &amp; Quản lý ủy quyền phê duyệt</h1>
          <p className="page-subtitle">Cấu hình thông tin tài khoản, ủy quyền xử lý hồ sơ và quản lý lịch nhắc việc.</p>
        </div>
        <div className="account-settings-quick-actions">
          <button type="button" className="btn btn-primary" onClick={openNewDelegation}><Plus size={16} /> Tạo lượt ủy quyền mới</button>
          <button type="button" className="btn btn-outline" onClick={() => setModal('security')}><ShieldCheck size={16} /> Cấu hình 2FA &amp; bảo mật</button>
          <button type="button" className="btn btn-outline" onClick={focusReminderSettings}><Bell size={16} /> Lịch nhắc việc</button>
        </div>
      </header>

      <div className="account-settings-demo-banner"><CheckCircle2 size={16} /> Danh sách ủy quyền và tùy chọn bảo mật bên dưới là dữ liệu minh họa, không thay đổi quyền truy cập hoặc bảo mật tài khoản thật.</div>

      <section className="account-settings-stats" aria-label="Trạng thái cấu hình">
        <article><span className="account-stat-icon blue"><ShieldCheck size={19} /></span><div><span>Bảo mật 2FA</span><strong>{twoFactorEnabled ? 'Đã xác thực' : 'Chưa bật'}</strong><small>{twoFactorEnabled ? 'Đang bật · ứng dụng xác thực' : 'Tài khoản mẫu'}</small></div></article>
        <article><span className="account-stat-icon purple"><Users size={19} /></span><div><span>Ủy quyền đang bật</span><strong>{activeCount} cán bộ</strong><small>Trong danh sách minh họa</small></div></article>
        <article><span className="account-stat-icon amber"><Clock3 size={19} /></span><div><span>Nhắc nhở công việc</span><strong>{enabledReminders} lịch nhắc</strong><small>Đang hoạt động</small></div></article>
        <article><span className="account-stat-icon green"><CheckCircle2 size={19} /></span><div><span>Tình trạng</span><strong>Ổn định</strong><small>An toàn · dữ liệu mẫu</small></div></article>
      </section>

      <section className="account-delegations-panel">
        <div className="account-panel-heading">
          <div><h2>Danh sách cán bộ được ủy quyền</h2><p>Theo dõi phạm vi và thời hạn của các lượt ủy quyền.</p></div>
          <button type="button" className="btn btn-primary btn-sm" onClick={openNewDelegation}><Plus size={15} /> Tạo ủy quyền</button>
        </div>
        <div className="account-delegation-filters">
          <label><span>Trạng thái</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="ALL">Tất cả trạng thái</option><option value="ACTIVE">Đang hiệu lực</option><option value="PAUSED">Đang tạm dừng</option><option value="EXPIRED">Hết hạn</option></select></label>
          <label><span>Phạm vi</span><select value={scopeFilter} onChange={(event) => setScopeFilter(event.target.value)}><option value="ALL">Tất cả thủ tục</option>{delegationScopes.map((scope) => <option value={scope} key={scope}>{scope}</option>)}</select></label>
          <label><span>Người nhận</span><select value={recipientFilter} onChange={(event) => setRecipientFilter(event.target.value)}><option value="ALL">Tất cả cán bộ</option>{[...new Set(delegations.map((delegation) => delegation.recipient))].map((recipient) => <option value={recipient} key={recipient}>{recipient}</option>)}</select></label>
        </div>
        <div className="account-delegation-table-wrap">
          <table className="account-delegation-table">
            <thead><tr><th>Mã ủy quyền</th><th>Cán bộ nhận ủy quyền</th><th>Phạm vi &amp; dịch vụ ủy quyền</th><th>Thời hạn ủy quyền</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filteredDelegations.map((delegation) => {
                const status = getDelegationStatus(delegation);
                return (
                  <tr key={delegation.code}>
                    <td><strong className="account-delegation-code">{delegation.code}</strong></td>
                    <td><strong>{delegation.recipient}</strong><small>{delegation.title} · {delegation.unit}</small></td>
                    <td><ul>{delegation.scopes.map((scope) => <li key={scope}>{scope}</li>)}</ul></td>
                    <td><strong>{formatDate(delegation.start)} – {formatDate(delegation.end)}</strong><small>{status.className === 'expired' ? 'Đã hoàn tất' : status.className === 'paused' ? 'Đang tạm dừng' : 'Đang công tác'}</small></td>
                    <td><span className={`account-delegation-status ${status.className}`}><i />{status.label}</span></td>
                    <td>
                      <div className="account-delegation-actions">
                        {status.className === 'expired'
                          ? <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleDelegation(delegation)}><RotateCcw size={14} /> Gia hạn</button>
                          : <>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => openEditDelegation(delegation)}><MoreHorizontal size={14} /> Tùy chỉnh</button>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleDelegation(delegation)}>{status.className === 'paused' ? <Check size={14} /> : <Pause size={14} />}{status.className === 'paused' ? 'Bật lại' : 'Tạm dừng'}</button>
                          </>}
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeDelegation(delegation)}><Trash2 size={14} /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDelegations.length === 0 && <tr><td colSpan="6" className="account-settings-empty">Không có lượt ủy quyền phù hợp bộ lọc.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="account-settings-config-grid">
        <article className="account-settings-panel">
          <div className="account-panel-heading"><div><h2><LockKeyhole size={18} /> Bảo mật tài khoản &amp; 2FA</h2><p>Thiết lập bảo mật cho tài khoản cán bộ.</p></div></div>
          <div className="account-security-options">
            <div><span>Xác minh 2 lớp (2FA)</span><strong className={twoFactorEnabled ? 'account-option-on' : 'account-option-off'}>{twoFactorEnabled ? 'Đang bật · App' : 'Đang tắt'}</strong></div>
            <div><span>Đổi mật khẩu định kỳ</span><strong>30 ngày trước</strong></div>
            <div><span>Mã PIN ký số</span><strong className="account-option-on">Đã cài đặt</strong></div>
          </div>
          <div className="account-settings-card-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal('password')}><KeyRound size={15} /> Đổi mật khẩu</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal('security')}><Smartphone size={15} /> Authenticator / 2FA</button>
          </div>
        </article>

        <article className="account-settings-panel" id="reminder-settings">
          <div className="account-panel-heading"><div><h2><Bell size={18} /> Cấu hình thông báo &amp; lịch nhắc</h2><p>Tùy chỉnh các nhắc việc mẫu theo nhu cầu.</p></div></div>
          <div className="account-reminder-list">
            {reminders.map((reminder) => (
              <label key={reminder.id} className="account-reminder-item">
                <span><strong>{reminder.title}</strong><small>{reminder.detail} · {reminder.channel}</small></span>
                <input type="checkbox" checked={reminder.enabled} onChange={() => handleReminderToggle(reminder.id)} aria-label={`${reminder.enabled ? 'Tắt' : 'Bật'} ${reminder.title}`} />
              </label>
            ))}
          </div>
          <label className="account-frequency"><span>Tần suất gửi nhắc tự động</span><select value={frequency} onChange={(event) => setFrequency(event.target.value)}><option value="1">1 lần/ngày</option><option value="2">2 lần/ngày</option><option value="3">3 lần/ngày</option></select></label>
          <div className="account-settings-card-actions"><button type="button" className="btn btn-primary btn-sm" onClick={saveNotificationSettings}><Save size={15} /> Lưu cấu hình thông báo</button></div>
        </article>
      </section>

      <section className="account-settings-history-panel">
        <div className="account-panel-heading"><div><h2>Nhật ký giao việc &amp; ủy quyền</h2><p>Một số hoạt động gần đây trên dữ liệu minh họa.</p></div></div>
        <div className="account-history-list">
          <article><span className="account-history-dot green" /><time>22/10/2026 · 09:15</time><div><strong>Ủy quyền UQ-102 đang hiệu lực</strong><p>Phạm Thu Hà được nhận quyền thẩm định hồ sơ học bổng đến 30/10/2026.</p></div></article>
          <article><span className="account-history-dot blue" /><time>20/10/2026 · 14:30</time><div><strong>Cập nhật lịch nhắc hồ sơ</strong><p>Thiết lập 2 lần nhắc mỗi ngày cho hồ sơ sắp quá hạn.</p></div></article>
          <article><span className="account-history-dot amber" /><time>15/10/2026 · 08:00</time><div><strong>Tạo lượt ủy quyền UQ-098</strong><p>Nguyễn Văn A hỗ trợ tiếp nhận và ký xác nhận hồ sơ trong thời gian cao điểm.</p></div></article>
        </div>
        <div className="account-settings-history-actions"><button type="button" className="btn btn-outline btn-sm" onClick={() => downloadBackup(delegations, reminders)}><Save size={15} /> Tải bản sao lưu cài đặt</button></div>
      </section>

      {toast && <div className="account-settings-toast" role="status"><Check size={17} />{toast}</div>}

      {modal && (
        <div className="account-settings-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <section className="account-settings-modal" role="dialog" aria-modal="true" aria-labelledby="account-modal-title">
            <header>
              <div><span className="dashboard-kicker">{modal === 'delegation' ? 'ỦY QUYỀN PHÊ DUYỆT' : modal === 'password' ? 'BẢO MẬT TÀI KHOẢN' : 'XÁC MINH HAI LỚP'}</span><h2 id="account-modal-title">{modal === 'delegation' ? (editingDelegation ? `Tùy chỉnh ${editingDelegation.code}` : 'Tạo mới ủy quyền thay mặt phê duyệt hồ sơ') : modal === 'password' ? 'Đổi mật khẩu' : 'Cấu hình Authenticator & 2FA'}</h2></div>
              <button type="button" aria-label="Đóng" onClick={() => setModal(null)}><X size={19} /></button>
            </header>

            {modal === 'delegation' ? (
              <form onSubmit={handleDelegationSubmit}>
                <div className="account-settings-modal-body">
                  <div className="account-settings-simulation-note"><ShieldCheck size={16} /> Tạo bản ghi ủy quyền minh họa. Chưa cấp quyền phê duyệt hoặc ký số thật.</div>
                  <label className="account-modal-field"><span>Cán bộ nhận ủy quyền *</span><select required value={delegationForm.recipient} onChange={(event) => setDelegationForm((current) => ({ ...current, recipient: event.target.value }))}><option value="">Chọn cán bộ trong phòng ban / đơn vị</option>{STAFF_OPTIONS.map((staff) => <option key={staff.name} value={staff.name}>{staff.name} - {staff.role} · {staff.unit}</option>)}</select></label>
                  <div className="account-modal-date-row">
                    <label className="account-modal-field"><span>Ủy quyền từ *</span><input required type="date" value={delegationForm.start} onChange={(event) => setDelegationForm((current) => ({ ...current, start: event.target.value }))} /></label>
                    <label className="account-modal-field"><span>Ủy quyền đến *</span><input required type="date" min={delegationForm.start} value={delegationForm.end} onChange={(event) => setDelegationForm((current) => ({ ...current, end: event.target.value }))} /></label>
                  </div>
                  <fieldset className="account-modal-scopes"><legend>Phạm vi quyền hạn *</legend>{SCOPE_OPTIONS.map((scope) => <label key={scope}><input type="checkbox" checked={delegationForm.scopes.includes(scope)} onChange={(event) => setDelegationForm((current) => ({ ...current, scopes: event.target.checked ? [...current.scopes, scope] : current.scopes.filter((item) => item !== scope) }))} />{scope}</label>)}</fieldset>
                  <label className="account-modal-field"><span>Lý do ủy quyền</span><textarea rows={3} value={delegationForm.reason} onChange={(event) => setDelegationForm((current) => ({ ...current, reason: event.target.value }))} placeholder="Ví dụ: đi công tác, nghỉ phép, hỗ trợ xử lý cao điểm..." /></label>
                </div>
                <footer><button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Hủy bỏ</button><button type="submit" className="btn btn-primary"><CheckCircle2 size={16} /> Xác nhận ủy quyền</button></footer>
              </form>
            ) : modal === 'security' ? (
              <div className="account-settings-modal-body">
                <div className="account-settings-simulation-note"><ShieldCheck size={16} /> Cài đặt 2FA thật chưa được kết nối; thao tác này chỉ đổi trạng thái minh họa.</div>
                <div className="account-security-modal-status"><Smartphone size={24} /><div><strong>Ứng dụng xác thực</strong><span>{twoFactorEnabled ? 'Đang bật cho tài khoản mẫu' : 'Đang tắt cho tài khoản mẫu'}</span></div></div>
                <p className="account-settings-modal-description">Khi tích hợp xác thực thật, cần quét mã QR bằng ứng dụng Authenticator và xác nhận mã dùng một lần trước khi bật 2FA.</p>
                <button type="button" className={`btn ${twoFactorEnabled ? 'btn-outline' : 'btn-primary'}`} onClick={() => { setTwoFactorEnabled((current) => !current); setModal(null); showToast('Đã đổi trạng thái 2FA minh họa.'); }}>{twoFactorEnabled ? 'Tắt 2FA mẫu' : 'Bật 2FA mẫu'}</button>
              </div>
            ) : (
              <div className="account-settings-modal-body">
                <div className="account-settings-simulation-note"><LockKeyhole size={16} /> Đổi mật khẩu thật cần được kết nối API xác thực trước khi triển khai.</div>
                <label className="account-modal-field"><span>Mật khẩu hiện tại</span><input type="password" autoComplete="current-password" /></label>
                <label className="account-modal-field"><span>Mật khẩu mới</span><input type="password" autoComplete="new-password" minLength={8} /></label>
                <label className="account-modal-field"><span>Xác nhận mật khẩu mới</span><input type="password" autoComplete="new-password" minLength={8} /></label>
                <p className="account-settings-modal-description">Biểu mẫu mật khẩu đang ở chế độ minh họa và không lưu bất kỳ thông tin nào.</p>
              </div>
            )}

            {modal !== 'delegation' && (
              <footer><button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Đóng</button>{modal === 'password' && <button type="button" className="btn btn-primary" onClick={() => { setModal(null); showToast('Chưa kết nối API đổi mật khẩu; không có thay đổi nào được lưu.'); }}><KeyRound size={16} /> Kiểm tra bảo mật</button>}</footer>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
