import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Send,
  StickyNote,
  UserRound,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './StudentLookupPage.css';

const STUDENTS = [
  {
    id: 'sv-21190001',
    fullName: 'Nguyễn Văn A',
    studentId: '21190001',
    citizenId: '001201012345',
    phone: '0912345678',
    email: 'sv001@humg.edu.vn',
    className: 'DH21KHM01',
    faculty: 'Công nghệ Thông tin',
    advisor: 'ThS. Nguyễn Văn B',
    status: 'Đang học',
    tuition: 'Đã hoàn tất HK1 2026–2027',
    year: '2026',
    major: 'Khoa học máy tính',
    applications: [
      { code: 'HS-2052', service: 'Chuyển đổi hình thức học', department: 'Phòng Đào tạo Đại học', date: '12/10/2026', status: 'Đang xử lý', tone: 'warning', sla: 'Còn 2 ngày', staff: 'Nguyễn Văn A', detail: 'Đơn xin chuyển đổi hình thức học đã được tiếp nhận, đang chờ xác nhận từ Phòng Đào tạo.' },
      { code: 'HS-2048', service: 'Cấp lại bảng điểm học tập', department: 'Phòng Công tác Chính trị - Sinh viên', date: '09/10/2026', status: 'Quá hạn 2 ngày', tone: 'danger', sla: 'Quá hạn 2 ngày', staff: 'Phạm Thu Hà', detail: 'Đang chờ xác minh kết quả học tập. Đã gửi thông báo phối hợp tới đơn vị phụ trách.' },
      { code: 'HS-1980', service: 'Giấy xác nhận sinh viên', department: 'Bộ phận Một cửa', date: '15/09/2026', status: 'Đã hoàn tất', tone: 'success', sla: 'Đúng hạn', staff: 'Lê Minh Tâm', detail: 'Giấy xác nhận đã được duyệt và phát hành ngày 17/09/2026.' },
    ],
    tickets: [
      { code: 'TK-0821', subject: 'Hỏi về lịch nhận giấy xác nhận', date: '11/10/2026', status: 'Đã phản hồi', appointment: 'Hẹn 14:00, 24/10/2026' },
      { code: 'TK-0763', subject: 'Hỗ trợ cập nhật thông tin lớp', date: '02/10/2026', status: 'Đã đóng', appointment: 'Không có lịch hẹn' },
    ],
    logs: [
      { date: '12/10/2026 08:30', author: 'Nguyễn Văn A - Quầy 1', action: 'Tiếp nhận đơn xin chuyển hình thức học, hồ sơ hợp lệ.' },
      { date: '09/10/2026 15:59', author: 'Phạm Thu Hà - CTSV', action: 'Đã nhắc sinh viên nộp bổ sung bản sao CCCD công chứng.' },
      { date: '15/09/2026 10:12', author: 'Lê Minh Tâm - Một cửa', action: 'Hoàn tất cấp giấy xác nhận sinh viên.' },
    ],
  },
  {
    id: 'sv-21190042',
    fullName: 'Trần Văn Bảo',
    studentId: '21190042',
    citizenId: '001201012346',
    phone: '0912345681',
    email: 'bao.tv21190042@humg.edu.vn',
    className: 'DH21KHM01',
    faculty: 'Công nghệ Thông tin',
    advisor: 'ThS. Nguyễn Văn B',
    status: 'Đang học',
    tuition: 'Còn 1 khoản cần đối soát',
    year: '2026',
    major: 'Khoa học máy tính',
    applications: [
      { code: 'HS-2088', service: 'Cấp lại thẻ sinh viên', department: 'Phòng Công tác Chính trị - Sinh viên', date: '10/10/2026', status: 'Chờ bổ sung', tone: 'warning', sla: 'Còn 1 ngày', staff: 'Phạm Thu Hà', detail: 'Cần bổ sung file scan CCCD mặt sau do ảnh tải lên bị mờ.' },
      { code: 'HS-2017', service: 'Xác nhận sinh viên', department: 'Bộ phận Một cửa', date: '24/09/2026', status: 'Đã hoàn tất', tone: 'success', sla: 'Đúng hạn', staff: 'Lê Minh Tâm', detail: 'Đã phát hành giấy xác nhận sinh viên.' },
      { code: 'HS-1932', service: 'Hỗ trợ học bổng', department: 'Phòng Công tác Chính trị - Sinh viên', date: '12/09/2026', status: 'Đã hoàn tất', tone: 'success', sla: 'Đúng hạn', staff: 'Nguyễn Thu Trang', detail: 'Hồ sơ học bổng đã được xét duyệt.' },
    ],
    tickets: [
      { code: 'TK-0840', subject: 'Thắc mắc về cấp lại thẻ sinh viên', date: '15/10/2026', status: 'Chờ phản hồi', appointment: 'Chưa đặt lịch' },
      { code: 'TK-0714', subject: 'Hỏi thủ tục xác nhận sinh viên', date: '26/09/2026', status: 'Đã đóng', appointment: 'Đã gặp tại quầy 26/09/2026' },
    ],
    logs: [
      { date: '20/10/2026 09:05', author: 'Phạm Thu Hà - CTSV', action: 'Yêu cầu sinh viên bổ sung ảnh CCCD mặt sau rõ nét.' },
      { date: '10/10/2026 11:24', author: 'Lê Minh Tâm - Một cửa', action: 'Tiếp nhận hồ sơ cấp lại thẻ sinh viên.' },
    ],
  },
  {
    id: 'sv-22190015',
    fullName: 'Lê Hoàng Long',
    studentId: '22190015',
    citizenId: '001202023456',
    phone: '0901234567',
    email: 'long.lh22190015@humg.edu.vn',
    className: 'DH22KHM02',
    faculty: 'Công nghệ Thông tin',
    advisor: 'TS. Trần Thị C',
    status: 'Đang học',
    tuition: 'Đã hoàn tất HK1 2026–2027',
    year: '2026',
    major: 'An toàn thông tin',
    applications: [
      { code: 'HS-2090', service: 'Cấp giấy xác nhận sinh viên', department: 'Bộ phận Một cửa', date: '18/10/2026', status: 'Chờ bổ sung', tone: 'warning', sla: 'Còn 3 ngày', staff: 'Nguyễn Văn A', detail: 'Cần cập nhật ảnh 3x4 nền trắng đúng quy cách.' },
      { code: 'HS-2001', service: 'Xác nhận vay vốn', department: 'Phòng Công tác Chính trị - Sinh viên', date: '30/09/2026', status: 'Đã hoàn tất', tone: 'success', sla: 'Đúng hạn', staff: 'Phạm Thu Hà', detail: 'Hồ sơ đã được xác nhận và trả kết quả.' },
      { code: 'HS-1964', service: 'Đăng ký học phần', department: 'Phòng Đào tạo Đại học', date: '18/09/2026', status: 'Đã hoàn tất', tone: 'success', sla: 'Đúng hạn', staff: 'Nguyễn Thu Trang', detail: 'Yêu cầu đăng ký bổ sung học phần đã được xử lý.' },
    ],
    tickets: [
      { code: 'TK-0851', subject: 'Hướng dẫn bổ sung ảnh hồ sơ', date: '19/10/2026', status: 'Đang xử lý', appointment: 'Hẹn 09:30, 23/10/2026' },
      { code: 'TK-0649', subject: 'Hỏi về lịch học phần', date: '20/09/2026', status: 'Đã đóng', appointment: 'Không có lịch hẹn' },
    ],
    logs: [
      { date: '19/10/2026 13:40', author: 'Nguyễn Văn A - Quầy 1', action: 'Gửi hướng dẫn quy cách ảnh 3x4 cho sinh viên.' },
      { date: '18/10/2026 08:55', author: 'Nguyễn Văn A - Quầy 1', action: 'Tiếp nhận hồ sơ xác nhận sinh viên.' },
    ],
  },
  {
    id: 'sv-20190145',
    fullName: 'Hoàng Thị Lan',
    studentId: '20190145',
    citizenId: '001200034567',
    phone: '0943456789',
    email: 'lan.ht20190145@humg.edu.vn',
    className: 'DH20KT03',
    faculty: 'Kinh tế',
    advisor: 'ThS. Lê Thu D',
    status: 'Đã tốt nghiệp',
    tuition: 'Đã hoàn tất toàn khóa',
    year: '2025',
    major: 'Kế toán',
    applications: [
      { code: 'HS-2047', service: 'Xác nhận vay vốn', department: 'Phòng Công tác Chính trị - Sinh viên', date: '18/10/2026', status: 'Chờ bổ sung', tone: 'warning', sla: 'Còn 1 ngày', staff: 'Phạm Thu Hà', detail: 'Cần bổ sung xác nhận của địa phương có chữ ký và dấu của UBND phường.' },
      { code: 'HS-1873', service: 'Cấp bảng điểm học tập', department: 'Phòng Đào tạo Đại học', date: '06/08/2026', status: 'Đã hoàn tất', tone: 'success', sla: 'Đúng hạn', staff: 'Lê Minh Tâm', detail: 'Bảng điểm đã được xác nhận và phát hành.' },
      { code: 'HS-1802', service: 'Giấy xác nhận tốt nghiệp', department: 'Bộ phận Một cửa', date: '22/07/2026', status: 'Đã hoàn tất', tone: 'success', sla: 'Đúng hạn', staff: 'Nguyễn Thu Trang', detail: 'Giấy xác nhận tốt nghiệp đã được cấp.' },
    ],
    tickets: [
      { code: 'TK-0753', subject: 'Hỏi về xác nhận vay vốn', date: '19/10/2026', status: 'Đang xử lý', appointment: 'Hẹn 10:00, 23/10/2026' },
      { code: 'TK-0620', subject: 'Tra cứu bảng điểm', date: '06/08/2026', status: 'Đã đóng', appointment: 'Không có lịch hẹn' },
    ],
    logs: [
      { date: '18/10/2026 14:05', author: 'Phạm Thu Hà - CTSV', action: 'Thông báo bổ sung xác nhận vay vốn có dấu của địa phương.' },
      { date: '06/08/2026 09:10', author: 'Lê Minh Tâm - Một cửa', action: 'Trả kết quả bảng điểm học tập cho sinh viên.' },
    ],
  },
];

const INITIAL_QUERY = '21190001';
const TABS = [
  { id: 'applications', label: 'Lịch sử hồ sơ & thủ tục', icon: FileText },
  { id: 'study', label: 'Thông tin học tập & đào tạo', icon: GraduationCap },
  { id: 'tickets', label: 'Lịch sử ticket & lịch hẹn', icon: MessageSquare },
];

function exportStudentData(student) {
  const rows = [
    ['Mã hồ sơ', 'Dịch vụ', 'Phòng ban', 'Ngày nộp', 'Trạng thái', 'SLA'],
    ...student.applications.map((item) => [item.code, item.service, item.department, item.date, item.status, item.sla]),
  ];
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\r\n')}`;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `lich-su-dich-vu-${student.studentId}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function StudentLookupPage() {
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [submittedQuery, setSubmittedQuery] = useState(INITIAL_QUERY);
  const [facultyFilter, setFacultyFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [yearFilter, setYearFilter] = useState('2026');
  const [activeTab, setActiveTab] = useState('applications');
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState({});
  const [toast, setToast] = useState('');

  const matches = useMemo(() => {
    const search = submittedQuery.trim().toLocaleLowerCase('vi');
    return STUDENTS.filter((student) => {
      const matchesQuery = !search
        || `${student.studentId} ${student.fullName} ${student.citizenId} ${student.phone} ${student.applications.map((item) => item.code).join(' ')}`
          .toLocaleLowerCase('vi')
          .includes(search);
      const matchesFaculty = facultyFilter === 'ALL' || student.faculty === facultyFilter;
      const matchesClass = classFilter === 'ALL' || student.className === classFilter;
      const matchesStatus = statusFilter === 'ALL'
        || (statusFilter === 'ACTIVE' && student.status === 'Đang học')
        || (statusFilter === 'GRADUATED' && student.status === 'Đã tốt nghiệp');
      const matchesYear = yearFilter === 'ALL' || student.year === yearFilter;
      return matchesQuery && matchesFaculty && matchesClass && matchesStatus && matchesYear;
    });
  }, [classFilter, facultyFilter, statusFilter, submittedQuery, yearFilter]);

  const student = matches[0] || null;
  const studentLogs = [...(student ? logs[student.id] || [] : []), ...(student?.logs || [])];

  const showToast = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(''), 3500);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSubmittedQuery(query);
    setActiveTab('applications');
  };

  const resetSearch = () => {
    setQuery('');
    setSubmittedQuery('');
    setFacultyFilter('ALL');
    setClassFilter('ALL');
    setStatusFilter('ALL');
    setYearFilter('ALL');
  };

  const saveNote = () => {
    if (!student || !note.trim()) return;
    const entry = {
      date: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
      author: 'Nhân viên đang đăng nhập',
      action: note.trim(),
    };
    setLogs((current) => ({ ...current, [student.id]: [entry, ...(current[student.id] || [])] }));
    setModal(null);
    setNote('');
    showToast('Đã lưu ghi chú nội bộ cho hồ sơ sinh viên.');
  };

  const sendMessage = () => {
    if (!student || !message.trim()) return;
    setModal(null);
    setMessage('');
    showToast(`Đã mô phỏng gửi thông báo tới ${student.fullName}; không gửi email thật.`);
  };

  const createRequest = () => {
    if (!student) return;
    setModal(null);
    showToast(`Đã tạo yêu cầu mẫu cho ${student.fullName}. Chưa gửi yêu cầu thật vào hệ thống.`);
  };

  return (
    <main className="dashboard-page student-lookup-page">
      <header className="lookup-header">
        <div>
          <Link className="lookup-back-link" to="/dashboard"><ArrowLeft size={16} /> Quay lại Dashboard</Link>
          <span className="dashboard-kicker">QUẢN LÝ PHÒNG BAN / CƠ SỞ DỮ LIỆU &amp; TRA CỨU</span>
          <h1 className="page-title">Tra cứu hồ sơ &amp; lịch sử dịch vụ sinh viên</h1>
          <p className="page-subtitle">Truy vấn lý lịch sinh viên, lịch sử nộp thủ tục, trạng thái hồ sơ và nhật ký tương tác.</p>
        </div>
      </header>

      <div className="lookup-demo-banner"><CheckCircle2 size={16} /> Dữ liệu sinh viên và lịch sử trên trang này là dữ liệu mẫu phục vụ trình diễn.</div>

      <form className="lookup-search-panel" onSubmit={handleSearch}>
        <label className="lookup-main-search">
          <Search size={21} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nhập MSSV, họ tên, số CCCD, số điện thoại hoặc mã hồ sơ..."
            aria-label="Tìm kiếm hồ sơ sinh viên"
          />
        </label>
        <div className="lookup-filters">
          <label>
            <span>Khoa</span>
            <select value={facultyFilter} onChange={(event) => setFacultyFilter(event.target.value)}>
              <option value="ALL">Tất cả khoa</option>
              <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
              <option value="Kinh tế">Kinh tế</option>
            </select>
          </label>
          <label>
            <span>Lớp</span>
            <select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}>
              <option value="ALL">Tất cả lớp</option>
              {[...new Set(STUDENTS.map((item) => item.className))].map((className) => <option value={className} key={className}>{className}</option>)}
            </select>
          </label>
          <label>
            <span>Trạng thái sinh viên</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ACTIVE">Đang học</option>
              <option value="GRADUATED">Đã tốt nghiệp</option>
              <option value="ALL">Tất cả trạng thái</option>
            </select>
          </label>
          <label>
            <span>Năm học</span>
            <select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
              <option value="2026">2026–2027</option>
              <option value="2025">2025–2026</option>
              <option value="ALL">Tất cả năm học</option>
            </select>
          </label>
        </div>
        <div className="lookup-search-actions">
          <button type="submit" className="btn btn-primary"><Search size={16} /> Tìm kiếm</button>
          <button type="button" className="btn btn-outline" onClick={resetSearch}><RotateCcw size={16} /> Đặt lại</button>
          <button type="button" className="btn btn-outline" disabled={!student} onClick={() => student && exportStudentData(student)}><Download size={16} /> Xuất dữ liệu</button>
        </div>
      </form>

      {!student ? (
        <section className="lookup-empty-state">
          <UserRound size={30} />
          <h2>Không tìm thấy sinh viên phù hợp</h2>
          <p>Kiểm tra lại thông tin tìm kiếm hoặc bộ lọc rồi thử lại.</p>
        </section>
      ) : (
        <>
          <section className="lookup-profile-card">
            <div className="lookup-profile-heading">
              <div className="lookup-avatar">{student.fullName.trim().charAt(0)}</div>
              <div className="lookup-profile-name">
                <div className="lookup-name-line"><h2>{student.fullName}</h2><span className="lookup-student-status"><i />{student.status} · Chính quy</span></div>
                <span>MSSV: <strong>{student.studentId}</strong></span>
              </div>
            </div>
            <div className="lookup-profile-grid">
              <div><span>Lớp sinh hoạt</span><strong>{student.className}</strong></div>
              <div><span>Khoa · Chuyên ngành</span><strong>{student.faculty} · {student.major}</strong></div>
              <div><span>Email sinh viên</span><strong>{student.email}</strong></div>
              <div><span>Số điện thoại</span><strong>{student.phone}</strong></div>
              <div><span>Cố vấn học tập</span><strong>{student.advisor}</strong></div>
              <div><span>Tình trạng lệ phí</span><strong className={student.tuition.startsWith('Đã') ? 'lookup-tuition-ok' : 'lookup-tuition-pending'}>{student.tuition}</strong></div>
            </div>
          </section>

          <section className="lookup-workspace">
            <div className="lookup-tabs" role="tablist" aria-label="Thông tin tra cứu sinh viên">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  className={activeTab === id ? 'active' : ''}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon size={17} />{label}
                  {id === 'applications' && <span>{student.applications.length}</span>}
                  {id === 'tickets' && <span>{student.tickets.length}</span>}
                </button>
              ))}
            </div>

            {activeTab === 'applications' && (
              <div className="lookup-tab-content">
                <div className="lookup-section-title">
                  <div><h2>Lịch sử hồ sơ &amp; thủ tục đã nộp</h2><p>Trạng thái xử lý và thời hạn dịch vụ của sinh viên.</p></div>
                  <span>{student.applications.length} hồ sơ</span>
                </div>
                <div className="lookup-table-wrap">
                  <table className="lookup-table">
                    <thead><tr><th>Mã hồ sơ</th><th>Tên dịch vụ / thủ tục</th><th>Phòng ban thụ lý</th><th>Ngày nộp</th><th>Trạng thái SLA</th><th>Thao tác</th></tr></thead>
                    <tbody>
                      {student.applications.map((application) => (
                        <tr key={application.code}>
                          <td><strong className="lookup-code">{application.code}</strong></td>
                          <td>{application.service}</td>
                          <td>{application.department}</td>
                          <td>{application.date}</td>
                          <td><span className={`lookup-app-status ${application.tone}`}><i />{application.status}<small>{application.sla}</small></span></td>
                          <td>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => setModal({ type: 'application', item: application })}>
                              <Search size={14} /> Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'study' && (
              <div className="lookup-tab-content">
                <div className="lookup-section-title"><div><h2>Thông tin học tập &amp; đào tạo</h2><p>Tóm tắt thông tin học vụ hiện có trong hồ sơ mẫu.</p></div></div>
                <div className="lookup-study-grid">
                  <article><BookOpen size={19} /><span>Chương trình đào tạo</span><strong>{student.major}</strong><small>Đại học chính quy · Khóa {student.studentId.slice(0, 2)}</small></article>
                  <article><GraduationCap size={19} /><span>Khoa quản lý</span><strong>{student.faculty}</strong><small>Lớp sinh hoạt {student.className}</small></article>
                  <article><CalendarDays size={19} /><span>Năm học đang theo học</span><strong>2026–2027</strong><small>Học kỳ 1</small></article>
                  <article><CheckCircle2 size={19} /><span>Tình trạng học vụ</span><strong>{student.status}</strong><small>{student.tuition}</small></article>
                </div>
                <div className="lookup-study-note"><Clock3 size={17} /> Bảng điểm chi tiết và kết quả học tập cần tra cứu từ hệ thống đào tạo chuyên ngành.</div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="lookup-tab-content">
                <div className="lookup-section-title"><div><h2>Lịch sử ticket &amp; lịch hẹn</h2><p>Các yêu cầu hỗ trợ và lịch làm việc với sinh viên.</p></div><span>{student.tickets.length} yêu cầu</span></div>
                <div className="lookup-ticket-list">
                  {student.tickets.map((ticket) => (
                    <article key={ticket.code}>
                      <div className="lookup-ticket-icon"><MessageSquare size={18} /></div>
                      <div className="lookup-ticket-copy"><strong>{ticket.subject}</strong><span>{ticket.code} · Gửi ngày {ticket.date}</span><small><CalendarDays size={14} />{ticket.appointment}</small></div>
                      <span className={`lookup-ticket-status ${ticket.status === 'Đã đóng' || ticket.status === 'Đã phản hồi' ? 'done' : 'pending'}`}>{ticket.status}</span>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="lookup-logs-panel">
            <div className="lookup-section-title"><div><h2><StickyNote size={18} /> Nhật ký tương tác &amp; ghi chú cán bộ</h2><p>Lịch sử thao tác nội bộ liên quan đến sinh viên.</p></div></div>
            <div className="lookup-timeline">
              {studentLogs.map((log, index) => (
                <article key={`${log.date}-${index}`}>
                  <span className="lookup-timeline-dot" />
                  <time>{log.date}</time>
                  <div><strong>{log.author}</strong><p>{log.action}</p></div>
                </article>
              ))}
            </div>
            <div className="lookup-quick-actions">
              <button type="button" className="btn btn-outline" onClick={() => { setNote(''); setModal({ type: 'note' }); }}><StickyNote size={16} /> Thêm ghi chú mới</button>
              <button type="button" className="btn btn-outline" onClick={() => { setMessage(`Thân gửi ${student.fullName}, Phòng Công tác Chính trị - Sinh viên gửi bạn thông tin liên quan đến hồ sơ ${student.applications[0]?.code || ''}.`); setModal({ type: 'message' }); }}><Mail size={16} /> Gửi Email / Notification</button>
              <button type="button" className="btn btn-primary" onClick={() => { setMessage(''); setModal({ type: 'new-request' }); }}><Plus size={16} /> Tạo yêu cầu mới hộ SV</button>
            </div>
          </section>
        </>
      )}

      {toast && <div className="lookup-toast" role="status"><Check size={17} />{toast}</div>}

      {modal && (
        <div className="lookup-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
          <section className="lookup-modal" role="dialog" aria-modal="true" aria-labelledby="lookup-modal-title">
            <header>
              <div>
                <span className="dashboard-kicker">{modal.type === 'application' ? 'CHI TIẾT HỒ SƠ' : modal.type === 'note' ? 'GHI CHÚ NỘI BỘ' : modal.type === 'message' ? 'LIÊN HỆ SINH VIÊN' : 'TẠO YÊU CẦU HỘ SINH VIÊN'}</span>
                <h2 id="lookup-modal-title">{modal.type === 'application' ? `${modal.item.code} · ${modal.item.service}` : modal.type === 'note' ? 'Thêm ghi chú mới' : modal.type === 'message' ? 'Gửi Email / Notification' : 'Tạo yêu cầu mới'}</h2>
              </div>
              <button type="button" aria-label="Đóng" onClick={() => setModal(null)}><X size={19} /></button>
            </header>
            {modal.type === 'application' ? (
              <div className="lookup-modal-content">
                <p><strong>Phòng ban:</strong> {modal.item.department}</p>
                <p><strong>Ngày nộp:</strong> {modal.item.date}</p>
                <p><strong>Trạng thái SLA:</strong> {modal.item.status} · {modal.item.sla}</p>
                <p><strong>Cán bộ phụ trách:</strong> {modal.item.staff}</p>
                <p><strong>Diễn giải:</strong> {modal.item.detail}</p>
              </div>
            ) : modal.type === 'note' ? (
              <div className="lookup-modal-content">
                <label className="lookup-modal-field"><span>Nội dung ghi chú nội bộ</span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={5} placeholder="Nhập nội dung ghi chú..." autoFocus /></label>
              </div>
            ) : modal.type === 'message' ? (
              <div className="lookup-modal-content">
                <div className="lookup-message-recipient"><Mail size={16} />{student?.email} · <Phone size={15} />{student?.phone}</div>
                <p className="lookup-demo-note">Mô phỏng thao tác, email/thông báo sẽ không được gửi thật.</p>
                <label className="lookup-modal-field"><span>Nội dung thông báo</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={5} /></label>
              </div>
            ) : (
              <div className="lookup-modal-content">
                <p className="lookup-demo-note">Tạo bản nháp yêu cầu mẫu, không gửi hồ sơ thật vào hệ thống.</p>
                <label className="lookup-modal-field"><span>Dịch vụ</span><select value={message} onChange={(event) => setMessage(event.target.value)}><option value="">Chọn dịch vụ</option><option>Cấp giấy xác nhận sinh viên</option><option>Cấp lại thẻ sinh viên</option><option>Xác nhận vay vốn</option><option>Hỗ trợ học bổng</option></select></label>
              </div>
            )}
            <footer>
              <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Đóng</button>
              {modal.type === 'note' && <button type="button" className="btn btn-primary" disabled={!note.trim()} onClick={saveNote}><CheckCircle2 size={16} /> Lưu ghi chú</button>}
              {modal.type === 'message' && <button type="button" className="btn btn-primary" disabled={!message.trim()} onClick={sendMessage}><Send size={16} /> Gửi mô phỏng</button>}
              {modal.type === 'new-request' && <button type="button" className="btn btn-primary" disabled={!message} onClick={createRequest}><Plus size={16} /> Tạo bản nháp</button>}
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
