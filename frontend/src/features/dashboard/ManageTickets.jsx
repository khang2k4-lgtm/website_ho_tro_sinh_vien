import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { TICKET_STATUS, formatDate } from '../../utils/constants';
import { Search } from 'lucide-react';

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => api.get('/tickets').then((r) => setTickets(r.data)).catch(() => setTickets([]));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try { await api.patch(`/tickets/${id}/status`, { status }); load(); }
    catch (err) { alert(err.response?.data?.message || 'Không thể cập nhật ticket'); }
    finally { setUpdatingId(null); }
  };

  const visibleTickets = tickets.filter((t) => `${t.code} ${t.title} ${t.student?.fullName || ''}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-toolbar"><div><h1 className="page-title">Ticket hỗ trợ</h1><p className="page-subtitle">Tiếp nhận, phản hồi và đóng yêu cầu của sinh viên.</p></div><label className="field-search" style={{ maxWidth: 360 }}><Search size={18} /><input className="input" aria-label="Tìm ticket" placeholder="Mã ticket, tiêu đề, sinh viên" value={search} onChange={(e) => setSearch(e.target.value)} /></label></div>
      <div className="card">
        <div className="card-body" style={{ display: 'grid', gap: '0.75rem' }}>
          {visibleTickets.length === 0 && <div className="empty-state">{tickets.length === 0 ? 'Không có ticket.' : 'Không tìm thấy ticket phù hợp.'}</div>}
          {visibleTickets.map((t) => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div>
                <Link to={`/ho-tro/${t.id}`}><strong>{t.title}</strong></Link>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.code} · {t.student?.fullName} · {formatDate(t.createdAt)}</div>
              </div>
              <select className="select" value={t.status} disabled={updatingId === t.id} onChange={(e) => updateStatus(t.id, e.target.value)} style={{ maxWidth: 180 }}>
                {Object.entries(TICKET_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
