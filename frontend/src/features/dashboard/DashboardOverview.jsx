import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats')
      .then((r) => setStats(r.data))
      .catch(async () => {
        const [apps, tickets, notifs] = await Promise.all([
          api.get('/applications').catch(() => ({ data: [] })),
          api.get('/tickets').catch(() => ({ data: [] })),
          api.get('/notifications/unread-count').catch(() => ({ data: { count: 0 } })),
        ]);
        setStats({
          overview: {
            todayApplications: apps.data.length,
            openTickets: tickets.data.length,
            processingApps: apps.data.filter((a) => ['RECEIVED', 'PROCESSING', 'NEED_SUPPLEMENT'].includes(a.status)).length,
            completedApps: apps.data.filter((a) => a.status === 'COMPLETED').length,
            totalStudents: '-',
            totalStaff: '-',
            totalDepartments: '-',
            totalServices: '-',
          },
          fallbackNotifs: notifs.data.count,
        });
      });
  }, []);

  const o = stats?.overview || {};

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Tổng quan</h1>
      <p className="page-subtitle">Xin chào, {user?.fullName}</p>
      <div className="grid grid-4">
        <div className="stat-card"><div className="label">Hồ sơ hôm nay</div><div className="value">{o.todayApplications ?? 0}</div></div>
        <div className="stat-card"><div className="label">Đang xử lý</div><div className="value">{o.processingApps ?? 0}</div></div>
        <div className="stat-card"><div className="label">Ticket mở</div><div className="value">{o.openTickets ?? 0}</div></div>
        <div className="stat-card"><div className="label">Dịch vụ</div><div className="value">{o.totalServices ?? 0}</div></div>
      </div>
    </div>
  );
}
