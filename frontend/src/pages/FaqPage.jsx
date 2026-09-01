import { useEffect, useState } from 'react';
import api from '../services/api';

export default function FaqPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    api.get(`/faqs${params}`).then((r) => setItems(r.data)).catch(() => setItems([]));
  }, [search]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 800 }}>
      <h1 className="page-title">Câu hỏi thường gặp</h1>
      <p className="page-subtitle">Tra cứu nhanh các thủ tục và quy định dành cho sinh viên.</p>
      <input className="input" placeholder="Tìm câu hỏi..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: '1.5rem' }} />
      {items.length === 0 ? (
        <div className="card"><div className="card-body"><div className="empty-state">Chưa có FAQ phù hợp.</div></div></div>
      ) : items.map((f) => (
        <details key={f.id} className="card" style={{ marginBottom: '0.75rem' }}>
          <summary className="card-body" style={{ cursor: 'pointer', fontWeight: 600 }}>{f.question}</summary>
          <div className="card-body" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {f.answer}
            {f.department?.name && <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem' }}>Phòng: {f.department.name}</p>}
          </div>
        </details>
      ))}
    </div>
  );
}
