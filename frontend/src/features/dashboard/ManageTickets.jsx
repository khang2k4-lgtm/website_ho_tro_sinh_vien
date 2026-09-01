import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { TICKET_STATUS, formatDate } from '../../utils/constants';

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);

  const load = () => api.get('/tickets').then((r) => setTickets(r.data)).catch(() => setTickets([]));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/tickets/${id}/status`, { status });
    load();
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Ticket hỗ trợ</h1>
      <div className="card">
        <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
          {tickets.length === 0 && <div className="empty-state">Không có ticket.</div>}
          {tickets.map((t) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div>
                <Link to={`/ho-tro/${t.id}`}><strong>{t.title}</strong></Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.code} · {t.student?.fullName} · {formatDate(t.createdAt)}</div>
              </div>
              <select className="select" value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)} style={{ maxWidth: 180 }}>
                {Object.entries(TICKET_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
