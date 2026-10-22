import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, Bell, CheckCircle2, Clock3, Download,
  Search, Timer, Zap,
} from 'lucide-react';
import './ApplicationProgressPage.css';

const departments = ['Tất cả phòng ban', 'Bộ phận Một cửa', 'Phòng Đào tạo', 'Phòng Kế hoạch tài chính'];

const initialApplications = [
  {
    code: 'HS-2052',
    student: 'Nguyễn Văn Tâm',
    studentId: '21190012',
    service: 'Chuyển hình thức học',
    department: 'Bộ phận Một cửa',
    percent: 75,
    stage: 3,
    slaHours: 3,
    slaMinutes: 15,
    overdueDays: 0,
    staff: 'Nguyễn Văn A',
    station: 'Quầy 1',
    startedAt: '12/10/2026',
    route: [
      { title: 'Tiếp nhận & kiểm tra hồ sơ', time: '12/10/2026 · 08:30', owner: 'Cán bộ Nguyễn Văn A', state: 'done' },
      { title: 'Thẩm định chuyên môn', time: '12/10/2026 · 10:15', owner: 'Phòng Đào tạo ĐH', state: 'done' },
      { title: 'Phê duyệt & ký số', time: 'Đang xử lý', owner: 'Trưởng phòng KHTC · Chờ ký', state: 'current' },
      { title: 'Trả kết quả bản cứng', time: 'Chờ bước 3', owner: 'Quầy số 1 · Bộ phận 1 cửa', state: 'upcoming' },
    ],
  },
  {
    code: 'HS-2048',
    student: 'Trần Thị Mai',
    studentId: '20190045',
    service: 'Cấp lại Bảng điểm',
    department: 'Phòng Đào tạo',
    percent: 40,
    stage: 2,
    slaHours: 0,
    slaMinutes: 0,
    overdueDays: 2,
    staff: 'Phạm Thu Hà',
    station: 'Phòng Đào tạo',
    startedAt: '16/10/2026',
    route: [
      { title: 'Tiếp nhận & kiểm tra hồ sơ', time: '16/10/2026 · 08:30', owner: 'Cán bộ Phạm Thu Hà', state: 'done' },
      { title: 'Thẩm định chuyên môn', time: 'Quá hạn 02 ngày', owner: 'Phòng Đào tạo', state: 'current' },
      { title: 'Phê duyệt & ký số', time: 'Chờ bước 2', owner: '', state: 'upcoming' },
      { title: 'Trả kết quả tại Quầy Một cửa', time: 'Chờ bước 3', owner: '', state: 'upcoming' },
    ],
  },
  {
    code: 'HS-2055',
    student: 'Lê Hoàng Nam',
    studentId: '21190103',
    service: 'Giấy xác nhận SV',
    department: 'Bộ phận Một cửa',
    percent: 90,
    stage: 3,
    slaHours: 8,
    slaMinutes: 30,
    overdueDays: 0,
    staff: 'Đỗ Mai Linh',
    station: 'Quầy 1',
    startedAt: '19/10/2026',
    route: [
      { title: 'Tiếp nhận & kiểm tra tệp', time: '19/10/2026 · 09:10', owner: 'Cán bộ Đỗ Mai Linh', state: 'done' },
      { title: 'Thẩm định chuyên môn', time: '19/10/2026 · 11:20', owner: 'Phòng Đào tạo', state: 'done' },
      { title: 'Phê duyệt & ký số điện tử', time: 'Đang xử lý', owner: 'Trưởng phòng KHTC · Chờ ký', state: 'current' },
      { title: 'Trả kết quả bản cứng', time: 'Chờ bước 3', owner: 'Quầy số 1 · Bộ phận 1 cửa', state: 'upcoming' },
    ],
  },
  {
    code: 'HS-2094',
    student: 'Phạm Minh Đức',
    studentId: '20190067',
    service: 'Hỗ trợ học phí',
    department: 'Phòng Kế hoạch tài chính',
    percent: 50,
    stage: 2,
    slaHours: 0,
    slaMinutes: 0,
    overdueDays: 2,
    staff: 'Đỗ Mai Linh',
    station: 'Phòng KHTC',
    startedAt: '16/10/2026',
    route: [
      { title: 'Tiếp nhận & kiểm tra hồ sơ', time: '16/10/2026 · 10:05', owner: 'Cán bộ Đỗ Mai Linh', state: 'done' },
      { title: 'Thẩm định chuyên môn', time: 'Quá hạn 02 ngày', owner: 'Phòng Kế hoạch tài chính', state: 'current' },
      { title: 'Phê duyệt & ký số', time: 'Chờ bước 2', owner: '', state: 'upcoming' },
      { title: 'Trả kết quả tại Quầy Một cửa', time: 'Chờ bước 3', owner: '', state: 'upcoming' },
    ],
  },
];

const stageSummary = [
  { title: 'Tiếp nhận', count: 6, percent: 100 },
  { title: 'Thẩm định', count: 12, percent: 65 },
  { title: 'Phê duyệt', count: 11, percent: 80 },
  { title: 'Trả kết quả', count: 5, percent: 40 },
];

function ProgressMetric({ icon: Icon, label, value, detail, tone }) {
  return (
    <article className="application-progress-metric">
      <span className={`application-progress-metric-icon ${tone}`}><Icon size={19} /></span>
      <div><small>{label}</small><strong>{value}</strong><span>{detail}</span></div>
    </article>
  );
}

export default function ApplicationProgressPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [query, setQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Tất cả phòng ban');
  const [slaFilter, setSlaFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [message, setMessage] = useState('');

  const filteredApplications = useMemo(() => applications.filter((application) => {
    const search = `${application.code} ${application.student} ${application.studentId} ${application.service} ${application.staff}`.toLocaleLowerCase('vi');
    const matchesQuery = search.includes(query.trim().toLocaleLowerCase('vi'));
    const matchesDepartment = departmentFilter === 'Tất cả phòng ban' || application.department === departmentFilter;
    const matchesSla = slaFilter === 'all' || (slaFilter === 'overdue' ? application.overdueDays > 0 : application.overdueDays === 0);
    return matchesQuery && matchesDepartment && matchesSla;
  }), [applications, query, departmentFilter, slaFilter]);

  const nudgeApplication = (application) => setMessage(`Đã tạo lời nhắc mẫu cho hồ sơ ${application.code}; chưa gửi thông báo thật.`);
  const nudgeOverdueApplications = () => {
    if (overdueCount === 0) {
      setMessage('Hiện không có hồ sơ quá hạn cần đôn đốc.');
      return;
    }
    setMessage(`Đã ghi nhận thao tác đôn đốc ${overdueCount} hồ sơ quá hạn trong bản xem trước; chưa gửi thông báo thật.`);
  };
  const exportReport = () => {
    const rows = [
      ['Mã hồ sơ', 'Sinh viên', 'MSSV', 'Dịch vụ', 'Tiến độ', 'Bước', 'SLA', 'Cán bộ'],
      ...filteredApplications.map((application) => [
        application.code,
        application.student,
        application.studentId,
        application.service,
        `${application.percent}%`,
        `${application.stage}/4`,
        application.overdueDays > 0 ? `Quá hạn ${application.overdueDays} ngày` : `Còn ${application.slaHours}g ${application.slaMinutes}m`,
        application.staff,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'bao-cao-tien-do-ho-so.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(`Đã xuất báo cáo gồm ${filteredApplications.length} hồ sơ đang hiển thị.`);
  };
  const expediteApplication = (application) => {
    setApplications((current) => current.map((item) => item.code === application.code ? { ...item, overdueDays: 0, slaHours: 1, slaMinutes: 30 } : item));
    setMessage(`Đã đánh dấu hồ sơ ${application.code} cần xử lý gấp trong bản xem trước.`);
  };

  const activeCount = 34;
  const overdueCount = 5;
  const onTrackCount = activeCount - overdueCount;

  return (
    <main className="dashboard-page application-progress-page">
      <Link className="application-progress-back" to="/dashboard/ho-so-dang-xu-ly"><ArrowLeft size={16} /> Quay lại Hồ sơ đang xử lý</Link>
      <header className="application-progress-header">
        <div>
          <span className="dashboard-kicker">QUẢN LÝ HỒ SƠ &amp; THỦ TỤC <span>›</span> HỒ SƠ ĐANG XỬ LÝ <span>›</span> TIẾN ĐỘ</span>
          <h1 className="page-title">Giám sát Tiến độ xử lý &amp; SLA</h1>
          <p className="page-subtitle">Theo dõi từng công đoạn, thời gian đếm ngược hoàn thành và phát hiện các ca tắc nghẽn.</p>
        </div>
        <div className="application-progress-header-actions">
          <button type="button" onClick={exportReport}><Download size={16} /> Xuất báo cáo</button>
          <button type="button" className="overdue" onClick={nudgeOverdueApplications}><Bell size={16} /> Đôn đốc quá hạn ({overdueCount})</button>
        </div>
      </header>

      <div className="application-progress-searchbar">
        <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo mã HS (HS-2052), MSSV, tên sinh viên..." /></label>
        <select aria-label="Lọc phòng ban" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>{departments.map((department) => <option key={department}>{department}</option>)}</select>
        <select aria-label="Lọc SLA" value={slaFilter} onChange={(event) => setSlaFilter(event.target.value)}><option value="all">Tất cả SLA</option><option value="on-track">Đúng tiến độ</option><option value="overdue">Quá hạn</option></select>
      </div>

      <div className="application-progress-demo"><AlertTriangle size={15} /> Dữ liệu hồ sơ và SLA trên trang này là dữ liệu minh họa, chưa được kết nối API.</div>

      <section className="application-progress-metrics">
        <ProgressMetric icon={Timer} label="Đang theo dõi" value={`${activeCount} hồ sơ`} detail="Toàn bộ hồ sơ đang xử lý" tone="blue" />
        <ProgressMetric icon={CheckCircle2} label="Đúng tiến độ (SLA)" value={`${onTrackCount} hồ sơ`} detail={`${((onTrackCount / activeCount) * 100).toFixed(1)}% tổng số`} tone="green" />
        <ProgressMetric icon={AlertTriangle} label="Quá hạn / nghẽn" value={`${overdueCount} hồ sơ`} detail={`${((overdueCount / activeCount) * 100).toFixed(1)}% tổng số`} tone="red" />
        <ProgressMetric icon={Clock3} label="Thời gian TB / bước" value="4.2 giờ" detail="Trung bình mỗi công đoạn" tone="violet" />
      </section>

      <section className="application-stage-section">
        <div className="application-progress-section-heading"><div><h2>Ma trận luồng tiến độ 4 bước</h2><p>Phân bố hồ sơ theo công đoạn xử lý.</p></div></div>
        <div className="application-stage-list">
          {stageSummary.map((stage, index) => <div className="application-stage-wrap" key={stage.title}>
            <article className="application-stage-card"><span className="application-stage-number">BƯỚC 0{index + 1}</span><strong>{stage.title}</strong><b>{stage.count} hồ sơ <small>({stage.percent}%)</small></b><div className="application-stage-progress"><span style={{ width: `${stage.percent}%` }} /></div></article>
            {index < stageSummary.length - 1 && <span className="application-stage-arrow" aria-hidden="true">→</span>}
          </div>)}
        </div>
      </section>

      <section className="application-progress-table-section">
        <div className="application-progress-section-heading"><div><h2>Giám sát tiến độ chi tiết</h2><p>{filteredApplications.length} hồ sơ hiển thị · chọn lộ trình để xem lịch sử công đoạn.</p></div></div>
        <div className="application-progress-table-wrap">
          <table className="application-progress-table">
            <thead><tr><th>Mã hồ sơ</th><th>Sinh viên</th><th>Dịch vụ</th><th>Tiến độ</th><th>Đồng hồ SLA</th><th>Cán bộ thụ lý</th><th>Thao tác</th></tr></thead>
            <tbody>
              {filteredApplications.map((application) => <tr key={application.code}>
                <td><strong>{application.code}</strong></td>
                <td><strong>{application.student}</strong><small>{application.studentId}</small></td>
                <td>{application.service}</td>
                <td><div className="application-progress-cell"><div className="application-progress-track"><span style={{ width: `${application.percent}%` }} /></div><strong>{application.percent}%</strong><small>Bước {application.stage}/4</small></div></td>
                <td>{application.overdueDays > 0 ? <span className="application-sla overdue"><AlertTriangle size={15} /> Quá hạn {String(application.overdueDays).padStart(2, '0')} ngày<small>Trễ hẹn SLA</small></span> : <span className="application-sla"><Clock3 size={15} /> Còn {String(application.slaHours).padStart(2, '0')}g {String(application.slaMinutes).padStart(2, '0')}m<small>Đúng tiến độ</small></span>}</td>
                <td><strong>{application.staff}</strong><small>({application.station})</small></td>
                <td><div className="application-progress-actions"><button type="button" onClick={() => setSelectedApplication(application)}><Search size={14} /> Lộ trình</button><button type="button" className={application.overdueDays > 0 ? 'urgent' : ''} onClick={() => application.overdueDays > 0 ? expediteApplication(application) : nudgeApplication(application)}><Zap size={14} /> {application.overdueDays > 0 ? 'Chuyển gấp' : 'Đôn đốc'}</button></div></td>
              </tr>)}
              {filteredApplications.length === 0 && <tr><td colSpan="7" className="application-progress-empty">Không tìm thấy hồ sơ phù hợp.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {selectedApplication && <div className="application-route-backdrop" role="presentation" onClick={() => setSelectedApplication(null)}>
        <section className="application-route-modal" role="dialog" aria-modal="true" aria-labelledby="application-route-title" onClick={(event) => event.stopPropagation()}>
          <button className="application-route-close" type="button" aria-label="Đóng lộ trình" onClick={() => setSelectedApplication(null)}>×</button>
          <span className="dashboard-kicker">LỘ TRÌNH TIẾN ĐỘ HỒ SƠ</span>
          <h2 id="application-route-title">Lộ trình hồ sơ #{selectedApplication.code} ({selectedApplication.student})</h2>
          <p className="application-route-student">{selectedApplication.student} · MSSV: {selectedApplication.studentId}</p>
          <div className="application-route-list">
            {selectedApplication.route.map((step, index) => <article className={`application-route-step ${step.state}`} key={step.title}>
              <span className="application-route-step-icon">{step.state === 'done' ? <CheckCircle2 size={18} /> : step.state === 'current' ? <Timer size={18} /> : <span />}</span>
              <div><strong>Bước {index + 1}: {step.title}</strong><small>{step.time}</small>{step.owner && <small>{step.owner}</small>}</div>
            </article>)}
          </div>
        </section>
      </div>}
      {message && <div className="application-progress-toast" role="status"><span>{message}</span><button type="button" aria-label="Đóng thông báo" onClick={() => setMessage('')}>×</button></div>}
    </main>
  );
}
