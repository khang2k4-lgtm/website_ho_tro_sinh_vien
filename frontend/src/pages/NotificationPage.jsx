import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatDate } from '../utils/constants';
import { Bell, CheckCheck, ArrowUpRight, Check } from 'lucide-react';

export default function NotificationPage() {
  const [items, setItems] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const load = () => api.get('/notifications').then((res) => setItems(res.data)).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const markAll = async () => {
    setMarkingAll(true);
    try {
      await api.patch('/notifications/read-all');
      load();
    } finally {
      setMarkingAll(false);
    }
  };

  const markRead = async (id) => {
    setBusyId(id);
    try {
      await api.patch(`/notifications/${id}/read`);
      setItems((current) => current.map((item) => item.id === id ? { ...item, isRead: true } : item));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <section className="page-hero"><div className="container"><div className="page-kicker">Cập nhật của bạn</div><h1 className="page-title">Thông báo cá nhân</h1><p className="page-subtitle">Theo dõi tiến độ hồ sơ và những cập nhật dành riêng cho bạn.</p></div></section>
      <div className="container page-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Mới nhất</h2>
          <button className="btn btn-outline btn-sm" onClick={markAll} disabled={markingAll || !items.some((item) => !item.isRead)}><CheckCheck size={15} />{markingAll ? 'Đang cập nhật...' : 'Đánh dấu đã đọc'}</button>
        </div>
        <div className="card">
          <div className="card-body">
            {items.length === 0 ? <div className="empty-state">Không có thông báo mới.</div> : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ padding: '0.9rem 1rem', border: '1px solid var(--border)', borderRadius: 10, background: item.isRead ? 'white' : '#f8fafc' }}>
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}><Bell size={18} style={{ color: 'var(--accent)', marginTop: 3 }} /><strong>{item.title}</strong></div>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.message}</p>
                    <small>{formatDate(item.createdAt)}</small>
                    <div className="action-row" style={{ marginTop: '0.6rem' }}>
                      {item.link && <Link className="btn btn-outline btn-sm" to={item.link}><ArrowUpRight size={14} />Xem chi tiết</Link>}
                      {!item.isRead && <button className="btn btn-ghost btn-sm" onClick={() => markRead(item.id)} disabled={busyId === item.id}><Check size={14} />{busyId === item.id ? 'Đang cập nhật...' : 'Đánh dấu đã đọc'}</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
