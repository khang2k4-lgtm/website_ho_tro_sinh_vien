import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate } from '../utils/constants';

export default function QnAPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  const load = () => api.get('/questions').then((r) => setItems(r.data)).catch(() => setItems([]));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/questions', form);
      setForm({ title: '', content: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Không gửi được câu hỏi');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Hỏi đáp</h1>
      <p className="page-subtitle">Đặt câu hỏi cho phòng ban. Nhân viên sẽ trả lời trực tiếp.</p>

      {user?.role === 'STUDENT' && (
        <form className="card" onSubmit={submit} style={{ marginBottom: '2rem' }}>
          <div className="card-header">Đặt câu hỏi mới</div>
          <div className="card-body">
            {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
            <div className="form-group"><label className="label">Tiêu đề</label><input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="form-group"><label className="label">Nội dung</label><textarea className="textarea" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required /></div>
            <button className="btn btn-primary" type="submit">Gửi câu hỏi</button>
          </div>
        </form>
      )}

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {items.map((q) => (
          <Link key={q.id} to={`/hoi-dap/${q.id}`} className="card" style={{ display: 'block' }}>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <strong>{q.title}</strong>
                {q.isResolved && <span className="badge badge-success">Đã giải đáp</span>}
              </div>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>{q.author?.fullName} · {q._count?.answers || 0} trả lời · {formatDate(q.createdAt)}</p>
            </div>
          </Link>
        ))}
        {items.length === 0 && <div className="card"><div className="card-body"><div className="empty-state">Chưa có câu hỏi.</div></div></div>}
      </div>
    </div>
  );
}
