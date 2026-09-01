import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../services/api';
import { STATUS_LABELS } from '../../utils/constants';

export default function Reports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data)).catch(() => setStats(null));
  }, []);

  const chartData = (stats?.applicationsByStatus || []).map((s) => ({
    name: STATUS_LABELS[s.status]?.label || s.status,
    count: s._count,
  }));

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Báo cáo</h1>
      {!stats ? <div className="empty-state">Không tải được thống kê. Đăng nhập bằng admin hoặc chăm sóc SV.</div> : (
        <>
          <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
            <div className="stat-card"><div className="label">Sinh viên</div><div className="value">{stats.overview.totalStudents}</div></div>
            <div className="stat-card"><div className="label">Nhân viên</div><div className="value">{stats.overview.totalStaff}</div></div>
            <div className="stat-card"><div className="label">Hồ sơ hoàn thành</div><div className="value">{stats.overview.completedApps}</div></div>
            <div className="stat-card"><div className="label">Ticket mở</div><div className="value">{stats.overview.openTickets}</div></div>
          </div>
          <div className="card">
            <div className="card-header">Hồ sơ theo trạng thái</div>
            <div className="card-body" style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#27aae1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
