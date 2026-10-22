import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownToLine, Check, CheckCircle2, CircleHelp,
  Clock3, Cpu, Database, HardDrive, Plus, RefreshCw, Save, Search,
  ShieldCheck, Sparkles, Users, Wrench, X,
} from 'lucide-react';
import './AdminSystemPages.css';

const DEMO_NOTE = 'Giao diện minh họa — dữ liệu và thao tác chưa kết nối API quản trị.';

const pendingAccounts = [
  { id: 'user-1', name: 'Nguyễn Minh Anh', email: 'minhanh@example.edu.vn', role: 'Cán bộ Một cửa', type: 'Cán bộ', registered: '08:30 hôm nay', verified: true },
  { id: 'user-2', name: 'Trần Ngọc Hà', email: 'ngocha@example.edu.vn', role: 'Cán bộ Phòng CTSV', type: 'Cán bộ', registered: '08:15 hôm nay', verified: true },
  { id: 'user-3', name: 'Lê Hoàng Nam', email: 'hoangnam@example.edu.vn', role: 'Sinh viên · Khóa 67', type: 'Sinh viên', registered: '07:45 hôm nay', verified: false },
  { id: 'user-4', name: 'Phạm Thu Trang', email: 'thutrang@example.edu.vn', role: 'Sinh viên · Khóa 68', type: 'Sinh viên', registered: '07:20 hôm nay', verified: true },
  { id: 'user-5', name: 'Đỗ Quốc Bảo', email: 'quocbao@example.edu.vn', role: 'Cán bộ Phòng Đào tạo', type: 'Cán bộ', registered: 'Hôm qua', verified: true },
  { id: 'user-6', name: 'Vũ Khánh Linh', email: 'khanhlinh@example.edu.vn', role: 'Sinh viên · Khóa 66', type: 'Sinh viên', registered: 'Hôm qua', verified: false },
  { id: 'user-7', name: 'Bùi Đức Long', email: 'duclong@example.edu.vn', role: 'Sinh viên · Khóa 67', type: 'Sinh viên', registered: 'Hôm qua', verified: true },
];

const chartPoints = [
  { time: '00:00', value: 22 }, { time: '02:00', value: 14 }, { time: '04:00', value: 18 },
  { time: '06:00', value: 29 }, { time: '08:00', value: 55 }, { time: '10:00', value: 72 },
  { time: '12:00', value: 64 }, { time: '14:00', value: 81 }, { time: '16:00', value: 68 },
  { time: '18:00', value: 52 }, { time: '20:00', value: 38 }, { time: '22:00', value: 27 },
];

function PageHeader({ kicker, title, subtitle, action }) {
  return (
    <header className="admin-page-header">
      <div>
        <span className="dashboard-kicker">{kicker}</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

function DemoNotice() {
  return <div className="admin-demo-note"><CircleHelp size={16} />{DEMO_NOTE}</div>;
}

function ActionMessage({ children, onClose }) {
  if (!children) return null;
  return (
    <div className="admin-action-message" role="status">
      <span>{children}</span>
      <button type="button" aria-label="Đóng thông báo" onClick={onClose}><X size={15} /></button>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone = 'blue' }) {
  return (
    <article className="admin-metric-card">
      <div className={`admin-metric-icon ${tone}`}><Icon size={19} /></div>
      <div className="admin-metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

export function AdminOverviewPage() {
  const [updatedAt, setUpdatedAt] = useState('10:20:15');
  const [message, setMessage] = useState('');
  const health = [
    ['Cổng dịch vụ sinh viên', 'Hoạt động', '100%', 'ok'],
    ['API Server', 'Hoạt động', '99,98%', 'ok'],
    ['Cơ sở dữ liệu', 'Hoạt động', '100%', 'ok'],
    ['Cổng thanh toán', 'Hoạt động', '100%', 'ok'],
    ['Dịch vụ Mail & SMS', 'Hoạt động', '100%', 'ok'],
  ];

  const downloadReport = () => {
    const rows = [['Chỉ số', 'Giá trị'], ['CPU', '18%'], ['RAM', '4.2 / 16 GB'], ['Lưu trữ', '128 / 500 GB'], ['Latency', '24 ms']];
    const content = `\uFEFF${rows.map((row) => row.join(',')).join('\n')}`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-overview-demo.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="dashboard-page admin-system-page">
      <PageHeader
        kicker="QUẢN TRỊ HỆ THỐNG"
        title="Tổng quan hệ thống"
        subtitle="Theo dõi trạng thái vận hành và các dịch vụ đang kết nối."
        action={<div className="admin-header-actions">
          <button className="btn btn-outline" type="button" onClick={() => { setUpdatedAt(new Date().toLocaleTimeString('vi-VN')); setMessage('Đã làm mới thời điểm xem; số liệu hiện là dữ liệu minh họa.'); }}><RefreshCw size={16} /> Làm mới</button>
          <button className="btn btn-primary" type="button" onClick={downloadReport}><ArrowDownToLine size={16} /> Xuất báo cáo</button>
        </div>}
      />
      <DemoNotice />
      <div className="admin-section-heading">
        <div><h2>Chỉ số vận hành máy chủ</h2><p>Cập nhật gần nhất: {updatedAt}</p></div>
        <span className="admin-live-tag"><span /> Mẫu dữ liệu</span>
      </div>
      <section className="admin-metric-grid">
        <MetricCard icon={Cpu} label="CPU Usage" value="18%" detail="Bình thường" tone="blue" />
        <MetricCard icon={Activity} label="RAM Usage" value="4.2 / 16 GB" detail="Đang sử dụng 26%" tone="purple" />
        <MetricCard icon={HardDrive} label="Bộ nhớ lưu trữ" value="128 / 500 GB" detail="Đang sử dụng 25%" tone="cyan" />
        <MetricCard icon={Clock3} label="Latency" value="24 ms" detail="Phản hồi ổn định" tone="green" />
      </section>
      <section className="admin-health-panel admin-panel">
        <div className="admin-section-heading"><div><h2>Trạng thái các phân hệ</h2><p>Tình trạng kết nối dịch vụ trên hệ thống.</p></div><ShieldCheck size={21} className="admin-heading-icon" /></div>
        <div className="admin-health-list">
          {health.map(([name, status, uptime, tone]) => (
            <div className="admin-health-row" key={name}>
              <span className={`admin-health-dot ${tone}`} />
              <strong>{name}</strong>
              <span className="admin-health-status"><CheckCircle2 size={15} />{status}</span>
              <span className="admin-health-uptime">{uptime}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="admin-panel admin-chart-panel">
        <div className="admin-section-heading"><div><h2>Lưu lượng truy cập</h2><p>Người dùng đồng thời trong 24 giờ qua · dữ liệu minh họa</p></div><span className="admin-chart-legend"><i /> Người dùng</span></div>
        <div className="admin-chart" role="img" aria-label="Biểu đồ minh họa lưu lượng người dùng trong 24 giờ">
          <div className="admin-chart-axis">{[100, 75, 50, 25, 0].map((tick) => <span key={tick}>{tick}</span>)}</div>
          <div className="admin-chart-area">
            {[0, 1, 2, 3].map((line) => <div className="admin-chart-gridline" key={line} />)}
            <svg viewBox="0 0 720 180" preserveAspectRatio="none" aria-hidden="true">
              <defs><linearGradient id="admin-chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#168fc4" stopOpacity=".22" /><stop offset="100%" stopColor="#168fc4" stopOpacity="0" /></linearGradient></defs>
              <polygon points={`0,180 ${chartPoints.map((point, index) => `${index * 65},${180 - point.value * 1.45}`).join(' ')} 720,180`} fill="url(#admin-chart-fill)" />
              <polyline points={chartPoints.map((point, index) => `${index * 65},${180 - point.value * 1.45}`).join(' ')} fill="none" stroke="#168fc4" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="admin-chart-labels">{chartPoints.filter((_, index) => index % 2 === 0).map((point) => <span key={point.time}>{point.time}</span>)}</div>
          </div>
        </div>
      </section>
      <section className="admin-quick-actions">
        <button className="admin-quick-card" type="button" onClick={() => setMessage('Xóa cache chưa được kết nối với dịch vụ máy chủ.')}><Database size={20} /><span><strong>Xóa cache hệ thống</strong><small>Thao tác mẫu · chưa kết nối API</small></span></button>
        <button className="admin-quick-card" type="button" onClick={() => setMessage('Chẩn đoán nhanh chưa được kết nối với dịch vụ giám sát.')}><Wrench size={20} /><span><strong>Chạy chẩn đoán nhanh</strong><small>Thao tác mẫu · chưa kết nối API</small></span></button>
      </section>
      <ActionMessage onClose={() => setMessage('')}>{message}</ActionMessage>
    </main>
  );
}

export function PendingUsersPage() {
  const [accounts, setAccounts] = useState(pendingAccounts);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tất cả');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [activeAccount, setActiveAccount] = useState(null);
  const [message, setMessage] = useState('');

  const filteredAccounts = useMemo(() => accounts.filter((account) => {
    const matchesQuery = `${account.name} ${account.email} ${account.role}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery
      && (roleFilter === 'Tất cả' || account.role.includes(roleFilter))
      && (typeFilter === 'Tất cả' || account.type === typeFilter);
  }), [accounts, query, roleFilter, typeFilter]);

  const toggleSelected = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const reviewAccounts = (ids, approved) => {
    setAccounts((current) => current.filter((account) => !ids.includes(account.id)));
    setSelected((current) => current.filter((id) => !ids.includes(id)));
    setActiveAccount(null);
    setMessage(`${ids.length} tài khoản đã được ${approved ? 'duyệt' : 'từ chối'} trong bản xem trước. Chưa có thay đổi nào được gửi tới máy chủ.`);
  };

  return (
    <main className="dashboard-page admin-system-page">
      <PageHeader kicker="QUẢN LÝ TÀI KHOẢN" title="Người dùng mới" subtitle={`${accounts.length} tài khoản đang chờ rà soát · dữ liệu minh họa`} action={<button className="btn btn-primary" type="button" disabled={!selected.length} onClick={() => reviewAccounts(selected, true)}><Check size={16} /> Duyệt {selected.length || ''} đã chọn</button>} />
      <DemoNotice />
      <section className="admin-panel admin-pending-panel">
        <div className="admin-filter-bar">
          <label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, email, mã số..." /></label>
          <label className="admin-filter-select">Vai trò<select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option>Tất cả</option><option>Cán bộ</option><option>Sinh viên</option></select></label>
          <label className="admin-filter-select">Loại tài khoản<select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>Tất cả</option><option>Cán bộ</option><option>Sinh viên</option></select></label>
        </div>
        <div className="admin-table-title"><div><h2>Danh sách tài khoản chờ duyệt</h2><p>{filteredAccounts.length} tài khoản khớp bộ lọc</p></div></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th><input type="checkbox" aria-label="Chọn tất cả tài khoản" checked={filteredAccounts.length > 0 && filteredAccounts.every((account) => selected.includes(account.id))} onChange={(event) => setSelected(event.target.checked ? [...new Set([...selected, ...filteredAccounts.map((account) => account.id)])] : selected.filter((id) => !filteredAccounts.some((account) => account.id === id)))} /></th><th>Họ và tên</th><th>Email tài khoản</th><th>Vai trò yêu cầu</th><th>Ngày đăng ký</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id}>
                  <td><input type="checkbox" aria-label={`Chọn ${account.name}`} checked={selected.includes(account.id)} onChange={() => toggleSelected(account.id)} /></td>
                  <td><button className="admin-name-button" type="button" onClick={() => setActiveAccount(account)}>{account.name}</button></td>
                  <td>{account.email}</td><td>{account.role}</td><td>{account.registered}</td>
                  <td><div className="admin-row-actions"><button type="button" className="admin-text-action approve" onClick={() => reviewAccounts([account.id], true)}>Duyệt</button><button type="button" className="admin-text-action reject" onClick={() => reviewAccounts([account.id], false)}>Từ chối</button></div></td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && <tr><td colSpan="6" className="admin-empty-cell">Không tìm thấy tài khoản phù hợp.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      {activeAccount && <div className="admin-drawer-backdrop" role="presentation" onClick={() => setActiveAccount(null)}>
        <aside className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-drawer-title" onClick={(event) => event.stopPropagation()}>
          <button className="admin-drawer-close" type="button" aria-label="Đóng chi tiết" onClick={() => setActiveAccount(null)}><X size={19} /></button>
          <span className="dashboard-kicker">HỒ SƠ ĐĂNG KÝ</span><h2 id="admin-drawer-title">{activeAccount.name}</h2>
          <p>{activeAccount.email}</p>
          <div className="admin-detail-list"><div><span>Vai trò yêu cầu</span><strong>{activeAccount.role}</strong></div><div><span>Ngày đăng ký</span><strong>{activeAccount.registered}</strong></div><div><span>Xác minh email</span><strong>{activeAccount.verified ? 'Đã xác thực' : 'Chưa xác thực'}</strong></div><div><span>Giấy tờ định danh</span><strong>Chưa có dữ liệu minh họa</strong></div></div>
          <DemoNotice />
          <div className="admin-drawer-actions"><button className="btn btn-primary" type="button" onClick={() => reviewAccounts([activeAccount.id], true)}><Check size={16} /> Duyệt tài khoản</button><button className="btn btn-outline" type="button" onClick={() => reviewAccounts([activeAccount.id], false)}>Từ chối</button></div>
        </aside>
      </div>}
      <ActionMessage onClose={() => setMessage('')}>{message}</ActionMessage>
    </main>
  );
}

const securityDefaults = { staff2fa: true, student2fa: false, authenticator: true, emailOtp: true, minPassword: 8, sessionMinutes: 30, failedAttempts: 5, ipWhitelist: '10.0.0.0/24' };

export function SecuritySettingsPage() {
  const [settings, setSettings] = useState(securityDefaults);
  const [message, setMessage] = useState('');
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));

  return (
    <main className="dashboard-page admin-system-page">
      <PageHeader kicker="CẤU HÌNH HỆ THỐNG" title="Bảo mật" subtitle="Chính sách xác thực, mật khẩu, phiên đăng nhập và giới hạn truy cập." action={<button className="btn btn-primary" type="button" onClick={() => setMessage('Đã lưu bản xem trước trong bộ nhớ trang; cấu hình chưa được gửi tới máy chủ.')}><Save size={16} /> Lưu thay đổi</button>} />
      <DemoNotice />
      <div className="admin-security-score"><div className="admin-score-icon"><ShieldCheck size={22} /></div><div><span>Điểm đánh giá bảo mật</span><strong>92 <small>/ 100</small></strong></div><span className="admin-status-pill"><CheckCircle2 size={15} /> An toàn</span></div>
      <section className="admin-panel admin-settings-panel">
        <div className="admin-section-heading"><div><h2>Xác thực 2 yếu tố (2FA / MFA)</h2><p>Chọn nhóm tài khoản bắt buộc xác thực bổ sung.</p></div><ShieldCheck size={20} className="admin-heading-icon" /></div>
        <ToggleRow title="Bắt buộc 2FA đối với tài khoản Quản trị viên & Cán bộ" checked={settings.staff2fa} onChange={(value) => update('staff2fa', value)} />
        <ToggleRow title="Bắt buộc 2FA đối với Sinh viên" checked={settings.student2fa} onChange={(value) => update('student2fa', value)} />
        <div className="admin-check-options"><span>Phương thức hỗ trợ</span><label><input type="checkbox" checked={settings.authenticator} onChange={(event) => update('authenticator', event.target.checked)} /> Google Authenticator (TOTP)</label><label><input type="checkbox" checked={settings.emailOtp} onChange={(event) => update('emailOtp', event.target.checked)} /> Email OTP</label></div>
      </section>
      <section className="admin-panel admin-settings-panel">
        <div className="admin-section-heading"><div><h2>Chính sách mật khẩu & phiên đăng nhập</h2><p>Thiết lập các giới hạn bảo vệ tài khoản.</p></div><Users size={20} className="admin-heading-icon" /></div>
        <div className="admin-settings-grid">
          <NumberSetting label="Độ dài mật khẩu tối thiểu" value={settings.minPassword} suffix="ký tự" min={6} max={64} onChange={(value) => update('minPassword', value)} />
          <NumberSetting label="Thời gian hết hạn phiên" value={settings.sessionMinutes} suffix="phút" min={5} max={1440} onChange={(value) => update('sessionMinutes', value)} />
          <NumberSetting label="Khóa sau số lần đăng nhập sai" value={settings.failedAttempts} suffix="lần" min={3} max={20} onChange={(value) => update('failedAttempts', value)} />
        </div>
      </section>
      <section className="admin-panel admin-settings-panel">
        <div className="admin-section-heading"><div><h2>Giới hạn truy cập</h2><p>Danh sách IP cho phép truy cập trang quản trị.</p></div><Activity size={20} className="admin-heading-icon" /></div>
        <label className="admin-field-label" htmlFor="admin-ip-whitelist">Dải IP được phép</label>
        <div className="admin-ip-row"><input id="admin-ip-whitelist" value={settings.ipWhitelist} onChange={(event) => update('ipWhitelist', event.target.value)} /><button className="btn btn-outline" type="button" onClick={() => update('ipWhitelist', `${settings.ipWhitelist}, `)}><Plus size={15} /> Thêm IP</button></div>
      </section>
      <ActionMessage onClose={() => setMessage('')}>{message}</ActionMessage>
    </main>
  );
}

function ToggleRow({ title, checked, onChange }) {
  return <label className="admin-toggle-row"><span>{title}</span><input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} /><i aria-hidden="true" /></label>;
}

function NumberSetting({ label, value, suffix, min, max, onChange }) {
  return <label className="admin-number-setting"><span>{label}</span><div><input type="number" value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} /><small>{suffix}</small></div></label>;
}

const initialRoles = [
  { name: 'Super Admin', permissions: [1, 1, 1, 1, 1, 1] },
  { name: 'Trưởng phòng', permissions: [1, 1, 1, 0, 0, 0] },
  { name: 'Cán bộ thụ lý', permissions: [1, 1, 0, 0, 0, 0] },
  { name: 'Quầy Một cửa', permissions: [1, 0, 0, 0, 0, 0] },
  { name: 'Sinh viên', permissions: [0, 0, 0, 0, 0, 0] },
];
const permissionNames = ['Xem danh sách hồ sơ', 'Phê duyệt hồ sơ', 'Ký số văn bản', 'Quản lý tài khoản', 'Cấu hình dịch vụ công', 'Xóa dữ liệu / Audit Log'];

export function RoleManagementPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [message, setMessage] = useState('');
  const togglePermission = (roleIndex, permissionIndex) => setRoles((current) => current.map((role, index) => index !== roleIndex ? role : { ...role, permissions: role.permissions.map((value, permission) => permission === permissionIndex ? Number(!value) : value) }));
  const addRole = () => {
    const name = window.prompt('Tên vai trò mới');
    if (!name?.trim()) return;
    setRoles((current) => [...current, { name: name.trim(), permissions: [0, 0, 0, 0, 0, 0] }]);
    setMessage(`Đã thêm vai trò "${name.trim()}" vào bản xem trước.`);
  };
  const cloneRole = (role) => {
    const name = window.prompt(`Tên bản sao của vai trò "${role.name}"`);
    if (!name?.trim()) return;
    setRoles((current) => [...current, { name: name.trim(), permissions: [...role.permissions] }]);
    setMessage(`Đã sao chép quyền của "${role.name}" vào bản xem trước.`);
  };

  return (
    <main className="dashboard-page admin-system-page">
      <PageHeader kicker="CẤU HÌNH HỆ THỐNG" title="Phân quyền" subtitle="Quản lý nhóm vai trò và quyền truy cập theo từng nghiệp vụ." action={<button className="btn btn-primary" type="button" onClick={addRole}><Plus size={16} /> Tạo vai trò mới</button>} />
      <DemoNotice />
      <div className="admin-review-alert"><AlertTriangle size={19} /><span><strong>Rà soát quyền truy cập</strong><small>{roles.length + 4} vai trò đang hoạt động cần được rà soát định kỳ.</small></span></div>
      <section className="admin-panel">
        <div className="admin-section-heading"><div><h2>Ma trận phân quyền</h2><p>Bật hoặc tắt quyền mẫu cho từng nhóm vai trò.</p></div></div>
        <div className="admin-table-wrap">
          <table className="admin-table admin-role-matrix">
            <thead><tr><th>Danh mục quyền</th>{roles.map((role, index) => <th key={`${role.name}-${index}`}>{role.name}</th>)}</tr></thead>
            <tbody>{permissionNames.map((permission, permissionIndex) => <tr key={permission}><td>{permission}</td>{roles.map((role, roleIndex) => <td key={`${role.name}-${roleIndex}`}><input type="checkbox" aria-label={`${permission} — ${role.name}`} checked={Boolean(role.permissions[permissionIndex])} onChange={() => togglePermission(roleIndex, permissionIndex)} /></td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>
      <section className="admin-panel admin-role-list">
        <div className="admin-section-heading"><div><h2>Vai trò trong hệ thống</h2><p>{roles.length} vai trò đang hiển thị trong bản xem trước.</p></div></div>
        {roles.map((role, index) => <div className="admin-role-row" key={`${role.name}-${index}`}><div><strong>{role.name}</strong><span>{role.permissions.filter(Boolean).length} quyền được bật</span></div><button type="button" className="btn btn-outline btn-sm" onClick={() => cloneRole(role)}>Sao chép vai trò</button></div>)}
      </section>
      <ActionMessage onClose={() => setMessage('')}>{message}</ActionMessage>
    </main>
  );
}

export function SystemUpdatesPage() {
  const [maintenance, setMaintenance] = useState(true);
  const [checks, setChecks] = useState([true, true, false]);
  const [message, setMessage] = useState('');
  const checklist = ['Tự động sao lưu cơ sở dữ liệu', 'Kiểm tra thời hạn chứng chỉ SSL/TLS', 'Chạy thử nghiệm trên server staging'];
  return (
    <main className="dashboard-page admin-system-page">
      <PageHeader kicker="CẤU HÌNH HỆ THỐNG" title="Cập nhật hệ thống" subtitle="Theo dõi phiên bản, kế hoạch triển khai và công tác bảo trì." action={<button className="btn btn-primary" type="button" onClick={() => setMessage('Lịch bảo trì chưa được gửi tới máy chủ vì chưa có API triển khai.')}><Clock3 size={16} /> Lên lịch bảo trì</button>} />
      <DemoNotice />
      <section className="admin-version-card"><div><span>Phiên bản hệ thống hiện tại</span><strong>v2.4.1</strong><small><CheckCircle2 size={15} /> Stable · Sản xuất</small></div><div className="admin-version-arrow">→</div><div><span>Bản cập nhật tiếp theo</span><strong>v2.5.0</strong><small className="admin-scheduled"><Clock3 size={15} /> Đã lên lịch</small></div></section>
      <section className="admin-panel admin-release-panel">
        <div className="admin-section-heading"><div><h2>Lịch nâng cấp sắp tới</h2><p>Chủ Nhật, 25/10/2026 · 23:00 – 02:00</p></div><span className="admin-status-pill warning">Đã lên lịch</span></div>
        <ToggleRow title="Tự động bật chế độ bảo trì khi bắt đầu nâng cấp" checked={maintenance} onChange={setMaintenance} />
        <h3 className="admin-subheading">Nội dung bản cập nhật v2.5.0</h3>
        <ul className="admin-release-notes"><li><CheckCircle2 size={16} /> Nâng cấp cổng thanh toán VietQR.</li><li><CheckCircle2 size={16} /> Tích hợp module ký số đám mây.</li><li><Sparkles size={16} /> Tối ưu tốc độ tải trang tra cứu.</li><li><Wrench size={16} /> Khắc phục lỗi lệch lề khi in giấy xác nhận.</li></ul>
      </section>
      <section className="admin-panel admin-checklist-panel">
        <div className="admin-section-heading"><div><h2>Kiểm tra trước khi triển khai</h2><p>Hoàn thành các bước trước khi phát hành phiên bản.</p></div></div>
        {checklist.map((item, index) => <label className="admin-checklist-item" key={item}><input type="checkbox" checked={checks[index]} onChange={() => setChecks((current) => current.map((checked, itemIndex) => itemIndex === index ? !checked : checked))} /><span>{item}</span>{index === 1 && <small>Còn 180 ngày</small>}</label>)}
        <button className="btn btn-outline" type="button" onClick={() => setMessage('Trạng thái checklist chỉ được lưu trong bản xem trước.')}><Save size={16} /> Lưu checklist</button>
      </section>
      <ActionMessage onClose={() => setMessage('')}>{message}</ActionMessage>
    </main>
  );
}
