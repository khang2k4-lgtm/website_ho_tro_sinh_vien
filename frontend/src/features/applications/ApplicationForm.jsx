import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ApplicationForm() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({ purpose: '', note: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/services/${slug}`).then((r) => setService(r.data));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('serviceId', service.id);
      fd.append('formData', JSON.stringify({
        fullName: user.fullName,
        studentId: user.studentId,
        faculty: user.faculty,
        className: user.className,
        email: user.email,
        ...form,
      }));
      fd.append('note', form.note);
      files.forEach((f) => fd.append('attachments', f));
      await api.post('/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/tai-khoan/ho-so');
    } catch (err) {
      setError(err.response?.data?.message || 'Gửi hồ sơ thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!service) return <div className="loading container">Đang tải...</div>;

  return (
    <div className="container" style={{ maxWidth: 640, padding: '2rem 1.5rem' }}>
      <h1 className="page-title">Nộp hồ sơ: {service.name}</h1>
      <p className="page-subtitle">Phòng: {service.department?.name}</p>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: 8, marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          <div className="form-group"><label className="label">Họ tên</label><input className="input" value={user?.fullName || ''} disabled /></div>
          <div className="grid grid-2">
            <div className="form-group"><label className="label">MSSV</label><input className="input" value={user?.studentId || ''} disabled /></div>
            <div className="form-group"><label className="label">Lớp</label><input className="input" value={user?.className || ''} disabled /></div>
          </div>
          <div className="form-group"><label className="label">Mục đích / Lý do *</label><textarea className="textarea" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required /></div>
          <div className="form-group"><label className="label">Ghi chú</label><textarea className="textarea" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
          <div className="form-group">
            <label className="label">File đính kèm</label>
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setFiles([...e.target.files])} />
            <small style={{ color: 'var(--text-muted)' }}>PDF, JPG, PNG, DOC (tối đa 10MB/file)</small>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi hồ sơ'}</button>
        </div>
      </form>
    </div>
  );
}
