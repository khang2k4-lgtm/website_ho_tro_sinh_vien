import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { STAFF_ROLES } from '../utils/constants';
import api from '../services/api';
import { formatDate } from '../utils/constants';

export default function QuestionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [content, setContent] = useState('');

  const load = useCallback(
    () => api.get(`/questions/${id}`).then((r) => setItem(r.data)).catch(() => setItem(null)),
    [id],
  );

  useEffect(() => { load(); }, [load]);

  const answer = async (e) => {
    e.preventDefault();
    await api.post(`/questions/${id}/answers`, { content });
    setContent('');
    load();
  };

  if (!item) return <div className="container loading">Đang tải...</div>;

  const canAnswer = user && STAFF_ROLES.includes(user.role);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 800 }}>
      <h1 className="page-title">{item.title}</h1>
      <p className="page-subtitle">{item.author?.fullName} · {formatDate(item.createdAt)}</p>
      <div className="card" style={{ marginBottom: '1.5rem' }}><div className="card-body" style={{ whiteSpace: 'pre-line' }}>{item.content}</div></div>

      <h2 style={{ marginBottom: '1rem' }}>Trả lời ({item.answers?.length || 0})</h2>
      {item.answers?.map((a) => (
        <div key={a.id} className="card" style={{ marginBottom: '0.75rem' }}>
          <div className="card-body">
            <strong>{a.author?.fullName}</strong> <span className="badge badge-neutral">{a.author?.role}</span>
            <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-line' }}>{a.content}</p>
            <small style={{ color: 'var(--text-muted)' }}>{formatDate(a.createdAt)}</small>
          </div>
        </div>
      ))}

      {canAnswer && (
        <form className="card" onSubmit={answer}>
          <div className="card-header">Trả lời với tư cách cán bộ</div>
          <div className="card-body">
            <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} required />
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} type="submit">Gửi trả lời</button>
          </div>
        </form>
      )}
    </div>
  );
}
