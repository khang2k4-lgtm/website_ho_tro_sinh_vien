import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { STATUS_LABELS, formatDate } from '../../utils/constants';

const STATUSES = Object.keys(STATUS_LABELS);

export default function ManageApplications() {
  const [apps, setApps] = useState([]);

  const load = () => api.get('/applications').then((r) => setApps(r.data)).catch(() => setApps([]));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/applications/${id}/status`, { status, note: `Cập nhật: ${STATUS_LABELS[status].label}` });
    load();
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Quản lý hồ sơ</h1>
      <div className="card">
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem' }}>Mã</th>
                <th>Dịch vụ</th>
                <th>Sinh viên</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem' }}><Link to={`/ho-so/${a.id}`}>{a.code}</Link></td>
                  <td>{a.service?.name}</td>
                  <td>{a.student?.fullName}</td>
                  <td>{formatDate(a.createdAt)}</td>
                  <td>
                    <select className="select" value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} style={{ minWidth: 160 }}>
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {apps.length === 0 && <div className="empty-state">Chưa có hồ sơ.</div>}
        </div>
      </div>
    </div>
  );
}
