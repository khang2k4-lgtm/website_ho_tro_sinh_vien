import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDate } from '../../utils/constants';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    api.get('/admin/audit-logs').then((r) => setLogs(r.data)).catch(() => setLogs([]));
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Audit Log</h1>
      <div className="card"><div className="card-body" style={{ display: 'grid', gap: '0.5rem' }}>
        {logs.length === 0 && <div className="empty-state">Chưa có nhật ký.</div>}
        {logs.map((l) => (
          <div key={l.id} style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <strong>{l.action}</strong> · {l.entityType} · {l.user?.fullName}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.details} · {formatDate(l.createdAt)}</div>
          </div>
        ))}
      </div></div>
    </div>
  );
}
