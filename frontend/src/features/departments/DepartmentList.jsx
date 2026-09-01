import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, FileText } from 'lucide-react';
import api from '../../services/api';

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/departments').then((r) => { setDepartments(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading container">Đang tải...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Danh mục phòng ban</h1>
      <p className="page-subtitle">Tra cứu phòng ban, dịch vụ và thông tin liên hệ</p>

      <input className="input" placeholder="Tìm phòng ban..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 400, marginBottom: '2rem' }} />

      <div className="grid grid-3">
        {filtered.map((d) => (
          <div key={d.id} className="card">
            <div className="card-body">
              <Building2 size={32} style={{ color: 'var(--primary)', marginBottom: '0.75rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>{d.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{d.description?.slice(0, 100)}...</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span><Users size={14} /> {d._count?.staff || 0} NV</span>
                <span><FileText size={14} /> {d._count?.services || 0} dịch vụ</span>
              </div>
              <Link to={`/phong-ban/${d.slug}`} className="btn btn-primary btn-sm">Xem chi tiết</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
