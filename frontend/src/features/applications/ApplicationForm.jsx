import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, FolderUp, ShieldCheck, Clock3, X } from 'lucide-react';
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
    <div className="application-page">
      <div className="container">
        <div className="application-shell">
          <section className="application-form-panel">
            <div className="application-header">
              {/* <Link to={`/dich-vu/${service.slug}`} className="back-link">
                <ArrowLeft size={16} />
                Quay lại chi tiết thủ tục
              </Link> */}
              <div className="eyebrow">Hồ sơ trực tuyến</div>
              <h1>Nộp hồ sơ: {service.name}</h1>
              <p>{service.department?.name}</p>
            </div>

            {error && <div className="application-error">{error}</div>}

            <form onSubmit={handleSubmit} className="application-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="label">Họ và tên</label>
                  <input className="input" value={user?.fullName || ''} disabled />
                </div>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input className="input" value={user?.email || ''} disabled />
                </div>
              </div>

              <div className="form-grid two-col">
                <div className="form-group">
                  <label className="label">MSSV</label>
                  <input className="input" value={user?.studentId || ''} disabled />
                </div>
                <div className="form-group">
                  <label className="label">Lớp</label>
                  <input className="input" value={user?.className || ''} disabled />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Mục đích / Lý do nộp hồ sơ <span className="required-mark">*</span></label>
                <textarea
                  className="textarea"
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  placeholder="Ví dụ: Cần chứng thực bản sao bằng tốt nghiệp để làm hồ sơ xin việc..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Ghi chú thêm</label>
                <textarea
                  className="textarea"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Nhập thông tin bổ sung nếu có"
                />
              </div>

              <div className="form-group">
                <label className="label">File đính kèm</label>
                <div className="upload-box">
                  <label htmlFor="attachment-upload" className="upload-trigger">
                    <FolderUp size={18} />
                    <span>{files.length > 0 ? `${files.length} file đã chọn` : 'Tải lên tài liệu cần thiết'}</span>
                  </label>
                  <input
                    id="attachment-upload"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setFiles([...e.target.files])}
                  />
                </div>
                <small className="input-hint">PDF, JPG, PNG, DOC (tối đa 10MB/file)</small>
              </div>

              <div className="form-actions">
                <Link to={`/dich-vu/${service.slug}`} className="btn btn-secondary">
                  <X size={16} />
                  Hủy
                </Link>
                <button type="submit" className="submit-btn" disabled={loading}>
                  <FileText size={16} />
                  {loading ? 'Đang gửi hồ sơ...' : 'Nộp hồ sơ'}
                </button>
              </div>
            </form>
          </section>

          <aside className="application-summary-panel">
            <div className="summary-card">
              <div className="summary-card-header">
                <div className="summary-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <span className="summary-label">Thủ tục</span>
                  <h2>{service.name}</h2>
                </div>
              </div>

              <div className="summary-list">
                <div className="summary-item">
                  <Clock3 size={16} />
                  <div>
                    <span>Thời gian xử lý</span>
                    <strong>{service.processingTime}</strong>
                  </div>
                </div>

                <div className="summary-item">
                  <ShieldCheck size={16} />
                  <div>
                    <span>Hình thức</span>
                    <strong>{service.submissionType}</strong>
                  </div>
                </div>
              </div>

              <div className="summary-docs">
                <h3>Hồ sơ cần chuẩn bị</h3>
                <ul>
                  {service.requiredDocs?.slice(0, 4).map((doc, index) => (
                    <li key={`${doc}-${index}`}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
