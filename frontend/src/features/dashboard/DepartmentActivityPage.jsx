import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, CheckCircle2, Clock3, FileSearch, FileText,
  Filter, MessageCircle, Radio, Search, ShieldAlert, Timer, UserRound,
} from 'lucide-react';
import './DepartmentActivityPage.css';

const DEPARTMENTS = ['Bộ phận Một cửa', 'Phòng Công tác sinh viên', 'Phòng Đào tạo', 'Phòng Kế hoạch tài chính'];
const STAFF = ['Nguyễn Văn A', 'Phạm Thu Hà', 'Đỗ Mai Linh', 'Trần Thị B', 'Lê Hoàng C'];

const activityItems = [
  {
    id: 'activity-1',
    time: '11:12',
    date: '2026-10-20',
    department: 'Bộ phận Một cửa',
    category: 'application',
    type: 'Duyệt hồ sơ',
    staff: 'Nguyễn Văn A',
    student: 'Nguyễn Thị Mai',
    code: 'HD2026000124',
    service: 'Giấy xác nhận sinh viên',
    description: 'Cán bộ Nguyễn Văn A đã duyệt hồ sơ HD2026000124 (Giấy xác nhận sinh viên) cho Nguyễn Thị Mai (MSSV: 21190088).',
    detail: 'Vết thao tác ghi nhận: hồ sơ đã được kiểm tra và chuyển sang bước trả kết quả.',
  },
  {
    id: 'activity-2',
    time: '10:55',
    date: '2026-10-20',
    department: 'Bộ phận Một cửa',
    category: 'application',
    type: 'Yêu cầu bổ sung',
    staff: 'Phạm Thu Hà',
    student: 'Lê Văn B',
    code: 'HD2026000118',
    service: 'Cập nhật hồ sơ sinh viên',
    description: 'Cán bộ Phạm Thu Hà yêu cầu sinh viên Lê Văn B bổ sung ảnh CCCD do ảnh scan bị mờ.',
    detail: 'Thông báo bổ sung đã được ghi nhận trong hoạt động mẫu.',
  },
  {
    id: 'activity-3',
    time: '10:40',
    date: '2026-10-20',
    department: 'Bộ phận Một cửa',
    category: 'application',
    type: 'Điều chuyển hồ sơ',
    staff: 'Trưởng phòng',
    student: '',
    code: '3 hồ sơ',
    service: 'Điều phối công việc',
    description: 'Trưởng phòng đã chuyển 3 hồ sơ từ cán bộ Nam sang cán bộ Linh để cân bằng tải xử lý.',
    detail: 'Thay đổi điều phối được lưu trong lịch sử công việc mẫu.',
  },
  {
    id: 'activity-4',
    time: '10:15',
    date: '2026-10-20',
    department: 'Bộ phận Một cửa',
    category: 'warning',
    type: 'Cảnh báo quá hạn SLA',
    staff: 'Hệ thống',
    student: 'Sinh viên liên quan',
    code: 'HD2026000088',
    service: 'Hồ sơ quá hạn',
    description: 'Hồ sơ HD2026000088 quá hạn 2 ngày và chưa trả kết quả cho sinh viên.',
    detail: 'Cần rà soát tiến độ xử lý và liên hệ cán bộ phụ trách.',
  },
  {
    id: 'activity-5',
    time: '09:48',
    date: '2026-10-20',
    department: 'Phòng Công tác sinh viên',
    category: 'ticket',
    type: 'Phản hồi ticket',
    staff: 'Đỗ Mai Linh',
    student: 'Trần Minh K',
    code: 'TCK-2026-0412',
    service: 'Tư vấn thủ tục học vụ',
    description: 'Cán bộ Đỗ Mai Linh đã phản hồi yêu cầu hỗ trợ của sinh viên Trần Minh K.',
    detail: 'Nội dung phản hồi đã được lưu ở luồng trao đổi mẫu.',
  },
  {
    id: 'activity-6',
    time: '09:20',
    date: '2026-10-19',
    department: 'Phòng Đào tạo',
    category: 'application',
    type: 'Tiếp nhận hồ sơ',
    staff: 'Trần Thị B',
    student: 'Lê Hoàng N',
    code: 'HD2026000109',
    service: 'Xác nhận sinh viên',
    description: 'Cán bộ Trần Thị B đã tiếp nhận hồ sơ xác nhận sinh viên của Lê Hoàng N.',
    detail: 'Hồ sơ được đưa vào hàng đợi xử lý của đơn vị.',
  },
];

const onlineStaff = [
  { name: 'Nguyễn Văn A', station: 'Quầy 1', load: '12/15 hồ sơ', state: 'Đang xử lý', busy: false },
  { name: 'Phạm Thu Hà', station: 'Quầy 2', load: '8/10 hồ sơ', state: 'Đang xử lý', busy: false },
  { name: 'Đỗ Mai Linh', station: 'Nghiệp vụ', load: '4/5 ticket', state: 'Đang bận', busy: true },
  { name: 'Trần Thị B', station: 'Quầy 3', load: '6/12 hồ sơ', state: 'Đang xử lý', busy: false },
];

const hourlyActivity = [
  { hour: '08:00', count: 24 },
  { hour: '09:00', count: 48 },
  { hour: '10:00', count: 62 },
  { hour: '11:00', count: 54 },
  { hour: '12:00', count: 32 },
];

const tabOptions = [
  { id: 'all', label: 'Tất cả', count: 328, icon: Filter },
  { id: 'application', label: 'Hồ sơ', count: 142, icon: FileText },
  { id: 'ticket', label: 'Ticket', count: 86, icon: MessageCircle },
  { id: 'warning', label: 'Cảnh báo', count: 3, icon: AlertTriangle },
];

function Metric({ icon: Icon, label, value, hint, tone }) {
  return (
    <article className="department-activity-metric">
      <span className={`department-activity-metric-icon ${tone}`}><Icon size={19} /></span>
      <div><small>{label}</small><strong>{value}</strong><span>{hint}</span></div>
    </article>
  );
}

function ActivityTypeIcon({ category }) {
  if (category === 'warning') return <ShieldAlert size={16} />;
  if (category === 'ticket') return <MessageCircle size={16} />;
  return <FileText size={16} />;
}

export default function DepartmentActivityPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');
  const [staffFilter, setStaffFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState(DEPARTMENTS[0]);
  const [dateFilter, setDateFilter] = useState('today');
  const [live, setLive] = useState(true);
  const [expandedActivity, setExpandedActivity] = useState('');
  const [notice, setNotice] = useState('');

  const filteredActivities = useMemo(() => activityItems.filter((item) => {
    const matchesTab = activeTab === 'all'
      || (activeTab === 'warning' ? item.category === 'warning' : item.category === activeTab);
    const haystack = `${item.staff} ${item.student} ${item.code} ${item.service} ${item.description}`.toLocaleLowerCase('vi');
    const matchesQuery = haystack.includes(query.trim().toLocaleLowerCase('vi'));
    const matchesStaff = staffFilter === 'all' || item.staff === staffFilter;
    const matchesDepartment = item.department === departmentFilter;
    const matchesDate = dateFilter === 'all' || item.date === '2026-10-20';
    return matchesTab && matchesQuery && matchesStaff && matchesDepartment && matchesDate;
  }), [activeTab, query, staffFilter, departmentFilter, dateFilter]);

  const showNotice = (message) => setNotice(message);

  return (
    <main className="dashboard-page department-activity-page">
      <Link className="department-activity-back" to="/dashboard"><ArrowLeft size={16} /> Quay lại Bảng điều khiển</Link>
      <header className="department-activity-header">
        <div>
          <span className="dashboard-kicker">QUẢN LÝ PHÒNG BAN <span className="department-activity-crumb">›</span> BẢNG ĐIỀU KHIỂN <span className="department-activity-crumb">›</span> HOẠT ĐỘNG</span>
          <h1 className="page-title">Dòng hoạt động & Nhật ký phòng ban</h1>
          <p className="page-subtitle">Giám sát thao tác xử lý hồ sơ, tương tác sinh viên và lịch sử hoạt động của cán bộ.</p>
        </div>
      </header>

      <div className="department-activity-controls">
        <label>Đơn vị
          <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
            {DEPARTMENTS.map((department) => <option key={department}>{department}</option>)}
          </select>
        </label>
        <label>Thời gian
          <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
            <option value="today">Hôm nay (20/10/2026)</option>
            <option value="all">Tất cả thời gian</option>
          </select>
        </label>
        <button className={`department-activity-live ${live ? 'is-live' : ''}`} type="button" onClick={() => setLive((value) => !value)} aria-pressed={live}>
          <Radio size={16} /> {live ? 'Real-time Live (Đang bật)' : 'Real-time Live (Đang tạm dừng)'}
        </button>
      </div>

      <div className="department-activity-demo" role="note">
        <AlertTriangle size={15} /> Số liệu và hoạt động đang hiển thị là dữ liệu minh họa; nhật ký phòng ban chưa được kết nối API.
      </div>

      <section className="department-activity-metrics" aria-label="Tổng quan hoạt động hôm nay">
        <Metric icon={Timer} label="Tổng thao tác" value="328 lượt" hint="+12% so với hôm qua" tone="blue" />
        <Metric icon={FileText} label="Hồ sơ đã xử lý" value="142 thao tác" hint="Trong ngày hôm nay" tone="cyan" />
        <Metric icon={MessageCircle} label="Phản hồi ticket" value="86 phản hồi" hint="Từ cán bộ phòng ban" tone="violet" />
        <Metric icon={AlertTriangle} label="Cảnh báo / lỗi" value="3 cần rà soát" hint="Có hồ sơ quá hạn SLA" tone="amber" />
      </section>

      <div className="department-activity-layout">
        <section className="department-activity-timeline-panel">
          <div className="department-activity-tabs" role="tablist" aria-label="Lọc loại hoạt động">
            {tabOptions.map(({ id, label, count, icon: Icon }) => (
              <button key={id} className={activeTab === id ? 'active' : ''} type="button" role="tab" aria-selected={activeTab === id} onClick={() => setActiveTab(id)}>
                <Icon size={15} /> {label} <span>{count}</span>
              </button>
            ))}
          </div>
          <div className="department-activity-filters">
            <label className="department-activity-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên cán bộ, sinh viên, mã hồ sơ..." /></label>
            <label className="department-activity-staff-filter">Cán bộ
              <select value={staffFilter} onChange={(event) => setStaffFilter(event.target.value)}>
                <option value="all">Tất cả</option>
                {STAFF.map((name) => <option key={name}>{name}</option>)}
                <option>Trưởng phòng</option>
                <option>Hệ thống</option>
              </select>
            </label>
          </div>

          <div className="department-activity-list">
            {filteredActivities.map((item) => (
              <article className={`department-activity-item ${item.category === 'warning' ? 'is-warning' : ''}`} key={item.id}>
                <div className={`department-activity-type-icon ${item.category}`}><ActivityTypeIcon category={item.category} /></div>
                <div className="department-activity-item-content">
                  <div className="department-activity-item-meta"><time><Clock3 size={14} />{item.time}</time><span className={`department-activity-tag ${item.category}`}>{item.type}</span></div>
                  <p>{item.description}</p>
                  <div className="department-activity-item-actions">
                    {item.category === 'application' && <button type="button" onClick={() => showNotice(`Tệp ký của ${item.code} chưa có trong dữ liệu demo.`)}><FileText size={14} /> Xem file PDF đã ký</button>}
                    <button type="button" onClick={() => setExpandedActivity((current) => current === item.id ? '' : item.id)}><FileSearch size={14} /> {expandedActivity === item.id ? 'Ẩn chi tiết' : 'Xem chi tiết vết'}</button>
                  </div>
                  {expandedActivity === item.id && <div className="department-activity-detail"><strong>{item.code}</strong><span>{item.detail}</span></div>}
                </div>
              </article>
            ))}
            {filteredActivities.length === 0 && <div className="department-activity-empty">Không có hoạt động phù hợp với bộ lọc.</div>}
          </div>
        </section>

        <aside className="department-activity-widgets">
          <section className="department-activity-widget">
            <div className="department-activity-widget-heading"><div><span className="department-online-indicator" /><h2>Cán bộ đang online</h2></div><strong>4/6</strong></div>
            <ul className="department-online-list">
              {onlineStaff.map((person) => <li key={person.name}>
                <span className={`department-online-avatar ${person.busy ? 'busy' : ''}`}><UserRound size={15} /></span>
                <div><strong>{person.name}</strong><small>{person.station} · {person.load}</small></div>
                <span className={`department-online-state ${person.busy ? 'busy' : ''}`}>{person.state}</span>
              </li>)}
            </ul>
          </section>
          <section className="department-activity-widget">
            <div className="department-activity-widget-heading"><div><Clock3 size={16} /><h2>Phân bổ thao tác theo giờ</h2></div></div>
            <div className="department-hourly-list">
              {hourlyActivity.map((item) => <div className="department-hourly-row" key={item.hour}><span>{item.hour}</span><div><i style={{ width: `${(item.count / 70) * 100}%` }} /></div><strong>{item.count}</strong></div>)}
            </div>
          </section>
          <section className="department-activity-widget">
            <div className="department-activity-widget-heading"><div><FileText size={16} /><h2>Tỷ lệ loại hoạt động</h2></div></div>
            <ul className="department-activity-ratios">
              <li><span><i className="application" />Duyệt hồ sơ</span><strong>43.2%</strong></li>
              <li><span><i className="supplement" />Yêu cầu bổ sung</span><strong>22.5%</strong></li>
              <li><span><i className="ticket" />Phản hồi ticket</span><strong>26.2%</strong></li>
              <li><span><i className="warning" />Cảnh báo</span><strong>8.1%</strong></li>
            </ul>
          </section>
        </aside>
      </div>
      {notice && <div className="department-activity-notice" role="status"><CheckCircle2 size={16} /><span>{notice}</span><button type="button" aria-label="Đóng thông báo" onClick={() => setNotice('')}>×</button></div>}
    </main>
  );
}
