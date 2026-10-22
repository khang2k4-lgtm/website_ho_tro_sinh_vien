import { useState } from 'react';
import {
  AlertTriangle, ArrowDownToLine, Bell, Check, CheckCircle2, Clock3,
  FileText, ListChecks, Printer, Send, Users,
} from 'lucide-react';
import './AdminDeptPages.css';

const PREVIEW_NOTICE = 'Bản xem trước: nghiệp vụ này chưa kết nối API lưu dữ liệu hoặc gửi thông báo.';
const staffNames = ['Nguyễn Văn C', 'Phạm Thu Hà', 'Đỗ Mai Linh', 'Trần Thị B', 'Lê Hoàng C'];

function DeptPageHeader({ title, subtitle, action, kicker = 'PHÒNG BAN' }) {
  return (
    <header className="dept-page-header">
      <div>
        <span className="dashboard-kicker">{kicker} <span className="dept-breadcrumb-separator">›</span> {title.toLocaleUpperCase('vi')}</span>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

function PreviewNotice() {
  return <div className="dept-preview-notice"><AlertTriangle size={16} />{PREVIEW_NOTICE}</div>;
}

function Feedback({ message, onClose }) {
  if (!message) return null;
  return <div className="dept-feedback" role="status"><span>{message}</span><button type="button" aria-label="Đóng thông báo" onClick={onClose}>×</button></div>;
}

function DeptPanel({ title, subtitle, children, className = '' }) {
  return (
    <section className={`dept-panel ${className}`}>
      {(title || subtitle) && <div className="dept-panel-heading"><div>{title && <h2>{title}</h2>}{subtitle && <p>{subtitle}</p>}</div></div>}
      {children}
    </section>
  );
}

function DeptMetric({ icon: Icon, label, value, detail, tone = 'blue' }) {
  return <article className="dept-metric"><span className={`dept-metric-icon ${tone}`}><Icon size={19} /></span><div><small>{label}</small><strong>{value}</strong><span>{detail}</span></div></article>;
}

const initialAssignments = [
  { id: 'HD2026000101', service: 'Cấp Giấy xác nhận SV', student: 'Nguyễn Văn A', priority: 'Gấp', assigned: '' },
  { id: 'HD2026000102', service: 'Xin hoãn học', student: 'Trần Thị B', priority: 'Thường', assigned: 'Nguyễn Văn C' },
  { id: 'HD2026000103', service: 'Cấp lại Thẻ sinh viên', student: 'Lê Hoàng D', priority: 'Thường', assigned: '' },
  { id: 'HD2026000104', service: 'Xác nhận kết quả học tập', student: 'Phạm Thu H', priority: 'Gấp', assigned: '' },
  { id: 'HD2026000105', service: 'Đăng ký miễn giảm học phí', student: 'Đỗ Minh K', priority: 'Thường', assigned: '' },
  { id: 'HD2026000106', service: 'Cấp giấy xác nhận vay vốn', student: 'Vũ Thanh M', priority: 'Thường', assigned: '' },
  { id: 'HD2026000107', service: 'Điều chỉnh thông tin sinh viên', student: 'Bùi Ngọc P', priority: 'Thường', assigned: '' },
  { id: 'HD2026000108', service: 'Xin hoãn học', student: 'Hoàng Hải Q', priority: 'Thường', assigned: '' },
];

export function TaskAllocationPage() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selected, setSelected] = useState(initialAssignments.slice(0, 2).map((item) => item.id));
  const [message, setMessage] = useState('');
  const pendingAssignments = assignments.filter((item) => !item.confirmed);
  const unassigned = pendingAssignments.filter((item) => !item.assigned);
  const toggleSelected = (id) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  const updateAssignee = (id, assigned) => setAssignments((current) => current.map((item) => item.id === id ? { ...item, assigned } : item));

  const autoAllocate = (smart = false) => {
    let cursor = 0;
    setAssignments((current) => current.map((item) => {
      if (item.assigned || item.confirmed) return item;
      const assignee = smart && item.priority === 'Gấp' ? staffNames[1] : staffNames[cursor++ % staffNames.length];
      return { ...item, assigned: assignee };
    }));
    setMessage(smart ? 'Đã gợi ý phân bổ theo ưu tiên trong bản xem trước.' : 'Đã chia đều hồ sơ cho cán bộ trong bản xem trước.');
  };

  const confirmAssignments = () => {
    const selectedAssignments = assignments.filter((item) => selected.includes(item.id) && !item.confirmed);
    const unassignedCount = selectedAssignments.filter((item) => !item.assigned).length;
    if (unassignedCount > 0) {
      setMessage(`Hãy chọn cán bộ cho ${unassignedCount} hồ sơ đang thiếu người phụ trách trước khi xác nhận.`);
      return;
    }
    const assignedCount = selectedAssignments.length;
    setAssignments((current) => current.map((item) => selected.includes(item.id) ? { ...item, confirmed: true } : item));
    setSelected([]);
    setMessage(`${assignedCount} hồ sơ đã được xác nhận trong bản xem trước; chưa cập nhật lên máy chủ.`);
  };

  return (
    <main className="dashboard-page dept-page">
      <DeptPageHeader title="Phân bổ công việc" subtitle={`${pendingAssignments.length} hồ sơ cần giao cho cán bộ trong đội · 08:40`} />
      <PreviewNotice />
      <div className="dept-metrics-grid">
        <DeptMetric icon={ListChecks} label="Hồ sơ chờ giao" value={`${pendingAssignments.length} hồ sơ`} detail={`${unassigned.length} hồ sơ chưa chọn cán bộ`} />
        <DeptMetric icon={Users} label="Cán bộ đang rảnh" value="4 / 8 nhân sự" detail="Tải được cân đối theo mẫu" tone="violet" />
        <DeptMetric icon={Clock3} label="Tải trung bình" value="3.2 hồ sơ / người" detail="Số liệu minh họa" tone="cyan" />
      </div>
      <DeptPanel title="Công cụ phân bổ tự động" subtitle="Chia đều tải công việc hoặc ưu tiên hồ sơ theo độ khẩn cấp.">
        <div className="dept-action-row">
          <button className="btn btn-outline" type="button" onClick={() => autoAllocate(false)}>↻ Chia đều tự động (Round-Robin)</button>
          <button className="btn btn-outline" type="button" onClick={() => autoAllocate(true)}>◎ Phân theo ưu tiên</button>
          <button className="btn btn-primary" type="button" disabled={!selected.length} onClick={confirmAssignments}><Check size={16} /> Phê duyệt gán {selected.length || ''} hồ sơ đã chọn</button>
        </div>
      </DeptPanel>
      <DeptPanel title={`Danh sách hồ sơ chờ phân công (${pendingAssignments.length})`} subtitle="Có thể gán cán bộ trực tiếp cho từng hồ sơ.">
        <div className="dept-table-wrap"><table className="dept-table">
          <thead><tr><th><input type="checkbox" aria-label="Chọn tất cả hồ sơ" checked={pendingAssignments.length > 0 && pendingAssignments.every((item) => selected.includes(item.id))} onChange={(event) => setSelected(event.target.checked ? [...new Set([...selected, ...pendingAssignments.map((item) => item.id)])] : selected.filter((id) => !pendingAssignments.some((item) => item.id === id)))} /></th><th>Mã hồ sơ</th><th>Dịch vụ</th><th>Sinh viên</th><th>Độ ưu tiên</th><th>Gán cho cán bộ</th></tr></thead>
          <tbody>{pendingAssignments.map((item) => <tr key={item.id}>
            <td><input type="checkbox" aria-label={`Chọn ${item.id}`} checked={selected.includes(item.id)} onChange={() => toggleSelected(item.id)} /></td>
            <td><strong>{item.id}</strong></td><td>{item.service}</td><td>{item.student}</td>
            <td><span className={`dept-priority ${item.priority === 'Gấp' ? 'urgent' : ''}`}>{item.priority}</span></td>
            <td><select aria-label={`Cán bộ phụ trách ${item.id}`} value={item.assigned} onChange={(event) => updateAssignee(item.id, event.target.value)}><option value="">Chọn cán bộ · gợi ý: Nguyễn Văn C (Rảnh)</option>{staffNames.map((name) => <option key={name} value={name}>{name}{name === 'Nguyễn Văn C' ? ' (Rảnh)' : ''}</option>)}</select></td>
          </tr>)}</tbody>
        </table></div>
      </DeptPanel>
      <Feedback message={message} onClose={() => setMessage('')} />
    </main>
  );
}

const overdueCases = [
  { code: 'HD2026000088', staff: 'Phạm Thu Hà', received: '16/10/2026', deadline: '18/10/2026', late: '+2 ngày', reason: 'Chờ sinh viên gửi lại ảnh scan' },
  { code: 'HD2026000091', staff: 'Đỗ Mai Linh', received: '16/10/2026', deadline: '18/10/2026', late: '+2 ngày', reason: 'Quá tải quầy trực' },
];
const progressStaff = [
  { name: 'Nguyễn Văn C', percent: 86 }, { name: 'Phạm Thu Hà', percent: 72 },
  { name: 'Đỗ Mai Linh', percent: 58 }, { name: 'Trần Thị B', percent: 94 },
];

export function ProgressMonitorPage() {
  const [cases, setCases] = useState(overdueCases);
  const [message, setMessage] = useState('');
  const remind = (item) => setMessage(`Đã tạo nhắc nhở mẫu cho ${item.staff} về hồ sơ ${item.code}. Chưa gửi thông báo thật.`);
  const transfer = (item) => {
    setCases((current) => current.filter((record) => record.code !== item.code));
    setMessage(`Đã chuyển hồ sơ ${item.code} khỏi danh sách trễ hạn trong bản xem trước; chưa đổi người phụ trách trên máy chủ.`);
  };

  return (
    <main className="dashboard-page dept-page">
      <DeptPageHeader title="Kiểm tra tiến độ" subtitle="Theo dõi SLA, phát hiện hồ sơ chậm và cân đối công việc trong phòng." />
      <PreviewNotice />
      <div className="dept-warning-banner"><AlertTriangle size={20} /><div><strong>Có {cases.length} hồ sơ trễ hạn xử lý</strong><span>Vượt {cases.length ? '+2 ngày' : '0 ngày'} so với quy định SLA.</span></div></div>
      <DeptPanel title="Bảng theo dõi hồ sơ chậm tiến độ" subtitle="Hồ sơ cần được ưu tiên xử lý hoặc điều phối lại.">
        <div className="dept-table-wrap"><table className="dept-table">
          <thead><tr><th>Mã hồ sơ</th><th>Cán bộ phụ trách</th><th>Ngày tiếp nhận</th><th>Hạn xử lý</th><th>Trễ hạn</th><th>Nguyên nhân & thao tác</th></tr></thead>
          <tbody>{cases.map((item) => <tr key={item.code}>
            <td><strong>{item.code}</strong></td><td>{item.staff}</td><td>{item.received}</td><td>{item.deadline}</td>
            <td><span className="dept-priority urgent">{item.late}</span></td>
            <td><span className="dept-reason">{item.reason}</span><div className="dept-row-actions"><button type="button" onClick={() => remind(item)}><Bell size={14} /> Gửi đôn đốc</button><button type="button" onClick={() => transfer(item)}>Điều chuyển</button></div></td>
          </tr>)}
          {cases.length === 0 && <tr><td colSpan="6" className="dept-empty">Không còn hồ sơ trễ hạn trong danh sách xem trước.</td></tr>}</tbody>
        </table></div>
      </DeptPanel>
      <DeptPanel title="Tiến độ theo từng cán bộ" subtitle="Tỷ lệ công việc hoàn thành trong ngày · dữ liệu minh họa">
        <div className="dept-progress-list">{progressStaff.map((person) => <div className="dept-progress-row" key={person.name}><strong>{person.name}</strong><div className="dept-progress-track"><span style={{ width: `${person.percent}%` }} /></div><b>{person.percent}%</b></div>)}</div>
      </DeptPanel>
      <Feedback message={message} onClose={() => setMessage('')} />
    </main>
  );
}

const weeklyStaff = [
  { name: 'Nguyễn Văn A', completed: 38, onTime: '100%', rating: '4.9', badge: 'Xuất sắc' },
  { name: 'Trần Thị B', completed: 32, onTime: '96.8%', rating: '4.8', badge: 'Tốt' },
  { name: 'Lê Hoàng C', completed: 28, onTime: '89.2%', rating: '4.7', badge: 'Đạt' },
  { name: 'Phạm Thu Hà', completed: 24, onTime: '95.0%', rating: '4.8', badge: 'Tốt' },
];
const weeklyDays = [
  { day: 'Thứ 2', goal: 30, actual: 28 }, { day: 'Thứ 3', goal: 30, actual: 31 },
  { day: 'Thứ 4', goal: 30, actual: 27 }, { day: 'Thứ 5', goal: 30, actual: 29 },
  { day: 'Thứ 6', goal: 30, actual: 27 },
];

function exportCsv(filename, headers, rows) {
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escape).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function WeeklySummaryPage() {
  return (
    <main className="dashboard-page dept-page">
      <DeptPageHeader title="Kết quả tuần" subtitle="Tổng hợp KPI và năng suất xử lý hồ sơ trong tuần." action={<button className="btn btn-primary" type="button" onClick={() => exportCsv('ket-qua-tuan.csv', ['Nhân viên', 'Hồ sơ hoàn thành', 'Đúng hạn', 'Đánh giá'], weeklyStaff.map((person) => [person.name, person.completed, person.onTime, person.rating]))}><ArrowDownToLine size={16} /> Xuất báo cáo CSV</button>} />
      <PreviewNotice />
      <div className="dept-metrics-grid">
        <DeptMetric icon={CheckCircle2} label="Tỷ lệ hoàn thành" value="94%" detail="Đạt chỉ tiêu tuần" tone="green" />
        <DeptMetric icon={FileText} label="Tổng hồ sơ xử lý" value="142 / 150" detail="Hồ sơ trong kế hoạch" />
        <DeptMetric icon={Check} label="Đánh giá từ sinh viên" value="4.85 / 5.0" detail="Trung bình tuần này" tone="violet" />
      </div>
      <DeptPanel title="Xếp hạng năng suất cán bộ" subtitle="Các chỉ số trong bảng là dữ liệu minh họa.">
        <div className="dept-table-wrap"><table className="dept-table">
          <thead><tr><th>STT</th><th>Cán bộ thụ lý</th><th>Đã hoàn thành</th><th>Đúng hạn</th><th>Đánh giá SV</th><th>KPI tuần</th></tr></thead>
          <tbody>{weeklyStaff.map((person, index) => <tr key={person.name}><td>{index + 1}</td><td><strong>{person.name}</strong></td><td>{person.completed} hồ sơ</td><td>{person.onTime}</td><td>{person.rating} / 5.0</td><td><span className="dept-kpi-badge">{person.badge}</span></td></tr>)}</tbody>
        </table></div>
      </DeptPanel>
      <DeptPanel title="Kế hoạch và thực tế" subtitle="Số hồ sơ hoàn thành theo ngày · tuần làm việc">
        <div className="dept-weekly-chart">{weeklyDays.map((item) => <div className="dept-day-bars" key={item.day}><div className="dept-bar-pair"><span className="goal" style={{ height: `${item.goal * 2}px` }} /><span className="actual" style={{ height: `${item.actual * 2}px` }} /></div><small>{item.day}</small><span>{item.actual} / {item.goal}</span></div>)}</div>
        <div className="dept-chart-legend"><span className="goal" /> Kế hoạch <span className="actual" /> Thực tế</div>
      </DeptPanel>
    </main>
  );
}

const initialRules = [
  { service: 'Xác nhận sinh viên', department: 'Quầy 1 · Bộ phận Một cửa', rule: 'Ưu tiên hồ sơ online', coordinator: 'Nguyễn Văn A' },
  { service: 'Học phí & miễn giảm', department: 'Quầy 2 · Phòng Kế hoạch tài chính', rule: 'Kiểm tra thanh toán', coordinator: 'Trần Thị B' },
  { service: 'Bảng điểm & bằng cấp', department: 'Quầy 3 · Phòng Đào tạo', rule: 'Kiểm tra thủ công', coordinator: 'Lê Hoàng C' },
];
const initialQueue = [
  { id: 'HD2026000109', service: 'Xác nhận sinh viên', state: 'Đã luồng sang Quầy 1' },
  { id: 'HD2026000110', service: 'Học phí & miễn giảm', state: 'Đã luồng sang Quầy 2' },
  { id: 'HD2026000111', service: 'Bảng điểm & bằng cấp', state: 'Chờ kiểm tra' },
  { id: 'HD2026000112', service: 'Xác nhận sinh viên', state: 'Chờ kiểm tra' },
  { id: 'HD2026000113', service: 'Học phí & miễn giảm', state: 'Chờ kiểm tra' },
  { id: 'HD2026000114', service: 'Bảng điểm & bằng cấp', state: 'Chờ kiểm tra' },
];

export function DispatchBoardPage() {
  const [rules, setRules] = useState(initialRules);
  const [queue, setQueue] = useState(initialQueue);
  const [message, setMessage] = useState('');
  const updateRule = (index, field, value) => setRules((current) => current.map((item, row) => row === index ? { ...item, [field]: value } : item));
  const dispatchAll = () => {
    setQueue((current) => current.map((item) => {
      if (item.state !== 'Chờ kiểm tra') return item;
      const rule = rules.find((entry) => entry.service === item.service);
      return { ...item, state: `Đã luồng · ${rule?.department || 'Chưa phân tuyến'}` };
    }));
    setMessage('Đã chạy phân luồng trên danh sách mẫu; quy tắc chưa được lưu lên máy chủ.');
  };

  return (
    <main className="dashboard-page dept-page">
      <DeptPageHeader title="Ban điều phối" subtitle="Phân luồng hồ sơ mới và cân bằng tải giữa các đơn vị xử lý." />
      <PreviewNotice />
      <div className="dept-dispatch-status"><span /><div><strong>Điều phối tự động: đang hoạt động</strong><small>{queue.filter((item) => item.state === 'Chờ kiểm tra').length} hồ sơ mới đang chờ phân luồng</small></div><button className="btn btn-primary" type="button" onClick={dispatchAll}>Chạy điều phối</button></div>
      <DeptPanel title="Quy tắc điều phối" subtitle="Chỉnh sửa nhóm dịch vụ, đơn vị xử lý và cán bộ điều phối trong bản xem trước.">
        <div className="dept-table-wrap"><table className="dept-table">
          <thead><tr><th>Nhóm dịch vụ</th><th>Đơn vị xử lý</th><th>Quy tắc điều phối</th><th>Cán bộ điều phối</th></tr></thead>
          <tbody>{rules.map((rule, index) => <tr key={rule.service}><td><strong>{rule.service}</strong></td><td><input className="dept-inline-input" value={rule.department} aria-label={`Đơn vị xử lý ${rule.service}`} onChange={(event) => updateRule(index, 'department', event.target.value)} /></td><td><input className="dept-inline-input" value={rule.rule} aria-label={`Quy tắc ${rule.service}`} onChange={(event) => updateRule(index, 'rule', event.target.value)} /></td><td><select value={rule.coordinator} aria-label={`Cán bộ điều phối ${rule.service}`} onChange={(event) => updateRule(index, 'coordinator', event.target.value)}>{staffNames.map((name) => <option key={name}>{name}</option>)}</select></td></tr>)}</tbody>
        </table></div>
        <button className="btn btn-outline dept-save-rule" type="button" onClick={() => setMessage('Quy tắc chỉ được cập nhật trong bản xem trước.')}>Lưu quy tắc</button>
      </DeptPanel>
      <DeptPanel title="Hồ sơ mới vừa tiếp nhận" subtitle="Tình trạng của sáu hồ sơ trong hàng đợi mẫu.">
        <div className="dept-queue-grid">{queue.map((item) => <article className="dept-queue-card" key={item.id}><strong>{item.id}</strong><span>{item.service}</span><small className={item.state.startsWith('Chờ') ? 'pending' : 'routed'}>{item.state}</small></article>)}</div>
      </DeptPanel>
      <Feedback message={message} onClose={() => setMessage('')} />
    </main>
  );
}

const initialTeam = [
  { name: 'Nguyễn Thị Mai', group: 'Tổ Học vụ', cases: 5, reported: false },
  { name: 'Trần Văn Nam', group: 'Tổ Tài chính', cases: 8, reported: false },
  { name: 'Hoàng Kim Yến', group: 'Tổ Thẻ sinh viên', cases: 3, reported: false },
];

export function TeamLeaderTasksPage() {
  const team = initialTeam;
  const [approvals, setApprovals] = useState([true, true]);
  const [message, setMessage] = useState('');
  const requestReport = (person) => setMessage(`Đã tạo nhắc nhở báo cáo cho ${person} trong bản xem trước; chưa gửi email/thông báo.`);
  const approvalItems = ['Đơn xin gia hạn nộp hồ sơ cho sinh viên (2 đơn)', 'Đề xuất cấp lại phôi bằng bị hỏng (1 đơn)'];

  return (
    <main className="dashboard-page dept-page">
      <DeptPageHeader title="Nhiệm vụ trưởng nhóm" subtitle="Theo dõi báo cáo cuối ca, tải hồ sơ và các đề xuất cần phê duyệt." />
      <PreviewNotice />
      <div className="dept-warning-banner mild"><Bell size={19} /><div><strong>{team.filter((person) => !person.reported).length} nhân sự chưa cập nhật tiến độ cuối ca</strong><span>Nhắc cán bộ chốt sổ báo cáo trong hôm nay.</span></div></div>
      <DeptPanel title="Quản lý nhiệm vụ theo tổ / nhóm" subtitle="Trạng thái báo cáo và tải hồ sơ hiện là dữ liệu minh họa.">
        <div className="dept-table-wrap"><table className="dept-table">
          <thead><tr><th>Tên nhân sự</th><th>Nhóm nhiệm vụ</th><th>Hồ sơ đang giữ</th><th>Trạng thái báo cáo</th><th>Thao tác trưởng nhóm</th></tr></thead>
          <tbody>{team.map((person) => <tr key={person.name}><td><strong>{person.name}</strong></td><td>{person.group}</td><td>{person.cases} hồ sơ</td><td><span className={`dept-report-status ${person.reported ? 'done' : ''}`}>{person.reported ? 'Đã cập nhật' : 'Chưa cập nhật'}</span></td><td><button className="dept-inline-action" type="button" onClick={() => requestReport(person.name)}><Bell size={14} /> Yêu cầu báo cáo</button></td></tr>)}</tbody>
        </table></div>
      </DeptPanel>
      <DeptPanel title="Việc cần trưởng nhóm phê duyệt" subtitle="Các yêu cầu đang chờ xem xét.">
        <div className="dept-approval-list">{approvalItems.map((item, index) => <label key={item}><input type="checkbox" checked={approvals[index]} onChange={() => setApprovals((current) => current.map((value, row) => row === index ? !value : value))} /><span>{item}</span><small>{approvals[index] ? 'Đã chọn duyệt' : 'Chờ xem xét'}</small></label>)}</div>
        <button className="btn btn-primary dept-approve-button" type="button" onClick={() => setMessage(`${approvals.filter(Boolean).length} đề xuất đã được đánh dấu trong bản xem trước; chưa có phê duyệt trên máy chủ.`)}><Check size={16} /> Xác nhận phê duyệt</button>
      </DeptPanel>
      <Feedback message={message} onClose={() => setMessage('')} />
    </main>
  );
}

export function DepartmentHeadReportPage() {
  const [proposal, setProposal] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const reportText = [
    'TỔNG KẾT HOẠT ĐỘNG PHÒNG BAN - NGÀY 20/10/2026',
    'Tổng hồ sơ đã tiếp nhận trong ngày: 45 hồ sơ',
    'Đã giải quyết và trả kết quả: 41 hồ sơ (91.1%)',
    'Hồ sơ còn tồn chuyển sang ngày mai: 4 hồ sơ (đã phân công cán bộ thụ lý)',
    'Sự cố / vướng mắc: Không có',
    `Ý kiến / đề xuất: ${proposal || 'Không có'}`,
  ].join('\n');

  const downloadReport = () => {
    const url = URL.createObjectURL(new Blob([reportText], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bao-cao-truong-phong.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="dashboard-page dept-page">
      <DeptPageHeader title="Báo cáo trưởng phòng" subtitle="Tổng hợp báo cáo ca và gửi kết quả cho Ban Giám hiệu." />
      <PreviewNotice />
      <div className="dept-deadline-card"><Clock3 size={21} /><div><strong>Hạn gửi báo cáo ca: 17:00 hôm nay</strong><span>01 giờ 45 phút còn lại · thời gian minh họa</span></div><span className="dept-deadline-pill">Sắp đến hạn</span></div>
      <DeptPanel title="Bản dự thảo báo cáo tự động" subtitle="Số liệu mẫu cho ngày 20/10/2026.">
        <div className="dept-report-draft">
          <h3>Tổng kết hoạt động phòng ban - Ngày 20/10/2026</h3>
          <ul><li>Tổng số hồ sơ đã tiếp nhận trong ngày: <strong>45 hồ sơ</strong></li><li>Đã giải quyết và trả kết quả: <strong>41 hồ sơ (91.1%)</strong></li><li>Hồ sơ còn tồn chuyển sang ngày mai: <strong>4 hồ sơ</strong> (đã phân công cán bộ thụ lý)</li><li>Sự cố / vướng mắc: <strong>Không có</strong></li></ul>
        </div>
        <label className="dept-proposal-label" htmlFor="dept-report-proposal">Ý kiến / đề xuất của phòng ban</label>
        <textarea id="dept-report-proposal" rows="4" value={proposal} onChange={(event) => setProposal(event.target.value)} placeholder="Nhập nội dung đề xuất gửi Ban Giám hiệu..." />
      </DeptPanel>
      <div className="dept-action-row dept-report-actions">
        <button className="btn btn-primary" type="button" onClick={() => { setSubmitted(true); setMessage('Báo cáo đã được đánh dấu gửi trong bản xem trước; chưa ký số hoặc gửi lên hệ thống.'); }}><Send size={16} /> {submitted ? 'Đã gửi bản xem trước' : 'Xác nhận & gửi báo cáo'}</button>
        <button className="btn btn-outline" type="button" onClick={downloadReport}><ArrowDownToLine size={16} /> Tải báo cáo (.txt)</button>
        <button className="btn btn-outline dept-print-button" type="button" onClick={() => window.print()}><Printer size={16} /> In / Lưu PDF</button>
      </div>
      <Feedback message={message} onClose={() => setMessage('')} />
    </main>
  );
}
