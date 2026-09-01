import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatDate } from '../utils/constants';

export default function AnnouncementList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    api.get(`/announcements${params}`).then((res) => setItems(res.data)).catch(() => setItems([]));
  }, [search]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Thông báo</h1>
      <input className="input" placeholder="Tìm thông báo..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 360, marginBottom: '1.5rem' }} />
      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.length === 0 ? (
          <div className="card"><div className="card-body"><div className="empty-state">Chưa có thông báo mới được công bố.</div></div></div>
        ) : items.map((item) => (
          <Link key={item.id} to={`/thong-bao/${item.id}`} className="card" style={{ display: 'block' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
                <strong>{item.title}</strong>
                {item.isPinned && <span className="badge badge-warning">Nổi bật</span>}
              </div>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{item.department?.name || 'Phòng ban'}</p>
              <small>{formatDate(item.createdAt)}</small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
