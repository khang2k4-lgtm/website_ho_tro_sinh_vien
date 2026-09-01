import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { formatDate } from '../utils/constants';

export default function AnnouncementDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    api.get(`/announcements/${id}`).then((res) => setItem(res.data)).catch(() => setItem(null));
  }, [id]);

  if (!item) return <div className="container loading">Đang tải...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 800 }}>
      <h1 className="page-title">{item.title}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{item.department?.name || 'Phòng ban'} · {formatDate(item.createdAt)}</p>
      <div className="card"><div className="card-body" style={{ whiteSpace: 'pre-line' }}>{item.content}</div></div>
    </div>
  );
}
