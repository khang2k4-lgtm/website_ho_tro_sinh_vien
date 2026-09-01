import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { CATEGORIES } from '../../utils/constants';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    api.get(`/services?${params}`).then((r) => setServices(r.data));
  }, [category, search]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Dịch vụ sinh viên</h1>
      <p className="page-subtitle">Tất cả dịch vụ và thủ tục hành chính</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input className="input" placeholder="Tìm dịch vụ..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">Tất cả danh mục</option>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="grid grid-3">
        {services.map((s) => (
          <Link key={s.id} to={`/dich-vu/${s.slug}`} className="card" style={{ display: 'block' }}>
            <div className="card-body">
              <span className="badge badge-info">{CATEGORIES[s.category]}</span>
              <h3 style={{ margin: '0.75rem 0 0.5rem' }}>{s.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{s.department?.name}</p>
              <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>⏱ {s.processingTime} · {s.submissionType}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
