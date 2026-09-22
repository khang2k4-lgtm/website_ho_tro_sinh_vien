import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, Clock3, CheckCircle2, Inbox } from 'lucide-react';
import { STATUS_LABELS, formatDate } from '../../utils/constants';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);

  const loadData = async () => {
    try {
      const [statsResponse, applicationsResponse] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: null })),
        api.get('/applications').catch(() => ({ data: [] })),
      ]);

      setStats(statsResponse.data || {
        overview: {
          todayApplications: applicationsResponse.data.length,
          openTickets: 0,
          processingApps: applicationsResponse.data.filter((a) => ['RECEIVED', 'PROCESSING', 'NEED_SUPPLEMENT'].includes(a.status)).length,
          completedApps: applicationsResponse.data.filter((a) => ['APPROVED', 'COMPLETED'].includes(a.status)).length,
          totalStudents: '-',
          totalStaff: '-',
          totalDepartments: '-',
          totalServices: '-',
        },
      });
      setApplications(applicationsResponse.data);
    } catch {
      setApplications([]);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 15000);
    const onFocus = () => loadData();

    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const o = stats?.overview || {};
  const pending = applications.filter((application) => ['SUBMITTED', 'RECEIVED', 'NEED_SUPPLEMENT'].includes(application.status));
  const processing = applications.filter((application) => application.status === 'PROCESSING');
  const completed = applications.filter((application) => ['APPROVED', 'COMPLETED'].includes(application.status));

  const cards = [
    { value: applications.length || o.todayApplications || 0, label: 'Tổng số', icon: Inbox, tone: 'blue' },
    { value: pending.length, label: 'Chờ xử lý', icon: Clock3, tone: 'amber' },
    { value: processing.length || o.processingApps || 0, label: 'Đang xử lý', icon: ClipboardList, tone: 'cyan' },
    { value: completed.length || o.completedApps || 0, label: 'Hoàn thành', icon: CheckCircle2, tone: 'green' },
  ];

  return (
    <div className="dashboard-page staff-dashboard-shell">
      <div className="staff-dashboard-header">
        <div>
          <span className="dashboard-kicker">BẢNG ĐIỀU KHIỂN</span>
          <h1 className="page-title">Xin chào, {user?.fullName || 'Nhân viên'}</h1>
          <p className="page-subtitle">Hôm nay bạn có <strong>{pending.length}</strong> yêu cầu cần xử lý.</p>
        </div>
        <Link className="btn btn-primary" to="/dashboard/ho-so">
          Mở danh sách yêu cầu <ArrowRight size={16} />
        </Link>
      </div>

      <div className="staff-stat-grid">
        {cards.map(({ value, label, icon: Icon, tone }) => (
          <div className="staff-stat-card" key={label}>
            <div className={`staff-stat-icon ${tone}`}><Icon size={18} /></div>
            <div className="staff-stat-content">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="staff-worklist card">
        <div className="staff-section-heading">
          <div>
            <h2>Yêu cầu cần xử lý</h2>
            <p>Danh sách hồ sơ mới, đang xử lý và chờ bổ sung thông tin.</p>
          </div>
          <Link to="/dashboard/ho-so">Xem tất cả <ArrowRight size={15} /></Link>
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
              {(applications.length > 0 ? applications : pending).slice(0, 6).map((application) => (
                <tr key={application.id}>
                  <td>
                    <Link className="staff-code" to={`/dashboard/ho-so/${application.id}`}>
                      {application.code}
                    </Link>
                  </td>
                  <td>
                    {application.student?.fullName}
                    <small>{application.student?.studentId}</small>
                  </td>
                  <td>{application.service?.name}</td>
                  <td>{formatDate(application.createdAt)}</td>
                  <td>
                    <span className={`badge ${STATUS_LABELS[application.status]?.class}`}>
                      {STATUS_LABELS[application.status]?.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
