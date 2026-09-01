import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatDate } from '../utils/constants';

export default function NotificationPage() {
  const [items, setItems] = useState([]);

  const load = () => api.get('/notifications').then((res) => setItems(res.data)).catch(() => setItems([]));
  useEffect(() => { load(); }, []);

  const markAll = async () => {
    await api.patch('/notifications/read-all');
    load();
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Thông báo cá nhân</h1>
        <button className="btn btn-outline btn-sm" onClick={markAll}>Đánh dấu đã đọc</button>
      </div>
      <div className="card">
        <div className="card-body">
          {items.length === 0 ? <div className="empty-state">Không có thông báo mới.</div> : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ padding: '0.9rem 1rem', border: '1px solid var(--border)', borderRadius: 10, background: item.isRead ? 'white' : '#f8fafc' }}>
                  <strong>{item.title}</strong>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{item.message}</p>
                  <small>{formatDate(item.createdAt)}</small>
                  {item.link && <div><Link to={item.link} style={{ color: 'var(--primary)' }}>Xem chi tiết</Link></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
