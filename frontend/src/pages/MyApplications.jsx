import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { STATUS_LABELS, formatDate } from '../utils/constants';

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    api.get('/applications').then((res) => setApps(res.data)).catch(() => setApps([]));
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Hồ sơ của tôi</h1>
      <div className="grid grid-2">
        {apps.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1' }}><div className="card-body"><div className="empty-state">Bạn chưa có hồ sơ nào.</div></div></div>
        ) : apps.map((app) => (
          <Link key={app.id} to={`/ho-so/${app.id}`} className="card" style={{ display: 'block' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                <strong>{app.service?.name}</strong>
                <span className={`badge ${STATUS_LABELS[app.status]?.class}`}>{STATUS_LABELS[app.status]?.label}</span>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{app.code}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>{formatDate(app.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
