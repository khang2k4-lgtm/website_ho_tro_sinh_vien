import { ArrowRight, Building2, CalendarDays, CheckCheck, Clock3, FileCheck2, FileText, Inbox, MessageSquareText, Printer, Search, Settings, ShieldCheck, Sparkles, Ticket, Users, WalletCards } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const defaultConfig = {
  kicker: 'BẢNG ĐIỀU KHIỂN',
  title: 'Cổng làm việc nhân viên',
  subtitle: 'Theo dõi công việc, lịch trực và tiến độ xử lý hồ sơ sinh viên.',
  actionLabel: 'Mở quy trình',
  actionTo: '/dashboard/ho-so',
  statCards: [
    { label: 'Tổng hồ sơ', value: '128', tone: 'blue', icon: Inbox },
    { label: 'Chờ xử lý', value: '18', tone: 'amber', icon: Clock3 },
    { label: 'Đang xử lý', value: '34', tone: 'cyan', icon: FileText },
    { label: 'Hoàn thành', value: '76', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Tiếp nhận hồ sơ mới', detail: '12 hồ sơ chưa phân luồng trong 2 giờ qua.', time: '08:45', tone: 'info' },
    { title: 'Duyệt hồ sơ cần bổ sung', detail: '5 sinh viên cần bổ sung giấy tờ để hoàn tất.', time: '09:15', tone: 'warning' },
    { title: 'Ticket hỗ trợ', detail: '3 yêu cầu chưa phản hồi từ sinh viên.', time: '10:20', tone: 'success' },
  ],
  schedule: [
    { title: 'Lịch trực quầy', detail: 'Phòng Học vụ · 08:00 - 12:00', status: 'Đang trực', tone: 'success' },
    { title: 'Hẹn gặp cố vấn', detail: '5 cuộc hẹn đã xác nhận', status: 'Sắp tới', tone: 'info' },
    { title: 'Nhiệm vụ ký số', detail: '12 tập tin chờ ký tập trung', status: 'Chờ duyệt', tone: 'warning' },
  ],
  rows: [
    { code: 'HS-2025-3321', student: 'Nguyễn Thị Lan', service: 'Xác nhận sinh viên', date: '14/10/2026', status: 'Mới', tone: 'info' },
    { code: 'HS-2025-3327', student: 'Trần Văn Hùng', service: 'Cấp giấy xác nhận', date: '14/10/2026', status: 'Đang xử lý', tone: 'warning' },
    { code: 'HS-2025-3331', student: 'Phạm Mai Anh', service: 'Đăng ký học phần', date: '13/10/2026', status: 'Chờ bổ sung', tone: 'warning' },
    { code: 'HS-2025-3342', student: 'Bùi Quốc Đạt', service: 'Cấp lại thẻ sinh viên', date: '13/10/2026', status: 'Hoàn thành', tone: 'success' },
  ],
};

function badgeClass(tone) {
  if (tone === 'info') return 'badge-info';
  if (tone === 'success') return 'badge-success';
  if (tone === 'warning') return 'badge-warning';
  if (tone === 'danger') return 'badge-danger';
  return 'badge-neutral';
}

function StaffPortalPage({
  kicker = defaultConfig.kicker,
  title = defaultConfig.title,
  subtitle = defaultConfig.subtitle,
  actionLabel = defaultConfig.actionLabel,
  actionTo = defaultConfig.actionTo,
  statCards = defaultConfig.statCards,
  focusItems = defaultConfig.focusItems,
  schedule = defaultConfig.schedule,
  rows = defaultConfig.rows,
  tableTitle = 'Danh sách công việc',
  detailPanels = [],
}) {
  return (
    <div className="dashboard-page staff-portal-page">
      <div className="staff-dashboard-header">
        <div>
          <span className="dashboard-kicker">{kicker}</span>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <Link className="btn btn-primary" to={actionTo}>
          {actionLabel} <ArrowRight size={16} />
        </Link>
      </div>

      <div className="staff-stat-grid">
        {statCards.map(({ label, value, tone, icon: Icon }) => (
          <Link key={label} to={actionTo} className="staff-stat-card is-clickable">
            <div className={`staff-stat-icon ${tone}`}><Icon size={18} /></div>
            <div className="staff-stat-content">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="staff-portal-grid">
        <section className="card staff-panel">
          <div className="staff-section-heading">
            <div>
              <h2>Nhiệm vụ trọng tâm</h2>
              <p>Danh sách công việc cần ưu tiên trong ca làm việc.</p>
            </div>
          </div>
          <ul className="staff-focus-list">
            {focusItems.map((item) => {
              const body = (
                <>
                  <div className={`staff-dot ${item.tone || 'info'}`} />
                  <div className="staff-focus-copy">
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <time>{item.time}</time>
                </>
              );

              if (item.to || actionTo) {
                return (
                  <li key={`${item.title}-${item.time}`}>
                    <Link to={item.to || actionTo} className="staff-focus-item is-clickable">{body}</Link>
                  </li>
                );
              }

              return (
                <li key={`${item.title}-${item.time}`}>
                  {body}
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="card staff-panel">
          <div className="staff-section-heading">
            <div>
              <h2>Lịch trực & hẹn gặp</h2>
              <p>Thông tin thời gian thực cho ca trực hôm nay.</p>
            </div>
          </div>
          <ul className="staff-mini-list">
            {schedule.map((item) => {
              const body = (
                <>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <span className={`badge ${badgeClass(item.tone)}`}>{item.status}</span>
                </>
              );

              if (item.to || actionTo) {
                return (
                  <li key={`${item.title}-${item.detail}`}>
                    <Link to={item.to || actionTo} className="staff-mini-item is-clickable">{body}</Link>
                  </li>
                );
              }

              return (
                <li key={`${item.title}-${item.detail}`}>{body}</li>
              );
            })}
          </ul>
        </aside>
      </div>

      <section className="card staff-panel staff-table-panel">
        <div className="staff-section-heading">
          <div>
            <h2>{tableTitle}</h2>
            <p>Giám sát tiến độ xử lý và các trạng thái công việc.</p>
          </div>
          <Link to={actionTo}>Xem chi tiết <ArrowRight size={15} /></Link>
        </div>

        <div className="table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Sinh viên</th>
                <th>Dịch vụ</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.code} className="table-clickable-row">
                  <td><Link to={row.to || actionTo} className="staff-code is-clickable">{row.code}</Link></td>
                  <td>{row.student}</td>
                  <td>{row.service}</td>
                  <td>{row.date}</td>
                  <td><span className={`badge ${badgeClass(row.tone)}`}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detailPanels.length > 0 && (
        <section className="staff-detail-panels">
          {detailPanels.map((panel) => (
            <div key={panel.title} className="card staff-panel detail-panel-card">
              <div className="staff-section-heading">
                <div>
                  <h2>{panel.title}</h2>
                  <p>{panel.subtitle}</p>
                </div>
              </div>
              <div className="detail-panel-body">
                {panel.items.map((item) => (
                  <Link key={item.label} to={item.to || actionTo} className="detail-panel-item is-clickable">
                    <span className="detail-panel-label">{item.label}</span>
                    <span className="detail-panel-meta">{item.meta}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function buildPage(config) {
  return function EmployeeStaffPage() {
    return <StaffPortalPage {...config} />;
  };
}

export const OverviewAndSchedulePage = buildPage({
  kicker: 'TỔNG QUAN & LỊCH TRỰC',
  title: 'Bảng điều khiển cá nhân',
  subtitle: 'Theo dõi hồ sơ, lịch trực quầy và các công việc trong ca làm việc.',
  actionLabel: 'Mở danh sách hồ sơ',
  actionTo: '/dashboard/ho-so',
  statCards: [
    { label: 'Hồ sơ mới', value: '32', tone: 'blue', icon: Inbox },
    { label: 'Chờ xử lý', value: '18', tone: 'amber', icon: Clock3 },
    { label: 'Đang xử lý', value: '14', tone: 'cyan', icon: FileText },
    { label: 'Hoàn tất', value: '72', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Tiếp nhận hồ sơ mới', detail: 'Có 9 hồ sơ gửi trong 2 giờ qua.', time: '08:50', tone: 'info' },
    { title: 'Lịch hẹn xác minh', detail: 'Phòng Học vụ có 3 cuộc hẹn sáng nay.', time: '09:20', tone: 'warning' },
    { title: 'Báo cáo ca trực', detail: 'Cần cập nhật số liệu trực quầy trước 16:00.', time: '10:10', tone: 'success' },
  ],
  schedule: [
    { title: 'Ca trực quầy', detail: 'Phòng Học vụ · 08:00 - 12:00', status: 'Đang trực', tone: 'success' },
    { title: 'Lịch hẹn gặp', detail: '5 sinh viên đã xác nhận', status: 'Sắp tới', tone: 'info' },
    { title: 'Yêu cầu ưu tiên', detail: '2 hồ sơ cần xử lý trong 30 phút', status: 'Khẩn cấp', tone: 'danger' },
  ],
  rows: [
    { code: 'HS-3321', student: 'Nguyễn Thị Lan', service: 'Xác nhận sinh viên', date: '14/10', status: 'Mới', tone: 'info', to: '/dashboard/chi-tiet/ho-so/HS-3321' },
    { code: 'HS-3327', student: 'Trần Văn Hùng', service: 'Cấp giấy xác nhận', date: '14/10', status: 'Đang xử lý', tone: 'warning', to: '/dashboard/chi-tiet/ho-so/HS-3327' },
    { code: 'HS-3331', student: 'Phạm Mai Anh', service: 'Đăng ký học phần', date: '13/10', status: 'Chờ bổ sung', tone: 'warning', to: '/dashboard/chi-tiet/ho-so/HS-3331' },
    { code: 'HS-3342', student: 'Bùi Quốc Đạt', service: 'Cấp lại thẻ SV', date: '13/10', status: 'Hoàn thành', tone: 'success', to: '/dashboard/chi-tiet/ho-so/HS-3342' },
  ],
  tableTitle: 'Danh sách công việc trong ngày',
  detailPanels: [
    {
      title: 'Lịch trực gần nhất',
      subtitle: 'Theo dõi ca làm việc và thời gian phục vụ sinh viên.',
      items: [
        { label: 'Ca trực quầy sáng', meta: '08:00 - 12:00 · Phòng Học vụ', to: '/dashboard/chi-tiet/lich-truc/LT-08' },
        { label: 'Hẹn gặp cố vấn', meta: '3 cuộc hẹn đã xác nhận', to: '/dashboard/chi-tiet/lich-truc/LT-08' },
      ],
    },
    {
      title: 'Tiếp nhận & Duyệt',
      subtitle: 'Công việc cần xử lý trong vòng 24h tiếp theo.',
      items: [
        { label: 'Hồ sơ mới cần tiếp nhận', meta: '12 hồ sơ · 2 giờ qua', to: '/dashboard/chi-tiet/ho-so/HS-3321' },
        { label: 'Hồ sơ đang chờ phê duyệt', meta: '7 hồ sơ · cần cập nhật', to: '/dashboard/chi-tiet/ho-so/HS-3327' },
      ],
    },
  ],
});

export const DepartmentManagerOverviewPage = buildPage({
  kicker: 'TỔNG QUAN PHÒNG BAN',
  title: 'Bảng điều khiển phòng ban',
  subtitle: 'Quản lý khối lượng công việc, tiến độ xử lý và hiệu suất đội ngũ của đơn vị.',
  actionLabel: 'Xem hoạt động phòng ban',
  actionTo: '/dashboard/phong-ban/hoat-dong',
  statCards: [
    { label: 'Yêu cầu mới', value: '44', tone: 'blue', icon: Inbox },
    { label: 'Đang xử lý', value: '21', tone: 'amber', icon: Clock3 },
    { label: 'Hoàn thành', value: '116', tone: 'cyan', icon: CheckCheck },
    { label: 'Hiệu suất', value: '92%', tone: 'green', icon: Sparkles },
  ],
  focusItems: [
    { title: 'Phân bổ công việc ', detail: '8 hồ sơ cần giao cho cán bộ trong đội.', time: '08:40', tone: 'info', to: '/admin/dept/task-allocation' },
    { title: 'Kiểm tra tiến độ', detail: '2 hồ sơ chậm hơn kế hoạch 2 ngày.', time: '09:15', tone: 'warning', to: '/admin/dept/progress-monitor' },
    { title: 'Kết quả tuần', detail: 'Đạt 94% chỉ tiêu theo kế hoạch tuần.', time: '10:10', tone: 'success', to: '/admin/dept/weekly-summary' },
  ],
  schedule: [
    { title: 'Ban điều phối', detail: 'Phân luồng 6 hồ sơ mới', status: 'Hoạt động', tone: 'success', to: '/admin/dept/dispatch-board' },
    { title: 'Nhiệm vụ trưởng nhóm', detail: '3 nhân sự cần cập nhật tiến độ', status: 'Cần theo dõi', tone: 'warning', to: '/admin/dept/team-leader-tasks' },
    { title: 'Báo cáo trưởng phòng', detail: 'Gửi tổng kết trước 17:00', status: 'Sắp đến hạn', tone: 'info', to: '/admin/dept/head-report' },
  ],
  rows: [
    { code: 'PB-144', student: 'Nguyễn Thị Như', service: 'Đăng ký học phần', date: '14/10', status: 'Mới', tone: 'info', to: '/admin/dept/task-allocation' },
    { code: 'PB-151', student: 'Lê Hoàng Sơn', service: 'Học bổng', date: '14/10', status: 'Đang xử lý', tone: 'warning', to: '/dashboard/ho-so-dang-xu-ly/tien-do' },
    { code: 'PB-168', student: 'Phạm Thảo Vy', service: 'Mức hỗ trợ phí', date: '13/10', status: 'Chờ phê duyệt', tone: 'info', to: '/admin/dept/team-leader-tasks' },
    { code: 'PB-177', student: 'Hà Gia Bảo', service: 'Giấy xác nhận', date: '13/10', status: 'Hoàn tất', tone: 'success', to: '/admin/dept/weekly-summary' },
  ],
  tableTitle: 'Công việc phòng ban',
  detailPanels: [
    {
      title: 'Phân công nhân sự',
      subtitle: 'Theo dõi công việc nhân sự trong phòng ban.',
      items: [
        { label: 'Cán bộ đang xử lý', meta: '5 người · 3 công việc gấp', to: '/admin/dept/task-allocation' },
        { label: 'Nhân sự cần báo cáo', meta: '2 người · chậm tiến độ', to: '/admin/dept/team-leader-tasks' },
      ],
    },
    {
      title: 'Hỗ trợ sinh viên',
      subtitle: 'Các yêu cầu cần theo dõi trong ngày.',
      items: [
        { label: 'Ticket hỗ trợ', meta: '9 yêu cầu mới', to: '/dashboard/ticket-ho-tro' },
        { label: 'Lịch hẹn sinh viên', meta: '4 cuộc hẹn trong ngày', to: '/dashboard/lich-truc' },
      ],
    },
  ],
});

export const AdminSystemOverviewPage = buildPage({
  kicker: 'TỔNG QUAN HỆ THỐNG',
  title: 'Bảng điều khiển quản trị',
  subtitle: 'Theo dõi toàn bộ hệ thống, người dùng, dịch vụ và hiệu suất vận hành cấp trường.',
  actionLabel: 'Mở quản trị hệ thống',
  actionTo: '/dashboard/nguoi-dung',
  statCards: [
    { label: 'Tổng người dùng', value: '3,280', tone: 'blue', icon: Users },
    { label: 'Phòng ban', value: '18', tone: 'amber', icon: Building2 },
    { label: 'Dịch vụ', value: '52', tone: 'cyan', icon: Settings },
    { label: 'Tỷ lệ hoạt động', value: '99.2%', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Tổng quan hệ thống', detail: 'Ổn định, không có sự cố lớn.', time: 'Hôm nay', tone: 'success' },
    { title: 'Người dùng mới', detail: '7 tài khoản chờ phê duyệt.', time: '08:30', tone: 'info' },
    { title: 'Nhật ký hệ thống', detail: '3 hoạt động nhạy cảm cần rà soát.', time: '10:20', tone: 'warning' },
  ],
  schedule: [
    { title: 'Bảo mật', detail: '2FA đang hoạt động', status: 'Ổn định', tone: 'success' },
    { title: 'Phân quyền', detail: '9 vai trò cần rà soát', status: 'Cần kiểm tra', tone: 'warning' },
    { title: 'Cập nhật', detail: 'Triển khai cuối tuần', status: 'Lên lịch', tone: 'info' },
  ],
  rows: [
    { code: 'SYS-31', student: 'Người dùng mới', service: 'Tài khoản', date: '14/10', status: 'Cần phê duyệt', tone: 'info', to: '/dashboard/chi-tiet/he-thong/SYS-31' },
    { code: 'SYS-42', student: 'Dịch vụ', service: 'Cập nhật danh mục', date: '14/10', status: 'Đặt lịch', tone: 'warning', to: '/dashboard/chi-tiet/he-thong/SYS-42' },
    { code: 'SYS-58', student: 'Sự cố', service: 'Giám sát hệ thống', date: '13/10', status: 'Không có', tone: 'success', to: '/dashboard/chi-tiet/he-thong/SYS-58' },
    { code: 'SYS-69', student: 'Nhật ký', service: 'Audit log', date: '13/10', status: 'Đã kiểm tra', tone: 'success', to: '/dashboard/chi-tiet/he-thong/SYS-69' },
  ],
  tableTitle: 'Hoạt động hệ thống quan trọng',
  detailPanels: [
    {
      title: 'Người dùng & phân quyền',
      subtitle: 'Tài khoản và vai trò đang cần kiểm tra.',
      items: [
        { label: 'Tài khoản chờ duyệt', meta: '7 tài khoản mới', to: '/dashboard/chi-tiet/nguoi-dung/U-2048' },
        { label: 'Phân quyền cần rà soát', meta: '9 vai trò đang xem xét', to: '/dashboard/chi-tiet/nguoi-dung/U-2048' },
      ],
    },
    {
      title: 'Cấu hình hệ thống',
      subtitle: 'Bảo mật, dịch vụ và lịch triển khai.',
      items: [
        { label: 'Bảo mật 2FA', meta: 'Đang hoạt động ổn định', to: '/dashboard/chi-tiet/he-thong/SYS-31' },
        { label: 'Lịch triển khai', meta: 'Cập nhật cuối tuần này', to: '/dashboard/chi-tiet/he-thong/SYS-42' },
      ],
    },
  ],
});

export const CounterAndAppointmentPage = buildPage({
  kicker: 'TỔNG QUAN & LỊCH TRỰC',
  title: 'Lịch trực quầy & hẹn gặp',
  subtitle: 'Điều phối ca trực, đặt lịch gặp và theo dõi lịch làm việc của nhân viên.',
  actionLabel: 'Xem lịch toàn phòng',
  actionTo: '/dashboard/lich-truc/chi-tiet',
  statCards: [
    { label: 'Ca trực hôm nay', value: '4', tone: 'blue', icon: CalendarDays },
    { label: 'Cuộc hẹn xác nhận', value: '12', tone: 'amber', icon: Sparkles },
    { label: 'Khách đến chờ', value: '6', tone: 'cyan', icon: FileCheck2 },
    { label: 'Hoàn tất ca', value: '3', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Ca trực phòng tiếp nhận', detail: 'Nhân viên A: 08:00 - 12:00, B: 13:00 - 17:00', time: 'Hôm nay', tone: 'info' },
    { title: 'Hẹn gặp sinh viên', detail: '3 cuộc hẹn cùng lúc tại phòng làm việc.', time: '09:30', tone: 'warning' },
    { title: 'Phản hồi định kỳ', detail: 'Gửi xác nhận đến 5 sinh viên chưa xác nhận.', time: '11:00', tone: 'success' },
  ],
  schedule: [
    { title: 'Phòng Học vụ', detail: 'Ca 1 · 08:00 - 12:00', status: 'Đang trực', tone: 'success' },
    { title: 'Phòng Công tác SV', detail: 'Ca 2 · 13:00 - 17:00', status: 'Lên lịch', tone: 'info' },
    { title: 'Hẹn gặp ngoài giờ', detail: '2 cuộc hẹn đặt cuối ngày', status: 'Khẩn cấp', tone: 'danger' },
  ],
  rows: [
    { code: 'TT-18', student: 'Lê Thị Mơ', service: 'Đăng ký học phần', date: '09:30', status: 'Đã xác nhận', tone: 'success' },
    { code: 'TT-19', student: 'Nguyễn Văn Nam', service: 'Xác nhận sinh viên', date: '10:15', status: 'Chờ check-in', tone: 'warning' },
    { code: 'TT-20', student: 'Hoàng Anh', service: 'Hỗ trợ tài chính', date: '11:10', status: 'Mới', tone: 'info' },
    { code: 'TT-21', student: 'Đỗ Thùy Dương', service: 'Ký số hồ sơ', date: '14:00', status: 'Đã đặt', tone: 'success' },
  ],
  tableTitle: 'Lịch trực & cuộc hẹn',
});

export const IntakeInboxPage = buildPage({
  kicker: 'QUẢN LÝ HỒ SƠ & THỦ TỤC',
  title: 'Hồ sơ chờ tiếp nhận',
  subtitle: 'Kiểm tra, phân luồng và xác nhận hồ sơ mới từ sinh viên.',
  actionLabel: 'Tiếp nhận hồ sơ',
  actionTo: '/dashboard/ho-so-cho-tiep-nhan/tiep-nhan/3',
  statCards: [
    { label: 'Hồ sơ mới', value: '19', tone: 'blue', icon: Inbox },
    { label: 'Mới trong 24h', value: '11', tone: 'amber', icon: Clock3 },
    { label: 'Chờ kiểm tra', value: '8', tone: 'cyan', icon: FileText },
    { label: 'Đã tiếp nhận', value: '64', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Dịch vụ nhập học', detail: '5 hồ sơ cần xét duyệt đầu vào.', time: '08:00', tone: 'info' },
    { title: 'Yêu cầu cấp bản sao', detail: '3 hồ sơ thiếu văn bản bổ sung.', time: '09:10', tone: 'warning' },
    { title: 'Tự động phân luồng', detail: '9 hồ sơ đã được gắn phòng ban phù hợp.', time: '10:40', tone: 'success' },
  ],
  schedule: [
    { title: 'Phòng tiếp nhận', detail: '1 hồ sơ đang chờ cấp mã', status: 'Chờ', tone: 'info' },
    { title: 'Phòng công tác', detail: '2 hồ sơ đang chờ thẩm định', status: 'Phân luồng', tone: 'warning' },
    { title: 'Phòng tài chính', detail: '1 yêu cầu cần xác nhận phí', status: 'Cần xử lý', tone: 'danger' },
  ],
  rows: [
    { code: 'HS-3001', student: 'Đặng Phương Lan', service: 'Tuyển sinh', date: '14/10', status: 'Mới', tone: 'info' },
    { code: 'HS-3004', student: 'Lê Huy Anh', service: 'Cấp giấy xác nhận', date: '14/10', status: 'Chờ kiểm tra', tone: 'warning' },
    { code: 'HS-3006', student: 'Mai Khánh Linh', service: 'Vay vốn', date: '13/10', status: 'Đã tiếp nhận', tone: 'success' },
    { code: 'HS-3008', student: 'Vũ Minh Tuấn', service: 'Hồ sơ học bổng', date: '13/10', status: 'Đang duyệt', tone: 'warning' },
  ],
  tableTitle: 'Hồ sơ trong danh sách chờ tiếp nhận',
});

export const InProgressPage = buildPage({
  kicker: 'QUẢN LÝ HỒ SƠ & THỦ TỤC',
  title: 'Hồ sơ đang xử lý',
  subtitle: 'Theo dõi tiến độ xử lý hồ sơ, nhắc việc và thời hạn hoàn thành.',
  actionLabel: 'Mở tiến độ xử lý',
  actionTo: '/dashboard/ho-so-dang-xu-ly/tien-do',
  statCards: [
    { label: 'Đang xử lý', value: '34', tone: 'blue', icon: FileText },
    { label: 'Quá hạn', value: '5', tone: 'amber', icon: Clock3 },
    { label: 'Đang chờ phê duyệt', value: '11', tone: 'cyan', icon: FileCheck2 },
    { label: 'Đã hoàn tất', value: '72', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Xử lý hồ sơ học bổng', detail: 'Cần xác nhận kết quả cuối cùng trước 15:00.', time: '08:30', tone: 'warning' },
    { title: 'Duyệt hồ sơ trả nợ', detail: 'Cần ký xác nhận từ phòng Tài chính.', time: '09:45', tone: 'info' },
    { title: 'Phản hồi đóng hồ sơ', detail: '4 trường hợp chờ sinh viên bổ sung giấy tờ.', time: '11:10', tone: 'success' },
  ],
  schedule: [
    { title: 'Nhắc việc nội bộ', detail: '5 thủ tục chậm tiến độ trong 24h', status: 'Cần nhắc', tone: 'warning' },
    { title: 'Phê duyệt tập trung', detail: '14 hồ sơ đang chờ ký số', status: 'Chờ duyệt', tone: 'info' },
    { title: 'Phòng ban phối hợp', detail: '3 giao việc với phòng Tài chính', status: 'Đang làm', tone: 'success' },
  ],
  rows: [
    { code: 'HS-2052', student: 'Nguyễn Văn Tâm', service: 'Chuyển đổi hình thức học', date: '12/10', status: 'Đang xử lý', tone: 'warning' },
    { code: 'HS-2059', student: 'Trần Hồng Cúc', service: 'Hỗ trợ tài chính', date: '12/10', status: 'Đã duyệt', tone: 'success' },
    { code: 'HS-2071', student: 'Phan Văn Dũng', service: 'Xác nhận sinh viên', date: '11/10', status: 'Chờ phê duyệt', tone: 'info' },
    { code: 'HS-2084', student: 'Nguyễn Hoàng Minh', service: 'Cấp giấy', date: '11/10', status: 'Quá hạn', tone: 'danger' },
  ],
  tableTitle: 'Tiến độ xử lý hồ sơ',
});

export const PendingResubmissionPage = buildPage({
  kicker: 'QUẢN LÝ HỒ SƠ & THỦ TỤC',
  title: 'Hồ sơ chờ sinh viên bổ sung',
  subtitle: 'Theo dõi các trường hợp cần bổ sung thông tin hoặc tài liệu.',
  actionLabel: 'Xem danh sách cần nhắc',
  actionTo: '/dashboard/ho-so-cho-sv-bo-sung/danh-sach-can-nhac',
  statCards: [
    { label: 'Chờ bổ sung', value: '14', tone: 'blue', icon: Inbox },
    { label: 'Đã nhắc', value: '8', tone: 'amber', icon: Clock3 },
    { label: 'Quá 72h', value: '3', tone: 'cyan', icon: FileText },
    { label: 'Hoàn tất bổ sung', value: '7', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Thiếu giấy tờ', detail: '3 hồ sơ thiếu CMND/giấy xác nhận nơi cư trú.', time: '07:45', tone: 'warning' },
    { title: 'Sai thông tin', detail: '2 hồ sơ sai mã sinh viên hoặc tên phụ huynh.', time: '09:15', tone: 'info' },
    { title: 'Nhắc nhở sinh viên', detail: 'Cần gửi thông báo trong vòng 24h.', time: '10:30', tone: 'success' },
  ],
  schedule: [
    { title: 'Nhắc bổ sung', detail: '6 sinh viên chưa phản hồi', status: 'Đã nhắc', tone: 'info' },
    { title: 'Hồ sơ quá hạn', detail: '2 yêu cầu trên 72h chưa cập nhật', status: 'Khẩn cấp', tone: 'danger' },
    { title: 'Yêu cầu rà soát', detail: '1 hồ sơ cần kiểm tra lại thủ tục', status: 'Xem xét', tone: 'warning' },
  ],
  rows: [
    { code: 'HS-2104', student: 'Nguyễn Hữu Khang', service: 'Bảo lưu kết quả', date: '08/10', status: 'Chờ bổ sung', tone: 'warning' },
    { code: 'HS-2111', student: 'Vũ Thị Hà', service: 'Cấp lại thẻ', date: '07/10', status: 'Đã nhắc', tone: 'info' },
    { code: 'HS-2120', student: 'Lê Văn Toàn', service: 'Đăng ký học phần', date: '06/10', status: 'Quá hạn', tone: 'danger' },
    { code: 'HS-2130', student: 'Trần Minh Thu', service: 'Học bổng', date: '05/10', status: 'Đã bổ sung', tone: 'success' },
  ],
  tableTitle: 'Danh sách hồ sơ cần bổ sung',
});

export const ArchivedRecordsPage = buildPage({
  kicker: 'QUẢN LÝ HỒ SƠ & THỦ TỤC',
  title: 'Kho lưu trữ & lịch sử duyệt',
  subtitle: 'Tra cứu hồ sơ đã duyệt, lưu trữ và lịch sử xử lý từng bước.',
  actionLabel: 'Mở kho hồ sơ',
  actionTo: '/dashboard/kho-ho-so/tra-cuu',
  statCards: [
    { label: 'Đã duyệt', value: '462', tone: 'blue', icon: FileCheck2 },
    { label: 'Lưu trữ theo năm', value: '7', tone: 'amber', icon: ShieldCheck },
    { label: 'Chờ lưu trữ', value: '11', tone: 'cyan', icon: Clock3 },
    { label: 'Tổng bộ cứng', value: '91GB', tone: 'green', icon: Search },
  ],
  focusItems: [
    { title: 'Hồ sơ đã phê duyệt', detail: '12 hồ sơ mới được lưu trữ tháng này.', time: '08:15', tone: 'success' },
    { title: 'Lịch sử xử lý', detail: 'Cần kiểm tra 2 hồ sơ có nhiều lần điều chỉnh.', time: '09:40', tone: 'warning' },
    { title: 'Tìm kiếm hồ sơ cũ', detail: 'Có 7 yêu cầu tra cứu trong 30 ngày qua.', time: '11:00', tone: 'info' },
  ],
  schedule: [
    { title: 'Lưu trữ định kỳ', detail: 'Tự động lưu trữ 18 hồ sơ mỗi tuần', status: 'Bình thường', tone: 'success' },
    { title: 'Hồ sơ cần kiểm tra', detail: '2 hồ sơ có yêu cầu bổ sung metadata', status: 'Cần rà soát', tone: 'warning' },
    { title: 'Phục hồi bản gốc', detail: '1 yêu cầu khôi phục từ lưu trữ đám mây', status: 'Chờ xử lý', tone: 'info' },
  ],
  rows: [
    { code: 'HS-1554', student: 'Nguyễn Trần Minh', service: 'Duyệt học bổng', date: '09/10', status: 'Đã lưu trữ', tone: 'success' },
    { code: 'HS-1561', student: 'Phạm Thị Hương', service: 'Giấy xác nhận', date: '08/10', status: 'Đã duyệt', tone: 'success' },
    { code: 'HS-1570', student: 'Hoàng Hải Yến', service: 'Đăng ký dự thi', date: '07/10', status: 'Chờ lưu trữ', tone: 'info' },
    { code: 'HS-1582', student: 'Bạch Thanh Huy', service: 'Cấp thẻ', date: '06/10', status: 'Đã lưu trữ', tone: 'success' },
  ],
  tableTitle: 'Lịch sử duyệt hồ sơ',
});

export const SupportTicketPage = buildPage({
  kicker: 'HỖ TRỢ & TƯ VẤN SINH VIÊN',
  title: 'Ticket hỗ trợ',
  subtitle: 'Quản lý yêu cầu hỗ trợ, phản hồi sinh viên và điều phối xử lý.',
  actionLabel: 'Mở ticket hỗ trợ',
  actionTo: '/dashboard/tickets',
  statCards: [
    { label: 'Ticket mới', value: '11', tone: 'blue', icon: Ticket },
    { label: 'Đang xử lý', value: '8', tone: 'amber', icon: Clock3 },
    { label: 'Chờ phản hồi', value: '4', tone: 'cyan', icon: MessageSquareText },
    { label: 'Đã đóng', value: '26', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Ticket học vụ', detail: '2 yêu cầu về lịch học và đăng ký học phần.', time: '08:20', tone: 'info' },
    { title: 'Ticket tài chính', detail: '1 hồ sơ cần đối chiếu lệ phí.', time: '09:00', tone: 'warning' },
    { title: 'Trả lời sinh viên', detail: '5 phản hồi sắp hết hạn trong 2 giờ tới.', time: '11:05', tone: 'success' },
  ],
  schedule: [
    { title: 'Ticket khẩn cấp', detail: '3 yêu cầu cần xử lý trong 30 phút', status: 'Nghiêm túc', tone: 'danger' },
    { title: 'Ticket nội bộ', detail: '2 yêu cầu chuyển cho phòng khác', status: 'Đang chuyển', tone: 'warning' },
    { title: 'Ticket đã giải quyết', detail: '17 yêu cầu hoàn tất tuần này', status: 'Hoàn tất', tone: 'success' },
  ],
  rows: [
    { code: 'TK-204', student: 'Ngọc Ánh', service: 'Học vụ', date: '14/10', status: 'Mới', tone: 'info' },
    { code: 'TK-211', student: 'Trí Dũng', service: 'Tài chính', date: '14/10', status: 'Đang xử lý', tone: 'warning' },
    { code: 'TK-214', student: 'Lan Phương', service: 'Hệ thống', date: '13/10', status: 'Chờ phản hồi', tone: 'info' },
    { code: 'TK-220', student: 'Hà My', service: 'Đào tạo', date: '13/10', status: 'Đã đóng', tone: 'success' },
  ],
  tableTitle: 'Ticket hỗ trợ sinh viên',
});

export const LiveChatPage = buildPage({
  kicker: 'HỖ TRỢ & TƯ VẤN SINH VIÊN',
  title: 'Chat trực tiếp với sinh viên',
  subtitle: 'Trao đổi nhanh, chuyển tiếp và ghi nhận nội dung tư vấn.',
  actionLabel: 'Mở chat trực tiếp',
  actionTo: '/dashboard/chat-sinh-vien/truc-tiep',
  statCards: [
    { label: 'Đang online', value: '9', tone: 'blue', icon: MessageSquareText },
    { label: 'Cuộc trò chuyện', value: '28', tone: 'amber', icon: Clock3 },
    { label: 'Chuyển cấp', value: '3', tone: 'cyan', icon: Ticket },
    { label: 'Hoàn tất ngày', value: '17', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Tư vấn hồ sơ', detail: '3 sinh viên cần hướng dẫn bổ sung giấy tờ.', time: '08:40', tone: 'info' },
    { title: 'Yêu cầu khẩn cấp', detail: '1 sinh viên cần giải quyết qua hotline nội bộ.', time: '09:25', tone: 'danger' },
    { title: 'Chuyển cho chuyên viên', detail: '2 cuộc trò chuyện đang được bàn giao.', time: '10:35', tone: 'warning' },
  ],
  schedule: [
    { title: 'Chat đang hoạt động', detail: '5 phiên đang diễn ra trên kênh chính', status: 'Online', tone: 'success' },
    { title: 'Chat chờ phản hồi', detail: '4 sinh viên chưa nhận lại tin nhắn', status: 'Chờ', tone: 'warning' },
    { title: 'Cần kết thúc', detail: '1 phiên cần nhắn xác nhận trước 16:00', status: 'Sắp hết', tone: 'info' },
  ],
  rows: [
    { code: 'CHAT-02', student: 'Minh Khoa', service: 'Tư vấn hồ sơ', date: '14/10', status: 'Đang chat', tone: 'success' },
    { code: 'CHAT-05', student: 'Linh Đan', service: 'Tài chính', date: '14/10', status: 'Chờ trả lời', tone: 'warning' },
    { code: 'CHAT-07', student: 'Bảo Nhi', service: 'Học bổng', date: '13/10', status: 'Đã giải quyết', tone: 'success' },
    { code: 'CHAT-09', student: 'Thanh Nam', service: 'Đăng ký học', date: '13/10', status: 'Chuyển cấp', tone: 'info' },
  ],
  tableTitle: 'Cuộc chat trực tiếp gần đây',
});

export const PrintAndCardPage = buildPage({
  kicker: 'NGHIỆP VỤ & IN ẤN / KÝ SỐ',
  title: 'In ấn & xuất bản phôi',
  subtitle: 'Quản lý in phôi, xuất tài liệu và kiểm soát chứng từ.',
  actionLabel: 'Mở quy trình in ấn',
  actionTo: '/dashboard/in-an/quy-trinh',
  statCards: [
    { label: 'Tệp đang in', value: '23', tone: 'blue', icon: Printer },
    { label: 'Phôi chờ xuất', value: '18', tone: 'amber', icon: FileText },
    { label: 'Đã hoàn tất', value: '72', tone: 'cyan', icon: CheckCheck },
    { label: 'Lỗi máy in', value: '2', tone: 'green', icon: ShieldCheck },
  ],
  focusItems: [
    { title: 'In phôi thẻ sinh viên', detail: '3 lô thành phẩm sắp hoàn tất tại phòng in.', time: '08:30', tone: 'info' },
    { title: 'Xuất văn bản xác nhận', detail: '2 yêu cầu cần kiểm tra mẫu số và chữ ký.', time: '09:20', tone: 'warning' },
    { title: 'Báo cáo máy in', detail: '1 máy đang cần vệ sinh trước ca chiều.', time: '10:50', tone: 'success' },
  ],
  schedule: [
    { title: 'Máy in chính', detail: 'Đang xử lý 8 tệp', status: 'Bận', tone: 'warning' },
    { title: 'Phòng in phụ', detail: 'Chờ chốt dữ liệu từ hồ sơ', status: 'Chờ', tone: 'info' },
    { title: 'Bản cứng đã hoàn tất', detail: '14 bản đã có xác nhận', status: 'Hoàn tất', tone: 'success' },
  ],
  rows: [
    { code: 'IN-201', student: 'Nguyễn Thắng', service: 'Thẻ sinh viên', date: '14/10', status: 'Đang in', tone: 'warning' },
    { code: 'IN-205', student: 'Đinh Thị Nga', service: 'Giấy xác nhận', date: '14/10', status: 'Chờ duyệt', tone: 'info' },
    { code: 'IN-210', student: 'Trương Mỹ Hạnh', service: 'Phôi chứng nhận', date: '13/10', status: 'Hoàn tất', tone: 'success' },
    { code: 'IN-212', student: 'Nguyễn Tâm', service: 'Bản sao hồ sơ', date: '12/10', status: 'Cần kiểm tra', tone: 'warning' },
  ],
  tableTitle: 'Lịch trình in ấn & xuất phôi',
});

export const ESignaturePage = buildPage({
  kicker: 'NGHIỆP VỤ & IN ẤN / KÝ SỐ',
  title: 'Duyệt & ký số tập trung',
  subtitle: 'Duyệt các hồ sơ điện tử, ký số tập trung và kiểm soát phê duyệt.',
  actionLabel: 'Mở quy trình ký số',
  actionTo: '/dashboard/ky-so/quy-trinh',
  statCards: [
    { label: 'Chờ ký số', value: '42', tone: 'blue', icon: ShieldCheck },
    { label: 'Chờ duyệt', value: '18', tone: 'amber', icon: Clock3 },
    { label: 'Đã ký', value: '118', tone: 'cyan', icon: CheckCheck },
    { label: 'Lỗi chữ ký', value: '2', tone: 'green', icon: Sparkles },
  ],
  focusItems: [
    { title: 'Lô hồ sơ ký số', detail: 'Có 12 hồ sơ đang chờ ký bởi phòng Học vụ.', time: '08:15', tone: 'info' },
    { title: 'Xác nhận người ký', detail: '2 hồ sơ cần bổ sung thông tin người phê duyệt.', time: '09:40', tone: 'warning' },
    { title: 'Gửi thông báo', detail: '3 hồ sơ sắp hết thời hạn chờ duyệt.', time: '11:20', tone: 'success' },
  ],
  schedule: [
    { title: 'Ký tập trung', detail: '3 lô đang xử lý cùng lúc', status: 'Đang chạy', tone: 'success' },
    { title: 'Duyệt phụ lục', detail: '2 hồ sơ cần bổ sung chứng từ', status: 'Chờ cập nhật', tone: 'warning' },
    { title: 'Lưu log ký số', detail: 'Tự động lưu hàng ngày', status: 'Bình thường', tone: 'info' },
  ],
  rows: [
    { code: 'KS-228', student: 'Võ Minh Anh', service: 'Ký số hồ sơ', date: '14/10', status: 'Chờ ký', tone: 'info' },
    { code: 'KS-235', student: 'Hai Yến', service: 'Duyệt phôi', date: '14/10', status: 'Đang duyệt', tone: 'warning' },
    { code: 'KS-240', student: 'Hồng Sơn', service: 'Ký số học bổng', date: '13/10', status: 'Đã ký', tone: 'success' },
    { code: 'KS-246', student: 'Lâm Trường', service: 'Xác nhận tài chính', date: '13/10', status: 'Cần bổ sung', tone: 'warning' },
  ],
  tableTitle: 'Danh sách hồ sơ ký số tập trung',
});

export const FeeAndReceiptPage = buildPage({
  kicker: 'NGHIỆP VỤ & IN ẤN / KÝ SỐ',
  title: 'Quản lý lệ phí & biên lai',
  subtitle: 'Theo dõi thu phí, chứng từ và xác nhận thanh toán cho sinh viên.',
  actionLabel: 'Mở dữ liệu lệ phí',
  actionTo: '/dashboard/le-phi/du-lieu',
  statCards: [
    { label: 'Chưa thanh toán', value: '23', tone: 'blue', icon: WalletCards },
    { label: 'Đã thu hôm nay', value: '18', tone: 'amber', icon: Clock3 },
    { label: 'Biên lai chờ in', value: '9', tone: 'cyan', icon: Printer },
    { label: 'Đã đối soát', value: '96%', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Đối soát lệ phí', detail: '3 báo cáo chờ khớp số với ngân hàng.', time: '08:45', tone: 'warning' },
    { title: 'Biên lai phát hành', detail: '8 biên lai cần in và đóng gói.', time: '09:35', tone: 'info' },
    { title: 'Nợ phí chưa xử lý', detail: '2 trường hợp chờ nhắc thanh toán.', time: '10:50', tone: 'success' },
  ],
  schedule: [
    { title: 'Hồ sơ chưa thanh toán', detail: '23 sinh viên đang chờ nộp', status: 'Chờ thu', tone: 'warning' },
    { title: 'Đã thu trong ngày', detail: '18 giao dịch đã đối soát', status: 'Hoàn tất', tone: 'success' },
    { title: 'Lệ phí theo đợt', detail: 'Đợt 2 đang mở đến 20/10', status: 'Đang mở', tone: 'info' },
  ],
  rows: [
    { code: 'BL-310', student: 'Nguyễn Thuý Nhi', service: 'Lệ phí học phần', date: '14/10', status: 'Đã thu', tone: 'success' },
    { code: 'BL-312', student: 'Đào Anh Tú', service: 'Chứng nhận', date: '14/10', status: 'Chờ thu', tone: 'warning' },
    { code: 'BL-319', student: 'Lê Quang Huy', service: 'Học tập', date: '13/10', status: 'Chờ in biên lai', tone: 'info' },
    { code: 'BL-321', student: 'Hà Khánh', service: 'Đăng ký dự thi', date: '13/10', status: 'Hoàn tất', tone: 'success' },
  ],
  tableTitle: 'Lệ phí & biên lai chờ xử lý',
});

export const StudentDirectoryPage = buildPage({
  kicker: 'CƠ SỞ DỮ LIỆU & TRA CỨU',
  title: 'Tra cứu hồ sơ sinh viên',
  subtitle: 'Tra cứu nhanh hồ sơ, trạng thái, và lịch sử tương tác với sinh viên.',
  actionLabel: 'Mở tra cứu',
  actionTo: '/dashboard/tra-cuu-sinh-vien/tra-cuu',
  statCards: [
    { label: 'Hồ sơ truy cập', value: '425', tone: 'blue', icon: Search },
    { label: 'Chờ xác thực', value: '19', tone: 'amber', icon: Clock3 },
    { label: 'Hồ sơ đã liên kết', value: '311', tone: 'cyan', icon: FileText },
    { label: 'Đã đối chiếu', value: '96%', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Tra cứu hồ sơ nhanh', detail: 'Có 12 yêu cầu tra cứu sinh viên trong 24h qua.', time: '08:20', tone: 'info' },
    { title: 'Đối chiếu dữ liệu', detail: '3 hồ sơ cần kiểm tra lại thông tin định danh.', time: '09:10', tone: 'warning' },
    { title: 'Lịch sử sinh viên', detail: 'Đã cập nhật 5 hồ sơ mới lên hệ thống.', time: '11:00', tone: 'success' },
  ],
  schedule: [
    { title: 'Tìm kiếm hợp lệ', detail: '8 truy vấn liên quan đến mã số sinh viên', status: 'Online', tone: 'success' },
    { title: 'Dữ liệu chưa đối chiếu', detail: '3 profile chờ cập nhật cấp đo', status: 'Cần xác thực', tone: 'warning' },
    { title: 'Số lượng truy cập', detail: '143 lượt tra cứu trong ngày', status: 'Bình thường', tone: 'info' },
  ],
  rows: [
    { code: 'SV-2150', student: 'Nguyễn Hồng Chi', service: 'Tra cứu hồ sơ', date: '14/10', status: 'Có hồ sơ', tone: 'success' },
    { code: 'SV-2218', student: 'An Nhiên', service: 'Đối chiếu dữ liệu', date: '14/10', status: 'Chờ xác thực', tone: 'warning' },
    { code: 'SV-2282', student: 'Lê Đình Khang', service: 'Lịch sử hồ sơ', date: '13/10', status: 'Đã cập nhật', tone: 'success' },
    { code: 'SV-2305', student: 'Mai Ngọc Bích', service: 'Tra cứu nhanh', date: '13/10', status: 'Cần kiểm tra', tone: 'info' },
  ],
  tableTitle: 'Kết quả tra cứu hồ sơ gần đây',
});

export const KnowledgeBasePage = buildPage({
  kicker: 'CƠ SỞ DỮ LIỆU & TRA CỨU',
  title: 'Cẩm nang & quy trình nghiệp vụ',
  subtitle: 'Truy cập quy trình, hướng dẫn và tiêu chuẩn xử lý hồ sơ nội bộ.',
  actionLabel: 'Mở cẩm nang',
  actionTo: '/dashboard/cam-nang/chi-tiet',
  statCards: [
    { label: 'Tài liệu', value: '72', tone: 'blue', icon: FileText },
    { label: 'Quy trình mới', value: '6', tone: 'amber', icon: Sparkles },
    { label: 'Yêu cầu cập nhật', value: '4', tone: 'cyan', icon: Clock3 },
    { label: 'Truy cập hôm nay', value: '146', tone: 'green', icon: Search },
  ],
  focusItems: [
    { title: 'Quy trình tiếp nhận hồ sơ', detail: 'Cập nhật mẫu đánh giá hồ sơ mới.', time: '08:15', tone: 'info' },
    { title: 'Hướng dẫn ký số', detail: 'Có 2 chủ đề cần bổ sung video hướng dẫn.', time: '09:30', tone: 'warning' },
    { title: 'Tài liệu phòng ban', detail: '4 tài liệu được đề xuất bổ sung theo tuần.', time: '10:45', tone: 'success' },
  ],
  schedule: [
    { title: 'Mục hot', detail: 'Quy trình xử lý hồ sơ và phí dịch vụ', status: 'Nhiều truy cập', tone: 'success' },
    { title: 'Yêu cầu cập nhật', detail: '3 hướng dẫn chờ xác nhận chính thức', status: 'Cần kiểm tra', tone: 'warning' },
    { title: 'Tài liệu nội bộ', detail: 'Phê duyệt định kỳ tháng này', status: 'Đang phê duyệt', tone: 'info' },
  ],
  rows: [
    { code: 'KN-06', student: 'Quy trình tiếp nhận', service: 'Học vụ', date: '14/10', status: 'Cập nhật', tone: 'success' },
    { code: 'KN-12', student: 'Hướng dẫn chi tiết', service: 'Tài chính', date: '14/10', status: 'Đang sửa', tone: 'warning' },
    { code: 'KN-19', student: 'Mẫu đánh giá', service: 'Điều phối', date: '13/10', status: 'Hoàn tất', tone: 'success' },
    { code: 'KN-22', student: 'Hướng dẫn ký số', service: 'Công nghệ', date: '13/10', status: 'Chờ xác minh', tone: 'info' },
  ],
  tableTitle: 'Tài liệu & quy trình mới nhất',
});

export const PerformanceReportPage = buildPage({
  kicker: 'BÁO CÁO & HIỆU SUẤT',
  title: 'Báo cáo KPI cá nhân',
  subtitle: 'Theo dõi hiệu suất cá nhân, thời lượng xử lý và tiến độ công việc.',
  actionLabel: 'Mở báo cáo KPI',
  actionTo: '/dashboard/bao-cao-kpi/chi-tiet',
  statCards: [
    { label: 'Hiệu suất', value: '92%', tone: 'blue', icon: FileCheck2 },
    { label: 'Thời gian xử lý', value: '1.8 ngày', tone: 'amber', icon: Clock3 },
    { label: 'Đạt chỉ tiêu', value: '88%', tone: 'cyan', icon: CheckCheck },
    { label: 'Tăng trưởng', value: '+12%', tone: 'green', icon: Sparkles },
  ],
  focusItems: [
    { title: 'Số lượng hồ sơ xử lý', detail: 'Đạt 112% kế hoạch trong tháng này.', time: 'Tháng này', tone: 'success' },
    { title: 'Thời gian phản hồi', detail: 'Giảm 18% so với tháng trước.', time: 'Tháng này', tone: 'info' },
    { title: 'Nhiệm vụ hỗ trợ', detail: 'Cần ổn định số lượng ticket phản hồi trong cuối tháng.', time: 'Tuần tới', tone: 'warning' },
  ],
  schedule: [
    { title: 'Mục tiêu cá nhân', detail: 'Xử lý 30 hồ sơ ưu tiên mỗi tuần', status: 'Đang thực hiện', tone: 'success' },
    { title: 'Chỉ số phản hồi', detail: '86% phản hồi trong 24h', status: 'Tốt', tone: 'info' },
    { title: 'KPI tiếp nhận', detail: 'Có 4 hồ sơ cần tăng tốc độ xử lý', status: 'Cần quan tâm', tone: 'warning' },
  ],
  rows: [
    { code: 'KPI-01', student: 'Hiệu suất xử lý', service: 'Học vụ', date: 'Tháng 10', status: '92%', tone: 'success' },
    { code: 'KPI-02', student: 'Phản hồi sinh viên', service: 'Hỗ trợ', date: 'Tháng 10', status: '86%', tone: 'info' },
    { code: 'KPI-03', student: 'Tiếp nhận hồ sơ', service: 'Phòng ban', date: 'Tháng 10', status: '112%', tone: 'success' },
    { code: 'KPI-04', student: 'Chậm tiến độ', service: 'Chức năng', date: 'Tháng 10', status: '5%', tone: 'warning' },
  ],
  tableTitle: 'Chỉ số hiệu suất cá nhân',
});

export const AccountSettingsPage = buildPage({
  kicker: 'CÀI ĐẶT TÀI KHOẢN',
  title: 'Thiết lập cá nhân & ủy quyền',
  subtitle: 'Quản lý thông tin cá nhân, quyền giao việc và thiết lập nhắc nhở.',
  actionLabel: 'Mở cài đặt',
  actionTo: '/dashboard/cai-dat/chi-tiet',
  statCards: [
    { label: 'Đã xác thực', value: '2FA', tone: 'blue', icon: ShieldCheck },
    { label: 'Ủy quyền', value: '3', tone: 'amber', icon: UserRoundIcon },
    { label: 'Nhắc nhở', value: '7', tone: 'cyan', icon: Clock3 },
    { label: 'Tình trạng', value: 'Ổn định', tone: 'green', icon: CheckCheck },
  ],
  focusItems: [
    { title: 'Bảo mật tài khoản', detail: 'Xác minh 2 lớp đang hoạt động bình thường.', time: 'Hôm nay', tone: 'success' },
    { title: 'Ủy quyền xử lý', detail: '3 cán bộ được giao quyền xem và phê duyệt.', time: 'Tuần này', tone: 'info' },
    { title: 'Cấu hình thông báo', detail: 'Nhắc nhở qua email và SMS đang bật.', time: 'Đã thiết lập', tone: 'warning' },
  ],
  schedule: [
    { title: 'Mật khẩu', detail: 'Thay đổi lần cuối 30 ngày trước', status: 'Ổn định', tone: 'success' },
    { title: 'Ủy quyền phê duyệt', detail: '3 người được ủy quyền', status: 'Hiệu lực', tone: 'info' },
    { title: 'Kế hoạch nhắc việc', detail: 'Tự động gửi 2 thông báo/ngày', status: 'Đang bật', tone: 'warning' },
  ],
  rows: [
    { code: 'SET-01', student: 'Bảo mật', service: '2FA', date: 'Hiệu lực', status: 'Đang bật', tone: 'success' },
    { code: 'SET-02', student: 'Ủy quyền', service: 'Phòng Học vụ', date: 'Hiệu lực', status: '3 người', tone: 'info' },
    { code: 'SET-03', student: 'Thông báo', service: 'Email / SMS', date: 'Cấu hình', status: 'Đang hoạt động', tone: 'success' },
    { code: 'SET-04', student: 'Đổi mật khẩu', service: '30 ngày trước', date: 'Nhắc nhở', status: 'Ổn định', tone: 'warning' },
  ],
  tableTitle: 'Thiết lập cài đặt tài khoản',
});

const roleDetailMap = {
  'ho-so': {
    'HS-3321': {
      kicker: 'HỒ SƠ SINH VIÊN',
      title: 'HS-3321 · Nguyễn Thị Lan',
      subtitle: 'Xác nhận sinh viên · Đang trong giai đoạn tiếp nhận',
      status: 'Mới', statusTone: 'info',
      summary: [
        { label: 'Loại yêu cầu', value: 'Xác nhận sinh viên' },
        { label: 'Ngày nhận', value: '14/10/2026' },
        { label: 'Người xử lý', value: 'Nhân viên Học vụ A' },
        { label: 'Thời hạn', value: 'Trong 24 giờ' },
      ],
      timeline: [
        'Người dùng nộp yêu cầu xác nhận tình trạng sinh viên tại cổng dịch vụ.',
        'Hệ thống đã tự động kiểm tra thông tin và phân luồng sang phòng Học vụ.',
        'Nhân viên cần đối chiếu thông tin định danh và xác nhận lại trạng thái.',
      ],
      notes: [
        { label: 'Yêu cầu', value: 'Xác nhận sinh viên đang học chính quy và có trạng thái hợp lệ.' },
        { label: 'Bổ sung', value: 'Chưa cần bổ sung thêm thông tin từ sinh viên.' },
      ],
      actions: [
        { label: 'Duyệt hồ sơ', detail: 'Phê duyệt trong 30 phút tới' },
        { label: 'Yêu cầu bổ sung', detail: 'Gửi nhắc cho sinh viên nếu thiếu dữ liệu' },
      ],
    },
    'HS-3327': {
      kicker: 'HỒ SƠ SINH VIÊN',
      title: 'HS-3327 · Trần Văn Hùng',
      subtitle: 'Cấp giấy xác nhận · Đang xử lý',
      status: 'Đang xử lý', statusTone: 'warning',
      summary: [
        { label: 'Loại yêu cầu', value: 'Cấp giấy xác nhận' },
        { label: 'Ngày nhận', value: '14/10/2026' },
        { label: 'Người xử lý', value: 'Nhân viên Tư vấn SV' },
        { label: 'Thời hạn', value: 'Trong 12 giờ' },
      ],
      timeline: [
        'Sinh viên gửi yêu cầu cấp giấy xác nhận học tập.',
        'Phòng Học vụ đã xác thực thông tin học lực và mã sinh viên.',
        'Nhân viên đang đối chiếu với hồ sơ học tập trước khi ký.',
      ],
      notes: [
        { label: 'Yêu cầu', value: 'Cần xác nhận thông tin học kỳ và lớp sinh hoạt.' },
        { label: 'Mức ưu tiên', value: 'Khẩn cấp trong ngày' },
      ],
      actions: [
        { label: 'Xác nhận giấy', detail: 'Chuẩn bị văn bản để ký số' },
        { label: 'Gửi phản hồi', detail: 'Thông báo cho sinh viên qua email' },
      ],
    },
    'PB-151': {
      kicker: 'CÔNG VIỆC PHÒNG BAN',
      title: 'PB-151 · Lê Hoàng Sơn',
      subtitle: 'Học bổng · Đang xử lý',
      status: 'Đang xử lý', statusTone: 'warning',
      summary: [
        { label: 'Dịch vụ', value: 'Học bổng' },
        { label: 'Đơn vị', value: 'Phòng Học vụ' },
        { label: 'Người phụ trách', value: 'Trưởng phòng ban' },
        { label: 'Xử lý', value: 'Thẩm định hồ sơ và phê duyệt' },
      ],
      timeline: [
        'Phiếu yêu cầu học bổng được phân công cho phòng điều phối.',
        'Phòng ban đang rà soát lại hồ sơ và số tiền hỗ trợ.',
        'Kết quả cần được chốt trước ngày nộp báo cáo.'
      ],
      notes: [
        { label: 'Lưu ý', value: 'Cần đồng bộ với phòng Tài chính trước khi ra quyết định.' },
        { label: 'Tình trạng', value: 'Đang thực hiện đúng tiến độ' },
      ],
      actions: [
        { label: 'Xem tiến độ', detail: 'Theo dõi tiến độ xử lý hồ sơ' },
        { label: 'Chốt báo cáo', detail: 'Gửi báo cáo cho Ban giám hiệu' },
      ],
    },
  },
  'ticket': {
    'TCK-233': {
      kicker: 'TICKET HỖ TRỢ',
      title: 'TCK-233 · Sinh viên cần hỗ trợ đăng ký',
      subtitle: 'Ticket mới · Chờ phản hồi',
      status: 'Chờ phản hồi', statusTone: 'info',
      summary: [
        { label: 'Người gửi', value: 'Nguyễn Văn Tân' },
        { label: 'Nhóm', value: 'Hỗ trợ sinh viên' },
        { label: 'Phân loại', value: 'Đăng ký học phần' },
        { label: 'Thời gian', value: '14/10 · 09:15' },
      ],
      timeline: [
        'Sinh viên gửi yêu cầu cần hỗ trợ hủy và đổi học phần.',
        'Hệ thống đã gắn ticket cho bộ phận hỗ trợ.',
        'Nhân viên cần xác nhận phương án giải quyết và phản hồi lại sinh viên.',
      ],
      notes: [
        { label: 'Mô tả', value: 'Sinh viên gặp lỗi khi hủy học phần do thời gian đăng ký đã khóa.' },
        { label: 'Ưu tiên', value: 'Khẩn cấp' },
      ],
      actions: [
        { label: 'Phản hồi', detail: 'Gửi hướng dẫn cập nhật' },
        { label: 'Mở lịch hẹn', detail: 'Đặt lịch tư vấn trực tiếp' },
      ],
    },
  },
  'lich-truc': {
    'LT-08': {
      kicker: 'LỊCH TRỰC',
      title: 'LT-08 · Ca trực quầy sáng',
      subtitle: 'Phòng Học vụ · 08:00 - 12:00',
      status: 'Đang trực', statusTone: 'success',
      summary: [
        { label: 'Đơn vị', value: 'Phòng Học vụ' },
        { label: 'Ca trực', value: '08:00 - 12:00' },
        { label: 'Nhân sự', value: '2 người trực' },
        { label: 'Lịch hẹn', value: '3 cuộc hẹn xác nhận' },
      ],
      timeline: [
        'Ca trực được phân công theo lịch cố định của buổi sáng.',
        'Nhân sự đang xử lý các yêu cầu tiếp nhận hồ sơ và xác nhận thu phí.',
        'Đã có 3 cuộc hẹn được đặt trong thời gian ca trực.',
      ],
      notes: [
        { label: 'Lưu ý', value: 'Cần sắp xếp nhân sự dự phòng cho khung giờ 10:30 - 11:00.' },
        { label: 'Đánh giá', value: 'Ca trực đang hoạt động ổn định' },
      ],
      actions: [
        { label: 'Xem lịch', detail: 'Kiểm tra chi tiết lịch trực' },
        { label: 'Chuyển ca', detail: 'Thay đổi lịch nếu cần' },
      ],
    },
  },
  'kpi': {
    'KPI-01': {
      kicker: 'BÁO CÁO KPI',
      title: 'KPI-01 · Hiệu suất xử lý',
      subtitle: 'Đạt 92% so với kế hoạch tháng',
      status: 'Tốt', statusTone: 'success',
      summary: [
        { label: 'Chỉ số', value: '92%' },
        { label: 'Mục tiêu', value: '90%' },
        { label: 'Thời gian', value: 'Tháng 10/2026' },
        { label: 'Nhóm', value: 'Học vụ' },
      ],
      timeline: [
        'Hiệu suất xử lý hồ sơ đạt trên mức target tháng này.',
        'Tốc độ phản hồi sinh viên đã giảm theo đúng kỳ vọng.',
        'Phòng ban cần duy trì tiến độ ở giai đoạn cuối tháng.',
      ],
      notes: [
        { label: 'Điểm nổi bật', value: 'Tăng 12% so với tháng trước.' },
        { label: 'Nhấn mạnh', value: 'Giữ tốc độ xử lý hồ sơ dưới 24 giờ.' },
      ],
      actions: [
        { label: 'Xem báo cáo', detail: 'Mở toàn bộ báo cáo KPI' },
        { label: 'Gửi note', detail: 'Gửi cho quản lý nội bộ' },
      ],
    },
  },
  'nguoi-dung': {
    'U-2048': {
      kicker: 'QUẢN LÝ NGƯỜI DÙNG',
      title: 'U-2048 · Nguyễn Văn Khánh',
      subtitle: 'Quản lý phòng ban · Tài khoản đang hoạt động',
      status: 'Đang hoạt động', statusTone: 'success',
      summary: [
        { label: 'Vai trò', value: 'Quản lý phòng ban' },
        { label: 'Phòng ban', value: 'Phòng Học vụ' },
        { label: 'Trạng thái', value: 'Hoạt động bình thường' },
        { label: 'Ngày cập nhật', value: '14/10/2026' },
      ],
      timeline: [
        'Tài khoản được cấp quyền quản lý và theo dõi tiến độ hồ sơ của phòng ban.',
        'Đã có 3 lượt phê duyệt trong 7 ngày qua.',
        'Hệ thống ghi nhận hoạt động truy cập ổn định và đúng quy định.',
      ],
      notes: [
        { label: 'Quyền truy cập', value: 'Xem và phê duyệt hồ sơ phòng ban' },
        { label: 'Bảo mật', value: '2FA đã kích hoạt' },
      ],
      actions: [
        { label: 'Xem hồ sơ', detail: 'Hiển thị thông tin chi tiết tài khoản' },
        { label: 'Phê duyệt quyền', detail: 'Cập nhật cấu hình phân quyền' },
      ],
    },
  },
  'he-thong': {
    'SYS-31': {
      kicker: 'HỆ THỐNG',
      title: 'SYS-31 · Người dùng mới cần phê duyệt',
      subtitle: 'Tài khoản mới đăng ký · Cần xác nhận',
      status: 'Cần phê duyệt', statusTone: 'info',
      summary: [
        { label: 'Đối tượng', value: 'Tài khoản nhân sự mới' },
        { label: 'Ngày đăng ký', value: '14/10/2026' },
        { label: 'Vị trí', value: 'Phòng Khảo thí' },
        { label: 'Mức ưu tiên', value: 'Thấp - cần xử lý sớm' },
      ],
      timeline: [
        'Một tài khoản mới được đăng ký trên cổng nội bộ.',
        'Hệ thống tự động kiểm tra thông tin nhân sự và quyền truy cập.',
        'Yêu cầu admin phê duyệt để kích hoạt khả năng sử dụng.',
      ],
      notes: [
        { label: 'Thông tin', value: 'Tài khoản phù hợp với phân quyền mới của bộ phận.' },
        { label: 'Điều kiện', value: 'Cần xác minh email công vụ trước khi cấp quyền.' },
      ],
      actions: [
        { label: 'Phê duyệt', detail: 'Kích hoạt tài khoản ngay' },
        { label: 'Từ chối', detail: 'Yêu cầu bổ sung thông tin' },
      ],
    },
  },
};

export function RoleDetailPage() {
  const { category, slug } = useParams();
  const detail = roleDetailMap[category]?.[slug] || {
    kicker: 'CHI TIẾT',
    title: 'Mục chưa có dữ liệu',
    subtitle: 'Dữ liệu đang được cập nhật',
    status: 'Chưa cập nhật',
    statusTone: 'neutral',
    summary: [
      { label: 'Danh mục', value: category || 'Chưa xác định' },
      { label: 'Mã', value: slug || 'N/A' },
    ],
    timeline: ['Thông tin đang được bổ sung trong giai đoạn phát triển.'],
    notes: [{ label: 'Ghi chú', value: 'Trang chi tiết sẽ được hoàn thiện khi dữ liệu chính thức được kết nối.' }],
    actions: [{ label: 'Quay lại', detail: 'Trở về dashboard chính' }],
  };

  return (
    <div className="role-detail-page">
      <div className="staff-dashboard-header role-detail-header">
        <div>
          <span className="dashboard-kicker">{detail.kicker}</span>
          <h1 className="page-title">{detail.title}</h1>
          <p className="page-subtitle">{detail.subtitle}</p>
        </div>
        <span className={`badge ${badgeClass(detail.statusTone)}`}>{detail.status}</span>
      </div>

      <div className="role-summary-grid">
        {detail.summary.map((item) => (
          <div key={item.label} className="card role-summary-item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="role-detail-content-grid">
        <section className="card staff-panel detail-panel-card">
          <div className="staff-section-heading">
            <div>
              <h2>Tiến độ xử lý</h2>
              <p>Thông tin theo từng bước vận hành và cập nhật.</p>
            </div>
          </div>
          <ul className="staff-focus-list role-detail-timeline">
            {detail.timeline.map((item, index) => (
              <li key={`${item}-${index}`}>
                <div className={`staff-dot ${index % 3 === 0 ? 'info' : index % 3 === 1 ? 'warning' : 'success'}`} />
                <div className="staff-focus-copy">
                  <strong>Bước {index + 1}</strong>
                  <span>{item}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="card staff-panel detail-panel-card">
          <div className="staff-section-heading">
            <div>
              <h2>Hành động nhanh</h2>
              <p>Những việc cần xử lý ngay trong ca làm.</p>
            </div>
          </div>
          <div className="detail-panel-body">
            {detail.actions.map((action) => (
              <Link key={action.label} to={category ? '/dashboard' : '/dashboard'} className="detail-panel-item is-clickable">
                <span className="detail-panel-label">{action.label}</span>
                <span className="detail-panel-meta">{action.detail}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <section className="card staff-panel detail-panel-card">
        <div className="staff-section-heading">
          <div>
            <h2>Thông tin chi tiết</h2>
            <p>Ghi chú và dữ liệu hỗ trợ điều hành.</p>
          </div>
        </div>
        <div className="detail-note-list">
          {detail.notes.map((note) => (
            <div key={note.label} className="detail-note-item">
              <strong>{note.label}</strong>
              <span>{note.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function UserRoundIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" /><circle cx="10" cy="7" r="4" /><path d="M22 19v-1a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
