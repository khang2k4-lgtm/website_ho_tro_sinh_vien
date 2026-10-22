import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { STATUS_LABELS, formatDate } from '../../utils/constants';
import { CalendarDays, Search, SlidersHorizontal } from 'lucide-react';
import './ManageApplications.css';

const STATUSES = Object.keys(STATUS_LABELS);

export default function ManageApplications() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  const load = () => api.get('/applications').then((r) => setApps(r.data)).catch(() => setApps([]));
  useEffect(() => {
    load();
    const timer = setInterval(load, 15000);
    const onFocus = () => load();

    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const visibleApps = apps.filter((a) => {
    const matchesSearch = `${a.code} ${a.service?.name || ''} ${a.student?.fullName || ''}`.toLowerCase().includes(search.toLowerCase());
    const createdAt = new Date(a.createdAt);
    const now = new Date();
    const matchesDate = dateFilter === 'ALL'
      || (dateFilter === 'TODAY' && createdAt.toDateString() === now.toDateString())
      || (dateFilter === 'WEEK' && now - createdAt < 7 * 24 * 60 * 60 * 1000);
    return matchesSearch && (statusFilter === 'ALL' || a.status === statusFilter) && matchesDate;
  });

  return (
    <div className="dashboard-page manage-applications-page">
      <div className="dashboard-heading"><div><span className="dashboard-kicker">WORK QUEUE</span><h1 className="page-title">Yêu cầu cần xử lý</h1><p className="page-subtitle">Tra cứu hồ sơ theo mã, sinh viên hoặc dịch vụ và mở chi tiết để xử lý.</p></div><div className="staff-list-count">{visibleApps.length} hồ sơ</div></div>
      <div className="staff-filters"><label className="field-search"><Search size={18} /><input className="input" aria-label="Tìm hồ sơ" placeholder="Tìm mã, dịch vụ, sinh viên" value={search} onChange={(e) => setSearch(e.target.value)} /></label><label className="filter-control"><SlidersHorizontal size={16} /><select className="select" aria-label="Lọc trạng thái" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="ALL">Tất cả trạng thái</option>{STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status].label}</option>)}</select></label><label className="filter-control"><CalendarDays size={16} /><select className="select" aria-label="Lọc ngày" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}><option value="ALL">Tất cả ngày</option><option value="TODAY">Hôm nay</option><option value="WEEK">7 ngày qua</option></select></label><button className="btn btn-outline btn-sm" type="button" onClick={() => { setSearch(''); setStatusFilter('ALL'); setDateFilter('ALL'); }}>Đặt lại</button></div>
      <div className="card">
        <div className="card-body applications-table-scroll">
          <table className="applications-table">
            <colgroup>
              <col className="application-code-column" />
              <col className="application-service-column" />
              <col className="application-student-column" />
              <col className="application-date-column" />
              <col className="application-status-column" />
              <col className="application-action-column" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Mã hồ sơ</th>
                <th scope="col">Dịch vụ</th>
                <th scope="col">Sinh viên</th>
                <th scope="col">Ngày gửi</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {visibleApps.map((a) => (
                <tr key={a.id}>
                  <td><Link className="staff-code" to={`/dashboard/ho-so/${a.id}`}>{a.code}</Link></td>
                  <td>{a.service?.name}</td>
                  <td>{a.student?.fullName}</td>
                  <td>{formatDate(a.createdAt)}</td>
                  <td><span className={`badge ${STATUS_LABELS[a.status]?.class}`}>{STATUS_LABELS[a.status]?.label}</span></td>
                  <td><Link className="btn btn-outline btn-sm application-action-link" to={`/dashboard/ho-so/${a.id}`}>Xử lý</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          {visibleApps.length === 0 && <div className="empty-state">{apps.length === 0 ? 'Chưa có hồ sơ.' : 'Không tìm thấy hồ sơ phù hợp.'}</div>}
        </div>
      </div>
    </div>
  );
}
