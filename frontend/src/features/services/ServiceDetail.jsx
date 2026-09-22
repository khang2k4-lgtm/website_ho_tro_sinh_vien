import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Clock, Building2 } from 'lucide-react';
import api from '../../services/api';
import { CATEGORIES } from '../../utils/constants';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    api.get(`/services/${slug}`).then((r) => setService(r.data));
  }, [slug]);

  if (!service) return <div className="loading container">Đang tải...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          <span className="badge badge-info">{CATEGORIES[service.category]}</span>
          <h1 className="page-title" style={{ marginTop: '0.5rem' }}>{service.name}</h1>
          <p className="page-subtitle">{service.description}</p>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">Tóm tắt thủ tục</div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>Cơ quan giải quyết</div>
                <div style={{ fontWeight: 600, marginTop: '0.3rem' }}>{service.department?.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>Thời gian</div>
                <div style={{ fontWeight: 600, marginTop: '0.3rem' }}>{service.processingTime}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--muted)' }}>Hình thức</div>
                <div style={{ fontWeight: 600, marginTop: '0.3rem' }}>{service.submissionType}</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">Hồ sơ cần thiết</div>
            <div className="card-body">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {service.requiredDocs?.map((d, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} /> <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">Quy trình giải quyết</div>
            <div className="card-body">
              <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {service.steps?.map((s, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{s}</li>)}
              </ol>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ position: 'sticky', top: 90 }}>
            <div className="card-body">
              <div style={{ marginBottom: '1rem' }}>
                <Building2 size={18} style={{ display: 'inline', marginRight: 8 }} />
                <Link to={`/phong-ban/${service.department?.slug}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{service.department?.name}</Link>
              </div>
              <div style={{ marginBottom: '0.75rem' }}><Clock size={16} style={{ display: 'inline', marginRight: 8 }} />{service.processingTime}</div>
              <div style={{ marginBottom: '0.75rem' }}>Hình thức: <strong>{service.submissionType}</strong></div>
              {service.fee && <div style={{ marginBottom: '0.75rem' }}>Phí: {service.fee}</div>}
              {service.avgRating > 0 && <div style={{ marginBottom: '1rem' }}>⭐ {service.avgRating.toFixed(1)}/5</div>}
              <Link to={`/nop-ho-so/${service.slug}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Nộp hồ sơ online</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
