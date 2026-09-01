import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, FileText, HelpCircle } from 'lucide-react';
import api from '../../services/api';
import { CATEGORIES } from '../../utils/constants';

export default function DepartmentDetail() {
  const { slug } = useParams();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/departments/${slug}`).then((r) => { setDept(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading container">Đang tải...</div>;
  if (!dept) return <div className="empty-state container">Không tìm thấy phòng ban</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-body">
          <h1 className="page-title">{dept.name}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{dept.description}</p>
          <div className="grid grid-2" style={{ gap: '0.75rem', fontSize: '0.875rem' }}>
            {dept.address && <div><MapPin size={16} style={{ display: 'inline', marginRight: 8 }} />{dept.address}</div>}
            {dept.phone && <div><Phone size={16} style={{ display: 'inline', marginRight: 8 }} />{dept.phone}</div>}
            {dept.email && <div><Mail size={16} style={{ display: 'inline', marginRight: 8 }} />{dept.email}</div>}
            {dept.workingHours && <div><Clock size={16} style={{ display: 'inline', marginRight: 8 }} />{dept.workingHours}</div>}
          </div>
        </div>
      </div>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Dịch vụ ({dept.services?.length})</h2>
        <div className="grid grid-2">
          {dept.services?.map((s) => (
            <Link key={s.id} to={`/dich-vu/${s.slug}`} className="card" style={{ display: 'block' }}>
              <div className="card-body">
                <FileText size={20} style={{ color: 'var(--primary)' }} />
                <h3 style={{ margin: '0.5rem 0' }}>{s.name}</h3>
                <span className="badge badge-neutral">{CATEGORIES[s.category]}</span>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{s.processingTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {dept.faqs?.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}><HelpCircle size={20} style={{ display: 'inline' }} /> FAQ</h2>
          {dept.faqs.map((f) => (
            <details key={f.id} className="card" style={{ marginBottom: '0.5rem' }}>
              <summary className="card-body" style={{ cursor: 'pointer', fontWeight: 600 }}>{f.question}</summary>
              <div className="card-body" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>{f.answer}</div>
            </details>
          ))}
        </section>
      )}

      {dept.staff?.length > 0 && (
        <section>
          <h2 style={{ marginBottom: '1rem' }}>Nhân viên hỗ trợ</h2>
          <div className="grid grid-3">
            {dept.staff.map((s) => (
              <div key={s.id} className="card"><div className="card-body" style={{ textAlign: 'center' }}>
                <div className="avatar" style={{ margin: '0 auto 0.5rem', width: 48, height: 48 }}>{s.fullName.charAt(0)}</div>
                <strong>{s.fullName}</strong>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{s.email}</p>
              </div></div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
