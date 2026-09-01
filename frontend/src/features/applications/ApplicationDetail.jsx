import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { STATUS_LABELS, formatDate } from '../../utils/constants';

export default function ApplicationDetail() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [rating, setRating] = useState({ score: 5, comment: '' });

  useEffect(() => {
    api.get(`/applications/${id}`).then((r) => setApp(r.data));
  }, [id]);

  const submitRating = async () => {
    await api.post('/ratings', { score: rating.score, comment: rating.comment, applicationId: id, serviceId: app.serviceId });
    api.get(`/applications/${id}`).then((r) => setApp(r.data));
  };

  if (!app) return <div className="loading container">Đang tải...</div>;

  const status = STATUS_LABELS[app.status];

  return (
    <div className="container" style={{ maxWidth: 800, padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Hồ sơ {app.code}</h1>
          <p className="page-subtitle">{app.service?.name}</p>
        </div>
        <span className={`badge ${status?.class}`}>{status?.label}</span>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">Timeline xử lý</div>
          <div className="card-body">
            <div className="timeline">
              {app.statusHistory?.map((h) => (
                <div key={h.id} className="timeline-item">
                  <strong>{STATUS_LABELS[h.status]?.label}</strong>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{h.note}</p>
                  <small style={{ color: 'var(--text-muted)' }}>{h.changedBy?.fullName} · {formatDate(h.createdAt)}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-header">Thông tin hồ sơ</div>
            <div className="card-body" style={{ fontSize: '0.875rem' }}>
              <p><strong>Sinh viên:</strong> {app.student?.fullName} ({app.student?.studentId})</p>
              <p><strong>Phòng:</strong> <Link to={`/phong-ban/${app.service?.department?.slug}`}>{app.service?.department?.name}</Link></p>
              {app.assignedTo && <p><strong>Nhân viên:</strong> {app.assignedTo.fullName}</p>}
              {app.rejectReason && <p style={{ color: 'var(--danger)' }}><strong>Lý do từ chối:</strong> {app.rejectReason}</p>}
              {Object.entries(app.formData || {}).map(([k, v]) => (
                <p key={k}><strong>{k}:</strong> {String(v)}</p>
              ))}
            </div>
          </div>

          {app.status === 'COMPLETED' && !app.rating && (
            <div className="card">
              <div className="card-header">Đánh giá dịch vụ</div>
              <div className="card-body">
                <div className="form-group">
                  <label className="label">Mức độ hài lòng (1-5)</label>
                  <input type="range" min="1" max="5" value={rating.score} onChange={(e) => setRating({ ...rating, score: +e.target.value })} />
                  <span> {rating.score}/5 ⭐</span>
                </div>
                <div className="form-group">
                  <textarea className="textarea" placeholder="Nhận xét..." value={rating.comment} onChange={(e) => setRating({ ...rating, comment: e.target.value })} />
                </div>
                <button className="btn btn-primary btn-sm" onClick={submitRating}>Gửi đánh giá</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
